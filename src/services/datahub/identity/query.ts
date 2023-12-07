import { createQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  GetLinkedIdentitiesQuery,
  GetLinkedIdentitiesQueryVariables,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'

// TODO: need batch call pool query to improve performance
const GET_LINKED_IDENTITIES = gql`
  query GetLinkedIdentities($substrateAddress: String!) {
    linkedIdentities(where: { substrateAddress: $substrateAddress }) {
      id
      externalId
      provider
      enabled
      substrateAccount {
        id
      }
    }
  }
`
async function getLinkedIdentity(address: string) {
  const data = await datahubQueryRequest<
    GetLinkedIdentitiesQuery,
    GetLinkedIdentitiesQueryVariables
  >({
    document: GET_LINKED_IDENTITIES,
    variables: {
      substrateAddress: address,
    },
  })

  return data.linkedIdentities.filter((identity) => identity.enabled)?.[0]
}
export const getLinkedIdentityQuery = createQuery({
  key: 'getLinkedIdentity',
  fetcher: getLinkedIdentity,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})
