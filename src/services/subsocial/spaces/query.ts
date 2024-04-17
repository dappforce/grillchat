import { datahubQueryRequest } from '@/services/datahub/utils'
import { createQuery, poolQuery } from '@/subsocial-query'
import { SubsocialQueryData } from '@/subsocial-query/subsocial/query'
import { SpaceData } from '@subsocial/api/types'
import { gql } from 'graphql-request'

const getSpaceFromBlockchain = poolQuery<SubsocialQueryData<string>, SpaceData>(
  {
    name: 'getSpaceFromBlockchain',
    multiCall: async (allParams) => {
      if (allParams.length === 0) return []
      const [{ api }] = allParams
      const spaceIds = allParams.map(({ data }) => data).filter((id) => !!id)
      if (spaceIds.length === 0) return []

      return await api.findSpaces({ ids: spaceIds, visibility: 'onlyPublic' })
    },
    resultMapper: {
      paramToKey: (param) => param.data,
      resultToKey: (result) => result?.id ?? '',
    },
  }
)

// TODO: update this with correct fragment
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
