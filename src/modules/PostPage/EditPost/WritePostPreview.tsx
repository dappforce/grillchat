import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import NewPostModal from './editor/NewPostModal'

const WritePostPreview = () => {
  const myAddress = useMyMainAddress()
  const [isOpen, setIsOpen] = useState(false)

  const onClick = () => setIsOpen(true)

  return (
    <>
      <div
        className='flex cursor-pointer items-center gap-4 rounded-[20px] bg-white p-5 shadow-[0_0_20px_#e2e8f0]'
        onClick={onClick}
      >
        <AddressAvatar
          asLink={false}
          address={myAddress || ''}
          className={cx()}
        />
        <div className='w-full rounded-[60px] bg-[#f8fafc] px-4 py-2 text-text-muted'>
          Write something...
        </div>
        <Button variant={'primary'} disabled size={'md'}>
          Post
        </Button>
      </div>
      <NewPostModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </>
  )
}

export default WritePostPreview
