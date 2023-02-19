'use client'
import React, { useState } from 'react'
import { pb } from 'utils/pocketbase'
import { useRouter } from 'next/navigation'
import { login } from 'utils/auth'
import { Input, SubmitButton, Alert } from 'components/UI'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const router = useRouter()

  const handleLogin = async (event: any) => {
    event.preventDefault()
    setLoading(true)
    try {
      const result = await pb
        .collection('users')
        .authWithPassword(email, password)
      console.log(result)
      await login(email, password)
      setStatus('Logged in successfully ✅')
      router.refresh()
      router.replace('/')
    } catch (e) {
      console.log(e)
      setStatus('Unable to Login 🚫')
    }
    setLoading(false)
  }

  return (
    <div>
      {status}
      <form className="flex flex-col gap-8" onSubmit={handleLogin}>
        <Input
          label="Email"
          required
          type="email"
          placeholder="E-mail"
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />

        <Input
          required
          label="Password"
          errorMessage="Password must contain at least one numbver and be at least 6
          characters"
          type="password"
          placeholder="password"
          pattern="^(?=.*[0-9]).{8,}$"
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />

        <SubmitButton disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </SubmitButton>
      </form>
      {status && <Alert message={status} />}
    </div>
  )
}

export default LoginForm
