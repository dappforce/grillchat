import { setSubsocialConfig } from '@/subsocial-query/subsocial/config'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useState } from 'react'

setSubsocialConfig('staging', {
  substrateUrl: 'wss://xsocial.subsocial.network',
})

const createClient = () => {
  return new QueryClient({
    defaultOptions: {
      // TODO: remove this config after done develop
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
