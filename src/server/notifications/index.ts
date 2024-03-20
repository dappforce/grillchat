import { getTelegramNotificationsBotLink } from '@/constants/links'
import { gql } from 'graphql-request'
import {
  CommitSignedMessageMutation,
  CommitSignedMessageMutationVariables,
  CreateTemporaryLinkingIdForTelegramMutation,
  CreateTemporaryLinkingIdForTelegramMutationVariables,
  GetLinkingMessageForFcmQuery,
  GetLinkingMessageForFcmQueryVariables,
  GetLinkingMessageForTelegramQuery,
  GetLinkingMessageForTelegramQueryVariables,
  GetTelegramAccountsLinkedQuery,
  GetTelegramAccountsLinkedQueryVariables,
  GetUnlinkingMessageForTelegramQuery,
  GetUnlinkingMessageForTelegramQueryVariables,
  GetUnlinkingMessageFromFcmQuery,
  GetUnlinkingMessageFromFcmQueryVariables,
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

// Linking FCM Token with Account.
const GET_LINKING_MESSAGE_FOR_FCM = gql`
  query GetLinkingMessageForFcm($address: String!, $fcmToken: String!) {
    addFcmTokenToAddressMessage(
      input: { substrateAddress: $address, fcmToken: $fcmToken }
    ) {
      messageTpl
    }
  }
`
export async function createLinkingMessageForFcm(
  address: string,
  fcmToken: string
) {
  const data = await notificationsRequest<
    GetLinkingMessageForFcmQuery,
    GetLinkingMessageForFcmQueryVariables
  >({
    document: GET_LINKING_MESSAGE_FOR_FCM,
    variables: { address, fcmToken },
  })
  return data.addFcmTokenToAddressMessage.messageTpl
}

// Unlinking FCM Token with Account.
const GET_UNLINKING_MESSAGE_FOR_FCM = gql`
  query GetUnlinkingMessageFromFcm($address: String!, $fcmToken: String!) {
    deleteFcmTokenFromAddressMessage(
      input: { substrateAddress: $address, fcmToken: $fcmToken }
    ) {
      messageTpl
    }
  }
`
export async function createUnlinkingMessageForFcm(
  address: string,
  fcmToken: string
) {
  const data = await notificationsRequest<
    GetUnlinkingMessageFromFcmQuery,
    GetUnlinkingMessageFromFcmQueryVariables
  >({
    document: GET_UNLINKING_MESSAGE_FOR_FCM,
    variables: { address, fcmToken },
  })
  return data.deleteFcmTokenFromAddressMessage.messageTpl
}

const COMMIT_SIGNED_MESSAGE = gql`
  mutation CommitSignedMessage($signedMessageWithDetails: String!) {
    commitSignedMessageWithAction(signedMessage: $signedMessageWithDetails) {
      message
      success
    }
  }
`
export async function commitSignedMessageWithAction(
  signedMessageWithDetails: string
) {
  const data = await notificationsRequest<
    CommitSignedMessageMutation,
    CommitSignedMessageMutationVariables
  >({
    document: COMMIT_SIGNED_MESSAGE,
    variables: { signedMessageWithDetails },
  })
  const success = data.commitSignedMessageWithAction?.success
  if (!success) {
    throw new Error(
      `Unable to commit signed message: ${data.commitSignedMessageWithAction?.message}`
    )
  }
}
