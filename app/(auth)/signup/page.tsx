import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/brand/logo'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = { title: 'Create account' }

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-8">
      <Logo />
      <div>
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="text-sm text-zinc-500">Share short videos with everyone.</p>
      </div>
      <SignupForm />
      <p className="text-sm text-zinc-600">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
