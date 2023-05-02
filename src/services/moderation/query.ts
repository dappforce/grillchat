import { createQuery } from '@/subsocial-query'
import { request } from 'graphql-request'
import { graphql } from './gql'
import { getModerationUrl } from './utils'

const GET_BLOCKED_IDS_IN_ROOT_POST_ID = graphql(`
  query GetBlockedIdsInRootPostId($rootPostId: String!) {
    blockedResourceIds(blocked: true, rootPostId: $rootPostId)
  }
`)

export async function getBlockedIdsInRootPostId(rootPostId: string) {
  const data = await request(
    getModerationUrl(),
    GET_BLOCKED_IDS_IN_ROOT_POST_ID,
    {
      rootPostId,
    }
  )
  return data.blockedResourceIds
}

export const getBlockedIdsInRootPostIdQuery = createQuery({
  key: 'getBlockedIdsInRootPostIdQuery',
  getData: getBlockedIdsInRootPostId,
})
