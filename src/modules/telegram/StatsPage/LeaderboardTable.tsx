import Diamond from '@/assets/graphics/creators/diamonds/diamond.png'
import MedalsImage from '@/assets/graphics/medals.png'
import AddressAvatar from '@/components/AddressAvatar'
import FormatBalance from '@/components/FormatBalance'
import Loading from '@/components/Loading'
import Name from '@/components/Name'
import { Column, TableRow } from '@/components/Table'
import {
  leaderboardDataQueryByPeriod,
  userDataQueryByPeriod,
} from '@/services/datahub/leaderboard/query'
import { LeaderboardDataPeriod } from '@/services/datahub/leaderboard/types'
import { useMyMainAddress } from '@/stores/my-account'
import { cx, mutedTextColorStyles } from '@/utils/class-names'
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
  period: LeaderboardDataPeriod
  currentUserRank?: {
    address: string
    rank: number | null
    reward: string
  }
  customColumnsClassNames?: (string | undefined)[]
}

type Data = {
  address: string
  rank: number | null
  reward: string
}

const parseTableRows = (data: Data[], limit: number, currentUserRank: Data) => {
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
          item.address === currentUserRank?.address ? 'bg-slate-800' : '',
      }))
      .slice(0, limit) || []
  )
}

const LeaderboardTable = ({ period }: LeaderboardTableProps) => {
  const myAddress = useMyMainAddress()

  const { data: leaderboardDataResult, isLoading } =
    leaderboardDataQueryByPeriod[period].useQuery(period)

  const { data: userStats } = userDataQueryByPeriod[period].useQuery(
    myAddress || ''
  )

  const data = useMemo(() => {
    const currentUserRankItem = userStats?.rank
      ? {
          address: userStats.address,
          rank: userStats.rank!,
          'user-role': (
            <UserPreview
              address={userStats.address}
              desc={<UserReward reward={userStats.reward} />}
            />
          ),
          className: cx('bg-slate-800 sticky bottom-[4.8rem] z-[11]'),
        }
      : undefined

    return [
      ...parseTableRows(leaderboardDataResult || [], TABLE_LIMIT, userStats),
      currentUserRankItem,
    ].filter(Boolean)
  }, [userStats, leaderboardDataResult])

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
              Create great content and get the most likes to show up here!
            </span>
          </div>
        ))}
      {!!data.length && (
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
