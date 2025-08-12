import { MyContext } from '../index'

export async function startCommand(ctx: MyContext) {
  const userId = ctx.from?.id
  const username = ctx.from?.username || ctx.from?.first_name || 'User'
  
  console.log(`📱 /start command from:`)
  console.log(`   Telegram ID: ${userId}`)
  console.log(`   Username: @${username}`)
  
  await ctx.reply(
    `👋 Welcome to the Remote Control Bot, ${username}!\n\n` +
    'This bot allows you to control various applications and workflows.\n\n' +
    'To get started, you\'ll need to authenticate.\n' +
    'Use any command (like /help) to begin the authentication process.'
  )
}