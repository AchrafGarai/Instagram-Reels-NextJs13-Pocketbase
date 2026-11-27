'use client'

import { useFormStatus } from 'react-dom'
import { Button } from './button'

export function SubmitButton({
  children,
  pendingLabel,
  className,
}: {
  children: React.ReactNode
  pendingLabel: string
  className?: string
}) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} className={className}>
      {pending ? pendingLabel : children}
    </Button>
  )
}
