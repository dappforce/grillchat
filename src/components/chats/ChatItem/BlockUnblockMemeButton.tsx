import Button from '@/components/Button'
import useAuthorizedForModeration from '@/hooks/useAuthorizedForModeration'
import useIsMessageBlocked from '@/hooks/useIsMessageBlocked'
import { getModerationReasonsQuery } from '@/services/datahub/moderation/query'
import { cx } from '@/utils/class-names'
import { PostData } from '@subsocial/api/types'
import { IoCloseCircle } from 'react-icons/io5'
import { useModerateWithSuccessToast } from './ChatItemMenus'

export default function BlockUnblockMemeButton({
  hubId,
  chatId,
  message,
}: {
  hubId: string
  chatId: string
  message: PostData
}) {
  const { isAuthorized } = useAuthorizedForModeration(chatId)
  const { mutate: moderate, isLoading: loadingModeration } =
    useModerateWithSuccessToast(message.id, chatId)
  const isMessageBlocked = useIsMessageBlocked(hubId, message, chatId)

  const { data: reasons } = getModerationReasonsQuery.useQuery(null)
  const firstReasonId = reasons?.[0].id

  if (!isAuthorized) return null

  return (
    <Button
      variant='redOutline'
      isLoading={loadingModeration}
      loadingText={isMessageBlocked ? 'Unblocking...' : 'Blocking...'}
      onClick={(e) => {
        e.stopPropagation()
        if (isMessageBlocked) {
          moderate({
            callName: 'synth_moderation_unblock_resource',
            args: {
              resourceId: message.id,
              ctxPostIds: ['*'],
              ctxAppIds: ['*'],
            },
            chatId,
            isUndo: true,
          })
        } else {
          moderate({
            callName: 'synth_moderation_block_resource',
            args: {
              reasonId: firstReasonId,
              resourceId: message.id,
              ctxPostIds: ['*'],
              ctxAppIds: ['*'],
            },
            chatId,
          })
        }
      }}
      size='sm'
      className={cx(
        'flex w-full items-center justify-center gap-2 whitespace-nowrap px-0 text-center text-sm !text-text-red',
        {
          ['border-transparent bg-[#EF4444] !text-white ring-0']:
            isMessageBlocked,
        }
      )}
    >
      <IoCloseCircle />
      {isMessageBlocked ? 'Unblock' : 'Block'}
    </Button>
  )
}
