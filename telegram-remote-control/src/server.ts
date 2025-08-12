import 'module-alias/register'
import 'source-map-support/register'

import runApp from '@/helpers/runApp'
import { bot } from '@/bot'
import { supabase } from '@/helpers/supabase'

void (async () => {
  console.log('🚀 Starting Telegram Remote Control Bot...')
  
  try {
    const { data, error } = await supabase
      .from('telegram_users')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('❌ Failed to connect to Supabase:', error)
      process.exit(1)
    }
    
    console.log('✅ Supabase connected')
    
    await runApp()
    
    bot.start({
      onStart: () => console.log('✅ Bot is running!'),
    })
  } catch (error) {
    console.error('❌ Failed to start:', error)
    process.exit(1)
  }
})()
