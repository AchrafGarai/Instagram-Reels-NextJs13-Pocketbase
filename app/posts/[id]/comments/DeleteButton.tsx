'use client'
import React from 'react'
import { DotsVerticalIcon, TrashIcon } from '@radix-ui/react-icons'
import { pb } from 'utils/pocketbase'
import { useRouter } from 'next/navigation'
import {
  DropDownContent,
  DropDownRoot,
  DropDownItem,
  DropDownTrigger,
} from 'components/UI/DropDown'
import { NavbarDropDown } from 'components/layout'

function DeleteButton({ postId }: { postId: string }) {
  const router = useRouter()
  const handleDelete = async () => {
    await pb.collection('posts').delete(postId)
    router.replace('/feed')
  }
  return (
    <DropDownRoot>
      <DropDownTrigger>
        <button>
          <DotsVerticalIcon width={20} height={20} />
        </button>
      </DropDownTrigger>
      <DropDownContent>
        <DropDownItem onClick={handleDelete}>
          <TrashIcon width={20} height={20} />
          Delete Post
        </DropDownItem>
      </DropDownContent>
    </DropDownRoot>
  )
}

export default DeleteButton
