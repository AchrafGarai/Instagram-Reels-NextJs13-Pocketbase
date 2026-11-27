'use client'

import { useActionState } from 'react'
import { addComment } from '@/lib/actions/social'
import type { FormState } from '@/lib/validation'
import { SubmitButton } from '@/components/ui/submit-button'

export function CommentForm({ postId }: { postId: string }) {
  const [state, formAction] = useActionState(addComment.bind(null, postId), {} as FormState)
  const error = state.fieldErrors?.content?.[0]

  return (
    <form action={formAction} className="sticky bottom-4 flex flex-col gap-1">
      <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white py-1.5 pr-1.5 pl-5 shadow-sm focus-within:border-accent">
        <input
          name="content"
          required
          maxLength={500}
          placeholder="Add a comment…"
          aria-label="Add a comment"
          aria-invalid={error ? true : undefined}
          className="min-w-0 flex-1 bg-transparent text-sm focus:outline-none"
        />
        <SubmitButton pendingLabel="Posting…" className="px-4 py-2">
          Post
        </SubmitButton>
      </div>
      {error && <p className="px-5 text-sm text-red-600">{error}</p>}
    </form>
  )
}
