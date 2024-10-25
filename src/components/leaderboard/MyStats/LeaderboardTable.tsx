import MedalsImage from '@/assets/graphics/medals.png'
import AddressAvatar from '@/components/AddressAvatar'
import FormatBalance from '@/components/FormatBalance'
import LinkText from '@/components/LinkText'
import Loading from '@/components/Loading'
import Name from '@/components/Name'
import Table, { Column } from '@/components/Table'
import { mutedTextColorStyles } from '@/components/content-staking/utils/commonStyles'
import { ZERO } from '@/constants/config'
import { getProfileQuery } from '@/old/services/api/query'
import { useGetChainDataByNetwork } from '@/old/services/chainsInfo/query'
import { getLeaderboardDataQuery } from '@/old/services/datahub/leaderboard/query'
import { LeaderboardRole } from '@/old/services/datahub/leaderboard/types'
import { cx } from '@/utils/class-names'
import { convertToBalanceWithDecimal, isEmptyArray } from '@subsocial/utils'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { getLeaderboardLink } from '../utils'
import LeaderboardModal from './LeaderboardModal'

const TABLE_LIMIT = 10

export const leaderboardColumns = (
  role: LeaderboardRole,
  customColumnsClassNames?: (string | undefined)[]
): Column[] => [
  {
    index: 'rank',
    name: '#',
    className: cx(
      'p-0 py-2 pl-4 md:w-[7%] w-[14%]',
      mutedTextColorStyles,
      customColumnsClassNames?.[0]
    ),
  },
  {
    index: 'user-role',
    name: role === 'staker' ? 'Staker' : 'Creator',
    align: 'left',
    className: cx('p-0 py-2', customColumnsClassNames?.[1]),
  },
  {
    index: 'rewards',
    name: 'Rewards',
    align: 'right',
    className: cx(
      'p-0 py-2 pr-4 md:w-[20%] w-[38%]',
      customColumnsClassNames?.[2]
    ),
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
  customColumnsClassNames?: (string | undefined)[]
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
        rank: item.rank!,
        'user-role': <UserPreview address={item.address} />,
        rewards: <UserReward reward={item.reward} />,
        className:
          item.address === address ? 'dark:bg-slate-700 bg-[#EEF2FF]' : '',
      }))
      .slice(0, limit) || []
  )
}

const LeaderboardTable = ({
  role,
  currentUserRank,
  customColumnsClassNames,
}: LeaderboardTableProps) => {
  const [openModal, setOpenModal] = useState(false)
  const router = useRouter()

  const { data: leaderboardData, isLoading } =
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
      {
        address: currentUserRank.address,
        rank: currentUserRank.rank!,
        'user-role': <UserPreview address={currentUserRank.address} />,
        rewards: <UserReward reward={currentUserRank.reward} />,
        className: 'dark:bg-slate-700 bg-[#EEF2FF]',
      },
      ...parseTableRows(leaderboardData?.pages[0].data || [], TABLE_LIMIT - 1),
    ]
  }, [JSON.stringify(currentUserRank), role, leaderboardData?.pages[0]])

  const { title, desc } = sectionConfig[role]

  return (
    <>
      <div className='flex h-fit flex-col gap-4 rounded-2xl bg-white py-4 dark:bg-slate-800 md:gap-4'>
        <div className='flex flex-col gap-2 px-4'>
          <span className='text-lg font-bold leading-normal'>{title}</span>
          <span
            className={cx('text-base leading-normal', mutedTextColorStyles)}
          >
            {desc}
          </span>
        </div>
        {data.length === 0 &&
          (isLoading ? (
            <Loading title='Loading table data' />
          ) : (
            <div
              className='flex flex-col items-center justify-center pb-3 text-center'
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
            <Table
              columns={leaderboardColumns(role, customColumnsClassNames)}
              data={data}
              className='rounded-none !bg-transparent dark:!bg-transparent [&>table]:table-fixed'
              headerClassName='!bg-transparent dark:!bg-transparent'
              withDivider={false}
              onRowClick={(item) =>
                router.replace(
                  '/leaderboard/[address]',
                  `${getLeaderboardLink(item.address)}?role=${role}`
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
        )}
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
    reward && decimal ? convertToBalanceWithDecimal(reward, decimal) : ZERO

  return (
    <FormatBalance
      value={rewardWithDecimal.toString()}
      symbol={tokenSymbol}
      defaultMaximumFractionDigits={2}
      className='font-medium'
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
      <AddressAvatar address={address} className='h-[40px] w-[40px]' />
      <div className='flex flex-col gap-2'>
        <Name
          address={address}
          className='text-base font-medium leading-none !text-text'
        />
        {about && (
          <div
            className={cx(
              'overflow-hidden overflow-ellipsis whitespace-nowrap text-sm leading-none',
              mutedTextColorStyles
            )}
          >
            {about}
          </div>
        )}
      </div>
    </div>
  )
}

export default LeaderboardTable
