import { getSubstrateApi, SubsocialApi } from '@subsocial/api'

export interface SubsocialConnectionConfig {
  substrateUrl: string
  ipfsNodeUrl: string
  postConnectConfig?: (api: SubsocialApi) => void
}

const DEFAULT_STAGING_CONFIG: SubsocialConnectionConfig = {
  substrateUrl: 'wss://rco-para.subsocial.network',
  ipfsNodeUrl: 'https://gw.crustfiles.app',
  postConnectConfig: (api) => {
    api.ipfs.setWriteHeaders({
      authorization: 'Basic ' + CRUST_TEST_AUTH_KEY,
    })
  },
}
const DEFAULT_PROD_CONFIG: SubsocialConnectionConfig = {
  substrateUrl: 'wss://para.f3joule.space',
  ipfsNodeUrl: 'https://gw.crustfiles.app',
  postConnectConfig: (api) => {
    api.ipfs.setWriteHeaders({
      authorization: 'Basic ' + CRUST_TEST_AUTH_KEY,
    })
  },
}

export const CRUST_TEST_AUTH_KEY =
  'c3ViLTVGQTluUURWZzI2N0RFZDhtMVp5cFhMQm52TjdTRnhZd1Y3bmRxU1lHaU45VFRwdToweDEwMmQ3ZmJhYWQwZGUwNzFjNDFmM2NjYzQzYmQ0NzIxNzFkZGFiYWM0MzEzZTc5YTY3ZWExOWM0OWFlNjgyZjY0YWUxMmRlY2YyNzhjNTEwZGY4YzZjZTZhYzdlZTEwNzY2N2YzYTBjZjM5OGUxN2VhMzAyMmRkNmEyYjc1OTBi' // can only be used for testnet.

let subsocialApi: Promise<SubsocialApi> | null = null
const presets = {
  staging: DEFAULT_STAGING_CONFIG,
  prod: DEFAULT_PROD_CONFIG,
}
const DEFAULT_CONFIG_PRESET: keyof typeof presets = 'staging'

let config: SubsocialConnectionConfig = presets[DEFAULT_CONFIG_PRESET]
export function getConnectionConfig() {
  return config
}
export const setSubsocialConfig = (
  preset: keyof typeof presets,
  customConfig?: Partial<SubsocialConnectionConfig>
) => {
  config = { ...presets[preset], ...customConfig }
}

export const getSubsocialApi = async (renew?: boolean) => {
  if (subsocialApi && !renew) return subsocialApi
  const api = connectToSubsocialApi(config)
  subsocialApi = api
  return subsocialApi
}

async function connectToSubsocialApi(config: SubsocialConnectionConfig) {
  const { ipfsNodeUrl, substrateUrl, postConnectConfig } = config
  const substrateApi = await getSubstrateApi(substrateUrl)
  const api = new SubsocialApi({
    ipfsNodeUrl,
    substrateApi,
    useServer: {
      httpRequestMethod: 'get',
    },
  })
  postConnectConfig && postConnectConfig(api)
  return api
}
