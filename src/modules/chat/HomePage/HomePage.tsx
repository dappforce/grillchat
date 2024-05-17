import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { env } from '@/env.mjs'
import useIsMounted from '@/hooks/useIsMounted'
import { cx } from '@/utils/class-names'
import { getUrlQuery } from '@/utils/links'
import { useState } from 'react'
import ChatContent from './ChatContent'
import MobileNavigation, { HomePageView } from './MobileNavigation'
import MainContent from './epic-leaderboard/MainContent'

export default function HomePage() {
  const isMounted = useIsMounted()
  return (
    <DefaultLayout className='relative'>
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
      {/* <PostCreationButton /> */}
      <Container className='grid flex-1 gap-4 px-0 lg:grid-cols-[1fr_472px] lg:pr-3'>
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

// function PostCreationButton() {
//   const { mutate: upsertPost } = useUpsertPost()
//   const { mutateAsync: upsertSpace } = useUpsertSpace()
//   return (
//     <Button
//       onClick={() => {
//         // upsertSpace(
//         //   augmentDatahubParams({
//         //     content: {
//         //       name: 'Test space',
//         //     },
//         //   })
//         // )
//         // upsertPost(
//         //   augmentDatahubParams({
//         //     spaceId: '0x7ce43c2015d61d3010563285d26aadcd',
//         //     '0xdd4078ca9f42a17dc9501c3a84f3748a'
//         //     title: 'Post testing',
//         //     image: '',
//         //   })
//         // )
//       }}
//     >
//       Create post
//     </Button>
//   )
// }
