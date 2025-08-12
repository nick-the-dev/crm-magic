import { sign as signBase, verify as verifyBase } from 'jsonwebtoken'
import env from '@/helpers/env'

interface UserPayload {
  id: string
}

export function sign(payload: UserPayload) {
  return signBase(payload, env.JWT_SECRET)
}

export function verify(token: string) {
  return verifyBase(token, env.JWT_SECRET) as UserPayload
}
