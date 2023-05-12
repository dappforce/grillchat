import NavbarWithSearch, {
  NavbarWithSearchProps,
} from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import useIsInIframe from '@/hooks/useIsInIframe'
import { getSpaceBySpaceIdQuery } from '@/services/subsocial/spaces'
import { cx, getCommonClassNames } from '@/utils/class-names'
import { getSpaceIds } from '@/utils/env/client'
import { getIpfsContentUrl } from '@/utils/ipfs'
import Image from 'next/image'

export type HomePageNavbarProps = {
  logo: JSX.Element
  auth: JSX.Element
  backButton: JSX.Element
  colorModeToggler: JSX.Element
  searchProps: NavbarWithSearchProps['searchProps']
  spaceId: string
  chatsCount: number
}

export default function HomePageNavbar({
  auth,
  colorModeToggler,
  backButton,
  logo,
  spaceId,
  searchProps,
  chatsCount,
}: HomePageNavbarProps) {
  const isInIframe = useIsInIframe()
  const { data: space } = getSpaceBySpaceIdQuery.useQuery(spaceId)
  const isInHub = getSpaceIds().includes(spaceId)

  let leftSection = logo
  if (isInHub && !isInIframe) {
    leftSection = (
      <div className='mr-4 flex flex-1 items-center'>
        {backButton}
        <div className='flex flex-1 items-center gap-2 overflow-hidden'>
          <Image
            className={cx(
              getCommonClassNames('chatImageBackground'),
              'rounded-xl',
              'h-9 w-9 flex-shrink-0 justify-self-end'
            )}
            width={36}
            height={36}
            src={getIpfsContentUrl(space?.content?.image ?? '')}
            alt={space?.content?.name ?? ''}
          />
          <div className='flex flex-col overflow-hidden'>
            <span className='overflow-hidden overflow-ellipsis whitespace-nowrap font-medium'>
              {space?.content?.name ?? ''}
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
