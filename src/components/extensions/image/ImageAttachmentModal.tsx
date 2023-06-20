import AutofocusWrapper from '@/components/AutofocusWrapper'
import { ChatFormProps } from '@/components/chats/ChatForm'
import TextArea from '@/components/inputs/TextArea'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import { useEffect, useState } from 'react'
import CommonExtensionModal from '../CommonExtensionModal'

export type ImageAttachmentModalProps = ModalFunctionalityProps &
  Pick<ChatFormProps, 'chatId'>

export default function ImageAttachmentModal(props: ImageAttachmentModalProps) {
  const { chatId, ...otherProps } = props

  const [imageLink, setImageLink] = useState('')
  const [isLoadedImage, setIsLoadedImage] = useState(false)

  useEffect(() => {
    if (props.isOpen) {
      setImageLink('')
      setIsLoadedImage(false)
    }
  }, [props.isOpen])

  return (
    <>
      <CommonExtensionModal
        {...otherProps}
        size='md'
        mustHaveMessageBody={false}
        chatId={chatId}
        disableSendButton={!isLoadedImage}
        title='🖼 Image'
        // buildAdditionalTxParams={() => {
        //   if (!parsedLinkData) return {}
        //   return {
        //     extensions: [
        //       { id: 'subsocial-evm-nft', properties: parsedLinkData },
        //     ],
        //   }
        // }}
      >
        <div className='flex flex-col gap-3 md:gap-5'>
          <AutofocusWrapper>
            {({ ref }) => (
              <TextArea
                {...props}
                size='sm'
                rows={1}
                ref={ref}
                placeholder='Paste NFT URL'
              />
            )}
          </AutofocusWrapper>
          {/* <NftLinkInput
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            error={!!nftLinkError}
          />
          {nftLinkError ? (
            <div className='rounded-2xl bg-background-red px-4 py-3 text-text-red'>
              <p>{nftLinkError}</p>
            </div>
          ) : (
            imageLink && (
              <div className='relative aspect-square w-full'>
                <Button
                  className='absolute right-4 top-4 z-20 bg-background-light text-xl text-text-red'
                  size='circle'
                  onClick={() => setImageLink('')}
                >
                  <HiTrash />
                </Button>
                <MediaLoader
                  withSpinner
                  image={data?.image ?? ''}
                  loadingClassName='rounded-2xl'
                  className='aspect-square w-full rounded-2xl bg-background object-contain'
                  onLoad={() => setShowLoading(false)}
                />
              </div>
            )
          )} */}
        </div>
      </CommonExtensionModal>
    </>
  )
}
