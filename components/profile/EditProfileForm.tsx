'use client'
import React, { ChangeEvent, useState } from 'react'
import { pb } from 'utils/pocketbase'
import Loading from 'components/UI/Loading'
import { Record, Admin } from 'pocketbase'
import {
  Input,
  TextArea,
  SubmitButton,
  Avatar,
  Alert,
  Button,
} from 'components/UI'
import { User } from 'types'
import Image from 'next/image'

function EditProfileForm({ user }: { user: User }) {
  const [file, setFile] = useState<File>()
  const [preview, setPreview] = useState<string>('')
  const [bio, setBio] = useState<string | null>()
  const [displayName, setDisplayName] = useState<string | null>()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const id = user?.id

  const submitForm = async (event: any) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData()
    if (file) {
      formData.append('avatar', file)
    }
    if (bio) {
      formData.append('bio', bio)
    }
    if (displayName) {
      formData.append('name', displayName)
    }
    try {
      if (id) {
        await pb.collection('users').update(id, formData)
        setStatus('Updated successfully ✅')
      }
    } catch (e) {
      console.log(e)
      setStatus('Failed tp update 🚫 ')
    }
    setLoading(false)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    setPreview(URL.createObjectURL(e.target.files[0]))
    setFile(e.target.files[0])
  }

  return (
    <div className="mx-auto max-w-sm">
      {user && id ? (
        <>
          <form
            onSubmit={submitForm}
            className="flex flex-col items-center gap-6"
          >
            {!preview ? (
              <>
                <Avatar user={user} size={160} />
                <label htmlFor="avatar">
                  <input
                    id="avatar"
                    type="file"
                    onChange={handleFileChange}
                    hidden
                  />
                  <div className="p-4 rounded-full border border-zinc-200 cursor-pointer">
                    Upload profile
                  </div>
                </label>
              </>
            ) : (
              <label
                htmlFor="avatar"
                className="flex flex-col items-center gap-4 "
              >
                <Image
                  src={preview}
                  alt=""
                  width={160}
                  height={160}
                  className=" rounded-full object-cover"
                />
                <input id="avatar" onChange={handleFileChange} hidden />
                <div className="p-4 rounded-full border border-zinc-200 cursor-pointer">
                  Upload profile
                </div>
              </label>
            )}

            <Input
              label="Display Name"
              defaultValue={user.name}
              onChange={(e) => {
                setDisplayName(e.target.value)
              }}
            />
            <TextArea
              label="Bio"
              defaultValue={user.bio}
              onChange={(e) => {
                setBio(e.target.value)
              }}
            />
            <SubmitButton disabled={loading}>Submit</SubmitButton>
          </form>
          {status && <Alert message={status} />}
        </>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default EditProfileForm
