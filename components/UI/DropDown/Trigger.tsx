'use client'
import React, { ReactNode } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

function Trigger({ children }: { children: ReactNode }) {
  return (
    <DropdownMenu.Trigger asChild className="cursor-pointer">
      {children}
    </DropdownMenu.Trigger>
  )
}

export default Trigger
