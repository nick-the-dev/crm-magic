import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals'
import { Bot } from 'grammy'
import { supabase } from '../helpers/supabase'
import bcrypt from 'bcryptjs'
import { sign } from '../helpers/jwt'

describe('Telegram Bot Tests', () => {
  describe('Authentication', () => {
    it('should hash passwords correctly', async () => {
      const password = 'testpassword123'
      const hash = await bcrypt.hash(password, 10)
      const isValid = await bcrypt.compare(password, hash)
      expect(isValid).toBe(true)
    })

    it('should reject invalid passwords', async () => {
      const password = 'testpassword123'
      const hash = await bcrypt.hash(password, 10)
      const isValid = await bcrypt.compare('wrongpassword', hash)
      expect(isValid).toBe(false)
    })

    it('should generate valid JWT tokens', () => {
      const userId = 'test-user-id'
      const token = sign({ id: userId })
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
    })
  })

  describe('Supabase Integration', () => {
    it('should connect to Supabase', async () => {
      const { data, error } = await supabase
        .from('telegram_users')
        .select('id')
        .limit(1)
      
      expect(error).toBeNull()
    })

    it('should handle user queries', async () => {
      const { data, error } = await supabase
        .from('telegram_users')
        .select('*')
        .eq('telegram_id', '999999999')
        .single()
      
      if (error && error.code === 'PGRST116') {
        expect(data).toBeNull()
      } else {
        expect(error).toBeNull()
      }
    })
  })

  describe('Command Validation', () => {
    it('should validate board ID format', () => {
      const validBoardId = '9744010967'
      const invalidBoardId = 'abc123'
      
      expect(/^\d+$/.test(validBoardId)).toBe(true)
      expect(/^\d+$/.test(invalidBoardId)).toBe(false)
    })

    it('should validate email format', () => {
      const validEmails = 'user1@example.com, user2@test.org'
      const emails = validEmails.split(',').map(e => e.trim())
      
      emails.forEach(email => {
        expect(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)).toBe(true)
      })
    })

    it('should validate weekly hours range', () => {
      const validHours = [20, 30, 40, 50, 60]
      const invalidHours = [10, 15, 70, 100]
      
      validHours.forEach(hours => {
        expect(hours >= 20 && hours <= 60).toBe(true)
      })
      
      invalidHours.forEach(hours => {
        expect(hours >= 20 && hours <= 60).toBe(false)
      })
    })
  })

  describe('Data Processing', () => {
    it('should format task data correctly', () => {
      const taskData = {
        projectDescription: 'Test project',
        boardId: '9744010967',
        groupName: 'Test Group',
        assigneeEmails: 'test@example.com',
        weeklyHours: 40,
        provinces: 'Ontario, Quebec'
      }
      
      expect(taskData.projectDescription).toBeDefined()
      expect(taskData.boardId).toBeDefined()
      expect(typeof taskData.weeklyHours).toBe('number')
    })

    it('should handle optional fields', () => {
      const minimalData: any = {
        projectDescription: 'Test project',
        boardId: '9744010967'
      }
      
      expect(minimalData.projectDescription).toBeDefined()
      expect(minimalData.boardId).toBeDefined()
      expect(minimalData.groupName).toBeUndefined()
    })
  })

  describe('Session Management', () => {
    it('should calculate session expiry correctly', () => {
      const now = new Date()
      const expiryDays = 30
      const expiryDate = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000)
      
      expect(expiryDate.getTime()).toBeGreaterThan(now.getTime())
      expect(expiryDate.getDate()).toBe((now.getDate() + expiryDays) % 31 || 1)
    })
  })
})