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
  DateTime: { input: any; output: any }
  JSON: { input: any; output: any }
}

export type Account = {
  __typename?: 'Account'
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
  linkedAccountsAccounts: Array<EvmSubstrateAccountLink>
  ownedPostsCount?: Maybe<Scalars['Int']['output']>
  /** persistent data schema version from indexer */
  persistentDataVersion?: Maybe<Scalars['String']['output']>
  postsCreated: Array<Post>
  postsOwned: Array<Post>
  profileSpace?: Maybe<Space>
  spacesCreated: Array<Space>
  spacesOwned: Array<Space>
}

export type AccountFollowers = {
  __typename?: 'AccountFollowers'
  dataType: DataType
  followerAccount: Account
  followingAccount: Account
  id: Scalars['String']['output']
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

export enum DataHubSubscriptionEventEnum {
  EvmAddressLinkedToAccount = 'EVM_ADDRESS_LINKED_TO_ACCOUNT',
  EvmAddressLinkedToAccountOptimistic = 'EVM_ADDRESS_LINKED_TO_ACCOUNT_OPTIMISTIC',
  EvmAddressLinkedToAccountPersistent = 'EVM_ADDRESS_LINKED_TO_ACCOUNT_PERSISTENT',
  EvmAddressLinkToAccountStateUpdated = 'EVM_ADDRESS_LINK_TO_ACCOUNT_STATE_UPDATED',
  EvmAddressUnlinkedToAccountOptimistic = 'EVM_ADDRESS_UNLINKED_TO_ACCOUNT_OPTIMISTIC',
  EvmAddressUnlinkedToAccountPersistent = 'EVM_ADDRESS_UNLINKED_TO_ACCOUNT_PERSISTENT',
  PostCreated = 'POST_CREATED',
  PostCreatedOptimistic = 'POST_CREATED_OPTIMISTIC',
  PostCreatedPersistent = 'POST_CREATED_PERSISTENT',
  PostFollowed = 'POST_FOLLOWED',
  PostFollowedOptimistic = 'POST_FOLLOWED_OPTIMISTIC',
  PostFollowedPersistent = 'POST_FOLLOWED_PERSISTENT',
  PostFollowStateUpdated = 'POST_FOLLOW_STATE_UPDATED',
  PostStateUpdated = 'POST_STATE_UPDATED',
  PostUnfollowedOptimistic = 'POST_UNFOLLOWED_OPTIMISTIC',
  PostUnfollowedPersistent = 'POST_UNFOLLOWED_PERSISTENT',
  PostUpdatedOptimistic = 'POST_UPDATED_OPTIMISTIC',
  PostUpdatedPersistent = 'POST_UPDATED_PERSISTENT',
}

export enum DataType {
  OffChain = 'offChain',
  Optimistic = 'optimistic',
  Persistent = 'persistent',
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
  dataType?: InputMaybe<SocialEventDataType>
  ids?: InputMaybe<Array<Scalars['String']['input']>>
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

export type IdTimestampPair = {
  id: Scalars['String']['input']
  timestamp_gt: Scalars['String']['input']
}

export enum InReplyToKind {
  Post = 'Post',
}

export enum PinnedResourceType {
  Post = 'Post',
  Space = 'Space',
}

export type Post = {
  __typename?: 'Post'
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
  offChainId?: Maybe<Scalars['String']['output']>
  optimisticId?: Maybe<Scalars['String']['output']>
  ownedByAccount: Account
  parentPost?: Maybe<Post>
  /** persistent data schema version from indexer */
  persistentDataVersion?: Maybe<Scalars['String']['output']>
  persistentId?: Maybe<Scalars['String']['output']>
  pinnedByExtensions?: Maybe<Array<ExtensionPinnedResource>>
  postFollowers?: Maybe<Array<PostFollowers>>
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
  findPosts: FindPostsResponseDto
  postMetadata: Array<PostMetadataResponse>
  posts: Array<Post>
  unreadMessages: Array<UnreadPostsCountResponse>
}

export type QueryFindPostsArgs = {
  where: FindPostsArgs
}

export type QueryPostMetadataArgs = {
  where: PostMetadataInput
}

export type QueryPostsArgs = {
  where: FindPostsArgs
}

export type QueryUnreadMessagesArgs = {
  where: UnreadMessagesInput
}

export enum QueryOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}

export enum SocialEventDataType {
  OffChain = 'offChain',
  Optimistic = 'optimistic',
  Persistent = 'persistent',
}

export type Space = {
  __typename?: 'Space'
  /** space body */
  about?: Maybe<Scalars['String']['output']>
  /** is off-chain data CID backed up in blockchain */
  backupInBlockchain?: Maybe<Scalars['Boolean']['output']>
  /** content CID */
  content?: Maybe<Scalars['String']['output']>
  createdAtBlock?: Maybe<Scalars['Int']['output']>
  createdAtTime?: Maybe<Scalars['DateTime']['output']>
  createdByAccount: Account
  dataType: DataType
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
  offChainId?: Maybe<Scalars['String']['output']>
  optimisticId?: Maybe<Scalars['String']['output']>
  ownedByAccount: Account
  /** persistent data schema version from indexer */
  persistentDataVersion?: Maybe<Scalars['String']['output']>
  persistentId?: Maybe<Scalars['String']['output']>
  pinnedByExtensions?: Maybe<Array<ExtensionPinnedResource>>
  posts?: Maybe<Post>
  postsCount?: Maybe<Scalars['Int']['output']>
  profileSource?: Maybe<Scalars['String']['output']>
  profileSpace?: Maybe<Account>
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

export type Subscription = {
  __typename?: 'Subscription'
  post: PostSubscriptionPayload
}

export type UnreadMessagesInput = {
  idTimestampPairs: Array<IdTimestampPair>
}

export type UnreadPostsCountResponse = {
  __typename?: 'UnreadPostsCountResponse'
  id: Scalars['String']['output']
  unreadCount: Scalars['Int']['output']
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
  space?: { __typename?: 'Space'; persistentId?: string | null } | null
  rootPost?: {
    __typename?: 'Post'
    persistentId?: string | null
    space?: { __typename?: 'Space'; persistentId?: string | null } | null
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
      space?: { __typename?: 'Space'; persistentId?: string | null } | null
      rootPost?: {
        __typename?: 'Post'
        persistentId?: string | null
        space?: { __typename?: 'Space'; persistentId?: string | null } | null
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
      space?: { __typename?: 'Space'; persistentId?: string | null } | null
      rootPost?: {
        __typename?: 'Post'
        persistentId?: string | null
        space?: { __typename?: 'Space'; persistentId?: string | null } | null
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
      persistentId
    }
    rootPost {
      persistentId
      space {
        persistentId
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
      pinnedResources {
        post {
          id
          persistentId
        }
      }
    }
  }
`
export const GetPosts = gql`
  query GetPosts($ids: [String!], $pageSize: Int!) {
    findPosts(where: { persistentIds: $ids }) {
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
