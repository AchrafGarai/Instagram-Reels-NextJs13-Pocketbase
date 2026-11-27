'use client'

import { useActionState, useEffect, useState } from 'react'
import Image from 'next/image'
import { Avatar } from '@/components/ui/avatar'
import { Input, Textarea } from '@/components/ui/field'
import { SubmitButton } from '@/components/ui/submit-button'
import { updateProfile } from '@/lib/actions/profile'
import type { Profile } from '@/lib/pocketbase/types'
import { IMAGE_TYPES } from '@/lib/validation'

export function EditProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(updateProfile, {})
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview])

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl text-sm font-medium text-accent focus-within:ring-2 focus-within:ring-accent">
        {preview ? (
          <Image
            src={preview}
            alt=""
            width={112}
            height={112}
            unoptimized
            className="size-28 rounded-full object-cover"
          />
        ) : (
          <Avatar user={profile} size={112} />
        )}
        Change photo
        <input
          type="file"
          name="avatar"
          accept={IMAGE_TYPES.join(',')}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            setPreview(file ? URL.createObjectURL(file) : null)
          }}
        />
      </label>
      {state.fieldErrors?.avatar && (
        <p className="text-center text-sm text-red-600">{state.fieldErrors.avatar[0]}</p>
      )}

      <Input
        label="Name"
        name="name"
        required
        maxLength={60}
        defaultValue={state.values?.name ?? profile.name}
        errors={state.fieldErrors?.name}
      />
      <Textarea
        label="Bio"
        name="bio"
        maxLength={160}
        defaultValue={state.values?.bio ?? profile.bio}
        errors={state.fieldErrors?.bio}
        hint="Up to 160 characters."
      />

      <div className="flex items-center gap-4">
        <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
        {state.saved && (
          <p role="status" className="text-sm text-zinc-600">
            Saved.
          </p>
        )}
      </div>
    </form>
  )
}
