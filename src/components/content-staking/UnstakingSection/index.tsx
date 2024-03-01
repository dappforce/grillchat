import FormatBalance from '@/components/FormatBalance'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getBackerLedgerQuery } from '@/services/contentStaking/backerLedger/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { convertToBalanceWithDecimal, isEmptyArray } from '@subsocial/utils'
import { useMemo } from 'react'
import { sectionTitleStyles } from '../utils/commonStyles'
import UnstakingTable, { TimeRemaining } from './UnstakingTable'
import WithdrawTxButton from './WithdrawTxButton'

const UnstakingSection = () => {
  const myAddress = useMyMainAddress()
  const { decimal, tokenSymbol } = useGetChainDataByNetwork('subsocial') || {}

  const { data: ledger, isLoading } = getBackerLedgerQuery.useQuery(
    myAddress || ''
  )

  const data = useMemo(() => {
    if (!ledger) {
      return []
    }

    return ledger.unbondingInfo.unbondingChunks.map((item, i) => {
      const amountWithDecimals = convertToBalanceWithDecimal(
        item.amount,
        decimal || 0
      )

      const amount = (
        <FormatBalance
          value={amountWithDecimals.toString()}
          symbol={tokenSymbol}
          loading={isLoading}
        />
      )

      const unstakingAmount = isTouchDevice() ? (
        <div>
          <div>{amount}</div>
          <TimeRemaining
            className='text-sm text-text-muted'
            unlockEra={item.unlockEra}
          />
        </div>
      ) : (
        amount
      )

      return {
        batch: i + 1,
        unstakingAmount,
        timeRemaining: <TimeRemaining unlockEra={item.unlockEra} />,
      }
    })
  }, [!!ledger, isLoading, myAddress, isTouchDevice()])

  if (isEmptyArray(data)) return null

  return (
    <div className='z-[1] flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <div className={cx(sectionTitleStyles)}>Unlocking my SUB tokens</div>
        {!isTouchDevice() && <WithdrawTxButton />}
      </div>
      <UnstakingTable data={data} />
      {isTouchDevice() && <WithdrawTxButton />}
    </div>
  )
}

export default UnstakingSection
