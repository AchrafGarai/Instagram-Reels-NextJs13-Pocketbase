export function PageHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 border-b border-zinc-200 pb-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      {action}
    </div>
  )
}
