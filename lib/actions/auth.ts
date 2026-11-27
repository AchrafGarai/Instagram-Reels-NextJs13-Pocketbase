'use server'

import { ClientResponseError } from 'pocketbase'
import { redirect } from 'next/navigation'
import {
  clearAuthCookie,
  createClient,
  isDemoMode,
  setAuthCookie,
} from '@/lib/pocketbase/server'
import { fieldErrors, loginSchema, signupSchema, type FormState } from '@/lib/validation'

const DEMO_ERROR =
  'The backend is offline, so this is a read-only demo. Accounts, likes and comments are disabled.'

/** Only allow redirects back into this app, never to another origin. */
function safeRedirect(target: FormDataEntryValue | null) {
  return typeof target === 'string' && target.startsWith('/') && !target.startsWith('//')
    ? target
    : '/'
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const input = loginSchema.safeParse(Object.fromEntries(formData))
  const values = { identity: String(formData.get('identity') ?? '') }
  if (!input.success) return { fieldErrors: fieldErrors(input.error), values }
  if (await isDemoMode()) return { error: DEMO_ERROR, values }

  const pb = createClient()
  try {
    await pb.collection('users').authWithPassword(input.data.identity, input.data.password)
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 400) {
      return { error: 'That email/username and password don’t match.', values }
    }
    throw error
  }

  await setAuthCookie(pb.authStore.token)
  redirect(safeRedirect(formData.get('next')))
}

export async function signup(_prev: FormState, formData: FormData): Promise<FormState> {
  const input = signupSchema.safeParse(Object.fromEntries(formData))
  const values = {
    name: String(formData.get('name') ?? ''),
    username: String(formData.get('username') ?? ''),
    email: String(formData.get('email') ?? ''),
  }
  if (!input.success) return { fieldErrors: fieldErrors(input.error), values }
  if (await isDemoMode()) return { error: DEMO_ERROR, values }

  const pb = createClient()
  try {
    await pb.collection('users').create(input.data)
    await pb.collection('users').authWithPassword(input.data.email, input.data.password)
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 400) {
      // Surface PocketBase's per-field validation (e.g. a taken username or email).
      const data = (error.response?.data ?? {}) as Record<string, { code: string; message: string }>
      const errors = Object.fromEntries(
        Object.entries(data).map(([field, detail]) => [
          field,
          [detail.code === 'validation_not_unique' ? 'This is already taken.' : detail.message],
        ]),
      )
      return { error: 'Please fix the highlighted fields.', fieldErrors: errors, values }
    }
    throw error
  }

  await setAuthCookie(pb.authStore.token)
  redirect('/')
}

export async function logout() {
  await clearAuthCookie()
  redirect('/login')
}
