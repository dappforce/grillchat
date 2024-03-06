import CheckIcon from '@/assets/icons/check-icon.svg'
import { cx } from '@/utils/class-names'
import { useMemo, useRef } from 'react'

type StepperItem = {
  id: string
  label: string
  title: React.ReactNode
  isComleted: boolean
}

type StepperProps = {
  items: StepperItem[]
  className?: string
  currentStep: string
}

const Stepper = ({ items, className, currentStep }: StepperProps) => {
  return (
    <ul className={cx('relative flex w-full flex-row gap-x-2', className)}>
      {items.map((item, index) => (
        <StepperItem
          key={item.id}
          isLastElement={items.length === index + 1}
          currentStep={currentStep}
          {...item}
        />
      ))}
    </ul>
  )
}

const StepperItem = ({
  id,
  label,
  title,
  isComleted,
  currentStep,
  isLastElement,
}: StepperItem & { isLastElement: boolean; currentStep: string }) => {
  const labelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  const titleAlignment = useMemo(() => {
    if (!labelRef.current || !titleRef.current) return 0

    return (labelRef.current.offsetWidth - titleRef.current.offsetWidth) / 2
  }, [!!labelRef.current, !!titleRef.current])

  return (
    <li className={cx('group', { ['flex-1 shrink basis-0']: !isLastElement })}>
      <div className='flex items-center text-xl font-medium'>
        {isComleted ? (
          <CheckIcon
            ref={labelRef}
            className={cx(
              'h-[40px] w-[40px] [&>circle]:fill-slate-500 [&>path]:fill-white',
              'dark:[&>circle]:fill-white dark:[&>path]:fill-background-lighter'
            )}
          />
        ) : (
          <span
            ref={labelRef}
            className={cx(
              'flex h-[40px] w-[40px] items-center justify-center rounded-full ring-2 ring-inset ',
              currentStep === id || isComleted
                ? 'ring-slate-500 text-slate-500 dark:text-text dark:ring-slate-50'
                : 'text-slate-300 ring-slate-300 dark:text-slate-500 dark:ring-slate-500'
            )}
          >
            {label}
          </span>
        )}
        <div
          className={cx(
            'ms-2 h-0.5 w-full flex-1 bg-text-muted group-last:hidden',
            isComleted
              ? 'bg-slate-500 dark:bg-slate-50'
              : 'bg-slate-300 dark:bg-slate-500'
          )}
        ></div>
      </div>
      <div
        ref={titleRef}
        className='mt-3 w-fit'
        style={{ marginLeft: titleAlignment }}
      >
        <span
          className={cx(
            'text-base font-medium leading-[26px] text-text',
            currentStep === id || isComleted
              ? 'text-slate-500 dark:text-text'
              : 'darl:text-slate-500 text-slate-300'
          )}
        >
          {title}
        </span>
      </div>
    </li>
  )
}

export default Stepper
