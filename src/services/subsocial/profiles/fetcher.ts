import { SubsocialQueryData } from '@/subsocial-query/subsocial/query'
import { gql } from 'graphql-request'
import { GetProfilesQuery, GetProfilesQueryVariables } from '../squid/generated'
import { squidRequest } from '../squid/utils'
import { standaloneDynamicFetcherWrapper } from '../utils'

export type SubsocialProfile = {
  name?: string
  image?: string
  address: string
}

async function getProfilesFromBlockchain({
  api,
  data: addresses,
}: SubsocialQueryData<string[]>): Promise<SubsocialProfile[]> {
  if (addresses.length === 0) return []
  const res = await api.findProfileSpaces(addresses)
  return res.map(({ content, id }) => ({
    name: content?.name,
    address: id,
    image: content?.image,
  }))
}

const GET_PROFILES = gql`
  query GetProfiles($addresses: [String!]) {
    accounts(where: { id_in: $addresses }) {
      id
      profileSpace {
        name
        image
      }
    }
  }
`
async function getProfilesFromSquid(
  addresses: string[]
): Promise<SubsocialProfile[]> {
  if (addresses.length === 0) return []
  const res = await squidRequest<GetProfilesQuery, GetProfilesQueryVariables>({
    document: GET_PROFILES,
    variables: { addresses },
  })
  return res.accounts.map(({ id, profileSpace }) => ({
    name: profileSpace?.name ?? undefined,
    address: id,
    image: profileSpace?.image ?? undefined,
  }))
}

export const getProfilesFromSubsocial = standaloneDynamicFetcherWrapper<
  string[],
  SubsocialProfile[]
>({
  blockchain: getProfilesFromBlockchain,
  squid: getProfilesFromSquid,
})
