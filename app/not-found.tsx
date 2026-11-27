import { EmptyState } from '@/components/ui/empty-state'
import { ButtonLink } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="pt-28">
      <EmptyState title="This page doesn’t exist">
        <ButtonLink href="/" className="mt-4">
          Back to the feed
        </ButtonLink>
      </EmptyState>
    </div>
  )
}
