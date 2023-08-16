import { createQuery, poolQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import { GetProfilesQuery, GetProfilesQueryVariables } from './generated'
import { mainnetSquidRequest } from './utils'

const GET_PROFILES = gql`
  query GetProfiles($addresses: [String!]!) {
    accounts(where: { id_in: $addresses }) {
      id
      profileSpace {
        name
        image
      }
    }
  }
`
const getProfile = poolQuery<string, GetProfilesQuery['accounts'][number]>({
  multiCall: async (addresses) => {
    const filteredAddresses = addresses.filter(Boolean)
    if (!filteredAddresses.length) return []

    const res = await mainnetSquidRequest<
      GetProfilesQuery,
      GetProfilesQueryVariables
    >({
      document: GET_PROFILES,
      variables: { addresses: filteredAddresses },
    })
    return res.accounts
  },
})
export const getProfileQuery = createQuery({
  key: 'getProfile',
  fetcher: getProfile,
})
