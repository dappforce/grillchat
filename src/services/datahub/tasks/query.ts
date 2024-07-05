import { createQuery } from '@/subsocial-query'
import { QueryClient } from '@tanstack/react-query'
import { getGamificationTasks } from '.'

export const getGamificationTasksQuery = createQuery({
  key: 'gamificationTasks',
  fetcher: getGamificationTasks,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const getGamificationTasksErrorQuery = createQuery({
  key: 'gamificationTasksError',
  fetcher: async (error: string) => {
    if (error === 'error') return undefined

    return error
  },
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const clearGamificationTasksError = (client: QueryClient) => {
  getGamificationTasksErrorQuery.setQueryData(client, 'error', () => undefined)
}
