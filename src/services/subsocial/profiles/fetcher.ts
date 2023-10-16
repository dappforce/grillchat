import { SubsocialQueryData } from '@/subsocial-query/subsocial/query'
import { gql } from 'graphql-request'
import { GetProfilesQuery, GetProfilesQueryVariables } from '../squid/generated'
import { squidRequest } from '../squid/utils'
import { standaloneDynamicFetcherWrapper } from '../utils'

export type SubsocialProfile = {
  profileSpace: {
    id: string
    name?: string
    image?: string
    defaultProfile?: string
  } | null
  address: string
}

async function getProfilesFromBlockchain({
  api,
  data: addresses,
}: SubsocialQueryData<string[]>): Promise<SubsocialProfile[]> {
  if (addresses.length === 0) return []
  const res = await api.findProfileSpaces(addresses)
  return res.map(({ content, id, struct: { ownerId } }) => ({
    profileSpace: {
      id,
      name: content?.name,
      image: content?.image,
      defaultProfile: (content as any)?.defaultProfile,
    },
    address: ownerId,
  }))
}

const GET_PROFILES = gql`
  query GetProfiles($addresses: [String!]) {
    accounts(where: { id_in: $addresses }) {
      id
      profileSpace {
        id
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
    profileSpace: profileSpace
      ? {
          id: profileSpace.id,
          name: profileSpace.name ?? undefined,
          image: profileSpace.image ?? undefined,
        }
      : null,
    address: id,
  }))
}

export const getProfilesFromSubsocial = standaloneDynamicFetcherWrapper<
  string[],
  SubsocialProfile[]
>({
  blockchain: getProfilesFromBlockchain,
  squid: getProfilesFromSquid,
})
