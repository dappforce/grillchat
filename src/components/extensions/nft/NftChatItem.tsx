import { getNftDataQuery } from '@/services/moralis/query'
import CommonChatItem, { ExtensionChatItemProps } from '../CommonChatItem'

type Props = ExtensionChatItemProps

export default function NftChatItem(props: Props) {
  const { message } = props
  const { struct, content } = message
  const { ownerId } = struct
  const { inReplyTo, body, extensions } = content || {}

  const nftProperties = extensions?.[0]?.properties
  const { data: nftData } = getNftDataQuery.useQuery(nftProperties ?? null)

  return (
    <CommonChatItem {...props}>
      {({ isMyMessage }) => (
        <div className='aspect-square w-full animate-pulse bg-background-light'></div>
      )}
    </CommonChatItem>
  )
}
