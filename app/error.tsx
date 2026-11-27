'use client'

import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="pt-28">
      <EmptyState title="Something went wrong">
        <p>Is PocketBase running? Check the server logs for details.</p>
        <Button variant="secondary" className="mt-4" onClick={reset}>
          Try again
        </Button>
      </EmptyState>
    </div>
  )
}
