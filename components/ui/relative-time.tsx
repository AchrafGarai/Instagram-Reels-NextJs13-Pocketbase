const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
]

const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'short' })

export function formatRelative(date: Date, now = new Date()) {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000)
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}

export function RelativeTime({ date }: { date: string }) {
  const parsed = new Date(date.replace(' ', 'T'))
  return (
    <time
      dateTime={parsed.toISOString()}
      title={parsed.toLocaleString('en')}
      className="text-xs text-zinc-500"
      suppressHydrationWarning
    >
      {formatRelative(parsed)}
    </time>
  )
}
