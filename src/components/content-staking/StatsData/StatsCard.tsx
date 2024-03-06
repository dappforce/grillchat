import PopOver from '@/components/floating/PopOver'
import { FiInfo } from 'react-icons/fi'
import { cx } from '../../../utils/class-names'
import { mutedTextColorStyles } from '../utils/commonStyles'

type StatsCardProps = {
  title: React.ReactNode
  desc: React.ReactNode
  subDesc?: React.ReactNode
  tooltipText?: React.ReactNode
  titleClassName?: string
  sectionClassName?: string
}

const StatsCard = (props: StatsCardProps) => {
  return (
    <div
      className={cx(
        'flex w-full flex-col items-center gap-2 rounded-2xl p-4',
        'bg-slate-50 backdrop-blur-xl dark:bg-white/5',
        props.sectionClassName
      )}
    >
      <StatsCardContent {...props} />
    </div>
  )
}

export const StatsCardContent = ({
  title,
  desc,
  subDesc,
  tooltipText,
  titleClassName,
}: StatsCardProps) => {
  return (
    <>
      <div
        className={cx(
          'text-base font-normal leading-[22px]',
          mutedTextColorStyles
        )}
      >
        {tooltipText ? (
          <PopOver
            trigger={
              <div className={cx('flex items-center gap-2')}>
                {title}
                <FiInfo className='block text-xs' />
              </div>
            }
            panelSize='sm'
            triggerClassName={titleClassName}
            yOffset={4}
            placement='top'
            triggerOnHover
          >
            {tooltipText}
          </PopOver>
        ) : (
          title
        )}
      </div>
      <div className='text-xl font-semibold leading-8 text-text md:text-2xl'>
        {desc}
      </div>
      {subDesc && (
        <div
          className={cx(
            'text-base font-normal leading-none',
            mutedTextColorStyles
          )}
        >
          {subDesc}
        </div>
      )}
    </>
  )
}

export default StatsCard
