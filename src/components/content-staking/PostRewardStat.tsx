import { getPostQuery } from '@/services/api/query'
import { getPostRewardsQuery } from '@/services/datahub/content-staking/query'
import { useFormatSUB } from '@/utils/balance'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import { TbCoins } from 'react-icons/tb'
import PopOver from '../floating/PopOver'

export type PostRewardStatProps = ComponentProps<'div'> & { postId: string }

// function generateTooltip(
//   {
//     fromCommentSuperLikes,
//     fromDirectSuperLikes,
//     fromShareSuperLikes,
//   }: PostRewards['rewardsBySource'],
//   entity: 'post' | 'comment'
// ) {
//   return (
//     <div>
//       <span>{capitalize(entity)} author rewards:</span>
//       <ul className='mb-2 pl-3'>
//         <li>
//           {formatBalance(fromDirectSuperLikes)} from direct likes on this{' '}
//           {entity}
//         </li>
//         {BigInt(fromCommentSuperLikes) > 0 && entity === 'post' && (
//           <li>
//             {formatBalance(fromCommentSuperLikes)} from the likes on comments to
//             this {entity}
//           </li>
//         )}
//         {BigInt(fromShareSuperLikes) > 0 && (
//           <li>
//             {formatBalance(fromShareSuperLikes)} from the likes on shared posts
//             of this {entity}
//           </li>
//         )}
//       </ul>
//     </div>
//   )
// }

export default function PostRewardStat({
  postId,
  ...props
}: PostRewardStatProps) {
  const { data: reward } = getPostRewardsQuery.useQuery(postId)
  const { data: post } = getPostQuery.useQuery(postId)
  const isComment = post?.struct.isComment

  const { formattedValue, tokenSymbol } = useFormatSUB({
    value: reward?.reward ?? '',
    toFixed: 2,
  })

  if (!reward?.isNotZero) return null

  return (
    <div {...props} className={cx('text-sm', props.className)}>
      <div className='flex items-center gap-1.5 text-text-muted'>
        <div className='relative flex items-center'>
          <TbCoins className='FontNormal' />
        </div>
        <PopOver
          trigger={
            <span className=''>
              {formattedValue} {tokenSymbol}
            </span>
          }
        >
          asdfsd
        </PopOver>
      </div>
    </div>
  )
}
