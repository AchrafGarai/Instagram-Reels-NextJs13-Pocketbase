import { useUser } from 'utils/useUser'
import Link from 'next/link'
import Image from 'next/image'
import { Avatar, ButtonLink, CreatePostButton, SearchBar } from 'components/UI'
import { MobileNav, NavbarDropDown } from 'components/layout'
import { getUSerData } from 'utils/useUser'
import { LogoutButton } from 'components/auth'

async function Navbar() {
  const user = useUser()
  const userData = await getUSerData()

  return (
    <>
      <nav className="py-3 px-16 border-b border-zinc-200 hidden w-full sm:fixed sm:top-0 sm:z-20 bg-white sm:flex sm:flex-row sm:items-center ">
        <Link href={'/'} className="flex items-center gap-3 flex-grow   ">
          <Image src={'/Logo.svg'} width={115} height={32} alt={'logo'} />
          <Image src={'/sub_logo.svg'} width={55} height={19} alt={'logo'} />
        </Link>

        <div className="flex flex-grow items-center flex-row justify-center">
          <SearchBar />
        </div>
        <div className="flex flex-row items-center justify-end gap-4 flex-grow">
          {user ? (
            <>
              <CreatePostButton />
              <Avatar user={userData} />
              <NavbarDropDown />
            </>
          ) : (
            <ButtonLink href={'/account/login'}>Login</ButtonLink>
          )}
        </div>
      </nav>
      <MobileNav />
    </>
  )
}

export default Navbar
