import Loading from '@/components/Loading'
import { Column, TableHeader, TableRow } from '@/components/Table'
import Modal from '@/components/modals/Modal'
import { LeaderboardRole } from '@/services/datahub/leaderboard'
import { getLeaderboardDataQuery } from '@/services/datahub/leaderboard/query'
import { cx } from '@/utils/class-names'
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component'
import { UserPreview, UserReward, leaderboardColumns } from './LeaderboardTable'

type LeaderboardModalProps = {
  openModal: boolean
  closeModal: () => void
  role: LeaderboardRole
  currentUserAddress?: string
}

const modalConfig = {
  staker: {
    title: 'Top Meme Likers this week',
    desc: 'Meme Likers by the amount of Points earned with Content Staking.',
  },
  creator: {
    title: 'Top Meme Makers this week',
    desc: 'Meme Makers ranked by the amount of Points earned from their posts.',
  },
}

const LeaderboardModal = ({
  openModal,
  closeModal,
  role,
  currentUserAddress,
}: LeaderboardModalProps) => {
  const {
    data: leaderboardData,
    fetchNextPage,
    hasNextPage,
  } = getLeaderboardDataQuery.useInfiniteQuery(role)

  const flattenData = leaderboardData?.pages.flatMap((item) => item.data) || []

  const columnsByRole = leaderboardColumns()

  const columns = columnsByRole.map((column, i) => ({
    ...column,
    className: cx(column.className, {
      ['md:!w-[10%]']: i === 0,
      ['md:!w-[30%]']: i === columnsByRole.length - 1,
    }),
  }))

  const { title, desc } = modalConfig[role]

  return (
    <Modal
      isOpen={openModal}
      closeModal={closeModal}
      className='h-full !max-h-[500px]'
      contentClassName='!p-2 !py-4'
      titleClassName='px-3'
      descriptionClassName='px-3'
      title={title}
      withCloseButton
      description={desc}
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
              <ModalTableRows
                data={flattenData}
                columns={columns}
                closeModal={closeModal}
                currentUserAddress={currentUserAddress}
                role={role}
              />
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
    rank: number | null
    address: string
  }[]
  columns: Column[]
  closeModal: () => void
  currentUserAddress?: string
  role: LeaderboardRole
}

const ModalTableRows = ({
  data,
  columns,
  closeModal,
  currentUserAddress,
  role,
}: ModalTableRowsProps) => {
  const router = useRouter()

  const tableData = data.map((item) => ({
    address: item.address,
    rank: item.rank!,
    'user-role': <UserPreview address={item.address} />,
    rewards: <UserReward reward={item.reward} />,
    className:
      currentUserAddress === item.address
        ? 'dark:bg-slate-700 bg-[#EEF2FF]'
        : '',
  }))

  return (
    <>
      {tableData.map((item, i) => {
        return (
          <TableRow
            key={i}
            columns={columns}
            item={item}
            withDivider={false}
            className='first:[&>td]:rounded-s-xl last:[&>td]:rounded-e-xl'
          />
        )
      })}
    </>
  )
}

export default LeaderboardModal
