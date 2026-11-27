import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Orb } from '@/components/brand/orb'
import { DemoBanner } from '@/components/layout/demo-banner'
import { getCurrentUser } from '@/lib/pocketbase/server'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 grid overflow-y-auto bg-white sm:grid-cols-2">
      <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-100 sm:flex">
        <Orb size={280} />
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Suspense>
            <RedirectIfSignedIn />
            <DemoBanner className="mb-8" />
          </Suspense>
          {children}
        </div>
      </div>
    </div>
  )
}

async function RedirectIfSignedIn() {
  if (await getCurrentUser()) redirect('/')
  return null
}
