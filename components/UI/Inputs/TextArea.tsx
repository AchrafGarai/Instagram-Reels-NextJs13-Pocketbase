import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

export interface InputProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  label?: string
  errorMessage?: string
  onChange?: (...args: any[]) => any
}

const TextArea = (props: InputProps) => {
  const { className, children, onChange, label, errorMessage, ...rest } = props

  const handleOnChange = (e: any) => {
    if (onChange) {
      onChange(e)
    }
    return null
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {label && <label className="font-semibold text-md">{label}</label>}
      <textarea
        className={
          'w-full bg-gray-100 border border-zinc-200 p-4 rounded-2xl focus:outline-zinc-300 min-h-[250px]'
        }
        onChange={handleOnChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        {...rest}
      />
      <span className="error-message text-xs text-right text-red-500">
        {errorMessage}
      </span>
    </div>
  )
}

export default TextArea
