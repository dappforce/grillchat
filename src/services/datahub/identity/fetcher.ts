import { gql } from 'graphql-request'
import {
  GetLinkedIdentitiesFromTwitterIdQuery,
  GetLinkedIdentitiesFromTwitterIdQueryVariables,
  GetLinkedIdentitiesQuery,
  GetLinkedIdentitiesQueryVariables,
  IdentityProvider,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'

export type Identity = {
  mainAddress: string
  externalProviders: {
    provider: IdentityProvider
    externalId: string
  }[]
}

const GET_LINKED_IDENTITIES = gql`
  query GetLinkedIdentities($where: LinkedIdentityArgs!) {
    linkedIdentity(where: $where) {
      id
      externalProviders {
        id
        externalId
        provider
        enabled
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

const GET_LINKED_IDENTITIES_FROM_TWITTER_ID = gql`
  query GetLinkedIdentitiesFromTwitterId($twitterId: String!) {
    linkedIdentity(
      where: { externalProvider: { provider: TWITTER, externalId: $twitterId } }
    ) {
      id
      externalProviders {
        enabled
      }
    }
  }
`
export async function getLinkedIdentityFromTwitterId(
  twitterId: string
): Promise<string | null> {
  const data = await datahubQueryRequest<
    GetLinkedIdentitiesFromTwitterIdQuery,
    GetLinkedIdentitiesFromTwitterIdQueryVariables
  >({
    document: GET_LINKED_IDENTITIES_FROM_TWITTER_ID,
    variables: { twitterId },
  })

  return data.linkedIdentity?.id ?? null
}
