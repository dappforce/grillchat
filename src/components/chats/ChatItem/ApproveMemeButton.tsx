import Button from '@/components/Button'
import { useApproveMessage } from '@/services/datahub/posts/mutation'
import { getIsContestEnded, getIsInContest } from '@/utils/contest'
import { IoCheckmarkCircle } from 'react-icons/io5'

export default function ApproveMemeButton({
  messageId,
  chatId,
}: {
  chatId: string
  messageId: string
}) {
  const { mutate, isLoading } = useApproveMessage()
  const isInContest = getIsInContest(chatId)
  const isContestEnded = getIsContestEnded()
  const isInEndedContest = isInContest && isContestEnded

  return (
    <Button
      variant='greenOutline'
      size='sm'
      className='flex items-center justify-center gap-2 whitespace-nowrap px-0 text-sm disabled:!border-text-muted disabled:!text-text-muted disabled:!ring-text-muted'
      loadingText='Approving...'
      isLoading={isLoading}
      disabled={isInEndedContest}
      onClick={(e) => {
        e.stopPropagation()
        mutate({
          approvedInRootPost: true,
          postId: messageId,
        })
      }}
    >
      <IoCheckmarkCircle />
      <span>Approve</span>
    </Button>
  )
}
