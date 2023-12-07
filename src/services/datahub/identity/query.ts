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
export type Identity = {
  id: string
  externalId: string
  provider: string
  substrateAccount: string
}
async function getLinkedIdentity(address: string): Promise<Identity | null> {
  const data = await datahubQueryRequest<
    GetLinkedIdentitiesQuery,
    GetLinkedIdentitiesQueryVariables
  >({
    document: GET_LINKED_IDENTITIES,
    variables: {
      substrateAddress: address,
    },
  })

  const identity = data.linkedIdentities.filter(
    (identity) => identity.enabled
  )?.[0]
  if (!identity) return null
  return {
    externalId: identity.externalId,
    id: identity.id,
    provider: identity.provider,
    substrateAccount: identity.substrateAccount.id,
  }
}
export const getLinkedIdentityQuery = createQuery({
  key: 'getLinkedIdentity',
  fetcher: getLinkedIdentity,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})
