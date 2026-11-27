import type { CSSProperties } from 'react'
import styles from './orb.module.css'

export function Orb({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <span
      className={[styles.orb, className].filter(Boolean).join(' ')}
      style={{ '--size': `${size}px` } as CSSProperties}
      aria-hidden="true"
    >
      <span className={`${styles.swirl} ${styles.swirlA}`} />
      <span className={`${styles.swirl} ${styles.swirlB}`} />
      <span className={styles.core} />
      <span className={styles.shine} />
    </span>
  )
}
