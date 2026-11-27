'use client'

import { useActionState, useEffect, useState } from 'react'
import { UploadIcon } from '@radix-ui/react-icons'
import { Textarea } from '@/components/ui/field'
import { FormError } from '@/components/ui/form-error'
import { SubmitButton } from '@/components/ui/submit-button'
import { createPost } from '@/lib/actions/posts'
import { VIDEO_TYPES, type FormState } from '@/lib/validation'

export function CreatePostForm() {
  const [preview, setPreview] = useState<string | null>(null)
  const [state, formAction] = useActionState(async (prev: FormState, formData: FormData) => {
    const result = await createPost(prev, formData)
    // React resets the form after an action, which empties the file input.
    setPreview(null)
    return result
  }, {})

  // Release the object URL when it is replaced or the form unmounts.
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview])

  return (
    <form action={formAction} className="grid gap-6 sm:grid-cols-2">
      <label className="relative flex aspect-[9/16] cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-600 focus-within:ring-2 focus-within:ring-accent">
        {preview ? (
          <video src={preview} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline />
        ) : (
          <>
            <UploadIcon width={28} height={28} />
            <span>Choose a video</span>
            <span className="text-xs text-zinc-400">MP4, WebM or MOV, up to 50 MB</span>
          </>
        )}
        <input
          type="file"
          name="video"
          accept={VIDEO_TYPES.join(',')}
          required
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            setPreview(file ? URL.createObjectURL(file) : null)
          }}
        />
      </label>

      <div className="flex flex-col gap-6">
        <FormError message={state.fieldErrors?.video?.[0]} />
        <Textarea
          label="Caption"
          name="caption"
          maxLength={280}
          placeholder="Say something about this reel"
          defaultValue={state.values?.caption}
          errors={state.fieldErrors?.caption}
        />
        <SubmitButton pendingLabel="Uploading…">Share reel</SubmitButton>
      </div>
    </form>
  )
}
