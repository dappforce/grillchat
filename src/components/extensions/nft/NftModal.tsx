import AutofocusWrapper from '@/components/AutofocusWrapper'
import Button from '@/components/Button'
import InfoPanel from '@/components/InfoPanel'
import TextArea from '@/components/inputs/TextArea'
import LinkText, { linkTextStyles } from '@/components/LinkText'
import MediaLoader from '@/components/MediaLoader'
import useDebounce from '@/hooks/useDebounce'
import { getNftQuery } from '@/services/api/query'
import { useExtensionModalState } from '@/stores/extension'
import { cx } from '@/utils/class-names'
import { NftProperties } from '@subsocial/api/types'
import { useEffect, useState } from 'react'
import { HiTrash } from 'react-icons/hi2'
import { ExtensionModalsProps } from '..'
import CommonExtensionModal from '../CommonExtensionModal'
import NftSupportedPlatformsModal from './NftSupportedPlatformsModal'
import { parseNftMarketplaceLink } from './utils'

export default function NftModal({ chatId, onSubmit }: ExtensionModalsProps) {
  const { closeModal, initialData, isOpen } =
    useExtensionModalState('subsocial-evm-nft')

  const [nftLink, setNftLink] = useState('')
  const [nftLinkError, setNftLinkError] = useState<string | JSX.Element>('')
  const [isOpenSupportedPlatformModal, setIsOpenSupportedPlatformModal] =
    useState<boolean>(false)

  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    setNftLinkError('')
    setParsedLinkData(null)
    if (nftLink) setShowLoading(true)
  }, [nftLink])

  useEffect(() => {
    if (isOpen) {
      setNftLink(initialData || '')
    }
  }, [isOpen, initialData])

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
            onClick={() => setIsOpenSupportedPlatformModal(true)}
          >
            See supported marketplaces and chains
          </span>
          .
        </span>
      )
    }
  }, [debouncedLink])

  const { data, isLoading } = getNftQuery.useQuery(parsedLinkData, {
    onError: () => setNftLinkError('😥 Sorry, we cannot get this NFT data'),
    retry: 0,
  })
  useEffect(() => {
    if (isLoading || !data) return
    if (!data?.image) {
      setNftLinkError(
        <span>
          😥 Sorry, we cannot get this NFT data from{' '}
          <LinkText
            href='https://www.covalenthq.com/docs/api/nft/get-nfts-for-address/'
            openInNewTab
            variant='secondary'
          >
            Covalent API
          </LinkText>
        </span>
      )
    }
  }, [isLoading, data])

  const isValidNft = !!data?.image && !showLoading

  return (
    <>
      <CommonExtensionModal
        onSubmit={onSubmit}
        closeModal={closeModal}
        isOpen={isOpen && !isOpenSupportedPlatformModal}
        size='md'
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
              onClick={() => setIsOpenSupportedPlatformModal(true)}
            >
              popular marketplaces
            </span>
            .
          </span>
        }
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
          <AutofocusWrapper autofocusInTouchDevices>
            {({ ref }) => (
              <TextArea
                value={nftLink}
                onChange={(e) => setNftLink(e.target.value)}
                error={!!nftLinkError}
                size='sm'
                rows={1}
                ref={ref}
                placeholder='Paste NFT URL'
              />
            )}
          </AutofocusWrapper>
          {nftLinkError ? (
            <InfoPanel>
              <p>{nftLinkError}</p>
            </InfoPanel>
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
                <MediaLoader
                  withSpinner
                  src={data?.image ?? ''}
                  loadingClassName='rounded-2xl'
                  className='aspect-square w-full rounded-2xl bg-background object-contain'
                  onLoad={() => setShowLoading(false)}
                />
              </div>
            )
          )}
        </div>
      </CommonExtensionModal>
      <NftSupportedPlatformsModal
        isOpen={isOpenSupportedPlatformModal}
        closeModal={() => setIsOpenSupportedPlatformModal(false)}
      />
    </>
  )
}
