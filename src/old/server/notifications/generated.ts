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
  BigInt: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  activeStakingSuperLikes?: Maybe<Array<ActiveStakingSuperLike>>;
  /** is off-chain data CID backed up in blockchain */
  backupInBlockchain?: Maybe<Scalars['Boolean']['output']>;
  dataType: DataType;
  extensions: Array<ContentExtension>;
  followers: Array<AccountFollowers>;
  followersCount?: Maybe<Scalars['Int']['output']>;
  followingAccounts: Array<AccountFollowers>;
  followingAccountsCount?: Maybe<Scalars['Int']['output']>;
  followingPosts: Array<PostFollowers>;
  followingPostsCount?: Maybe<Scalars['Int']['output']>;
  followingSpaces: Array<SpaceFollowers>;
  followingSpacesCount?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  linkedEvmAccounts: Array<EvmSubstrateAccountLink>;
  linkedIdentities: Array<LinkedIdentity>;
  moderationProfile?: Maybe<Moderator>;
  ownedModerationOrganizations?: Maybe<Array<ModerationOrganization>>;
  ownedPostsCount?: Maybe<Scalars['Int']['output']>;
  postsCreated: Array<Post>;
  postsOwned: Array<Post>;
  profileSpace?: Maybe<Space>;
  socialProfile?: Maybe<SocialProfile>;
  spacesCreated: Array<Space>;
  spacesOwned: Array<Space>;
};

export type AccountFollowers = {
  __typename?: 'AccountFollowers';
  dataType: DataType;
  followerAccount: Account;
  followingAccount: Account;
  id: Scalars['String']['output'];
};

export type AccountsLinkingMessageTemplateGql = {
  __typename?: 'AccountsLinkingMessageTemplateGql';
  messageTpl: Scalars['String']['output'];
};

export type ActiveStakingSuperLike = {
  __typename?: 'ActiveStakingSuperLike';
  aggregatedDaily: Scalars['Boolean']['output'];
  blockHash?: Maybe<Scalars['String']['output']>;
  createdAtTime: Scalars['DateTime']['output'];
  creatorAddress?: Maybe<Scalars['String']['output']>;
  date: Scalars['BigInt']['output'];
  era: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  kind: Scalars['String']['output'];
  likedPostId?: Maybe<Scalars['String']['output']>;
  likedPostPersistentId?: Maybe<Scalars['String']['output']>;
  multiplier: Scalars['Int']['output'];
  post: Post;
  postKind: PostKind;
  sharedPost?: Maybe<Post>;
  staker: Account;
  stakerAddress?: Maybe<Scalars['String']['output']>;
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>;
  week: Scalars['Int']['output'];
};

export type AddFcmTokenToAddressMessageMessageInput = {
  fcmToken: Scalars['String']['input'];
  proxySubstrateAddress?: InputMaybe<Scalars['String']['input']>;
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

export type ContentExtension = {
  __typename?: 'ContentExtension';
  amount?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Scalars['String']['output']>;
  collectionId?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Account>;
  decimals?: Maybe<Scalars['Int']['output']>;
  extensionSchemaId: ContentExtensionSchemaId;
  fromEvm?: Maybe<EvmAccount>;
  fromSubstrate?: Maybe<Account>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  nftId?: Maybe<Scalars['String']['output']>;
  nonce?: Maybe<Scalars['String']['output']>;
  parentPost: Post;
  pinnedResources?: Maybe<Array<ExtensionPinnedResource>>;
  recipient?: Maybe<Account>;
  toEvm?: Maybe<EvmAccount>;
  toSubstrate?: Maybe<Account>;
  token?: Maybe<Scalars['String']['output']>;
  txHash?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export enum ContentExtensionSchemaId {
  SubsocialDecodedPromo = 'subsocial_decoded_promo',
  SubsocialDonations = 'subsocial_donations',
  SubsocialEvmNft = 'subsocial_evm_nft',
  SubsocialImage = 'subsocial_image',
  SubsocialPinnedPosts = 'subsocial_pinned_posts',
  SubsocialSecretBox = 'subsocial_secret_box'
}

export type CreateTemporaryLinkingIdForTelegramResponseDto = {
  __typename?: 'CreateTemporaryLinkingIdForTelegramResponseDto';
  id: Scalars['String']['output'];
};

export enum DataHubClientId {
  Grillapp = 'GRILLAPP',
  Grillso = 'GRILLSO',
  Other = 'OTHER',
  Polkaverse = 'POLKAVERSE'
}

export enum DataType {
  OffChain = 'offChain',
  Optimistic = 'optimistic',
  Persistent = 'persistent'
}

export type DeleteFcmTokenFromAddressMessageInput = {
  fcmToken: Scalars['String']['input'];
  proxySubstrateAddress?: InputMaybe<Scalars['String']['input']>;
  substrateAddress: Scalars['String']['input'];
};

export type EvmAccount = {
  __typename?: 'EvmAccount';
  id: Scalars['String']['output'];
  linkedSubstrateAccounts: Array<EvmSubstrateAccountLink>;
};

export type EvmSubstrateAccountLink = {
  __typename?: 'EvmSubstrateAccountLink';
  active: Scalars['Boolean']['output'];
  createdAtBlock: Scalars['Int']['output'];
  createdAtTime: Scalars['DateTime']['output'];
  dataType: DataType;
  evmAccount: EvmAccount;
  id: Scalars['String']['output'];
  substrateAccount: Account;
};

export type ExtensionPinnedResource = {
  __typename?: 'ExtensionPinnedResource';
  contentExtension: ContentExtension;
  id: Scalars['String']['output'];
  post?: Maybe<Post>;
  resourceType: PinnedResourceType;
  space?: Maybe<Space>;
};

export enum IdentityProvider {
  Email = 'EMAIL',
  Evm = 'EVM',
  Facebook = 'FACEBOOK',
  Google = 'GOOGLE',
  Polkadot = 'POLKADOT',
  Twitter = 'TWITTER'
}

export enum InReplyToKind {
  Post = 'Post'
}

export type LinkAddressWithTelegramAccountMessageInput = {
  proxySubstrateAddress?: InputMaybe<Scalars['String']['input']>;
  substrateAddress: Scalars['String']['input'];
};

export type LinkedIdentity = {
  __typename?: 'LinkedIdentity';
  createdAtTime: Scalars['DateTime']['output'];
  enabled: Scalars['Boolean']['output'];
  externalId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  provider: IdentityProvider;
  substrateAccount: Account;
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>;
};

export type LinkedTgAccountsToSubstrateAccountResponseType = {
  __typename?: 'LinkedTgAccountsToSubstrateAccountResponseType';
  telegramAccounts?: Maybe<Array<NotificationsTelegramAccount>>;
};

export type ModerationBlockReason = {
  __typename?: 'ModerationBlockReason';
  id: Scalars['String']['output'];
  reasonText: Scalars['String']['output'];
};

export type ModerationBlockedResource = {
  __typename?: 'ModerationBlockedResource';
  blocked: Scalars['Boolean']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  ctxAppIds: Array<Scalars['String']['output']>;
  ctxPostIds: Array<Scalars['String']['output']>;
  ctxSpaceIds: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  moderator: Moderator;
  organization: ModerationOrganization;
  parentPostId?: Maybe<Scalars['String']['output']>;
  postModerationStatus?: Maybe<ModerationPostModerationStatus>;
  reason: ModerationBlockReason;
  resourceId: Scalars['String']['output'];
  resourceType: ModerationResourceType;
  rootPostId?: Maybe<Scalars['String']['output']>;
  spaceId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ModerationOrganization = {
  __typename?: 'ModerationOrganization';
  ctxAppIds?: Maybe<Array<Scalars['String']['output']>>;
  ctxPostIds?: Maybe<Array<Scalars['String']['output']>>;
  ctxSpaceIds?: Maybe<Array<Scalars['String']['output']>>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  organizationModerators?: Maybe<Array<ModerationOrganizationModerator>>;
  ownedByAccount: Account;
  processedResources?: Maybe<Array<ModerationBlockedResource>>;
};

export type ModerationOrganizationModerator = {
  __typename?: 'ModerationOrganizationModerator';
  defaultCtxAppIds?: Maybe<Array<Scalars['String']['output']>>;
  defaultCtxPostIds?: Maybe<Array<Scalars['String']['output']>>;
  defaultCtxSpaceIds?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['String']['output'];
  moderator: Moderator;
  organization: ModerationOrganization;
  role: ModeratorRole;
};

export type ModerationPostModerationStatus = {
  __typename?: 'ModerationPostModerationStatus';
  blockerResource: ModerationBlockedResource;
  id: Scalars['String']['output'];
  post: Post;
};

export enum ModerationResourceType {
  Address = 'ADDRESS',
  Cid = 'CID',
  Post = 'POST'
}

export type Moderator = {
  __typename?: 'Moderator';
  id: Scalars['String']['output'];
  moderatorOrganizations?: Maybe<Array<ModerationOrganizationModerator>>;
  processedResources?: Maybe<Array<ModerationBlockedResource>>;
  substrateAccount: Account;
};

export enum ModeratorRole {
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
  Owner = 'OWNER',
  Spectator = 'SPECTATOR'
}

export type Mutation = {
  __typename?: 'Mutation';
  commitSignedMessageWithAction?: Maybe<CommitSignedMessageResponse>;
  createNotificationSettingsToAccount: NotificationsSettings;
  /** This mutation is deprecated and "commitSignedMessageWithAction" must be used instead. */
  createTemporaryLinkingIdForTelegram: CreateTemporaryLinkingIdForTelegramResponseDto;
  /** This mutation is deprecated and "commitSignedMessageWithAction" must be used instead. */
  unlinkTelegramAccount: UnlinkTelegramAccountResponseDto;
  updateNotificationSettingsToAccount: NotificationsSettings;
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

export enum NotificationServiceName {
  Discord = 'DISCORD',
  Email = 'EMAIL',
  Fcm = 'FCM',
  Telegram = 'TELEGRAM'
}

export type NotificationSettingsInputGql = {
  subscriptions: Array<NotificationSubscriptionInputType>;
  substrateAccountId: Scalars['String']['input'];
};

export type NotificationSubscriptionInputType = {
  eventName: Scalars['String']['input'];
  fcm: Scalars['Boolean']['input'];
  telegramBot: Scalars['Boolean']['input'];
};

export type NotificationsAccountsLink = {
  __typename?: 'NotificationsAccountsLink';
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  fcmTokens: Array<Scalars['String']['output']>;
  following: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  notificationServiceAccountId: Scalars['String']['output'];
  notificationServiceName: NotificationServiceName;
  socialProfile?: Maybe<SocialProfile>;
  substrateAccount: Account;
};

export type NotificationsSettings = {
  __typename?: 'NotificationsSettings';
  id: Scalars['String']['output'];
  socialProfile?: Maybe<SocialProfile>;
  subscriptionEvents: Array<Scalars['String']['output']>;
  subscriptions: Array<NotificationsSubscription>;
  substrateAccount: Account;
};

export type NotificationsSubscription = {
  __typename?: 'NotificationsSubscription';
  eventName: Scalars['String']['output'];
  telegramBot: Scalars['Boolean']['output'];
};

export type NotificationsTelegramAccount = {
  __typename?: 'NotificationsTelegramAccount';
  accountId: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

export enum PinnedResourceType {
  Post = 'Post',
  Space = 'Space'
}

export type Post = {
  __typename?: 'Post';
  activeStaking: Scalars['Boolean']['output'];
  activeStakingSuperLikes?: Maybe<Array<ActiveStakingSuperLike>>;
  activeStakingSuperLikesCount?: Maybe<Scalars['Int']['output']>;
  /** is off-chain data CID backed up in blockchain */
  backupInBlockchain?: Maybe<Scalars['Boolean']['output']>;
  blockchainSyncFailed: Scalars['Boolean']['output'];
  blockchainSyncLog: Scalars['JSON']['output'];
  /** post body */
  body?: Maybe<Scalars['String']['output']>;
  canonical?: Maybe<Scalars['String']['output']>;
  /** content CID */
  content?: Maybe<Scalars['String']['output']>;
  createdAtBlock?: Maybe<Scalars['Int']['output']>;
  createdAtTime?: Maybe<Scalars['DateTime']['output']>;
  createdByAccount: Account;
  dataType: DataType;
  downvotesCount?: Maybe<Scalars['Int']['output']>;
  experimental?: Maybe<Scalars['JSON']['output']>;
  extensions: Array<ContentExtension>;
  followersCount?: Maybe<Scalars['Int']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  hidden: Scalars['Boolean']['output'];
  hiddenRepliesCount?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  inReplyToKind?: Maybe<InReplyToKind>;
  inReplyToPost?: Maybe<Post>;
  isComment: Scalars['Boolean']['output'];
  isShowMore: Scalars['Boolean']['output'];
  kind: PostKind;
  link?: Maybe<Scalars['String']['output']>;
  lowValue: Scalars['Boolean']['output'];
  offChainId?: Maybe<Scalars['String']['output']>;
  optimisticId?: Maybe<Scalars['String']['output']>;
  ownedByAccount: Account;
  parentPost?: Maybe<Post>;
  persistentId?: Maybe<Scalars['String']['output']>;
  pinnedByExtensions?: Maybe<Array<ExtensionPinnedResource>>;
  postFollowers?: Maybe<Array<PostFollowers>>;
  postModerationStatuses?: Maybe<Array<ModerationPostModerationStatus>>;
  /** Data protocol version */
  protVersion?: Maybe<Scalars['String']['output']>;
  publicRepliesCount?: Maybe<Scalars['Int']['output']>;
  reactionsCount?: Maybe<Scalars['Int']['output']>;
  rootPost?: Maybe<Post>;
  sharedPost?: Maybe<Post>;
  sharesCount?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  space?: Maybe<Space>;
  summary?: Maybe<Scalars['String']['output']>;
  tagsOriginal?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  tweetId?: Maybe<Scalars['String']['output']>;
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>;
  upvotesCount?: Maybe<Scalars['Int']['output']>;
  uuid?: Maybe<Scalars['String']['output']>;
  views?: Maybe<Array<PostView>>;
};

export type PostFollowers = {
  __typename?: 'PostFollowers';
  dataType: DataType;
  followerAccount: Account;
  followingPost: Post;
  id: Scalars['String']['output'];
};

export enum PostKind {
  Comment = 'Comment',
  RegularPost = 'RegularPost',
  SharedPost = 'SharedPost'
}

export type PostView = {
  __typename?: 'PostView';
  createdAtTime: Scalars['DateTime']['output'];
  duration: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  post: Post;
  userId: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  addFcmTokenToAddressMessage: SignedMessageWithActionTemplateResponseDto;
  deleteFcmTokenFromAddressMessage: SignedMessageWithActionTemplateResponseDto;
  linkAddressWithTelegramAccountMessage: SignedMessageWithActionTemplateResponseDto;
  linkingMessageForTelegramAccount: AccountsLinkingMessageTemplateGql;
  notificationSettingsByAccountId: NotificationsSettings;
  notificationsServiceHealthCheck: ServiceHealthCheckResponse;
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

export type RewardsByPostDetails = {
  __typename?: 'RewardsByPostDetails';
  amount: Scalars['String']['output'];
  distributionPercent?: Maybe<Scalars['Int']['output']>;
  from?: Maybe<RewardsByPostDirectionTarget>;
  postId: Scalars['String']['output'];
  postKind?: Maybe<PostKind>;
  postPersistentId: Scalars['String']['output'];
  sharedReward?: Maybe<Scalars['Boolean']['output']>;
  spaceId?: Maybe<Scalars['String']['output']>;
  superLikeId: Scalars['String']['output'];
  superLikeMultiplier: Scalars['Int']['output'];
  to?: Maybe<RewardsByPostDirectionTarget>;
};

export enum RewardsByPostDirectionTarget {
  App = 'APP',
  Comment = 'COMMENT',
  RegularPost = 'REGULAR_POST',
  RootPost = 'ROOT_POST',
  RootSpace = 'ROOT_SPACE',
  Share = 'SHARE',
  ShareOrigin = 'SHARE_ORIGIN',
  TargetEntityOwner = 'TARGET_ENTITY_OWNER'
}

export type RewardsReportItem = {
  __typename?: 'RewardsReportItem';
  address: Scalars['String']['output'];
  amount: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  roles: Array<Scalars['String']['output']>;
};

export type ServiceHealthCheckResponse = {
  __typename?: 'ServiceHealthCheckResponse';
  healthy: Scalars['Boolean']['output'];
};

export type SignedMessageWithActionTemplateResponseDto = {
  __typename?: 'SignedMessageWithActionTemplateResponseDto';
  messageTpl: Scalars['String']['output'];
};

export type SocialProfile = {
  __typename?: 'SocialProfile';
  account: Account;
  activeStakingTrial: Scalars['Boolean']['output'];
  activeStakingTrialFinishedAtTime?: Maybe<Scalars['DateTime']['output']>;
  activeStakingTrialStartedAtTime?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  notificationsAccountLinks?: Maybe<Array<NotificationsAccountsLink>>;
  notificationsSettings?: Maybe<NotificationsSettings>;
  referrersList?: Maybe<Array<UserReferrerDetail>>;
};

export type Space = {
  __typename?: 'Space';
  /** space body */
  about?: Maybe<Scalars['String']['output']>;
  /** content CID */
  content?: Maybe<Scalars['String']['output']>;
  createdAtBlock?: Maybe<Scalars['Int']['output']>;
  createdAtTime?: Maybe<Scalars['DateTime']['output']>;
  createdByAccount: Account;
  email?: Maybe<Scalars['String']['output']>;
  experimental?: Maybe<Scalars['JSON']['output']>;
  followers: Array<SpaceFollowers>;
  followersCount?: Maybe<Scalars['Int']['output']>;
  handle?: Maybe<Scalars['String']['output']>;
  hidden: Scalars['Boolean']['output'];
  hiddenPostsCount?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  interestsOriginal?: Maybe<Scalars['String']['output']>;
  isShowMore: Scalars['Boolean']['output'];
  linksOriginal?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  ownedByAccount: Account;
  pinnedByExtensions?: Maybe<Array<ExtensionPinnedResource>>;
  posts?: Maybe<Post>;
  postsCount?: Maybe<Scalars['Int']['output']>;
  profileSource?: Maybe<Scalars['String']['output']>;
  profileSpace?: Maybe<Account>;
  /** Data protocol version */
  protVersion?: Maybe<Scalars['String']['output']>;
  publicPostsCount?: Maybe<Scalars['Int']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  tagsOriginal?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
  updatedAtBlock?: Maybe<Scalars['Int']['output']>;
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  uuid?: Maybe<Scalars['String']['output']>;
};

export type SpaceFollowers = {
  __typename?: 'SpaceFollowers';
  dataType: DataType;
  followerAccount: Account;
  followingSpace: Space;
  id: Scalars['String']['output'];
};

export type UnlinkAddressWithTelegramAccountMessageInput = {
  proxySubstrateAddress?: InputMaybe<Scalars['String']['input']>;
  substrateAddress: Scalars['String']['input'];
};

export type UnlinkTelegramAccountResponseDto = {
  __typename?: 'UnlinkTelegramAccountResponseDto';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UserReferrerDetail = {
  __typename?: 'UserReferrerDetail';
  clientId: DataHubClientId;
  id: Scalars['String']['output'];
  referrerId: Scalars['String']['output'];
  socialProfile: SocialProfile;
  timestamp: Scalars['String']['output'];
};

export type GetTelegramAccountsLinkedQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type GetTelegramAccountsLinkedQuery = { __typename?: 'Query', telegramAccountsLinkedToSubstrateAccount: { __typename?: 'LinkedTgAccountsToSubstrateAccountResponseType', telegramAccounts?: Array<{ __typename?: 'NotificationsTelegramAccount', userName?: string | null }> | null } };

export type GetLinkingMessageForTelegramQueryVariables = Exact<{
  input: LinkAddressWithTelegramAccountMessageInput;
}>;


export type GetLinkingMessageForTelegramQuery = { __typename?: 'Query', linkAddressWithTelegramAccountMessage: { __typename?: 'SignedMessageWithActionTemplateResponseDto', messageTpl: string } };

export type CreateTemporaryLinkingIdForTelegramMutationVariables = Exact<{
  signedMessageWithDetails: Scalars['String']['input'];
}>;


export type CreateTemporaryLinkingIdForTelegramMutation = { __typename?: 'Mutation', createTemporaryLinkingIdForTelegram: { __typename?: 'CreateTemporaryLinkingIdForTelegramResponseDto', id: string } };

export type GetUnlinkingMessageForTelegramQueryVariables = Exact<{
  input: UnlinkAddressWithTelegramAccountMessageInput;
}>;


export type GetUnlinkingMessageForTelegramQuery = { __typename?: 'Query', unlinkAddressFromTelegramAccountMessage: { __typename?: 'SignedMessageWithActionTemplateResponseDto', messageTpl: string } };

export type UnlinkTelegramAccountMutationVariables = Exact<{
  signedMessageWithDetails: Scalars['String']['input'];
}>;


export type UnlinkTelegramAccountMutation = { __typename?: 'Mutation', unlinkTelegramAccount: { __typename?: 'UnlinkTelegramAccountResponseDto', message?: string | null, success: boolean } };

export type GetLinkingMessageForFcmQueryVariables = Exact<{
  input: AddFcmTokenToAddressMessageMessageInput;
}>;


export type GetLinkingMessageForFcmQuery = { __typename?: 'Query', addFcmTokenToAddressMessage: { __typename?: 'SignedMessageWithActionTemplateResponseDto', messageTpl: string } };

export type GetUnlinkingMessageFromFcmQueryVariables = Exact<{
  input: DeleteFcmTokenFromAddressMessageInput;
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
    query GetLinkingMessageForTelegram($input: LinkAddressWithTelegramAccountMessageInput!) {
  linkAddressWithTelegramAccountMessage(input: $input) {
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
    query GetUnlinkingMessageForTelegram($input: UnlinkAddressWithTelegramAccountMessageInput!) {
  unlinkAddressFromTelegramAccountMessage(input: $input) {
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
    query GetLinkingMessageForFcm($input: AddFcmTokenToAddressMessageMessageInput!) {
  addFcmTokenToAddressMessage(input: $input) {
    messageTpl
  }
}
    `;
export const GetUnlinkingMessageFromFcm = gql`
    query GetUnlinkingMessageFromFcm($input: DeleteFcmTokenFromAddressMessageInput!) {
  deleteFcmTokenFromAddressMessage(input: $input) {
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