import 'server-only'

import PocketBase from 'pocketbase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { toProfile } from './mappers'
import type { Profile, UserRecord } from './types'

const AUTH_COOKIE = 'pb_auth'
const AUTH_MAX_AGE = 60 * 60 * 24 * 7 // matches PocketBase's default token duration

const POCKETBASE_URL = process.env.POCKETBASE_URL ?? 'http://127.0.0.1:8090'

/** A fresh, unauthenticated client. Never share one instance across requests. */
export function createClient() {
  const pb = new PocketBase(POCKETBASE_URL)
  pb.autoCancellation(false)
  return pb
}

/**
 * The PocketBase client for the current request, authenticated as the visitor
 * when they have a valid session.
 *
 * The token in the cookie is only trusted after PocketBase itself confirms it
 * (`authRefresh`), so a hand-crafted cookie never counts as a login. (The SDK's
 * local `isValid` check is skipped: it only decodes the JWT without verifying
 * it, and reads the clock during prerendering.) `cache`
 * scopes the result to a single request, so this runs at most once per render.
 */
export const getServerClient = cache(async () => {
  const pb = createClient()
  const token = (await cookies()).get(AUTH_COOKIE)?.value

  if (token) {
    pb.authStore.save(token, null)
    try {
      // Rejects forged, expired and revoked tokens.
      await pb.collection('users').authRefresh()
    } catch {
      pb.authStore.clear()
    }
  }

  return pb
})

export const getCurrentUser = cache(async (): Promise<Profile | null> => {
  const pb = await getServerClient()
  const record = pb.authStore.record as UserRecord | null
  return record ? toProfile(record) : null
})

/** For pages and actions that need a signed-in user. */
export async function requireUser(): Promise<Profile> {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

/** Only callable from Server Actions and Route Handlers. */
export async function setAuthCookie(token: string) {
  ;(await cookies()).set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_MAX_AGE,
  })
}

export async function clearAuthCookie() {
  ;(await cookies()).delete(AUTH_COOKIE)
}
