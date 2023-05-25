import { createQuery } from '@/subsocial-query'
import { convertHexAddressToSubstrateAddress } from '@/utils/account'
import { graphql } from './gql'
import { createModerationRequest } from './utils'

const moderationRequest = createModerationRequest()

const GET_BLOCKED_MESSAGE_IDS_IN_CHAT_ID = graphql(`
  query GetBlockedMessageIdsInChatId($ctxSpaceId: String!, $chatId: String!) {
    blockedResourceIds(
      ctxSpaceId: $ctxSpaceId
      blocked: true
      rootPostId: $chatId
    )
  }
`)
export async function getBlockedMessageIdsInChatId({
  chatId,
  hubId,
}: {
  hubId: string
  chatId: string
}) {
  const data = await moderationRequest({
    document: GET_BLOCKED_MESSAGE_IDS_IN_CHAT_ID,
    variables: { chatId, ctxSpaceId: hubId },
  })
  return data.blockedResourceIds
}
export const getBlockedMessageIdsInChatIdQuery = createQuery({
  key: 'getBlockedMessageIdsInChatId',
  fetcher: getBlockedMessageIdsInChatId,
})

const GET_BLOCKED_CIDS = graphql(`
  query GetBlockedCids($ctxSpaceId: String!) {
    blockedResourceIds(
      ctxSpaceId: $ctxSpaceId
      blocked: true
      resourceType: CID
    )
  }
`)
export async function getBlockedCids({ hubId }: { hubId: string }) {
  const data = await moderationRequest({
    document: GET_BLOCKED_CIDS,
    variables: { ctxSpaceId: hubId },
  })
  return data.blockedResourceIds
}
export const getBlockedCidsQuery = createQuery({
  key: 'getBlockedCidsQuery',
  fetcher: getBlockedCids,
})

const GET_BLOCKED_ADDRESSES = graphql(`
  query GetBlockedAddresses($ctxSpaceId: String!) {
    blockedResourceIds(
      ctxSpaceId: $ctxSpaceId
      blocked: true
      resourceType: Address
    )
  }
`)
export async function getBlockedAddresses({ hubId }: { hubId: string }) {
  const data = await moderationRequest({
    document: GET_BLOCKED_ADDRESSES,
    variables: { ctxSpaceId: hubId },
  })
  const blockedHexAddresses = data.blockedResourceIds
  const addresses = blockedHexAddresses.map((hexAddress: string) =>
    convertHexAddressToSubstrateAddress(hexAddress)
  )
  return Promise.all(addresses)
}
export const getBlockedAddressesQuery = createQuery({
  key: 'getBlockedAddressesQuery',
  fetcher: getBlockedAddresses,
})
