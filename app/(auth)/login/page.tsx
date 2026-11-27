import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Logo } from '@/components/brand/logo'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Log in' }

export default function LoginPage({ searchParams }: PageProps<'/login'>) {
  return (
    <div className="flex flex-col gap-8">
      <Logo />
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-zinc-500">Log in to like, comment and post reels.</p>
      </div>
      <Suspense fallback={<LoginForm />}>
        <LoginWithRedirect searchParams={searchParams} />
      </Suspense>
      <p className="text-sm text-zinc-600">
        New here?{' '}
        <Link href="/signup" className="font-semibold text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}

async function LoginWithRedirect({ searchParams }: Pick<PageProps<'/login'>, 'searchParams'>) {
  const { next } = await searchParams
  return <LoginForm next={typeof next === 'string' ? next : undefined} />
}
