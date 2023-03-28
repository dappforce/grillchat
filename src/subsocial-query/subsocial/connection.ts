import { getSubstrateApi, SubsocialApi } from '@subsocial/api'
import { getConnectionConfig, SubsocialConnectionConfig } from './config'

let subsocialApi: Promise<SubsocialApi> | null = null
export const getSubsocialApi = async (renew?: boolean) => {
  if (subsocialApi && !renew) return subsocialApi
  const api = connectToSubsocialApi(getConnectionConfig())
  subsocialApi = api
  return subsocialApi
}

async function connectToSubsocialApi(config: SubsocialConnectionConfig) {
  const { ipfsNodeUrl, substrateUrl, postConnectConfig, ipfsAdminNodeUrl } =
    config
  const substrateApi = await getSubstrateApi(substrateUrl)
  const api = new SubsocialApi({
    ipfsNodeUrl,
    substrateApi,
    ipfsAdminNodeUrl,
  })
  postConnectConfig && postConnectConfig(api)
  return api
}
