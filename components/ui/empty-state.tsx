export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-zinc-200 px-6 py-16 text-center">
      <p className="font-medium">{title}</p>
      {children && <div className="text-sm text-zinc-500">{children}</div>}
    </div>
  )
}
