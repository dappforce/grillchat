import Button from '@/components/Button'
import { ChatFormProps } from '@/components/chats/ChatForm'
import Input, { InputProps } from '@/components/inputs/Input'
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

export type NftAttachmentModalProps = ModalFunctionalityProps &
  Pick<ChatFormProps, 'chatId'>

export default function NftAttachmentModal(props: NftAttachmentModalProps) {
  const { chatId, ...otherProps } = props
  const [nftLink, setNftLink] = useState('')
  const [nftLinkError, setNftLinkError] = useState('')

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
      setNftLinkError('😥 Sorry, we cannot parse this URL.')
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
    <CommonExtensionModal
      {...otherProps}
      mustHaveMessageBody={false}
      chatId={chatId}
      disableSendButton={!isValidNft}
      title='🖼 Attach An NFT'
      description="Paste the URL of an NFT's page on any popular marketplace such as Opensea, Rarible, etc."
      onSubmit={() => setNftLink('')}
      buildAdditionalTxParams={() => {
        if (!parsedLinkData) return {}
        return {
          extensions: [{ id: 'subsocial-evm-nft', properties: parsedLinkData }],
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
              <NftImage
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
  )
}

function NftLinkInput({ ...props }: InputProps) {
  const { ref, autofocus } = useAutofocus()
  useEffect(() => {
    autofocus()
  }, [autofocus])

  return <Input {...props} ref={ref} placeholder='Paste NFT URL' />
}
