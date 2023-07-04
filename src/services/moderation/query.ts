import { createQuery, poolQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  GetBlockedAddressesQuery,
  GetBlockedAddressesQueryVariables,
  GetBlockedCidsQuery,
  GetBlockedCidsQueryVariables,
} from './generated'
import { moderationRequest } from './utils'

const generateBlockedMessageIdsInChatIdsQueryDocument = (
  variables: { chatId: string; hubId: string }[]
) => {
  return `
    query GetBlockedMessageIdsInChatIds {
      ${variables.map(
        ({ hubId, chatId }) =>
          `SEPARATOR${hubId}SEPARATOR${chatId}: blockedResourceIds(
            ctxSpaceId: "${hubId}"
            blocked: true
            rootPostId: "${chatId}"
          )`
      )}
    }
  `
}
const getBlockedMessageIdsInChatId = poolQuery<
  {
    hubId: string
    chatId: string
  },
  { chatId: string; hubId: string; blockedMessageIds: string[] }
>({
  multiCall: async (params) => {
    const data = await moderationRequest<Record<string, string[]>>({
      document: generateBlockedMessageIdsInChatIdsQueryDocument(params),
    })
    return Object.entries(data).map(([key, res]) => {
      const [_, chatId, hubId] = key.split('SEPARATOR')
      return {
        chatId,
        hubId,
        blockedMessageIds: res,
      }
    })
  },
  resultMapper: {
    paramToKey: ({ chatId, hubId }) => `${hubId}-${chatId}`,
    resultToKey: ({ chatId, hubId }) => `${hubId}-${chatId}`,
  },
})
export const getBlockedMessageIdsInChatIdQuery = createQuery({
  key: 'blockedInChatId',
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
  key: 'blockedCids',
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
  return blockedHexAddresses
}
export const getBlockedAddressesQuery = createQuery({
  key: 'blockedAddresses',
  fetcher: getBlockedAddresses,
})
