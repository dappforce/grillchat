import { createQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  GetReferrerIdQuery,
  GetReferrerIdQueryVariables,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'

const GET_REFERRER_ID = gql`
  query GetReferrerId($address: String!) {
    socialProfiles(args: { where: { substrateAddresses: [$address] } }) {
      data {
        referrersList {
          referrerId
        }
      }
    }
  }
`
async function getReferrerId(address: string) {
  const res = await datahubQueryRequest<
    GetReferrerIdQuery,
    GetReferrerIdQueryVariables
  >({
    document: GET_REFERRER_ID,
    variables: { address },
  })

  return res.socialProfiles.data[0].referrersList?.[0]?.referrerId
}
export const getReferrerIdQuery = createQuery({
  key: 'getReferrerId',
  fetcher: getReferrerId,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})
