import React from 'react'
import Image from 'next/image'
import { Button } from './Buttons'

function ScrollEnd() {
  return (
    <div className="flex flex-col items-center my-6 gap-4 p-6 border-none">
      <Image src="/ig-check.svg" width={36} height={24} alt="check" />
      You are all cought up
    </div>
  )
}

export default ScrollEnd
