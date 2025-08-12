import { NextFunction } from 'grammy'
import bcrypt from 'bcryptjs'
import { MyContext } from '../index'
import { supabase } from '@/helpers/supabase'
import env from '@/helpers/env'

export async function authMiddleware(ctx: MyContext, next: NextFunction) {
  const telegramId = ctx.from?.id
  
  if (!telegramId) {
    await ctx.reply('❌ Unable to identify user')
    return
  }

  const chatId = ctx.chat?.id
  if (!chatId) {
    return
  }

  // Always check database for valid session - never trust memory alone
  const { data: session } = await supabase
    .from('telegram_sessions')
    .select('*, telegram_users!inner(*)')
    .eq('telegram_chat_id', chatId)
    .gte('expires_at', new Date().toISOString())
    .single()

  if (session) {
    // Valid session found in database
    ctx.session.userId = session.user_id
    ctx.session.isAuthenticated = true
    return next()
  }

  // No valid session in database, clear memory session
  ctx.session.isAuthenticated = false
  delete ctx.session.userId

  const { data: user } = await supabase
    .from('telegram_users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single()

  if (!user) {
    await ctx.reply(
      '❌ You are not authorized to use this bot.\n' +
      'Please contact the administrator to get access.'
    )
    return
  }

  // User exists but no valid session - need to authenticate
  if (true) {  // Always require auth when no database session
    if (ctx.session.awaitingPassword) {
      const password = ctx.message?.text
      
      if (!password) {
        await ctx.reply('Please enter your password:')
        return
      }

      const isValid = await bcrypt.compare(password, user.password_hash)
      
      if (!isValid) {
        await ctx.reply('❌ Invalid password. Please try again:')
        return
      }

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + env.SESSION_DURATION_DAYS)

      const { data: newSession, error } = await supabase
        .from('telegram_sessions')
        .insert({
          user_id: user.id,
          telegram_chat_id: chatId,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Session creation error:', error)
        await ctx.reply('❌ Failed to create session. Please try again.')
        return
      }

      await supabase
        .from('telegram_users')
        .update({ 
          is_authenticated: true,
          last_auth_at: new Date().toISOString()
        })
        .eq('id', user.id)

      ctx.session.userId = user.id
      ctx.session.isAuthenticated = true
      ctx.session.awaitingPassword = false

      await ctx.reply(
        `✅ Welcome back, ${user.username || 'User'}!\n\n` +
        'You are now authenticated for the next 30 days.\n' +
        'Use /help to see available commands.'
      )
      
      return next()
    } else {
      ctx.session.awaitingPassword = true
      await ctx.reply(
        '🔐 Authentication required.\n' +
        'Please enter your password:'
      )
      return
    }
  }

  return next()
}