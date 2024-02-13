import { getPostQuery } from '@/services/api/query'
import { getPostRewardsQuery } from '@/services/datahub/content-staking/query'
import { formatSUB } from '@/utils/balance'
import { cx } from '@/utils/class-names'
import { capitalize } from '@/utils/strings'
import { ComponentProps } from 'react'
import { TbCoins } from 'react-icons/tb'
import PopOver from '../floating/PopOver'

export type PostRewardStatProps = ComponentProps<'div'> & { postId: string }

export default function PostRewardStat({
  postId,
  ...props
}: PostRewardStatProps) {
  const { data: reward } = getPostRewardsQuery.useQuery(postId)
  const { data: post } = getPostQuery.useQuery(postId)
  const isComment = post?.struct.isComment
  const entity = isComment ? 'comment' : 'post'

  const totalReward = formatSUB({
    value: reward?.reward ?? '',
    toFixed: 2,
  })

  const { fromCommentSuperLikes, fromDirectSuperLikes, fromShareSuperLikes } =
    reward?.rewardsBySource || {}
  const directReward = formatSUB({
    value: reward?.rewardsBySource.fromDirectSuperLikes ?? '',
    toFixed: 2,
  })
  const commentReward = formatSUB({
    value: reward?.rewardsBySource.fromCommentSuperLikes ?? '',
    toFixed: 2,
  })
  const sharesReward = formatSUB({
    value: reward?.rewardsBySource.fromShareSuperLikes ?? '',
    toFixed: 2,
  })

  if (!reward?.isNotZero) return null

  return (
    <div {...props} className={cx(props.className)}>
      <div className='flex items-center gap-1.5 text-text-muted'>
        <div className='relative flex items-center'>
          <TbCoins />
        </div>
        <PopOver
          placement='top'
          yOffset={4}
          panelSize='sm'
          trigger={<span>{totalReward} SUB</span>}
        >
          <div>
            <span>{capitalize(entity)} author rewards:</span>
            <ul className='[&>li]:flex [&>li]:items-center [&>li]:gap-1.5'>
              <li>
                <span className='h-1 w-1 rounded-full bg-text' />
                {directReward} from direct likes on this {entity}
              </li>
              {BigInt(fromCommentSuperLikes ?? '0') > 0 &&
                entity === 'post' && (
                  <li>
                    <span className='h-1 w-1 rounded-full bg-text' />
                    {commentReward} from the likes on comments to this {entity}
                  </li>
                )}
              {BigInt(fromShareSuperLikes ?? '0') > 0 && (
                <li>
                  <span className='h-1 w-1 rounded-full bg-text' />
                  {sharesReward} from the likes on shared posts of this {entity}
                </li>
              )}
            </ul>
          </div>
        </PopOver>
      </div>
    </div>
  )
}
