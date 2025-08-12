import { Conversation } from '@grammyjs/conversations'
import { MyContext } from '../index'
import { supabase } from '@/helpers/supabase'
import axios from 'axios'
import env from '@/helpers/env'

export async function tasksConversation(
  conversation: Conversation<MyContext>,
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
    `Which board should I use?\n` +
    `Default: ${env.MONDAY_DEFAULT_BOARD_ID}\n` +
    `(Press Enter or type board ID)`
  )
  
  const boardResponse = await conversation.waitFor(':text')
  const boardText = boardResponse.message?.text?.toLowerCase()
  
  if (boardText === 'cancel') {
    await ctx.reply('❌ Task creation cancelled.')
    return
  }
  
  collectedData.boardId = 
    boardText === '' || boardText === 'skip' 
      ? env.MONDAY_DEFAULT_BOARD_ID 
      : boardResponse.message?.text

  await ctx.reply(
    'What should I name the group?\n' +
    '(Type "skip" for auto-generated name)'
  )
  
  const groupResponse = await conversation.waitFor(':text')
  const groupText = groupResponse.message?.text?.toLowerCase()
  
  if (groupText === 'cancel') {
    await ctx.reply('❌ Task creation cancelled.')
    return
  }
  
  if (groupText !== 'skip') {
    collectedData.groupName = groupResponse.message?.text
  }

  await ctx.reply(
    'Who should be assigned? (email addresses)\n' +
    'Separate multiple emails with commas\n' +
    '(Type "skip" for no assignment)'
  )
  
  const emailResponse = await conversation.waitFor(':text')
  const emailText = emailResponse.message?.text?.toLowerCase()
  
  if (emailText === 'cancel') {
    await ctx.reply('❌ Task creation cancelled.')
    return
  }
  
  if (emailText !== 'skip') {
    collectedData.assigneeEmails = emailResponse.message?.text
  }

  await ctx.reply(
    'How many weekly hours? (20-60)\n' +
    'Default: 40 hours'
  )
  
  const hoursResponse = await conversation.waitFor(':text')
  const hoursText = hoursResponse.message?.text?.toLowerCase()
  
  if (hoursText === 'cancel') {
    await ctx.reply('❌ Task creation cancelled.')
    return
  }
  
  if (hoursText === 'skip' || hoursText === '') {
    collectedData.weeklyHours = 40
  } else {
    const hours = parseInt(hoursResponse.message?.text || '40')
    if (hours < 20 || hours > 60) {
      await ctx.reply('⚠️ Hours must be between 20 and 60. Using default: 40')
      collectedData.weeklyHours = 40
    } else {
      collectedData.weeklyHours = hours
    }
  }

  await ctx.reply(
    'Which provinces/areas? (for task distribution)\n' +
    'Example: Ontario, Quebec, British Columbia\n' +
    '(Type "skip" for random distribution)'
  )
  
  const provincesResponse = await conversation.waitFor(':text')
  const provincesText = provincesResponse.message?.text?.toLowerCase()
  
  if (provincesText === 'cancel') {
    await ctx.reply('❌ Task creation cancelled.')
    return
  }
  
  if (provincesText !== 'skip') {
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
          command: '/tasks',
          collected_data: collectedData,
          completed: true
        })

      await supabase
        .from('command_logs')
        .insert({
          user_id: ctx.session.userId,
          command: '/tasks',
          parameters: collectedData,
          result: response.data,
          success: true
        })
    }

    const result = response.data
    await ctx.reply(
      `✅ *Success!*\n\n` +
      `Created ${result.tasksCreated || 'multiple'} tasks\n` +
      `Board: ${collectedData.boardId}\n` +
      `${collectedData.groupName ? `Group: ${collectedData.groupName}\n` : ''}` +
      `${collectedData.assigneeEmails ? `Assigned to: ${collectedData.assigneeEmails}\n` : ''}` +
      `\nUse /status to check workflow execution details.`,
      { parse_mode: 'Markdown' }
    )
  } catch (error) {
    console.error('Task creation error:', error)
    
    if (ctx.session.userId) {
      await supabase
        .from('command_logs')
        .insert({
          user_id: ctx.session.userId,
          command: '/tasks',
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