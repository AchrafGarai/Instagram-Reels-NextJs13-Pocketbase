import React, { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

const Button = (props: ButtonProps) => {
  const { className, children, ...rest } = props
  return (
    <button
      className={
        'flex items-center gap-2  p-3 rounded-full text-black border border-zinc-200'
      }
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
