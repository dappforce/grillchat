import { gql } from 'graphql-request'
import {
  GetLinkingMessageForTelegramAccountQuery,
  GetLinkingMessageForTelegramAccountQueryVariables,
} from './generated'
import { notificationsRequest } from './utils'

// This operation is put in mutation because its used like mutation, not query
const GET_LINKING_MESSAGE_FOR_TELEGRAM_ACCOUNT = gql`
  query GetLinkingMessageForTelegramAccount($address: String!) {
    linkingMessageForTelegramAccount(substrateAccount: $address) {
      messageTpl
    }
  }
`
export async function getLinkingMessageForTelegramAccount(address: string) {
  const data = await notificationsRequest<
    GetLinkingMessageForTelegramAccountQuery,
    GetLinkingMessageForTelegramAccountQueryVariables
  >({
    document: GET_LINKING_MESSAGE_FOR_TELEGRAM_ACCOUNT,
    variables: { address },
  })
  return data.linkingMessageForTelegramAccount.messageTpl
}
