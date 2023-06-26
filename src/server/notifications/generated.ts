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

export type CreateTemporaryLinkingIdForTelegramResponseDto = {
  __typename?: 'CreateTemporaryLinkingIdForTelegramResponseDto';
  id: Scalars['String']['output'];
};

export type LinkedTgAccountsToSubstrateAccountResponseType = {
  __typename?: 'LinkedTgAccountsToSubstrateAccountResponseType';
  telegramAccounts?: Maybe<Array<TelegramAccountDetails>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createNotificationSettingsToAccount: NotificationSettingsGql;
  createTemporaryLinkingIdForTelegram: CreateTemporaryLinkingIdForTelegramResponseDto;
  unlinkTelegramAccount: UnlinkTelegramAccountResponseDto;
  updateNotificationSettingsToAccount: NotificationSettingsGql;
};


export type MutationCreateNotificationSettingsToAccountArgs = {
  createNotificationSettingsInput: NotificationSettingsGqlInput;
};


export type MutationCreateTemporaryLinkingIdForTelegramArgs = {
  signedMessageWithDetails: Scalars['String']['input'];
};


export type MutationUnlinkTelegramAccountArgs = {
  signedMessageWithDetails: Scalars['String']['input'];
};


export type MutationUpdateNotificationSettingsToAccountArgs = {
  updateNotificationSettingsInput: NotificationSettingsGqlInput;
};

export type NotificationSettingsGql = {
  __typename?: 'NotificationSettingsGql';
  _id: Scalars['String']['output'];
  subscriptionEvents: Scalars['String']['output'];
  subscriptions: Array<NotificationSubscription>;
  substrateAccountId: Scalars['String']['output'];
};

export type NotificationSettingsGqlInput = {
  subscriptions: Array<NotificationSubscriptionInputType>;
  substrateAccountId: Scalars['String']['input'];
};

export type NotificationSubscription = {
  __typename?: 'NotificationSubscription';
  eventName: Scalars['String']['output'];
  telegramBot: Scalars['Boolean']['output'];
};

export type NotificationSubscriptionInputType = {
  eventName: Scalars['String']['input'];
  telegramBot: Scalars['Boolean']['input'];
};

export type Query = {
  __typename?: 'Query';
  linkingMessageForTelegramAccount: AccountsLinkingMessageTemplateGql;
  notificationSettingsByAccountId: NotificationSettingsGql;
  telegramAccountsLinkedToSubstrateAccount: LinkedTgAccountsToSubstrateAccountResponseType;
  unlinkingMessageForTelegramAccount: AccountsLinkingMessageTemplateGql;
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


export type QueryUnlinkingMessageForTelegramAccountArgs = {
  substrateAccount: Scalars['String']['input'];
};

export type TelegramAccountDetails = {
  __typename?: 'TelegramAccountDetails';
  accountId: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  userName: Scalars['String']['output'];
};

export type UnlinkTelegramAccountResponseDto = {
  __typename?: 'UnlinkTelegramAccountResponseDto';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GetLinkingMessageForTelegramAccountQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type GetLinkingMessageForTelegramAccountQuery = { __typename?: 'Query', linkingMessageForTelegramAccount: { __typename?: 'AccountsLinkingMessageTemplateGql', messageTpl: string } };


export const GetLinkingMessageForTelegramAccount = gql`
    query GetLinkingMessageForTelegramAccount($address: String!) {
  linkingMessageForTelegramAccount(substrateAccount: $address) {
    messageTpl
  }
}
    `;