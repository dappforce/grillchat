import Toast from '@/components/Toast'
import { SUBSTRATE_URL } from '@/constants/subsocial'
import {
  setSubsocialConfig,
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

setSubsocialConfig('staging', {
  substrateUrl: SUBSTRATE_URL,
  ipfsNodeUrl: 'https://ipfs.subsocial.network',
  ipfsAdminNodeUrl: 'https://gw.crustfiles.app',
})

setupTxCallbacks({
  onError: ({ error }: TxCallbackInfo) => {
    const errorMessage =
      typeof error === 'string' ? error : (error as Error)?.message
    toast.custom((t) => (
      <Toast
        t={t}
        title='Failed to send transaction'
        description={errorMessage ?? 'Please refresh the page and try again'}
        icon={(classNames) => (
          <HiOutlineExclamationTriangle className={classNames} />
        )}
      />
    ))
  },
})

const createClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      },
    },
  })
}

export function QueryProvider({
  dehydratedState,
  children,
}: {
  dehydratedState: any
  children: any
}) {
  const [client] = useState(createClient)

  return (
    <QueryClientProvider client={client}>
      <Hydrate state={dehydratedState}>{children}</Hydrate>
    </QueryClientProvider>
  )
}
