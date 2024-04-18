import { poolQuery } from '@/subsocial-query'
import { SpaceData } from '@subsocial/api/types'
import { gql } from 'graphql-request'
import { datahubQueryRequest } from '../utils'

// TODO: update this with correct fragment and change to datahub query, also change imports for the usages
const SPACE_FRAGMENT = gql`
  fragment SpaceFragment on Space {
    id
    name
    content {
      image
      name
    }
  }
`
export const GET_SPACES = gql`
  ${SPACE_FRAGMENT}
  query getSpaces($ids: [String!]) {
    spaces(where: { id_in: $ids, hidden_eq: false }) {
      ...SpaceFragment
    }
  }
`
const getSpaces = poolQuery<string, SpaceData>({
  name: 'getSpaceFromSquid',
  multiCall: async (spaceIds) => {
    if (spaceIds.length === 0) return []
    // TODO: update this with correct type
    const res = await datahubQueryRequest({
      document: GET_SPACES,
      variables: { ids: spaceIds },
    })
    return res.spaces.map((space) => mapSpaceFragment(space))
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
