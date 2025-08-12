import { NextFunction } from 'grammy'
import { MyContext } from '../index'
import { supabase } from '@/helpers/supabase'

export async function commandLogger(ctx: MyContext, next: NextFunction) {
  const start = Date.now()
  
  try {
    await next()
    
    const duration = Date.now() - start
    
    if (ctx.message?.text?.startsWith('/') && ctx.session.userId) {
      const command = ctx.message.text.split(' ')[0]
      
      await supabase
        .from('command_logs')
        .insert({
          user_id: ctx.session.userId,
          command: command,
          parameters: {
            text: ctx.message.text,
            duration_ms: duration,
            chat_id: ctx.chat?.id
          },
          success: true
        })
    }
  } catch (error) {
    const duration = Date.now() - start
    
    if (ctx.message?.text?.startsWith('/') && ctx.session.userId) {
      const command = ctx.message?.text?.split(' ')[0]
      
      await supabase
        .from('command_logs')
        .insert({
          user_id: ctx.session.userId,
          command: command || 'unknown',
          parameters: {
            text: ctx.message?.text,
            duration_ms: duration,
            chat_id: ctx.chat?.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          },
          success: false
        })
    }
    
    throw error
  }
}