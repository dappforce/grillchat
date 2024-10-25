import { datahubQueryRequest } from '@/services/datahub/utils'
import { SpaceContent } from '@subsocial/api/types'
import { gql } from 'graphql-request'
import { GetProfilesQuery, GetProfilesQueryVariables } from '../generated-query'

export type SubsocialProfile = {
  profileSpace: { id: string; content: SpaceContent | null } | null
  isUpdated: boolean
  address: string
}

const GET_PROFILES = gql`
  query GetProfiles($addresses: [String!], $pageSize: Int!) {
    spaces(
      args: {
        filter: { asProfileForAccounts: $addresses }
        pageSize: $pageSize
      }
    ) {
      data {
        id
        name
        image
        about
        updatedAtTime
        createdAtTime
        profileSpace {
          id
        }
      }
    }
  }
`
export async function getProfiles(
  addresses: string[]
): Promise<SubsocialProfile[]> {
  if (addresses.length === 0) return []
  const res = await datahubQueryRequest<
    GetProfilesQuery,
    GetProfilesQueryVariables & { pageSize: number }
  >({
    document: GET_PROFILES,
    variables: { addresses, pageSize: addresses.length + 1 },
  })
  return res.spaces.data.map((space) => ({
    isUpdated: space.updatedAtTime !== space.createdAtTime,
    profileSpace: {
      content: {
        name: space.name,
        image: space.image,
        about: space.about,
      } as SpaceContent,
      id: space.id,
    },
    address: space.profileSpace?.id ?? '',
  }))
}
