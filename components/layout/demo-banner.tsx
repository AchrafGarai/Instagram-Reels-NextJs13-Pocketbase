import { isDemoMode } from '@/lib/pocketbase/server'

const EXPLANATION =
  'The backend is offline, so you’re seeing sample reels. Likes, comments and accounts are disabled.'

/** Full explanation, shown on the login and signup pages. */
export async function DemoBanner({ className = '' }: { className?: string }) {
  if (!(await isDemoMode())) return null

  return (
    <p role="status" className={`rounded-2xl bg-accent/10 px-4 py-3 text-sm text-accent ${className}`}>
      <span className="font-semibold">Demo mode.</span> {EXPLANATION}
    </p>
  )
}

/** Compact badge for the navbar. */
export async function DemoBadge() {
  if (!(await isDemoMode())) return null

  return (
    <span
      title={EXPLANATION}
      className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium whitespace-nowrap text-accent max-sm:bg-white/85 max-sm:backdrop-blur"
    >
      Demo · read-only<span className="sr-only">. {EXPLANATION}</span>
    </span>
  )
}
