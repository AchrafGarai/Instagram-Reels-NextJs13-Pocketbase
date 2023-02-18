import Link from 'next/link'
import React, { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps {
  className?: string
  href: string
  children: ReactNode
}

const ButtonLink = (props: ButtonProps) => {
  const { className, children, href, ...rest } = props
  return (
    <Link
      href={href}
      className={
        ' flex items-center justify-center gap-2 p-1 text-xs text-center rounded-full text-black border border-zinc-200 sm:p-3 sm:text-base sm:px-4'
      }
      {...rest}
    >
      {children}
    </Link>
  )
}

export default ButtonLink
