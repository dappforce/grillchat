import { env } from '@/env.mjs'
import '@kiltprotocol/augment-api'
import { typesBundle } from '@kiltprotocol/type-definitions'
import { ApiPromise, HttpProvider } from '@polkadot/api'
import axios from 'axios'

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
