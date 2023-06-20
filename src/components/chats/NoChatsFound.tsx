import NoResultImage from '@/assets/graphics/no-result.png'
import Button from '@/components/Button'
import Container from '@/components/Container'
import { getHubIdFromAlias } from '@/constants/hubs'
import { getSuggestNewChatRoomLink } from '@/constants/links'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { HiArrowUpRight } from 'react-icons/hi2'

export type NoChatsFoundProps = {
  search: string
  hubId?: string
}

export default function NoChatsFound({ search, hubId }: NoChatsFoundProps) {
  const router = useRouter()

  let paramHubId = router.query.hubId as string
  paramHubId = getHubIdFromAlias(paramHubId) || paramHubId

  const usedHubId = hubId || paramHubId

  return (
    <Container
      as='div'
      className='mb-8 mt-12 flex !max-w-lg flex-col items-center justify-center gap-4 text-center md:mt-20'
    >
      <Image
        src={NoResultImage}
        className='h-48 w-48'
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
        href={getSuggestNewChatRoomLink({ chatName: search, hubId: usedHubId })}
        target='_blank'
        rel='noopener noreferrer'
      >
        Contact Support <HiArrowUpRight className='inline' />
      </Button>
    </Container>
  )
}
