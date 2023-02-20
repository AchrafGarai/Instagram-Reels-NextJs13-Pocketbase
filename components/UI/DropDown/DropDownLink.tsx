'use client'
import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
export interface ItemProps {
  className?: string
  children : ReactNode
  href : string
}

function DropDownLinkItem({ className, children, href}: ItemProps) {
  return (
    <DropdownMenu.Item>
      <Link 
      href={href}
        className={`flex items-center gap-2 p-4 border-b border-zinc-200 w-full hover:bg-slate-100 ${className}`}
      >
        {children}
      </Link>
    </DropdownMenu.Item>
  )
}

export default DropDownLinkItem