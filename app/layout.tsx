import './globals.css'
import Navbar from './Navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="snap-y snap-mandatory">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {/* @ts-ignore */}
        <Navbar />
        <div className="px-4 py-12 pt-0 max-w-[820px] mx-auto sm:pt-32">
          {children}
        </div>
      </body>
    </html>
  )
}
