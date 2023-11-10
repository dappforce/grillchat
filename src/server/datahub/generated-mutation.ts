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
  JSON: { input: any; output: any }
}

export type CanAccountDoArgsInput = {
  action: CanUserDoAction
  address: Scalars['String']['input']
  parentPostId?: InputMaybe<Scalars['String']['input']>
  rootPostId?: InputMaybe<Scalars['String']['input']>
  spaceId?: InputMaybe<Scalars['String']['input']>
}

export type CanAccountDoResponse = {
  __typename?: 'CanAccountDoResponse'
  isAllowed: Scalars['Boolean']['output']
}

export enum CanUserDoAction {
  CreateComment = 'CREATE_COMMENT',
  CreatePost = 'CREATE_POST',
}

export type CreatePostOffChainInput = {
  callData?: InputMaybe<SocialCallDataInput>
  content?: InputMaybe<Scalars['String']['input']>
  dataType: SocialEventDataType
  protVersion?: InputMaybe<Scalars['String']['input']>
  providerAddr: Scalars['String']['input']
  sig: Scalars['String']['input']
}

export type CreatePostOptimisticInput = {
  callData?: InputMaybe<SocialCallDataInput>
  content?: InputMaybe<Scalars['String']['input']>
  dataType: SocialEventDataType
  protVersion?: InputMaybe<Scalars['String']['input']>
  providerAddr: Scalars['String']['input']
  sig: Scalars['String']['input']
}

export enum DataType {
  OffChain = 'offChain',
  Optimistic = 'optimistic',
  Persistent = 'persistent',
}

export type FindSocialEventsArgs = {
  dataType?: InputMaybe<SocialEventDataType>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<QueryOrder>
  pageSize?: InputMaybe<Scalars['Int']['input']>
  queueJobIds?: InputMaybe<Array<Scalars['String']['input']>>
  signers?: InputMaybe<Array<Scalars['String']['input']>>
  timestampGte?: InputMaybe<Scalars['BigInt']['input']>
  unixTimestamp?: InputMaybe<Scalars['BigInt']['input']>
}

export type FindSocialEventsResponseDto = {
  __typename?: 'FindSocialEventsResponseDto'
  data: Array<SocialEventRecoveryData>
  offset?: Maybe<Scalars['Int']['output']>
  pageSize?: Maybe<Scalars['Int']['output']>
  total?: Maybe<Scalars['Int']['output']>
}

export type IngestDataResponseDto = {
  __typename?: 'IngestDataResponseDto'
  message?: Maybe<Scalars['String']['output']>
  processed: Scalars['Boolean']['output']
}

export type IngestPersistentDataFromSquidInputDto = {
  socialEvents: Array<PersistentDataItemFromSquid>
}

export type IngestPersistentDataFromSquidResponseDto = {
  __typename?: 'IngestPersistentDataFromSquidResponseDto'
  message?: Maybe<Scalars['String']['output']>
  processed: Scalars['Boolean']['output']
}

export type LatestColdSocialEventArgsDto = {
  dataType?: InputMaybe<SocialEventDataType>
  queueStatus?: InputMaybe<QueueJobStatus>
}

export type Mutation = {
  __typename?: 'Mutation'
  createPostOffChain: IngestDataResponseDto
  createPostOptimistic: IngestDataResponseDto
  ingestPersistentDataSquid: IngestPersistentDataFromSquidResponseDto
  updatePostBlockchainSyncStatus: IngestDataResponseDto
  updatePostOptimistic: IngestDataResponseDto
}

export type MutationCreatePostOffChainArgs = {
  createPostOffChainInput: CreatePostOffChainInput
}

export type MutationCreatePostOptimisticArgs = {
  createPostOptimisticInput: CreatePostOptimisticInput
}

export type MutationIngestPersistentDataSquidArgs = {
  ingestPersistentDataSquidInput: IngestPersistentDataFromSquidInputDto
}

export type MutationUpdatePostBlockchainSyncStatusArgs = {
  updatePostBlockchainSyncStatusInput: UpdatePostBlockchainSyncStatusInput
}

export type MutationUpdatePostOptimisticArgs = {
  updatePostOptimisticInput: UpdatePostOptimisticInput
}

export type PersistentDataItemFromSquid = {
  blockNumber: Scalars['Int']['input']
  /** Stringified JSON with social event data */
  dataStr: Scalars['String']['input']
  id: Scalars['String']['input']
}

export type Query = {
  __typename?: 'Query'
  canAccountDo: CanAccountDoResponse
  coldSocialEvents: FindSocialEventsResponseDto
  latestColdSocialEvent?: Maybe<SocialEventRecoveryData>
  pingPong: Scalars['String']['output']
}

export type QueryCanAccountDoArgs = {
  args: CanAccountDoArgsInput
}

export type QueryColdSocialEventsArgs = {
  where: FindSocialEventsArgs
}

export type QueryLatestColdSocialEventArgs = {
  where: LatestColdSocialEventArgsDto
}

export enum QueryOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}

export enum QueueJobStatus {
  Active = 'ACTIVE',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Waiting = 'WAITING',
}

export type SocialCallDataInput = {
  /** Stringified JSON with call arguments */
  args?: InputMaybe<Scalars['String']['input']>
  name: SocialCallName
  /** Proxy of call signer address */
  proxy?: InputMaybe<Scalars['String']['input']>
  /** Call signer address */
  signer: Scalars['String']['input']
  /** Unix timestamp of the call */
  timestamp?: InputMaybe<Scalars['BigInt']['input']>
  /** UUID of the call */
  uuid?: InputMaybe<Scalars['String']['input']>
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
  MovePost = 'move_post',
  SynthCreatePostTxFailed = 'synth_create_post_tx_failed',
  SynthCreatePostTxRetry = 'synth_create_post_tx_retry',
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

export type SocialEventRecoveryData = {
  __typename?: 'SocialEventRecoveryData'
  data: Scalars['JSON']['output']
  dataType: DataType
  id: Scalars['String']['output']
  protVersion: Scalars['String']['output']
  queueJobId: Scalars['String']['output']
  signer: Scalars['String']['output']
  unixTimestamp: Scalars['BigInt']['output']
  uuid?: Maybe<Scalars['String']['output']>
}

export type UpdatePostBlockchainSyncStatusInput = {
  callData: SocialCallDataInput
  dataType: SocialEventDataType
  protVersion?: InputMaybe<Scalars['String']['input']>
  providerAddr: Scalars['String']['input']
  sig: Scalars['String']['input']
}

export type UpdatePostOptimisticInput = {
  callData?: InputMaybe<SocialCallDataInput>
  content?: InputMaybe<Scalars['String']['input']>
  dataType: SocialEventDataType
  protVersion?: InputMaybe<Scalars['String']['input']>
  providerAddr: Scalars['String']['input']
  sig: Scalars['String']['input']
}

export type GetCanAccountDoQueryVariables = Exact<{
  getAccountDo: CanAccountDoArgsInput
}>

export type GetCanAccountDoQuery = {
  __typename?: 'Query'
  canAccountDo: { __typename?: 'CanAccountDoResponse'; isAllowed: boolean }
}

export type CreatePostOptimisticMutationVariables = Exact<{
  createPostOptimisticInput: CreatePostOptimisticInput
}>

export type CreatePostOptimisticMutation = {
  __typename?: 'Mutation'
  createPostOptimistic: {
    __typename?: 'IngestDataResponseDto'
    message?: string | null
  }
}

export type UpdatePostOptimisticMutationVariables = Exact<{
  updatePostOptimisticInput: UpdatePostOptimisticInput
}>

export type UpdatePostOptimisticMutation = {
  __typename?: 'Mutation'
  updatePostOptimistic: {
    __typename?: 'IngestDataResponseDto'
    message?: string | null
  }
}

export type NotifyCreatePostTxFailedOrRetryStatusMutationVariables = Exact<{
  updatePostBlockchainSyncStatusInput: UpdatePostBlockchainSyncStatusInput
}>

export type NotifyCreatePostTxFailedOrRetryStatusMutation = {
  __typename?: 'Mutation'
  updatePostBlockchainSyncStatus: {
    __typename?: 'IngestDataResponseDto'
    message?: string | null
  }
}

export type NotifyUpdatePostTxFailedOrRetryStatusMutationVariables = Exact<{
  updatePostBlockchainSyncStatusInput: UpdatePostBlockchainSyncStatusInput
}>

export type NotifyUpdatePostTxFailedOrRetryStatusMutation = {
  __typename?: 'Mutation'
  updatePostBlockchainSyncStatus: {
    __typename?: 'IngestDataResponseDto'
    message?: string | null
  }
}

export const GetCanAccountDo = gql`
  query GetCanAccountDo($getAccountDo: CanAccountDoArgsInput!) {
    canAccountDo(args: $getAccountDo) {
      isAllowed
    }
  }
`
export const CreatePostOptimistic = gql`
  mutation CreatePostOptimistic(
    $createPostOptimisticInput: CreatePostOptimisticInput!
  ) {
    createPostOptimistic(
      createPostOptimisticInput: $createPostOptimisticInput
    ) {
      message
    }
  }
`
export const UpdatePostOptimistic = gql`
  mutation UpdatePostOptimistic(
    $updatePostOptimisticInput: UpdatePostOptimisticInput!
  ) {
    updatePostOptimistic(
      updatePostOptimisticInput: $updatePostOptimisticInput
    ) {
      message
    }
  }
`
export const NotifyCreatePostTxFailedOrRetryStatus = gql`
  mutation NotifyCreatePostTxFailedOrRetryStatus(
    $updatePostBlockchainSyncStatusInput: UpdatePostBlockchainSyncStatusInput!
  ) {
    updatePostBlockchainSyncStatus(
      updatePostBlockchainSyncStatusInput: $updatePostBlockchainSyncStatusInput
    ) {
      message
    }
  }
`
export const NotifyUpdatePostTxFailedOrRetryStatus = gql`
  mutation NotifyUpdatePostTxFailedOrRetryStatus(
    $updatePostBlockchainSyncStatusInput: UpdatePostBlockchainSyncStatusInput!
  ) {
    updatePostBlockchainSyncStatus(
      updatePostBlockchainSyncStatusInput: $updatePostBlockchainSyncStatusInput
    ) {
      message
    }
  }
`
