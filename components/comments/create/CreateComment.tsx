'use client'
import React, { useState } from 'react'
import { pb } from 'utils/pocketbase'
import { useSWRConfig } from 'swr'
import { Alert } from 'components/UI'
import { api_Url } from 'utils/consts'

function CreateComment({
  postId,
  onMutate,
}: {
  postId: string
  onMutate: () => void
}) {
  const [comment, setComment] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const { mutate } = useSWRConfig()
  const id = pb.authStore?.model?.id || ''

  const submitForm = async (event: any) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('profile', id)
    formData.append('post', postId)

    if (comment !== '') {
      setLoading(true)
      formData.append('content', comment)
      try {
        await pb.collection('comments').create(formData)
        setStatus('Comment added successfully ✅')
      } catch (e) {
        console.log(e)
        setStatus('Failed tp update 🚫 ')
      }
      // Disable loading
      setLoading(false)
      // Refrech Page to display new comment
      await mutate(
        `${api_Url}collections/comments/records?filter=(post='${postId}')`,
        true,
      )
      await onMutate()
      // Clear input
      setComment('') // mutate
    }
  }

  return (
    <div className=" sticky bottom-6">
      <form
        onSubmit={submitForm}
        className="bg-gray-100 p-6 border border-zinc-200 rounded-3xl flex items-center gap-4 my-6"
      >
        <input
          className="bg-gray-100 flex-grow focus:outline-none"
          placeholder="Add a comment"
          type="text"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value)
          }}
        />
        <button
          disabled={loading}
          type="submit"
          className=" font-semibold  text-sky-600"
        >
          {loading ? 'Loading..' : 'Post'}
        </button>
      </form>
      {status && <Alert message={status} />}
    </div>
  )
}

export default CreateComment
