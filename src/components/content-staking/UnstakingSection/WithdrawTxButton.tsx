import Button from '@/components/Button'
import { getBackerLedgerQuery } from '@/services/contentStaking/backerLedger/query'
import { getGeneralEraInfoData } from '@/services/contentStaking/generalErainfo/query'
import { useMyMainAddress } from '@/stores/my-account'
import { isEmptyArray } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useEffect, useMemo } from 'react'
import { WithdrawTxWrapper } from '../mutations/withdraw'

type WithdrawTxButtonProps = {
  switchToFirstTab?: () => void
}

const WithdrawTxButton = ({ switchToFirstTab }: WithdrawTxButtonProps) => {
  const myAddress = useMyMainAddress()

  const { data: ledger, isLoading: backerLedgerLoading } =
    getBackerLedgerQuery.useQuery(myAddress || '')
  const { data: eraInfo } = getGeneralEraInfoData()

  const { currentEra } = eraInfo || {}

  const unbondingChunks = ledger?.unbondingInfo.unbondingChunks

  useEffect(() => {
    if (unbondingChunks?.length === 0) {
      switchToFirstTab?.()
    }
  }, [unbondingChunks?.length])

  const isSomeAvailable = useMemo(() => {
    if (
      !currentEra ||
      !unbondingChunks ||
      isEmptyArray(unbondingChunks) ||
      backerLedgerLoading
    ) {
      return false
    }

    return unbondingChunks?.some((item) => {
      const { unlockEra } = item

      return new BN(currentEra).gte(new BN(unlockEra))
    })
  }, [!!unbondingChunks?.length, currentEra, backerLedgerLoading])

  return (
    <div className='md:self-end self-center'>
      <WithdrawTxWrapper loadingUntilTxSuccess>
        {({ mutateAsync, isLoading }) => {
          return (
            <Button
              onClick={() => {
                mutateAsync({})
              }}
              disabled={!isSomeAvailable}
              variant={'primary'}
              isLoading={isLoading}
              size={'md'}
              className='w-full text-base'
            >
              Withdraw my SUB
            </Button>
          )
        }}
      </WithdrawTxWrapper>
    </div>
  )
}

export default WithdrawTxButton
