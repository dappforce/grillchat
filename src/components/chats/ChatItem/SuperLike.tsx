import { ButtonProps } from '@/components/Button'
import { useCreateSuperlike } from '@/services/datahub/content-staking/mutation'
import {
  getAddressLikeCountToPostQuery,
  getSuperLikeCountQuery,
} from '@/services/datahub/content-staking/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { IoDiamond, IoDiamondOutline } from 'react-icons/io5'

export type SuperLikeProps = ButtonProps & {
  messageId: string
}

export default function SuperLike({ messageId, ...props }: SuperLikeProps) {
  const { mutate: createSuperlike } = useCreateSuperlike()
  const { data: superLikeCount } = getSuperLikeCountQuery.useQuery(messageId)
  const myAddress = useMyMainAddress()
  const { data: myLike, isLoading } = getAddressLikeCountToPostQuery.useQuery({
    address: myAddress ?? '',
    postId: messageId,
  })

  const hasILiked = (myLike?.count ?? 0) > 0

  return (
    <button
      {...props}
      onClick={() => createSuperlike({ postId: messageId })}
      disabled={isLoading}
      className={cx(
        'flex items-center gap-2 rounded-full bg-background-lighter px-2 py-0.5 text-text-primary transition-colors',
        'disabled:bg-border-gray/50 disabled:text-text-muted',
        hasILiked && 'bg-background-primary text-text'
      )}
    >
      {hasILiked ? (
        <IoDiamond className='relative top-px' />
      ) : (
        <IoDiamondOutline className='relative top-px' />
      )}
      <span>{superLikeCount?.count}</span>
    </button>
  )
}
