import React from 'react'

function PostFooterSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 backdrop-blur-sm">
      <div className="bg-white bg-opacity-50 w-20 h-6 rounded-full"></div>
      <div className="bg-white bg-opacity-50 w-20 h-6 rounded-full"></div>
    </div>
  )
}

export default PostFooterSkeleton
