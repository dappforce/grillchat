import { gql } from 'graphql-request'
import {
  GetLinkedIdentitiesFromProviderIdQuery,
  GetLinkedIdentitiesFromProviderIdQueryVariables,
  GetLinkedIdentitiesQuery,
  GetLinkedIdentitiesQueryVariables,
  IdentityProvider,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'

export type Identity = {
  mainAddress: string
  externalProviders: {
    id: string
    provider: IdentityProvider
    externalId: string
    username?: string | null
    createdAtTime: string
    enabled: boolean
  }[]
}

const GET_LINKED_IDENTITIES = gql`
  query GetLinkedIdentities($where: LinkedIdentityArgs!) {
    linkedIdentity(where: $where) {
      id
      externalProviders {
        id
        externalId
        username
        provider
        enabled
        createdAtTime
      }
    }
  }
`
export async function getLinkedIdentity(
  where: GetLinkedIdentitiesQueryVariables['where']
): Promise<Identity | null> {
  const data = await datahubQueryRequest<
    GetLinkedIdentitiesQuery,
    GetLinkedIdentitiesQueryVariables
  >({
    document: GET_LINKED_IDENTITIES,
    variables: {
      where,
    },
  })

  const identities = data.linkedIdentity?.externalProviders?.filter(
    (identity) => identity.enabled
  )

  if (!data.linkedIdentity) return null

  return {
    mainAddress: data.linkedIdentity.id,
    externalProviders: identities ?? [],
  }
}

const GET_LINKED_IDENTITIES_FROM_PROVIDER_ID = gql`
  query GetLinkedIdentitiesFromProviderId(
    $provider: IdentityProvider!
    $externalId: String!
  ) {
    linkedIdentity(
      where: {
        externalProvider: { provider: $provider, externalId: $externalId }
      }
    ) {
      id
      externalProviders {
        enabled
      }
    }
  }
`
export async function getLinkedIdentityFromProviderId(args: {
  provider: IdentityProvider
  externalId: string
}): Promise<string | null> {
  const data = await datahubQueryRequest<
    GetLinkedIdentitiesFromProviderIdQuery,
    GetLinkedIdentitiesFromProviderIdQueryVariables
  >({
    document: GET_LINKED_IDENTITIES_FROM_PROVIDER_ID,
    variables: args,
  })

  return data.linkedIdentity?.id ?? null
}
