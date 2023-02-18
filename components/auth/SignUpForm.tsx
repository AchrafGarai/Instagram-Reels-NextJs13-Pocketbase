'use client'

import React, { useState } from 'react'
import { pb } from 'utils/pocketbase'
import { useRouter } from 'next/navigation'
import { Alert, Input, SubmitButton } from 'components/UI'

function SignUpForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const router = useRouter()

  const handleLogin = async (event: any) => {
    event.preventDefault()
    setLoading(true)
    try {
      // example create data
      const data = {
        username: userName,
        email: email,
        emailVisibility: true,
        password: password,
        passwordConfirm: confirmPassword,
        name: name,
      }

      const result = await pb.collection('users').create(data)

      // (optional) send an email verification request
      // await pb.collection('users').requestVerification('test@example.com')

      setStatus('Account Created in successfully ✅')
      router.replace('/account/login')
      router.refresh()
    } catch (e) {
      console.error(e)
      setStatus('Unable to Create account 🚫')
    }
    setLoading(false)
  }

  return (
    <div>
      {status && <Alert message={status} />}
      <form onSubmit={handleLogin} className="flex flex-col">
        <div className="grid grid-cols-2 items-start gap-4">
          <Input
            label="Full name"
            type="text"
            errorMessage="Name is required"
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value)
            }}
          />

          <Input
            label="Username"
            type="text"
            placeholder="Username"
            pattern="^[A-Za-z][A-Za-z0-9_]{7,29}$"
            errorMessage="Username must be 8-30 character"
            onChange={(e) => {
              setUserName(e.target.value)
            }}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="E-mail"
          onChange={(e) => {
            setEmail(e.target.value)
          }}
          errorMessage="This email is not valid"
        />

        <div className="grid grid-cols-2 items-start gap-4">
          <Input
            label="Password"
            type="password"
            placeholder="password"
            pattern="^(?=.*[0-9]).{8,}$"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />

          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm Password"
            pattern="^(?=.*[0-9]).{8,}$"
            errorMessage="Password must contain at least one numbver and be at least 6 characters"
            onChange={(e) => {
              setConfirmPassword(e.target.value)
            }}
          />
        </div>

        <SubmitButton disabled={loading}>
          {loading ? 'Loading...' : 'Create Accout'}
        </SubmitButton>
      </form>
    </div>
  )
}

export default SignUpForm
