import { MyContext } from '../index'
import { supabase } from '@/helpers/supabase'
import axios from 'axios'
import env from '@/helpers/env'

export async function statusCommand(ctx: MyContext) {
  await ctx.reply('🔍 Checking system status...')
  
  const statuses = []
  
  try {
    const { count: sessionCount } = await supabase
      .from('telegram_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('expires_at', new Date().toISOString())
    
    statuses.push(`✅ Database: Connected (${sessionCount || 0} active sessions)`)
  } catch (error) {
    statuses.push('❌ Database: Connection failed')
  }

  try {
    const webhookUrl = `${env.N8N_WEBHOOK_BASE}/webhook/test`
    const response = await axios.get(webhookUrl, { timeout: 5000 })
    if (response.status === 200 || response.status === 404) {
      statuses.push('✅ n8n: Reachable')
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      statuses.push('✅ n8n: Reachable')
    } else {
      statuses.push('⚠️ n8n: Unreachable (workflows may still work)')
    }
  }

  const { data: recentCommands } = await supabase
    .from('command_logs')
    .select('command, created_at, success')
    .eq('user_id', ctx.session.userId!)
    .order('created_at', { ascending: false })
    .limit(5)

  let statusMessage = '*System Status*\n\n'
  statusMessage += statuses.join('\n')
  
  if (recentCommands && recentCommands.length > 0) {
    statusMessage += '\n\n*Recent Commands:*\n'
    recentCommands.forEach(cmd => {
      const time = new Date(cmd.created_at).toLocaleTimeString()
      const icon = cmd.success ? '✅' : '❌'
      statusMessage += `${icon} ${cmd.command} - ${time}\n`
    })
  }

  const { data: lastTask } = await supabase
    .from('command_states')
    .select('*')
    .eq('user_id', ctx.session.userId!)
    .eq('command', '/tasks')
    .eq('completed', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (lastTask) {
    const taskData = lastTask.collected_data as any
    statusMessage += '\n*Last Task Creation:*\n'
    statusMessage += `Project: ${taskData.projectDescription?.substring(0, 50)}...\n`
    statusMessage += `Board: ${taskData.boardId}\n`
    statusMessage += `Time: ${new Date(lastTask.created_at).toLocaleString()}`
  }

  await ctx.reply(statusMessage, { parse_mode: 'Markdown' })
}