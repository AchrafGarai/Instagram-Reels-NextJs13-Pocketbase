import React from 'react'
import EditProfileForm from 'components/profile/EditProfileForm'
import { getUSerData, useUserProtected } from 'utils/useUser'
import { BackButton } from 'components/UI'
async function page() {
  const user = useUserProtected()
  const userData = await getUSerData()
  return (
    <div className=" mx-auto max-w-[480px] ">
      <div className="flex gap-4 items-center">
        <BackButton />
        <h1 className="my-8 text-lg font-semibold text-gray-700">
          Edit Profile
        </h1>
      </div>
      <EditProfileForm user={userData} />
    </div>
  )
}

export default page
