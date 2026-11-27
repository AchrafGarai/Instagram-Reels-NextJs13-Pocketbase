import { PlusIcon } from '@radix-ui/react-icons'
import { Logo } from '@/components/brand/logo'
import { ButtonLink } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/pocketbase/server'
import { DemoBadge } from './demo-banner'
import { SearchForm } from './search-form'
import { UserMenu } from './user-menu'

export async function Navbar() {
  const user = await getCurrentUser()

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center gap-4 px-4 sm:border-b sm:border-zinc-200 sm:bg-white/90 sm:px-8 sm:backdrop-blur">
      <div className="flex flex-1 items-center gap-3">
        <span className="hidden sm:block">
          <Logo />
        </span>
        <DemoBadge />
      </div>
      <div className="hidden flex-1 justify-center sm:flex">
        <SearchForm />
      </div>
      <nav className="flex flex-1 items-center justify-end gap-3" aria-label="Account">
        {user ? (
          <>
            <ButtonLink href="/create" className="hidden sm:inline-flex">
              <PlusIcon width={16} height={16} /> New reel
            </ButtonLink>
            <UserMenu user={user} />
          </>
        ) : (
          <ButtonLink href="/login">Log in</ButtonLink>
        )}
      </nav>
    </header>
  )
}

export function NavbarSkeleton() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 hidden h-16 items-center border-b border-zinc-200 bg-white px-8 sm:flex">
      <Logo />
    </header>
  )
}
