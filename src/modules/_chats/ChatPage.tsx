import NavbarExtension from '@/components/NavbarExtension'
import { useRouter } from 'next/router'

export default function ChatPage() {
  const router = useRouter()
  const { topic } = router.query as { topic: string }

  return (
    <div>
      <NavbarExtension>{topic}</NavbarExtension>
    </div>
  )
}
