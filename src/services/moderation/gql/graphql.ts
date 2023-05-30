/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
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
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any
}

export type BlockReasonGql = {
  __typename?: 'BlockReasonGql'
  id: Scalars['Float']
  reasonText: Scalars['String']
}

export type BlockReasonGqlInput = {
  id: Scalars['String']
  reasonText: Scalars['String']
}

export type BlockedResourceGql = {
  __typename?: 'BlockedResourceGql'
  blocked: Scalars['Boolean']
  createdAt: Scalars['DateTime']
  id: Scalars['ID']
  moderator: ModeratorGql
  organisation: OrganisationGql
  parentPostId?: Maybe<Scalars['String']>
  reason: BlockReasonGql
  resourceId: Scalars['String']
  resourceType: BlockedResourceType
  rootPostId?: Maybe<Scalars['String']>
  spaceId?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export enum BlockedResourceType {
  Address = 'Address',
  Cid = 'CID',
  Post = 'Post',
}

export type ModeratorGql = {
  __typename?: 'ModeratorGql'
  firstName?: Maybe<Scalars['String']>
  id: Scalars['Int']
  lastName?: Maybe<Scalars['String']>
  organisation?: Maybe<OrganisationGql>
  processedResources: Array<BlockedResourceGql>
  role: ModeratorRole
  userName?: Maybe<Scalars['String']>
}

export type ModeratorGqlInput = {
  defaultCtxPostIds: Array<Scalars['String']>
  defaultCtxSpaceIds: Array<Scalars['String']>
  firstName: Scalars['String']
  id: Scalars['Float']
  lastName: Scalars['String']
  organisationId: Scalars['String']
  role: ModeratorRole
  userName: Scalars['String']
}

export enum ModeratorRole {
  Admin = 'admin',
  Editor = 'editor',
  Reader = 'reader',
}

export type Mutation = {
  __typename?: 'Mutation'
  createBlockReason: BlockReasonGql
  createModerator: ModeratorGql
  createOrganisation: OrganisationGql
}

export type MutationCreateBlockReasonArgs = {
  createReasonInput: BlockReasonGqlInput
}

export type MutationCreateModeratorArgs = {
  createModeratorInput: ModeratorGqlInput
}

export type MutationCreateOrganisationArgs = {
  createOrganisationInput: OrganisationGqlInput
}

export type OrganisationGql = {
  __typename?: 'OrganisationGql'
  ctxPostIds: Array<Scalars['String']>
  ctxSpaceIds: Array<Scalars['String']>
  description?: Maybe<Scalars['String']>
  id: Scalars['String']
  moderatorIds: Array<Scalars['String']>
  name?: Maybe<Scalars['String']>
  ownerId: Scalars['Int']
}

export type OrganisationGqlInput = {
  ctxPostIds: Array<Scalars['String']>
  ctxSpaceIds: Array<Scalars['String']>
  description?: InputMaybe<Scalars['String']>
  id: Scalars['String']
  moderatorIds: Array<Scalars['Float']>
  name?: InputMaybe<Scalars['String']>
  ownerId: Scalars['Float']
}

export type Query = {
  __typename?: 'Query'
  blockedResourceDetailed: Array<BlockedResourceGql>
  blockedResourceIds: Array<Scalars['String']>
  moderator: ModeratorGql
  moderatorByUserName: ModeratorGql
  moderatorsAll: Array<ModeratorGql>
  reason: BlockReasonGql
  reasonsAll: Array<BlockReasonGql>
}

export type QueryBlockedResourceDetailedArgs = {
  blocked?: InputMaybe<Scalars['Boolean']>
  ctxSpaceId: Scalars['String']
  moderatorId?: InputMaybe<Scalars['Float']>
  parentPostId?: InputMaybe<Scalars['String']>
  reasonId?: InputMaybe<Scalars['String']>
  resourceId?: InputMaybe<Scalars['String']>
  resourceType?: InputMaybe<BlockedResourceType>
  rootPostId?: InputMaybe<Scalars['String']>
  spaceId?: InputMaybe<Scalars['String']>
}

export type QueryBlockedResourceIdsArgs = {
  blocked?: InputMaybe<Scalars['Boolean']>
  ctxSpaceId: Scalars['String']
  moderatorId?: InputMaybe<Scalars['Float']>
  parentPostId?: InputMaybe<Scalars['String']>
  reasonId?: InputMaybe<Scalars['String']>
  resourceId?: InputMaybe<Scalars['String']>
  resourceType?: InputMaybe<BlockedResourceType>
  rootPostId?: InputMaybe<Scalars['String']>
  spaceId?: InputMaybe<Scalars['String']>
}

export type QueryModeratorArgs = {
  id: Scalars['Float']
}

export type QueryModeratorByUserNameArgs = {
  userName: Scalars['String']
}

export type QueryReasonArgs = {
  id: Scalars['String']
}

export type GetBlockedMessageIdsInChatIdQueryVariables = Exact<{
  ctxSpaceId: Scalars['String']
  chatId: Scalars['String']
}>

export type GetBlockedMessageIdsInChatIdQuery = {
  __typename?: 'Query'
  blockedResourceIds: Array<string>
}

export type GetBlockedCidsQueryVariables = Exact<{
  ctxSpaceId: Scalars['String']
}>

export type GetBlockedCidsQuery = {
  __typename?: 'Query'
  blockedResourceIds: Array<string>
}

export type GetBlockedAddressesQueryVariables = Exact<{
  ctxSpaceId: Scalars['String']
}>

export type GetBlockedAddressesQuery = {
  __typename?: 'Query'
  blockedResourceIds: Array<string>
}

export const GetBlockedMessageIdsInChatIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetBlockedMessageIdsInChatId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'ctxSpaceId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'chatId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'blockedResourceIds' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'ctxSpaceId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'ctxSpaceId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'blocked' },
                value: { kind: 'BooleanValue', value: true },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'rootPostId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'chatId' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetBlockedMessageIdsInChatIdQuery,
  GetBlockedMessageIdsInChatIdQueryVariables
>
export const GetBlockedCidsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetBlockedCids' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'ctxSpaceId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'blockedResourceIds' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'ctxSpaceId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'ctxSpaceId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'blocked' },
                value: { kind: 'BooleanValue', value: true },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'resourceType' },
                value: { kind: 'EnumValue', value: 'CID' },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetBlockedCidsQuery, GetBlockedCidsQueryVariables>
export const GetBlockedAddressesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetBlockedAddresses' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'ctxSpaceId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'blockedResourceIds' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'ctxSpaceId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'ctxSpaceId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'blocked' },
                value: { kind: 'BooleanValue', value: true },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'resourceType' },
                value: { kind: 'EnumValue', value: 'Address' },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetBlockedAddressesQuery,
  GetBlockedAddressesQueryVariables
>
