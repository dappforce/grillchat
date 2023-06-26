import { gql } from 'graphql-request'
import {
  CreateTemporaryLinkingIdForTelegramMutation,
  CreateTemporaryLinkingIdForTelegramMutationVariables,
  GetLinkingMessageForTelegramQuery,
  GetLinkingMessageForTelegramQueryVariables,
} from './generated'
import { notificationsRequest } from './utils'

// This operation is put in mutation because its used like mutation, not query
const CREATE_LINKING_MESSAGE_FOR_TELEGRAM = gql`
  query GetLinkingMessageForTelegram($address: String!) {
    linkingMessageForTelegramAccount(substrateAccount: $address) {
      messageTpl
    }
  }
`
export async function createLinkingMessageForTelegram(address: string) {
  const data = await notificationsRequest<
    GetLinkingMessageForTelegramQuery,
    GetLinkingMessageForTelegramQueryVariables
  >({
    document: CREATE_LINKING_MESSAGE_FOR_TELEGRAM,
    variables: { address },
  })
  return data.linkingMessageForTelegramAccount.messageTpl
}

const CREATE_TEMPORARY_LINKING_ID_FOR_TELEGRAM = gql`
  mutation CreateTemporaryLinkingIdForTelegram(
    $signedMessageWithDetails: String!
  ) {
    createTemporaryLinkingIdForTelegram(
      signedMessageWithDetails: $signedMessageWithDetails
    ) {
      id
    }
  }
`
export async function createTemporaryLinkingUrlForTelegram(
  signedMessageWithDetails: string
) {
  const data = await notificationsRequest<
    CreateTemporaryLinkingIdForTelegramMutation,
    CreateTemporaryLinkingIdForTelegramMutationVariables
  >({
    document: CREATE_TEMPORARY_LINKING_ID_FOR_TELEGRAM,
    variables: { signedMessageWithDetails },
  })
  const linkingId = data.createTemporaryLinkingIdForTelegram.id
  return `t.me/GrillNotificationsStagingBot/?start=${linkingId}`
}
