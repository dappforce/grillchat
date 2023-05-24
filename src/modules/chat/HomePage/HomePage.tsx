import NoResultImage from '@/assets/graphics/no-result.png'
import Button from '@/components/Button'
import ChatPreviewList from '@/components/chats/ChatPreviewList'
import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { getSuggestNewChatRoomLink } from '@/constants/links'
import useIsInIframe from '@/hooks/useIsInIframe'
import useSearch from '@/hooks/useSearch'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { HiArrowUpRight } from 'react-icons/hi2'
import useSortedChats from '../hooks/useSortedChats'
import HomePageNavbar from './HomePageNavbar'

const WelcomeModal = dynamic(() => import('@/components/modals/WelcomeModal'), {
  ssr: false,
})

export type HomePageProps = {
  spaceId: string
}
const searchKeys = ['content.title']
export default function HomePage({ spaceId }: HomePageProps) {
  const isInIframe = useIsInIframe()

  const { chats, allChatIds } = useSortedChats(spaceId)

  const { search, getSearchResults, setSearch, focusController } = useSearch()
  const { focusedElementIndex, searchResults } = getSearchResults(
    chats,
    searchKeys
  )

  return (
    <DefaultLayout
      navbarProps={{
        backButtonProps: {
          defaultBackLink: '/hubs',
          forceUseDefaultBackLink: true,
        },
        customContent: ({
          backButton,
          logoLink,
          authComponent,
          colorModeToggler,
        }) => {
          return (
            <HomePageNavbar
              chatsCount={allChatIds.length}
              auth={authComponent}
              colorModeToggler={colorModeToggler}
              backButton={backButton}
              logo={logoLink}
              spaceId={spaceId}
              searchProps={{
                search,
                setSearch,
                ...focusController,
              }}
            />
          )
        },
      }}
    >
      {!isInIframe && <WelcomeModal />}
      <div className='flex flex-col'>
        {searchResults.length === 0 && (
          <NoSearchResultScreen search={search} hubId={spaceId} />
        )}
        <ChatPreviewList
          chats={searchResults}
          focusedElementIndex={focusedElementIndex}
        />
      </div>
    </DefaultLayout>
  )
}

function NoSearchResultScreen({
  search,
  hubId,
}: {
  search: string
  hubId: string
}) {
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
