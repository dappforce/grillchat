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
  id: string
  externalId: string
  provider: IdentityProvider
  substrateAccount: string
}

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
export async function getLinkedIdentity(
  address: string
): Promise<Identity | null> {
  const data = await datahubQueryRequest<
    GetLinkedIdentitiesQuery,
    GetLinkedIdentitiesQueryVariables
  >({
    document: GET_LINKED_IDENTITIES,
    variables: {
      substrateAddress: address,
    },
  })

  const identities = data.linkedIdentities.filter(
    (identity) => identity.enabled
  )
  const identityPriorityOrder = [
    IdentityProvider.Polkadot,
    IdentityProvider.Twitter,
    IdentityProvider.Google,
    IdentityProvider.Facebook,
    IdentityProvider.Evm,
    IdentityProvider.Email,
  ]
  const identitiesSorted = identities.toSorted((a, b) => {
    const aIndex = identityPriorityOrder.indexOf(a.provider)
    const bIndex = identityPriorityOrder.indexOf(b.provider)
    return aIndex - bIndex
  })
  const identity = identitiesSorted[0]

  if (!identity) return null
  return {
    externalId: identity.externalId,
    id: identity.id,
    provider: identity.provider,
    substrateAccount: identity.substrateAccount.id,
  }
}

const GET_LINKED_IDENTITIES_FROM_TWITTER_ID = gql`
  query GetLinkedIdentitiesFromTwitterId($twitterId: String!) {
    linkedIdentities(where: { externalId: $twitterId, provider: TWITTER }) {
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
export async function getLinkedIdentityFromTwitterId(
  twitterId: string
): Promise<string[]> {
  const data = await datahubQueryRequest<
    GetLinkedIdentitiesFromTwitterIdQuery,
    GetLinkedIdentitiesFromTwitterIdQueryVariables
  >({
    document: GET_LINKED_IDENTITIES_FROM_TWITTER_ID,
    variables: { twitterId },
  })

  const identities = data.linkedIdentities.filter(
    (identity) => identity.enabled
  )
  return identities.map((identity) => identity.substrateAccount.id)
}
