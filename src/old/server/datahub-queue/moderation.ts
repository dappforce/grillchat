import { gql } from 'graphql-request'
import {
  AddPostIdToOrgMutation,
  AddPostIdToOrgMutationVariables,
  BlockResourceMutation,
  BlockResourceMutationVariables,
  InitModerationOrgMutation,
  InitModerationOrgMutationVariables,
  ModerationCallInput,
  UnblockResourceMutation,
  UnblockResourceMutationVariables,
} from './generated'
import { datahubQueueRequest, throwErrorIfNotProcessed } from './utils'

export const INIT_MODERATION_ORG = gql`
  mutation InitModerationOrg($input: ModerationCallInput!) {
    moderationInitModerator(initModeratorInput: $input) {
      processed
      message
    }
  }
`
export async function initModerationOrg(variables: ModerationCallInput) {
  const data = await datahubQueueRequest<
    InitModerationOrgMutation,
    InitModerationOrgMutationVariables
  >({
    document: INIT_MODERATION_ORG,
    variables: { input: variables },
  })
  throwErrorIfNotProcessed(data.moderationInitModerator, 'Failed to init org')
  return data.moderationInitModerator?.message
}

export const ADD_POST_ID_TO_ORG = gql`
  mutation AddPostIdToOrg($input: ModerationCallInput!) {
    moderationAddContextToOrganization(addContextInput: $input) {
      processed
      message
    }
  }
`
export async function addPostIdToOrg(variables: ModerationCallInput) {
  const data = await datahubQueueRequest<
    AddPostIdToOrgMutation,
    AddPostIdToOrgMutationVariables
  >({
    document: ADD_POST_ID_TO_ORG,
    variables: { input: variables },
  })
  throwErrorIfNotProcessed(
    data.moderationAddContextToOrganization,
    'Failed to add org'
  )
  return data.moderationAddContextToOrganization?.message
}

export const BLOCK_RESOURCE = gql`
  mutation BlockResource($input: ModerationCallInput!) {
    moderationBlockResource(blockResourceInput: $input) {
      processed
      message
    }
  }
`
export async function blockResource(variables: ModerationCallInput) {
  const res = await datahubQueueRequest<
    BlockResourceMutation,
    BlockResourceMutationVariables
  >({
    document: BLOCK_RESOURCE,
    variables: { input: variables },
  })
  throwErrorIfNotProcessed(
    res.moderationBlockResource,
    'Failed to block resource'
  )
  return res.moderationBlockResource?.message
}

export const UNBLOCK_RESOURCE = gql`
  mutation UnblockResource($input: ModerationCallInput!) {
    moderationUnblockResource(unblockResourceInput: $input) {
      processed
      message
    }
  }
`
export async function unblockResource(variables: ModerationCallInput) {
  const res = await datahubQueueRequest<
    UnblockResourceMutation,
    UnblockResourceMutationVariables
  >({
    document: UNBLOCK_RESOURCE,
    variables: { input: variables },
  })
  throwErrorIfNotProcessed(
    res.moderationUnblockResource,
    'Failed to unblock resource'
  )
  return res.moderationUnblockResource?.message
}
