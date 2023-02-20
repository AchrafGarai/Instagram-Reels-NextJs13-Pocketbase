'use client'
import { logout } from 'utils/auth'
import { pb } from 'utils/pocketbase'
import { useRouter } from 'next/navigation'
import { useSWRConfig } from 'swr'

function LogoutButton() {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const handleLogout = async () => {
    pb.authStore.clear()
    logout()
    //Clear all SWR data
    mutate(/* match all keys */ () => true, undefined, false)
    await router.push('/account/login')
    router.refresh()
  }
  return (
    <>
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export default LogoutButton
