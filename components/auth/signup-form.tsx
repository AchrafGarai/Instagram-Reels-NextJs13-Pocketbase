'use client'

import { useActionState } from 'react'
import { Input } from '@/components/ui/field'
import { FormError } from '@/components/ui/form-error'
import { SubmitButton } from '@/components/ui/submit-button'
import { signup } from '@/lib/actions/auth'

export function SignupForm() {
  const [state, formAction] = useActionState(signup, {})
  const errors = state.fieldErrors ?? {}

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormError message={state.error} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Name"
          name="name"
          autoComplete="name"
          required
          defaultValue={state.values?.name}
          errors={errors.name}
        />
        <Input
          label="Username"
          name="username"
          autoComplete="username"
          required
          pattern="[A-Za-z0-9_]{3,30}"
          defaultValue={state.values?.username}
          errors={errors.username}
        />
      </div>
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        errors={errors.email}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          errors={errors.password}
          hint="8+ characters with a number."
        />
        <Input
          label="Confirm password"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          required
          errors={errors.passwordConfirm}
        />
      </div>
      <SubmitButton pendingLabel="Creating account…" className="mt-2">
        Create account
      </SubmitButton>
    </form>
  )
}
