import { getMessageExtensionProperties } from '@/components/extensions/utils'
import MediaLoader from '@/components/MediaLoader'
import useIsMessageBlocked from '@/hooks/useIsMessageBlocked'
import { getNftQuery } from '@/services/api/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import useLastMessage from './hooks/useLastMessage'

export type ChatLastMessageProps = ComponentProps<'div'> & {
  hubId: string
  chatId: string
  defaultDesc: string
}

export default function ChatLastMessage({
  hubId,
  chatId,
  defaultDesc,
  ...props
}: ChatLastMessageProps) {
  const { data: messageIds } = useCommentIdsByPostId(chatId)

  const { data: lastMessage } = useLastMessage(chatId)
  const isMessageBlocked = useIsMessageBlocked(hubId, lastMessage, chatId)

  const defaultDescOrMessageCount =
    defaultDesc || `${messageIds?.length} messages`

  // TODO: extract to better flexibility for other extensions
  const extensions = lastMessage?.content?.extensions
  const firstExtension = extensions?.[0]
  const hasNftExtension =
    firstExtension && firstExtension.id === 'subsocial-evm-nft'

  const lastMessageContent =
    lastMessage?.content?.body || (hasNftExtension ? 'NFT' : defaultDesc)

  const { data: nftData } = getNftQuery.useQuery(
    getMessageExtensionProperties(firstExtension, 'subsocial-evm-nft')
  )

  const showedText = isMessageBlocked
    ? defaultDescOrMessageCount
    : lastMessageContent

  if (nftData) {
    return (
      <div
        {...props}
        className={cx(
          'flex items-center gap-1.5 overflow-hidden overflow-ellipsis',
          props.className
        )}
      >
        {!isMessageBlocked && hasNftExtension && (
          <MediaLoader
            height={24}
            width={24}
            containerClassName={cx('rounded-sm overflow-hidden flex-shrink-0')}
            className={cx('aspect-square w-4')}
            placeholderClassName={cx('w-4 aspect-square')}
            src={nftData?.image}
          />
        )}
        <p
          className={cx(
            'overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-text-muted',
            props.className
          )}
        >
          {showedText}
        </p>
      </div>
    )
  }

  return (
    <p
      {...props}
      className={cx(
        'overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-text-muted',
        props.className
      )}
    >
      {showedText}
    </p>
  )
}
