import { getBackerInfoQuery } from '@/services/contentStaking/backerInfo/query'
import { useMyMainAddress } from '@/stores/my-account'
import { isEmptyObj } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useMemo } from 'react'

export const useGetMyCreatorsIds = (spaceIds?: string[]) => {
  const myAddress = useMyMainAddress()

  const backerInfoData = getBackerInfoQuery.useQuery({
    spaceIds: spaceIds || [],
    account: myAddress || '',
  })

  const backerInfo = backerInfoData?.data

  return useMemo(() => {
    if (!backerInfo || isEmptyObj(backerInfo) || !spaceIds) return []

    const backerInfoEntries = Object.entries(backerInfo.info)

    return backerInfoEntries
      .filter(([_, info]) => !new BN(info?.totalStaked || 0).isZero())
      .map(([key]) => key)
  }, [Object.keys(backerInfo || {}).join(','), spaceIds?.length])
}
