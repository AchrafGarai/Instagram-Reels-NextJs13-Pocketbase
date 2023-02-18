import React from 'react'

function PostSkeleton() {
  return (
    <div className="max-w-[420px] mx-auto">
      <div className="animate-pulse mx-auto">
        <div className="flex gap-4">
          <div className=" w-12 h-12 rounded-full bg-slate-200"></div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className=" w-40 h-2 rounded-full bg-slate-200"></div>
            <div className=" w-40 h-2 rounded-full bg-slate-200"></div>
          </div>
        </div>
        <div className=" w-full max-w-[420px] bg-slate-200 h-screen max-h-[720px] rounded-2xl mt-5 m"></div>
      </div>
    </div>
  )
}

export default PostSkeleton
