import { createQuery } from '@/subsocial-query'
import { convertHexAddressToSubstrateAddress } from '@/utils/account'
import { gql } from 'graphql-request'
import {
  GetBlockedAddressesQuery,
  GetBlockedAddressesQueryVariables,
  GetBlockedCidsQuery,
  GetBlockedCidsQueryVariables,
  GetBlockedMessageIdsInChatIdQuery,
  GetBlockedMessageIdsInChatIdQueryVariables,
} from './generated'
import { moderationRequest } from './utils'

const GET_BLOCKED_MESSAGE_IDS_IN_CHAT_ID = gql`
  query GetBlockedMessageIdsInChatId($ctxSpaceId: String!, $chatId: String!) {
    blockedResourceIds(
      ctxSpaceId: $ctxSpaceId
      blocked: true
      rootPostId: $chatId
    )
  }
`
export async function getBlockedMessageIdsInChatId({
  chatId,
  hubId,
}: {
  hubId: string
  chatId: string
}) {
  const data = await moderationRequest<
    GetBlockedMessageIdsInChatIdQuery,
    GetBlockedMessageIdsInChatIdQueryVariables
  >({
    document: GET_BLOCKED_MESSAGE_IDS_IN_CHAT_ID,
    variables: { chatId, ctxSpaceId: hubId },
  })
  return data.blockedResourceIds
}
export const getBlockedMessageIdsInChatIdQuery = createQuery({
  key: 'getBlockedMessageIdsInChatId',
  fetcher: getBlockedMessageIdsInChatId,
})

export const GET_BLOCKED_CIDS = gql`
  query GetBlockedCids($ctxSpaceId: String!) {
    blockedResourceIds(
      ctxSpaceId: $ctxSpaceId
      blocked: true
      resourceType: CID
    )
  }
`
export async function getBlockedCids({ hubId }: { hubId: string }) {
  const data = await moderationRequest<
    GetBlockedCidsQuery,
    GetBlockedCidsQueryVariables
  >({
    document: GET_BLOCKED_CIDS,
    variables: { ctxSpaceId: hubId },
  })
  return data.blockedResourceIds
}
export const getBlockedCidsQuery = createQuery({
  key: 'getBlockedCidsQuery',
  fetcher: getBlockedCids,
})

const GET_BLOCKED_ADDRESSES = gql`
  query GetBlockedAddresses($ctxSpaceId: String!) {
    blockedResourceIds(
      ctxSpaceId: $ctxSpaceId
      blocked: true
      resourceType: Address
    )
  }
`
export async function getBlockedAddresses({ hubId }: { hubId: string }) {
  const data = await moderationRequest<
    GetBlockedAddressesQuery,
    GetBlockedAddressesQueryVariables
  >({
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
