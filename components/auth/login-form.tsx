'use client'

import { useActionState } from 'react'
import { Input } from '@/components/ui/field'
import { FormError } from '@/components/ui/form-error'
import { SubmitButton } from '@/components/ui/submit-button'
import { login } from '@/lib/actions/auth'

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(login, {})

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormError message={state.error} />
      {next && <input type="hidden" name="next" value={next} />}
      <Input
        label="Email or username"
        name="identity"
        autoComplete="username"
        required
        defaultValue={state.values?.identity}
        errors={state.fieldErrors?.identity}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        errors={state.fieldErrors?.password}
      />
      <SubmitButton pendingLabel="Logging in…" className="mt-2">
        Log in
      </SubmitButton>
    </form>
  )
}
