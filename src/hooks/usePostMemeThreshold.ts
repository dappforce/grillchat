import { getTokenomicsMetadataQuery } from '@/services/datahub/content-staking/query'

export default function usePostMemeThreshold(chatId: string) {
  const { data: tokenomics, isLoading } =
    getTokenomicsMetadataQuery.useQuery(null)

  const threshold = tokenomics?.thresholdsAndRules?.find(
    (t) => t.contextPostId === chatId
  )
  const thresholdForAllChats = tokenomics?.thresholdsAndRules?.find(
    (t) => t.contextPostId === '*'
  )

  return {
    threshold: threshold || thresholdForAllChats,
    isLoading,
  }
}
