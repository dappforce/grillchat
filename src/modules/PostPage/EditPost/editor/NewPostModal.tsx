import Button from '@/components/Button'
import FloatingMenus from '@/components/floating/FloatingMenus'
import ImageInput from '@/components/inputs/ImageInput'
import TextArea from '@/components/inputs/TextArea'
import MediaLoader from '@/components/MediaLoader'
import { MenuListProps } from '@/components/MenuList'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import SpaceAvatar from '@/components/SpaceAvatar'
import {
  getSpaceByOwnerQuery,
  getSpaceQuery,
} from '@/services/datahub/spaces/query'
import { useUpsertPost } from '@/services/subsocial/posts/mutation'
import { useMyMainAddress } from '@/stores/my-account'
import { getDeterministicId } from '@/utils/deterministic-id'
import { SpaceData } from '@subsocial/api/types'
import { isDef } from '@subsocial/utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

type NewPostModalProps = ModalFunctionalityProps & {
  spaceId?: string
}

const NewPostModal = ({ spaceId, ...props }: NewPostModalProps) => {
  const myAddress = useMyMainAddress()
  const [body, setBody] = useState<string>('')
  const [image, setImage] = useState<string>()
  const { data: defaultSpace } = getSpaceQuery.useQuery(spaceId || '')
  const { data: spaces } = getSpaceByOwnerQuery.useQuery(myAddress || '')
  const router = useRouter()
  const [selectedSpace, setSelectedSpace] = useState<SpaceData | null>(
    spaces?.[0] || null
  )

  const { mutateAsync, isLoading: isMutating } = useUpsertPost({
    onSuccess: async (_, data: any) => {
      if (!myAddress) return

      const postId = await getDeterministicId({
        account: myAddress,
        timestamp: data.timestamp.toString(),
        uuid: data.uuid,
      })

      if (postId) {
        await router.push(`/space/${spaceId}/${postId}`)
      }
    },
  })

  const onPublish = async () => {
    if (!body) return

    await mutateAsync({
      spaceId: spaceId || '',
      timestamp: Date.now(),
      uuid: crypto.randomUUID(),
      body,
      image: image || '',
      title: '',
    })
  }

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
                    className='flex w-full cursor-pointer items-center justify-between gap-1 text-text-primary'
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
        <div>
          <TextArea
            placeholder='Write something...'
            rows={6}
            variant='fill-bg'
            onChange={(e) => {
              const value = e.target.value

              setBody(value)
            }}
          />
        </div>
        {image && (
          <MediaLoader
            containerClassName='h-full w-full overflow-hidden'
            className='h-full w-full object-cover'
            src={image}
            imageOnly
          />
        )}
        <div className='flex w-full items-center justify-between gap-4'>
          <ImageInput
            image={image || ''}
            setImageUrl={(value) => setImage(value)}
            containerProps={{ className: 'w-fit' }}
            dropzoneClassName='border-none p-0 !h-auto !w-auto text-text-primary'
            withPreview={false}
          />
          <div className='flex items-center gap-4'>
            <Button
              href={`/space/${spaceId}/posts/new`}
              variant='primaryOutline'
            >
              Full Editor
            </Button>
            <Button variant='primary' disabled={!body} onClick={onPublish}>
              Publish
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default NewPostModal
