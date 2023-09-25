import { ApiPromise } from '@polkadot/api'
import { type SubsocialApi } from '@subsocial/api'
import { getConnectionConfig, SubsocialConnectionConfig } from './config'

let subsocialApi: Promise<SubsocialApi> | null = null
export const getSubsocialApi = async (renew?: boolean) => {
  if (subsocialApi && !renew) return subsocialApi

  subsocialApi = connectToSubsocialApi(getConnectionConfig())
  return subsocialApi
}

async function connectToSubsocialApi(config: SubsocialConnectionConfig) {
  const { SubsocialApi } = await import('@subsocial/api')
  const { ApiPromise, HttpProvider } = await import('@polkadot/api')

  const { ipfsNodeUrl, substrateUrl, postConnectConfig, ipfsAdminNodeUrl } =
    config

  const provider = new HttpProvider(substrateUrl)
  const substrateApi = await ApiPromise.create({ provider })
  const api = new SubsocialApi({
    substrateApi,
    ipfsNodeUrl,
    ipfsAdminNodeUrl,
  })

  postConnectConfig?.(api)
  return api
}

let substrateWebsocketApi: Promise<ApiPromise> | null = null
export const getSubstrateWebsocketApi = async () => {
  const { ApiPromise, WsProvider } = await import('@polkadot/api')
  if (substrateWebsocketApi) return substrateWebsocketApi

  const { substrateWebsocketUrl } = getConnectionConfig()

  const provider = new WsProvider(substrateWebsocketUrl, 15_000, {})
  const substrateApi = ApiPromise.create({ provider })
  substrateWebsocketApi = substrateApi

  return substrateApi
}
