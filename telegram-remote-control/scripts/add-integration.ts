#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
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

async function addIntegration() {
  const args = process.argv.slice(2)
  
  if (args.length < 2) {
    console.log('Usage: yarn add-integration <name> <webhook_url> [config_json]')
    console.log('Example: yarn add-integration "deploy-api" "https://api.example.com/deploy" \'{"key": "value"}\'')
    process.exit(1)
  }
  
  const [name, webhookUrl, configJson] = args
  
  try {
    let config = {}
    if (configJson) {
      try {
        config = JSON.parse(configJson)
      } catch (e) {
        console.error('❌ Invalid JSON for config:', e)
        process.exit(1)
      }
    }
    
    const { data, error } = await supabase
      .from('app_integrations')
      .upsert({
        name,
        webhook_url: webhookUrl,
        config,
        enabled: true
      })
      .select()
      .single()
    
    if (error) {
      console.error('❌ Failed to add integration:', error.message)
      process.exit(1)
    }
    
    console.log('✅ Integration added successfully!')
    console.log('Name:', data.name)
    console.log('Webhook URL:', data.webhook_url)
    console.log('Config:', JSON.stringify(data.config, null, 2))
    console.log('\nUsers can now trigger this with: /webhook', name)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

addIntegration().then(() => process.exit(0))