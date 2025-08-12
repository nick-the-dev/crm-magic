import { MyContext } from '../index'

export async function helpCommand(ctx: MyContext) {
  const helpText = `
📚 *Available Commands*

*Task Management*
/tasks - Create Monday.com tasks with guided flow

*System Control*
/status - Check system and workflow status
/deploy - Deploy applications
/webhook \[name\] - Trigger custom webhooks

*Utility*
/help - Show this help message
/start - Welcome message

*Tips:*
• Type "skip" to skip optional fields
• Type "cancel" to stop any conversation
• Your session stays active for 30 days

_Remote Control Bot v1.0_
  `
  
  await ctx.reply(helpText, { parse_mode: 'Markdown' })
}