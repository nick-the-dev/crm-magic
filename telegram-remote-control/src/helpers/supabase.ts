import { createClient } from '@supabase/supabase-js'
import env from './env'

export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export interface TelegramUser {
  id: string
  telegram_id: number
  username?: string
  password_hash: string
  is_authenticated: boolean
  last_auth_at?: string
  created_at: string
  updated_at: string
}

export interface TelegramSession {
  id: string
  user_id: string
  telegram_chat_id: number
  expires_at: string
  created_at: string
}

export interface CommandState {
  id: string
  user_id: string
  telegram_chat_id: number
  command: string
  current_step?: string
  collected_data: Record<string, any>
  completed: boolean
  created_at: string
  updated_at: string
}

export interface CommandLog {
  id: string
  user_id: string
  command: string
  parameters?: Record<string, any>
  result?: Record<string, any>
  success: boolean
  created_at: string
}

export interface AppIntegration {
  id: string
  name: string
  webhook_url?: string
  config: Record<string, any>
  enabled: boolean
  created_at: string
  updated_at: string
}