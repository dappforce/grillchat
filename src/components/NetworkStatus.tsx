import useNetworkStatus from '@/hooks/useNetworkStatus'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type NetworkStatusProps = ComponentProps<'div'>

export default function NetworkStatus({ ...props }: NetworkStatusProps) {
  const { status } = useNetworkStatus()

  return (
    <div
      {...props}
      className={cx(
        'h-2 w-2 rounded-full',
        {
          'bg-orange-500': status === 'connecting',
          'bg-background-red': status === 'error',
          'bg-green-600': status === 'connected',
        },
        props.className
      )}
    />
  )
}
