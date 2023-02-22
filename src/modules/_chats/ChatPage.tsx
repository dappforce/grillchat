import LinkText from '@/components/LinkText'
import NavbarExtension from '@/components/NavbarExtension'
import { useRouter } from 'next/router'
import { HiOutlineChevronLeft } from 'react-icons/hi'

export default function ChatPage() {
  const router = useRouter()
  const { topic } = router.query as { topic: string }

  return (
    <div>
      <NavbarExtension className='flex grid-cols-3'>
        <LinkText href='/' variant='primary' className='flex items-center'>
          <HiOutlineChevronLeft />
          <span className='ml-1'>Back</span>
        </LinkText>
      </NavbarExtension>
    </div>
  )
}
