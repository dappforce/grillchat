import IntegrateIcon from '@/assets/icons/integrate.png'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import ChatPreview from './ChatPreview'

export default function ChatSpecialButtons() {
  const integrateChatButton = (
    <ChatPreview
      key='integrate'
      isPinned
      asLink={{ href: '/integrate' }}
      asContainer
      image={
        <div className='h-full w-full bg-background-primary p-3 text-text-on-primary'>
          <Image src={IntegrateIcon} alt='integrate chat' />
        </div>
      }
      className={cx(
        'bg-background-light md:rounded-none md:bg-background-light/50',
        'md:rounded-b-3xl'
      )}
      withBorderBottom={false}
      title='Integrate chat into an existing app'
      description='Let your users communicate using blockchain'
    />
  )

  return integrateChatButton
}
