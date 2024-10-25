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
  JSON: { input: any; output: any; }
};

export type ActiveStakingConfirmationMessageResponse = {
  __typename?: 'ActiveStakingConfirmationMessageResponse';
  message: Scalars['String']['output'];
  week: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

export type CanAccountDoArgsInput = {
  action: CanUserDoAction;
  address: Scalars['String']['input'];
  parentPostId?: InputMaybe<Scalars['String']['input']>;
  rootPostId?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['String']['input']>;
};

export type CanAccountDoResponse = {
  __typename?: 'CanAccountDoResponse';
  isAllowed: Scalars['Boolean']['output'];
};

export enum CanUserDoAction {
  CreateComment = 'CREATE_COMMENT',
  CreatePost = 'CREATE_POST'
}

export type CreateMutateActiveStakingSuperLikeInput = {
  callData?: InputMaybe<SocialCallDataInput>;
  dataType: SocialEventDataType;
  protVersion?: InputMaybe<Scalars['String']['input']>;
  providerAddr: Scalars['String']['input'];
  sig: Scalars['String']['input'];
};

export type CreateMutateContentContainerConfigInput = {
  callData?: InputMaybe<SocialCallDataInput>;
  dataType: SocialEventDataType;
  protVersion?: InputMaybe<Scalars['String']['input']>;
  providerAddr: Scalars['String']['input'];
  sig: Scalars['String']['input'];
};

export type CreateMutateExternalTokenInput = {
  callData?: InputMaybe<SocialCallDataInput>;
  dataType: SocialEventDataType;
  protVersion?: InputMaybe<Scalars['String']['input']>;
  providerAddr: Scalars['String']['input'];
  sig: Scalars['String']['input'];
};

export type CreateMutateGamificationEntityInput = {
  callData?: InputMaybe<SocialCallDataInput>;
  dataType: SocialEventDataType;
  protVersion?: InputMaybe<Scalars['String']['input']>;
  providerAddr: Scalars['String']['input'];
  sig: Scalars['String']['input'];
};

export type CreateMutateLinkedIdentityInput = {
  callData?: InputMaybe<SocialCallDataInput>;
  dataType: SocialEventDataType;
  protVersion?: InputMaybe<Scalars['String']['input']>;
  providerAddr: Scalars['String']['input'];
  sig: Scalars['String']['input'];
};

export type CreateMutatePostOffChainDataInput = {
  callData?: InputMaybe<SocialCallDataInput>;
  content?: InputMaybe<Scalars['String']['input']>;
  dataType: SocialEventDataType;
  protVersion?: InputMaybe<Scalars['String']['input']>;
  providerAddr: Scalars['String']['input'];
  sig: Scalars['String']['input'];
};

export type CreateMutateSpaceOffChainDataInput = {
  callData?: InputMaybe<SocialCallDataInput>;
  content?: InputMaybe<Scalars['String']['input']>;
  dataType: SocialEventDataType;
  protVersion?: InputMaybe<Scalars['String']['input']>;
  providerAddr: Scalars['String']['input'];
  sig: Scalars['String']['input'];
};

export type CreatePostOffChainInput = {
  callData?: InputMaybe<SocialCallDataInput>;
  content?: InputMaybe<Scalars['String']['input']>;
  dataType: SocialEventDataType;
  protVersion?: InputMaybe<Scalars['String']['input']>;
  providerAddr: Scalars['String']['input'];
  sig: Scalars['String']['input'];
};

export type CreatePostOptimisticInput = {
  callData?: InputMaybe<SocialCallDataInput>;
  content?: InputMaybe<Scalars['String']['input']>;
  dataType: SocialEventDataType;
  protVersion?: InputMaybe<Scalars['String']['input']>;
  providerAddr: Scalars['String']['input'];
  sig: Scalars['String']['input'];
};

export enum DataType {
  OffChain = 'offChain',
  Optimistic = 'optimistic',
  Persistent = 'persistent'
}

export type FindSocialEventsArgs = {
  dataType?: InputMaybe<SocialEventDataType>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<QueryOrder>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  queueJobIds?: InputMaybe<Array<Scalars['String']['input']>>;
  signers?: InputMaybe<Array<Scalars['String']['input']>>;
  timestampGte?: InputMaybe<Scalars['BigInt']['input']>;
  unixTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
};

export type FindSocialEventsResponseDto = {
  __typename?: 'FindSocialEventsResponseDto';
  data: Array<SocialEventRecoveryData>;
  offset?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type IngestDataFromIndexerInput = {
  /** Stringified JSON with social event data */
  dataStr: Scalars['String']['input'];
  eventId: Scalars['String']['input'];
};

export type IngestDataResponseDto = {
  __typename?: 'IngestDataResponseDto';
  callId?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  processed: Scalars['Boolean']['output'];
};

export type IngestPersistentDataFromSquidInputDto = {
  socialEvents: Array<PersistentDataItemFromSquid>;
};

export type IngestPersistentDataFromSquidResponseDto = {
  __typename?: 'IngestPersistentDataFromSquidResponseDto';
  message?: Maybe<Scalars['String']['output']>;
  processed: Scalars['Boolean']['output'];
};

export type LatestColdSocialEventArgsDto = {
  dataType?: InputMaybe<SocialEventDataType>;
  queueStatus?: InputMaybe<QueueJobStatus>;
};

export type LinkedIdentityExternalProviderEvmProofMsgResponse = {
  __typename?: 'LinkedIdentityExternalProviderEvmProofMsgResponse';
  message: Scalars['String']['output'];
};

export type LinkedIdentityExternalProviderSolanaProofMsgResponse = {
  __typename?: 'LinkedIdentityExternalProviderSolanaProofMsgResponse';
  message: Scalars['String']['output'];
};

export type ModerationCallInput = {
  callData?: InputMaybe<SocialCallDataInput>;
  dataType: SocialEventDataType;
  protVersion?: InputMaybe<Scalars['String']['input']>;
  providerAddr: Scalars['String']['input'];
  sig: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  activeStakingCreateFarcasterFrameLike: IngestDataResponseDto;
  activeStakingCreateSuperLike: IngestDataResponseDto;
  addNewLinkedIdentityExternalProvider: IngestDataResponseDto;
  addPostView: IngestDataResponseDto;
  addPostViewsBatch: IngestDataResponseDto;
  addTappingActivityStates: IngestDataResponseDto;
  claimEntranceDailyReward: IngestDataResponseDto;
  contentContainerConfigCreate: IngestDataResponseDto;
  contentContainerConfigUpdate: IngestDataResponseDto;
  createLinkedIdentity: IngestDataResponseDto;
  createPostOffChain: IngestDataResponseDto;
  createPostOptimistic: IngestDataResponseDto;
  createSpaceOffChain: IngestDataResponseDto;
  deleteLinkedIdentity: IngestDataResponseDto;
  externalTokenCreate: IngestDataResponseDto;
  gamificationClaimTask: IngestDataResponseDto;
  gamificationUpdateTaskStatus: IngestDataResponseDto;
  ingestDataFromIndexerNeynar: IngestPersistentDataFromSquidResponseDto;
  ingestPersistentDataSquid: IngestPersistentDataFromSquidResponseDto;
  initLinkedIdentity: IngestDataResponseDto;
  linkedIdentityExternalProviderEvmProofMsg: LinkedIdentityExternalProviderEvmProofMsgResponse;
  linkedIdentityExternalProviderSolanaProofMsg: LinkedIdentityExternalProviderSolanaProofMsgResponse;
  moderationAddContextToOrganization: IngestDataResponseDto;
  moderationBlockResource: IngestDataResponseDto;
  moderationExecuteForceCall: IngestDataResponseDto;
  moderationInitModerator: IngestDataResponseDto;
  moderationUnblockResource: IngestDataResponseDto;
  setPostApproveStatus: IngestDataResponseDto;
  socialProfileAddReferrerId: IngestDataResponseDto;
  socialProfileSetActionPermissions: IngestDataResponseDto;
  socialProfileSyncExternalTokenBalance: IngestDataResponseDto;
  updateLinkedIdentityExternalProvider: IngestDataResponseDto;
  updatePostBlockchainSyncStatus: IngestDataResponseDto;
  updatePostOptimistic: IngestDataResponseDto;
  updateSpaceOffChain: IngestDataResponseDto;
};


export type MutationActiveStakingCreateFarcasterFrameLikeArgs = {
  args: CreateMutateActiveStakingSuperLikeInput;
};


export type MutationActiveStakingCreateSuperLikeArgs = {
  args: CreateMutateActiveStakingSuperLikeInput;
};


export type MutationAddNewLinkedIdentityExternalProviderArgs = {
  args: CreateMutateLinkedIdentityInput;
};


export type MutationAddPostViewArgs = {
  args: CreateMutatePostOffChainDataInput;
};


export type MutationAddPostViewsBatchArgs = {
  args: CreateMutatePostOffChainDataInput;
};


export type MutationAddTappingActivityStatesArgs = {
  args: CreateMutateGamificationEntityInput;
};


export type MutationClaimEntranceDailyRewardArgs = {
  args: CreateMutateGamificationEntityInput;
};


export type MutationContentContainerConfigCreateArgs = {
  args: CreateMutateContentContainerConfigInput;
};


export type MutationContentContainerConfigUpdateArgs = {
  args: CreateMutateContentContainerConfigInput;
};


export type MutationCreateLinkedIdentityArgs = {
  createLinkedIdentityInput: CreateMutateLinkedIdentityInput;
};


export type MutationCreatePostOffChainArgs = {
  createPostOffChainInput: CreatePostOffChainInput;
};


export type MutationCreatePostOptimisticArgs = {
  createPostOptimisticInput: CreatePostOptimisticInput;
};


export type MutationCreateSpaceOffChainArgs = {
  args: CreateMutateSpaceOffChainDataInput;
};


export type MutationDeleteLinkedIdentityArgs = {
  deleteLinkedIdentityInput: CreateMutateLinkedIdentityInput;
};


export type MutationExternalTokenCreateArgs = {
  args: CreateMutateExternalTokenInput;
};


export type MutationGamificationClaimTaskArgs = {
  args: CreateMutateGamificationEntityInput;
};


export type MutationGamificationUpdateTaskStatusArgs = {
  args: CreateMutateGamificationEntityInput;
};


export type MutationIngestDataFromIndexerNeynarArgs = {
  input: IngestDataFromIndexerInput;
};


export type MutationIngestPersistentDataSquidArgs = {
  ingestPersistentDataSquidInput: IngestPersistentDataFromSquidInputDto;
};


export type MutationInitLinkedIdentityArgs = {
  args: CreateMutateLinkedIdentityInput;
};


export type MutationLinkedIdentityExternalProviderEvmProofMsgArgs = {
  address: Scalars['String']['input'];
};


export type MutationLinkedIdentityExternalProviderSolanaProofMsgArgs = {
  address: Scalars['String']['input'];
};


export type MutationModerationAddContextToOrganizationArgs = {
  addContextInput: ModerationCallInput;
};


export type MutationModerationBlockResourceArgs = {
  blockResourceInput: ModerationCallInput;
};


export type MutationModerationExecuteForceCallArgs = {
  args: ModerationCallInput;
};


export type MutationModerationInitModeratorArgs = {
  initModeratorInput: ModerationCallInput;
};


export type MutationModerationUnblockResourceArgs = {
  unblockResourceInput: ModerationCallInput;
};


export type MutationSetPostApproveStatusArgs = {
  args: CreateMutatePostOffChainDataInput;
};


export type MutationSocialProfileAddReferrerIdArgs = {
  args: SocialProfileAddReferrerIdInput;
};


export type MutationSocialProfileSetActionPermissionsArgs = {
  args: SocialProfileAddReferrerIdInput;
};


export type MutationSocialProfileSyncExternalTokenBalanceArgs = {
  args: SocialProfileAddReferrerIdInput;
};


export type MutationUpdateLinkedIdentityExternalProviderArgs = {
  args: CreateMutateLinkedIdentityInput;
};


export type MutationUpdatePostBlockchainSyncStatusArgs = {
  updatePostBlockchainSyncStatusInput: UpdatePostBlockchainSyncStatusInput;
};


export type MutationUpdatePostOptimisticArgs = {
  updatePostOptimisticInput: UpdatePostOptimisticInput;
};


export type MutationUpdateSpaceOffChainArgs = {
  args: CreateMutateSpaceOffChainDataInput;
};

export type PersistentDataItemFromSquid = {
  blockNumber: Scalars['Int']['input'];
  /** Stringified JSON with social event data */
  dataStr: Scalars['String']['input'];
  id: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  activeStakingConfirmationMessage: ActiveStakingConfirmationMessageResponse;
  canAccountDo: CanAccountDoResponse;
  coldSocialEvents: FindSocialEventsResponseDto;
  latestColdSocialEvent?: Maybe<SocialEventRecoveryData>;
};


export type QueryCanAccountDoArgs = {
  args: CanAccountDoArgsInput;
};


export type QueryColdSocialEventsArgs = {
  where: FindSocialEventsArgs;
};


export type QueryLatestColdSocialEventArgs = {
  where: LatestColdSocialEventArgsDto;
};

export enum QueryOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum QueueJobStatus {
  Active = 'ACTIVE',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Waiting = 'WAITING'
}

export type SocialCallDataInput = {
  /** Stringified JSON with call arguments */
  args?: InputMaybe<Scalars['String']['input']>;
  name: SocialCallName;
  /** Proxy of call signer address */
  proxy?: InputMaybe<Scalars['String']['input']>;
  /** Call signer address */
  signer: Scalars['String']['input'];
  /** Unix timestamp of the call */
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  /** UUID of the call */
  uuid?: InputMaybe<Scalars['String']['input']>;
};

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
  SynthModerationForceAddOrganizationModerator = 'synth_moderation_force_add_organization_moderator',
  SynthModerationForceBlockResource = 'synth_moderation_force_block_resource',
  SynthModerationForceInitModerator = 'synth_moderation_force_init_moderator',
  SynthModerationForceInitOrganization = 'synth_moderation_force_init_organization',
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
  UpdateSpace = 'update_space'
}

export enum SocialEventDataType {
  OffChain = 'offChain',
  Optimistic = 'optimistic',
  Persistent = 'persistent'
}

export type SocialEventRecoveryData = {
  __typename?: 'SocialEventRecoveryData';
  data: Scalars['JSON']['output'];
  dataType: DataType;
  id: Scalars['String']['output'];
  protVersion: Scalars['String']['output'];
  queueJobId: Scalars['String']['output'];
  signer: Scalars['String']['output'];
  unixTimestamp: Scalars['BigInt']['output'];
  uuid?: Maybe<Scalars['String']['output']>;
};

export type SocialProfileAddReferrerIdInput = {
  callData?: InputMaybe<SocialCallDataInput>;
  dataType: SocialEventDataType;
  protVersion?: InputMaybe<Scalars['String']['input']>;
  providerAddr: Scalars['String']['input'];
  sig: Scalars['String']['input'];
};

export type UpdatePostBlockchainSyncStatusInput = {
  callData: SocialCallDataInput;
  dataType: SocialEventDataType;
  protVersion?: InputMaybe<Scalars['String']['input']>;
  providerAddr: Scalars['String']['input'];
  sig: Scalars['String']['input'];
};

export type UpdatePostOptimisticInput = {
  callData?: InputMaybe<SocialCallDataInput>;
  content?: InputMaybe<Scalars['String']['input']>;
  dataType: SocialEventDataType;
  protVersion?: InputMaybe<Scalars['String']['input']>;
  providerAddr: Scalars['String']['input'];
  sig: Scalars['String']['input'];
};

export type GamificationClaimTaskMutationVariables = Exact<{
  args: CreateMutateGamificationEntityInput;
}>;


export type GamificationClaimTaskMutation = { __typename?: 'Mutation', gamificationClaimTask: { __typename?: 'IngestDataResponseDto', processed: boolean, callId?: string | null, message?: string | null } };

export type ClaimDailyRewardMutationVariables = Exact<{
  args: CreateMutateGamificationEntityInput;
}>;


export type ClaimDailyRewardMutation = { __typename?: 'Mutation', claimEntranceDailyReward: { __typename?: 'IngestDataResponseDto', processed: boolean, message?: string | null } };

export type LinkIdentityMutationVariables = Exact<{
  args: CreateMutateLinkedIdentityInput;
}>;


export type LinkIdentityMutation = { __typename?: 'Mutation', initLinkedIdentity: { __typename?: 'IngestDataResponseDto', processed: boolean, callId?: string | null, message?: string | null } };

export type SyncExternalTokenBalancesMutationVariables = Exact<{
  args: SocialProfileAddReferrerIdInput;
}>;


export type SyncExternalTokenBalancesMutation = { __typename?: 'Mutation', socialProfileSyncExternalTokenBalance: { __typename?: 'IngestDataResponseDto', processed: boolean, callId?: string | null, message?: string | null } };

export type CreateFramesLikeMutationVariables = Exact<{
  args: CreateMutateActiveStakingSuperLikeInput;
}>;


export type CreateFramesLikeMutation = { __typename?: 'Mutation', activeStakingCreateFarcasterFrameLike: { __typename?: 'IngestDataResponseDto', processed: boolean, callId?: string | null, message?: string | null } };

export type AddExternalProviderToIdentityMutationVariables = Exact<{
  args: CreateMutateLinkedIdentityInput;
}>;


export type AddExternalProviderToIdentityMutation = { __typename?: 'Mutation', addNewLinkedIdentityExternalProvider: { __typename?: 'IngestDataResponseDto', processed: boolean, callId?: string | null, message?: string | null } };

export type UpdateExternalProviderMutationVariables = Exact<{
  args: CreateMutateLinkedIdentityInput;
}>;


export type UpdateExternalProviderMutation = { __typename?: 'Mutation', updateLinkedIdentityExternalProvider: { __typename?: 'IngestDataResponseDto', processed: boolean, callId?: string | null, message?: string | null } };

export type LinkIdentityEvmMessageMutationVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type LinkIdentityEvmMessageMutation = { __typename?: 'Mutation', linkedIdentityExternalProviderEvmProofMsg: { __typename?: 'LinkedIdentityExternalProviderEvmProofMsgResponse', message: string } };

export type InitModerationOrgMutationVariables = Exact<{
  input: ModerationCallInput;
}>;


export type InitModerationOrgMutation = { __typename?: 'Mutation', moderationInitModerator: { __typename?: 'IngestDataResponseDto', processed: boolean, message?: string | null } };

export type AddPostIdToOrgMutationVariables = Exact<{
  input: ModerationCallInput;
}>;


export type AddPostIdToOrgMutation = { __typename?: 'Mutation', moderationAddContextToOrganization: { __typename?: 'IngestDataResponseDto', processed: boolean, message?: string | null } };

export type BlockResourceMutationVariables = Exact<{
  input: ModerationCallInput;
}>;


export type BlockResourceMutation = { __typename?: 'Mutation', moderationBlockResource: { __typename?: 'IngestDataResponseDto', processed: boolean, message?: string | null } };

export type UnblockResourceMutationVariables = Exact<{
  input: ModerationCallInput;
}>;


export type UnblockResourceMutation = { __typename?: 'Mutation', moderationUnblockResource: { __typename?: 'IngestDataResponseDto', processed: boolean, message?: string | null } };

export type GetCanAccountDoQueryVariables = Exact<{
  getAccountDo: CanAccountDoArgsInput;
}>;


export type GetCanAccountDoQuery = { __typename?: 'Query', canAccountDo: { __typename?: 'CanAccountDoResponse', isAllowed: boolean } };

export type CreatePostOffChainMutationVariables = Exact<{
  createPostOffChainInput: CreatePostOffChainInput;
}>;


export type CreatePostOffChainMutation = { __typename?: 'Mutation', createPostOffChain: { __typename?: 'IngestDataResponseDto', processed: boolean, callId?: string | null, message?: string | null } };

export type UpdatePostOptimisticMutationVariables = Exact<{
  updatePostOptimisticInput: UpdatePostOptimisticInput;
}>;


export type UpdatePostOptimisticMutation = { __typename?: 'Mutation', updatePostOptimistic: { __typename?: 'IngestDataResponseDto', processed: boolean, callId?: string | null, message?: string | null } };

export type ApproveUserMutationVariables = Exact<{
  input: SocialProfileAddReferrerIdInput;
}>;


export type ApproveUserMutation = { __typename?: 'Mutation', socialProfileSetActionPermissions: { __typename?: 'IngestDataResponseDto', processed: boolean, callId?: string | null, message?: string | null } };

export type ApproveMessageMutationVariables = Exact<{
  input: CreateMutatePostOffChainDataInput;
}>;


export type ApproveMessageMutation = { __typename?: 'Mutation', setPostApproveStatus: { __typename?: 'IngestDataResponseDto', processed: boolean, callId?: string | null, message?: string | null } };

export type SetReferrerIdMutationVariables = Exact<{
  setReferrerIdInput: SocialProfileAddReferrerIdInput;
}>;


export type SetReferrerIdMutation = { __typename?: 'Mutation', socialProfileAddReferrerId: { __typename?: 'IngestDataResponseDto', processed: boolean, message?: string | null } };

export type CreateSpaceOffChainMutationVariables = Exact<{
  createSpaceOffChainInput: CreateMutateSpaceOffChainDataInput;
}>;


export type CreateSpaceOffChainMutation = { __typename?: 'Mutation', createSpaceOffChain: { __typename?: 'IngestDataResponseDto', processed: boolean, message?: string | null } };

export type UpdateSpaceOffChainMutationVariables = Exact<{
  updateSpaceOffChainInput: CreateMutateSpaceOffChainDataInput;
}>;


export type UpdateSpaceOffChainMutation = { __typename?: 'Mutation', updateSpaceOffChain: { __typename?: 'IngestDataResponseDto', processed: boolean, message?: string | null } };

export type GetSuperLikeConfirmationMsgQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSuperLikeConfirmationMsgQuery = { __typename?: 'Query', activeStakingConfirmationMessage: { __typename?: 'ActiveStakingConfirmationMessageResponse', message: string, week: number } };

export type CreateSuperLikeMutationVariables = Exact<{
  createSuperLikeInput: CreateMutateActiveStakingSuperLikeInput;
}>;


export type CreateSuperLikeMutation = { __typename?: 'Mutation', activeStakingCreateSuperLike: { __typename?: 'IngestDataResponseDto', processed: boolean, message?: string | null } };


export const GamificationClaimTask = gql`
    mutation GamificationClaimTask($args: CreateMutateGamificationEntityInput!) {
  gamificationClaimTask(args: $args) {
    processed
    callId
    message
  }
}
    `;
export const ClaimDailyReward = gql`
    mutation ClaimDailyReward($args: CreateMutateGamificationEntityInput!) {
  claimEntranceDailyReward(args: $args) {
    processed
    message
  }
}
    `;
export const LinkIdentity = gql`
    mutation LinkIdentity($args: CreateMutateLinkedIdentityInput!) {
  initLinkedIdentity(args: $args) {
    processed
    callId
    message
  }
}
    `;
export const SyncExternalTokenBalances = gql`
    mutation SyncExternalTokenBalances($args: SocialProfileAddReferrerIdInput!) {
  socialProfileSyncExternalTokenBalance(args: $args) {
    processed
    callId
    message
  }
}
    `;
export const CreateFramesLike = gql`
    mutation CreateFramesLike($args: CreateMutateActiveStakingSuperLikeInput!) {
  activeStakingCreateFarcasterFrameLike(args: $args) {
    processed
    callId
    message
  }
}
    `;
export const AddExternalProviderToIdentity = gql`
    mutation AddExternalProviderToIdentity($args: CreateMutateLinkedIdentityInput!) {
  addNewLinkedIdentityExternalProvider(args: $args) {
    processed
    callId
    message
  }
}
    `;
export const UpdateExternalProvider = gql`
    mutation UpdateExternalProvider($args: CreateMutateLinkedIdentityInput!) {
  updateLinkedIdentityExternalProvider(args: $args) {
    processed
    callId
    message
  }
}
    `;
export const LinkIdentityEvmMessage = gql`
    mutation LinkIdentityEvmMessage($address: String!) {
  linkedIdentityExternalProviderEvmProofMsg(address: $address) {
    message
  }
}
    `;
export const InitModerationOrg = gql`
    mutation InitModerationOrg($input: ModerationCallInput!) {
  moderationInitModerator(initModeratorInput: $input) {
    processed
    message
  }
}
    `;
export const AddPostIdToOrg = gql`
    mutation AddPostIdToOrg($input: ModerationCallInput!) {
  moderationAddContextToOrganization(addContextInput: $input) {
    processed
    message
  }
}
    `;
export const BlockResource = gql`
    mutation BlockResource($input: ModerationCallInput!) {
  moderationBlockResource(blockResourceInput: $input) {
    processed
    message
  }
}
    `;
export const UnblockResource = gql`
    mutation UnblockResource($input: ModerationCallInput!) {
  moderationUnblockResource(unblockResourceInput: $input) {
    processed
    message
  }
}
    `;
export const GetCanAccountDo = gql`
    query GetCanAccountDo($getAccountDo: CanAccountDoArgsInput!) {
  canAccountDo(args: $getAccountDo) {
    isAllowed
  }
}
    `;
export const CreatePostOffChain = gql`
    mutation CreatePostOffChain($createPostOffChainInput: CreatePostOffChainInput!) {
  createPostOffChain(createPostOffChainInput: $createPostOffChainInput) {
    processed
    callId
    message
  }
}
    `;
export const UpdatePostOptimistic = gql`
    mutation UpdatePostOptimistic($updatePostOptimisticInput: UpdatePostOptimisticInput!) {
  updatePostOptimistic(updatePostOptimisticInput: $updatePostOptimisticInput) {
    processed
    callId
    message
  }
}
    `;
export const ApproveUser = gql`
    mutation ApproveUser($input: SocialProfileAddReferrerIdInput!) {
  socialProfileSetActionPermissions(args: $input) {
    processed
    callId
    message
  }
}
    `;
export const ApproveMessage = gql`
    mutation ApproveMessage($input: CreateMutatePostOffChainDataInput!) {
  setPostApproveStatus(args: $input) {
    processed
    callId
    message
  }
}
    `;
export const SetReferrerId = gql`
    mutation SetReferrerId($setReferrerIdInput: SocialProfileAddReferrerIdInput!) {
  socialProfileAddReferrerId(args: $setReferrerIdInput) {
    processed
    message
  }
}
    `;
export const CreateSpaceOffChain = gql`
    mutation CreateSpaceOffChain($createSpaceOffChainInput: CreateMutateSpaceOffChainDataInput!) {
  createSpaceOffChain(args: $createSpaceOffChainInput) {
    processed
    message
  }
}
    `;
export const UpdateSpaceOffChain = gql`
    mutation UpdateSpaceOffChain($updateSpaceOffChainInput: CreateMutateSpaceOffChainDataInput!) {
  updateSpaceOffChain(args: $updateSpaceOffChainInput) {
    processed
    message
  }
}
    `;
export const GetSuperLikeConfirmationMsg = gql`
    query GetSuperLikeConfirmationMsg {
  activeStakingConfirmationMessage {
    message
    week
  }
}
    `;
export const CreateSuperLike = gql`
    mutation CreateSuperLike($createSuperLikeInput: CreateMutateActiveStakingSuperLikeInput!) {
  activeStakingCreateSuperLike(args: $createSuperLikeInput) {
    processed
    message
  }
}
    `;