import { poolQuery } from '@/subsocial-query'
import { SubsocialQueryData } from '@/subsocial-query/subsocial/query'
import { SpaceData } from '@subsocial/api/types'
import { gql } from 'graphql-request'
import { SPACE_FRAGMENT } from '../squid/fragments'
import { GetSpacesQuery, GetSpacesQueryVariables } from '../squid/generated'
import { mapSpaceFragment } from '../squid/mappers'
import { squidRequest } from '../squid/utils'
import { createDynamicSubsocialQuery } from '../utils'

const getSpaceFromBlockchain = poolQuery<SubsocialQueryData<string>, SpaceData>(
  {
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

export const GET_SPACES = gql`
  ${SPACE_FRAGMENT}
  query getSpaces($ids: [String!]) {
    spaces(where: { id_in: $ids, hidden_eq: false }) {
      ...SpaceFragment
    }
  }
`
const getSpaceFromSquid = poolQuery<string, SpaceData>({
  multiCall: async (spaceIds) => {
    if (spaceIds.length === 0) return []
    const res = await squidRequest<GetSpacesQuery, GetSpacesQueryVariables>({
      document: GET_SPACES,
      variables: { ids: spaceIds },
    })
    return res.spaces.map((space) => mapSpaceFragment(space))
  },
})

export const getSpaceQuery = createDynamicSubsocialQuery('getSpace', {
  blockchain: getSpaceFromBlockchain,
  squid: getSpaceFromSquid,
})
