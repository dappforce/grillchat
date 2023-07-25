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
  DateTime: { input: any; output: any; }
};

export type AddCtxPostIdToOrganisationInput = {
  ctxPostId: Scalars['String']['input'];
  substrateAddress: Scalars['String']['input'];
};

export type BlockReasonGql = {
  __typename?: 'BlockReasonGql';
  id: Scalars['Float']['output'];
  reasonText: Scalars['String']['output'];
};

export type BlockReasonGqlInput = {
  id: Scalars['String']['input'];
  reasonText: Scalars['String']['input'];
};

export type BlockResourceByIdInput = {
  ctxPostIds?: InputMaybe<Array<Scalars['String']['input']>>;
  ctxSpaceIds?: InputMaybe<Array<Scalars['String']['input']>>;
  reasonId: Scalars['String']['input'];
  resourceId: Scalars['String']['input'];
  substrateAddress: Scalars['String']['input'];
};

export type BlockedResourceGql = {
  __typename?: 'BlockedResourceGql';
  blocked: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  moderator: ModeratorGql;
  organisation: OrganisationGql;
  parentPostId?: Maybe<Scalars['String']['output']>;
  reason: BlockReasonGql;
  resourceId: Scalars['String']['output'];
  resourceType: BlockedResourceType;
  rootPostId?: Maybe<Scalars['String']['output']>;
  spaceId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum BlockedResourceType {
  Address = 'Address',
  Cid = 'CID',
  Post = 'Post'
}

export type CommitModerationSignedMessageResponse = {
  __typename?: 'CommitModerationSignedMessageResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type CreateModeratorInputDto = {
  defaultCtxPostIds: Array<Scalars['String']['input']>;
  defaultCtxSpaceIds: Array<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  id: Scalars['Float']['input'];
  initEntryPoint?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  organisationId: Scalars['String']['input'];
  role: Scalars['String']['input'];
  substrateAddress: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};

export type InitModeratorWithOrganisationMessageInput = {
  ctxPostIds?: InputMaybe<Array<Scalars['String']['input']>>;
  ctxSpaceIds?: InputMaybe<Array<Scalars['String']['input']>>;
  substrateAddress: Scalars['String']['input'];
};

export type ModeratorGql = {
  __typename?: 'ModeratorGql';
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  initEntryPoint: ModeratorInitEntryPoint;
  lastName?: Maybe<Scalars['String']['output']>;
  organisation?: Maybe<OrganisationGql>;
  processedResources: Array<BlockedResourceGql>;
  role: ModeratorRole;
  substrateAddress?: Maybe<Scalars['String']['output']>;
  telegramId?: Maybe<Scalars['Int']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

export enum ModeratorInitEntryPoint {
  ApiCall = 'API_CALL',
  GrillUi = 'GRILL_UI',
  TgBot = 'TG_BOT'
}

export enum ModeratorRole {
  Admin = 'admin',
  Editor = 'editor',
  Reader = 'reader'
}

export type Mutation = {
  __typename?: 'Mutation';
  commitSignedMessageWithAction?: Maybe<CommitModerationSignedMessageResponse>;
  createBlockReason: BlockReasonGql;
  createModerator: ModeratorGql;
  createOrganisation: OrganisationGql;
};


export type MutationCommitSignedMessageWithActionArgs = {
  signedMessage: Scalars['String']['input'];
};


export type MutationCreateBlockReasonArgs = {
  createReasonInput: BlockReasonGqlInput;
};


export type MutationCreateModeratorArgs = {
  createModeratorInput: CreateModeratorInputDto;
};


export type MutationCreateOrganisationArgs = {
  createOrganisationInput: OrganisationGqlInput;
};

export type OrganisationGql = {
  __typename?: 'OrganisationGql';
  ctxPostIds: Array<Scalars['String']['output']>;
  ctxSpaceIds: Array<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  moderatorIds: Array<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  ownerId: Scalars['Int']['output'];
};

export type OrganisationGqlInput = {
  ctxPostIds: Array<Scalars['String']['input']>;
  ctxSpaceIds: Array<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  moderatorIds: Array<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  ownerId: Scalars['Float']['input'];
};

export type Query = {
  __typename?: 'Query';
  addCtxPostIdToOrganisationMessage?: Maybe<SignedMessageWithActionTemplateResponseDto>;
  blockResourceByIdMessage?: Maybe<SignedMessageWithActionTemplateResponseDto>;
  blockedResourceDetailed: Array<BlockedResourceGql>;
  blockedResourceIds: Array<Scalars['String']['output']>;
  initModeratorWithOrganisationMessage?: Maybe<SignedMessageWithActionTemplateResponseDto>;
  moderator: ModeratorGql;
  moderatorById: ModeratorGql;
  moderatorBySubstrateAddress?: Maybe<ModeratorGql>;
  moderatorByUserName: ModeratorGql;
  moderatorsAll: Array<ModeratorGql>;
  reason: BlockReasonGql;
  reasonsAll: Array<BlockReasonGql>;
  unblockResourceByIdMessage?: Maybe<SignedMessageWithActionTemplateResponseDto>;
};


export type QueryAddCtxPostIdToOrganisationMessageArgs = {
  input: AddCtxPostIdToOrganisationInput;
};


export type QueryBlockResourceByIdMessageArgs = {
  input: BlockResourceByIdInput;
};


export type QueryBlockedResourceDetailedArgs = {
  blocked?: InputMaybe<Scalars['Boolean']['input']>;
  ctxPostId?: InputMaybe<Scalars['String']['input']>;
  ctxSpaceId?: InputMaybe<Scalars['String']['input']>;
  moderatorId?: InputMaybe<Scalars['Float']['input']>;
  parentPostId?: InputMaybe<Scalars['String']['input']>;
  reasonId?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  resourceType?: InputMaybe<BlockedResourceType>;
  rootPostId?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryBlockedResourceIdsArgs = {
  blocked?: InputMaybe<Scalars['Boolean']['input']>;
  ctxPostId?: InputMaybe<Scalars['String']['input']>;
  ctxSpaceId?: InputMaybe<Scalars['String']['input']>;
  moderatorId?: InputMaybe<Scalars['Float']['input']>;
  parentPostId?: InputMaybe<Scalars['String']['input']>;
  reasonId?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  resourceType?: InputMaybe<BlockedResourceType>;
  rootPostId?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryInitModeratorWithOrganisationMessageArgs = {
  input: InitModeratorWithOrganisationMessageInput;
};


export type QueryModeratorArgs = {
  id: Scalars['Float']['input'];
};


export type QueryModeratorByIdArgs = {
  id: Scalars['Float']['input'];
};


export type QueryModeratorBySubstrateAddressArgs = {
  substrateAddress: Scalars['String']['input'];
};


export type QueryModeratorByUserNameArgs = {
  userName: Scalars['String']['input'];
};


export type QueryReasonArgs = {
  id: Scalars['String']['input'];
};


export type QueryUnblockResourceByIdMessageArgs = {
  input: UnblockResourceByIdInput;
};

export type SignedMessageWithActionTemplateResponseDto = {
  __typename?: 'SignedMessageWithActionTemplateResponseDto';
  messageTpl: Scalars['String']['output'];
};

export type UnblockResourceByIdInput = {
  ctxPostIds?: InputMaybe<Array<Scalars['String']['input']>>;
  ctxSpaceIds?: InputMaybe<Array<Scalars['String']['input']>>;
  resourceId: Scalars['String']['input'];
  substrateAddress: Scalars['String']['input'];
};

export type GetBlockedInPostIdDetailedQueryVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type GetBlockedInPostIdDetailedQuery = { __typename?: 'Query', blockedResourceDetailed: Array<{ __typename?: 'BlockedResourceGql', resourceId: string, reason: { __typename?: 'BlockReasonGql', id: number, reasonText: string } }> };

export type GetModerationReasonsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetModerationReasonsQuery = { __typename?: 'Query', reasonsAll: Array<{ __typename?: 'BlockReasonGql', id: number, reasonText: string }> };

export type GetModeratorDataQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type GetModeratorDataQuery = { __typename?: 'Query', moderatorBySubstrateAddress?: { __typename?: 'ModeratorGql', organisation?: { __typename?: 'OrganisationGql', ctxPostIds: Array<string> } | null } | null };

export type InitModerationOrgMessageQueryVariables = Exact<{
  address: Scalars['String']['input'];
  postId: Scalars['String']['input'];
  spaceId: Scalars['String']['input'];
}>;


export type InitModerationOrgMessageQuery = { __typename?: 'Query', initModeratorWithOrganisationMessage?: { __typename?: 'SignedMessageWithActionTemplateResponseDto', messageTpl: string } | null };

export type AddPostIdToOrgMessageQueryVariables = Exact<{
  address: Scalars['String']['input'];
  postId: Scalars['String']['input'];
}>;


export type AddPostIdToOrgMessageQuery = { __typename?: 'Query', addCtxPostIdToOrganisationMessage?: { __typename?: 'SignedMessageWithActionTemplateResponseDto', messageTpl: string } | null };

export type BlockResourceMessageQueryVariables = Exact<{
  address: Scalars['String']['input'];
  resourceId: Scalars['String']['input'];
  reasonId: Scalars['String']['input'];
  ctxPostId: Scalars['String']['input'];
  ctxSpaceId: Scalars['String']['input'];
}>;


export type BlockResourceMessageQuery = { __typename?: 'Query', blockResourceByIdMessage?: { __typename?: 'SignedMessageWithActionTemplateResponseDto', messageTpl: string } | null };

export type UnblockResourceMessageQueryVariables = Exact<{
  address: Scalars['String']['input'];
  resourceId: Scalars['String']['input'];
  ctxPostId: Scalars['String']['input'];
  ctxSpaceId: Scalars['String']['input'];
}>;


export type UnblockResourceMessageQuery = { __typename?: 'Query', unblockResourceByIdMessage?: { __typename?: 'SignedMessageWithActionTemplateResponseDto', messageTpl: string } | null };

export type CommitModerationActionMutationVariables = Exact<{
  signedMessage: Scalars['String']['input'];
}>;


export type CommitModerationActionMutation = { __typename?: 'Mutation', commitSignedMessageWithAction?: { __typename?: 'CommitModerationSignedMessageResponse', success: boolean, message?: string | null } | null };


export const GetBlockedInPostIdDetailed = gql`
    query GetBlockedInPostIdDetailed($postId: String!) {
  blockedResourceDetailed(ctxPostId: $postId, blocked: true) {
    resourceId
    reason {
      id
      reasonText
    }
  }
}
    `;
export const GetModerationReasons = gql`
    query GetModerationReasons {
  reasonsAll {
    id
    reasonText
  }
}
    `;
export const GetModeratorData = gql`
    query GetModeratorData($address: String!) {
  moderatorBySubstrateAddress(substrateAddress: $address) {
    organisation {
      ctxPostIds
    }
  }
}
    `;
export const InitModerationOrgMessage = gql`
    query InitModerationOrgMessage($address: String!, $postId: String!, $spaceId: String!) {
  initModeratorWithOrganisationMessage(
    input: {substrateAddress: $address, ctxPostIds: [$postId], ctxSpaceIds: [$spaceId]}
  ) {
    messageTpl
  }
}
    `;
export const AddPostIdToOrgMessage = gql`
    query AddPostIdToOrgMessage($address: String!, $postId: String!) {
  addCtxPostIdToOrganisationMessage(
    input: {substrateAddress: $address, ctxPostId: $postId}
  ) {
    messageTpl
  }
}
    `;
export const BlockResourceMessage = gql`
    query BlockResourceMessage($address: String!, $resourceId: String!, $reasonId: String!, $ctxPostId: String!, $ctxSpaceId: String!) {
  blockResourceByIdMessage(
    input: {substrateAddress: $address, resourceId: $resourceId, reasonId: $reasonId, ctxPostIds: [$ctxPostId], ctxSpaceIds: [$ctxSpaceId]}
  ) {
    messageTpl
  }
}
    `;
export const UnblockResourceMessage = gql`
    query UnblockResourceMessage($address: String!, $resourceId: String!, $ctxPostId: String!, $ctxSpaceId: String!) {
  unblockResourceByIdMessage(
    input: {substrateAddress: $address, resourceId: $resourceId, ctxPostIds: [$ctxPostId], ctxSpaceIds: [$ctxSpaceId]}
  ) {
    messageTpl
  }
}
    `;
export const CommitModerationAction = gql`
    mutation CommitModerationAction($signedMessage: String!) {
  commitSignedMessageWithAction(signedMessage: $signedMessage) {
    success
    message
  }
}
    `;