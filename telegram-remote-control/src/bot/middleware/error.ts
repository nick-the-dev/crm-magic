import { ErrorHandler } from 'grammy'
import { MyContext } from '../index'

export const errorHandler: ErrorHandler<MyContext> = async (err) => {
  const { ctx, error } = err
  
  console.error(`Error while handling update ${ctx.update.update_id}:`, error)
  
  try {
    await ctx.reply(
      '❌ An error occurred while processing your request.\n' +
      'Please try again or contact support if the issue persists.'
    )
  } catch (replyError) {
    console.error('Failed to send error message:', replyError)
  }
}