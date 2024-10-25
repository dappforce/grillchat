import { gql } from 'graphql-request'
import {
  SetReferrerIdMutation,
  SetReferrerIdMutationVariables,
  SocialProfileAddReferrerIdInput,
} from './generated'
import {
  backendSigWrapper,
  datahubQueueRequest,
  throwErrorIfNotProcessed,
} from './utils'

const SET_REFERRER_ID = gql`
  mutation SetReferrerId(
    $setReferrerIdInput: SocialProfileAddReferrerIdInput!
  ) {
    socialProfileAddReferrerId(args: $setReferrerIdInput) {
      processed
      message
    }
  }
`
export async function setReferrerId(input: SocialProfileAddReferrerIdInput) {
  const signedPayload = await backendSigWrapper(input)
  const res = await datahubQueueRequest<
    SetReferrerIdMutation,
    SetReferrerIdMutationVariables
  >({
    document: SET_REFERRER_ID,
    variables: {
      setReferrerIdInput: signedPayload,
    },
  })
  throwErrorIfNotProcessed(
    res.socialProfileAddReferrerId,
    'Failed to set referrer id'
  )
}
