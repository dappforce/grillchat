import { env } from '@/env.mjs'
import { createQuery } from '@/subsocial-query'
import axios from 'axios'
import urlJoin from 'url-join'

export const getDatahubHealthQuery = createQuery({
  key: 'datahubHealth',
  fetcher: async () => {
    try {
      const res = await axios.get(
        urlJoin(
          env.NEXT_PUBLIC_DATAHUB_QUERY_URL.replace(/\/graphql\/?$/, ''),
          '/healthcheck/status'
        )
      )
      return res.data.operational as boolean
    } catch {
      return false
    }
  },
})
