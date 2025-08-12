#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env') })

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function addUser() {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.log('Usage: yarn add-user <telegram_id> <username> <password>')
    console.log('Example: yarn add-user 123456789 "JohnDoe" "mySecurePassword123"')
    process.exit(1)
  }
  
  const [telegramId, username, password] = args
  
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    
    const { data, error } = await supabase
      .from('telegram_users')
      .upsert({
        telegram_id: parseInt(telegramId),
        username,
        password_hash: passwordHash,
        is_authenticated: false
      })
      .select()
      .single()
    
    if (error) {
      console.error('❌ Failed to add user:', error.message)
      process.exit(1)
    }
    
    console.log('✅ User added successfully!')
    console.log('User ID:', data.id)
    console.log('Telegram ID:', data.telegram_id)
    console.log('Username:', data.username)
    console.log('\nThe user can now authenticate with the bot using the password.')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

addUser().then(() => process.exit(0))