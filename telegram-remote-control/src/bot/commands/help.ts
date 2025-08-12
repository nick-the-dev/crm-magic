import { MyContext } from '../index'

export async function helpCommand(ctx: MyContext) {
  const helpText = `
📚 *Available Commands*

*Task Management*
/generate\\_tasks \\- Create Monday\\.com tasks with AI

*System Control*
/status \\- Check system and workflow status
/deploy \\- Deploy applications
/webhook \\- Trigger custom webhooks

*Utility*
/help \\- Show this help message
/start \\- Welcome message

*Tips:*
• Send \\- \\(dash\\) to use default values
• Type "cancel" to stop any conversation  
• Your session stays active for 30 days

_Remote Control Bot v1\\.0_
  `
  
  await ctx.reply(helpText, { parse_mode: 'MarkdownV2' })
}