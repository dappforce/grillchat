import { SocialEventDataApiInput } from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import {
  SyncExternalTokenBalancesMutation,
  SyncExternalTokenBalancesMutationVariables,
} from './generated'
import { datahubQueueRequest, throwErrorIfNotProcessed } from './utils'

const SYNC_EXTERNAL_TOKEN_BALANCES = gql`
  mutation SyncExternalTokenBalances($args: SocialProfileAddReferrerIdInput!) {
    socialProfileSyncExternalTokenBalance(args: $args) {
      processed
      callId
      message
    }
  }
`

export async function syncExternalTokenBalances(
  input: SocialEventDataApiInput
) {
  const res = await datahubQueueRequest<
    SyncExternalTokenBalancesMutation,
    SyncExternalTokenBalancesMutationVariables
  >({
    document: SYNC_EXTERNAL_TOKEN_BALANCES,
    variables: {
      args: input as any,
    },
  })
  throwErrorIfNotProcessed(
    res.socialProfileSyncExternalTokenBalance,
    'Failed to sync external token balances'
  )
}
