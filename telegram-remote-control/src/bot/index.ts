import { Bot, Context, SessionFlavor, session } from 'grammy'
import { conversations, createConversation, type ConversationFlavor } from '@grammyjs/conversations'
import env from '@/helpers/env'
import { authMiddleware } from './middleware/auth'
import { commandLogger } from './middleware/logger'
import { startCommand } from './commands/start'
import { helpCommand } from './commands/help'
import { tasksConversation } from './conversations/tasks'
import { statusCommand } from './commands/status'
import { deployCommand } from './commands/deploy'
import { webhookCommand } from './commands/webhook'

export interface SessionData {
  userId?: string
  isAuthenticated: boolean
  awaitingPassword: boolean
}

export type MyContext = Context & SessionFlavor<SessionData> & ConversationFlavor<Context>

export const bot = new Bot<MyContext>(env.TELEGRAM_BOT_TOKEN)

bot.use(session({
  initial: (): SessionData => ({
    isAuthenticated: false,
    awaitingPassword: false
  })
}))

bot.use(conversations())

bot.use(createConversation(tasksConversation))

bot.catch((err) => {
  console.error('Bot error:', err)
})

bot.use(commandLogger)

bot.command('start', startCommand)
bot.command('help', helpCommand)

bot.use(authMiddleware)

bot.command('tasks', async (ctx: any) => {
  await ctx.conversation.enter('tasksConversation')
})
bot.command('status', statusCommand)
bot.command('deploy', deployCommand)
bot.command('webhook', webhookCommand)

bot.on('message', async (ctx) => {
  if (ctx.session.awaitingPassword) {
    return
  }
  
  await ctx.reply(
    "I don't understand that command. Use /help to see available commands."
  )
})