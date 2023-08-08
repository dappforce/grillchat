import { getApiPromiseInstance } from '@/subsocial-query/subsocial/connection'
import { cx } from '@/utils/class-names'
import { ComponentProps, useEffect, useState } from 'react'

export type NetworkStatusProps = ComponentProps<'div'>

export default function NetworkStatus({ ...props }: NetworkStatusProps) {
  const [status, setStatus] = useState<'connecting' | 'error' | 'connected'>(
    'connecting'
  )

  useEffect(() => {
    ;(async () => {
      const api = await getApiPromiseInstance()
      if (!api) return

      api.on('error', () => setStatus('error'))
      api.on('disconnected', () => setStatus('connecting'))

      api.on('connected', () => setStatus('connected'))
      api.on('ready', () => setStatus('connected'))
    })()
  }, [])

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
