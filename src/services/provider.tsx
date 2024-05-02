import {
  Hydrate,
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useState } from 'react'

export let queryClient: QueryClient | null = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
})
if (isServer) {
  queryClient = null
}

export function QueryProvider({
  dehydratedState,
  children,
}: {
  dehydratedState: any
  children: any
}) {
  const [client] = useState(() => queryClient)

  return (
    <QueryClientProvider client={client || new QueryClient()}>
      <Hydrate state={dehydratedState}>{children}</Hydrate>
    </QueryClientProvider>
  )
}
