import Button from '@/components/Button'
import { ChatFormProps } from '@/components/chats/ChatForm'
import ImageLoader from '@/components/ImageLoader'
import Input, { InputProps } from '@/components/inputs/Input'
import LinkText, { linkTextStyles } from '@/components/LinkText'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import useAutofocus from '@/hooks/useAutofocus'
import useDebounce from '@/hooks/useDebounce'
import { getNftDataQuery } from '@/services/external/query'
import { cx } from '@/utils/class-names'
import { NftProperties } from '@subsocial/api/types'
import { useEffect, useState } from 'react'
import { HiArrowUpRight, HiTrash } from 'react-icons/hi2'
import CommonExtensionModal from '../CommonExtensionModal'
import { getSupportedMarketplaces, parseNftMarketplaceLink } from './utils'

export type NftAttachmentModalProps = ModalFunctionalityProps &
  Pick<ChatFormProps, 'chatId'>

export default function NftAttachmentModal(props: NftAttachmentModalProps) {
  const { chatId, ...otherProps } = props
  const [nftLink, setNftLink] = useState('')
  const [nftLinkError, setNftLinkError] = useState<string | JSX.Element>('')
  const [isOpenPopularMarketplaces, setIsOpenPopularMarketplaces] =
    useState(false)

  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    setNftLinkError('')
    setParsedLinkData(null)
    if (nftLink) setShowLoading(true)
  }, [nftLink])

  const debouncedLink = useDebounce(nftLink, 300)
  const [parsedLinkData, setParsedLinkData] = useState<NftProperties | null>(
    null
  )

  useEffect(() => {
    if (!debouncedLink) return

    try {
      const data = parseNftMarketplaceLink(debouncedLink)
      setParsedLinkData(data)
    } catch (err) {
      console.log('Error parsing nft link', err)
      setNftLinkError(
        <span>
          😥 Sorry, we cannot parse this URL.{' '}
          <span
            className={cx(linkTextStyles({ variant: 'primary' }))}
            onClick={() => setIsOpenPopularMarketplaces(true)}
          >
            See supported marketplaces
          </span>
          .
        </span>
      )
    }
  }, [debouncedLink])

  const { data, isLoading } = getNftDataQuery.useQuery(parsedLinkData, {
    onError: () => setNftLinkError('😥 Sorry, we cannot get this NFT data'),
  })
  useEffect(() => {
    if (isLoading || !data) return
    if (!data?.image) {
      setNftLinkError('😥 Sorry, we cannot get this NFT data')
    }
  }, [isLoading, data])

  const isValidNft = !!data?.image && !showLoading

  return (
    <>
      <CommonExtensionModal
        {...otherProps}
        isOpen={otherProps.isOpen && !isOpenPopularMarketplaces}
        mustHaveMessageBody={false}
        chatId={chatId}
        disableSendButton={!isValidNft}
        title='🖼 Attach An NFT'
        description={
          <span>
            Paste the URL of an NFT from{' '}
            <span
              className={cx(
                linkTextStyles({ variant: 'primary' }),
                'cursor-pointer'
              )}
              onClick={() => setIsOpenPopularMarketplaces(true)}
            >
              popular marketplaces
            </span>
            .
          </span>
        }
        onSubmit={() => setNftLink('')}
        buildAdditionalTxParams={() => {
          if (!parsedLinkData) return {}
          return {
            extensions: [
              { id: 'subsocial-evm-nft', properties: parsedLinkData },
            ],
          }
        }}
      >
        <div className='flex flex-col gap-3 md:gap-5'>
          <NftLinkInput
            value={nftLink}
            onChange={(e) => setNftLink(e.target.value)}
            error={!!nftLinkError}
          />
          {nftLinkError ? (
            <div className='rounded-2xl bg-background-red px-4 py-3 text-text-red'>
              <p>{nftLinkError}</p>
            </div>
          ) : (
            nftLink && (
              <div className='relative aspect-square w-full'>
                <Button
                  className='absolute right-4 top-4 z-20 bg-background-light text-xl text-text-red'
                  size='circle'
                  onClick={() => setNftLink('')}
                >
                  <HiTrash />
                </Button>
                <ImageLoader
                  withSpinner
                  image={data?.image ?? ''}
                  loadingClassName='rounded-2xl'
                  className='aspect-square w-full rounded-2xl bg-background object-contain'
                  onLoad={() => setShowLoading(false)}
                />
              </div>
            )
          )}
        </div>
      </CommonExtensionModal>
      <Modal
        isOpen={isOpenPopularMarketplaces}
        closeModal={() => setIsOpenPopularMarketplaces(false)}
        title='🛍️ Supported Marketplaces'
        withCloseButton
      >
        <div className='mt-2 flex flex-col gap-2'>
          {getSupportedMarketplaces().map(({ link, name }) => (
            <LinkText
              key={link}
              href={link}
              openInNewTab
              className='flex items-center gap-1'
              variant='primary'
            >
              <span>{name}</span>
              <HiArrowUpRight className='text-text-muted' />
            </LinkText>
          ))}
        </div>
      </Modal>
    </>
  )
}

function NftLinkInput({ ...props }: InputProps) {
  const { ref, autofocus } = useAutofocus()
  useEffect(() => {
    autofocus()
  }, [autofocus])

  return <Input {...props} ref={ref} placeholder='Paste NFT URL' />
}
