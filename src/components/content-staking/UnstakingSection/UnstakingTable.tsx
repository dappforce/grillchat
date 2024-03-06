import Table, { Column } from '@/components/Table'
import { getGeneralEraInfoData } from '@/services/contentStaking/generalErainfo/query'
import { isTouchDevice } from '@/utils/device'
import { SubDate } from '@subsocial/utils'
import BN from 'bignumber.js'
import clsx from 'clsx'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { BiTimeFive } from 'react-icons/bi'
import { useGetNextEraTime } from '../hooks/useGetNextEraTime'
import { useBlockNumberContext } from '../utils/BlockNumberContext'

type TimeRemainingProps = {
  unlockEra: string
  className?: string
}

export const TimeRemaining = ({ unlockEra, className }: TimeRemainingProps) => {
  const { data: eraInfo } = getGeneralEraInfoData()
  const { currentBlockNumber } = useBlockNumberContext()
  const { currentEra, blockPerEra, nextEraBlock } = eraInfo || {}

  const blocksToNextEra = new BN(nextEraBlock || '0').minus(
    new BN(currentBlockNumber || '0')
  )

  const erasToUnlock = new BN(unlockEra || '0')
    .minus(new BN(1))
    .minus(new BN(currentEra || '0'))

  const blocksToUnlock = erasToUnlock
    .multipliedBy(new BN(blockPerEra || '0'))
    .plus(blocksToNextEra)

  const unlockBlockNumber = blocksToUnlock
    .plus(currentBlockNumber || new BN(0))
    .toString()

  const time = useGetNextEraTime(unlockBlockNumber)

  if (!currentEra || !blockPerEra) return <>-</>

  const isNotAvailable = new BN(unlockEra).gt(new BN(currentEra))

  return (
    <div className={clsx('flex items-center justify-end gap-2', className)}>
      {isNotAvailable ? (
        <>
          {SubDate.formatDate(time.toNumber()).replace('in', '')}{' '}
          <BiTimeFive className='text-text-muted' size={20} />
        </>
      ) : (
        <>
          Available{' '}
          <AiOutlineCheckCircle className='text-green-500' size={20} />
        </>
      )}
    </div>
  )
}

type UnstakingTableProps = {
  data: {
    batch: number
    unstakingAmount: JSX.Element
    timeRemaining: JSX.Element
  }[]
}

const UnstakingTable = ({ data }: UnstakingTableProps) => {
  const columns: Column[] = [
    {
      index: 'batch',
      name: 'Batch',
    },
    {
      index: 'unstakingAmount',
      name: 'Unstaking Amount',
      align: 'right',
    },
  ]

  if (!isTouchDevice()) {
    columns.push({
      index: 'timeRemaining',
      name: 'Time Remaining',
      align: 'right',
    })
  }

  return <Table columns={columns} data={data} />
}

export default UnstakingTable
