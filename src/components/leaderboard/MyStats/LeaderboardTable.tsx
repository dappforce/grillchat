import AddressAvatar from '@/components/AddressAvatar'
import FormatBalance from '@/components/FormatBalance'
import LinkText from '@/components/LinkText'
import Name from '@/components/Name'
import Table, { Column } from '@/components/Table'
import { getProfileQuery } from '@/services/api/query'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getLeaderboardDataQuery } from '@/services/datahub/leaderboard/query'
import { convertToBalanceWithDecimal } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useState } from 'react'
import { useLeaderboardContext } from '../LeaderboardContext'
import LeaderboardModal from './LeaderboardModal'

const TABLE_LIMIT = 10

export const leaderboardColumns: Column[] = [
  {
    index: 'rank',
    name: '#',
    className: 'p-0 text-text-muted py-2 w-[5%]',
  },
  {
    index: 'staker',
    name: 'Staker',
    align: 'left',
    className: 'p-0 py-2',
  },
  {
    index: 'rewards',
    name: 'Rewards',
    align: 'right',
    className: 'p-0 py-2 w-[20%]',
  },
]

type LeaderboardTableProps = {
  address: string
}

const LeaderboardTable = ({ address }: LeaderboardTableProps) => {
  const { leaderboardRole } = useLeaderboardContext()
  const [openModal, setOpenModal] = useState(false)

  const { data: leaderboardData, isLoading } =
    getLeaderboardDataQuery.useInfiniteQuery(leaderboardRole)

  const data =
    leaderboardData?.pages[0].data
      .map((item) => ({
        rank: item.rank! + 1,
        staker: <UserPreview address={item.address} />,
        rewards: <UserReward reward={item.reward} />,
      }))
      .slice(0, TABLE_LIMIT) || []

  return (
    <>
      <div className='flex flex-col gap-6 rounded-2xl bg-slate-800 p-4'>
        <div className='flex flex-col gap-2'>
          <span className='text-lg font-bold leading-normal'>
            Staker Leaderboard
          </span>
          <span className='text-sm leading-normal text-text-muted'>
            Users ranked by the amount of SUB earned with Content Staking this
            week.
          </span>
        </div>
        <div className='flex w-full flex-col'>
          <Table
            columns={leaderboardColumns}
            data={data}
            className='rounded-none !bg-transparent dark:!bg-transparent [&>table]:table-fixed'
            headerClassName='!bg-transparent dark:!bg-transparent'
            withDivider={false}
          />
          <LinkText
            className='w-full text-center hover:no-underline'
            onClick={() => setOpenModal(true)}
            variant={'primary'}
          >
            View more
          </LinkText>
        </div>
      </div>

      <LeaderboardModal
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
      />
    </>
  )
}

type UserRewardProps = {
  reward: string
}

export const UserReward = ({ reward }: UserRewardProps) => {
  const { tokenSymbol, decimal } = useGetChainDataByNetwork('subsocial') || {}

  const rewardWithDecimal =
    reward && decimal ? convertToBalanceWithDecimal(reward, decimal) : new BN(0)

  return (
    <FormatBalance
      value={rewardWithDecimal.toString()}
      symbol={tokenSymbol}
      defaultMaximumFractionDigits={2}
    />
  )
}

type UserPreviewProps = {
  address: string
}

export const UserPreview = ({ address }: UserPreviewProps) => {
  const { data: profile } = getProfileQuery.useQuery(address)

  const about = profile?.profileSpace?.content?.about

  return (
    <div className='flex items-center gap-2'>
      <AddressAvatar address={address} className='h-[38px] w-[38px]' />
      <div className='flex flex-col gap-2'>
        <Name
          address={address}
          className='text-sm font-medium leading-none !text-text'
        />
        {about && (
          <div className='overflow-hidden overflow-ellipsis whitespace-nowrap text-xs leading-none text-text-muted'>
            {about}
          </div>
        )}
      </div>
    </div>
  )
}

export default LeaderboardTable
