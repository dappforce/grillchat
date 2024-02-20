import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type UsersSectionProps = ComponentProps<'section'>

export default function UsersSection({ ...props }: UsersSectionProps) {
  return (
    <section {...props} className={cx(props.className)}>
      <div className='p-96'>asdfasdf</div>
    </section>
  )
}
