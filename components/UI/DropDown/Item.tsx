'use client'
import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
export interface ItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

function Item({ className, children, ...rest }: ItemProps) {
  return (
    <DropdownMenu.Item>
      <button
        className={`flex items-center gap-2 p-4 border-b border-zinc-200 w-full hover:bg-slate-100 ${className}`}
        {...rest}
      >
        {children}
      </button>
    </DropdownMenu.Item>
  )
}

export default Item
