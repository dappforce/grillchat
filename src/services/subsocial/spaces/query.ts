import { poolQuery } from '@/subsocial-query'
import {
  createSubsocialQuery,
  SubsocialQueryData,
} from '@/subsocial-query/subsocial/query'
import { SpaceData } from '@subsocial/api/types'

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

export const getSpaceQuery = createSubsocialQuery({
  key: 'getSpace',
  fetcher: getSpaceFromBlockchain,
})

// const getSpaceFromGraphql = poolQuery<string, SpaceData>(
//   {
//     multiCall: async (allParams) => {
//       if (allParams.length === 0) return []
//       createSubsocialGraphqlRequest()
//     }
//   }
// )
