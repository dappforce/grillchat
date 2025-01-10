import { createQuery, poolQuery } from '@/subsocial-query'
import { SpaceData } from '@subsocial/api/types'
import { gql } from 'graphql-request'
import { GetSpacesQuery, GetSpacesQueryVariables } from '../generated-query'
import { mapDatahubSpaceFragment } from '../mappers'
import { datahubQueryRequest } from '../utils'

const SPACE_FRAGMENT = gql`
  fragment SpaceFragment on Space {
    name
    image
    about
    id
    hidden
    about
    content
    # createdByAccount {
    #   id
    # }
    # ownedByAccount {
    #   id
    # }
    createdAtTime
    createdAtBlock
  }
`
export const GET_SPACES = gql`
  ${SPACE_FRAGMENT}
  query getSpaces($ids: [String!]) {
    spaces(args: { filter: { ids: $ids } }) {
      data {
        ...SpaceFragment
      }
    }
  }
`
const getSpaces = poolQuery<string, SpaceData>({
  name: 'getSpaces',
  multiCall: async (spaceIds) => {
    if (spaceIds.length === 0) return []
    const res = await datahubQueryRequest<
      GetSpacesQuery,
      GetSpacesQueryVariables
    >({
      document: GET_SPACES,
      variables: { ids: spaceIds },
    })

    return res.spaces.data.map((space) =>
      mapDatahubSpaceFragment({
        ...space,
        createdByAccount: { id: '0x8b4fF9452aE997a9E442C67D1155a18EDEA3Be6F' },
        ownedByAccount: { id: '0x8b4fF9452aE997a9E442C67D1155a18EDEA3Be6F' },
      })
    )
  },
  resultMapper: {
    paramToKey: (param) => param,
    resultToKey: (result) => result?.id ?? '',
  },
})

export const getSpaceQuery = createQuery({
  key: 'space',
  fetcher: getSpaces,
  defaultConfigGenerator: (spaceId) => ({
    enabled: !!spaceId,
  }),
})
