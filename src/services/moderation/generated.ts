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

export type BlockReasonGql = {
  __typename?: 'BlockReasonGql';
  id: Scalars['Float']['output'];
  reasonText: Scalars['String']['output'];
};

export type BlockReasonGqlInput = {
  id: Scalars['String']['input'];
  reasonText: Scalars['String']['input'];
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

export type ModeratorGql = {
  __typename?: 'ModeratorGql';
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  organisation?: Maybe<OrganisationGql>;
  processedResources: Array<BlockedResourceGql>;
  role: ModeratorRole;
  userName?: Maybe<Scalars['String']['output']>;
};

export type ModeratorGqlInput = {
  defaultCtxPostIds: Array<Scalars['String']['input']>;
  defaultCtxSpaceIds: Array<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  id: Scalars['Float']['input'];
  lastName: Scalars['String']['input'];
  organisationId: Scalars['String']['input'];
  role: ModeratorRole;
  userName: Scalars['String']['input'];
};

export enum ModeratorRole {
  Admin = 'admin',
  Editor = 'editor',
  Reader = 'reader'
}

export type Mutation = {
  __typename?: 'Mutation';
  createBlockReason: BlockReasonGql;
  createModerator: ModeratorGql;
  createOrganisation: OrganisationGql;
};


export type MutationCreateBlockReasonArgs = {
  createReasonInput: BlockReasonGqlInput;
};


export type MutationCreateModeratorArgs = {
  createModeratorInput: ModeratorGqlInput;
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
  blockedResourceDetailed: Array<BlockedResourceGql>;
  blockedResourceIds: Array<Scalars['String']['output']>;
  moderator: ModeratorGql;
  moderatorByUserName: ModeratorGql;
  moderatorsAll: Array<ModeratorGql>;
  reason: BlockReasonGql;
  reasonsAll: Array<BlockReasonGql>;
};


export type QueryBlockedResourceDetailedArgs = {
  blocked?: InputMaybe<Scalars['Boolean']['input']>;
  ctxSpaceId: Scalars['String']['input'];
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
  ctxSpaceId: Scalars['String']['input'];
  moderatorId?: InputMaybe<Scalars['Float']['input']>;
  parentPostId?: InputMaybe<Scalars['String']['input']>;
  reasonId?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  resourceType?: InputMaybe<BlockedResourceType>;
  rootPostId?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryModeratorArgs = {
  id: Scalars['Float']['input'];
};


export type QueryModeratorByUserNameArgs = {
  userName: Scalars['String']['input'];
};


export type QueryReasonArgs = {
  id: Scalars['String']['input'];
};

export type GetBlockedCidsQueryVariables = Exact<{
  ctxSpaceId: Scalars['String']['input'];
}>;


export type GetBlockedCidsQuery = { __typename?: 'Query', blockedResourceIds: Array<string> };

export type GetBlockedAddressesQueryVariables = Exact<{
  ctxSpaceId: Scalars['String']['input'];
}>;


export type GetBlockedAddressesQuery = { __typename?: 'Query', blockedResourceIds: Array<string> };


export const GetBlockedCids = gql`
    query GetBlockedCids($ctxSpaceId: String!) {
  blockedResourceIds(ctxSpaceId: $ctxSpaceId, blocked: true, resourceType: CID)
}
    `;
export const GetBlockedAddresses = gql`
    query GetBlockedAddresses($ctxSpaceId: String!) {
  blockedResourceIds(
    ctxSpaceId: $ctxSpaceId
    blocked: true
    resourceType: Address
  )
}
    `;