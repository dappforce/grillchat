import Toast from '@/components/Toast'
import {
  setupTxCallbacks,
  TxCallbackInfo,
} from '@/subsocial-query/subsocial/config'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { HiOutlineExclamationTriangle } from 'react-icons/hi2'

setupTxCallbacks({
  onError: ({ error }: TxCallbackInfo) => {
    const errorMessage =
      typeof error === 'string' ? error : (error as Error)?.message
    toast.custom((t) => (
      <Toast
        t={t}
        type='error'
        title='Failed to send transaction'
        description={errorMessage ?? 'Please refresh the page and try again'}
        icon={(classNames) => (
          <HiOutlineExclamationTriangle className={classNames} />
        )}
      />
    ))
  },
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
})

export function QueryProvider({
  dehydratedState,
  children,
}: {
  dehydratedState: any
  children: any
}) {
  const [client] = useState(() => queryClient)

  return (
    <QueryClientProvider client={client}>
      <Hydrate state={dehydratedState}>{children}</Hydrate>
    </QueryClientProvider>
  )
}
