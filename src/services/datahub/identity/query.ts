import { apiInstance } from '@/services/api/utils'
import { useMyAccount } from '@/stores/my-account'
import { createQuery, poolQuery } from '@/subsocial-query'
import { LocalStorage } from '@/utils/storage'
import { parseJSONData } from '@/utils/strings'
import { gql } from 'graphql-request'
import {
  GetSocialProfileQuery,
  GetSocialProfileQueryVariables,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'
import { getLinkedIdentity } from './fetcher'

// NOTE: need to be careful when changing the structure of these cached data, because it can cause the app to crash if you access unavailable data
export const getMyLinkedIdentityCache = new LocalStorage(
  () => 'my-linked-identity-cache'
)
export const getLinkedIdentityQuery = createQuery({
  key: 'getLinkedIdentity',
  fetcher: async (address: string) => {
    const res = await getLinkedIdentity({ sessionAddress: address })
    if (address === useMyAccount.getState().address) {
      getMyLinkedIdentityCache.set(JSON.stringify(res))
    }
    return res
  },
  defaultConfigGenerator: (data) => {
    let cache: Awaited<ReturnType<typeof getLinkedIdentity>> | undefined =
      undefined
    if (data === useMyAccount.getState().address) {
      const cacheData = getMyLinkedIdentityCache.get()
      console.log(cacheData)
      cache = parseJSONData(cacheData)
    }
    return {
      enabled: !!data,
      placeholderData: cache,
    }
  },
})

export const getLinkedIdentityFromMainAddressQuery = createQuery({
  key: 'getLinkedIdentityFromMainAddress',
  fetcher: (mainAddress: string) => getLinkedIdentity({ id: mainAddress }),
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const getEvmLinkedIdentityMessageQuery = createQuery({
  key: 'getEvmLinkedIdentityMessage',
  fetcher: async (address: string) => {
    const message = await apiInstance.get(
      `/api/datahub/identity?address=${address}`
    )
    return message.data.data as string
  },
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
    retry: false,
  }),
})

const GET_SOCIAL_PROFILE = gql`
  query GetSocialProfile($addresses: [String!]!) {
    socialProfiles(args: { where: { substrateAddresses: $addresses } }) {
      data {
        id
        allowedCreateCommentRootPostIds
      }
    }
  }
`
const getSocialProfile = poolQuery<
  string,
  { id: string; allowedCreateCommentRootPostIds: string[] }
>({
  name: 'getSocialProfile',
  multiCall: async (addresses) => {
    const data = await datahubQueryRequest<
      GetSocialProfileQuery,
      GetSocialProfileQueryVariables
    >({
      document: GET_SOCIAL_PROFILE,
      variables: { addresses },
    })

    return data.socialProfiles.data
  },
  resultMapper: {
    paramToKey: (address) => address,
    resultToKey: (result) => result.id || '',
  },
})
export const getSocialProfileQuery = createQuery({
  key: 'getSocialProfile',
  fetcher: (address: string) => getSocialProfile(address),
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})
