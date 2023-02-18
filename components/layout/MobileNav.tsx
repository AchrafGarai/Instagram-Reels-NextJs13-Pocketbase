'use client'
import NavbarDropDown from './NavbarDropDown'
import { Cross1Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { SearchBar } from 'components/UI'

function MobileNav() {
  const [isSearch, setIsSearch] = useState(false)

  return (
    <nav className="fixed top-0 z-20 py-6 px-8 w-auto right-0 flex gap-4 items-center justify-end sm:hidden">
      <div className="text-white p-2 bg-gray-800  bg-opacity-20 rounded-full backdrop-blur-sm">
        <MagnifyingGlassIcon
          className="cursor-pointer"
          onClick={() => setIsSearch(true)}
          width={24}
          height={24}
        />
      </div>
      <div className="text-white p-2 bg-gray-800  bg-opacity-20 rounded-full backdrop-blur-sm">
        <NavbarDropDown />
      </div>
      {isSearch && (
        <div className="fixed top-0 left-0 w-full p-4 z-30 gap-3 flex items-center bg-white">
          <div>
            <Cross1Icon
              className="cursor-pointer text-white drop-shadow-lg bg-gray-800  bg-opacity-50 rounded-full backdrop-blur-sm p-1 flex-shrink-1"
              height={24}
              width={24}
              onClick={() => setIsSearch(false)}
            />
          </div>
          <SearchBar />
        </div>
      )}
    </nav>
  )
}

export default MobileNav
