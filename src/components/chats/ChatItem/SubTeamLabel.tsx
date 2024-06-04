import useIsModerationAdmin from '@/hooks/useIsModerationAdmin'
import { cx } from '@/utils/class-names'

export default function SubTeamLabel({
  address,
  className,
}: {
  address: string
  className?: string
}) {
  const isAdmin = useIsModerationAdmin(address)
  if (!isAdmin) return null

  return (
    <div
      className={cx(
        'rounded-full bg-background px-2 py-0.5 dark:bg-[#0F172A80]',
        className
      )}
    >
      <span
        className='block bg-clip-text text-xs text-transparent'
        style={{
          backgroundImage:
            'linear-gradient(94deg, #FB339E 3.57%, #DB35F8 102.73%)',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Epic Team
      </span>
    </div>
  )
}
