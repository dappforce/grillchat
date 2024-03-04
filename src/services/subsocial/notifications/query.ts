import { createQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  GetNotificationsCountQuery,
  GetNotificationsCountQueryVariables,
} from '../squid/generated'
import { squidRequest } from '../squid/utils'

export const GET_NOTIFICATIONS_COUNT = gql`
  query GetNotificationsCount(
    $address: String!
    $afterDate: DateTime = "1970-01-01T00:00:00.000Z"
  ) {
    notificationsConnection(
      orderBy: id_ASC
      where: {
        account: { id_eq: $address }
        activity: {
          aggregated_eq: true
          date_gt: $afterDate
          account: { id_not_eq: $address }
        }
      }
    ) {
      totalCount
    }
  }
`
async function getNotificationCount(
  variables: GetNotificationsCountQueryVariables
) {
  const count = await squidRequest<
    GetNotificationsCountQuery,
    GetNotificationsCountQueryVariables
  >({
    document: GET_NOTIFICATIONS_COUNT,
    variables,
  })
  return count.notificationsConnection.totalCount
}

export const getNotificationCountQuery = createQuery({
  key: 'notif-count',
  fetcher: getNotificationCount,
  defaultConfigGenerator: (param) => ({
    enabled: !!param?.address,
  }),
})
