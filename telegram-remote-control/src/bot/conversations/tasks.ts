import { type Conversation } from '@grammyjs/conversations'
import { type MyContext } from '../index'
import { supabase } from '@/helpers/supabase'
import axios from 'axios'
import env from '@/helpers/env'

export async function tasksConversation(
  conversation: Conversation<MyContext, MyContext>,
  ctx: MyContext
) {
  await ctx.reply('📝 Let\'s create some Monday.com tasks!\n\nPlease describe your project:')
  
  const projectDescription = await conversation.waitFor(':text')
  
  if (projectDescription.message?.text?.toLowerCase() === 'cancel') {
    await ctx.reply('❌ Task creation cancelled.')
    return
  }
  
  const collectedData: any = {
    projectDescription: projectDescription.message?.text
  }

  await ctx.reply(
    `Which board should I use?\n\n` +
    `📋 Current default: ${env.MONDAY_DEFAULT_BOARD_ID}\n` +
    `➡️ Send - to use default\n` +
    `➡️ Or enter a custom board ID`
  )
  
  const boardResponse = await conversation.waitFor(':text')
  const boardText = boardResponse.message?.text?.trim()
  
  if (boardText?.toLowerCase() === 'cancel') {
    await ctx.reply('❌ Task creation cancelled.')
    return
  }
  
  collectedData.boardId = 
    boardText === '-' || boardText === '' 
      ? env.MONDAY_DEFAULT_BOARD_ID 
      : boardResponse.message?.text

  await ctx.reply(
    'What should I name the group?\n\n' +
    '🏷️ Default: Auto-generated based on project\n' +
    '➡️ Send - for auto-generated name\n' +
    '➡️ Or enter a custom group name'
  )
  
  const groupResponse = await conversation.waitFor(':text')
  const groupText = groupResponse.message?.text?.trim()
  
  if (groupText?.toLowerCase() === 'cancel') {
    await ctx.reply('❌ Task creation cancelled.')
    return
  }
  
  if (groupText !== '-' && groupText !== '') {
    collectedData.groupName = groupResponse.message?.text
  }

  await ctx.reply(
    'Who should be assigned?\n\n' +
    '📧 Enter email addresses (comma-separated)\n' +
    '➡️ Send - for no assignment\n' +
    '➡️ Example: user1@example.com, user2@example.com'
  )
  
  const emailResponse = await conversation.waitFor(':text')
  const emailText = emailResponse.message?.text?.trim()
  
  if (emailText?.toLowerCase() === 'cancel') {
    await ctx.reply('❌ Task creation cancelled.')
    return
  }
  
  if (emailText !== '-' && emailText !== '') {
    collectedData.assigneeEmails = emailResponse.message?.text
  }

  await ctx.reply(
    'How many weekly hours?\n\n' +
    '⏰ Default: 40 hours\n' +
    '📊 Valid range: 20-60 hours\n' +
    '➡️ Send - for default (40 hours)\n' +
    '➡️ Or enter a number between 20-60'
  )
  
  const hoursResponse = await conversation.waitFor(':text')
  const hoursText = hoursResponse.message?.text?.trim()
  
  if (hoursText?.toLowerCase() === 'cancel') {
    await ctx.reply('❌ Task creation cancelled.')
    return
  }
  
  if (hoursText === '-' || hoursText === '') {
    collectedData.weeklyHours = 40
  } else {
    const hours = parseInt(hoursResponse.message?.text || '40')
    if (isNaN(hours) || hours < 20 || hours > 60) {
      await ctx.reply('⚠️ Invalid input. Using default: 40 hours')
      collectedData.weeklyHours = 40
    } else {
      collectedData.weeklyHours = hours
    }
  }

  await ctx.reply(
    'Which provinces/areas for task distribution?\n\n' +
    '🗺️ Default: Random distribution\n' +
    '📍 Example: Ontario, Quebec, British Columbia\n' +
    '➡️ Send - for random distribution\n' +
    '➡️ Or enter provinces (comma-separated)'
  )
  
  const provincesResponse = await conversation.waitFor(':text')
  const provincesText = provincesResponse.message?.text?.trim()
  
  if (provincesText?.toLowerCase() === 'cancel') {
    await ctx.reply('❌ Task creation cancelled.')
    return
  }
  
  if (provincesText !== '-' && provincesText !== '') {
    collectedData.provinces = provincesResponse.message?.text
  }

  await ctx.reply('🚀 Creating tasks...')

  try {
    const webhookUrl = `${env.N8N_WEBHOOK_BASE}/webhook/monday-tasks`
    
    const response = await axios.post(webhookUrl, collectedData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    })

    if (ctx.session.userId) {
      await supabase
        .from('command_states')
        .insert({
          user_id: ctx.session.userId,
          telegram_chat_id: ctx.chat?.id,
          command: '/generate_tasks',
          collected_data: collectedData,
          completed: true
        })

      await supabase
        .from('command_logs')
        .insert({
          user_id: ctx.session.userId,
          command: '/generate_tasks',
          parameters: collectedData,
          result: response.data,
          success: true
        })
    }

    const result = response.data
    
    // Build task list display
    let taskListDisplay = ''
    if (result.tasks && Array.isArray(result.tasks)) {
      taskListDisplay = '\n\n📋 *Tasks Created:*\n'
      result.tasks.forEach((task: any, index: number) => {
        const priority = task.priority ? ` [${task.priority.toUpperCase()}]` : ''
        const hours = task.hoursAllocated ? ` (${task.hoursAllocated}h)` : ''
        const assignee = task.assignee && task.assignee !== 'Unassigned' ? ` → ${task.assignee}` : ''
        const amount = task.amount ? ` $${task.amount}` : ''
        const area = task.area ? ` 📍${task.area}` : ''
        
        taskListDisplay += `\n${index + 1}. *${task.title}*${priority}${hours}${amount}${area}${assignee}`
        
        if (task.startDate && task.endDate) {
          const startTime = task.startDate.split(' ')[1] || ''
          const endTime = task.endDate.split(' ')[1] || ''
          if (startTime && endTime) {
            taskListDisplay += `\n   ⏰ ${startTime} - ${endTime} EST`
          }
        }
      })
      
      // Calculate total hours
      const totalHours = result.tasks.reduce((sum: number, task: any) => sum + (task.hoursAllocated || 0), 0)
      const totalAmount = result.tasks.reduce((sum: number, task: any) => sum + (task.amount || 0), 0)
      
      taskListDisplay += `\n\n📊 *Summary:*`
      taskListDisplay += `\n• Total Tasks: ${result.tasksCreated}`
      taskListDisplay += `\n• Total Hours: ${totalHours}/${collectedData.weeklyHours}`
      if (totalAmount > 0) {
        taskListDisplay += `\n• Total Amount: $${totalAmount}`
      }
    }
    
    await ctx.reply(
      `✅ *Task Generation Complete!*\n\n` +
      `Board: ${collectedData.boardId}\n` +
      `${collectedData.groupName ? `Group: ${collectedData.groupName}\n` : ''}` +
      `${collectedData.assigneeEmails ? `Assigned to: ${collectedData.assigneeEmails}\n` : ''}` +
      taskListDisplay +
      `\n\n✨ All tasks have been successfully created in Monday.com!`,
      { parse_mode: 'Markdown' }
    )
  } catch (error) {
    console.error('Task creation error:', error)
    
    if (ctx.session.userId) {
      await supabase
        .from('command_logs')
        .insert({
          user_id: ctx.session.userId,
          command: '/generate_tasks',
          parameters: collectedData,
          result: { error: error instanceof Error ? error.message : 'Unknown error' },
          success: false
        })
    }

    await ctx.reply(
      '❌ Failed to create tasks.\n' +
      'Error: ' + (error instanceof Error ? error.message : 'Unknown error') +
      '\n\nPlease check your configuration and try again.'
    )
  }
}