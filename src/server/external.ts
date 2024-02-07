import { env } from '@/env.mjs'
import '@kiltprotocol/augment-api'
import { typesBundle } from '@kiltprotocol/type-definitions'
import { ApiPromise, HttpProvider } from '@polkadot/api'
import axios from 'axios'
import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'

export const covalentRequest = axios.create({
  baseURL: 'https://api.covalenthq.com/v1/',
  headers: {
    Authorization: `Bearer ${env.COVALENT_API_KEY}`,
  },
})

let kiltApi: Promise<ApiPromise> | null = null
const kiltApiUrl = 'https://spiritnet.kilt.io'
export const getKiltApi = async () => {
  if (kiltApi) return kiltApi

  const provider = new HttpProvider(kiltApiUrl)
  const api = ApiPromise.create({ provider, typesBundle })
  kiltApi = api

  return api
}

export function getSubIdRequest() {
  return axios.create({ baseURL: 'https://sub.id/api/v1/' })
}

export function subsocialSquidRequest<T, V extends Variables = Variables>(
  config: RequestOptions<V, T>
) {
  const url = 'https://squid.subsquid.io/subsocial/graphql'

  const SQUID_TIMEOUT = 3 * 1000 // 3 seconds
  const client = new GraphQLClient(url, {
    timeout: SQUID_TIMEOUT,
    ...config,
  })

  return client.request({ url, ...config })
}
