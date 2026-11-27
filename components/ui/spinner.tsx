export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <span role="status" className="inline-flex items-center justify-center p-4">
      <span className="size-6 animate-spin rounded-full border-2 border-zinc-200 border-t-accent" />
      <span className="sr-only">{label}</span>
    </span>
  )
}
