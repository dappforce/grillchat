import useNetworkStatus from '@/hooks/useNetworkStatus'
import { useMessageData } from '@/stores/message'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type NetworkStatusProps = ComponentProps<'div'>

export default function NetworkStatus({ ...props }: NetworkStatusProps) {
  const { status } = useNetworkStatus()
  const doing = useMessageData((state) => state.doing)

  return (
    <>
      <div
        {...props}
        className={cx(
          'h-2 w-2 rounded-full',
          {
            'bg-orange-500': status === 'connecting',
            'bg-red-500': status === 'error',
            'bg-green-600': status === 'connected',
          },
          props.className
        )}
      />
      <span>{doing}</span>
    </>
  )
}
