import Button from '@/components/Button'
import NavbarWithSearch, {
  NavbarWithSearchProps,
} from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import { getAliasFromSpaceId } from '@/constants/chat-room'
import { HUBS } from '@/constants/hubs'
import useIsInIframe from '@/hooks/useIsInIframe'
import { cx, getCommonClassNames } from '@/utils/class-names'
import Image from 'next/image'
import { HiOutlineChevronLeft } from 'react-icons/hi2'

export type HomePageNavbarProps = {
  logo: JSX.Element
  auth: JSX.Element
  colorModeToggler: JSX.Element
  searchProps: NavbarWithSearchProps['searchProps']
  spaceId: string
  chatsCount: number
}

export default function HomePageNavbar({
  auth,
  colorModeToggler,
  logo,
  spaceId,
  searchProps,
  chatsCount,
}: HomePageNavbarProps) {
  const isInIframe = useIsInIframe()
  const alias = getAliasFromSpaceId(spaceId)
  const relatedHub = HUBS.find(
    (hub) => hub.path === alias || hub.path === spaceId
  )

  let leftSection = logo
  if (relatedHub) {
    leftSection = (
      <div className='mr-4 flex flex-1 items-center'>
        <div className='mr-2 flex w-9 items-center justify-center'>
          <Button
            size='circle'
            href='/hubs'
            nextLinkProps={{ replace: isInIframe }}
            variant='transparent'
          >
            <HiOutlineChevronLeft />
          </Button>
        </div>
        <div className='flex flex-1 items-center gap-2 overflow-hidden'>
          <Image
            className={cx(
              getCommonClassNames('chatImageBackground'),
              'rounded-xl',
              'h-9 w-9 flex-shrink-0 justify-self-end'
            )}
            width={36}
            height={36}
            src={relatedHub.image}
            alt={relatedHub.title}
          />
          <div className='flex flex-col overflow-hidden'>
            <span className='overflow-hidden overflow-ellipsis whitespace-nowrap font-medium'>
              {relatedHub.title}
            </span>
            <span className='text-xs text-text-muted'>
              {chatsCount} chats in hub
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <NavbarWithSearch
      customContent={(searchButton) => (
        <div className='flex w-full items-center justify-between gap-2'>
          {leftSection}
          <div className='flex items-center gap-2 text-text-muted dark:text-text'>
            {searchButton}
            {colorModeToggler}
            <div className='ml-1.5'>{auth}</div>
          </div>
        </div>
      )}
      searchProps={searchProps}
    />
  )
}
