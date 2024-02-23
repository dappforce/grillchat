import { cx } from '@/utils/class-names'

type SectionWrapperProps = {
  children: React.ReactNode
  className?: string
}

export const sectionBg = 'bg-black/5 dark:bg-white/5 backdrop-blur-xl'

const SectionWrapper = ({ children, className }: SectionWrapperProps) => {
  return (
    <div className={cx('rounded-2xl ', sectionBg, className)}>{children}</div>
  )
}

export default SectionWrapper
