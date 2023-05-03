import { createQuery } from '@/subsocial-query'
import { request } from 'graphql-request'
import { graphql } from './gql'
import { getModerationUrl } from './utils'

const GET_BLOCKED_MESSAGE_IDS_IN_CHAT_ID = graphql(`
  query GetBlockedMessageIdsInChatId($chatId: String!) {
    blockedResourceIds(blocked: true, rootPostId: $chatId)
  }
`)
export async function getBlockedMessageIdsInChatId(chatId: string) {
  const data = await request(
    getModerationUrl(),
    GET_BLOCKED_MESSAGE_IDS_IN_CHAT_ID,
    {
      chatId,
    }
  )
  return data.blockedResourceIds
}
export const getBlockedMessageIdsInChatIdQuery = createQuery({
  key: 'getBlockedMessageIdsInChatId',
  fetcher: getBlockedMessageIdsInChatId,
})

const GET_BLOCKED_CIDS = graphql(`
  query GetBlockedCids {
    blockedResourceIds(blocked: true, resourceType: CID)
  }
`)
export async function getBlockedCids() {
  const data = await request(getModerationUrl(), GET_BLOCKED_CIDS)
  return data.blockedResourceIds
}
export const getBlockedCidsQuery = createQuery({
  key: 'getBlockedCidsQuery',
  fetcher: getBlockedCids,
})

const GET_BLOCKED_ADDRESSES = graphql(`
  query GetBlockedAddresses {
    blockedResourceIds(blocked: true, resourceType: Address)
  }
`)
export async function getBlockedAddresses() {
  const data = await request(getModerationUrl(), GET_BLOCKED_ADDRESSES)
  return data.blockedResourceIds
}
export const getBlockedAddressesQuery = createQuery({
  key: 'getBlockedAddressesQuery',
  fetcher: getBlockedAddresses,
})
