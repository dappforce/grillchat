import type { WsProvider } from '@polkadot/api'
import { type SubsocialApi } from '@subsocial/api'
import { getConnectionConfig, SubsocialConnectionConfig } from './config'

let subsocialApi: Promise<SubsocialApi> | null = null
let provider: Promise<WsProvider> | null = null
const getApiWithProvider = async (renew?: boolean) => {
  if (subsocialApi && !renew) return { subsocialApi, provider }

  const apiWithProvider = connectToSubsocialApi(getConnectionConfig())
  subsocialApi = apiWithProvider.then(({ api }) => api)
  provider = apiWithProvider.then(({ provider }) => provider)

  return { subsocialApi, provider }
}

export const getSubsocialApi = async (renew?: boolean) => {
  return getApiWithProvider(renew).then(({ subsocialApi }) => subsocialApi)
}
export const getApiPromiseInstance = async () => {
  const { ApiPromise } = await import('@polkadot/api')
  const provider = await getApiWithProvider().then(({ provider }) => provider)
  if (!provider) return null

  return new ApiPromise({ provider })
}

async function connectToSubsocialApi(config: SubsocialConnectionConfig) {
  const { SubsocialApi } = await import('@subsocial/api')
  const { WsProvider, ApiPromise } = await import('@polkadot/api')

  const { ipfsNodeUrl, substrateUrl, postConnectConfig, ipfsAdminNodeUrl } =
    config

  const provider = new WsProvider(substrateUrl, 15_000, {}, 5000)
  const substrateApi = await ApiPromise.create({ provider })
  const api = new SubsocialApi({
    substrateApi,
    ipfsNodeUrl,
    ipfsAdminNodeUrl,
  })

  postConnectConfig?.(api)
  return { api, provider }
}
