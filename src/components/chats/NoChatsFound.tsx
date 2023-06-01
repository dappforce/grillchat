import NoResultImage from '@/assets/graphics/no-result.png'
import Button from '@/components/Button'
import Container from '@/components/Container'
import { getSuggestNewChatRoomLink } from '@/constants/links'
import Image from 'next/image'
import { HiArrowUpRight } from 'react-icons/hi2'

export type NoChatsFoundProps = {
  search: string
  hubId?: string
}

export default function NoChatsFound({ search, hubId }: NoChatsFoundProps) {
  return (
    <Container
      as='div'
      className='mt-20 flex !max-w-lg flex-col items-center justify-center gap-4 text-center'
    >
      <Image
        src={NoResultImage}
        className='h-64 w-64'
        alt=''
        role='presentation'
      />
      <span className='text-3xl font-semibold'>😳 No results</span>
      <p className='text-text-muted'>
        Sorry, no chats were found with that name. However, our support team is
        ready to help! Ask them to create a personalized chat tailored to your
        needs.
      </p>
      <Button
        className='mt-4 w-full'
        size='lg'
        href={getSuggestNewChatRoomLink({ chatName: search, hubId })}
        target='_blank'
        rel='noopener noreferrer'
      >
        Contact Support <HiArrowUpRight className='inline' />
      </Button>
    </Container>
  )
}
