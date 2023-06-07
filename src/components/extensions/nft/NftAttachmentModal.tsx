import Button from '@/components/Button'
import Input from '@/components/inputs/Input'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import useAutofocus from '@/hooks/useAutofocus'
import useDebounce from '@/hooks/useDebounce'
import { getNftDataQuery } from '@/services/moralis/query'
import { NftProperties } from '@subsocial/api/types'
import { useEffect, useState } from 'react'
import { HiTrash } from 'react-icons/hi2'
import CommonExtensionModal from '../CommonExtensionModal'
import NftImage from './NftImage'
import { parseNftMarketplaceLink } from './utils'

export type NftAttachmentModalProps = ModalFunctionalityProps & {
  chatId: string
}

export default function NftAttachmentModal(props: NftAttachmentModalProps) {
  const { chatId, ...otherProps } = props
  const [nftLink, setNftLink] = useState('')
  const [nftLinkError, setNftLinkError] = useState(false)

  return (
    <CommonExtensionModal
      {...otherProps}
      chatId={chatId}
      disableSendButton={!nftLink || !!nftLinkError}
      title='🖼 Attach NFT'
      description='Should be a link to an NFT page from any popular marketplace, such as Opensea, Rarible or another'
    >
      <NftAttachmentModalContent
        {...props}
        nftLink={nftLink}
        nftLinkError={nftLinkError}
        setNftLinkError={setNftLinkError}
        setNftLink={setNftLink}
      />
    </CommonExtensionModal>
  )
}

type NftAttachmentModalContentProps = NftAttachmentModalProps & {
  nftLink: string
  setNftLink: (nftLink: string) => void
  nftLinkError: boolean
  setNftLinkError: (nftLink: boolean) => void
}
function NftAttachmentModalContent({
  nftLink,
  setNftLink,
  nftLinkError,
  setNftLinkError,
  ...props
}: NftAttachmentModalContentProps) {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setNftLinkError(false)
    setParsedLinkData(null)
    if (nftLink) setIsLoading(true)
  }, [nftLink, setNftLinkError])

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
      setNftLinkError(true)
    }
  }, [debouncedLink, setNftLinkError])

  const { data } = getNftDataQuery.useQuery(parsedLinkData)
  const { ref, autofocus } = useAutofocus()
  useEffect(() => {
    if (props.isOpen) autofocus()
  }, [props.isOpen, autofocus])

  return (
    <div className='flex flex-col gap-5'>
      <Input
        ref={ref}
        placeholder='Paste NFT URL'
        value={nftLink}
        onChange={(e) => setNftLink(e.target.value)}
        error={!!nftLinkError}
      />
      {nftLinkError ? (
        <div className='rounded-2xl bg-background-red px-4 py-3 text-text-red'>
          <p>😥 Sorry, error, cannot parse your NFT URL.</p>
        </div>
      ) : (
        <div className='relative aspect-square w-full'>
          {data?.image && (
            <Button
              className='absolute right-4 top-4 z-20 bg-background-light text-xl text-text-red'
              size='circle'
              onClick={() => setNftLink('')}
            >
              <HiTrash />
            </Button>
          )}
          <div className='relative h-full w-full overflow-hidden rounded-2xl'>
            {isLoading && (
              <div className='absolute inset-0 z-10 aspect-square w-full animate-pulse bg-background-lighter' />
            )}
            {data?.image && (
              <NftImage
                className='absolute inset-0'
                image={data?.image ?? ''}
                onLoad={() => setIsLoading(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
