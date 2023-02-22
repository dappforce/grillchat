import LinkText from '@/components/LinkText'
import NavbarExtension, {
  NavbarExtensionProps,
} from '@/components/navbar/NavbarExtension'
import { cx } from '@/utils/className'
import Image, { ImageProps } from 'next/image'
import { HiOutlineChevronLeft } from 'react-icons/hi'

export type ChatNavbarExtensionProps = NavbarExtensionProps & {
  topic: string
  messageCount: number
  image: ImageProps['src']
}

export default function ChatNavbarExtension({
  contentContainerProps,
  image,
  messageCount,
  topic,
  ...props
}: ChatNavbarExtensionProps) {
  return (
    <NavbarExtension
      {...props}
      contentContainerProps={{
        ...contentContainerProps,
        className: cx(
          'grid grid-cols-3 items-center',
          contentContainerProps?.className
        ),
      }}
    >
      <LinkText href='/' variant='primary' className='flex items-center'>
        <HiOutlineChevronLeft />
        <span className='ml-1'>Back</span>
      </LinkText>
      <div className='flex flex-col text-center'>
        <span className='font-medium'>{topic ?? 'Topic'}</span>
        <span className='text-xs text-text-muted'>{messageCount} messages</span>
      </div>
      <Image
        className='h-6 w-6 justify-self-end'
        src={image}
        alt={topic ?? 'chat topic'}
      />
    </NavbarExtension>
  )
}
