import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AccountsLinkingMessageTemplateGql = {
  __typename?: 'AccountsLinkingMessageTemplateGql';
  messageTpl: Scalars['String']['output'];
};

export type AddFcmTokenToAddressMessageMessageInput = {
  fcmToken: Scalars['String']['input'];
  substrateAddress: Scalars['String']['input'];
};

export type CommitSignedMessageResponse = {
  __typename?: 'CommitSignedMessageResponse';
  data?: Maybe<CommitSignedMessageResponseData>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type CommitSignedMessageResponseData = {
  __typename?: 'CommitSignedMessageResponseData';
  tmpLinkingIdForTelegram?: Maybe<Scalars['String']['output']>;
};

export type CreateTemporaryLinkingIdForTelegramResponseDto = {
  __typename?: 'CreateTemporaryLinkingIdForTelegramResponseDto';
  id: Scalars['String']['output'];
};

export type DeleteFcmTokenFromAddressMessageInput = {
  fcmToken: Scalars['String']['input'];
  substrateAddress: Scalars['String']['input'];
};

export type LinkAddressWithTelegramAccountMessageInput = {
  substrateAddress: Scalars['String']['input'];
};

export type LinkedTgAccountsToSubstrateAccountResponseType = {
  __typename?: 'LinkedTgAccountsToSubstrateAccountResponseType';
  telegramAccounts?: Maybe<Array<TelegramAccountDetails>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  commitSignedMessageWithAction?: Maybe<CommitSignedMessageResponse>;
  createNotificationSettingsToAccount: NotificationSettingsGql;
  /** This mutation is deprecated and "commitSignedMessageWithAction" must be used instead. */
  createTemporaryLinkingIdForTelegram: CreateTemporaryLinkingIdForTelegramResponseDto;
  /** This mutation is deprecated and "commitSignedMessageWithAction" must be used instead. */
  unlinkTelegramAccount: UnlinkTelegramAccountResponseDto;
  updateNotificationSettingsToAccount: NotificationSettingsGql;
};


export type MutationCommitSignedMessageWithActionArgs = {
  signedMessage: Scalars['String']['input'];
};


export type MutationCreateNotificationSettingsToAccountArgs = {
  createNotificationSettingsInput: NotificationSettingsInputGql;
};


export type MutationCreateTemporaryLinkingIdForTelegramArgs = {
  signedMessageWithDetails: Scalars['String']['input'];
};


export type MutationUnlinkTelegramAccountArgs = {
  signedMessageWithDetails: Scalars['String']['input'];
};


export type MutationUpdateNotificationSettingsToAccountArgs = {
  updateNotificationSettingsInput: NotificationSettingsInputGql;
};

export type NotificationSettingsGql = {
  __typename?: 'NotificationSettingsGql';
  _id: Scalars['String']['output'];
  subscriptionEvents: Scalars['String']['output'];
  subscriptions: Array<NotificationSubscription>;
  substrateAccountId: Scalars['String']['output'];
};

export type NotificationSettingsInputGql = {
  subscriptions: Array<NotificationSubscriptionInputType>;
  substrateAccountId: Scalars['String']['input'];
};

export type NotificationSubscription = {
  __typename?: 'NotificationSubscription';
  eventName: Scalars['String']['output'];
  fcm: Scalars['Boolean']['output'];
  telegramBot: Scalars['Boolean']['output'];
};

export type NotificationSubscriptionInputType = {
  eventName: Scalars['String']['input'];
  fcm: Scalars['Boolean']['input'];
  telegramBot: Scalars['Boolean']['input'];
};

export type Query = {
  __typename?: 'Query';
  addFcmTokenToAddressMessage: SignedMessageWithActionTemplateResponseDto;
  deleteFcmTokenFromAddressMessage: SignedMessageWithActionTemplateResponseDto;
  linkAddressWithTelegramAccountMessage: SignedMessageWithActionTemplateResponseDto;
  linkingMessageForTelegramAccount: AccountsLinkingMessageTemplateGql;
  notificationSettingsByAccountId: NotificationSettingsGql;
  telegramAccountsLinkedToSubstrateAccount: LinkedTgAccountsToSubstrateAccountResponseType;
  unlinkAddressFromTelegramAccountMessage: SignedMessageWithActionTemplateResponseDto;
  unlinkingMessageForTelegramAccount: AccountsLinkingMessageTemplateGql;
};


export type QueryAddFcmTokenToAddressMessageArgs = {
  input: AddFcmTokenToAddressMessageMessageInput;
};


export type QueryDeleteFcmTokenFromAddressMessageArgs = {
  input: DeleteFcmTokenFromAddressMessageInput;
};


export type QueryLinkAddressWithTelegramAccountMessageArgs = {
  input: LinkAddressWithTelegramAccountMessageInput;
};


export type QueryLinkingMessageForTelegramAccountArgs = {
  substrateAccount: Scalars['String']['input'];
};


export type QueryNotificationSettingsByAccountIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryTelegramAccountsLinkedToSubstrateAccountArgs = {
  substrateAccount: Scalars['String']['input'];
};


export type QueryUnlinkAddressFromTelegramAccountMessageArgs = {
  input: UnlinkAddressWithTelegramAccountMessageInput;
};


export type QueryUnlinkingMessageForTelegramAccountArgs = {
  substrateAccount: Scalars['String']['input'];
};

export type SignedMessageWithActionTemplateResponseDto = {
  __typename?: 'SignedMessageWithActionTemplateResponseDto';
  messageTpl: Scalars['String']['output'];
};

export type TelegramAccountDetails = {
  __typename?: 'TelegramAccountDetails';
  accountId: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  userName: Scalars['String']['output'];
};

export type UnlinkAddressWithTelegramAccountMessageInput = {
  substrateAddress: Scalars['String']['input'];
};

export type UnlinkTelegramAccountResponseDto = {
  __typename?: 'UnlinkTelegramAccountResponseDto';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GetTelegramAccountsLinkedQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type GetTelegramAccountsLinkedQuery = { __typename?: 'Query', telegramAccountsLinkedToSubstrateAccount: { __typename?: 'LinkedTgAccountsToSubstrateAccountResponseType', telegramAccounts?: Array<{ __typename?: 'TelegramAccountDetails', userName: string }> | null } };

export type GetLinkingMessageForTelegramQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type GetLinkingMessageForTelegramQuery = { __typename?: 'Query', linkingMessageForTelegramAccount: { __typename?: 'AccountsLinkingMessageTemplateGql', messageTpl: string } };

export type CreateTemporaryLinkingIdForTelegramMutationVariables = Exact<{
  signedMessageWithDetails: Scalars['String']['input'];
}>;


export type CreateTemporaryLinkingIdForTelegramMutation = { __typename?: 'Mutation', createTemporaryLinkingIdForTelegram: { __typename?: 'CreateTemporaryLinkingIdForTelegramResponseDto', id: string } };

export type GetUnlinkingMessageForTelegramQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type GetUnlinkingMessageForTelegramQuery = { __typename?: 'Query', unlinkingMessageForTelegramAccount: { __typename?: 'AccountsLinkingMessageTemplateGql', messageTpl: string } };

export type UnlinkTelegramAccountMutationVariables = Exact<{
  signedMessageWithDetails: Scalars['String']['input'];
}>;


export type UnlinkTelegramAccountMutation = { __typename?: 'Mutation', unlinkTelegramAccount: { __typename?: 'UnlinkTelegramAccountResponseDto', message?: string | null, success: boolean } };

export type GetLinkingMessageForFcmQueryVariables = Exact<{
  address: Scalars['String']['input'];
  fcmToken: Scalars['String']['input'];
}>;


export type GetLinkingMessageForFcmQuery = { __typename?: 'Query', addFcmTokenToAddressMessage: { __typename?: 'SignedMessageWithActionTemplateResponseDto', messageTpl: string } };

export type GetUnlinkingMessageFromFcmQueryVariables = Exact<{
  address: Scalars['String']['input'];
  fcmToken: Scalars['String']['input'];
}>;


export type GetUnlinkingMessageFromFcmQuery = { __typename?: 'Query', deleteFcmTokenFromAddressMessage: { __typename?: 'SignedMessageWithActionTemplateResponseDto', messageTpl: string } };

export type CommitSignedMessageMutationVariables = Exact<{
  signedMessageWithDetails: Scalars['String']['input'];
}>;


export type CommitSignedMessageMutation = { __typename?: 'Mutation', commitSignedMessageWithAction?: { __typename?: 'CommitSignedMessageResponse', message?: string | null, success: boolean } | null };


export const GetTelegramAccountsLinked = gql`
    query GetTelegramAccountsLinked($address: String!) {
  telegramAccountsLinkedToSubstrateAccount(substrateAccount: $address) {
    telegramAccounts {
      userName
    }
  }
}
    `;
export const GetLinkingMessageForTelegram = gql`
    query GetLinkingMessageForTelegram($address: String!) {
  linkingMessageForTelegramAccount(substrateAccount: $address) {
    messageTpl
  }
}
    `;
export const CreateTemporaryLinkingIdForTelegram = gql`
    mutation CreateTemporaryLinkingIdForTelegram($signedMessageWithDetails: String!) {
  createTemporaryLinkingIdForTelegram(
    signedMessageWithDetails: $signedMessageWithDetails
  ) {
    id
  }
}
    `;
export const GetUnlinkingMessageForTelegram = gql`
    query GetUnlinkingMessageForTelegram($address: String!) {
  unlinkingMessageForTelegramAccount(substrateAccount: $address) {
    messageTpl
  }
}
    `;
export const UnlinkTelegramAccount = gql`
    mutation UnlinkTelegramAccount($signedMessageWithDetails: String!) {
  unlinkTelegramAccount(signedMessageWithDetails: $signedMessageWithDetails) {
    message
    success
  }
}
    `;
export const GetLinkingMessageForFcm = gql`
    query GetLinkingMessageForFcm($address: String!, $fcmToken: String!) {
  addFcmTokenToAddressMessage(
    input: {substrateAddress: $address, fcmToken: $fcmToken}
  ) {
    messageTpl
  }
}
    `;
export const GetUnlinkingMessageFromFcm = gql`
    query GetUnlinkingMessageFromFcm($address: String!, $fcmToken: String!) {
  deleteFcmTokenFromAddressMessage(
    input: {substrateAddress: $address, fcmToken: $fcmToken}
  ) {
    messageTpl
  }
}
    `;
export const CommitSignedMessage = gql`
    mutation CommitSignedMessage($signedMessageWithDetails: String!) {
  commitSignedMessageWithAction(signedMessage: $signedMessageWithDetails) {
    message
    success
  }
}
    `;