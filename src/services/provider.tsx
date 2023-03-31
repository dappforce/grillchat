import { SUBSTRATE_URL } from '@/constants/subsocial'
import { setSubsocialConfig } from '@/subsocial-query/subsocial/config'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useState } from 'react'

setSubsocialConfig('staging', {
  substrateUrl: SUBSTRATE_URL,
  ipfsNodeUrl: 'https://ipfs.subsocial.network',
  ipfsAdminNodeUrl: 'https://gw.crustfiles.app',
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
