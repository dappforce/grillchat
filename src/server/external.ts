import { getCovalentApiKey } from '@/utils/env/server'
import '@kiltprotocol/augment-api'
import { typesBundle } from '@kiltprotocol/type-definitions'
import { ApiPromise, HttpProvider } from '@polkadot/api'
import axios from 'axios'

export const covalentRequest = axios.create({
  baseURL: 'https://api.covalenthq.com/v1/',
  headers: {
    Authorization: `Bearer ${getCovalentApiKey()}`,
  },
})

let polkadotApi: Promise<ApiPromise> | null = null
const polkadotApiUrl = 'https://rpc.polkadot.io'
export const getPolkadotApi = async () => {
  if (polkadotApi) return polkadotApi

  const provider = new HttpProvider(polkadotApiUrl)
  const api = ApiPromise.create({ provider })
  polkadotApi = api

  return api
}

let kiltApi: Promise<ApiPromise> | null = null
const kiltApiUrl = 'https://spiritnet.kilt.io'
export const getKiltApi = async () => {
  if (kiltApi) return kiltApi

  const provider = new HttpProvider(kiltApiUrl)
  const api = ApiPromise.create({ provider, typesBundle })
  kiltApi = api

  return api
}
