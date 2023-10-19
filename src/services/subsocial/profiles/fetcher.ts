import { SubsocialQueryData } from '@/subsocial-query/subsocial/query'
import { SpaceContent } from '@subsocial/api/types'
import { gql } from 'graphql-request'
import { GetProfilesQuery, GetProfilesQueryVariables } from '../squid/generated'
import { squidRequest } from '../squid/utils'
import { standaloneDynamicFetcherWrapper } from '../utils'

export type SubsocialProfile = {
  profileSpace: { id: string; content: SpaceContent | null } | null
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
      content,
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
        about
        email
        linksOriginal
        tagsOriginal
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
          content: {
            name: profileSpace.name,
            about: profileSpace.about,
            email: profileSpace.email,
            image: profileSpace.image,
            links: profileSpace.linksOriginal?.split(','),
            tags: profileSpace.tagsOriginal?.split(','),
            // TODO: have squid support for this attr
            // defaultProfile:
          } as SpaceContent,
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
