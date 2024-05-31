import Diamond from '@/assets/graphics/creators/diamonds/diamond.png'
import MedalsImage from '@/assets/graphics/medals.png'
import AddressAvatar from '@/components/AddressAvatar'
import FormatBalance from '@/components/FormatBalance'
import Loading from '@/components/Loading'
import Name from '@/components/Name'
import { Column, TableRow } from '@/components/Table'
import {
  getLeaderboardDataQuery,
  getUserStatisticsQuery,
} from '@/services/datahub/leaderboard/query'
import { LeaderboardRole } from '@/services/datahub/leaderboard/types'
import { useMyMainAddress } from '@/stores/my-account'
import { cx, mutedTextColorStyles } from '@/utils/class-names'
import { isEmptyArray } from '@subsocial/utils'
import Image from 'next/image'
import { useMemo } from 'react'

const TABLE_LIMIT = 100

export const leaderboardColumns = (): Column[] => [
  {
    index: 'user-role',
    align: 'left',
    className: cx('p-0 py-2 pl-2 w-[85%] '),
  },
  {
    index: 'rank',
    align: 'right',
    className: cx('p-0 py-2 pr-2'),
  },
]

type LeaderboardTableProps = {
  role: LeaderboardRole
  currentUserRank?: {
    address: string
    rank: number | null
    reward: string
  }
  customColumnsClassNames?: (string | undefined)[]
}

const parseTableRows = (
  data: {
    address: string
    rank: number | null
    reward: string
  }[],
  limit: number,
  currentUserRank: {
    address: string
    rank: number | null
    reward: string
  }
) => {
  return (
    data
      .map((item) => ({
        address: item.address,
        rank: item.rank!,
        'user-role': (
          <UserPreview
            address={item.address}
            desc={<UserReward reward={item.reward} />}
          />
        ),
        className:
          item.address === currentUserRank.address
            ? 'bg-slate-800 sticky top-[3.5rem] z-20'
            : '',
      }))
      .slice(0, limit) || []
  )
}

const LeaderboardTable = ({
  role,
  customColumnsClassNames,
}: LeaderboardTableProps) => {
  const myAddress = useMyMainAddress()
  const { data: leaderboardData, isLoading } =
    getLeaderboardDataQuery.useInfiniteQuery(role)

  const { data: userStats, isLoading: isUserStatsLoading } =
    getUserStatisticsQuery.useQuery({
      address: myAddress || '',
    })
  const { rank, earnedPointsByPeriod } = userStats?.[role] || {}

  const currentUserRank = {
    address: myAddress || '',
    rank: rank || null,
    reward: earnedPointsByPeriod?.toString() || '0',
  }

  const dataItems = leaderboardData?.pages[0].data || []

  const data = useMemo(() => {
    if (
      currentUserRank &&
      currentUserRank.rank &&
      currentUserRank.rank > TABLE_LIMIT
    ) {
      return [
        {
          address: currentUserRank.address,
          rank: currentUserRank.rank!,
          'user-role': (
            <UserPreview
              address={currentUserRank.address}
              desc={<UserReward reward={currentUserRank.reward} />}
            />
          ),
          className:
            currentUserRank.address === currentUserRank.address
              ? 'bg-slate-800 sticky top-[3.5rem] z-20'
              : '',
        },
        ...parseTableRows(dataItems || [], TABLE_LIMIT, currentUserRank),
      ]
    }

    return parseTableRows(dataItems || [], TABLE_LIMIT, currentUserRank)
  }, [JSON.stringify(currentUserRank), role, leaderboardData?.pages[0]])

  return (
    <>
      {data.length === 0 &&
        (isLoading ? (
          <Loading title='Loading table data' className='p-7' />
        ) : (
          <div
            className='flex flex-col items-center justify-center p-4 text-center'
            style={{ gridColumn: '1/4' }}
          >
            <Image
              src={MedalsImage}
              alt=''
              className='relative w-[70px] max-w-sm'
            />
            <span className={cx(mutedTextColorStyles)}>
              {role === 'creator'
                ? 'Create great content and get the most likes to show up here!'
                : 'Like the most posts to reach the top!'}
            </span>
          </div>
        ))}
      {!isEmptyArray(data) && (
        <div className='flex w-full flex-col'>
          <table className='w-full table-fixed text-left'>
            <tbody>
              {data.map((item, i) => {
                return (
                  <TableRow
                    key={i}
                    columns={leaderboardColumns()}
                    item={item}
                    withDivider={false}
                    className='first:[&>td]:rounded-s-xl last:[&>td]:rounded-e-xl'
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

type UserRewardProps = {
  reward: string
}

export const UserReward = ({ reward }: UserRewardProps) => {
  return (
    <div className='flex items-center gap-1'>
      <Image src={Diamond} alt='' className='h-[14px] w-[14px]' />
      <FormatBalance
        value={reward}
        symbol={''}
        defaultMaximumFractionDigits={2}
        loading={false}
        className={cx('font-medium', mutedTextColorStyles)}
      />
    </div>
  )
}

type UserPreviewProps = {
  address: string
  desc?: React.ReactNode
}

export const UserPreview = ({ address, desc }: UserPreviewProps) => {
  return (
    <div className='flex items-center gap-2'>
      <AddressAvatar address={address} className='h-[38px] w-[38px]' />
      <div className='flex flex-col gap-2'>
        <Name
          address={address}
          className='text-sm font-medium leading-none !text-text'
        />
        {desc && (
          <div
            className={cx(
              'overflow-hidden overflow-ellipsis whitespace-nowrap text-xs leading-none'
            )}
          >
            {desc}
          </div>
        )}
      </div>
    </div>
  )
}

export default LeaderboardTable
