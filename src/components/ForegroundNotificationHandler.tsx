import { getPostQuery } from '@/services/api/query'
import firebaseApp from '@/services/firebase/config'
import { cx } from '@/utils/class-names'
import { getMessaging, onMessage } from 'firebase/messaging'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { HiArrowUpRight } from 'react-icons/hi2'
import Button from './Button'
import ChatImage from './chats/ChatImage'
import Toast from './Toast'

export default function ForegroundNotificationHandler() {
  useEffect(() => {
    const messaging = getMessaging(firebaseApp)
    const unsub = onMessage(messaging, async (payload) => {
      const data = payload.data
      const notification = payload.notification

      if (!data || !notification) return

      const { postId, rootPostId, spaceId } = data || {}
      const urlToOpen = `https://grill.chat/${spaceId}/${rootPostId}?messageId=${postId}`
      toast.custom(
        (t) => (
          <Toast
            t={t}
            icon={(className) => (
              <ChatImageWrapper chatId={rootPostId} className={className} />
            )}
            title={notification.title}
            description={notification.body}
            action={
              <Button
                size='circle'
                className='ml-2 text-lg text-text-primary'
                href={urlToOpen}
                target='_blank'
                variant='transparent'
                onClick={() => toast.dismiss(t.id)}
              >
                <HiArrowUpRight />
              </Button>
            }
          />
        ),
        { duration: 5_000 }
      )
    })

    return unsub
  }, [])
  return null
}

function ChatImageWrapper({
  chatId,
  className,
}: {
  chatId: string
  className?: string
}) {
  const { data } = getPostQuery.useQuery(chatId)
  const chatImage = data?.content?.image

  return (
    <ChatImage
      className={cx('h-8 w-8', className)}
      image={chatImage}
      chatId={chatId}
      chatTitle={data?.content?.title}
    />
  )
}
