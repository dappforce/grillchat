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
  label,
  title,
  isComleted,
  isLastElement,
}: StepperItem & { isLastElement: boolean, currentStep: string }) => {
  const labelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  const titleAlignment = useMemo(() => {
    if (!labelRef.current || !titleRef.current) return 0

    return (labelRef.current.offsetWidth - titleRef.current.offsetWidth) / 2
  }, [!!labelRef.current, !!titleRef.current])

  return (
    <li className={cx('group', { ['flex-1 shrink basis-0']: !isLastElement })}>
      <div className='flex items-center text-xl font-medium'>
        <span
          ref={labelRef}
          className={cx(
            'flex h-[40px] w-[40px] items-center justify-center rounded-full ring ring-inset ring-slate-50'
          )}
        >
          {label}
        </span>
        <div className='ms-2 h-px w-full flex-1 bg-text-muted group-last:hidden'></div>
      </div>
      <div
        ref={titleRef}
        className='mt-3 w-fit'
        style={{ marginLeft: titleAlignment }}
      >
        <span className='text-base font-medium leading-[26px] text-text'>
          {title}
        </span>
      </div>
    </li>
  )
}

export default Stepper
