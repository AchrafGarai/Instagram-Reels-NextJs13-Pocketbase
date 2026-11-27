import 'server-only'

import PocketBase from 'pocketbase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { cache } from 'react'
import { toProfile } from './mappers'
import type { Profile, UserRecord } from './types'

const AUTH_COOKIE = 'pb_auth'
const AUTH_MAX_AGE = 60 * 60 * 24 * 7 // matches PocketBase's default token duration

const POCKETBASE_URL = process.env.POCKETBASE_URL ?? 'http://127.0.0.1:8090'

const HEALTH_TIMEOUT_MS = 1500
const HEALTH_TTL_MS = 30_000
let lastHealthCheck: { at: number; ok: boolean } | null = null

/**
 * True when the app should serve the static demo data instead of PocketBase:
 * either `DEMO_MODE=true`, or PocketBase doesn't answer its health check (for
 * example on a preview deployment without a backend). The result is cached
 * for 30 seconds so an offline backend costs one short timeout, not one per
 * request.
 */
export const isDemoMode = cache(async () => {
  if (process.env.DEMO_MODE === 'true') return true

  // Render at request time: the check reads the clock and the network.
  await connection()
  const now = performance.now()
  if (lastHealthCheck && now - lastHealthCheck.at < HEALTH_TTL_MS) return !lastHealthCheck.ok

  let ok = false
  try {
    const response = await fetch(new URL('/api/health', POCKETBASE_URL), {
      signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
      cache: 'no-store',
    })
    ok = response.ok
  } catch {
    ok = false
  }
  lastHealthCheck = { at: now, ok }
  return !ok
})

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

  // Demo mode has no accounts; skip the round trip to an offline backend.
  if (token && !(await isDemoMode())) {
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
