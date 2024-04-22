import AddressAvatar from '@/components/AddressAvatar'
import Name from '@/components/Name'
import Table, { Column } from '@/components/Table'
import { getProfileQuery } from '@/services/api/query'

const tmpData = [
  {
    address: '3rSaMDDFoqsduRDxcAidDX4hx6zKhFaTFmbpJtxyT8QK4hib',
    rewards: '84.11 SUB',
  },
  {
    address: '3rSaMDDFoqsduRDxcAidDX4hx6zKhFaTFmbpJtxyT8QK4hib',
    rewards: '84.11 SUB',
  },
  {
    address: '3rSaMDDFoqsduRDxcAidDX4hx6zKhFaTFmbpJtxyT8QK4hib',
    rewards: '84.11 SUB',
  },
  {
    address: '3rSaMDDFoqsduRDxcAidDX4hx6zKhFaTFmbpJtxyT8QK4hib',
    rewards: '84.11 SUB',
  },
  {
    address: '3rSaMDDFoqsduRDxcAidDX4hx6zKhFaTFmbpJtxyT8QK4hib',
    rewards: '84.11 SUB',
  },
  {
    address: '3rSaMDDFoqsduRDxcAidDX4hx6zKhFaTFmbpJtxyT8QK4hib',
    rewards: '84.11 SUB',
  },
  {
    address: '3rSaMDDFoqsduRDxcAidDX4hx6zKhFaTFmbpJtxyT8QK4hib',
    rewards: '84.11 SUB',
  },
  {
    address: '3rSaMDDFoqsduRDxcAidDX4hx6zKhFaTFmbpJtxyT8QK4hib',
    rewards: '84.11 SUB',
  },
  {
    address: '3rSaMDDFoqsduRDxcAidDX4hx6zKhFaTFmbpJtxyT8QK4hib',
    rewards: '84.11 SUB',
  },
]

type LeaderboardTableProps = {
  address: string
}

const LeaderboardTable = ({ address }: LeaderboardTableProps) => {
  const columns: Column[] = [
    {
      index: 'rank',
      name: '#',
      className: 'p-0 text-text-muted py-2',
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
      className: 'p-0 py-2',
    },
  ]

  const data = tmpData.map((item, index) => ({
    rank: index + 1,
    staker: <UserPreview address={item.address} />,
    rewards: item.rewards,
  }))

  return (
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
      <Table
        columns={columns}
        data={data}
        className='rounded-none !bg-transparent dark:!bg-transparent'
        headerClassName='!bg-transparent dark:!bg-transparent'
        withDivider={false}
      />
    </div>
  )
}

type UserPreviewProps = {
  address: string
}

const UserPreview = ({ address }: UserPreviewProps) => {
  const { data: profile } = getProfileQuery.useQuery(address)

  const about = profile?.profileSpace?.content?.about

  return (
    <div className='flex items-center gap-2'>
      <AddressAvatar address={address} className='h-[38px] w-[38px]' />
      <div className='flex flex-col gap-8'>
        <Name
          address={address}
          className='text-sm font-medium leading-normal'
        />
        {about && (
          <div className='overflow-hidden overflow-ellipsis whitespace-nowrap text-xs leading-normal text-text-muted'>
            {about}
          </div>
        )}
      </div>
    </div>
  )
}

export default LeaderboardTable
