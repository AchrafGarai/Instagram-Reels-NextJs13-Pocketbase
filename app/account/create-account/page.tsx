import React from 'react'
import SignUpForm from 'components/auth/SignUpForm'
import Image from 'next/image'

function page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-4">
        <Image src={'/Logo.svg'} width={115} height={32} alt={'logo'} />
        <Image src={'/sub_logo.svg'} width={55} height={19} alt={'logo'} />
      </div>
      <div className="my-8">
        <h1 className="text-center font-semibold text-gray-700">
          Create to your account
        </h1>
      </div>
      <SignUpForm />
    </div>
  )
}

export default page
