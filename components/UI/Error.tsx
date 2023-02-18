import React from 'react'

function Error({ message }: { message?: string }) {
  return <div className=" text-center p-4 text-sm text-gray-400">{message}</div>
}

export default Error
