import AddressAvatar from '@/components/AddressAvatar'
import FormatBalance from '@/components/FormatBalance'
import LinkText from '@/components/LinkText'
import Name from '@/components/Name'
import Table, { Column } from '@/components/Table'
import { getProfileQuery } from '@/services/api/query'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getLeaderboardDataQuery } from '@/services/datahub/leaderboard/query'
import { LeaderboardRole } from '@/services/datahub/leaderboard/types'
import { convertToBalanceWithDecimal } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import LeaderboardModal from './LeaderboardModal'

const TABLE_LIMIT = 10

export const leaderboardColumns = (role: LeaderboardRole): Column[] => [
  {
    index: 'rank',
    name: '#',
    className: 'p-0 text-text-muted py-2 pl-4 w-[7%]',
  },
  {
    index: 'user-role',
    name: role === 'staker' ? 'Staker' : 'Creator',
    align: 'left',
    className: 'p-0 py-2',
  },
  {
    index: 'rewards',
    name: 'Rewards',
    align: 'right',
    className: 'p-0 py-2 pr-4 w-[20%]',
  },
]

const sectionConfig = {
  staker: {
    title: 'Staker Leaderboard',
    desc: 'Users ranked by the amount of SUB earned with Content Staking this week.',
  },
  creator: {
    title: 'Creator Leaderboard',
    desc: 'Creators ranked by the amount of SUB earned from their posts this week.',
  },
}

type LeaderboardTableProps = {
  role: LeaderboardRole
  currentUserRank?: {
    address: string
    rank: number | null
    reward: string
  }
}

const parseTableRows = (
  data: {
    address: string
    rank: number | null
    reward: string
  }[],
  limit: number,
  address?: string
) => {
  return (
    data
      .map((item) => ({
        address: item.address,
        rank: item.rank! + 1,
        'user-role': <UserPreview address={item.address} />,
        rewards: <UserReward reward={item.reward} />,
        className:
          item.address === address ? 'dark:bg-slate-700 bg-[#EEF2FF]' : '',
      }))
      .slice(0, limit) || []
  )
}

const LeaderboardTable = ({ role, currentUserRank }: LeaderboardTableProps) => {
  const [openModal, setOpenModal] = useState(false)
  const router = useRouter()

  const { data: leaderboardData } =
    getLeaderboardDataQuery.useInfiniteQuery(role)

  const data = useMemo(() => {
    if (!currentUserRank || (currentUserRank.rank ?? 0) < TABLE_LIMIT) {
      return parseTableRows(
        leaderboardData?.pages[0].data || [],
        TABLE_LIMIT,
        currentUserRank?.address
      )
    }

    return [
      ...parseTableRows(leaderboardData?.pages[0].data || [], TABLE_LIMIT - 1),
      {
        address: currentUserRank.address,
        rank: currentUserRank.rank! + 1,
        'user-role': <UserPreview address={currentUserRank.address} />,
        rewards: <UserReward reward={currentUserRank.reward} />,
        className: 'dark:bg-slate-700 bg-[#EEF2FF]',
      },
    ]
  }, [JSON.stringify(currentUserRank), role, leaderboardData?.pages[0]])

  const { title, desc } = sectionConfig[role]

  return (
    <>
      <div className='flex h-fit flex-col gap-6 rounded-2xl bg-white py-4 dark:bg-slate-800'>
        <div className='flex flex-col gap-2 px-4'>
          <span className='text-lg font-bold leading-normal'>{title}</span>
          <span className='text-sm leading-normal text-text-muted'>{desc}</span>
        </div>
        <div className='flex w-full flex-col'>
          <Table
            columns={leaderboardColumns(role)}
            data={data}
            className='rounded-none !bg-transparent dark:!bg-transparent [&>table]:table-fixed'
            headerClassName='!bg-transparent dark:!bg-transparent'
            withDivider={false}
            onRowClick={(item) =>
              router.replace(
                '/leaderboard/[address]',
                `/leaderboard/${item.address}`
              )
            }
          />
          <LinkText
            className='mt-3 w-full text-center hover:no-underline'
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
        role={role}
        currentUserAddress={currentUserRank?.address}
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
