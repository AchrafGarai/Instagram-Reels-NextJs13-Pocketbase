'use client'
import { PlusIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import Button from './Button'

function BackButton({ className }: { className?: string }) {
  const router = useRouter()
  const handleBack = () => {
    router.push('/create')
  }
  return (
    <Button onClick={handleBack} className={className}>
      <PlusIcon width={20} height={20} />
      New Post
    </Button>
  )
}

export default BackButton
