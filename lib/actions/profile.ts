'use server'

import { revalidatePath } from 'next/cache'
import { getServerClient, requireUser } from '@/lib/pocketbase/server'
import { fieldErrors, profileSchema, type FormState } from '@/lib/validation'

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState & { saved?: boolean }> {
  const user = await requireUser()
  const raw = {
    name: formData.get('name') ?? '',
    bio: formData.get('bio') ?? '',
    avatar: formData.get('avatar') ?? undefined,
  }
  const input = profileSchema.safeParse(raw)
  const values = { name: String(raw.name), bio: String(raw.bio) }
  if (!input.success) return { fieldErrors: fieldErrors(input.error), values }

  const { avatar, ...fields } = input.data
  const pb = await getServerClient()
  await pb.collection('users').update(user.id, avatar ? { ...fields, avatar } : fields)

  revalidatePath('/', 'layout')
  return { saved: true, values }
}
