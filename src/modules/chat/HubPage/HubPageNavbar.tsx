import Button from '@/components/Button'
import ChatImage from '@/components/chats/ChatImage'
import AboutHubModal from '@/components/modals/about/AboutHubModal'
import NavbarWithSearch, {
  NavbarWithSearchProps,
} from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import { env } from '@/env.mjs'
import useIsInIframe from '@/hooks/useIsInIframe'
import { getSpaceQuery } from '@/services/datahub/spaces/query'
import { ReactNode, useState } from 'react'

export type HubPageNavbarProps = {
  logo: ReactNode
  auth: ReactNode
  hamburgerMenu: ReactNode
  backButton: ReactNode
  notificationBell: ReactNode
  newPostButton: ReactNode
  searchProps: NavbarWithSearchProps['searchProps']
  hubId: string
  chatsCount: number
}

export default function HubPageNavbar({
  auth,
  notificationBell,
  backButton,
  hamburgerMenu,
  logo,
  hubId,
  searchProps,
  chatsCount,
}: HubPageNavbarProps) {
  const [isOpenAboutModal, setIsOpenAboutModal] = useState(false)

  const isInIframe = useIsInIframe()
  const { data: space } = getSpaceQuery.useQuery(hubId)
  const isInHub = env.NEXT_PUBLIC_SPACE_IDS.includes(hubId)

  const content = space?.content

  let leftSection = logo
  if (isInHub && !isInIframe) {
    leftSection = (
      <div className='flex flex-1 items-center'>
        {/* {backButton} */}
        {hamburgerMenu}
        <div className='hidden w-[225px] md:block'>{logo}</div>
        <Button
          variant='transparent'
          interactive='none'
          size='noPadding'
          className='flex flex-1 items-center gap-2 overflow-hidden rounded-none text-left md:pl-2'
          onClick={() => setIsOpenAboutModal(true)}
        >
          <ChatImage
            chatId={hubId}
            className='h-9 w-9 justify-self-end'
            rounding='xl'
            image={content?.image}
            chatTitle={content?.name}
          />
          <div className='flex flex-col overflow-hidden'>
            <span className='overflow-hidden overflow-ellipsis whitespace-nowrap font-medium'>
              {content?.name ?? ''}
            </span>
            <span className='overflow-hidden overflow-ellipsis whitespace-nowrap text-xs text-text-muted'>
              {chatsCount} chats in hub
            </span>
          </div>
        </Button>
      </div>
    )
  }

  return (
    <>
      <NavbarWithSearch
        customContent={(searchButton) => (
          <div className='flex w-full justify-between gap-2'>
            {leftSection}
            <div className='flex items-center gap-1 text-text-muted dark:text-text'>
              {searchButton}
              {notificationBell}
              <div className='ml-2'>{auth}</div>
            </div>
          </div>
        )}
        searchProps={searchProps}
      />
      <AboutHubModal
        isOpen={isOpenAboutModal}
        closeModal={() => setIsOpenAboutModal(false)}
        hubId={hubId}
        chatCount={chatsCount}
      />
    </>
  )
}
