import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import { Navbar, NavbarSkeleton } from '@/components/layout/navbar'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'Reels', template: '%s · Reels' },
  description: 'Short vertical videos: post, scroll, like and comment.',
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar />
        </Suspense>
        <main className="mx-auto max-w-5xl px-4 pb-16 sm:pt-16">{children}</main>
      </body>
    </html>
  )
}
