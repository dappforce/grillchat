import { type SubsocialApi } from '@subsocial/api'
import { getConnectionConfig, SubsocialConnectionConfig } from './config'

let subsocialApi: Promise<SubsocialApi> | null = null
export const getSubsocialApi = async (renew?: boolean) => {
  if (subsocialApi && !renew) return subsocialApi
  const api = connectToSubsocialApi(getConnectionConfig())
  subsocialApi = api
  return subsocialApi
}

async function connectToSubsocialApi(config: SubsocialConnectionConfig) {
  const { SubsocialApi } = await import('@subsocial/api')
  const { ipfsNodeUrl, substrateUrl, postConnectConfig, ipfsAdminNodeUrl } =
    config
  const api = await SubsocialApi.create({
    ipfsNodeUrl,
    substrateNodeUrl: substrateUrl,
    ipfsAdminNodeUrl,
  })
  postConnectConfig?.(api)
  return api
}
