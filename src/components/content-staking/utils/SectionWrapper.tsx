import { cx } from '@/utils/class-names'

type SectionWrapperProps = {
  children: React.ReactNode
  className?: string
}

export const sectionBg = 'bg-white dark:bg-white/5'

const SectionWrapper = ({ children, className }: SectionWrapperProps) => {
  return (
    <div className={cx('rounded-2xl ', sectionBg, className)}>{children}</div>
  )
}

export default SectionWrapper
