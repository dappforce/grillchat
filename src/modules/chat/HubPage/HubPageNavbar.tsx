import Button from '@/components/Button'
import ChatImage from '@/components/chats/ChatImage'
import AboutHubModal from '@/components/modals/about/AboutHubModal'
import NavbarWithSearch, {
  NavbarWithSearchProps,
} from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import useIsInIframe from '@/hooks/useIsInIframe'
import { getSpaceQuery } from '@/services/subsocial/spaces'
import { getHubIds } from '@/utils/env/client'
import { useState } from 'react'

export type HubPageNavbarProps = {
  logo: JSX.Element
  auth: JSX.Element
  backButton: JSX.Element
  notificationBell: JSX.Element
  searchProps: NavbarWithSearchProps['searchProps']
  hubId: string
  chatsCount: number
}

export default function HubPageNavbar({
  auth,
  notificationBell,
  backButton,
  logo,
  hubId,
  searchProps,
  chatsCount,
}: HubPageNavbarProps) {
  const [isOpenAboutModal, setIsOpenAboutModal] = useState(false)

  const isInIframe = useIsInIframe()
  const { data: space } = getSpaceQuery.useQuery(hubId)
  const isInHub = getHubIds().includes(hubId)

  const content = space?.content

  let leftSection = logo
  if (isInHub && !isInIframe) {
    leftSection = (
      <div className='flex flex-1 items-center overflow-hidden'>
        {backButton}
        <Button
          variant='transparent'
          interactive='none'
          size='noPadding'
          className='flex flex-1 items-center gap-2 overflow-hidden rounded-none text-left'
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
            <span className='text-xs text-text-muted'>
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
          <div className='flex w-full justify-between gap-2 overflow-hidden'>
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
