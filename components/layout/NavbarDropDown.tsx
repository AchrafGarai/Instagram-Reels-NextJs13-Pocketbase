'use client'
import Link from 'next/link'
import {
  PersonIcon,
  ChevronDownIcon,
  HeartIcon,
  PlusIcon,
  HomeIcon,
} from '@radix-ui/react-icons'
import {
  DropDownContent,
  DropDownRoot,
  DropDownItem,
  DropDownTrigger,
  DropDownLink
} from 'components/UI/DropDown'
import { LogoutButton } from 'components/auth'
import { useRouter } from 'next/navigation'
import { pb } from 'utils/pocketbase'


import { useSWRConfig } from 'swr'
import { logout } from 'utils/auth'
function NavbarDropDown() {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const handleLogout = () => {
    pb.authStore.clear()
    logout()
    //Clear all SWR data
    mutate(/* match all keys */ () => true, undefined, false)
    router.replace('/account/login')
  }
  return (
    <DropDownRoot>
      <DropDownTrigger>
        <ChevronDownIcon width={24} height={24} />
      </DropDownTrigger>
      <DropDownContent>
        <div className="block sm:hidden">
        <DropDownLink href={'/'}>
            <HomeIcon width={20} height={20} /> Home
        </DropDownLink>
        </div>

        <div className="block sm:hidden">
          <DropDownLink href={'/create'}>
            <PlusIcon width={20} height={20} /> Create Post
          </DropDownLink>
        </div>

        <DropDownLink href={'/notifications'}>
            <HeartIcon width={20} height={20} /> Notifications
        </DropDownLink>
        
        <DropDownLink href='/settings/edit'>
            <PersonIcon width={20} height={20} /> My Profile
        </DropDownLink>

        <DropDownLink href='/logout'>
          Logout
        </DropDownLink>
      </DropDownContent>
    </DropDownRoot>
  )
}

export default NavbarDropDown
