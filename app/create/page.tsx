import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CreatePostForm } from '@/components/posts/create-post-form'
import { PageHeader } from '@/components/ui/page-header'
import { requireUser } from '@/lib/pocketbase/server'

export const metadata: Metadata = { title: 'New reel' }

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-3xl pt-20 sm:pt-8">
      <PageHeader title="New reel" />
      <Suspense>
        <AuthGate>
          <CreatePostForm />
        </AuthGate>
      </Suspense>
    </div>
  )
}

async function AuthGate({ children }: { children: React.ReactNode }) {
  await requireUser()
  return children
}
