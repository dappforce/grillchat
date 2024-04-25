import Loading from '@/components/Loading'
import { Column, TableHeader } from '@/components/Table'
import Modal from '@/components/modals/Modal'
import { getLeaderboardDataQuery } from '@/services/datahub/leaderboard/query'
import { cx } from '@/utils/class-names'
import InfiniteScroll from 'react-infinite-scroll-component'
import { TableRow } from '../../Table'
import { useLeaderboardContext } from '../LeaderboardContext'
import { UserPreview, UserReward, leaderboardColumns } from './LeaderboardTable'

type LeaderboardModalProps = {
  openModal: boolean
  closeModal: () => void
}

const LeaderboardModal = ({ openModal, closeModal }: LeaderboardModalProps) => {
  const { leaderboardRole } = useLeaderboardContext()
  const {
    data: leaderboardData,
    fetchNextPage,
    hasNextPage,
  } = getLeaderboardDataQuery.useInfiniteQuery(leaderboardRole)

  const flattenData = leaderboardData?.pages.flatMap((item) => item.data) || []

  const columnsByRole = leaderboardColumns(leaderboardRole)

  const columns = columnsByRole.map((column, i) => ({
    ...column,
    className: cx(column.className, {
      ['!w-[8%]']: i === 0,
      ['!w-[30%]']: i === columnsByRole.length - 1,
    }),
  }))

  return (
    <Modal
      isOpen={openModal}
      closeModal={closeModal}
      className='h-full !max-h-[500px]'
      title={'Top Stakers this week'}
      description={
        'Users ranked by the amount of SUB earned with Content Staking.'
      }
    >
      <div className='max-h-[500px] overflow-auto' id='leaderboard'>
        <InfiniteScroll
          dataLength={flattenData?.length || 0}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          scrollableTarget='leaderboard'
          loader={<Loading />}
        >
          <table className='w-full table-fixed text-left'>
            <TableHeader
              columns={columns}
              headerClassName='!bg-transparent dark:!bg-transparent'
            />
            <tbody>
              <ModalTableRows data={flattenData} columns={columns} />
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </Modal>
  )
}

type ModalTableRowsProps = {
  data: {
    reward: string
    rank?: number | undefined
    address: string
  }[]
  columns: Column[]
}

const ModalTableRows = ({ data, columns }: ModalTableRowsProps) => {
  const tableData = data.map((item) => ({
    rank: item.rank! + 1,
    'user-role': <UserPreview address={item.address} />,
    rewards: <UserReward reward={item.reward} />,
  }))

  return (
    <>
      {tableData.map((item, i) => {
        return (
          <TableRow key={i} columns={columns} item={item} withDivider={false} />
        )
      })}
    </>
  )
}

export default LeaderboardModal
