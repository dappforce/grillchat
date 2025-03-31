import FloatingMenus from '@/components/floating/FloatingMenus'
import { MenuListProps } from '@/components/MenuList'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import SpaceAvatar from '@/components/SpaceAvatar'
import {
  getSpaceByOwnerQuery,
  getSpaceQuery,
} from '@/services/datahub/spaces/query'
import { useMyMainAddress } from '@/stores/my-account'
import { SpaceData } from '@subsocial/api/types'
import { isDef } from '@subsocial/utils'
import { useEffect, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

type NewPostModalProps = ModalFunctionalityProps & {
  spaceId?: string
}

const NewPostModal = ({ spaceId, ...props }: NewPostModalProps) => {
  const myAddress = useMyMainAddress()
  const { data: defaultSpace } = getSpaceQuery.useQuery(spaceId || '')
  const { data: spaces } = getSpaceByOwnerQuery.useQuery(myAddress || '')
  const [selectedSpace, setSelectedSpace] = useState<SpaceData | null>(
    spaces?.[0] || null
  )

  useEffect(() => {
    if (spaceId && defaultSpace) {
      setSelectedSpace(defaultSpace)
    }
  }, [spaceId, defaultSpace])

  const menuItems =
    spaces
      ?.map((space) => ({
        text: (
          <div className='flex items-center gap-3'>
            <SpaceAvatar space={space} className='h-[32px] w-[32px]' />
            <span>{space?.content?.name || 'Select space'}</span>
          </div>
        ),
        onClick: () => {
          setSelectedSpace(space)
        },
      }))
      .filter(isDef) || ([] as MenuListProps['menus'])

  return (
    <Modal {...props} withCloseButton>
      <div className='mt-4 flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
          <div className='flex flex-col gap-1'>
            <FloatingMenus
              menus={menuItems}
              allowedPlacements={['bottom-start']}
              mainAxisOffset={4}
              panelSize='xs'
            >
              {(config) => {
                const { referenceProps, toggleDisplay } = config || {}
                if (!selectedSpace) return <></>

                return (
                  <div
                    {...referenceProps}
                    onClick={toggleDisplay}
                    className='flex cursor-pointer items-center justify-between gap-1 text-text-primary'
                  >
                    <div className='flex items-center gap-3'>
                      <SpaceAvatar
                        space={selectedSpace}
                        className='h-[32px] w-[32px]'
                      />
                      <span>
                        {selectedSpace?.content?.name || 'Select space'}
                      </span>
                    </div>
                    <IoIosArrowDown className='text-text-muted' />
                  </div>
                )
              }}
            </FloatingMenus>
          </div>
        </div>
        <div>Hello</div>
      </div>
    </Modal>
  )
}

export default NewPostModal
