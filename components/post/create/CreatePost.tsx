'use client'

import { pb } from 'utils/pocketbase'
import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SubmitButton, TextArea } from 'components/UI'
import { UploadIcon } from '@radix-ui/react-icons'
import { Alert } from 'components/UI'

function CreatePost() {
  const [file, setFile] = useState<File>()
  const [caption, setCaption] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [preview, setPreview] = useState<string>('')

  const model = pb.authStore.model
  const id = model?.id || ''
  const router = useRouter()

  const submitForm = async (event: any) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData()

    formData.append('profile', id)

    if (file) {
      formData.append('fileUrl', file)
    }
    if (caption) {
      formData.append('caption', caption)
    }
    try {
      const { id } = await pb.collection('posts').create(formData)
      setStatus('Updated successfully ✅')
      router.refresh()
      router.push(`/posts/${id}`)
      setLoading(false)
    } catch (e) {
      console.log(e)
      setStatus('Failed tp update 🚫 ')
      setLoading(false)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    setPreview(URL.createObjectURL(e.target.files[0]))
    setFile(e.target.files[0])
  }

  return (
    <div>
      {model && (
        <>
          <div>
            <form
              onSubmit={submitForm}
              className="grid grid-cols-1 sm:grid-cols-2 sm:gap-6 "
            >
              {/* TODO ADD simple input validation */}
              <div className=" h-[400px] bg-gray-100 rounded-3xl overflow-hidden sm:h-[720px]  border border-zinc-300">
                {!preview ? (
                  <label
                    htmlFor="file"
                    className="h-full flex flex-col m-8  gap-4 items-center justify-center cursor-pointer"
                  >
                    <UploadIcon height={28} width={28} />
                    Upload your file here
                    <input
                      hidden
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".mp4"
                      required
                    />
                  </label>
                ) : (
                  <video
                    className="w-full h-full object-cover"
                    src={preview}
                    autoPlay
                    loop
                  />
                )}
              </div>

              <div className="p-8 flex flex-col gap-6">
                <TextArea
                  label="Caption"
                  placeholder="Write a cool caption for your post."
                  maxLength={144}
                  onChange={(e) => {
                    setCaption(e.target.value)
                  }}
                />
                <SubmitButton disabled={loading}>
                  {loading ? 'Loading' : 'Submit'}
                </SubmitButton>
              </div>
            </form>
            {status && <Alert message={status} />}
          </div>
        </>
      )}
    </div>
  )
}

export default CreatePost
