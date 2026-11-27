import { useId, type ComponentProps } from 'react'

const control =
  'w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm placeholder:text-zinc-400 focus:border-accent focus:outline-none aria-invalid:border-red-500'

type FieldProps = { label: string; errors?: string[]; hint?: string }

function FieldShell({
  id,
  label,
  errors,
  hint,
  children,
}: FieldProps & { id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      {children}
      {errors?.length ? (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {errors[0]}
        </p>
      ) : hint ? (
        <p className="text-sm text-zinc-500">{hint}</p>
      ) : null}
    </div>
  )
}

export function Input({ label, errors, hint, ...props }: FieldProps & ComponentProps<'input'>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} errors={errors} hint={hint}>
      <input
        id={id}
        className={control}
        aria-invalid={errors?.length ? true : undefined}
        aria-describedby={errors?.length ? `${id}-error` : undefined}
        {...props}
      />
    </FieldShell>
  )
}

export function Textarea({
  label,
  errors,
  hint,
  ...props
}: FieldProps & ComponentProps<'textarea'>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} errors={errors} hint={hint}>
      <textarea
        id={id}
        rows={4}
        className={`${control} resize-none`}
        aria-invalid={errors?.length ? true : undefined}
        aria-describedby={errors?.length ? `${id}-error` : undefined}
        {...props}
      />
    </FieldShell>
  )
}
