import * as dotenv from 'dotenv'
import { cleanEnv, num, str } from 'envalid'
import { cwd } from 'process'
import { resolve } from 'path'

dotenv.config({ path: resolve(cwd(), '.env') })

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  TELEGRAM_BOT_TOKEN: str(),
  SUPABASE_URL: str(),
  SUPABASE_SERVICE_KEY: str(),
  N8N_WEBHOOK_BASE: str(),
  MONDAY_API_TOKEN: str({ default: '' }),
  MONDAY_DEFAULT_BOARD_ID: str({ default: '9744010967' }),
  JWT_SECRET: str(),
  SESSION_DURATION_DAYS: num({ default: 30 }),
  PORT: num({ default: 1337 }),
  NODE_ENV: str({ default: 'development' }),
  SENTRY_DSN: str({ default: '' }),
})
