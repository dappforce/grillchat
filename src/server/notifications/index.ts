import { getTelegramNotificationsBotLink } from '@/constants/links'
import { gql } from 'graphql-request'
import {
  CreateTemporaryLinkingIdForTelegramMutation,
  CreateTemporaryLinkingIdForTelegramMutationVariables,
  GetLinkingMessageForTelegramQuery,
  GetLinkingMessageForTelegramQueryVariables,
  GetTelegramAccountsLinkedQuery,
  GetTelegramAccountsLinkedQueryVariables,
  GetUnlinkingMessageForTelegramQuery,
  GetUnlinkingMessageForTelegramQueryVariables,
  UnlinkTelegramAccountMutation,
  UnlinkTelegramAccountMutationVariables,
} from './generated'
import { notificationsRequest } from './utils'

const GET_TELEGRAM_ACCOUNTS_LINKED = gql`
  query GetTelegramAccountsLinked($address: String!) {
    telegramAccountsLinkedToSubstrateAccount(substrateAccount: $address) {
      telegramAccounts {
        userName
      }
    }
  }
`
export async function getTelegramAccountsLinked(address: string) {
  const data = await notificationsRequest<
    GetTelegramAccountsLinkedQuery,
    GetTelegramAccountsLinkedQueryVariables
  >({
    document: GET_TELEGRAM_ACCOUNTS_LINKED,
    variables: { address },
  })
  return data.telegramAccountsLinkedToSubstrateAccount.telegramAccounts
}

// Linking
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
  return getTelegramNotificationsBotLink(linkingId)
}

// Unlinking
const CREATE_UNLINKING_MESSAGE_FOR_TELEGRAM = gql`
  query GetUnlinkingMessageForTelegram($address: String!) {
    unlinkingMessageForTelegramAccount(substrateAccount: $address) {
      messageTpl
    }
  }
`
export async function createUnlinkingMessageForTelegram(address: string) {
  const data = await notificationsRequest<
    GetUnlinkingMessageForTelegramQuery,
    GetUnlinkingMessageForTelegramQueryVariables
  >({
    document: CREATE_UNLINKING_MESSAGE_FOR_TELEGRAM,
    variables: { address },
  })
  return data.unlinkingMessageForTelegramAccount.messageTpl
}

const UNLINK_TELEGRAM_ACCOUNT = gql`
  mutation UnlinkTelegramAccount($signedMessageWithDetails: String!) {
    unlinkTelegramAccount(signedMessageWithDetails: $signedMessageWithDetails) {
      message
      success
    }
  }
`
export async function unlinkTelegramAccount(signedMessageWithDetails: string) {
  const data = await notificationsRequest<
    UnlinkTelegramAccountMutation,
    UnlinkTelegramAccountMutationVariables
  >({
    document: UNLINK_TELEGRAM_ACCOUNT,
    variables: { signedMessageWithDetails },
  })
  const isUnlinkingSuccess = data.unlinkTelegramAccount.success
  if (!isUnlinkingSuccess) {
    throw new Error(
      `Unlinking Telegram Account Failed: ${data.unlinkTelegramAccount.message}`
    )
  }
}
