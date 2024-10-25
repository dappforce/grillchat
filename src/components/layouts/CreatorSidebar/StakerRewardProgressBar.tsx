import { getRewardReportQuery } from '@/old/services/datahub/content-staking/query'
import { useMyMainAddress } from '@/stores/my-account'
import clsx from 'clsx'
import { ComponentProps } from 'react'
import { CREATORS_CONSTANTS } from './utils'

const { SUPER_LIKES_FOR_MAX_REWARD } = CREATORS_CONSTANTS

export type StakerRewardProgressBarProps = Omit<
  ComponentProps<'div'>,
  'size'
> & {
  size?: 'small' | 'default'
}

export default function StakerRewardProgressBar({
  size = 'default',
  ...props
}: StakerRewardProgressBarProps) {
  const myAddress = useMyMainAddress() ?? ''
  const { data } = getRewardReportQuery.useQuery(myAddress)

  const likeCount = data?.superLikesCount ?? 0

  let progress = (likeCount / SUPER_LIKES_FOR_MAX_REWARD) * 100
  let strokeColor = '#D232CF'
  if (progress >= 100) {
    strokeColor = '#32D255'
  }

  return (
    <div
      {...props}
      className={clsx(
        'grid gap-0.5 transition-all duration-[500ms]',
        props.className
      )}
      style={{
        ...props.style,
        gridTemplateColumns:
          progress <= 100 ? '1fr' : `1fr ${(progress - 100) / 100}fr`,
      }}
    >
      <div
        className='relative grid h-2 rounded-full bg-[#CBD5E1]'
        style={{ gridTemplateColumns: `${progress}fr ${100 - progress}fr` }}
      >
        <div
          style={{ background: strokeColor }}
          className='h-full rounded-full'
        />
      </div>
      {progress > 100 && <div className='h-2 rounded-full bg-[#5089F8]' />}
    </div>
  )
}
