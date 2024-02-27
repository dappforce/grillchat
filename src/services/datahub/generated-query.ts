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
  linkedEvmAccounts: Array<EvmSubstrateAccountLink>
  linkedIdentities: Array<LinkedIdentity>
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
  era: Scalars['Int']['output']
  id: Scalars['String']['output']
  kind: Scalars['String']['output']
  likedPostId?: Maybe<Scalars['String']['output']>
  likedPostPersistentId?: Maybe<Scalars['String']['output']>
  multiplier: Scalars['Int']['output']
  post: Post
  postKind: PostKind
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
  earnedTotal?: Maybe<Scalars['String']['output']>
  likesCountByPeriod?: Maybe<Scalars['Int']['output']>
  stakersWhoLiked?: Maybe<Scalars['Int']['output']>
}

export type CreatorActivityMetricsForFixedPeriodInput = {
  earnedByPeriod?: InputMaybe<Scalars['Boolean']['input']>
  earnedByPeriodRankPosition?: InputMaybe<Scalars['Boolean']['input']>
  earnedTotal?: InputMaybe<Scalars['Boolean']['input']>
  earnedTotalRankPosition?: InputMaybe<Scalars['Boolean']['input']>
  likesCountByPeriod?: InputMaybe<Scalars['Boolean']['input']>
  stakersWhoLiked?: InputMaybe<Scalars['Boolean']['input']>
  stakersWhoLikedRankPosition?: InputMaybe<Scalars['Boolean']['input']>
  totalLikesCountRankPosition?: InputMaybe<Scalars['Boolean']['input']>
}

export type DailyStatsByStakerInput = {
  address: Scalars['String']['input']
  dayTimestamp: Scalars['Int']['input']
  range?: InputMaybe<ActiveStakingPeriod>
}

export type DailyStatsByStakerResponse = {
  __typename?: 'DailyStatsByStakerResponse'
  currentRewardAmount: Scalars['String']['output']
  initialPoints: Scalars['Int']['output']
  stakerRewordDistribution: Scalars['Int']['output']
  superLikesCount: Scalars['Int']['output']
  totalLazyRewardAmount: Scalars['String']['output']
}

export enum DataHubClientId {
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

export type FindPostsArgs = {
  activeStaking?: InputMaybe<Scalars['Boolean']['input']>
  dataType?: InputMaybe<SocialEventDataType>
  ids?: InputMaybe<Array<Scalars['String']['input']>>
  lowValue?: InputMaybe<Scalars['Boolean']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  optimisticIds?: InputMaybe<Array<Scalars['String']['input']>>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<QueryOrder>
  pageSize?: InputMaybe<Scalars['Int']['input']>
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
  Facebook = 'FACEBOOK',
  Google = 'GOOGLE',
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

export type LikedPostsCountByDayItem = {
  __typename?: 'LikedPostsCountByDayItem'
  count: Scalars['Int']['output']
  dayUnixTimestamp: Scalars['String']['output']
}

export type LinkedIdentitiesArgs = {
  externalId?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  provider?: InputMaybe<IdentityProvider>
  substrateAddress?: InputMaybe<Scalars['String']['input']>
}

export type LinkedIdentity = {
  __typename?: 'LinkedIdentity'
  createdAtTime: Scalars['DateTime']['output']
  enabled: Scalars['Boolean']['output']
  externalId: Scalars['String']['output']
  id: Scalars['String']['output']
  provider: IdentityProvider
  substrateAccount: Account
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>
}

export type LinkedIdentitySubscriptionPayload = {
  __typename?: 'LinkedIdentitySubscriptionPayload'
  entity: LinkedIdentity
  event: DataHubSubscriptionEventEnum
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
  id: Scalars['String']['output']
  moderatorOrganizations?: Maybe<Array<ModerationOrganizationModerator>>
  processedResources?: Maybe<Array<ModerationBlockedResource>>
  substrateAccount: Account
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
  id?: InputMaybe<Scalars['String']['input']>
  substrateAddress?: InputMaybe<Scalars['String']['input']>
}

export type Mutation = {
  __typename?: 'Mutation'
  moderationCreateOrganization: ModerationOrganization
  moderationCreateOrganizationModerator?: Maybe<ModerationOrganizationModerator>
  moderationInitModerator?: Maybe<Moderator>
  moderationUpdateOrganization: ModerationOrganization
  moderationUpdateOrganizationModerator?: Maybe<ModerationOrganizationModerator>
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

export enum PinnedResourceType {
  Post = 'Post',
  Space = 'Space',
}

export type Post = {
  __typename?: 'Post'
  activeStaking: Scalars['Boolean']['output']
  activeStakingSuperLikes?: Maybe<Array<ActiveStakingSuperLike>>
  activeStakingSuperLikesCount?: Maybe<Scalars['Int']['output']>
  /** is off-chain data CID backed up in blockchain */
  backupInBlockchain?: Maybe<Scalars['Boolean']['output']>
  blockchainSyncFailed: Scalars['Boolean']['output']
  blockchainSyncLog: Scalars['JSON']['output']
  /** post body */
  body?: Maybe<Scalars['String']['output']>
  canonical?: Maybe<Scalars['String']['output']>
  /** content CID */
  content?: Maybe<Scalars['String']['output']>
  createdAtBlock?: Maybe<Scalars['Int']['output']>
  createdAtTime?: Maybe<Scalars['DateTime']['output']>
  createdByAccount: Account
  dataType: DataType
  downvotesCount?: Maybe<Scalars['Int']['output']>
  experimental?: Maybe<Scalars['JSON']['output']>
  extensions: Array<ContentExtension>
  followersCount?: Maybe<Scalars['Int']['output']>
  format?: Maybe<Scalars['String']['output']>
  hidden: Scalars['Boolean']['output']
  hiddenRepliesCount?: Maybe<Scalars['Int']['output']>
  id: Scalars['String']['output']
  image?: Maybe<Scalars['String']['output']>
  inReplyToKind?: Maybe<InReplyToKind>
  inReplyToPost?: Maybe<Post>
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
  space?: Maybe<Space>
  summary?: Maybe<Scalars['String']['output']>
  tagsOriginal?: Maybe<Scalars['String']['output']>
  timestamp?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
  tweetId?: Maybe<Scalars['String']['output']>
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>
  upvotesCount?: Maybe<Scalars['Int']['output']>
  uuid?: Maybe<Scalars['String']['output']>
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

export type Query = {
  __typename?: 'Query'
  activeStakingAccountActivityMetricsForFixedPeriod: AccountActivityMetricsForFixedPeriodResponseDto
  activeStakingAddressRankByRewardsForPeriod?: Maybe<AddressRankByRewardsForPeriodResponseDto>
  activeStakingAddressesRankedByRewardsForPeriod: AddressesRankedByRewardsForPeriodResponseDto
  activeStakingCanDoSuperLikeByPost: Array<CanDoSuperLikeByPostsResponseDto>
  activeStakingCreatorsRankedBySuperLikesForPeriod: Array<AddressRankedBySuperLikesForPeriodResponseDto>
  activeStakingDailyStatsByStaker: DailyStatsByStakerResponse
  activeStakingDateDetails: DateTimeDetailsResponseDto
  activeStakingIsActiveStaker: Scalars['Boolean']['output']
  activeStakingRankedPostIdsByActiveStakingActivity: RankedPostIdsByActiveStakingActivityResponse
  activeStakingRewardsByPosts: Array<RewardsByPostsResponseDto>
  activeStakingRewardsByWeek: Array<TotalRewardsByWeekResponse>
  activeStakingRewardsReportByWeek: Array<ActiveStakingRewardsReport>
  activeStakingStakersRankedBySuperLikesForPeriod: Array<AddressRankedBySuperLikesForPeriodResponseDto>
  activeStakingSuperLikeCountsByDate: SuperLikeCountsByDateWithTotalResponseDto
  activeStakingSuperLikeCountsByPost: Array<SuperLikeCountsByPostResponse>
  activeStakingSuperLikeCountsByStaker: Array<SuperLikeCountsByStakerResponse>
  activeStakingSuperLikes: SuperLikesResponseDto
  activeStakingSuperLikesNumberGoal: Scalars['Int']['output']
  activeStakingTotalActivityMetricsForFixedPeriod: TotalActivityMetricsForFixedPeriodResponseDto
  findPosts: FindPostsResponseDto
  linkedIdentities: Array<LinkedIdentity>
  moderationBlockedResourceIds: Array<Scalars['String']['output']>
  moderationBlockedResourceIdsBatch: BlockedResourceIdsBatchResponse
  moderationBlockedResourcesDetailed: Array<ModerationBlockedResource>
  moderationModerator?: Maybe<Moderator>
  moderationOrganization?: Maybe<ModerationOrganization>
  moderationOrganizations?: Maybe<Array<ModerationOrganization>>
  moderationReason: ModerationBlockReason
  moderationReasonsAll: Array<ModerationBlockReason>
  moderators?: Maybe<ModeratorsResponse>
  postMetadata: Array<PostMetadataResponse>
  posts: FindPostsResponseDto
  socialProfiles: SocialProfilesResponse
  unreadMessages: Array<UnreadPostsCountResponse>
}

export type QueryActiveStakingAccountActivityMetricsForFixedPeriodArgs = {
  args: AccountActivityMetricsForFixedPeriodInput
}

export type QueryActiveStakingAddressRankByRewardsForPeriodArgs = {
  args: AddressRankByRewardsForPeriodInput
}

export type QueryActiveStakingAddressesRankedByRewardsForPeriodArgs = {
  args: AddressesRankedByRewardsForPeriodInput
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

export type QueryFindPostsArgs = {
  where: FindPostsArgs
}

export type QueryLinkedIdentitiesArgs = {
  where: LinkedIdentitiesArgs
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
  where: FindPostsArgs
}

export type QuerySocialProfilesArgs = {
  args: SocialProfileInput
}

export type QueryUnreadMessagesArgs = {
  where: UnreadMessagesInput
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

export type RewardByPostItemDto = {
  __typename?: 'RewardByPostItemDto'
  amount: Scalars['String']['output']
  postId: Scalars['String']['output']
  postPerstentId: Scalars['String']['output']
  superLikeId: Scalars['String']['output']
}

export type RewardsByPostsInput = {
  postIds?: InputMaybe<Array<Scalars['String']['input']>>
  postPersistentIds?: InputMaybe<Array<Scalars['String']['input']>>
}

export type RewardsByPostsResponseDto = {
  __typename?: 'RewardsByPostsResponseDto'
  /** @deprecated rewardTotal field must be used */
  amount: Scalars['String']['output']
  /** @deprecated draftRewardTotal field must be used */
  draftReward: Scalars['String']['output']
  draftRewardTotal: Scalars['String']['output']
  draftRewardsBySource?: Maybe<PostRewardsBySourceResponseDto>
  persistentPostId?: Maybe<Scalars['String']['output']>
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
  amount: Scalars['String']['output']
  decimals: Scalars['Int']['output']
  roles: Array<Scalars['String']['output']>
}

export enum SocialEventDataType {
  OffChain = 'offChain',
  Optimistic = 'optimistic',
  Persistent = 'persistent',
}

export type SocialProfile = {
  __typename?: 'SocialProfile'
  account: Account
  id: Scalars['String']['output']
  referrersList?: Maybe<Array<UserReferrerDetail>>
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
  email?: Maybe<Scalars['String']['output']>
  experimental?: Maybe<Scalars['JSON']['output']>
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
  ownedByAccount: Account
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
  earnedTotal?: Maybe<Scalars['String']['output']>
  likedCreators?: Maybe<Scalars['Int']['output']>
  likedPosts?: Maybe<Scalars['Int']['output']>
  likedPostsByDay?: Maybe<Array<LikedPostsCountByDayItem>>
}

export type StakerActivityMetricsForFixedPeriodInput = {
  earnedByPeriod?: InputMaybe<Scalars['Boolean']['input']>
  earnedByPeriodRankPosition?: InputMaybe<Scalars['Boolean']['input']>
  earnedTotal?: InputMaybe<Scalars['Boolean']['input']>
  earnedTotalRankPosition?: InputMaybe<Scalars['Boolean']['input']>
  likedCreators?: InputMaybe<Scalars['Boolean']['input']>
  likedCreatorsRankPosition?: InputMaybe<Scalars['Boolean']['input']>
  likedPosts?: InputMaybe<Scalars['Boolean']['input']>
  likedPostsByDay?: InputMaybe<Scalars['Boolean']['input']>
  likedPostsRankPosition?: InputMaybe<Scalars['Boolean']['input']>
}

export type Subscription = {
  __typename?: 'Subscription'
  activeStakingSuperLike: SuperLikeSubscriptionPayload
  linkedIdentity: LinkedIdentitySubscriptionPayload
  moderationBlockedResource: ModerationBlockedResourceSubscriptionPayload
  moderationModerator: ModeratorSubscriptionPayload
  moderationOrganization: ModerationOrganizationSubscriptionPayload
  post: PostSubscriptionPayload
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
}

export type SuperLikesCreatorRewards = {
  __typename?: 'SuperLikesCreatorRewards'
  posts: Array<SuperLikesCreatorRewardsByPost>
  rewardsBySource?: Maybe<PostRewardsBySourceResponseDto>
  total: Scalars['String']['output']
}

export type SuperLikesCreatorRewardsByPost = {
  __typename?: 'SuperLikesCreatorRewardsByPost'
  /** @deprecated Should be used totalAmount instead. */
  amount: Scalars['String']['output']
  directSuperLikesCount: Scalars['Int']['output']
  postId: Scalars['String']['output']
  postPersistentId: Scalars['String']['output']
  rewardsBySource?: Maybe<PostRewardsBySourceResponseDto>
  sharedSuperLikesCount: Scalars['Int']['output']
  superLikesCount: Scalars['Int']['output']
  totalAmount: Scalars['String']['output']
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

export type TotalActivityMetricsForFixedPeriodInput = {
  creatorEarnedTotal?: InputMaybe<Scalars['Boolean']['input']>
  likedCreatorsCount?: InputMaybe<Scalars['Boolean']['input']>
  likedPostsCount?: InputMaybe<Scalars['Boolean']['input']>
  period?: InputMaybe<ActiveStakingPeriod>
  periodValue?: InputMaybe<Scalars['String']['input']>
  stakersEarnedTotal?: InputMaybe<Scalars['Boolean']['input']>
  superLikesTotalCountTotal?: InputMaybe<Scalars['Boolean']['input']>
}

export type TotalActivityMetricsForFixedPeriodResponseDto = {
  __typename?: 'TotalActivityMetricsForFixedPeriodResponseDto'
  creatorEarnedTotal?: Maybe<Scalars['String']['output']>
  likedCreatorsCount?: Maybe<Scalars['Int']['output']>
  likedPostsCount?: Maybe<Scalars['Int']['output']>
  stakersEarnedTotal?: Maybe<Scalars['String']['output']>
  superLikesTotalCountTotal?: Maybe<Scalars['Int']['output']>
}

export type TotalRewardsByWeekResponse = {
  __typename?: 'TotalRewardsByWeekResponse'
  creator: SuperLikesCreatorRewards
  staker: Scalars['String']['output']
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

export type UserReferrerDetail = {
  __typename?: 'UserReferrerDetail'
  clientId: DataHubClientId
  id: Scalars['String']['output']
  referrerId: Scalars['String']['output']
  socialProfile: SocialProfile
  timestamp: Scalars['String']['output']
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
    persistentPostId?: string | null
    rewardTotal: string
    draftRewardTotal: string
    rewardsBySource?: {
      __typename?: 'PostRewardsBySourceResponseDto'
      fromDirectSuperLikes?: string | null
      fromCommentSuperLikes?: string | null
      fromShareSuperLikes?: string | null
    } | null
    draftRewardsBySource?: {
      __typename?: 'PostRewardsBySourceResponseDto'
      fromDirectSuperLikes?: string | null
      fromCommentSuperLikes?: string | null
      fromShareSuperLikes?: string | null
    } | null
  }>
}

export type SubscribeSuperLikeSubscriptionVariables = Exact<{
  [key: string]: never
}>

export type SubscribeSuperLikeSubscription = {
  __typename?: 'Subscription'
  activeStakingSuperLike: {
    __typename?: 'SuperLikeSubscriptionPayload'
    event: DataHubSubscriptionEventEnum
    entity: {
      __typename?: 'ActiveStakingSuperLike'
      staker: { __typename?: 'Account'; id: string }
      post: { __typename?: 'Post'; persistentId?: string | null }
    }
  }
}

export type GetLinkedIdentitiesQueryVariables = Exact<{
  substrateAddress: Scalars['String']['input']
}>

export type GetLinkedIdentitiesQuery = {
  __typename?: 'Query'
  linkedIdentities: Array<{
    __typename?: 'LinkedIdentity'
    id: string
    externalId: string
    provider: IdentityProvider
    enabled: boolean
    substrateAccount: { __typename?: 'Account'; id: string }
  }>
}

export type GetLinkedIdentitiesFromTwitterIdQueryVariables = Exact<{
  twitterId: Scalars['String']['input']
}>

export type GetLinkedIdentitiesFromTwitterIdQuery = {
  __typename?: 'Query'
  linkedIdentities: Array<{
    __typename?: 'LinkedIdentity'
    id: string
    externalId: string
    provider: IdentityProvider
    enabled: boolean
    substrateAccount: { __typename?: 'Account'; id: string }
  }>
}

export type SubscribeIdentitySubscriptionVariables = Exact<{
  [key: string]: never
}>

export type SubscribeIdentitySubscription = {
  __typename?: 'Subscription'
  linkedIdentity: {
    __typename?: 'LinkedIdentitySubscriptionPayload'
    event: DataHubSubscriptionEventEnum
    entity: {
      __typename?: 'LinkedIdentity'
      substrateAccount: { __typename?: 'Account'; id: string }
    }
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
    byCtxSpaceIds: Array<{
      __typename?: 'BlockedResourceIdsBatchItem'
      id: string
      blockedResourceIds: Array<string>
    }>
    byCtxPostIds: Array<{
      __typename?: 'BlockedResourceIdsBatchItem'
      id: string
      blockedResourceIds: Array<string>
    }>
    byCtxAppIds: Array<{
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
          substrateAccount: { __typename?: 'Account'; id: string }
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
  optimisticId?: string | null
  dataType: DataType
  content?: string | null
  createdAtBlock?: number | null
  createdAtTime?: any | null
  title?: string | null
  body?: string | null
  summary?: string | null
  isShowMore: boolean
  image?: string | null
  link?: string | null
  hidden: boolean
  persistentId?: string | null
  blockchainSyncFailed: boolean
  isComment: boolean
  kind: PostKind
  updatedAtTime?: any | null
  canonical?: string | null
  tagsOriginal?: string | null
  followersCount?: number | null
  inReplyToKind?: InReplyToKind | null
  createdByAccount: { __typename?: 'Account'; id: string }
  ownedByAccount: { __typename?: 'Account'; id: string }
  space?: { __typename?: 'Space'; id: string } | null
  rootPost?: {
    __typename?: 'Post'
    persistentId?: string | null
    space?: { __typename?: 'Space'; id: string } | null
  } | null
  inReplyToPost?: { __typename?: 'Post'; persistentId?: string | null } | null
  extensions: Array<{
    __typename?: 'ContentExtension'
    image?: string | null
    amount?: string | null
    chain?: string | null
    collectionId?: string | null
    decimals?: number | null
    extensionSchemaId: ContentExtensionSchemaId
    id: string
    nftId?: string | null
    token?: string | null
    txHash?: string | null
    message?: string | null
    nonce?: string | null
    url?: string | null
    recipient?: { __typename?: 'Account'; id: string } | null
    fromEvm?: { __typename?: 'EvmAccount'; id: string } | null
    toEvm?: { __typename?: 'EvmAccount'; id: string } | null
    fromSubstrate?: { __typename?: 'Account'; id: string } | null
    toSubstrate?: { __typename?: 'Account'; id: string } | null
    pinnedResources?: Array<{
      __typename?: 'ExtensionPinnedResource'
      post?: {
        __typename?: 'Post'
        id: string
        persistentId?: string | null
      } | null
    }> | null
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
  findPosts: {
    __typename?: 'FindPostsResponseDto'
    data: Array<{
      __typename?: 'Post'
      id: string
      optimisticId?: string | null
      dataType: DataType
      content?: string | null
      createdAtBlock?: number | null
      createdAtTime?: any | null
      title?: string | null
      body?: string | null
      summary?: string | null
      isShowMore: boolean
      image?: string | null
      link?: string | null
      hidden: boolean
      persistentId?: string | null
      blockchainSyncFailed: boolean
      isComment: boolean
      kind: PostKind
      updatedAtTime?: any | null
      canonical?: string | null
      tagsOriginal?: string | null
      followersCount?: number | null
      inReplyToKind?: InReplyToKind | null
      createdByAccount: { __typename?: 'Account'; id: string }
      ownedByAccount: { __typename?: 'Account'; id: string }
      space?: { __typename?: 'Space'; id: string } | null
      rootPost?: {
        __typename?: 'Post'
        persistentId?: string | null
        space?: { __typename?: 'Space'; id: string } | null
      } | null
      inReplyToPost?: {
        __typename?: 'Post'
        persistentId?: string | null
      } | null
      extensions: Array<{
        __typename?: 'ContentExtension'
        image?: string | null
        amount?: string | null
        chain?: string | null
        collectionId?: string | null
        decimals?: number | null
        extensionSchemaId: ContentExtensionSchemaId
        id: string
        nftId?: string | null
        token?: string | null
        txHash?: string | null
        message?: string | null
        nonce?: string | null
        url?: string | null
        recipient?: { __typename?: 'Account'; id: string } | null
        fromEvm?: { __typename?: 'EvmAccount'; id: string } | null
        toEvm?: { __typename?: 'EvmAccount'; id: string } | null
        fromSubstrate?: { __typename?: 'Account'; id: string } | null
        toSubstrate?: { __typename?: 'Account'; id: string } | null
        pinnedResources?: Array<{
          __typename?: 'ExtensionPinnedResource'
          post?: {
            __typename?: 'Post'
            id: string
            persistentId?: string | null
          } | null
        }> | null
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
  findPosts: {
    __typename?: 'FindPostsResponseDto'
    data: Array<{
      __typename?: 'Post'
      id: string
      optimisticId?: string | null
      dataType: DataType
      content?: string | null
      createdAtBlock?: number | null
      createdAtTime?: any | null
      title?: string | null
      body?: string | null
      summary?: string | null
      isShowMore: boolean
      image?: string | null
      link?: string | null
      hidden: boolean
      persistentId?: string | null
      blockchainSyncFailed: boolean
      isComment: boolean
      kind: PostKind
      updatedAtTime?: any | null
      canonical?: string | null
      tagsOriginal?: string | null
      followersCount?: number | null
      inReplyToKind?: InReplyToKind | null
      createdByAccount: { __typename?: 'Account'; id: string }
      ownedByAccount: { __typename?: 'Account'; id: string }
      space?: { __typename?: 'Space'; id: string } | null
      rootPost?: {
        __typename?: 'Post'
        persistentId?: string | null
        space?: { __typename?: 'Space'; id: string } | null
      } | null
      inReplyToPost?: {
        __typename?: 'Post'
        persistentId?: string | null
      } | null
      extensions: Array<{
        __typename?: 'ContentExtension'
        image?: string | null
        amount?: string | null
        chain?: string | null
        collectionId?: string | null
        decimals?: number | null
        extensionSchemaId: ContentExtensionSchemaId
        id: string
        nftId?: string | null
        token?: string | null
        txHash?: string | null
        message?: string | null
        nonce?: string | null
        url?: string | null
        recipient?: { __typename?: 'Account'; id: string } | null
        fromEvm?: { __typename?: 'EvmAccount'; id: string } | null
        toEvm?: { __typename?: 'EvmAccount'; id: string } | null
        fromSubstrate?: { __typename?: 'Account'; id: string } | null
        toSubstrate?: { __typename?: 'Account'; id: string } | null
        pinnedResources?: Array<{
          __typename?: 'ExtensionPinnedResource'
          post?: {
            __typename?: 'Post'
            id: string
            persistentId?: string | null
          } | null
        }> | null
      }>
    }>
  }
}

export type GetCommentIdsInPostIdQueryVariables = Exact<{
  where: FindPostsArgs
}>

export type GetCommentIdsInPostIdQuery = {
  __typename?: 'Query'
  findPosts: {
    __typename?: 'FindPostsResponseDto'
    total?: number | null
    data: Array<{
      __typename?: 'Post'
      id: string
      persistentId?: string | null
      optimisticId?: string | null
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
      rootPost?: { __typename?: 'Post'; persistentId?: string | null } | null
    }
  }
}

export const DatahubPostFragment = gql`
  fragment DatahubPostFragment on Post {
    id
    optimisticId
    dataType
    content
    createdAtBlock
    createdAtTime
    createdByAccount {
      id
    }
    title
    body
    summary
    isShowMore
    image
    link
    hidden
    persistentId
    blockchainSyncFailed
    isComment
    kind
    updatedAtTime
    canonical
    tagsOriginal
    followersCount
    ownedByAccount {
      id
    }
    space {
      id
    }
    rootPost {
      persistentId
      space {
        id
      }
    }
    inReplyToKind
    inReplyToPost {
      persistentId
    }
    extensions {
      image
      amount
      chain
      collectionId
      decimals
      extensionSchemaId
      id
      nftId
      token
      txHash
      message
      recipient {
        id
      }
      nonce
      url
      fromEvm {
        id
      }
      toEvm {
        id
      }
      fromSubstrate {
        id
      }
      toSubstrate {
        id
      }
      pinnedResources {
        post {
          id
          persistentId
        }
      }
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
      persistentPostId
      rewardTotal
      draftRewardTotal
      rewardsBySource {
        fromDirectSuperLikes
        fromCommentSuperLikes
        fromShareSuperLikes
      }
      draftRewardsBySource {
        fromDirectSuperLikes
        fromCommentSuperLikes
        fromShareSuperLikes
      }
    }
  }
`
export const SubscribeSuperLike = gql`
  subscription SubscribeSuperLike {
    activeStakingSuperLike {
      event
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
export const GetLinkedIdentities = gql`
  query GetLinkedIdentities($substrateAddress: String!) {
    linkedIdentities(where: { substrateAddress: $substrateAddress }) {
      id
      externalId
      provider
      enabled
      substrateAccount {
        id
      }
    }
  }
`
export const GetLinkedIdentitiesFromTwitterId = gql`
  query GetLinkedIdentitiesFromTwitterId($twitterId: String!) {
    linkedIdentities(where: { externalId: $twitterId, provider: TWITTER }) {
      id
      externalId
      provider
      enabled
      substrateAccount {
        id
      }
    }
  }
`
export const SubscribeIdentity = gql`
  subscription SubscribeIdentity {
    linkedIdentity {
      event
      entity {
        substrateAccount {
          id
        }
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
      byCtxSpaceIds {
        id
        blockedResourceIds
      }
      byCtxPostIds {
        id
        blockedResourceIds
      }
      byCtxAppIds {
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
export const SubscribeOrganization = gql`
  subscription SubscribeOrganization {
    moderationOrganization {
      event
      entity {
        organizationModerators {
          moderator {
            substrateAccount {
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
    findPosts(where: { persistentIds: $ids, pageSize: $pageSize }) {
      data {
        ...DatahubPostFragment
      }
    }
  }
  ${DatahubPostFragment}
`
export const GetOptimisticPosts = gql`
  query GetOptimisticPosts($ids: [String!]) {
    findPosts(where: { ids: $ids }) {
      data {
        ...DatahubPostFragment
      }
    }
  }
  ${DatahubPostFragment}
`
export const GetCommentIdsInPostId = gql`
  query GetCommentIdsInPostId($where: FindPostsArgs!) {
    findPosts(where: $where) {
      data {
        id
        persistentId
        optimisticId
      }
      total
    }
  }
`
export const GetPostMetadata = gql`
  query GetPostMetadata($where: PostMetadataInput!) {
    postMetadata(where: $where) {
      totalCommentsCount
      latestComment {
        id
        persistentId
        rootPostPersistentId
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
export const SubscribePost = gql`
  subscription SubscribePost {
    post {
      event
      entity {
        id
        persistentId
        optimisticId
        dataType
        rootPost {
          persistentId
        }
      }
    }
  }
`
