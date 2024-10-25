import gql from 'graphql-tag'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  BigInt: { input: any; output: any }
  DateTime: { input: any; output: any }
  JSON: { input: any; output: any }
}

export type Account = {
  __typename?: 'Account'
  activeStakingSuperLikes?: Maybe<Array<ActiveStakingSuperLike>>
  /** is off-chain data CID backed up in blockchain */
  backupInBlockchain?: Maybe<Scalars['Boolean']['output']>
  dataType: DataType
  domains: Array<Domain>
  extensions: Array<ContentExtension>
  followers: Array<AccountFollowers>
  followersCount?: Maybe<Scalars['Int']['output']>
  followingAccounts: Array<AccountFollowers>
  followingAccountsCount?: Maybe<Scalars['Int']['output']>
  followingPosts: Array<PostFollowers>
  followingPostsCount?: Maybe<Scalars['Int']['output']>
  followingSpaces: Array<SpaceFollowers>
  followingSpacesCount?: Maybe<Scalars['Int']['output']>
  id: Scalars['String']['output']
  /** is core account of Linked Identity */
  isLinkedIdentityAccount: Scalars['Boolean']['output']
  linkedEvmAccounts: Array<EvmSubstrateAccountLink>
  linkedIdentity?: Maybe<LinkedIdentity>
  moderationProfile?: Maybe<Moderator>
  ownedModerationOrganizations?: Maybe<Array<ModerationOrganization>>
  ownedPostsCount?: Maybe<Scalars['Int']['output']>
  postsCreated: Array<Post>
  postsOwned: Array<Post>
  profileSpace?: Maybe<Space>
  socialProfile?: Maybe<SocialProfile>
  spacesCreated: Array<Space>
  spacesOwned: Array<Space>
}

export type AccountActivityMetricsForFixedPeriodInput = {
  address: Scalars['String']['input']
  creator?: InputMaybe<CreatorActivityMetricsForFixedPeriodInput>
  period?: InputMaybe<ActiveStakingPeriod>
  periodValue?: InputMaybe<Scalars['String']['input']>
  staker?: InputMaybe<StakerActivityMetricsForFixedPeriodInput>
}

export type AccountActivityMetricsForFixedPeriodResponseDto = {
  __typename?: 'AccountActivityMetricsForFixedPeriodResponseDto'
  creator?: Maybe<CreatorActivityMetrics>
  staker?: Maybe<StakerActivityMetrics>
}

export type AccountFollowers = {
  __typename?: 'AccountFollowers'
  dataType: DataType
  followerAccount: Account
  followingAccount: Account
  id: Scalars['String']['output']
}

export type AccountServiceMessageInput = {
  msg: SubscriptionServiceAccountTokenMessage
  sig: Scalars['String']['input']
}

export type AccountServiceMessageToTargetMeta = {
  __typename?: 'AccountServiceMessageToTargetMeta'
  callId?: Maybe<Scalars['String']['output']>
  callName?: Maybe<SocialCallName>
  code: ServiceMessageStatusCode
  extension?: Maybe<Scalars['JSON']['output']>
  msg?: Maybe<Scalars['String']['output']>
  targetAddress: Scalars['String']['output']
}

export type AccountServiceMessageToTargetResponse = {
  __typename?: 'AccountServiceMessageToTargetResponse'
  event: DataHubSubscriptionEventEnum
  meta: AccountServiceMessageToTargetMeta
}

export enum ActiveStakingAccountRole {
  Creator = 'CREATOR',
  Staker = 'STAKER',
}

export enum ActiveStakingListOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}

export enum ActiveStakingPeriod {
  AllTime = 'ALL_TIME',
  Day = 'DAY',
  Month = 'MONTH',
  Week = 'WEEK',
}

export type ActiveStakingRewardsReport = {
  __typename?: 'ActiveStakingRewardsReport'
  aggregationPeriod: Scalars['String']['output']
  createdAtTime: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  reportData: Array<RewardsReportItem>
  week?: Maybe<Scalars['Int']['output']>
}

export type ActiveStakingSuperLike = {
  __typename?: 'ActiveStakingSuperLike'
  aggregatedDaily: Scalars['Boolean']['output']
  blockHash?: Maybe<Scalars['String']['output']>
  createdAtTime: Scalars['DateTime']['output']
  creatorAddress?: Maybe<Scalars['String']['output']>
  date: Scalars['BigInt']['output']
  era?: Maybe<Scalars['Int']['output']>
  id: Scalars['String']['output']
  kind: Scalars['String']['output']
  likedPostId?: Maybe<Scalars['String']['output']>
  likedPostPersistentId?: Maybe<Scalars['String']['output']>
  multiplier: Scalars['Int']['output']
  post: Post
  postKind: PostKind
  revokedByModeration: Scalars['Boolean']['output']
  sharedPost?: Maybe<Post>
  staker: Account
  stakerAddress?: Maybe<Scalars['String']['output']>
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>
  week: Scalars['Int']['output']
}

export type AddressRankByRewardsCompetitorResponseDto = {
  __typename?: 'AddressRankByRewardsCompetitorResponseDto'
  address: Scalars['String']['output']
  rankIndex: Scalars['Int']['output']
  reward?: Maybe<Scalars['String']['output']>
}

export type AddressRankByRewardsForPeriodInput = {
  aboveCompetitorsNumber?: InputMaybe<Scalars['Int']['input']>
  address: Scalars['String']['input']
  belowCompetitorsNumber?: InputMaybe<Scalars['Int']['input']>
  period: ActiveStakingPeriod
  role: ActiveStakingAccountRole
  timestamp?: InputMaybe<Scalars['String']['input']>
  withReward?: InputMaybe<Scalars['Boolean']['input']>
}

export type AddressRankByRewardsForPeriodResponseDto = {
  __typename?: 'AddressRankByRewardsForPeriodResponseDto'
  aboveCompetitors?: Maybe<Array<AddressRankByRewardsCompetitorResponseDto>>
  belowCompetitors?: Maybe<Array<AddressRankByRewardsCompetitorResponseDto>>
  maxIndex: Scalars['Int']['output']
  rankIndex: Scalars['Int']['output']
  reward?: Maybe<Scalars['String']['output']>
}

export type AddressRankByTotalRewardsForPeriodInput = {
  aboveCompetitorsNumber?: InputMaybe<Scalars['Int']['input']>
  address: Scalars['String']['input']
  belowCompetitorsNumber?: InputMaybe<Scalars['Int']['input']>
  period: ActiveStakingPeriod
  timestamp?: InputMaybe<Scalars['String']['input']>
  withReward?: InputMaybe<Scalars['Boolean']['input']>
}

export type AddressRankedBySuperLikesForPeriodResponseDto = {
  __typename?: 'AddressRankedBySuperLikesForPeriodResponseDto'
  address: Scalars['String']['output']
  count: Scalars['Int']['output']
}

export type AddressesRankedByRewardsForPeriodFilter = {
  period: ActiveStakingPeriod
  role: ActiveStakingAccountRole
  timestamp?: InputMaybe<Scalars['String']['input']>
}

export type AddressesRankedByRewardsForPeriodInput = {
  filter: AddressesRankedByRewardsForPeriodFilter
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<ActiveStakingListOrder>
}

export type AddressesRankedByRewardsForPeriodResponseDto = {
  __typename?: 'AddressesRankedByRewardsForPeriodResponseDto'
  data: Array<RankedAddressWithDetails>
  limit: Scalars['Int']['output']
  offset: Scalars['Int']['output']
  total: Scalars['Int']['output']
}

export type AddressesRankedBySuperLikesForPeriodInput = {
  fromTime: Scalars['String']['input']
  limit?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<ActiveStakingListOrder>
  toTime?: InputMaybe<Scalars['String']['input']>
}

export type AddressesRankedByTotalRewardsForPeriodFilter = {
  period: ActiveStakingPeriod
  timestamp?: InputMaybe<Scalars['String']['input']>
}

export type AddressesRankedByTotalRewardsForPeriodInput = {
  filter: AddressesRankedByTotalRewardsForPeriodFilter
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<ActiveStakingListOrder>
}

export type ApprovedResourcesArgsInputDto = {
  filter: ApprovedResourcesFilter
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<QueryOrder>
  pageSize?: InputMaybe<Scalars['Int']['input']>
}

export type ApprovedResourcesFilter = {
  createdByAccountAddress: Scalars['String']['input']
  resourceType?: InputMaybe<ModerationResourceType>
}

export type ApprovedResourcesResponseDto = {
  __typename?: 'ApprovedResourcesResponseDto'
  data: Array<ModerationApprovedResource>
  offset?: Maybe<Scalars['Int']['output']>
  pageSize?: Maybe<Scalars['Int']['output']>
  total?: Maybe<Scalars['Int']['output']>
}

export type BalancesInput = {
  where: BalancesInputWhereArgs
}

export type BalancesInputWhereArgs = {
  address: Scalars['String']['input']
}

export type BlockedResourceIdsBatchItem = {
  __typename?: 'BlockedResourceIdsBatchItem'
  blockedResourceIds: Array<Scalars['String']['output']>
  id: Scalars['String']['output']
}

export type BlockedResourceIdsBatchResponse = {
  __typename?: 'BlockedResourceIdsBatchResponse'
  byCtxAppIds: Array<BlockedResourceIdsBatchItem>
  byCtxPostIds: Array<BlockedResourceIdsBatchItem>
  byCtxSpaceIds: Array<BlockedResourceIdsBatchItem>
}

export type BlockedResourcesArgsInputDto = {
  filter: BlockedResourcesFilter
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<QueryOrder>
  pageSize?: InputMaybe<Scalars['Int']['input']>
}

export type BlockedResourcesFilter = {
  createdByAccountAddress: Scalars['String']['input']
  resourceType?: InputMaybe<ModerationResourceType>
}

export type BlockedResourcesResponseDto = {
  __typename?: 'BlockedResourcesResponseDto'
  data: Array<ModerationBlockedResource>
  offset?: Maybe<Scalars['Int']['output']>
  pageSize?: Maybe<Scalars['Int']['output']>
  total?: Maybe<Scalars['Int']['output']>
}

export type CanDoSuperLikeByPostInput = {
  postIds?: InputMaybe<Array<Scalars['String']['input']>>
  postPersistentIds?: InputMaybe<Array<Scalars['String']['input']>>
}

export type CanDoSuperLikeByPostsResponseDto = {
  __typename?: 'CanDoSuperLikeByPostsResponseDto'
  persistentPostId: Scalars['String']['output']
  possible: Scalars['Boolean']['output']
  postId: Scalars['String']['output']
  validByCreationDate: Scalars['Boolean']['output']
  validByCreatorMinStake: Scalars['Boolean']['output']
  validByLowValue: Scalars['Boolean']['output']
}

export type CommentDataShort = {
  __typename?: 'CommentDataShort'
  body?: Maybe<Scalars['String']['output']>
  content?: Maybe<Scalars['String']['output']>
  createdAtTime: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  optimisticId?: Maybe<Scalars['String']['output']>
  persistentId?: Maybe<Scalars['String']['output']>
  rootPostId: Scalars['String']['output']
  rootPostPersistentId: Scalars['String']['output']
  summary?: Maybe<Scalars['String']['output']>
}

export type ContainerConfigMetadata = {
  __typename?: 'ContainerConfigMetadata'
  coverImage?: Maybe<Scalars['String']['output']>
  description?: Maybe<Scalars['String']['output']>
  image?: Maybe<Scalars['String']['output']>
  isExternalTokenRewardPool?: Maybe<Scalars['Boolean']['output']>
  rewardPoolAmount?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
  winnersNumber?: Maybe<Scalars['Int']['output']>
}

export type ContentContainerConfig = {
  __typename?: 'ContentContainerConfig'
  accessThresholdExternalTokenAmount?: Maybe<Scalars['String']['output']>
  accessThresholdPointsAmount?: Maybe<Scalars['String']['output']>
  addressBlockOneTimePenaltyPointsAmount?: Maybe<Scalars['String']['output']>
  closedAt?: Maybe<Scalars['DateTime']['output']>
  containerType: ContentContainerType
  createCommentPricePointsAmount?: Maybe<Scalars['String']['output']>
  createdAtTime: Scalars['DateTime']['output']
  expirationWindowFrom?: Maybe<Scalars['DateTime']['output']>
  expirationWindowTo?: Maybe<Scalars['DateTime']['output']>
  externalToken?: Maybe<ExternalToken>
  hidden: Scalars['Boolean']['output']
  id: Scalars['String']['output']
  isCreatorModerationPenalty?: Maybe<Scalars['Boolean']['output']>
  isDeductionRewardsOnModeration?: Maybe<Scalars['Boolean']['output']>
  isExpirable: Scalars['Boolean']['output']
  isPostModerationPenalty?: Maybe<Scalars['Boolean']['output']>
  likeThresholdExternalTokenAmount?: Maybe<Scalars['String']['output']>
  metadata: ContainerConfigMetadata
  openAt?: Maybe<Scalars['DateTime']['output']>
  postBlockOneTimePenaltyPointsAmount?: Maybe<Scalars['String']['output']>
  rootPost: Post
  rootSpace?: Maybe<Space>
  slug: Scalars['String']['output']
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>
}

export type ContentContainerConfigsArgsInputDto = {
  filter: ContentContainerConfigsFilter
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<QueryOrder>
  pageSize?: InputMaybe<Scalars['Int']['input']>
}

export type ContentContainerConfigsFilter = {
  containerType?: InputMaybe<Array<ContentContainerType>>
  hidden?: InputMaybe<Scalars['Boolean']['input']>
  ids?: InputMaybe<Array<Scalars['String']['input']>>
  isClosed?: InputMaybe<Scalars['Boolean']['input']>
  isExpirable?: InputMaybe<Scalars['Boolean']['input']>
  isOpen?: InputMaybe<Scalars['Boolean']['input']>
  rootPostIds?: InputMaybe<Array<Scalars['String']['input']>>
  rootSpaceId?: InputMaybe<Scalars['String']['input']>
}

export type ContentContainerConfigsResourcesResponseDto = {
  __typename?: 'ContentContainerConfigsResourcesResponseDto'
  data: Array<ContentContainerConfig>
  offset?: Maybe<Scalars['Int']['output']>
  pageSize?: Maybe<Scalars['Int']['output']>
  total?: Maybe<Scalars['Int']['output']>
}

export type ContentContainerExternalTokenContractMethods = {
  __typename?: 'ContentContainerExternalTokenContractMethods'
  balanceOf: Scalars['String']['output']
}

export enum ContentContainerType {
  CommunityChannel = 'COMMUNITY_CHANNEL',
  Contest = 'CONTEST',
  PublicChannel = 'PUBLIC_CHANNEL',
}

export type ContentExtension = {
  __typename?: 'ContentExtension'
  amount?: Maybe<Scalars['String']['output']>
  chain?: Maybe<Scalars['String']['output']>
  collectionId?: Maybe<Scalars['String']['output']>
  createdBy?: Maybe<Account>
  decimals?: Maybe<Scalars['Int']['output']>
  extensionSchemaId: ContentExtensionSchemaId
  fromEvm?: Maybe<EvmAccount>
  fromSubstrate?: Maybe<Account>
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  message?: Maybe<Scalars['String']['output']>
  nftId?: Maybe<Scalars['String']['output']>
  nonce?: Maybe<Scalars['String']['output']>
  parentPost: Post
  pinnedResources?: Maybe<Array<ExtensionPinnedResource>>
  recipient?: Maybe<Account>
  toEvm?: Maybe<EvmAccount>
  toSubstrate?: Maybe<Account>
  token?: Maybe<Scalars['String']['output']>
  txHash?: Maybe<Scalars['String']['output']>
  url?: Maybe<Scalars['String']['output']>
}

export enum ContentExtensionSchemaId {
  SubsocialDecodedPromo = 'subsocial_decoded_promo',
  SubsocialDonations = 'subsocial_donations',
  SubsocialEvmNft = 'subsocial_evm_nft',
  SubsocialImage = 'subsocial_image',
  SubsocialPinnedPosts = 'subsocial_pinned_posts',
  SubsocialSecretBox = 'subsocial_secret_box',
}

export type CreateOrganizationInput = {
  ctxAppIds?: InputMaybe<Array<Scalars['String']['input']>>
  ctxPostIds?: InputMaybe<Array<Scalars['String']['input']>>
  ctxSpaceIds?: InputMaybe<Array<Scalars['String']['input']>>
  description?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  ownedByAccountAddress: Scalars['String']['input']
}

export type CreatorActivityMetrics = {
  __typename?: 'CreatorActivityMetrics'
  earnedByPeriod?: Maybe<Scalars['String']['output']>
  earnedPointsByPeriod?: Maybe<Scalars['String']['output']>
  earnedPointsTotal?: Maybe<Scalars['String']['output']>
  earnedTotal?: Maybe<Scalars['String']['output']>
  likesCountByPeriod?: Maybe<Scalars['Int']['output']>
  stakersWhoLiked?: Maybe<Scalars['Int']['output']>
}

export type CreatorActivityMetricsForFixedPeriodInput = {
  earnedByPeriod?: InputMaybe<Scalars['Boolean']['input']>
  earnedPointsByPeriod?: InputMaybe<Scalars['Boolean']['input']>
  earnedPointsTotal?: InputMaybe<Scalars['Boolean']['input']>
  earnedTotal?: InputMaybe<Scalars['Boolean']['input']>
  likesCountByPeriod?: InputMaybe<Scalars['Boolean']['input']>
  stakersWhoLiked?: InputMaybe<Scalars['Boolean']['input']>
}

export type DailyStatsByStakerInput = {
  address: Scalars['String']['input']
  dayTimestamp: Scalars['Int']['input']
  range?: InputMaybe<ActiveStakingPeriod>
}

export type DailyStatsByStakerResponse = {
  __typename?: 'DailyStatsByStakerResponse'
  currentRewardAmount: Scalars['String']['output']
  currentRewardPointsAmount: Scalars['String']['output']
  initialPoints: Scalars['Int']['output']
  stakerRewordDistribution: Scalars['Int']['output']
  superLikesCount: Scalars['Int']['output']
  tokensRewardDistributionPool: Scalars['String']['output']
}

export enum DataHubClientId {
  Grillapp = 'GRILLAPP',
  Grillso = 'GRILLSO',
  Other = 'OTHER',
  Polkaverse = 'POLKAVERSE',
}

export enum DataHubSubscriptionEventEnum {
  ActiveStakingSuperLikeCreated = 'ACTIVE_STAKING_SUPER_LIKE_CREATED',
  ActiveStakingSuperLikeStateUpdated = 'ACTIVE_STAKING_SUPER_LIKE_STATE_UPDATED',
  EvmAddressLinkedToAccount = 'EVM_ADDRESS_LINKED_TO_ACCOUNT',
  EvmAddressLinkToAccountStateUpdated = 'EVM_ADDRESS_LINK_TO_ACCOUNT_STATE_UPDATED',
  LinkedIdentityCreated = 'LINKED_IDENTITY_CREATED',
  LinkedIdentityExternalProviderCreated = 'LINKED_IDENTITY_EXTERNAL_PROVIDER_CREATED',
  LinkedIdentityExternalProviderStateUpdated = 'LINKED_IDENTITY_EXTERNAL_PROVIDER_STATE_UPDATED',
  LinkedIdentitySessionCreated = 'LINKED_IDENTITY_SESSION_CREATED',
  LinkedIdentitySessionStateUpdated = 'LINKED_IDENTITY_SESSION_STATE_UPDATED',
  LinkedIdentityStateUpdated = 'LINKED_IDENTITY_STATE_UPDATED',
  ModerationBlockedResourceCreated = 'MODERATION_BLOCKED_RESOURCE_CREATED',
  ModerationBlockedResourceStateUpdated = 'MODERATION_BLOCKED_RESOURCE_STATE_UPDATED',
  ModerationModeratorCreated = 'MODERATION_MODERATOR_CREATED',
  ModerationModeratorStateUpdated = 'MODERATION_MODERATOR_STATE_UPDATED',
  ModerationOrganizationCreated = 'MODERATION_ORGANIZATION_CREATED',
  ModerationOrganizationStateUpdated = 'MODERATION_ORGANIZATION_STATE_UPDATED',
  PostCreated = 'POST_CREATED',
  PostFollowed = 'POST_FOLLOWED',
  PostFollowStateUpdated = 'POST_FOLLOW_STATE_UPDATED',
  PostStateUpdated = 'POST_STATE_UPDATED',
  ServiceAccountErrorEvent = 'SERVICE_ACCOUNT_ERROR_EVENT',
  ServiceAccountInfoEvent = 'SERVICE_ACCOUNT_INFO_EVENT',
  ServiceAccountSuccessEvent = 'SERVICE_ACCOUNT_SUCCESS_EVENT',
  ServiceAccountWarningEvent = 'SERVICE_ACCOUNT_WARNING_EVENT',
  SocialProfileBalancesCreated = 'SOCIAL_PROFILE_BALANCES_CREATED',
  SocialProfileBalancesStateUpdated = 'SOCIAL_PROFILE_BALANCES_STATE_UPDATED',
  SocialProfileExternalTokenBalanceCreated = 'SOCIAL_PROFILE_EXTERNAL_TOKEN_BALANCE_CREATED',
  SocialProfileExternalTokenBalanceStateUpdated = 'SOCIAL_PROFILE_EXTERNAL_TOKEN_BALANCE_STATE_UPDATED',
}

export enum DataType {
  OffChain = 'offChain',
  Optimistic = 'optimistic',
  Persistent = 'persistent',
}

export type DateTimeDetailsResponseDto = {
  __typename?: 'DateTimeDetailsResponseDto'
  day?: Maybe<Scalars['Int']['output']>
  dayWithoutTime: Scalars['Int']['output']
  timestamp?: Maybe<Scalars['String']['output']>
  week?: Maybe<Scalars['Int']['output']>
}

export type Domain = {
  __typename?: 'Domain'
  createdAtBlock?: Maybe<Scalars['Int']['output']>
  createdAtDate: Scalars['DateTime']['output']
  id: Scalars['String']['output']
  ownedByAccount: Account
  ownershipTransfers?: Maybe<Array<DomainOwnershipTransferDetails>>
  updatedAtBlock?: Maybe<Scalars['Int']['output']>
  updatedAtDate?: Maybe<Scalars['DateTime']['output']>
  value: Scalars['String']['output']
}

export type DomainOwnershipTransferDetails = {
  __typename?: 'DomainOwnershipTransferDetails'
  acceptedAtBlock?: Maybe<Scalars['Int']['output']>
  acceptedAtDateTimestamp: Scalars['String']['output']
  fromAddress: Scalars['String']['output']
  toAddress: Scalars['String']['output']
}

export type DomainsInput = {
  where: DomainsInputWhereArgs
}

export type DomainsInputWhereArgs = {
  ownedByAddress?: InputMaybe<Array<Scalars['String']['input']>>
  values?: InputMaybe<Array<Scalars['String']['input']>>
}

export type DomainsResponse = {
  __typename?: 'DomainsResponse'
  data: Array<Domain>
  total: Scalars['Int']['output']
}

export type EntranceDailyRewardSequenceInput = {
  where: EntranceDailyRewardSequenceWhereArgs
}

export type EntranceDailyRewardSequenceWhereArgs = {
  address: Scalars['String']['input']
}

export type EntranceDailyRewardsSequenceItem = {
  __typename?: 'EntranceDailyRewardsSequenceItem'
  claimRewardPoints: Scalars['String']['output']
  claimRewardPointsRange?: Maybe<Array<Scalars['Int']['output']>>
  claimValidDay?: Maybe<Scalars['String']['output']>
  claimedAt?: Maybe<Scalars['String']['output']>
  hiddenClaimReward: Scalars['Boolean']['output']
  index: Scalars['Int']['output']
  openToClaim: Scalars['Boolean']['output']
}

export type EvmAccount = {
  __typename?: 'EvmAccount'
  id: Scalars['String']['output']
  linkedSubstrateAccounts: Array<EvmSubstrateAccountLink>
}

export type EvmSubstrateAccountLink = {
  __typename?: 'EvmSubstrateAccountLink'
  active: Scalars['Boolean']['output']
  createdAtBlock: Scalars['Int']['output']
  createdAtTime: Scalars['DateTime']['output']
  dataType: DataType
  evmAccount: EvmAccount
  id: Scalars['String']['output']
  substrateAccount: Account
}

export type ExtensionPinnedResource = {
  __typename?: 'ExtensionPinnedResource'
  contentExtension: ContentExtension
  id: Scalars['String']['output']
  post?: Maybe<Post>
  resourceType: PinnedResourceType
  space?: Maybe<Space>
}

export type ExternalToken = {
  __typename?: 'ExternalToken'
  address: Scalars['String']['output']
  chain: ExternalTokenChain
  contractAbi: Scalars['String']['output']
  contractMethods?: Maybe<ContentContainerExternalTokenContractMethods>
  createdByAccount: Account
  decimals: Scalars['Int']['output']
  id: Scalars['String']['output']
  name: Scalars['String']['output']
  relatedContentContainers: Array<ContentContainerConfig>
  symbol: Scalars['String']['output']
}

export enum ExternalTokenChain {
  Ethereum = 'ETHEREUM',
  Solana = 'SOLANA',
}

export type FindPostsFilter = {
  AND?: InputMaybe<Array<FindPostsFilter>>
  OR?: InputMaybe<Array<FindPostsFilter>>
  activeStaking?: InputMaybe<Scalars['Boolean']['input']>
  approvedInRootPost?: InputMaybe<Scalars['Boolean']['input']>
  /** Do not provide this parameter if you do not need include moderation filter in response. */
  blockedByModeration?: InputMaybe<Scalars['Boolean']['input']>
  createdAtTime?: InputMaybe<Scalars['String']['input']>
  /** Datetime as ISO 8601 string */
  createdAtTimeGt?: InputMaybe<Scalars['String']['input']>
  /** Datetime as ISO 8601 string */
  createdAtTimeGte?: InputMaybe<Scalars['String']['input']>
  /** Datetime as ISO 8601 string */
  createdAtTimeLt?: InputMaybe<Scalars['String']['input']>
  /** Datetime as ISO 8601 string */
  createdAtTimeLte?: InputMaybe<Scalars['String']['input']>
  createdByAccountAddress?: InputMaybe<Scalars['String']['input']>
  dataType?: InputMaybe<SocialEventDataType>
  ids?: InputMaybe<Array<Scalars['String']['input']>>
  lowValue?: InputMaybe<Scalars['Boolean']['input']>
  optimisticIds?: InputMaybe<Array<Scalars['String']['input']>>
  ownedByAccountAddress?: InputMaybe<Scalars['String']['input']>
  parentPostId?: InputMaybe<Scalars['String']['input']>
  parentPostPersistentId?: InputMaybe<Scalars['String']['input']>
  persistentIds?: InputMaybe<Array<Scalars['String']['input']>>
  rootPostId?: InputMaybe<Scalars['String']['input']>
  rootPostPersistentId?: InputMaybe<Scalars['String']['input']>
  spaceId?: InputMaybe<Scalars['String']['input']>
}

export type FindPostsResponseDto = {
  __typename?: 'FindPostsResponseDto'
  data: Array<Post>
  offset?: Maybe<Scalars['Int']['output']>
  pageSize?: Maybe<Scalars['Int']['output']>
  total?: Maybe<Scalars['Int']['output']>
}

export type FindPostsWithFilterArgs = {
  filter: FindPostsFilter
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<QueryOrder>
  pageSize?: InputMaybe<Scalars['Int']['input']>
}

export type FindSpacesFilter = {
  asProfileForAccounts?: InputMaybe<Array<Scalars['String']['input']>>
  createdByAccountAddress?: InputMaybe<Scalars['String']['input']>
  ids?: InputMaybe<Array<Scalars['String']['input']>>
  ownedByAccountAddress?: InputMaybe<Scalars['String']['input']>
}

export type FindSpacesWithFilterArgsInput = {
  filter: FindSpacesFilter
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<QueryOrder>
  pageSize?: InputMaybe<Scalars['Int']['input']>
}

export type FindSpacesWithFilterResponseDto = {
  __typename?: 'FindSpacesWithFilterResponseDto'
  data: Array<Space>
  offset?: Maybe<Scalars['Int']['output']>
  pageSize?: Maybe<Scalars['Int']['output']>
  total?: Maybe<Scalars['Int']['output']>
}

export type FindTasksFilter = {
  address: Scalars['String']['input']
  completed?: InputMaybe<Scalars['Boolean']['input']>
  rootSpaceId?: InputMaybe<Scalars['String']['input']>
}

export type FindTasksResponseDto = {
  __typename?: 'FindTasksResponseDto'
  data: Array<GamificationTask>
  offset?: Maybe<Scalars['Int']['output']>
  pageSize?: Maybe<Scalars['Int']['output']>
  total?: Maybe<Scalars['Int']['output']>
}

export type FindTasksWithFilterArgs = {
  filter: FindTasksFilter
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<QueryOrder>
  pageSize?: InputMaybe<Scalars['Int']['input']>
}

export type GamificationEntranceDailyRewardsSequence = {
  __typename?: 'GamificationEntranceDailyRewardsSequence'
  active: Scalars['Boolean']['output']
  claims: Array<EntranceDailyRewardsSequenceItem>
  claimsCount: Scalars['Int']['output']
  date: Scalars['BigInt']['output']
  id: Scalars['String']['output']
  socialProfile: SocialProfile
  totalSequenceRewardPoints: Scalars['String']['output']
}

export type GamificationTask = {
  __typename?: 'GamificationTask'
  claimed: Scalars['Boolean']['output']
  claimedAt?: Maybe<Scalars['DateTime']['output']>
  completed: Scalars['Boolean']['output']
  completedAt?: Maybe<Scalars['DateTime']['output']>
  createdAt?: Maybe<Scalars['DateTime']['output']>
  id: Scalars['String']['output']
  index: Scalars['Int']['output']
  linkedIdentity: LinkedIdentity
  metadata?: Maybe<GamificationTaskMetadata>
  name: GamificationTaskName
  periodicityConfig?: Maybe<Scalars['String']['output']>
  periodicityType: GamificationTaskPeriodicity
  rewardPoints: Scalars['String']['output']
  rootSpace?: Maybe<Space>
  startedAt?: Maybe<Scalars['DateTime']['output']>
  tag: Scalars['String']['output']
  updatedAt?: Maybe<Scalars['DateTime']['output']>
  validityTimeRange: GamificationTaskValidityTimeRange
  /** Week number or day timestamp without time */
  validityTimeRangeValue?: Maybe<Scalars['Int']['output']>
}

export type GamificationTaskMetadata = {
  __typename?: 'GamificationTaskMetadata'
  claimedRewardPoints: Scalars['String']['output']
  likesNumberToAchieve?: Maybe<Scalars['String']['output']>
  referralsNumberToAchieve?: Maybe<Scalars['Int']['output']>
  telegramChannelToJoin?: Maybe<Scalars['String']['output']>
  twitterChannelToJoin?: Maybe<Scalars['String']['output']>
  userExternalProvider?: Maybe<IdentityProvider>
  userExternalProviderId?: Maybe<Scalars['String']['output']>
}

export enum GamificationTaskName {
  InviteReferrals = 'INVITE_REFERRALS',
  JoinTelegramChannel = 'JOIN_TELEGRAM_CHANNEL',
  JoinTwitter = 'JOIN_TWITTER',
}

export enum GamificationTaskPeriodicity {
  Daily = 'DAILY',
  Onetime = 'ONETIME',
  Weekly = 'WEEKLY',
}

export enum GamificationTaskValidityTimeRange {
  Day = 'DAY',
  Infinite = 'INFINITE',
  Week = 'WEEK',
}

export type GetModeratorByInput = {
  substrateAccountAddress: Scalars['String']['input']
}

export type GetOrganizationWhere = {
  id: Scalars['String']['input']
}

export type IdTimestampPair = {
  id: Scalars['String']['input']
  timestamp_gt: Scalars['String']['input']
}

export enum IdentityProvider {
  Email = 'EMAIL',
  Evm = 'EVM',
  Facebook = 'FACEBOOK',
  Farcaster = 'FARCASTER',
  Google = 'GOOGLE',
  Polkadot = 'POLKADOT',
  Solana = 'SOLANA',
  Telegram = 'TELEGRAM',
  Twitter = 'TWITTER',
}

export enum InReplyToKind {
  Post = 'Post',
}

export type InitModeratorInputDto = {
  ctxAppIds?: InputMaybe<Array<Scalars['String']['input']>>
  ctxPostIds?: InputMaybe<Array<Scalars['String']['input']>>
  ctxSpaceIds?: InputMaybe<Array<Scalars['String']['input']>>
  substrateAddress: Scalars['String']['input']
  withOrganization?: InputMaybe<Scalars['Boolean']['input']>
}

export type IsBalanceSufficientForSocialActionInput = {
  address: Scalars['String']['input']
  containerId?: InputMaybe<Scalars['String']['input']>
  socialAction: SocialAction
}

export type IsBalanceSufficientForSocialActionResponse = {
  __typename?: 'IsBalanceSufficientForSocialActionResponse'
  sufficient: Scalars['Boolean']['output']
}

export type LikedPostsCountByDayItem = {
  __typename?: 'LikedPostsCountByDayItem'
  count: Scalars['Int']['output']
  dayUnixTimestamp: Scalars['String']['output']
}

export type LinkedIdentity = {
  __typename?: 'LinkedIdentity'
  account: Account
  createdAtTime: Scalars['DateTime']['output']
  externalProviders?: Maybe<Array<LinkedIdentityExternalProvider>>
  id: Scalars['String']['output']
  sessions?: Maybe<Array<LinkedIdentitySession>>
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>
}

export type LinkedIdentityArgs = {
  externalProvider?: InputMaybe<LinkedIdentityExternalProviderArgs>
  id?: InputMaybe<Scalars['String']['input']>
  sessionAddress?: InputMaybe<Scalars['String']['input']>
}

export type LinkedIdentityExternalProvider = {
  __typename?: 'LinkedIdentityExternalProvider'
  createdAtTime: Scalars['DateTime']['output']
  enabled: Scalars['Boolean']['output']
  evmProofMsg?: Maybe<Scalars['String']['output']>
  evmProofMsgSig?: Maybe<Scalars['String']['output']>
  externalId: Scalars['String']['output']
  farcasterCustodyAddress?: Maybe<Scalars['String']['output']>
  farcasterSignerUuid?: Maybe<Scalars['String']['output']>
  farcasterVerifiedEthAddresses: Array<Scalars['String']['output']>
  farcasterVerifiedSolAddresses: Array<Scalars['String']['output']>
  id: Scalars['String']['output']
  isAutoInitialized: Scalars['Boolean']['output']
  linkedIdentity: LinkedIdentity
  provider: IdentityProvider
  synthetic: Scalars['Boolean']['output']
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>
  username?: Maybe<Scalars['String']['output']>
}

export type LinkedIdentityExternalProviderArgs = {
  externalId?: InputMaybe<Scalars['String']['input']>
  provider?: InputMaybe<IdentityProvider>
}

export type LinkedIdentitySession = {
  __typename?: 'LinkedIdentitySession'
  createdAtTime: Scalars['DateTime']['output']
  enabled: Scalars['Boolean']['output']
  id: Scalars['String']['output']
  linkedIdentity: LinkedIdentity
  sessionDetails?: Maybe<Scalars['String']['output']>
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>
}

export type LinkedIdentitySubscriptionGenericEntityPayload = {
  __typename?: 'LinkedIdentitySubscriptionGenericEntityPayload'
  externalProvider?: Maybe<LinkedIdentityExternalProvider>
  linkedIdentity?: Maybe<LinkedIdentity>
  session?: Maybe<LinkedIdentitySession>
}

export type LinkedIdentitySubscriptionGenericPayload = {
  __typename?: 'LinkedIdentitySubscriptionGenericPayload'
  entity: LinkedIdentitySubscriptionGenericEntityPayload
  event: DataHubSubscriptionEventEnum
}

export type ModerationApprovedResource = {
  __typename?: 'ModerationApprovedResource'
  approved: Scalars['Boolean']['output']
  comment?: Maybe<Scalars['String']['output']>
  createdAt: Scalars['DateTime']['output']
  ctxAppIds: Array<Scalars['String']['output']>
  ctxPostIds: Array<Scalars['String']['output']>
  ctxSpaceIds: Array<Scalars['String']['output']>
  id: Scalars['String']['output']
  moderator: Moderator
  organization: ModerationOrganization
  parentPostId?: Maybe<Scalars['String']['output']>
  resourceId: Scalars['String']['output']
  resourceType: ModerationResourceType
  rootPostId?: Maybe<Scalars['String']['output']>
  spaceId?: Maybe<Scalars['String']['output']>
  updatedAt?: Maybe<Scalars['DateTime']['output']>
}

export type ModerationBlockReason = {
  __typename?: 'ModerationBlockReason'
  id: Scalars['String']['output']
  reasonText: Scalars['String']['output']
}

export type ModerationBlockedResource = {
  __typename?: 'ModerationBlockedResource'
  blocked: Scalars['Boolean']['output']
  comment?: Maybe<Scalars['String']['output']>
  createdAt: Scalars['DateTime']['output']
  ctxAppIds: Array<Scalars['String']['output']>
  ctxPostIds: Array<Scalars['String']['output']>
  ctxSpaceIds: Array<Scalars['String']['output']>
  id: Scalars['String']['output']
  moderator: Moderator
  organization: ModerationOrganization
  parentPostId?: Maybe<Scalars['String']['output']>
  postModerationStatus?: Maybe<ModerationPostModerationStatus>
  reason: ModerationBlockReason
  resourceId: Scalars['String']['output']
  resourceType: ModerationResourceType
  rootPostId?: Maybe<Scalars['String']['output']>
  spaceId?: Maybe<Scalars['String']['output']>
  updatedAt?: Maybe<Scalars['DateTime']['output']>
}

export type ModerationBlockedResourceSubscriptionPayload = {
  __typename?: 'ModerationBlockedResourceSubscriptionPayload'
  entity: ModerationBlockedResource
  event: DataHubSubscriptionEventEnum
}

export type ModerationCreateOrganizationModeratorInput = {
  defaultCtxAppIds?: InputMaybe<Array<Scalars['String']['input']>>
  defaultCtxPostIds?: InputMaybe<Array<Scalars['String']['input']>>
  defaultCtxSpaceIds?: InputMaybe<Array<Scalars['String']['input']>>
  moderatorId: Scalars['String']['input']
  organizationId: Scalars['String']['input']
  role: ModeratorRole
}

export type ModerationOrganization = {
  __typename?: 'ModerationOrganization'
  ctxAppIds?: Maybe<Array<Scalars['String']['output']>>
  ctxPostIds?: Maybe<Array<Scalars['String']['output']>>
  ctxSpaceIds?: Maybe<Array<Scalars['String']['output']>>
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  name?: Maybe<Scalars['String']['output']>
  organizationModerators?: Maybe<Array<ModerationOrganizationModerator>>
  ownedByAccount: Account
  processedResources?: Maybe<Array<ModerationBlockedResource>>
}

export type ModerationOrganizationModerator = {
  __typename?: 'ModerationOrganizationModerator'
  defaultCtxAppIds?: Maybe<Array<Scalars['String']['output']>>
  defaultCtxPostIds?: Maybe<Array<Scalars['String']['output']>>
  defaultCtxSpaceIds?: Maybe<Array<Scalars['String']['output']>>
  id: Scalars['String']['output']
  moderator: Moderator
  organization: ModerationOrganization
  role: ModeratorRole
}

export type ModerationOrganizationSubscriptionPayload = {
  __typename?: 'ModerationOrganizationSubscriptionPayload'
  entity: ModerationOrganization
  event: DataHubSubscriptionEventEnum
}

export type ModerationPostModerationStatus = {
  __typename?: 'ModerationPostModerationStatus'
  blockerResource: ModerationBlockedResource
  id: Scalars['String']['output']
  post: Post
}

export enum ModerationResourceType {
  Address = 'ADDRESS',
  Cid = 'CID',
  Post = 'POST',
}

export type ModerationUpdateOrganizationModeratorInput = {
  defaultCtxAppIds?: InputMaybe<Array<Scalars['String']['input']>>
  defaultCtxPostIds?: InputMaybe<Array<Scalars['String']['input']>>
  defaultCtxSpaceIds?: InputMaybe<Array<Scalars['String']['input']>>
  moderatorId: Scalars['String']['input']
  organizationId: Scalars['String']['input']
  role?: InputMaybe<ModeratorRole>
}

export type Moderator = {
  __typename?: 'Moderator'
  account: Account
  approvedResources?: Maybe<Array<ModerationApprovedResource>>
  id: Scalars['String']['output']
  moderatorOrganizations?: Maybe<Array<ModerationOrganizationModerator>>
  processedResources?: Maybe<Array<ModerationBlockedResource>>
}

export enum ModeratorRole {
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
  Owner = 'OWNER',
  Spectator = 'SPECTATOR',
}

export type ModeratorSubscriptionPayload = {
  __typename?: 'ModeratorSubscriptionPayload'
  entity: Moderator
  event: DataHubSubscriptionEventEnum
}

export type ModeratorsArgsInput = {
  offset?: InputMaybe<Scalars['Int']['input']>
  pageSize?: InputMaybe<Scalars['Int']['input']>
  where: ModeratorsWhereArgs
}

export type ModeratorsResponse = {
  __typename?: 'ModeratorsResponse'
  data: Array<Moderator>
  offset?: Maybe<Scalars['Int']['output']>
  pageSize?: Maybe<Scalars['Int']['output']>
  total?: Maybe<Scalars['Int']['output']>
}

export type ModeratorsWhereArgs = {
  ctxAppIds?: InputMaybe<Array<Scalars['String']['input']>>
  ctxPostIds?: InputMaybe<Array<Scalars['String']['input']>>
  ctxSpaceIds?: InputMaybe<Array<Scalars['String']['input']>>
  id?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  substrateAddress?: InputMaybe<Scalars['String']['input']>
}

export type Mutation = {
  __typename?: 'Mutation'
  linkedIdentityTerminateLinkedIdentitySession: TerminateLinkedIdentitySessionResponseDto
  moderationCreateOrganization: ModerationOrganization
  moderationCreateOrganizationModerator?: Maybe<ModerationOrganizationModerator>
  moderationInitModerator?: Maybe<Moderator>
  moderationUpdateOrganization: ModerationOrganization
  moderationUpdateOrganizationModerator?: Maybe<ModerationOrganizationModerator>
}

export type MutationLinkedIdentityTerminateLinkedIdentitySessionArgs = {
  linkedIdentityId: Scalars['String']['input']
}

export type MutationModerationCreateOrganizationArgs = {
  args: CreateOrganizationInput
}

export type MutationModerationCreateOrganizationModeratorArgs = {
  args: ModerationCreateOrganizationModeratorInput
}

export type MutationModerationInitModeratorArgs = {
  args: InitModeratorInputDto
}

export type MutationModerationUpdateOrganizationArgs = {
  args: UpdateOrganizationInput
}

export type MutationModerationUpdateOrganizationModeratorArgs = {
  args: ModerationUpdateOrganizationModeratorInput
}

export enum NotificationServiceName {
  Discord = 'DISCORD',
  Email = 'EMAIL',
  Fcm = 'FCM',
  Telegram = 'TELEGRAM',
}

export type NotificationsAccountsLink = {
  __typename?: 'NotificationsAccountsLink'
  active: Scalars['Boolean']['output']
  createdAt: Scalars['DateTime']['output']
  fcmTokens: Array<Scalars['String']['output']>
  following: Scalars['Boolean']['output']
  id: Scalars['String']['output']
  notificationServiceAccountId: Scalars['String']['output']
  notificationServiceName: NotificationServiceName
  socialProfile?: Maybe<SocialProfile>
  substrateAccount: Account
}

export type NotificationsSettings = {
  __typename?: 'NotificationsSettings'
  id: Scalars['String']['output']
  socialProfile?: Maybe<SocialProfile>
  subscriptionEvents: Array<Scalars['String']['output']>
  subscriptions: Array<NotificationsSubscription>
  substrateAccount: Account
}

export type NotificationsSubscription = {
  __typename?: 'NotificationsSubscription'
  eventName: Scalars['String']['output']
  telegramBot: Scalars['Boolean']['output']
}

export enum PinnedResourceType {
  Post = 'Post',
  Space = 'Space',
}

export type Post = {
  __typename?: 'Post'
  activeStaking: Scalars['Boolean']['output']
  activeStakingSuperLikes?: Maybe<Array<ActiveStakingSuperLike>>
  activeStakingSuperLikesCount?: Maybe<Scalars['Int']['output']>
  approvedByAccount: Account
  approvedInRootPost: Scalars['Boolean']['output']
  approvedInRootPostAtTime?: Maybe<Scalars['DateTime']['output']>
  /** is off-chain data CID backed up in blockchain */
  backupInBlockchain?: Maybe<Scalars['Boolean']['output']>
  blockchainSyncFailed: Scalars['Boolean']['output']
  blockchainSyncLog: Scalars['JSON']['output']
  /** post body */
  body?: Maybe<Scalars['String']['output']>
  canonical?: Maybe<Scalars['String']['output']>
  /** content CID */
  content?: Maybe<Scalars['String']['output']>
  contentContainerConfig?: Maybe<ContentContainerConfig>
  createdAtBlock?: Maybe<Scalars['Int']['output']>
  createdAtTime?: Maybe<Scalars['DateTime']['output']>
  createdByAccount: Account
  dataType: DataType
  downvotesCount?: Maybe<Scalars['Int']['output']>
  experimental?: Maybe<Scalars['JSON']['output']>
  extensions: Array<ContentExtension>
  farcasterCastHash?: Maybe<Scalars['String']['output']>
  followersCount?: Maybe<Scalars['Int']['output']>
  format?: Maybe<Scalars['String']['output']>
  hidden: Scalars['Boolean']['output']
  hiddenRepliesCount?: Maybe<Scalars['Int']['output']>
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  inReplyToKind?: Maybe<InReplyToKind>
  inReplyToPost?: Maybe<Post>
  ipfsContentRefetchCount: Scalars['Int']['output']
  isComment: Scalars['Boolean']['output']
  isShowMore: Scalars['Boolean']['output']
  kind: PostKind
  link?: Maybe<Scalars['String']['output']>
  lowValue: Scalars['Boolean']['output']
  offChainId?: Maybe<Scalars['String']['output']>
  optimisticId?: Maybe<Scalars['String']['output']>
  ownedByAccount: Account
  parentPost?: Maybe<Post>
  persistentId?: Maybe<Scalars['String']['output']>
  pinnedByExtensions?: Maybe<Array<ExtensionPinnedResource>>
  postFollowers?: Maybe<Array<PostFollowers>>
  postModerationStatuses?: Maybe<Array<ModerationPostModerationStatus>>
  /** Data protocol version */
  protVersion?: Maybe<Scalars['String']['output']>
  publicRepliesCount?: Maybe<Scalars['Int']['output']>
  reactionsCount?: Maybe<Scalars['Int']['output']>
  rootPost?: Maybe<Post>
  sharedPost?: Maybe<Post>
  sharesCount?: Maybe<Scalars['Int']['output']>
  slug?: Maybe<Scalars['String']['output']>
  /** Data protocol version */
  source?: Maybe<Scalars['String']['output']>
  space?: Maybe<Space>
  summary?: Maybe<Scalars['String']['output']>
  tagsOriginal?: Maybe<Scalars['String']['output']>
  timestamp?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
  tweetId?: Maybe<Scalars['String']['output']>
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>
  upvotesCount?: Maybe<Scalars['Int']['output']>
  uuid?: Maybe<Scalars['String']['output']>
  views?: Maybe<Array<PostView>>
}

export type PostFollowers = {
  __typename?: 'PostFollowers'
  dataType: DataType
  followerAccount: Account
  followingPost: Post
  id: Scalars['String']['output']
}

export enum PostKind {
  Comment = 'Comment',
  RegularPost = 'RegularPost',
  SharedPost = 'SharedPost',
}

export type PostMetadataInput = {
  persistentIds?: InputMaybe<Array<Scalars['String']['input']>>
}

export type PostMetadataResponse = {
  __typename?: 'PostMetadataResponse'
  latestComment?: Maybe<CommentDataShort>
  persistentId: Scalars['String']['output']
  totalCommentsCount: Scalars['String']['output']
}

export type PostRewardsBySourceResponseDto = {
  __typename?: 'PostRewardsBySourceResponseDto'
  fromCommentSuperLikes?: Maybe<Scalars['String']['output']>
  fromDirectSuperLikes?: Maybe<Scalars['String']['output']>
  fromShareSuperLikes?: Maybe<Scalars['String']['output']>
}

export type PostSubscriptionPayload = {
  __typename?: 'PostSubscriptionPayload'
  body?: Maybe<Scalars['String']['output']>
  createdAtTime?: Maybe<Scalars['String']['output']>
  dataType: SocialEventDataType
  entity: Post
  entityId: Scalars['String']['output']
  event: DataHubSubscriptionEventEnum
  optimisticId?: Maybe<Scalars['String']['output']>
  ownedByAccountId?: Maybe<Scalars['String']['output']>
  persistentId?: Maybe<Scalars['String']['output']>
}

export type PostView = {
  __typename?: 'PostView'
  createdAtTime: Scalars['DateTime']['output']
  duration: Scalars['Int']['output']
  id: Scalars['String']['output']
  post: Post
  postPersistentId?: Maybe<Scalars['String']['output']>
  viewerId: Scalars['String']['output']
}

export type PostViewsCountResponse = {
  __typename?: 'PostViewsCountResponse'
  postId: Scalars['String']['output']
  postPersistentId: Scalars['String']['output']
  viewsCountTotal: Scalars['Int']['output']
}

export type PostsViewsCountsInput = {
  ids?: InputMaybe<Array<Scalars['String']['input']>>
  persistentIds?: InputMaybe<Array<Scalars['String']['input']>>
}

export type Query = {
  __typename?: 'Query'
  activeStakingAccountActivityMetricsForFixedPeriod: AccountActivityMetricsForFixedPeriodResponseDto
  activeStakingAddressRankByRewardsForPeriod?: Maybe<AddressRankByRewardsForPeriodResponseDto>
  activeStakingAddressRankByTotalRewardsForPeriod?: Maybe<AddressRankByRewardsForPeriodResponseDto>
  activeStakingAddressesRankedByRewardsForPeriod: AddressesRankedByRewardsForPeriodResponseDto
  activeStakingAddressesRankedByTotalRewardsForPeriod: AddressesRankedByRewardsForPeriodResponseDto
  activeStakingCanDoSuperLikeByPost: Array<CanDoSuperLikeByPostsResponseDto>
  activeStakingCreatorsRankedBySuperLikesForPeriod: Array<AddressRankedBySuperLikesForPeriodResponseDto>
  activeStakingDailyStatsByStaker: DailyStatsByStakerResponse
  activeStakingDateDetails: DateTimeDetailsResponseDto
  activeStakingIsActiveStaker: Scalars['Boolean']['output']
  activeStakingRankedPostIdsByActiveStakingActivity: RankedPostIdsByActiveStakingActivityResponse
  activeStakingRankedPostIdsBySuperLikesNumber: RankedPostIdsBySuperLikesCountResponse
  activeStakingRewardsByPosts: Array<RewardsByPostsResponseDto>
  activeStakingRewardsByWeek: Array<TotalRewardsByWeekResponse>
  activeStakingRewardsReportByWeek: Array<ActiveStakingRewardsReport>
  activeStakingStakersRankedBySuperLikesForPeriod: Array<AddressRankedBySuperLikesForPeriodResponseDto>
  activeStakingSuperLikeCountsByDate: SuperLikeCountsByDateWithTotalResponseDto
  activeStakingSuperLikeCountsByPost: Array<SuperLikeCountsByPostResponse>
  activeStakingSuperLikeCountsByStaker: Array<SuperLikeCountsByStakerResponse>
  activeStakingSuperLikes: SuperLikesResponseDto
  activeStakingSuperLikesNumberGoal: Scalars['Int']['output']
  activeStakingTokenomicMetadata: TokenomicMetadataResponse
  activeStakingTotalActivityMetricsForFixedPeriod: TotalActivityMetricsForFixedPeriodResponseDto
  contentContainerConfigs: ContentContainerConfigsResourcesResponseDto
  domains: DomainsResponse
  gamificationEntranceDailyRewardSequence?: Maybe<GamificationEntranceDailyRewardsSequence>
  gamificationTappingActivityStatsByDate: TappingActivityStatsByDateResponseDto
  gamificationTappingEnergyState?: Maybe<TappingEnergyStateResponseDto>
  gamificationTasks: FindTasksResponseDto
  isBalanceSufficientForSocialAction: IsBalanceSufficientForSocialActionResponse
  linkedIdentity?: Maybe<LinkedIdentity>
  moderationApprovedResources: ApprovedResourcesResponseDto
  moderationBlockedResourceIds: Array<Scalars['String']['output']>
  moderationBlockedResourceIdsBatch: BlockedResourceIdsBatchResponse
  moderationBlockedResources: BlockedResourcesResponseDto
  moderationBlockedResourcesDetailed: Array<ModerationBlockedResource>
  moderationModerator?: Maybe<Moderator>
  moderationOrganization?: Maybe<ModerationOrganization>
  moderationOrganizations?: Maybe<Array<ModerationOrganization>>
  moderationReason: ModerationBlockReason
  moderationReasonsAll: Array<ModerationBlockReason>
  moderators?: Maybe<ModeratorsResponse>
  postMetadata: Array<PostMetadataResponse>
  posts: FindPostsResponseDto
  postsViewsCounts: Array<PostViewsCountResponse>
  referrerRankByReferralsCountForPeriod?: Maybe<ReferrerRankByReferralsCountForPeriodResponseDto>
  referrersRankedByReferralsCountForPeriod: ReferrersRankedByReferralsCountForPeriodResponseDto
  socialProfileBalances?: Maybe<SocialProfileBalances>
  socialProfiles: SocialProfilesResponse
  spaces: FindSpacesWithFilterResponseDto
  unreadMessages: Array<UnreadPostsCountResponse>
  userReferrals: UserReferralsResponse
  userReferralsStats: UserReferralsStatsResponse
}

export type QueryActiveStakingAccountActivityMetricsForFixedPeriodArgs = {
  args: AccountActivityMetricsForFixedPeriodInput
}

export type QueryActiveStakingAddressRankByRewardsForPeriodArgs = {
  args: AddressRankByRewardsForPeriodInput
}

export type QueryActiveStakingAddressRankByTotalRewardsForPeriodArgs = {
  args: AddressRankByTotalRewardsForPeriodInput
}

export type QueryActiveStakingAddressesRankedByRewardsForPeriodArgs = {
  args: AddressesRankedByRewardsForPeriodInput
}

export type QueryActiveStakingAddressesRankedByTotalRewardsForPeriodArgs = {
  args: AddressesRankedByTotalRewardsForPeriodInput
}

export type QueryActiveStakingCanDoSuperLikeByPostArgs = {
  args: CanDoSuperLikeByPostInput
}

export type QueryActiveStakingCreatorsRankedBySuperLikesForPeriodArgs = {
  args: AddressesRankedBySuperLikesForPeriodInput
}

export type QueryActiveStakingDailyStatsByStakerArgs = {
  args: DailyStatsByStakerInput
}

export type QueryActiveStakingIsActiveStakerArgs = {
  address: Scalars['String']['input']
}

export type QueryActiveStakingRankedPostIdsByActiveStakingActivityArgs = {
  args: RankedPostIdsByActiveStakingActivityInput
}

export type QueryActiveStakingRankedPostIdsBySuperLikesNumberArgs = {
  args: RankedPostIdsBySuperLikesCountInput
}

export type QueryActiveStakingRewardsByPostsArgs = {
  args: RewardsByPostsInput
}

export type QueryActiveStakingRewardsByWeekArgs = {
  args: RewardsByWeekInput
}

export type QueryActiveStakingRewardsReportByWeekArgs = {
  week: Scalars['Int']['input']
}

export type QueryActiveStakingStakersRankedBySuperLikesForPeriodArgs = {
  args: AddressesRankedBySuperLikesForPeriodInput
}

export type QueryActiveStakingSuperLikeCountsByDateArgs = {
  args: SuperLikeCountsByDateInput
}

export type QueryActiveStakingSuperLikeCountsByPostArgs = {
  args: SuperLikeCountsByPostInput
}

export type QueryActiveStakingSuperLikeCountsByStakerArgs = {
  args: SuperLikeCountsByStakerInput
}

export type QueryActiveStakingSuperLikesArgs = {
  where: SuperLikesWhereInput
}

export type QueryActiveStakingTotalActivityMetricsForFixedPeriodArgs = {
  args: TotalActivityMetricsForFixedPeriodInput
}

export type QueryContentContainerConfigsArgs = {
  args: ContentContainerConfigsArgsInputDto
}

export type QueryDomainsArgs = {
  args: DomainsInput
}

export type QueryGamificationEntranceDailyRewardSequenceArgs = {
  args: EntranceDailyRewardSequenceInput
}

export type QueryGamificationTappingActivityStatsByDateArgs = {
  args: TappingActivityStatsByDateInput
}

export type QueryGamificationTappingEnergyStateArgs = {
  args: TappingEnergyStateInput
}

export type QueryGamificationTasksArgs = {
  args: FindTasksWithFilterArgs
}

export type QueryIsBalanceSufficientForSocialActionArgs = {
  args: IsBalanceSufficientForSocialActionInput
}

export type QueryLinkedIdentityArgs = {
  where: LinkedIdentityArgs
}

export type QueryModerationApprovedResourcesArgs = {
  args: ApprovedResourcesArgsInputDto
}

export type QueryModerationBlockedResourceIdsArgs = {
  blocked?: InputMaybe<Scalars['Boolean']['input']>
  ctxAppIds?: InputMaybe<Array<Scalars['String']['input']>>
  ctxPostIds?: InputMaybe<Array<Scalars['String']['input']>>
  ctxSpaceIds?: InputMaybe<Array<Scalars['String']['input']>>
  moderatorId?: InputMaybe<Scalars['String']['input']>
  parentPostId?: InputMaybe<Scalars['String']['input']>
  reasonId?: InputMaybe<Scalars['String']['input']>
  resourceId?: InputMaybe<Scalars['String']['input']>
  resourceType?: InputMaybe<ModerationResourceType>
  rootPostId?: InputMaybe<Scalars['String']['input']>
  spaceId?: InputMaybe<Scalars['String']['input']>
}

export type QueryModerationBlockedResourceIdsBatchArgs = {
  ctxAppIds?: InputMaybe<Array<Scalars['String']['input']>>
  ctxPostIds?: InputMaybe<Array<Scalars['String']['input']>>
  ctxSpaceIds?: InputMaybe<Array<Scalars['String']['input']>>
}

export type QueryModerationBlockedResourcesArgs = {
  args: BlockedResourcesArgsInputDto
}

export type QueryModerationBlockedResourcesDetailedArgs = {
  blocked?: InputMaybe<Scalars['Boolean']['input']>
  ctxAppIds?: InputMaybe<Array<Scalars['String']['input']>>
  ctxPostIds?: InputMaybe<Array<Scalars['String']['input']>>
  ctxSpaceIds?: InputMaybe<Array<Scalars['String']['input']>>
  moderatorId?: InputMaybe<Scalars['String']['input']>
  parentPostId?: InputMaybe<Scalars['String']['input']>
  reasonId?: InputMaybe<Scalars['String']['input']>
  resourceId?: InputMaybe<Scalars['String']['input']>
  resourceType?: InputMaybe<ModerationResourceType>
  rootPostId?: InputMaybe<Scalars['String']['input']>
  spaceId?: InputMaybe<Scalars['String']['input']>
}

export type QueryModerationModeratorArgs = {
  where: GetModeratorByInput
}

export type QueryModerationOrganizationArgs = {
  where: GetOrganizationWhere
}

export type QueryModerationReasonArgs = {
  id: Scalars['String']['input']
}

export type QueryModeratorsArgs = {
  args: ModeratorsArgsInput
}

export type QueryPostMetadataArgs = {
  where: PostMetadataInput
}

export type QueryPostsArgs = {
  args: FindPostsWithFilterArgs
}

export type QueryPostsViewsCountsArgs = {
  where: PostsViewsCountsInput
}

export type QueryReferrerRankByReferralsCountForPeriodArgs = {
  args: ReferrerRankByReferralsCountForPeriodInput
}

export type QueryReferrersRankedByReferralsCountForPeriodArgs = {
  args: ReferrersRankedByReferralsCountForPeriodInput
}

export type QuerySocialProfileBalancesArgs = {
  args: BalancesInput
}

export type QuerySocialProfilesArgs = {
  args: SocialProfileInput
}

export type QuerySpacesArgs = {
  args: FindSpacesWithFilterArgsInput
}

export type QueryUnreadMessagesArgs = {
  where: UnreadMessagesInput
}

export type QueryUserReferralsArgs = {
  args: UserReferralsInput
}

export type QueryUserReferralsStatsArgs = {
  args: UserReferralsStatsInput
}

export enum QueryOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type RankedAddressWithDetails = {
  __typename?: 'RankedAddressWithDetails'
  address: Scalars['String']['output']
  rank: Scalars['Int']['output']
  reward: Scalars['String']['output']
}

export type RankedPostIdBySuperLikesCountWithDetails = {
  __typename?: 'RankedPostIdBySuperLikesCountWithDetails'
  postId: Scalars['String']['output']
  rank: Scalars['Int']['output']
  rootPostId?: Maybe<Scalars['String']['output']>
  score: Scalars['Float']['output']
}

export type RankedPostIdWithDetails = {
  __typename?: 'RankedPostIdWithDetails'
  ownerAddress?: Maybe<Scalars['String']['output']>
  persistentPostId?: Maybe<Scalars['String']['output']>
  postId: Scalars['String']['output']
  rank: Scalars['Int']['output']
  score: Scalars['Float']['output']
}

export type RankedPostIdsByActiveStakingActivityFilter = {
  normalizeOrder?: InputMaybe<Scalars['Boolean']['input']>
  uniquenessRange?: InputMaybe<Scalars['Int']['input']>
}

export type RankedPostIdsByActiveStakingActivityInput = {
  filter?: InputMaybe<RankedPostIdsByActiveStakingActivityFilter>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<ActiveStakingListOrder>
}

export type RankedPostIdsByActiveStakingActivityResponse = {
  __typename?: 'RankedPostIdsByActiveStakingActivityResponse'
  data: Array<RankedPostIdWithDetails>
  limit: Scalars['Int']['output']
  offset: Scalars['Int']['output']
  total: Scalars['Int']['output']
}

export type RankedPostIdsBySuperLikesCountInput = {
  filter?: InputMaybe<RankedPostIdsBySuperLikesCountInputFilter>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<ActiveStakingListOrder>
}

export type RankedPostIdsBySuperLikesCountInputFilter = {
  period: ActiveStakingPeriod
  rootPostId?: InputMaybe<Scalars['String']['input']>
  timestamp?: InputMaybe<Scalars['String']['input']>
}

export type RankedPostIdsBySuperLikesCountResponse = {
  __typename?: 'RankedPostIdsBySuperLikesCountResponse'
  data: Array<RankedPostIdBySuperLikesCountWithDetails>
  limit: Scalars['Int']['output']
  offset: Scalars['Int']['output']
  total: Scalars['Int']['output']
}

export type RankedReferrerWithDetails = {
  __typename?: 'RankedReferrerWithDetails'
  address: Scalars['String']['output']
  count: Scalars['Int']['output']
  rank: Scalars['Int']['output']
}

export type ReferrerRankByReferralsCountCompetitorResponseDto = {
  __typename?: 'ReferrerRankByReferralsCountCompetitorResponseDto'
  address: Scalars['String']['output']
  count?: Maybe<Scalars['Int']['output']>
  rankIndex: Scalars['Int']['output']
}

export type ReferrerRankByReferralsCountForPeriodInput = {
  aboveCompetitorsNumber?: InputMaybe<Scalars['Int']['input']>
  address: Scalars['String']['input']
  belowCompetitorsNumber?: InputMaybe<Scalars['Int']['input']>
  customRangeKey?: InputMaybe<ReferrersRankedListCustomPeriodKey>
  period?: InputMaybe<ActiveStakingPeriod>
  timestamp?: InputMaybe<Scalars['String']['input']>
  withCount?: InputMaybe<Scalars['Boolean']['input']>
}

export type ReferrerRankByReferralsCountForPeriodResponseDto = {
  __typename?: 'ReferrerRankByReferralsCountForPeriodResponseDto'
  aboveCompetitors?: Maybe<
    Array<ReferrerRankByReferralsCountCompetitorResponseDto>
  >
  belowCompetitors?: Maybe<
    Array<ReferrerRankByReferralsCountCompetitorResponseDto>
  >
  count?: Maybe<Scalars['Int']['output']>
  maxIndex: Scalars['Int']['output']
  rankIndex: Scalars['Int']['output']
}

export type ReferrersRankedByReferralsCountForPeriodFilter = {
  customRangeKey?: InputMaybe<ReferrersRankedListCustomPeriodKey>
  period?: InputMaybe<ActiveStakingPeriod>
  timestamp?: InputMaybe<Scalars['String']['input']>
}

export type ReferrersRankedByReferralsCountForPeriodInput = {
  filter: ReferrersRankedByReferralsCountForPeriodFilter
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order?: InputMaybe<ActiveStakingListOrder>
}

export type ReferrersRankedByReferralsCountForPeriodResponseDto = {
  __typename?: 'ReferrersRankedByReferralsCountForPeriodResponseDto'
  data: Array<RankedReferrerWithDetails>
  limit: Scalars['Int']['output']
  offset: Scalars['Int']['output']
  total: Scalars['Int']['output']
}

export enum ReferrersRankedListCustomPeriodKey {
  ReferrersRankedListByReferralsCountCp_20240722_20240728 = 'REFERRERS_RANKED_LIST_BY_REFERRALS_COUNT_CP_20240722_20240728',
}

export type RewardsByPostDetails = {
  __typename?: 'RewardsByPostDetails'
  distributionPercent?: Maybe<Scalars['Int']['output']>
  from?: Maybe<RewardsByPostDirectionTarget>
  pointsAmount?: Maybe<Scalars['String']['output']>
  postId?: Maybe<Scalars['String']['output']>
  postKind?: Maybe<PostKind>
  postPersistentId?: Maybe<Scalars['String']['output']>
  referralId?: Maybe<Scalars['String']['output']>
  sharedReward?: Maybe<Scalars['Boolean']['output']>
  spaceId?: Maybe<Scalars['String']['output']>
  superLikeId?: Maybe<Scalars['String']['output']>
  superLikeMultiplier?: Maybe<Scalars['Int']['output']>
  to?: Maybe<RewardsByPostDirectionTarget>
  tokensAmount: Scalars['String']['output']
}

export enum RewardsByPostDirectionTarget {
  App = 'APP',
  Comment = 'COMMENT',
  Referral = 'REFERRAL',
  Referrer = 'REFERRER',
  RegularPost = 'REGULAR_POST',
  RootPost = 'ROOT_POST',
  RootSpace = 'ROOT_SPACE',
  Share = 'SHARE',
  ShareOrigin = 'SHARE_ORIGIN',
  TargetEntityOwner = 'TARGET_ENTITY_OWNER',
}

export type RewardsByPostsInput = {
  postIds?: InputMaybe<Array<Scalars['String']['input']>>
  postPersistentIds?: InputMaybe<Array<Scalars['String']['input']>>
}

export type RewardsByPostsResponseDto = {
  __typename?: 'RewardsByPostsResponseDto'
  /** @deprecated rewardTotal field must be used */
  amount: Scalars['String']['output']
  draftPointsRewardTotal: Scalars['String']['output']
  draftPointsRewardsBySource?: Maybe<PostRewardsBySourceResponseDto>
  /** @deprecated draftRewardTotal field must be used */
  draftReward: Scalars['String']['output']
  draftRewardTotal: Scalars['String']['output']
  draftRewardsBySource?: Maybe<PostRewardsBySourceResponseDto>
  persistentPostId?: Maybe<Scalars['String']['output']>
  pointsRewardTotal: Scalars['String']['output']
  pointsRewardsBySource?: Maybe<PostRewardsBySourceResponseDto>
  postId?: Maybe<Scalars['String']['output']>
  /** @deprecated rewardTotal field must be used */
  reward: Scalars['String']['output']
  rewardTotal: Scalars['String']['output']
  rewardsBySource?: Maybe<PostRewardsBySourceResponseDto>
}

export type RewardsByWeekFilter = {
  account: Scalars['String']['input']
}

export type RewardsByWeekInput = {
  filter: RewardsByWeekFilter
  weeks?: InputMaybe<Array<Scalars['Int']['input']>>
}

export type RewardsReportItem = {
  __typename?: 'RewardsReportItem'
  address: Scalars['String']['output']
  decimals: Scalars['Int']['output']
  pointsAmount: Scalars['String']['output']
  roles: Array<Scalars['String']['output']>
  tokensAmount: Scalars['String']['output']
  trialCreatorPointsAmount?: Maybe<Scalars['String']['output']>
  trialCreatorTokensAmount?: Maybe<Scalars['String']['output']>
}

export enum ServiceMessageStatusCode {
  BadRequest = 'BAD_REQUEST',
  Created = 'CREATED',
  DailySuperLikesMaxLimitReached = 'DAILY_SUPER_LIKES_MAX_LIMIT_REACHED',
  DailyTapsMaxLimitReached = 'DAILY_TAPS_MAX_LIMIT_REACHED',
  EntityAlreadyExists = 'ENTITY_ALREADY_EXISTS',
  EntityNotFound = 'ENTITY_NOT_FOUND',
  ExpiredEntranceDailyRewardClaimForbidden = 'EXPIRED_ENTRANCE_DAILY_REWARD_CLAIM_FORBIDDEN',
  Forbidden = 'FORBIDDEN',
  FutureEntranceDailyRewardClaimForbidden = 'FUTURE_ENTRANCE_DAILY_REWARD_CLAIM_FORBIDDEN',
  GamificationTaskClaimFailedDuplicatedClaim = 'GAMIFICATION_TASK_CLAIM_FAILED_DUPLICATED_CLAIM',
  GamificationTaskClaimFailedInvalidData = 'GAMIFICATION_TASK_CLAIM_FAILED_INVALID_DATA',
  GamificationTaskClaimFailedNotCompleted = 'GAMIFICATION_TASK_CLAIM_FAILED_NOT_COMPLETED',
  GamificationTaskClaimSuccessCompleted = 'GAMIFICATION_TASK_CLAIM_SUCCESS_COMPLETED',
  Info = 'INFO',
  InsufficientBalance = 'INSUFFICIENT_BALANCE',
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  InvalidProxyForSigner = 'INVALID_PROXY_FOR_SIGNER',
  InvalidSigner = 'INVALID_SIGNER',
  InvalidTapsValue = 'INVALID_TAPS_VALUE',
  Moved = 'MOVED',
  PaymentRequired = 'PAYMENT_REQUIRED',
  Processed = 'PROCESSED',
  ServiceUnavailable = 'SERVICE_UNAVAILABLE',
  TooManyRequests = 'TOO_MANY_REQUESTS',
  Unauthorized = 'UNAUTHORIZED',
  UnprocessableEntity = 'UNPROCESSABLE_ENTITY',
  Updated = 'UPDATED',
  Warning = 'WARNING',
}

export enum SocialAction {
  CreateComment = 'CREATE_COMMENT',
  CreateRegularPost = 'CREATE_REGULAR_POST',
  CreateReply = 'CREATE_REPLY',
  CreateSpace = 'CREATE_SPACE',
  ShareComment = 'SHARE_COMMENT',
  ShareRegularPost = 'SHARE_REGULAR_POST',
  UpdateComment = 'UPDATE_COMMENT',
  UpdateRegularPost = 'UPDATE_REGULAR_POST',
  UpdateReply = 'UPDATE_REPLY',
  UpdateSpace = 'UPDATE_SPACE',
}

export type SocialActionBalanceThresholdResponse = {
  __typename?: 'SocialActionBalanceThresholdResponse'
  createCommentPoints: Scalars['String']['output']
}

export type SocialActionPriceResponse = {
  __typename?: 'SocialActionPriceResponse'
  createCommentPoints: Scalars['String']['output']
}

export enum SocialCallName {
  CreatePost = 'create_post',
  CreatePostReaction = 'create_post_reaction',
  CreateSpace = 'create_space',
  CreateSpaceAsProfile = 'create_space_as_profile',
  DeletePostReaction = 'delete_post_reaction',
  ForceCreatePost = 'force_create_post',
  ForceCreatePostReaction = 'force_create_post_reaction',
  ForceCreateSpace = 'force_create_space',
  ForceDeletePostReaction = 'force_delete_post_reaction',
  ForceRegisterDomain = 'force_register_domain',
  ForceSetInnerValue = 'force_set_inner_value',
  ForceSetSpaceAsProfile = 'force_set_space_as_profile',
  MovePost = 'move_post',
  OwnershipAcceptPendingOwnership = 'ownership_accept_pending_ownership',
  OwnershipRejectPendingOwnership = 'ownership_reject_pending_ownership',
  OwnershipTransferOwnership = 'ownership_transfer_ownership',
  RegisterDomain = 'register_domain',
  ResetProfile = 'reset_profile',
  SetDomainContent = 'set_domain_content',
  SetInnerValue = 'set_inner_value',
  SetOuterValue = 'set_outer_value',
  SetPaymentBeneficiary = 'set_payment_beneficiary',
  SetProfile = 'set_profile',
  SynthActiveStakingCreateFarcasterFrameLike = 'synth_active_staking_create_farcaster_frame_like',
  SynthActiveStakingCreateSuperLike = 'synth_active_staking_create_super_like',
  SynthActiveStakingDeleteSuperLike = 'synth_active_staking_delete_super_like',
  SynthAddLinkedIdentityExternalProvider = 'synth_add_linked_identity_external_provider',
  SynthAddPostView = 'synth_add_post_view',
  SynthAddPostViewsBatch = 'synth_add_post_views_batch',
  SynthCreateContentContainerConfig = 'synth_create_content_container_config',
  SynthCreateExternalToken = 'synth_create_external_token',
  SynthCreateLinkedIdentity = 'synth_create_linked_identity',
  SynthCreatePostTxFailed = 'synth_create_post_tx_failed',
  SynthCreatePostTxRetry = 'synth_create_post_tx_retry',
  SynthDeleteLinkedIdentity = 'synth_delete_linked_identity',
  SynthFarcasterCreatePostFromCast = 'synth_farcaster_create_post_from_cast',
  SynthFarcasterCreateSuperLikeFromReaction = 'synth_farcaster_create_super_like_from_reaction',
  SynthGamificationAddTappingActivityStates = 'synth_gamification_add_tapping_activity_states',
  SynthGamificationClaimEntranceDailyReward = 'synth_gamification_claim_entrance_daily_reward',
  SynthGamificationClaimTask = 'synth_gamification_claim_task',
  SynthInitLinkedIdentity = 'synth_init_linked_identity',
  SynthModerationAddCtxToOrganization = 'synth_moderation_add_ctx_to_organization',
  SynthModerationAddDefaultCtxToModerator = 'synth_moderation_add_default_ctx_to_moderator',
  SynthModerationBlockResource = 'synth_moderation_block_resource',
  SynthModerationForceAddCtxToOrganization = 'synth_moderation_force_add_ctx_to_organization',
  SynthModerationForceAddDefaultCtxToModerator = 'synth_moderation_force_add_default_ctx_to_moderator',
  SynthModerationForceBlockResource = 'synth_moderation_force_block_resource',
  SynthModerationForceInitModerator = 'synth_moderation_force_init_moderator',
  SynthModerationForceUnblockResource = 'synth_moderation_force_unblock_resource',
  SynthModerationInitModerator = 'synth_moderation_init_moderator',
  SynthModerationUnblockResource = 'synth_moderation_unblock_resource',
  SynthSetPostApproveStatus = 'synth_set_post_approve_status',
  SynthSocialProfileAddReferrerId = 'synth_social_profile_add_referrer_id',
  SynthSocialProfileSetActionPermissions = 'synth_social_profile_set_action_permissions',
  SynthSocialProfileSyncExternalTokenBalance = 'synth_social_profile_sync_external_token_balance',
  SynthUpdateContentContainerConfig = 'synth_update_content_container_config',
  SynthUpdateLinkedIdentityExternalProvider = 'synth_update_linked_identity_external_provider',
  SynthUpdatePostTxFailed = 'synth_update_post_tx_failed',
  SynthUpdatePostTxRetry = 'synth_update_post_tx_retry',
  UpdatePost = 'update_post',
  UpdatePostReaction = 'update_post_reaction',
  UpdateSpace = 'update_space',
}

export enum SocialEventDataType {
  OffChain = 'offChain',
  Optimistic = 'optimistic',
  Persistent = 'persistent',
}

export type SocialProfile = {
  __typename?: 'SocialProfile'
  account: Account
  activeEntranceDailyRewardSequence?: Maybe<GamificationEntranceDailyRewardsSequence>
  activeStakingTrial: Scalars['Boolean']['output']
  activeStakingTrialFinishedAtTime?: Maybe<Scalars['DateTime']['output']>
  activeStakingTrialStartedAtTime?: Maybe<Scalars['DateTime']['output']>
  allowedCreateCommentRootPostIds: Array<Scalars['String']['output']>
  balances?: Maybe<SocialProfileBalances>
  entranceDailyRewardSequences?: Maybe<
    Array<GamificationEntranceDailyRewardsSequence>
  >
  id: Scalars['String']['output']
  notificationsAccountLinks?: Maybe<Array<NotificationsAccountsLink>>
  notificationsSettings?: Maybe<NotificationsSettings>
  referrals: Array<SocialProfile>
  referralsDistributedPointsReward: Scalars['String']['output']
  referrerSocialProfile?: Maybe<SocialProfile>
  referrersList?: Maybe<Array<UserReferrerDetail>>
}

export type SocialProfileBalances = {
  __typename?: 'SocialProfileBalances'
  activeStakingPoints: Scalars['String']['output']
  activeStakingPointsInitial: Scalars['String']['output']
  activeStakingRewardPoints: Scalars['String']['output']
  activeStakingTempReward: Scalars['String']['output']
  activeStakingTempToken: Scalars['String']['output']
  activeStakingTempTokenInitial: Scalars['String']['output']
  externalTokenBalances?: Maybe<Array<SocialProfileExternalTokenBalance>>
  id: Scalars['String']['output']
}

export type SocialProfileBalancesSubscriptionInput = {
  address: Scalars['String']['input']
}

export type SocialProfileBalancesSubscriptionPayload = {
  __typename?: 'SocialProfileBalancesSubscriptionPayload'
  entity: SocialProfileBalances
  event: DataHubSubscriptionEventEnum
}

export type SocialProfileExternalTokenBalance = {
  __typename?: 'SocialProfileExternalTokenBalance'
  active: Scalars['Boolean']['output']
  amount: Scalars['String']['output']
  blockchainAddress: Scalars['String']['output']
  createdAt: Scalars['DateTime']['output']
  externalToken: ExternalToken
  id: Scalars['String']['output']
  linkedIdentityExternalProvider: LinkedIdentityExternalProvider
  socialProfileBalance: SocialProfileBalances
  updatedAt?: Maybe<Scalars['DateTime']['output']>
}

export type SocialProfileExternalTokenBalanceSubscriptionPayload = {
  __typename?: 'SocialProfileExternalTokenBalanceSubscriptionPayload'
  entity: SocialProfileExternalTokenBalance
  event: DataHubSubscriptionEventEnum
}

export type SocialProfileInput = {
  where: SocialProfileInputWhereArgs
}

export type SocialProfileInputWhereArgs = {
  substrateAddresses: Array<Scalars['String']['input']>
}

export type SocialProfilesResponse = {
  __typename?: 'SocialProfilesResponse'
  data: Array<SocialProfile>
}

export type Space = {
  __typename?: 'Space'
  /** space body */
  about?: Maybe<Scalars['String']['output']>
  /** content CID */
  content?: Maybe<Scalars['String']['output']>
  createdAtBlock?: Maybe<Scalars['Int']['output']>
  createdAtTime?: Maybe<Scalars['DateTime']['output']>
  createdByAccount: Account
  dataType: DataType
  email?: Maybe<Scalars['String']['output']>
  experimental?: Maybe<Scalars['JSON']['output']>
  farcasterChannelId?: Maybe<Scalars['String']['output']>
  followers: Array<SpaceFollowers>
  followersCount?: Maybe<Scalars['Int']['output']>
  handle?: Maybe<Scalars['String']['output']>
  hidden: Scalars['Boolean']['output']
  hiddenPostsCount?: Maybe<Scalars['Int']['output']>
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  interestsOriginal?: Maybe<Scalars['String']['output']>
  isShowMore: Scalars['Boolean']['output']
  linksOriginal?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  optimisticId?: Maybe<Scalars['String']['output']>
  ownedByAccount: Account
  persistentId?: Maybe<Scalars['String']['output']>
  pinnedByExtensions?: Maybe<Array<ExtensionPinnedResource>>
  posts?: Maybe<Post>
  postsCount?: Maybe<Scalars['Int']['output']>
  profileSource?: Maybe<Scalars['String']['output']>
  profileSpace?: Maybe<Account>
  /** Data protocol version */
  protVersion?: Maybe<Scalars['String']['output']>
  publicPostsCount?: Maybe<Scalars['Int']['output']>
  summary?: Maybe<Scalars['String']['output']>
  tagsOriginal?: Maybe<Scalars['String']['output']>
  timestamp?: Maybe<Scalars['String']['output']>
  updatedAtBlock?: Maybe<Scalars['Int']['output']>
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>
  username?: Maybe<Scalars['String']['output']>
  uuid?: Maybe<Scalars['String']['output']>
}

export type SpaceFollowers = {
  __typename?: 'SpaceFollowers'
  dataType: DataType
  followerAccount: Account
  followingSpace: Space
  id: Scalars['String']['output']
}

export type StakerActivityMetrics = {
  __typename?: 'StakerActivityMetrics'
  earnedByPeriod?: Maybe<Scalars['String']['output']>
  earnedPointsByPeriod?: Maybe<Scalars['String']['output']>
  earnedPointsTotal?: Maybe<Scalars['String']['output']>
  earnedTotal?: Maybe<Scalars['String']['output']>
  likedCreators?: Maybe<Scalars['Int']['output']>
  likedPosts?: Maybe<Scalars['Int']['output']>
  likedPostsByDay?: Maybe<Array<LikedPostsCountByDayItem>>
}

export type StakerActivityMetricsForFixedPeriodInput = {
  earnedByPeriod?: InputMaybe<Scalars['Boolean']['input']>
  earnedPointsByPeriod?: InputMaybe<Scalars['Boolean']['input']>
  earnedPointsTotal?: InputMaybe<Scalars['Boolean']['input']>
  earnedTotal?: InputMaybe<Scalars['Boolean']['input']>
  likedCreators?: InputMaybe<Scalars['Boolean']['input']>
  likedPosts?: InputMaybe<Scalars['Boolean']['input']>
  likedPostsByDay?: InputMaybe<Scalars['Boolean']['input']>
}

export type Subscription = {
  __typename?: 'Subscription'
  activeStakingSuperLike: SuperLikeSubscriptionPayload
  linkedIdentitySubscription: LinkedIdentitySubscriptionGenericPayload
  moderationBlockedResource: ModerationBlockedResourceSubscriptionPayload
  moderationModerator: ModeratorSubscriptionPayload
  moderationOrganization: ModerationOrganizationSubscriptionPayload
  post: PostSubscriptionPayload
  serviceMessageToTarget: AccountServiceMessageToTargetResponse
  socialProfileBalancesSubscription: SocialProfileBalancesSubscriptionPayload
  socialProfileExternalTokenBalanceSubscription: SocialProfileExternalTokenBalanceSubscriptionPayload
}

export type SubscriptionServiceMessageToTargetArgs = {
  args: AccountServiceMessageInput
}

export type SubscriptionSocialProfileBalancesSubscriptionArgs = {
  args: SocialProfileBalancesSubscriptionInput
}

export type SubscriptionSocialProfileExternalTokenBalanceSubscriptionArgs = {
  args: SocialProfileBalancesSubscriptionInput
}

export type SubscriptionPayloadMeta = {
  __typename?: 'SubscriptionPayloadMeta'
  stakerDistributedRewardPoints: Scalars['String']['output']
}

export type SubscriptionServiceAccountTokenMessage = {
  proxy: Scalars['String']['input']
  signer: Scalars['String']['input']
  timestamp: Scalars['String']['input']
}

export type SuperLikeCountByDateResponseDto = {
  __typename?: 'SuperLikeCountByDateResponseDto'
  count: Scalars['Int']['output']
  dayUnixTimestamp: Scalars['Int']['output']
}

export type SuperLikeCountsByDateInput = {
  fromDate: Scalars['String']['input']
  toDate: Scalars['String']['input']
  total?: InputMaybe<Scalars['Boolean']['input']>
}

export type SuperLikeCountsByDateWithTotalResponseDto = {
  __typename?: 'SuperLikeCountsByDateWithTotalResponseDto'
  byDate: Array<SuperLikeCountByDateResponseDto>
  total?: Maybe<Scalars['Int']['output']>
}

export type SuperLikeCountsByPostInput = {
  postIds?: InputMaybe<Array<Scalars['String']['input']>>
  postPersistentIds?: InputMaybe<Array<Scalars['String']['input']>>
}

export type SuperLikeCountsByPostResponse = {
  __typename?: 'SuperLikeCountsByPostResponse'
  count: Scalars['Int']['output']
  persistentPostId?: Maybe<Scalars['String']['output']>
  postId?: Maybe<Scalars['String']['output']>
}

export type SuperLikeCountsByStakerInput = {
  address: Scalars['String']['input']
  postIds?: InputMaybe<Array<Scalars['String']['input']>>
  postPersistentIds?: InputMaybe<Array<Scalars['String']['input']>>
}

export type SuperLikeCountsByStakerResponse = {
  __typename?: 'SuperLikeCountsByStakerResponse'
  count: Scalars['Int']['output']
  persistentPostId?: Maybe<Scalars['String']['output']>
  postId?: Maybe<Scalars['String']['output']>
}

export type SuperLikeSubscriptionPayload = {
  __typename?: 'SuperLikeSubscriptionPayload'
  entity: ActiveStakingSuperLike
  event: DataHubSubscriptionEventEnum
  meta: SubscriptionPayloadMeta
}

export type SuperLikesCreatorRewards = {
  __typename?: 'SuperLikesCreatorRewards'
  pointsRewardsBySource?: Maybe<PostRewardsBySourceResponseDto>
  posts: Array<SuperLikesCreatorRewardsByPost>
  rewardsBySource?: Maybe<PostRewardsBySourceResponseDto>
  /** @deprecated Must be used totalTokens */
  total: Scalars['String']['output']
  totalPoints: Scalars['String']['output']
  totalTokens: Scalars['String']['output']
}

export type SuperLikesCreatorRewardsByPost = {
  __typename?: 'SuperLikesCreatorRewardsByPost'
  directSuperLikesCount: Scalars['Int']['output']
  pointsRewardsBySource?: Maybe<PostRewardsBySourceResponseDto>
  postId: Scalars['String']['output']
  postPersistentId: Scalars['String']['output']
  rewardsBySource?: Maybe<PostRewardsBySourceResponseDto>
  sharedSuperLikesCount: Scalars['Int']['output']
  superLikesCount: Scalars['Int']['output']
  totalPointsAmount: Scalars['String']['output']
  totalTokensAmount: Scalars['String']['output']
}

export type SuperLikesResponseDto = {
  __typename?: 'SuperLikesResponseDto'
  data: Array<ActiveStakingSuperLike>
  offset?: Maybe<Scalars['Int']['output']>
  pageSize?: Maybe<Scalars['Int']['output']>
  total?: Maybe<Scalars['Int']['output']>
}

export type SuperLikesWhereInput = {
  offset?: InputMaybe<Scalars['Int']['input']>
  pageSize?: InputMaybe<Scalars['Int']['input']>
  postIds?: InputMaybe<Array<Scalars['String']['input']>>
  postPersistentIds?: InputMaybe<Array<Scalars['String']['input']>>
}

export type TappingActivityStatsByDateInput = {
  where: TappingActivityStatsByDateWhereArgs
}

export type TappingActivityStatsByDateResponseDto = {
  __typename?: 'TappingActivityStatsByDateResponseDto'
  data: Array<TappingActivityStatsForDate>
}

export type TappingActivityStatsByDateWhereArgs = {
  address: Scalars['String']['input']
  dates?: InputMaybe<Array<Scalars['Int']['input']>>
}

export type TappingActivityStatsForDate = {
  __typename?: 'TappingActivityStatsForDate'
  date: Scalars['Int']['output']
  tapsCount: Scalars['Int']['output']
}

export type TappingEnergyStateInput = {
  where: TappingEnergyWhereArgs
}

export type TappingEnergyStateResponseDto = {
  __typename?: 'TappingEnergyStateResponseDto'
  energyValue: Scalars['Int']['output']
  timestamp: Scalars['String']['output']
}

export type TappingEnergyWhereArgs = {
  address: Scalars['String']['input']
}

export type TerminateLinkedIdentitySessionResponseDto = {
  __typename?: 'TerminateLinkedIdentitySessionResponseDto'
  removedExternalProvidersCount: Scalars['Int']['output']
  removedSessionsCount: Scalars['Int']['output']
}

export type ThresholdsAndRulesResponse = {
  __typename?: 'ThresholdsAndRulesResponse'
  addressBlockOneTimePenaltyPointsAmount: Scalars['String']['output']
  contextPostId: Scalars['String']['output']
  creatorModerationPenalty: Scalars['Boolean']['output']
  deductRewardsOnModeration: Scalars['Boolean']['output']
  postBlockOneTimePenaltyPointsAmount: Scalars['String']['output']
  postModerationPenalty: Scalars['Boolean']['output']
  thresholdPointsAmount: Scalars['String']['output']
}

export type TokenomicMetadataResponse = {
  __typename?: 'TokenomicMetadataResponse'
  likerRewardDistributionPercent: Scalars['Int']['output']
  maxTapsPerDay: Scalars['Int']['output']
  maxTotalDailyRewardPoints: Scalars['String']['output']
  postModerationBlockOneTimePenaltyPointsAmount: Scalars['String']['output']
  socialActionBalanceThreshold: SocialActionBalanceThresholdResponse
  socialActionPrice: SocialActionPriceResponse
  superLikeWeightPoints: Scalars['String']['output']
  thresholdsAndRules: Array<ThresholdsAndRulesResponse>
}

export type TotalActivityMetricsForFixedPeriodInput = {
  creatorEarnedPointsTotal?: InputMaybe<Scalars['Boolean']['input']>
  creatorEarnedTotal?: InputMaybe<Scalars['Boolean']['input']>
  likedCreatorsCount?: InputMaybe<Scalars['Boolean']['input']>
  likedPostsCount?: InputMaybe<Scalars['Boolean']['input']>
  period?: InputMaybe<ActiveStakingPeriod>
  periodValue?: InputMaybe<Scalars['String']['input']>
  stakersEarnedPointsTotal?: InputMaybe<Scalars['Boolean']['input']>
  stakersEarnedTotal?: InputMaybe<Scalars['Boolean']['input']>
  superLikesTotalCountTotal?: InputMaybe<Scalars['Boolean']['input']>
}

export type TotalActivityMetricsForFixedPeriodResponseDto = {
  __typename?: 'TotalActivityMetricsForFixedPeriodResponseDto'
  creatorEarnedPointsTotal?: Maybe<Scalars['String']['output']>
  creatorEarnedTotal?: Maybe<Scalars['String']['output']>
  likedCreatorsCount?: Maybe<Scalars['Int']['output']>
  likedPostsCount?: Maybe<Scalars['Int']['output']>
  stakersEarnedPointsTotal?: Maybe<Scalars['String']['output']>
  stakersEarnedTotal?: Maybe<Scalars['String']['output']>
  superLikesTotalCountTotal?: Maybe<Scalars['Int']['output']>
}

export type TotalRewardsByWeekResponse = {
  __typename?: 'TotalRewardsByWeekResponse'
  creator: SuperLikesCreatorRewards
  /** @deprecated Must be used stakerTokens */
  staker: Scalars['String']['output']
  stakerPoints: Scalars['String']['output']
  stakerTokens: Scalars['String']['output']
  week: Scalars['Int']['output']
}

export type UnreadMessagesInput = {
  idTimestampPairs: Array<IdTimestampPair>
}

export type UnreadPostsCountResponse = {
  __typename?: 'UnreadPostsCountResponse'
  id: Scalars['String']['output']
  unreadCount: Scalars['Int']['output']
}

export type UpdateOrganizationInput = {
  ctxAppIds?: InputMaybe<Array<Scalars['String']['input']>>
  ctxPostIds?: InputMaybe<Array<Scalars['String']['input']>>
  ctxSpaceIds?: InputMaybe<Array<Scalars['String']['input']>>
  description?: InputMaybe<Scalars['String']['input']>
  id: Scalars['String']['input']
  name?: InputMaybe<Scalars['String']['input']>
}

export type UserReferralsDataItem = {
  __typename?: 'UserReferralsDataItem'
  distributedRewards?: Maybe<UserReferralsDistributedRewards>
  referralsCount?: Maybe<Scalars['Int']['output']>
  referrerId: Scalars['String']['output']
}

export type UserReferralsDistributedRewards = {
  __typename?: 'UserReferralsDistributedRewards'
  totalPoints?: Maybe<Scalars['String']['output']>
}

export type UserReferralsInput = {
  responseParams?: InputMaybe<UserReferralsInputResponseParams>
  where: UserReferralsInputWhereArgs
}

export type UserReferralsInputResponseParams = {
  withDistributedRewards?: InputMaybe<Scalars['Boolean']['input']>
}

export type UserReferralsInputWhereArgs = {
  referrerIds: Array<Scalars['String']['input']>
}

export type UserReferralsList = {
  __typename?: 'UserReferralsList'
  data?: Maybe<Array<UserReferrerDetail>>
  offset?: Maybe<Scalars['Int']['output']>
  pageSize?: Maybe<Scalars['Int']['output']>
  total?: Maybe<Scalars['Int']['output']>
}

export type UserReferralsListParams = {
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<QueryOrder>
  pageSize?: InputMaybe<Scalars['Int']['input']>
}

export type UserReferralsResponse = {
  __typename?: 'UserReferralsResponse'
  data: Array<UserReferralsDataItem>
}

export type UserReferralsStatsDistributedRewards = {
  __typename?: 'UserReferralsStatsDistributedRewards'
  totalPoints?: Maybe<Scalars['String']['output']>
}

export type UserReferralsStatsInput = {
  referralsListParams?: InputMaybe<UserReferralsListParams>
  responseParams?: InputMaybe<UserReferralsStatsInputResponseParams>
  where: UserReferralsStatsInputWhereArgs
}

export type UserReferralsStatsInputResponseParams = {
  withDistributedRewards?: InputMaybe<Scalars['Boolean']['input']>
  withReferralsList?: InputMaybe<Scalars['Boolean']['input']>
}

export type UserReferralsStatsInputWhereArgs = {
  referrerId: Scalars['String']['input']
}

export type UserReferralsStatsResponse = {
  __typename?: 'UserReferralsStatsResponse'
  distributedRewards?: Maybe<UserReferralsStatsDistributedRewards>
  referrals?: Maybe<UserReferralsList>
  referrerId: Scalars['String']['output']
}

export type UserReferrerDetail = {
  __typename?: 'UserReferrerDetail'
  clientId: DataHubClientId
  id: Scalars['String']['output']
  referrerId: Scalars['String']['output']
  socialProfile: SocialProfile
  timestamp: Scalars['String']['output']
}

export type GetIsBalanceSufficientQueryVariables = Exact<{
  address: Scalars['String']['input']
  socialAction: SocialAction
}>

export type GetIsBalanceSufficientQuery = {
  __typename?: 'Query'
  isBalanceSufficientForSocialAction: {
    __typename?: 'IsBalanceSufficientForSocialActionResponse'
    sufficient: boolean
  }
}

export type GetIsActiveStakerQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type GetIsActiveStakerQuery = {
  __typename?: 'Query'
  activeStakingIsActiveStaker: boolean
}

export type SubscribeBalancesSubscriptionVariables = Exact<{
  address: Scalars['String']['input']
}>

export type SubscribeBalancesSubscription = {
  __typename?: 'Subscription'
  socialProfileBalancesSubscription: {
    __typename?: 'SocialProfileBalancesSubscriptionPayload'
    event: DataHubSubscriptionEventEnum
    entity: {
      __typename?: 'SocialProfileBalances'
      activeStakingPoints: string
    }
  }
}

export type GetContentContainersQueryVariables = Exact<{
  args: ContentContainerConfigsArgsInputDto
}>

export type GetContentContainersQuery = {
  __typename?: 'Query'
  contentContainerConfigs: {
    __typename?: 'ContentContainerConfigsResourcesResponseDto'
    total?: number | null
    offset?: number | null
    data: Array<{
      __typename?: 'ContentContainerConfig'
      id: string
      openAt?: any | null
      closedAt?: any | null
      expirationWindowFrom?: any | null
      expirationWindowTo?: any | null
      createCommentPricePointsAmount?: string | null
      containerType: ContentContainerType
      accessThresholdPointsAmount?: string | null
      likeThresholdExternalTokenAmount?: string | null
      accessThresholdExternalTokenAmount?: string | null
      rootPost: { __typename?: 'Post'; id: string }
      rootSpace?: { __typename?: 'Space'; id: string } | null
      metadata: {
        __typename?: 'ContainerConfigMetadata'
        title?: string | null
        description?: string | null
        coverImage?: string | null
        image?: string | null
        isExternalTokenRewardPool?: boolean | null
        rewardPoolAmount?: string | null
        winnersNumber?: number | null
      }
      externalToken?: {
        __typename?: 'ExternalToken'
        id: string
        chain: ExternalTokenChain
        name: string
        address: string
        decimals: number
      } | null
    }>
  }
}

export type GetSuperLikeCountsQueryVariables = Exact<{
  postIds: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type GetSuperLikeCountsQuery = {
  __typename?: 'Query'
  activeStakingSuperLikeCountsByPost: Array<{
    __typename?: 'SuperLikeCountsByPostResponse'
    persistentPostId?: string | null
    count: number
  }>
}

export type GetAddressLikeCountToPostsQueryVariables = Exact<{
  address: Scalars['String']['input']
  postIds: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type GetAddressLikeCountToPostsQuery = {
  __typename?: 'Query'
  activeStakingSuperLikeCountsByStaker: Array<{
    __typename?: 'SuperLikeCountsByStakerResponse'
    persistentPostId?: string | null
    count: number
  }>
}

export type GetCanPostsSuperLikedQueryVariables = Exact<{
  postIds: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type GetCanPostsSuperLikedQuery = {
  __typename?: 'Query'
  activeStakingCanDoSuperLikeByPost: Array<{
    __typename?: 'CanDoSuperLikeByPostsResponseDto'
    persistentPostId: string
    validByCreationDate: boolean
    validByCreatorMinStake: boolean
    validByLowValue: boolean
  }>
}

export type GetPostRewardsQueryVariables = Exact<{
  postIds: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type GetPostRewardsQuery = {
  __typename?: 'Query'
  activeStakingRewardsByPosts: Array<{
    __typename?: 'RewardsByPostsResponseDto'
    postId?: string | null
    draftPointsRewardTotal: string
    pointsRewardTotal: string
    pointsRewardsBySource?: {
      __typename?: 'PostRewardsBySourceResponseDto'
      fromDirectSuperLikes?: string | null
    } | null
    draftPointsRewardsBySource?: {
      __typename?: 'PostRewardsBySourceResponseDto'
      fromDirectSuperLikes?: string | null
    } | null
  }>
}

export type GetRewardReportQueryVariables = Exact<{
  address: Scalars['String']['input']
  day: Scalars['Int']['input']
  week: Scalars['Int']['input']
}>

export type GetRewardReportQuery = {
  __typename?: 'Query'
  activeStakingDailyStatsByStaker: {
    __typename?: 'DailyStatsByStakerResponse'
    superLikesCount: number
    currentRewardAmount: string
  }
  activeStakingRewardsByWeek: Array<{
    __typename?: 'TotalRewardsByWeekResponse'
    staker: string
    creator: {
      __typename?: 'SuperLikesCreatorRewards'
      total: string
      rewardsBySource?: {
        __typename?: 'PostRewardsBySourceResponseDto'
        fromDirectSuperLikes?: string | null
        fromCommentSuperLikes?: string | null
        fromShareSuperLikes?: string | null
      } | null
      posts: Array<{
        __typename?: 'SuperLikesCreatorRewardsByPost'
        superLikesCount: number
      }>
    }
  }>
}

export type GetTodaySuperLikeCountQueryVariables = Exact<{
  address: Scalars['String']['input']
  day: Scalars['Int']['input']
}>

export type GetTodaySuperLikeCountQuery = {
  __typename?: 'Query'
  activeStakingDailyStatsByStaker: {
    __typename?: 'DailyStatsByStakerResponse'
    superLikesCount: number
  }
}

export type GetRewardHistoryQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type GetRewardHistoryQuery = {
  __typename?: 'Query'
  activeStakingRewardsByWeek: Array<{
    __typename?: 'TotalRewardsByWeekResponse'
    staker: string
    week: number
    creator: { __typename?: 'SuperLikesCreatorRewards'; total: string }
  }>
}

export type GetUserYesterdayRewardQueryVariables = Exact<{
  address: Scalars['String']['input']
  timestamp: Scalars['String']['input']
}>

export type GetUserYesterdayRewardQuery = {
  __typename?: 'Query'
  activeStakingAccountActivityMetricsForFixedPeriod: {
    __typename?: 'AccountActivityMetricsForFixedPeriodResponseDto'
    creator?: {
      __typename?: 'CreatorActivityMetrics'
      earnedPointsByPeriod?: string | null
    } | null
    staker?: {
      __typename?: 'StakerActivityMetrics'
      likedPosts?: number | null
      earnedPointsByPeriod?: string | null
    } | null
  }
}

export type GetDailyRewardQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type GetDailyRewardQuery = {
  __typename?: 'Query'
  gamificationEntranceDailyRewardSequence?: {
    __typename?: 'GamificationEntranceDailyRewardsSequence'
    claimsCount: number
    claims: Array<{
      __typename?: 'EntranceDailyRewardsSequenceItem'
      index: number
      openToClaim: boolean
      claimRewardPoints: string
      claimRewardPointsRange?: Array<number> | null
      claimValidDay?: string | null
      hiddenClaimReward: boolean
    }>
  } | null
}

export type GetTokenomicsMetadataQueryVariables = Exact<{
  [key: string]: never
}>

export type GetTokenomicsMetadataQuery = {
  __typename?: 'Query'
  activeStakingTokenomicMetadata: {
    __typename?: 'TokenomicMetadataResponse'
    maxTapsPerDay: number
    superLikeWeightPoints: string
    likerRewardDistributionPercent: number
  }
}

export type SubscribeSuperLikeSubscriptionVariables = Exact<{
  [key: string]: never
}>

export type SubscribeSuperLikeSubscription = {
  __typename?: 'Subscription'
  activeStakingSuperLike: {
    __typename?: 'SuperLikeSubscriptionPayload'
    event: DataHubSubscriptionEventEnum
    meta: {
      __typename?: 'SubscriptionPayloadMeta'
      stakerDistributedRewardPoints: string
    }
    entity: {
      __typename?: 'ActiveStakingSuperLike'
      staker: { __typename?: 'Account'; id: string }
      post: { __typename?: 'Post'; persistentId?: string | null }
    }
  }
}

export type SubscribeEventsSubscriptionVariables = Exact<{
  args: AccountServiceMessageInput
}>

export type SubscribeEventsSubscription = {
  __typename?: 'Subscription'
  serviceMessageToTarget: {
    __typename?: 'AccountServiceMessageToTargetResponse'
    event: DataHubSubscriptionEventEnum
    meta: {
      __typename?: 'AccountServiceMessageToTargetMeta'
      callName?: SocialCallName | null
      msg?: string | null
      code: ServiceMessageStatusCode
      callId?: string | null
      extension?: any | null
    }
  }
}

export type GetExternalTokenBalancesQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type GetExternalTokenBalancesQuery = {
  __typename?: 'Query'
  socialProfileBalances?: {
    __typename?: 'SocialProfileBalances'
    externalTokenBalances?: Array<{
      __typename?: 'SocialProfileExternalTokenBalance'
      id: string
      active: boolean
      amount: string
      blockchainAddress: string
      externalToken: {
        __typename?: 'ExternalToken'
        id: string
        address: string
        decimals: number
      }
    }> | null
  } | null
}

export type SubscribeExternalTokenBalancesSubscriptionVariables = Exact<{
  address: Scalars['String']['input']
}>

export type SubscribeExternalTokenBalancesSubscription = {
  __typename?: 'Subscription'
  socialProfileExternalTokenBalanceSubscription: {
    __typename?: 'SocialProfileExternalTokenBalanceSubscriptionPayload'
    event: DataHubSubscriptionEventEnum
    entity: {
      __typename?: 'SocialProfileExternalTokenBalance'
      id: string
      active: boolean
      amount: string
      blockchainAddress: string
      externalToken: {
        __typename?: 'ExternalToken'
        id: string
        address: string
        decimals: number
      }
    }
  }
}

export type GetGeneralStatsQueryVariables = Exact<{ [key: string]: never }>

export type GetGeneralStatsQuery = {
  __typename?: 'Query'
  activeStakingTotalActivityMetricsForFixedPeriod: {
    __typename?: 'TotalActivityMetricsForFixedPeriodResponseDto'
    likedPostsCount?: number | null
    likedCreatorsCount?: number | null
    stakersEarnedTotal?: string | null
    creatorEarnedTotal?: string | null
  }
}

export type GetLinkedIdentitiesQueryVariables = Exact<{
  where: LinkedIdentityArgs
}>

export type GetLinkedIdentitiesQuery = {
  __typename?: 'Query'
  linkedIdentity?: {
    __typename?: 'LinkedIdentity'
    id: string
    externalProviders?: Array<{
      __typename?: 'LinkedIdentityExternalProvider'
      id: string
      externalId: string
      username?: string | null
      provider: IdentityProvider
      enabled: boolean
      createdAtTime: any
    }> | null
  } | null
}

export type GetLinkedIdentitiesFromProviderIdQueryVariables = Exact<{
  provider: IdentityProvider
  externalId: Scalars['String']['input']
}>

export type GetLinkedIdentitiesFromProviderIdQuery = {
  __typename?: 'Query'
  linkedIdentity?: {
    __typename?: 'LinkedIdentity'
    id: string
    externalProviders?: Array<{
      __typename?: 'LinkedIdentityExternalProvider'
      enabled: boolean
    }> | null
  } | null
}

export type GetSocialProfileQueryVariables = Exact<{
  addresses: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type GetSocialProfileQuery = {
  __typename?: 'Query'
  socialProfiles: {
    __typename?: 'SocialProfilesResponse'
    data: Array<{
      __typename?: 'SocialProfile'
      id: string
      allowedCreateCommentRootPostIds: Array<string>
    }>
  }
}

export type SubscribeIdentitySubscriptionVariables = Exact<{
  [key: string]: never
}>

export type SubscribeIdentitySubscription = {
  __typename?: 'Subscription'
  linkedIdentitySubscription: {
    __typename?: 'LinkedIdentitySubscriptionGenericPayload'
    event: DataHubSubscriptionEventEnum
    entity: {
      __typename?: 'LinkedIdentitySubscriptionGenericEntityPayload'
      session?: {
        __typename?: 'LinkedIdentitySession'
        id: string
        linkedIdentity: {
          __typename?: 'LinkedIdentity'
          id: string
          externalProviders?: Array<{
            __typename?: 'LinkedIdentityExternalProvider'
            id: string
            username?: string | null
            externalId: string
            provider: IdentityProvider
            enabled: boolean
            createdAtTime: any
          }> | null
        }
      } | null
      externalProvider?: {
        __typename?: 'LinkedIdentityExternalProvider'
        id: string
        externalId: string
        provider: IdentityProvider
        enabled: boolean
        username?: string | null
        createdAtTime: any
        linkedIdentity: { __typename?: 'LinkedIdentity'; id: string }
      } | null
    }
  }
}

export type GetLeaderboardTableDataByAllTimeQueryVariables = Exact<{
  [key: string]: never
}>

export type GetLeaderboardTableDataByAllTimeQuery = {
  __typename?: 'Query'
  activeStakingAddressesRankedByTotalRewardsForPeriod: {
    __typename?: 'AddressesRankedByRewardsForPeriodResponseDto'
    total: number
    data: Array<{
      __typename?: 'RankedAddressWithDetails'
      reward: string
      rank: number
      address: string
    }>
  }
}

export type GetLeaderboardTableDataByWeekQueryVariables = Exact<{
  timestamp: Scalars['String']['input']
}>

export type GetLeaderboardTableDataByWeekQuery = {
  __typename?: 'Query'
  activeStakingAddressesRankedByTotalRewardsForPeriod: {
    __typename?: 'AddressesRankedByRewardsForPeriodResponseDto'
    total: number
    data: Array<{
      __typename?: 'RankedAddressWithDetails'
      reward: string
      rank: number
      address: string
    }>
  }
}

export type GetUserDataByAllTimeQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type GetUserDataByAllTimeQuery = {
  __typename?: 'Query'
  activeStakingAddressRankByTotalRewardsForPeriod?: {
    __typename?: 'AddressRankByRewardsForPeriodResponseDto'
    rankIndex: number
    reward?: string | null
  } | null
}

export type GetUserDataByWeekQueryVariables = Exact<{
  address: Scalars['String']['input']
  timestamp: Scalars['String']['input']
}>

export type GetUserDataByWeekQuery = {
  __typename?: 'Query'
  activeStakingAddressRankByTotalRewardsForPeriod?: {
    __typename?: 'AddressRankByRewardsForPeriodResponseDto'
    rankIndex: number
    reward?: string | null
  } | null
}

export type GetUserReferralsQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type GetUserReferralsQuery = {
  __typename?: 'Query'
  userReferrals: {
    __typename?: 'UserReferralsResponse'
    data: Array<{
      __typename?: 'UserReferralsDataItem'
      referrerId: string
      referralsCount?: number | null
      distributedRewards?: {
        __typename?: 'UserReferralsDistributedRewards'
        totalPoints?: string | null
      } | null
    }>
  }
}

export type GetUserReferralsStatsQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type GetUserReferralsStatsQuery = {
  __typename?: 'Query'
  userReferralsStats: {
    __typename?: 'UserReferralsStatsResponse'
    referrerId: string
    distributedRewards?: {
      __typename?: 'UserReferralsStatsDistributedRewards'
      totalPoints?: string | null
    } | null
    referrals?: {
      __typename?: 'UserReferralsList'
      total?: number | null
      pageSize?: number | null
      offset?: number | null
      data?: Array<{
        __typename?: 'UserReferrerDetail'
        timestamp: string
        socialProfile: { __typename?: 'SocialProfile'; id: string }
      }> | null
    } | null
  }
}

export type GetBalanceQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type GetBalanceQuery = {
  __typename?: 'Query'
  socialProfileBalances?: {
    __typename?: 'SocialProfileBalances'
    activeStakingPoints: string
  } | null
}

export type GetEnergyStateQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type GetEnergyStateQuery = {
  __typename?: 'Query'
  gamificationTappingEnergyState?: {
    __typename?: 'TappingEnergyStateResponseDto'
    energyValue: number
    timestamp: string
  } | null
}

export type GetClickedPointsByDaySQueryVariables = Exact<{
  address: Scalars['String']['input']
  dates: Array<Scalars['Int']['input']> | Scalars['Int']['input']
}>

export type GetClickedPointsByDaySQuery = {
  __typename?: 'Query'
  gamificationTappingActivityStatsByDate: {
    __typename?: 'TappingActivityStatsByDateResponseDto'
    data: Array<{
      __typename?: 'TappingActivityStatsForDate'
      tapsCount: number
      date: number
    }>
  }
}

export type GetBlockedResourcesQueryVariables = Exact<{
  spaceIds: Array<Scalars['String']['input']> | Scalars['String']['input']
  postIds: Array<Scalars['String']['input']> | Scalars['String']['input']
  appIds: Array<Scalars['String']['input']> | Scalars['String']['input']
}>

export type GetBlockedResourcesQuery = {
  __typename?: 'Query'
  moderationBlockedResourceIdsBatch: {
    __typename?: 'BlockedResourceIdsBatchResponse'
    byCtxAppIds: Array<{
      __typename?: 'BlockedResourceIdsBatchItem'
      id: string
      blockedResourceIds: Array<string>
    }>
    byCtxPostIds: Array<{
      __typename?: 'BlockedResourceIdsBatchItem'
      id: string
      blockedResourceIds: Array<string>
    }>
  }
}

export type GetBlockedInPostIdDetailedQueryVariables = Exact<{
  postId: Scalars['String']['input']
}>

export type GetBlockedInPostIdDetailedQuery = {
  __typename?: 'Query'
  moderationBlockedResourcesDetailed: Array<{
    __typename?: 'ModerationBlockedResource'
    resourceId: string
    createdAt: any
    reason: {
      __typename?: 'ModerationBlockReason'
      id: string
      reasonText: string
    }
  }>
}

export type GetBlockedInAppDetailedQueryVariables = Exact<{
  appId: Scalars['String']['input']
}>

export type GetBlockedInAppDetailedQuery = {
  __typename?: 'Query'
  moderationBlockedResourcesDetailed: Array<{
    __typename?: 'ModerationBlockedResource'
    resourceId: string
    createdAt: any
    reason: {
      __typename?: 'ModerationBlockReason'
      id: string
      reasonText: string
    }
  }>
}

export type GetModerationReasonsQueryVariables = Exact<{ [key: string]: never }>

export type GetModerationReasonsQuery = {
  __typename?: 'Query'
  moderationReasonsAll: Array<{
    __typename?: 'ModerationBlockReason'
    id: string
    reasonText: string
  }>
}

export type GetModeratorDataQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type GetModeratorDataQuery = {
  __typename?: 'Query'
  moderators?: {
    __typename?: 'ModeratorsResponse'
    data: Array<{
      __typename?: 'Moderator'
      moderatorOrganizations?: Array<{
        __typename?: 'ModerationOrganizationModerator'
        organization: {
          __typename?: 'ModerationOrganization'
          id: string
          ctxPostIds?: Array<string> | null
          ctxAppIds?: Array<string> | null
        }
      }> | null
    }>
  } | null
}

export type GetApprovedByModeratorQueryVariables = Exact<{
  address: Scalars['String']['input']
  limit: Scalars['Int']['input']
  offset: Scalars['Int']['input']
}>

export type GetApprovedByModeratorQuery = {
  __typename?: 'Query'
  resource: {
    __typename?: 'ApprovedResourcesResponseDto'
    total?: number | null
    data: Array<{
      __typename?: 'ModerationApprovedResource'
      resourceId: string
    }>
  }
}

export type GetBlockedByModeratorQueryVariables = Exact<{
  address: Scalars['String']['input']
  limit: Scalars['Int']['input']
  offset: Scalars['Int']['input']
}>

export type GetBlockedByModeratorQuery = {
  __typename?: 'Query'
  resource: {
    __typename?: 'BlockedResourcesResponseDto'
    total?: number | null
    data: Array<{
      __typename?: 'ModerationBlockedResource'
      resourceId: string
    }>
  }
}

export type GetAllModeratorsQueryVariables = Exact<{
  ctxAppId: Scalars['String']['input']
}>

export type GetAllModeratorsQuery = {
  __typename?: 'Query'
  moderators?: {
    __typename?: 'ModeratorsResponse'
    total?: number | null
    data: Array<{ __typename?: 'Moderator'; id: string }>
  } | null
}

export type SubscribeOrganizationSubscriptionVariables = Exact<{
  [key: string]: never
}>

export type SubscribeOrganizationSubscription = {
  __typename?: 'Subscription'
  moderationOrganization: {
    __typename?: 'ModerationOrganizationSubscriptionPayload'
    event: DataHubSubscriptionEventEnum
    entity: {
      __typename?: 'ModerationOrganization'
      ctxPostIds?: Array<string> | null
      organizationModerators?: Array<{
        __typename?: 'ModerationOrganizationModerator'
        moderator: {
          __typename?: 'Moderator'
          account: { __typename?: 'Account'; id: string }
        }
      }> | null
    }
  }
}

export type SubscribeBlockedResourcesSubscriptionVariables = Exact<{
  [key: string]: never
}>

export type SubscribeBlockedResourcesSubscription = {
  __typename?: 'Subscription'
  moderationBlockedResource: {
    __typename?: 'ModerationBlockedResourceSubscriptionPayload'
    event: DataHubSubscriptionEventEnum
    entity: {
      __typename?: 'ModerationBlockedResource'
      id: string
      blocked: boolean
      resourceId: string
      ctxPostIds: Array<string>
      ctxAppIds: Array<string>
      rootPostId?: string | null
      createdAt: any
      organization: {
        __typename?: 'ModerationOrganization'
        ctxPostIds?: Array<string> | null
        ctxAppIds?: Array<string> | null
      }
      reason: {
        __typename?: 'ModerationBlockReason'
        id: string
        reasonText: string
      }
    }
  }
}

export type DatahubPostFragmentFragment = {
  __typename?: 'Post'
  id: string
  createdAtTime?: any | null
  updatedAtTime?: any | null
  title?: string | null
  body?: string | null
  approvedInRootPost: boolean
  approvedInRootPostAtTime?: any | null
  createdByAccount: { __typename?: 'Account'; id: string }
  space?: { __typename?: 'Space'; id: string } | null
  ownedByAccount: { __typename?: 'Account'; id: string }
  rootPost?: {
    __typename?: 'Post'
    persistentId?: string | null
    space?: { __typename?: 'Space'; id: string } | null
  } | null
  extensions: Array<{
    __typename?: 'ContentExtension'
    image?: string | null
    extensionSchemaId: ContentExtensionSchemaId
  }>
}

export type GetPostsQueryVariables = Exact<{
  ids?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >
  pageSize: Scalars['Int']['input']
}>

export type GetPostsQuery = {
  __typename?: 'Query'
  posts: {
    __typename?: 'FindPostsResponseDto'
    data: Array<{
      __typename?: 'Post'
      id: string
      createdAtTime?: any | null
      updatedAtTime?: any | null
      title?: string | null
      body?: string | null
      approvedInRootPost: boolean
      approvedInRootPostAtTime?: any | null
      createdByAccount: { __typename?: 'Account'; id: string }
      space?: { __typename?: 'Space'; id: string } | null
      ownedByAccount: { __typename?: 'Account'; id: string }
      rootPost?: {
        __typename?: 'Post'
        persistentId?: string | null
        space?: { __typename?: 'Space'; id: string } | null
      } | null
      extensions: Array<{
        __typename?: 'ContentExtension'
        image?: string | null
        extensionSchemaId: ContentExtensionSchemaId
      }>
    }>
  }
}

export type GetOptimisticPostsQueryVariables = Exact<{
  ids?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >
}>

export type GetOptimisticPostsQuery = {
  __typename?: 'Query'
  posts: {
    __typename?: 'FindPostsResponseDto'
    data: Array<{
      __typename?: 'Post'
      id: string
      createdAtTime?: any | null
      updatedAtTime?: any | null
      title?: string | null
      body?: string | null
      approvedInRootPost: boolean
      approvedInRootPostAtTime?: any | null
      createdByAccount: { __typename?: 'Account'; id: string }
      space?: { __typename?: 'Space'; id: string } | null
      ownedByAccount: { __typename?: 'Account'; id: string }
      rootPost?: {
        __typename?: 'Post'
        persistentId?: string | null
        space?: { __typename?: 'Space'; id: string } | null
      } | null
      extensions: Array<{
        __typename?: 'ContentExtension'
        image?: string | null
        extensionSchemaId: ContentExtensionSchemaId
      }>
    }>
  }
}

export type GetCommentIdsInPostIdQueryVariables = Exact<{
  args: FindPostsWithFilterArgs
}>

export type GetCommentIdsInPostIdQuery = {
  __typename?: 'Query'
  posts: {
    __typename?: 'FindPostsResponseDto'
    total?: number | null
    data: Array<{
      __typename?: 'Post'
      id: string
      createdAtTime?: any | null
      updatedAtTime?: any | null
      title?: string | null
      body?: string | null
      approvedInRootPost: boolean
      approvedInRootPostAtTime?: any | null
      createdByAccount: { __typename?: 'Account'; id: string }
      space?: { __typename?: 'Space'; id: string } | null
      ownedByAccount: { __typename?: 'Account'; id: string }
      rootPost?: {
        __typename?: 'Post'
        persistentId?: string | null
        space?: { __typename?: 'Space'; id: string } | null
      } | null
      extensions: Array<{
        __typename?: 'ContentExtension'
        image?: string | null
        extensionSchemaId: ContentExtensionSchemaId
      }>
    }>
  }
}

export type GetPostMetadataQueryVariables = Exact<{
  where: PostMetadataInput
}>

export type GetPostMetadataQuery = {
  __typename?: 'Query'
  postMetadata: Array<{
    __typename?: 'PostMetadataResponse'
    totalCommentsCount: string
    latestComment?: {
      __typename?: 'CommentDataShort'
      id: string
      persistentId?: string | null
      rootPostPersistentId: string
      createdAtTime: any
      summary?: string | null
    } | null
  }>
}

export type GetUnreadCountQueryVariables = Exact<{
  where: UnreadMessagesInput
}>

export type GetUnreadCountQuery = {
  __typename?: 'Query'
  unreadMessages: Array<{
    __typename?: 'UnreadPostsCountResponse'
    id: string
    unreadCount: number
  }>
}

export type GetOwnedPostsQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type GetOwnedPostsQuery = {
  __typename?: 'Query'
  posts: {
    __typename?: 'FindPostsResponseDto'
    data: Array<{
      __typename?: 'Post'
      id: string
      createdAtTime?: any | null
      updatedAtTime?: any | null
      title?: string | null
      body?: string | null
      approvedInRootPost: boolean
      approvedInRootPostAtTime?: any | null
      createdByAccount: { __typename?: 'Account'; id: string }
      space?: { __typename?: 'Space'; id: string } | null
      ownedByAccount: { __typename?: 'Account'; id: string }
      rootPost?: {
        __typename?: 'Post'
        persistentId?: string | null
        space?: { __typename?: 'Space'; id: string } | null
      } | null
      extensions: Array<{
        __typename?: 'ContentExtension'
        image?: string | null
        extensionSchemaId: ContentExtensionSchemaId
      }>
    }>
  }
}

export type GetPostsBySpaceIdQueryVariables = Exact<{
  id: Scalars['String']['input']
}>

export type GetPostsBySpaceIdQuery = {
  __typename?: 'Query'
  posts: {
    __typename?: 'FindPostsResponseDto'
    data: Array<{
      __typename?: 'Post'
      id: string
      createdAtTime?: any | null
      updatedAtTime?: any | null
      title?: string | null
      body?: string | null
      approvedInRootPost: boolean
      approvedInRootPostAtTime?: any | null
      createdByAccount: { __typename?: 'Account'; id: string }
      space?: { __typename?: 'Space'; id: string } | null
      ownedByAccount: { __typename?: 'Account'; id: string }
      rootPost?: {
        __typename?: 'Post'
        persistentId?: string | null
        space?: { __typename?: 'Space'; id: string } | null
      } | null
      extensions: Array<{
        __typename?: 'ContentExtension'
        image?: string | null
        extensionSchemaId: ContentExtensionSchemaId
      }>
    }>
  }
}

export type GetLastPostedMemeQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type GetLastPostedMemeQuery = {
  __typename?: 'Query'
  posts: {
    __typename?: 'FindPostsResponseDto'
    data: Array<{
      __typename?: 'Post'
      approvedInRootPost: boolean
      createdAtTime?: any | null
    }>
  }
}

export type GetUnapprovedMemesCountQueryVariables = Exact<{
  address: Scalars['String']['input']
  postId: Scalars['String']['input']
}>

export type GetUnapprovedMemesCountQuery = {
  __typename?: 'Query'
  posts: {
    __typename?: 'FindPostsResponseDto'
    data: Array<{
      __typename?: 'Post'
      id: string
      approvedInRootPost: boolean
    }>
  }
}

export type GetPostsCountByTodayQueryVariables = Exact<{
  createdAtTimeGte: Scalars['String']['input']
  createdAtTimeLte: Scalars['String']['input']
  postId: Scalars['String']['input']
}>

export type GetPostsCountByTodayQuery = {
  __typename?: 'Query'
  posts: { __typename?: 'FindPostsResponseDto'; total?: number | null }
}

export type GetTopMemesQueryVariables = Exact<{
  timestamp: Scalars['String']['input']
}>

export type GetTopMemesQuery = {
  __typename?: 'Query'
  activeStakingRankedPostIdsBySuperLikesNumber: {
    __typename?: 'RankedPostIdsBySuperLikesCountResponse'
    total: number
    data: Array<{
      __typename?: 'RankedPostIdBySuperLikesCountWithDetails'
      postId: string
      score: number
      rank: number
    }>
  }
}

export type SubscribePostSubscriptionVariables = Exact<{ [key: string]: never }>

export type SubscribePostSubscription = {
  __typename?: 'Subscription'
  post: {
    __typename?: 'PostSubscriptionPayload'
    event: DataHubSubscriptionEventEnum
    entity: {
      __typename?: 'Post'
      id: string
      persistentId?: string | null
      optimisticId?: string | null
      dataType: DataType
      approvedInRootPost: boolean
      approvedInRootPostAtTime?: any | null
      createdAtTime?: any | null
      rootPost?: { __typename?: 'Post'; persistentId?: string | null } | null
    }
  }
}

export type GetProfilesQueryVariables = Exact<{
  addresses?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >
  pageSize: Scalars['Int']['input']
}>

export type GetProfilesQuery = {
  __typename?: 'Query'
  spaces: {
    __typename?: 'FindSpacesWithFilterResponseDto'
    data: Array<{
      __typename?: 'Space'
      id: string
      name?: string | null
      image?: string | null
      about?: string | null
      updatedAtTime?: any | null
      createdAtTime?: any | null
      profileSpace?: { __typename?: 'Account'; id: string } | null
    }>
  }
}

export type GetReferrerIdQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type GetReferrerIdQuery = {
  __typename?: 'Query'
  socialProfiles: {
    __typename?: 'SocialProfilesResponse'
    data: Array<{
      __typename?: 'SocialProfile'
      referrersList?: Array<{
        __typename?: 'UserReferrerDetail'
        referrerId: string
      }> | null
    }>
  }
}

export type ReferralLeaderboardFragmentFragment = {
  __typename?: 'ReferrersRankedByReferralsCountForPeriodResponseDto'
  total: number
  limit: number
  offset: number
  data: Array<{
    __typename?: 'RankedReferrerWithDetails'
    address: string
    count: number
    rank: number
  }>
}

export type GetReferralLeaderboardQueryVariables = Exact<{
  [key: string]: never
}>

export type GetReferralLeaderboardQuery = {
  __typename?: 'Query'
  referrersRankedByReferralsCountForPeriod: {
    __typename?: 'ReferrersRankedByReferralsCountForPeriodResponseDto'
    total: number
    limit: number
    offset: number
    data: Array<{
      __typename?: 'RankedReferrerWithDetails'
      address: string
      count: number
      rank: number
    }>
  }
}

export type GetReferralLeaderboardByCustomRangeKeyQueryVariables = Exact<{
  customRangeKey?: InputMaybe<ReferrersRankedListCustomPeriodKey>
}>

export type GetReferralLeaderboardByCustomRangeKeyQuery = {
  __typename?: 'Query'
  referrersRankedByReferralsCountForPeriod: {
    __typename?: 'ReferrersRankedByReferralsCountForPeriodResponseDto'
    total: number
    limit: number
    offset: number
    data: Array<{
      __typename?: 'RankedReferrerWithDetails'
      address: string
      count: number
      rank: number
    }>
  }
}

export type ReferrerRankFragmentFragment = {
  __typename?: 'ReferrerRankByReferralsCountForPeriodResponseDto'
  count?: number | null
  maxIndex: number
  rankIndex: number
}

export type GetReferrerRankQueryVariables = Exact<{
  address: Scalars['String']['input']
}>

export type GetReferrerRankQuery = {
  __typename?: 'Query'
  referrerRankByReferralsCountForPeriod?: {
    __typename?: 'ReferrerRankByReferralsCountForPeriodResponseDto'
    count?: number | null
    maxIndex: number
    rankIndex: number
  } | null
}

export type GetReferrerRankByCustomRangeKeyQueryVariables = Exact<{
  address: Scalars['String']['input']
  customRangeKey?: InputMaybe<ReferrersRankedListCustomPeriodKey>
}>

export type GetReferrerRankByCustomRangeKeyQuery = {
  __typename?: 'Query'
  referrerRankByReferralsCountForPeriod?: {
    __typename?: 'ReferrerRankByReferralsCountForPeriodResponseDto'
    count?: number | null
    maxIndex: number
    rankIndex: number
  } | null
}

export type SpaceFragmentFragment = {
  __typename?: 'Space'
  name?: string | null
  image?: string | null
  about?: string | null
  id: string
  hidden: boolean
  content?: string | null
  createdAtTime?: any | null
  createdAtBlock?: number | null
  createdByAccount: { __typename?: 'Account'; id: string }
  ownedByAccount: { __typename?: 'Account'; id: string }
}

export type GetSpacesQueryVariables = Exact<{
  ids?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >
}>

export type GetSpacesQuery = {
  __typename?: 'Query'
  spaces: {
    __typename?: 'FindSpacesWithFilterResponseDto'
    data: Array<{
      __typename?: 'Space'
      name?: string | null
      image?: string | null
      about?: string | null
      id: string
      hidden: boolean
      content?: string | null
      createdAtTime?: any | null
      createdAtBlock?: number | null
      createdByAccount: { __typename?: 'Account'; id: string }
      ownedByAccount: { __typename?: 'Account'; id: string }
    }>
  }
}

export type GetGamificationTasksQueryVariables = Exact<{
  address: Scalars['String']['input']
  rootSpaceId: Scalars['String']['input']
}>

export type GetGamificationTasksQuery = {
  __typename?: 'Query'
  gamificationTasks: {
    __typename?: 'FindTasksResponseDto'
    total?: number | null
    data: Array<{
      __typename?: 'GamificationTask'
      rewardPoints: string
      id: string
      name: GamificationTaskName
      tag: string
      createdAt?: any | null
      completed: boolean
      claimed: boolean
      linkedIdentity: { __typename?: 'LinkedIdentity'; id: string }
      metadata?: {
        __typename?: 'GamificationTaskMetadata'
        telegramChannelToJoin?: string | null
        twitterChannelToJoin?: string | null
        likesNumberToAchieve?: string | null
        referralsNumberToAchieve?: number | null
      } | null
    }>
  }
}

export const DatahubPostFragment = gql`
  fragment DatahubPostFragment on Post {
    id
    createdAtTime
    updatedAtTime
    createdByAccount {
      id
    }
    space {
      id
    }
    title
    body
    approvedInRootPost
    approvedInRootPostAtTime
    ownedByAccount {
      id
    }
    rootPost {
      persistentId
      space {
        id
      }
    }
    extensions {
      image
      extensionSchemaId
    }
  }
`
export const ReferralLeaderboardFragment = gql`
  fragment ReferralLeaderboardFragment on ReferrersRankedByReferralsCountForPeriodResponseDto {
    total
    limit
    offset
    data {
      address
      count
      rank
    }
  }
`
export const ReferrerRankFragment = gql`
  fragment ReferrerRankFragment on ReferrerRankByReferralsCountForPeriodResponseDto {
    count
    maxIndex
    rankIndex
  }
`
export const SpaceFragment = gql`
  fragment SpaceFragment on Space {
    name
    image
    about
    id
    hidden
    about
    content
    createdByAccount {
      id
    }
    ownedByAccount {
      id
    }
    createdAtTime
    createdAtBlock
  }
`
export const GetIsBalanceSufficient = gql`
  query GetIsBalanceSufficient(
    $address: String!
    $socialAction: SocialAction!
  ) {
    isBalanceSufficientForSocialAction(
      args: { address: $address, socialAction: $socialAction }
    ) {
      sufficient
    }
  }
`
export const GetIsActiveStaker = gql`
  query GetIsActiveStaker($address: String!) {
    activeStakingIsActiveStaker(address: $address)
  }
`
export const SubscribeBalances = gql`
  subscription SubscribeBalances($address: String!) {
    socialProfileBalancesSubscription(args: { address: $address }) {
      event
      entity {
        activeStakingPoints
      }
    }
  }
`
export const GetContentContainers = gql`
  query GetContentContainers($args: ContentContainerConfigsArgsInputDto!) {
    contentContainerConfigs(args: $args) {
      data {
        id
        rootPost {
          id
        }
        rootSpace {
          id
        }
        metadata {
          title
          description
          coverImage
          image
          isExternalTokenRewardPool
          rewardPoolAmount
          winnersNumber
        }
        openAt
        closedAt
        expirationWindowFrom
        expirationWindowTo
        createCommentPricePointsAmount
        containerType
        accessThresholdPointsAmount
        likeThresholdExternalTokenAmount
        accessThresholdExternalTokenAmount
        externalToken {
          id
          chain
          name
          address
          decimals
        }
      }
      total
      offset
    }
  }
`
export const GetSuperLikeCounts = gql`
  query GetSuperLikeCounts($postIds: [String!]!) {
    activeStakingSuperLikeCountsByPost(args: { postPersistentIds: $postIds }) {
      persistentPostId
      count
    }
  }
`
export const GetAddressLikeCountToPosts = gql`
  query GetAddressLikeCountToPosts($address: String!, $postIds: [String!]!) {
    activeStakingSuperLikeCountsByStaker(
      args: { postPersistentIds: $postIds, address: $address }
    ) {
      persistentPostId
      count
    }
  }
`
export const GetCanPostsSuperLiked = gql`
  query GetCanPostsSuperLiked($postIds: [String!]!) {
    activeStakingCanDoSuperLikeByPost(args: { postPersistentIds: $postIds }) {
      persistentPostId
      validByCreationDate
      validByCreatorMinStake
      validByLowValue
    }
  }
`
export const GetPostRewards = gql`
  query GetPostRewards($postIds: [String!]!) {
    activeStakingRewardsByPosts(args: { postPersistentIds: $postIds }) {
      postId
      draftPointsRewardTotal
      pointsRewardTotal
      pointsRewardsBySource {
        fromDirectSuperLikes
      }
      draftPointsRewardsBySource {
        fromDirectSuperLikes
      }
    }
  }
`
export const GetRewardReport = gql`
  query GetRewardReport($address: String!, $day: Int!, $week: Int!) {
    activeStakingDailyStatsByStaker(
      args: { address: $address, dayTimestamp: $day }
    ) {
      superLikesCount
      currentRewardAmount
    }
    activeStakingRewardsByWeek(
      args: { weeks: [$week], filter: { account: $address } }
    ) {
      staker
      creator {
        total
        rewardsBySource {
          fromDirectSuperLikes
          fromCommentSuperLikes
          fromShareSuperLikes
        }
        posts {
          superLikesCount
        }
      }
    }
  }
`
export const GetTodaySuperLikeCount = gql`
  query GetTodaySuperLikeCount($address: String!, $day: Int!) {
    activeStakingDailyStatsByStaker(
      args: { address: $address, dayTimestamp: $day }
    ) {
      superLikesCount
    }
  }
`
export const GetRewardHistory = gql`
  query GetRewardHistory($address: String!) {
    activeStakingRewardsByWeek(args: { filter: { account: $address } }) {
      staker
      week
      creator {
        total
      }
    }
  }
`
export const GetUserYesterdayReward = gql`
  query GetUserYesterdayReward($address: String!, $timestamp: String!) {
    activeStakingAccountActivityMetricsForFixedPeriod(
      args: {
        address: $address
        period: DAY
        periodValue: $timestamp
        staker: { likedPosts: true, earnedPointsByPeriod: true }
        creator: { earnedPointsByPeriod: true }
      }
    ) {
      creator {
        earnedPointsByPeriod
      }
      staker {
        likedPosts
        earnedPointsByPeriod
      }
    }
  }
`
export const GetDailyReward = gql`
  query GetDailyReward($address: String!) {
    gamificationEntranceDailyRewardSequence(
      args: { where: { address: $address } }
    ) {
      claimsCount
      claims {
        index
        openToClaim
        claimRewardPoints
        claimRewardPointsRange
        claimValidDay
        hiddenClaimReward
      }
    }
  }
`
export const GetTokenomicsMetadata = gql`
  query GetTokenomicsMetadata {
    activeStakingTokenomicMetadata {
      maxTapsPerDay
      superLikeWeightPoints
      likerRewardDistributionPercent
    }
  }
`
export const SubscribeSuperLike = gql`
  subscription SubscribeSuperLike {
    activeStakingSuperLike {
      event
      meta {
        stakerDistributedRewardPoints
      }
      entity {
        staker {
          id
        }
        post {
          persistentId
        }
      }
    }
  }
`
export const SubscribeEvents = gql`
  subscription SubscribeEvents($args: AccountServiceMessageInput!) {
    serviceMessageToTarget(args: $args) {
      event
      meta {
        callName
        msg
        code
        callId
        extension
      }
    }
  }
`
export const GetExternalTokenBalances = gql`
  query GetExternalTokenBalances($address: String!) {
    socialProfileBalances(args: { where: { address: $address } }) {
      externalTokenBalances {
        id
        active
        amount
        blockchainAddress
        externalToken {
          id
          address
          decimals
        }
      }
    }
  }
`
export const SubscribeExternalTokenBalances = gql`
  subscription SubscribeExternalTokenBalances($address: String!) {
    socialProfileExternalTokenBalanceSubscription(args: { address: $address }) {
      event
      entity {
        id
        active
        amount
        blockchainAddress
        externalToken {
          id
          address
          decimals
        }
      }
    }
  }
`
export const GetGeneralStats = gql`
  query GetGeneralStats {
    activeStakingTotalActivityMetricsForFixedPeriod(
      args: {
        period: ALL_TIME
        likedPostsCount: false
        likedCreatorsCount: false
        stakersEarnedTotal: true
        creatorEarnedTotal: false
      }
    ) {
      likedPostsCount
      likedCreatorsCount
      stakersEarnedTotal
      creatorEarnedTotal
    }
  }
`
export const GetLinkedIdentities = gql`
  query GetLinkedIdentities($where: LinkedIdentityArgs!) {
    linkedIdentity(where: $where) {
      id
      externalProviders {
        id
        externalId
        username
        provider
        enabled
        createdAtTime
      }
    }
  }
`
export const GetLinkedIdentitiesFromProviderId = gql`
  query GetLinkedIdentitiesFromProviderId(
    $provider: IdentityProvider!
    $externalId: String!
  ) {
    linkedIdentity(
      where: {
        externalProvider: { provider: $provider, externalId: $externalId }
      }
    ) {
      id
      externalProviders {
        enabled
      }
    }
  }
`
export const GetSocialProfile = gql`
  query GetSocialProfile($addresses: [String!]!) {
    socialProfiles(args: { where: { substrateAddresses: $addresses } }) {
      data {
        id
        allowedCreateCommentRootPostIds
      }
    }
  }
`
export const SubscribeIdentity = gql`
  subscription SubscribeIdentity {
    linkedIdentitySubscription {
      event
      entity {
        session {
          id
          linkedIdentity {
            id
            externalProviders {
              id
              username
              externalId
              provider
              enabled
              createdAtTime
            }
          }
        }
        externalProvider {
          id
          externalId
          provider
          enabled
          username
          createdAtTime
          linkedIdentity {
            id
          }
        }
      }
    }
  }
`
export const GetLeaderboardTableDataByAllTime = gql`
  query GetLeaderboardTableDataByAllTime {
    activeStakingAddressesRankedByTotalRewardsForPeriod(
      args: { filter: { period: ALL_TIME }, limit: 100 }
    ) {
      total
      data {
        reward
        rank
        address
      }
    }
  }
`
export const GetLeaderboardTableDataByWeek = gql`
  query GetLeaderboardTableDataByWeek($timestamp: String!) {
    activeStakingAddressesRankedByTotalRewardsForPeriod(
      args: { filter: { period: WEEK, timestamp: $timestamp }, limit: 100 }
    ) {
      total
      data {
        reward
        rank
        address
      }
    }
  }
`
export const GetUserDataByAllTime = gql`
  query GetUserDataByAllTime($address: String!) {
    activeStakingAddressRankByTotalRewardsForPeriod(
      args: { period: ALL_TIME, address: $address, withReward: true }
    ) {
      rankIndex
      reward
    }
  }
`
export const GetUserDataByWeek = gql`
  query GetUserDataByWeek($address: String!, $timestamp: String!) {
    activeStakingAddressRankByTotalRewardsForPeriod(
      args: {
        period: WEEK
        address: $address
        withReward: true
        timestamp: $timestamp
      }
    ) {
      rankIndex
      reward
    }
  }
`
export const GetUserReferrals = gql`
  query GetUserReferrals($address: String!) {
    userReferrals(
      args: {
        where: { referrerIds: [$address] }
        responseParams: { withDistributedRewards: true }
      }
    ) {
      data {
        referrerId
        referralsCount
        distributedRewards {
          totalPoints
        }
      }
    }
  }
`
export const GetUserReferralsStats = gql`
  query getUserReferralsStats($address: String!) {
    userReferralsStats(
      args: {
        where: { referrerId: $address }
        responseParams: {
          withReferralsList: true
          withDistributedRewards: true
        }
        referralsListParams: { pageSize: 100 }
      }
    ) {
      referrerId
      distributedRewards {
        totalPoints
      }
      referrals {
        total
        pageSize
        offset
        data {
          timestamp
          socialProfile {
            id
          }
        }
      }
    }
  }
`
export const GetBalance = gql`
  query GetBalance($address: String!) {
    socialProfileBalances(args: { where: { address: $address } }) {
      activeStakingPoints
    }
  }
`
export const GetEnergyState = gql`
  query GetEnergyState($address: String!) {
    gamificationTappingEnergyState(args: { where: { address: $address } }) {
      energyValue
      timestamp
    }
  }
`
export const GetClickedPointsByDayS = gql`
  query GetClickedPointsByDayS($address: String!, $dates: [Int!]!) {
    gamificationTappingActivityStatsByDate(
      args: { where: { dates: $dates, address: $address } }
    ) {
      data {
        tapsCount
        date
      }
    }
  }
`
export const GetBlockedResources = gql`
  query GetBlockedResources(
    $spaceIds: [String!]!
    $postIds: [String!]!
    $appIds: [String!]!
  ) {
    moderationBlockedResourceIdsBatch(
      ctxSpaceIds: $spaceIds
      ctxPostIds: $postIds
      ctxAppIds: $appIds
    ) {
      byCtxAppIds {
        id
        blockedResourceIds
      }
      byCtxPostIds {
        id
        blockedResourceIds
      }
    }
  }
`
export const GetBlockedInPostIdDetailed = gql`
  query GetBlockedInPostIdDetailed($postId: String!) {
    moderationBlockedResourcesDetailed(ctxPostIds: [$postId], blocked: true) {
      resourceId
      createdAt
      reason {
        id
        reasonText
      }
    }
  }
`
export const GetBlockedInAppDetailed = gql`
  query GetBlockedInAppDetailed($appId: String!) {
    moderationBlockedResourcesDetailed(ctxAppIds: [$appId], blocked: true) {
      resourceId
      createdAt
      reason {
        id
        reasonText
      }
    }
  }
`
export const GetModerationReasons = gql`
  query GetModerationReasons {
    moderationReasonsAll {
      id
      reasonText
    }
  }
`
export const GetModeratorData = gql`
  query GetModeratorData($address: String!) {
    moderators(args: { where: { substrateAddress: $address } }) {
      data {
        moderatorOrganizations {
          organization {
            id
            ctxPostIds
            ctxAppIds
          }
        }
      }
    }
  }
`
export const GetApprovedByModerator = gql`
  query GetApprovedByModerator($address: String!, $limit: Int!, $offset: Int!) {
    resource: moderationApprovedResources(
      args: {
        filter: { createdByAccountAddress: $address, resourceType: POST }
        orderBy: "createdAt"
        orderDirection: DESC
        pageSize: $limit
        offset: $offset
      }
    ) {
      data {
        resourceId
      }
      total
    }
  }
`
export const GetBlockedByModerator = gql`
  query GetBlockedByModerator($address: String!, $limit: Int!, $offset: Int!) {
    resource: moderationBlockedResources(
      args: {
        filter: { createdByAccountAddress: $address, resourceType: POST }
        orderBy: "createdAt"
        orderDirection: DESC
        pageSize: $limit
        offset: $offset
      }
    ) {
      data {
        resourceId
      }
      total
    }
  }
`
export const GetAllModerators = gql`
  query GetAllModerators($ctxAppId: String!) {
    moderators(args: { where: { ctxAppIds: [$ctxAppId] } }) {
      total
      data {
        id
      }
    }
  }
`
export const SubscribeOrganization = gql`
  subscription SubscribeOrganization {
    moderationOrganization {
      event
      entity {
        organizationModerators {
          moderator {
            account {
              id
            }
          }
        }
        ctxPostIds
      }
    }
  }
`
export const SubscribeBlockedResources = gql`
  subscription SubscribeBlockedResources {
    moderationBlockedResource {
      event
      entity {
        id
        blocked
        resourceId
        ctxPostIds
        ctxAppIds
        rootPostId
        createdAt
        organization {
          ctxPostIds
          ctxAppIds
        }
        reason {
          id
          reasonText
        }
      }
    }
  }
`
export const GetPosts = gql`
  query GetPosts($ids: [String!], $pageSize: Int!) {
    posts(args: { filter: { persistentIds: $ids }, pageSize: $pageSize }) {
      data {
        ...DatahubPostFragment
      }
    }
  }
  ${DatahubPostFragment}
`
export const GetOptimisticPosts = gql`
  query GetOptimisticPosts($ids: [String!]) {
    posts(args: { filter: { ids: $ids } }) {
      data {
        ...DatahubPostFragment
      }
    }
  }
  ${DatahubPostFragment}
`
export const GetCommentIdsInPostId = gql`
  query GetCommentIdsInPostId($args: FindPostsWithFilterArgs!) {
    posts(args: $args) {
      data {
        ...DatahubPostFragment
      }
      total
    }
  }
  ${DatahubPostFragment}
`
export const GetPostMetadata = gql`
  query GetPostMetadata($where: PostMetadataInput!) {
    postMetadata(where: $where) {
      totalCommentsCount
      latestComment {
        id
        persistentId
        rootPostPersistentId
        createdAtTime
        summary
      }
    }
  }
`
export const GetUnreadCount = gql`
  query GetUnreadCount($where: UnreadMessagesInput!) {
    unreadMessages(where: $where) {
      id
      unreadCount
    }
  }
`
export const GetOwnedPosts = gql`
  query GetOwnedPosts($address: String!) {
    posts(args: { filter: { ownedByAccountAddress: $address } }) {
      data {
        ...DatahubPostFragment
      }
    }
  }
  ${DatahubPostFragment}
`
export const GetPostsBySpaceId = gql`
  query GetPostsBySpaceId($id: String!) {
    posts(args: { filter: { spaceId: $id } }) {
      data {
        ...DatahubPostFragment
      }
    }
  }
  ${DatahubPostFragment}
`
export const GetLastPostedMeme = gql`
  query GetLastPostedMeme($address: String!) {
    posts(
      args: {
        filter: { createdByAccountAddress: $address }
        pageSize: 4
        orderBy: "createdAtTime"
        orderDirection: DESC
      }
    ) {
      data {
        approvedInRootPost
        createdAtTime
      }
    }
  }
`
export const GetUnapprovedMemesCount = gql`
  query GetUnapprovedMemesCount($address: String!, $postId: String!) {
    posts(
      args: {
        filter: {
          createdAtTimeGt: "2024-07-10T17:37:35.000Z"
          createdByAccountAddress: $address
          rootPostId: $postId
        }
        pageSize: 100
      }
    ) {
      data {
        id
        approvedInRootPost
      }
    }
  }
`
export const GetPostsCountByToday = gql`
  query GetPostsCountByToday(
    $createdAtTimeGte: String!
    $createdAtTimeLte: String!
    $postId: String!
  ) {
    posts(
      args: {
        filter: {
          createdAtTimeGte: $createdAtTimeGte
          createdAtTimeLte: $createdAtTimeLte
          rootPostId: $postId
        }
        pageSize: 100
      }
    ) {
      total
    }
  }
`
export const GetTopMemes = gql`
  query GetTopMemes($timestamp: String!) {
    activeStakingRankedPostIdsBySuperLikesNumber(
      args: {
        filter: { period: DAY, timestamp: $timestamp }
        limit: 5
        offset: 0
        order: DESC
      }
    ) {
      data {
        postId
        score
        rank
      }
      total
    }
  }
`
export const SubscribePost = gql`
  subscription SubscribePost {
    post {
      event
      entity {
        id
        persistentId
        optimisticId
        dataType
        approvedInRootPost
        approvedInRootPostAtTime
        createdAtTime
        rootPost {
          persistentId
        }
      }
    }
  }
`
export const GetProfiles = gql`
  query GetProfiles($addresses: [String!], $pageSize: Int!) {
    spaces(
      args: {
        filter: { asProfileForAccounts: $addresses }
        pageSize: $pageSize
      }
    ) {
      data {
        id
        name
        image
        about
        updatedAtTime
        createdAtTime
        profileSpace {
          id
        }
      }
    }
  }
`
export const GetReferrerId = gql`
  query GetReferrerId($address: String!) {
    socialProfiles(args: { where: { substrateAddresses: [$address] } }) {
      data {
        referrersList {
          referrerId
        }
      }
    }
  }
`
export const GetReferralLeaderboard = gql`
  query GetReferralLeaderboard {
    referrersRankedByReferralsCountForPeriod(
      args: { filter: { period: ALL_TIME }, limit: 100 }
    ) {
      ...ReferralLeaderboardFragment
    }
  }
  ${ReferralLeaderboardFragment}
`
export const GetReferralLeaderboardByCustomRangeKey = gql`
  query GetReferralLeaderboardByCustomRangeKey(
    $customRangeKey: ReferrersRankedListCustomPeriodKey
  ) {
    referrersRankedByReferralsCountForPeriod(
      args: { filter: { customRangeKey: $customRangeKey }, limit: 100 }
    ) {
      ...ReferralLeaderboardFragment
    }
  }
  ${ReferralLeaderboardFragment}
`
export const GetReferrerRank = gql`
  query GetReferrerRank($address: String!) {
    referrerRankByReferralsCountForPeriod(
      args: { address: $address, period: ALL_TIME, withCount: true }
    ) {
      ...ReferrerRankFragment
    }
  }
  ${ReferrerRankFragment}
`
export const GetReferrerRankByCustomRangeKey = gql`
  query GetReferrerRankByCustomRangeKey(
    $address: String!
    $customRangeKey: ReferrersRankedListCustomPeriodKey
  ) {
    referrerRankByReferralsCountForPeriod(
      args: {
        address: $address
        customRangeKey: $customRangeKey
        withCount: true
      }
    ) {
      ...ReferrerRankFragment
    }
  }
  ${ReferrerRankFragment}
`
export const GetSpaces = gql`
  query getSpaces($ids: [String!]) {
    spaces(args: { filter: { ids: $ids } }) {
      data {
        ...SpaceFragment
      }
    }
  }
  ${SpaceFragment}
`
export const GetGamificationTasks = gql`
  query GetGamificationTasks($address: String!, $rootSpaceId: String!) {
    gamificationTasks(
      args: { filter: { address: $address, rootSpaceId: $rootSpaceId } }
    ) {
      data {
        rewardPoints
        id
        name
        tag
        createdAt
        completed
        claimed
        linkedIdentity {
          id
        }
        metadata {
          telegramChannelToJoin
          twitterChannelToJoin
          likesNumberToAchieve
          referralsNumberToAchieve
        }
      }
      total
    }
  }
`
