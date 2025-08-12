import { MyContext } from '../index'
import { supabase } from '@/helpers/supabase'
import axios from 'axios'

export async function webhookCommand(ctx: MyContext) {
  const args = ctx.message?.text?.split(' ').slice(1).join(' ')
  
  if (!args) {
    const { data: integrations } = await supabase
      .from('app_integrations')
      .select('name, webhook_url')
      .eq('enabled', true)
    
    let message = '🔗 *Available Webhooks*\n\n'
    
    if (integrations && integrations.length > 0) {
      integrations.forEach(app => {
        message += `• /webhook ${app.name}\n`
      })
    } else {
      message += 'No webhooks configured yet.\n'
    }
    
    message += '\nUsage: `/webhook [name]`'
    
    await ctx.reply(message, { parse_mode: 'Markdown' })
    return
  }

  const { data: integration } = await supabase
    .from('app_integrations')
    .select('*')
    .eq('name', args)
    .eq('enabled', true)
    .single()
  
  if (!integration || !integration.webhook_url) {
    await ctx.reply(`❌ Webhook "${args}" not found.`)
    return
  }

  await ctx.reply(`🔄 Triggering webhook: ${args}...`)
  
  try {
    const response = await axios.post(
      integration.webhook_url,
      integration.config || {},
      { timeout: 30000 }
    )
    
    if (ctx.session.userId) {
      await supabase
        .from('command_logs')
        .insert({
          user_id: ctx.session.userId,
          command: '/webhook',
          parameters: { webhook: args },
          result: response.data,
          success: true
        })
    }
    
    await ctx.reply(
      `✅ Webhook triggered successfully!\n\n` +
      `Response: ${JSON.stringify(response.data, null, 2).substring(0, 500)}`
    )
  } catch (error) {
    if (ctx.session.userId) {
      await supabase
        .from('command_logs')
        .insert({
          user_id: ctx.session.userId,
          command: '/webhook',
          parameters: { webhook: args },
          result: { error: error instanceof Error ? error.message : 'Unknown error' },
          success: false
        })
    }
    
    await ctx.reply(
      `❌ Failed to trigger webhook.\n` +
      `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}