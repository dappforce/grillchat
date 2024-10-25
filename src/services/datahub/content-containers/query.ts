import { createQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  ContentContainerConfigsArgsInputDto,
  GetContentContainersQuery,
  GetContentContainersQueryVariables,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'

const GET_CONTENT_CONTAINERS = gql`
  query GetContentContainers($args: ContentContainerConfigsArgsInputDto!) {
    contentContainerConfigs(args: $args) {
      data {
        id
        rootPost {
          id
        }
        rootSpace {
          id
        }
        metadata {
          title
          description
          coverImage
          image
          isExternalTokenRewardPool
          rewardPoolAmount
          winnersNumber
        }
        openAt
        closedAt
        expirationWindowFrom
        expirationWindowTo
        createCommentPricePointsAmount
        containerType
        accessThresholdPointsAmount
        likeThresholdExternalTokenAmount
        accessThresholdExternalTokenAmount
        externalToken {
          id
          chain
          name
          address
          decimals
        }
      }
      total
      offset
    }
  }
`
export type ContentContainer =
  GetContentContainersQuery['contentContainerConfigs']['data'][0]
export const getContentContainersQuery = createQuery({
  key: 'getContentContainers',
  fetcher: async (args: ContentContainerConfigsArgsInputDto) => {
    const res = await datahubQueryRequest<
      GetContentContainersQuery,
      GetContentContainersQueryVariables
    >({
      document: GET_CONTENT_CONTAINERS,
      variables: { args },
    })
    return res.contentContainerConfigs
  },
})
