import type { Metadata } from 'next'
import { Suspense } from 'react'
import { EditProfileForm } from '@/components/profile/edit-profile-form'
import { PageHeader } from '@/components/ui/page-header'
import { Spinner } from '@/components/ui/spinner'
import { requireUser } from '@/lib/pocketbase/server'

export const metadata: Metadata = { title: 'Edit profile' }

export default function EditProfilePage() {
  return (
    <div className="mx-auto max-w-md pt-20 sm:pt-8">
      <PageHeader title="Edit profile" />
      <Suspense fallback={<Spinner />}>
        <ProfileForm />
      </Suspense>
    </div>
  )
}

async function ProfileForm() {
  const user = await requireUser()
  return <EditProfileForm profile={user} />
}
