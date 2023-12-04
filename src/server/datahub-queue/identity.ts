import { SocialEventDataApiInput } from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'
import {
  LinkIdentityMutation,
  LinkIdentityMutationVariables,
} from './generated'
import { backendSigWrapper, datahubQueueRequest } from './utils'

const LINK_IDENTITY_MUTATION = gql`
  mutation LinkIdentity(
    $createLinkedIdentityInput: CreateMutateLinkedIdentityInput!
  ) {
    createLinkedIdentity(
      createLinkedIdentityInput: $createLinkedIdentityInput
    ) {
      processed
      message
    }
  }
`

export async function linkIdentity(input: SocialEventDataApiInput) {
  await backendSigWrapper(input)
  await datahubQueueRequest<
    LinkIdentityMutation,
    LinkIdentityMutationVariables
  >({
    document: LINK_IDENTITY_MUTATION,
    variables: {
      createLinkedIdentityInput: input as any,
    },
  })
}

// const UNLINK_IDENTITY_MUTATION = gql`
//   mutation UnlinkIdentity(
//     $createLinkedIdentityInput: CreateMutateLinkedIdentityInput!
//   ) {
//     deleteLinkedIdentity(
//       createLinkedIdentityInput: $createLinkedIdentityInput
//     ) {
//       processed
//       message
//     }
//   }
// `
// export async function unlinkIdentity(input: CreateMutateLinkedIdentityInput) {
//   // TODO: remove this when we have a better way to sign
//   await backendSigWrapper(input)
//   await datahubQueueRequest<
//     Mutation['deleteLinkedIdentity'],
//     MutationDeleteLinkedIdentityArgs
//   >({
//     document: UNLINK_IDENTITY_MUTATION,
//     variables: {
//       deleteLinkedIdentityInput: input,
//     },
//   })
// }
