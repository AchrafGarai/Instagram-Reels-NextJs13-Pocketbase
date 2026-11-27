import Link from 'next/link'
import { Orb } from './orb'

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-full" aria-label="Reels home">
      <Orb size={size} />
      <span className="text-lg font-semibold tracking-tight">Reels</span>
    </Link>
  )
}
