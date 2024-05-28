import Button from '@/components/Button'
import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { env } from '@/env.mjs'
import useIsMounted from '@/hooks/useIsMounted'
import { useUpsertSpace } from '@/services/datahub/spaces/mutation'
import { augmentDatahubParams } from '@/services/datahub/utils'
import { useUpsertPost } from '@/services/subsocial/posts/mutation'
import { cx } from '@/utils/class-names'
import { getUrlQuery } from '@/utils/links'
import { useState } from 'react'
import ChatContent from './ChatContent'
import MobileNavigation, { HomePageView } from './MobileNavigation'
import MainContent from './epic-leaderboard/MainContent'

export default function HomePage() {
  const isMounted = useIsMounted()
  return (
    <DefaultLayout className='relative' style={{ minHeight: '100dvh' }}>
      {isMounted && <HomePageContent />}
    </DefaultLayout>
  )
}

const hubId = env.NEXT_PUBLIC_MAIN_SPACE_ID
const chatId = env.NEXT_PUBLIC_MAIN_CHAT_ID

function HomePageContent() {
  const [homePageView, setHomePageView] = useState<HomePageView>(() => {
    const tab = getUrlQuery('tab')
    if (tab === 'top-memes' || tab === 'stats') {
      return tab
    }
    return 'stats'
  })

  return (
    <>
      <PostCreationButton />
      <Container className='grid flex-1 items-start gap-4 px-0 lg:grid-cols-[1fr_472px] lg:pr-3'>
        <ChatContent
          hubId={hubId}
          chatId={chatId}
          className={cx({ ['hidden lg:flex']: homePageView === 'stats' })}
        />
        <MainContent
          className={cx({ ['hidden lg:flex']: homePageView === 'top-memes' })}
        />
      </Container>
      <MobileNavigation
        setHomePageView={setHomePageView}
        homePageView={homePageView}
      />
    </>
  )
}

function PostCreationButton() {
  const { mutate: upsertPost } = useUpsertPost()
  const { mutateAsync: upsertSpace } = useUpsertSpace()
  const [spaceId, setSpaceId] = useState('')
  const [postTitle, setPostTitle] = useState('')
  return (
    <div className='mt-12 flex flex-col gap-4'>
      <Button
        onClick={() => {
          upsertSpace(
            augmentDatahubParams({
              content: {
                name: 'Test space',
              },
            })
          )
        }}
      >
        Create space
      </Button>
      <input value={spaceId} onChange={(e) => setSpaceId(e.target.value)} />
      <input value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
      <Button
        onClick={() => {
          upsertPost(
            augmentDatahubParams({
              title: postTitle,
              image: '',
              spaceId,
            })
          )
        }}
      >
        create post
      </Button>
    </div>
  )
}
