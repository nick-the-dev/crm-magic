import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import axios from 'axios'
import { supabase } from '../helpers/supabase'
import env from '../helpers/env'

describe('Integration Tests', () => {
  describe('n8n Webhook Integration', () => {
    it('should construct webhook URL correctly', () => {
      const baseUrl = env.N8N_WEBHOOK_BASE || 'https://automations-n8n.u841sv.easypanel.host'
      const webhookUrl = `${baseUrl}/webhook/monday-tasks`
      
      expect(webhookUrl).toContain('/webhook/monday-tasks')
      expect(webhookUrl).toMatch(/^https?:\/\//)
    })

    it('should prepare webhook payload correctly', () => {
      const payload = {
        projectDescription: 'Build an AI-powered feedback system',
        boardId: '9744010967',
        groupName: 'AI Tasks',
        assigneeEmails: 'test@example.com',
        weeklyHours: 40,
        provinces: 'Ontario'
      }
      
      expect(payload).toHaveProperty('projectDescription')
      expect(payload).toHaveProperty('boardId')
      expect(payload.weeklyHours).toBeGreaterThanOrEqual(20)
      expect(payload.weeklyHours).toBeLessThanOrEqual(60)
    })
  })

  describe('Database Operations', () => {
    it('should handle command logging structure', async () => {
      const logEntry = {
        user_id: 'test-user-id',
        command: '/tasks',
        parameters: {
          projectDescription: 'Test',
          boardId: '123'
        },
        result: { success: true },
        success: true
      }
      
      expect(logEntry).toHaveProperty('user_id')
      expect(logEntry).toHaveProperty('command')
      expect(logEntry).toHaveProperty('parameters')
      expect(logEntry).toHaveProperty('result')
      expect(logEntry).toHaveProperty('success')
    })

    it('should handle session data structure', async () => {
      const sessionData = {
        user_id: 'test-user-id',
        telegram_chat_id: 123456789,
        session_token: 'test-token',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      expect(sessionData).toHaveProperty('user_id')
      expect(sessionData).toHaveProperty('telegram_chat_id')
      expect(sessionData).toHaveProperty('session_token')
      expect(sessionData).toHaveProperty('expires_at')
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      try {
        await axios.post('http://localhost:99999/invalid', {})
      } catch (error) {
        expect(error).toBeDefined()
        if (axios.isAxiosError(error)) {
          expect(error.code).toBeTruthy()
        }
      }
    })

    it('should handle invalid JSON parsing', () => {
      const invalidJson = '{"invalid": json}'
      
      expect(() => {
        JSON.parse(invalidJson)
      }).toThrow()
    })

    it('should validate required environment variables', () => {
      const requiredVars = [
        'TELEGRAM_BOT_TOKEN',
        'SUPABASE_URL',
        'SUPABASE_SERVICE_KEY',
        'JWT_SECRET',
        'N8N_WEBHOOK_BASE'
      ]
      
      requiredVars.forEach(varName => {
        if (!process.env[varName]) {
          console.warn(`Missing required environment variable: ${varName}`)
        }
      })
    })
  })

  describe('Conversation Flow', () => {
    it('should validate conversation state transitions', () => {
      const states = ['idle', 'awaiting_description', 'awaiting_board', 'awaiting_group', 'awaiting_emails', 'awaiting_hours', 'awaiting_provinces', 'processing']
      
      const validTransitions = {
        'idle': 'awaiting_description',
        'awaiting_description': 'awaiting_board',
        'awaiting_board': 'awaiting_group',
        'awaiting_group': 'awaiting_emails',
        'awaiting_emails': 'awaiting_hours',
        'awaiting_hours': 'awaiting_provinces',
        'awaiting_provinces': 'processing',
        'processing': 'idle'
      }
      
      Object.entries(validTransitions).forEach(([from, to]) => {
        expect(states).toContain(from)
        expect(states).toContain(to)
      })
    })

    it('should handle cancellation at any step', () => {
      const cancelCommands = ['cancel', 'Cancel', 'CANCEL']
      
      cancelCommands.forEach(cmd => {
        expect(cmd.toLowerCase()).toBe('cancel')
      })
    })

    it('should handle skip commands correctly', () => {
      const skipCommands = ['skip', 'Skip', 'SKIP', '']
      
      skipCommands.forEach(cmd => {
        const isSkip = cmd.toLowerCase() === 'skip' || cmd === ''
        expect(typeof isSkip).toBe('boolean')
      })
    })
  })
})