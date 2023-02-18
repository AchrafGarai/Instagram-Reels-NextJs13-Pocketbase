import React, { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

const Button = (props: ButtonProps) => {
  const { className, children, ...rest } = props
  return (
    <button
      type="submit"
      className={
        'flex items-center justify-center gap-2 p-4 w-full bg-sky-400 rounded-full text-white'
      }
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
