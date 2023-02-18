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
} from 'components/UI/DropDown'
import { LogoutButton } from 'components/auth'

function NavbarDropDown() {
  return (
    <DropDownRoot>
      <DropDownTrigger>
        <ChevronDownIcon width={24} height={24} />
      </DropDownTrigger>
      <DropDownContent>
        <DropDownItem className="block sm:hidden">
          <Link href={'/'} className="flex items-center w-full gap-2">
            <HomeIcon width={20} height={20} /> Home
          </Link>
        </DropDownItem>
        <DropDownItem className="block sm:hidden">
          <Link href={'/create'} className="flex items-center w-full gap-2">
            <PlusIcon width={20} height={20} /> Create Post
          </Link>
        </DropDownItem>

        <DropDownItem>
          <Link
            href={'/notifications'}
            className="flex items-center w-full gap-2"
          >
            <HeartIcon width={20} height={20} /> Notifications
          </Link>
        </DropDownItem>
        <DropDownItem>
          <Link
            href={'/settings/edit'}
            className="flex items-center w-full gap-2"
          >
            <PersonIcon width={20} height={20} /> My Profile
          </Link>
        </DropDownItem>
        <DropDownItem>
          <LogoutButton />
        </DropDownItem>
      </DropDownContent>
    </DropDownRoot>
  )
}

export default NavbarDropDown
