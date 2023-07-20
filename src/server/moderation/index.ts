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
export async function getBlockedMessageIdsInChatIds(
  params: {
    chatId: string
    hubId: string
  }[]
) {
  const data = await moderationRequest<Record<string, string[]>>({
    document: generateBlockedMessageIdsInChatIdsQueryDocument(params),
  })
  return Object.entries(data).map(([key, res]) => {
    const [_, hubId, chatId] = key.split('SEPARATOR')
    return {
      chatId,
      hubId,
      blockedMessageIds: res,
    }
  })
}

export const GET_BLOCKED_CIDS = gql`
  query GetBlockedCids($ctxSpaceId: String, $ctxPostId: String) {
    blockedResourceIds(
      ctxSpaceId: $ctxSpaceId
      ctxPostId: $ctxPostId
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
