'use client'
import React, { ReactNode } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

function Content({ children }: { children: ReactNode }) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content className="bg-white shadow-xl border border-gray-200 rounded-md z-20">
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  )
}

export default Content
