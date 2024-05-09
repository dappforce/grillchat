import { cx } from '@/utils/class-names'
import { RadioGroup } from '@headlessui/react'
import { useRouter } from 'next/router'
import { useGetLeaderboardRole } from './utils'

const labels = ['Staker', 'Creator']

type LeaderboardRoleRadioGroupProps = {
  className?: string
}

export const LeaderboardRoleRadioGroup = ({
  className,
}: LeaderboardRoleRadioGroupProps) => {
  const router = useRouter()

  const leaderboardRole = useGetLeaderboardRole()

  const onChange = (role: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          role,
        },
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <RadioGroup
      value={leaderboardRole}
      onChange={onChange}
      className={cx(
        'flex h-[36px] items-center gap-[2px] rounded-lg bg-white px-[2px] dark:bg-white/10 md:h-[34px]',
        className
      )}
    >
      {labels.map((label, i) => (
        <RadioGroup.Option
          key={i}
          value={label.toLowerCase()}
          className='leading-none'
        >
          {({ checked }) => (
            <span
              className={cx(
                'cursor-pointer rounded-md p-2 text-sm font-medium leading-[22px]',
                {
                  ['bg-background-primary text-white']: checked,
                }
              )}
            >
              {label}
            </span>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  )
}
export default LeaderboardRoleRadioGroup
