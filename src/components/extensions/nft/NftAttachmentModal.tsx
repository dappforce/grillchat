import Input from '@/components/inputs/Input'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import useDebounce from '@/hooks/useDebounce'
import { useMemo, useState } from 'react'
import CommonExtensionModal from '../CommonExtensionModal'
import { parseNftMarketplaceLink } from './utils'

export type NftAttachmentModalProps = ModalFunctionalityProps

export default function NftAttachmentModal({
  ...props
}: NftAttachmentModalProps) {
  const [nftLink, setNftLink] = useState('')
  const [nftLinkError, setNftLinkError] = useState(false)

  const debouncedLink = useDebounce(nftLink, 300)
  const parsedLinkData = useMemo(() => {
    if (!debouncedLink) return null
    setNftLinkError(true)
    return parseNftMarketplaceLink(debouncedLink)
  }, [debouncedLink])

  return (
    <CommonExtensionModal
      {...props}
      formProps={{
        chatId: '1001',
        sendButtonProps: {
          disabled: !nftLink || !!nftLinkError,
        },
      }}
      title='🖼 Attach NFT'
      description='Should be a link to an NFT page from any popular marketplace, such as Opensea, Rarible or another'
    >
      <Input
        placeholder='Paste NFT URL'
        value={nftLink}
        onChange={(e) => {
          setNftLink(e.target.value)
          setNftLinkError(false)
        }}
        error={!!nftLinkError}
      />
      {nftLinkError && (
        <div className='mt-5 rounded-2xl bg-background-red px-4 py-3 text-text-red'>
          <p>😥 Sorry, error, cannot parse your NFT URL.</p>
        </div>
      )}
    </CommonExtensionModal>
  )
}
