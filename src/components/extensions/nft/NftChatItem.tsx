import Button from '@/components/Button'
import { getNftDataQuery } from '@/services/moralis/query'
import { cx } from '@/utils/class-names'
import CommonChatItem, { ExtensionChatItemProps } from '../CommonChatItem'
import NftImage from './NftImage'

type Props = ExtensionChatItemProps

export default function NftChatItem(props: Props) {
  const { message } = props
  const { struct, content } = message
  const { ownerId } = struct
  const { inReplyTo, body, extensions } = content || {}

  const nftProperties = extensions?.[0]?.properties
  const { data: nftData } = getNftDataQuery.useQuery(nftProperties ?? null)

  return (
    <CommonChatItem
      {...props}
      myMessageConfig={{ children: 'bottom', checkMark: 'outside' }}
    >
      {({ isMyMessage }) => (
        <div className='not:first:mt-1 flex flex-col'>
          <div className='relative flex w-full items-center justify-center'>
            <NftImage
              className='max-h-[340px] w-full min-w-[230px] rounded-[4px] object-contain'
              image={nftData?.image ?? ''}
            />
            <span className='absolute right-2 top-2 rounded-full bg-text-dark/50 px-2 py-0.5 text-xs text-text-muted'>
              NFT
            </span>
          </div>
          <div className='mt-1.5 flex flex-col gap-1 px-2.5'>
            <div className='flex items-center justify-between gap-2'>
              <span>{nftData?.name ?? nftData?.collectionName}</span>
              <span className='text-xs'>#{nftProperties?.nftId}</span>
            </div>
            <div
              className={cx(
                'flex items-center justify-between text-xs',
                isMyMessage ? 'text-text-muted-on-primary' : 'text-text-muted'
              )}
            >
              <span>{nftData?.collectionName}</span>
              <span>{nftData?.price}</span>
            </div>
            <Button
              className='my-2 mb-3'
              variant={isMyMessage ? 'whiteOutline' : 'primaryOutline'}
              href={nftProperties?.url ?? ''}
              target='_blank'
              rel='noopener noreferrer'
            >
              View on Marketplace
            </Button>
          </div>
        </div>
      )}
    </CommonChatItem>
  )
}
