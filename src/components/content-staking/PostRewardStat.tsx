import { getPostQuery } from '@/services/api/query'
import { getPostRewardsQuery } from '@/services/datahub/content-staking/query'
import { formatSUB } from '@/utils/balance'
import { cx } from '@/utils/class-names'
import capitalize from 'lodash.capitalize'
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
    toPrecision: 2,
  })

  const { fromCommentSuperLikes, fromDirectSuperLikes, fromShareSuperLikes } =
    reward?.rewardsBySource || {}
  const directReward = formatSUB({
    value: fromDirectSuperLikes ?? '',
    toPrecision: 2,
  })
  const commentReward = formatSUB({
    value: fromCommentSuperLikes ?? '',
    toPrecision: 2,
  })
  const sharesReward = formatSUB({
    value: fromShareSuperLikes ?? '',
    toPrecision: 2,
  })

  if (!reward?.isNotZero) return null

  return (
    <div {...props} className={cx(props.className)}>
      <div className='flex items-center gap-1.5 text-text-muted'>
        <div className='relative flex items-center'>
          {BigInt(reward.rewardDetail.draftReward) > 0 ? (
            <PopOver
              triggerOnHover
              panelSize='sm'
              trigger={
                <div className='flex items-center'>
                  <TbCoins />
                  <div className='absolute right-0 top-0 h-1 w-1 rounded-full bg-[#F8963A]' />
                </div>
              }
            >
              <span>
                {BigInt(reward.rewardDetail.finalizedReward) > 0 && (
                  <>
                    {formatSUB({
                      value: reward.rewardDetail.finalizedReward,
                      toPrecision: 2,
                    })}{' '}
                    SUB earned +{' '}
                  </>
                )}
                {formatSUB({
                  value: reward.rewardDetail.draftReward,
                  toPrecision: 2,
                })}{' '}
                approx. today
              </span>
            </PopOver>
          ) : (
            <TbCoins />
          )}
        </div>
        <PopOver
          placement='top'
          yOffset={4}
          panelSize='sm'
          triggerOnHover
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
