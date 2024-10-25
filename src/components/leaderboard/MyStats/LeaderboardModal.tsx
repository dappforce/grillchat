import Loading from '@/components/Loading'
import { Column, TableHeader } from '@/components/Table'
import Modal from '@/components/modals/Modal'
import { LeaderboardRole } from '@/old/services/datahub/leaderboard'
import { getLeaderboardDataQuery } from '@/old/services/datahub/leaderboard/query'
import { cx } from '@/utils/class-names'
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component'
import { TableRow } from '../../Table'
import { getLeaderboardLink } from '../utils'
import { UserPreview, UserReward, leaderboardColumns } from './LeaderboardTable'

type LeaderboardModalProps = {
  openModal: boolean
  closeModal: () => void
  role: LeaderboardRole
  currentUserAddress?: string
}

const modalConfig = {
  staker: {
    title: 'Top Stakers this week',
    desc: 'Users ranked by the amount of SUB earned with Content Staking.',
  },
  creator: {
    title: 'Top Creators this week',
    desc: 'Creators ranked by the amount of SUB earned from their posts.',
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

  const columnsByRole = leaderboardColumns(role)

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
      contentClassName='!p-2 !pt-4 !pb-0'
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
          loader={<Loading className='pt-2' />}
          className='pb-4'
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
}

const ModalTableRows = ({
  data,
  columns,
  closeModal,
  currentUserAddress,
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
            onRowClick={() => {
              router.push(
                '/leaderboard/[address]',
                getLeaderboardLink(item.address)
              )
              closeModal()
            }}
          />
        )
      })}
    </>
  )
}

export default LeaderboardModal
