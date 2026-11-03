import 'server-only'
import Common from '@/repository/server/common'
import { executeRequestAction } from '../_util'

const EXPIRES_AT = 3600_000
type AuthCache = {
  key: string
  expiresAt: number
}

const global = globalThis as typeof globalThis & {
  authCache?: AuthCache
}

export async function getTrialToken(): Promise<string> {
  const cached = global.authCache

  if (cached && cached.key && Date.now() < cached.expiresAt) {
    return cached.key
  }

  try {
    const key = await issueAuthKey()
    global.authCache = {
      key,
      expiresAt: Date.now() + EXPIRES_AT,
    }
    return key
  } catch (error) {
    console.error(error)
    return ''
  }
}

async function issueAuthKey(): Promise<string> {
  const [payload, status, error] = await executeRequestAction(
    Common.getTrialAccessToken(),
  )
  if (status.status < 200 && status.status >= 300) {
    throw new Error('Failed to issue auth key (status not 200)')
  }
  if (error) {
    throw new Error('Failed to issue auth key (executeRequestAction failed)')
  }
  if (!payload.accessToken) {
    throw new Error('Failed to issue auth key (accessToken is empty)')
  }
  return payload.accessToken
}
