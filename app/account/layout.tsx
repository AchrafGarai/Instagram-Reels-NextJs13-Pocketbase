import { checkLoggedIn } from 'utils/useUser'
import Image from 'next/image'
export default function layout({ children }: { children: React.ReactNode }) {
  checkLoggedIn()
  return (
    <div className="absolute top-0 left-0 w-full min-h-full bg-white z-40">
      <div className="grid grid-cols-1  sm:gap-6 sm:grid-cols-2">
        <div className="relative w-full min-h-screen hidden sm:block ">
          <Image src={'/ig-cover.jpg'} fill alt="" className=" object-cover" />
        </div>
        <div className="p-4 py-16 max-w-[480px] mx-auto h-screen flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}
