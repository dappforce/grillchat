import { SpaceContent } from '@subsocial/api/types'
import { gql } from 'graphql-request'

export type SubsocialProfile = {
  profileSpace: { id: string; content: SpaceContent | null } | null
  isUpdated: boolean
  address: string
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
        profileSource
        updatedAtTime
        experimental
      }
    }
  }
`
export async function getProfiles(
  addresses: string[]
): Promise<SubsocialProfile[]> {
  if (addresses.length === 0) return []
  return []
  // const res = await squidRequest<GetProfilesQuery, GetProfilesQueryVariables>({
  //   document: GET_PROFILES,
  //   variables: { addresses },
  // })
  // return res.accounts.map(({ id, profileSpace }) => ({
  //   profileSpace: profileSpace
  //     ? {
  //         id: profileSpace.id,
  //         content: {
  //           name: profileSpace.name,
  //           about: profileSpace.about,
  //           email: profileSpace.email,
  //           image: profileSpace.image,
  //           links: profileSpace.linksOriginal?.split(','),
  //           tags: profileSpace.tagsOriginal?.split(','),
  //           profileSource: profileSpace.profileSource,
  //         } as SpaceContent,
  //       }
  //     : null,
  //   isUpdated: !!profileSpace?.updatedAtTime,
  //   address: id,
  // }))
}
