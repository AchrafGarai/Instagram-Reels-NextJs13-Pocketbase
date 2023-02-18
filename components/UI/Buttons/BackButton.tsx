'use client'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
function BackButton() {
  const router = useRouter()
  const handleBack = () => {
    router.back()
  }
  return (
    <button onClick={handleBack}>
      <ArrowLeftIcon width={24} height={24} />
    </button>
  )
}

export default BackButton
