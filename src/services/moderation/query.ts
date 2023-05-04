import { createQuery } from '@/subsocial-query'
import { convertHexAddressToSubstrateAddress } from '@/utils/account'
import { graphql } from './gql'
import { createModerationRequest } from './utils'

const moderationRequest = createModerationRequest()

const GET_BLOCKED_IDS_IN_ROOT_POST_ID = graphql(`
  query GetBlockedIdsInRootPostId($rootPostId: String!) {
    blockedResourceIds(blocked: true, rootPostId: $rootPostId)
  }
`)
export async function getBlockedIdsInRootPostId(rootPostId: string) {
  const data = await moderationRequest({
    document: GET_BLOCKED_IDS_IN_ROOT_POST_ID,
    variables: { rootPostId },
  })
  return data.blockedResourceIds
}
export const getBlockedIdsInRootPostIdQuery = createQuery({
  key: 'getBlockedIdsInRootPostIdQuery',
  getData: getBlockedIdsInRootPostId,
})

const GET_BLOCKED_CIDS = graphql(`
  query GetBlockedCids {
    blockedResourceIds(blocked: true, resourceType: CID)
  }
`)
export async function getBlockedCids() {
  const data = await moderationRequest({
    document: GET_BLOCKED_CIDS,
  })
  return data.blockedResourceIds
}
export const getBlockedCidsQuery = createQuery({
  key: 'getBlockedCidsQuery',
  getData: getBlockedCids,
})

const GET_BLOCKED_ADDRESSES = graphql(`
  query GetBlockedAddresses {
    blockedResourceIds(blocked: true, resourceType: Address)
  }
`)
export async function getBlockedAddresses() {
  const data = await moderationRequest({ document: GET_BLOCKED_ADDRESSES })
  const blockedHexAddresses = data.blockedResourceIds
  const addresses = blockedHexAddresses.map((hexAddress: string) =>
    convertHexAddressToSubstrateAddress(hexAddress)
  )
  return Promise.all(addresses)
}
export const getBlockedAddressesQuery = createQuery({
  key: 'getBlockedAddressesQuery',
  getData: getBlockedAddresses,
})
