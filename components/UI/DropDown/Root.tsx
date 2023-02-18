'use client'
import React, { ReactNode } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

function Root({ children }: { children: ReactNode }) {
  return <DropdownMenu.Root>{children}</DropdownMenu.Root>
}

export default Root
