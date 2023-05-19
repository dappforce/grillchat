import { type SubsocialApi } from '@subsocial/api'
import { getConnectionConfig, SubsocialConnectionConfig } from './config'

let subsocialApi: Promise<SubsocialApi> | null = null
// TODO: need better way to fix this, need to make this `getSubsocialApi` not exposed to outside of subsocial-query usage. Consumer should use getSubsocialQuery returned from `setSubsocialConfig` instead.
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
  postConnectConfig && postConnectConfig(api)
  return api
}
