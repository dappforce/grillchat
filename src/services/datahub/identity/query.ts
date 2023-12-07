import { createQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  GetLinkedIdentitiesQuery,
  GetLinkedIdentitiesQueryVariables,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'

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
async function getLinkedIdentities(address: string) {
  const data = await datahubQueryRequest<
    GetLinkedIdentitiesQuery,
    GetLinkedIdentitiesQueryVariables
  >({
    document: GET_LINKED_IDENTITIES,
    variables: {
      substrateAddress: address,
    },
  })

  return data.linkedIdentities.filter((identity) => identity.enabled)
}
export const getLinkedIdentitiesQuery = createQuery({
  key: 'getLinkedIdentities',
  fetcher: getLinkedIdentities,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})
