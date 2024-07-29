import BlueGradient from '@/assets/graphics/landing/gradients/blue.png'
import MedalsImage from '@/assets/graphics/medals.png'
import Button from '@/components/Button'
import Loading from '@/components/Loading'
import { Column, TableRow } from '@/components/Table'
import Tabs from '@/components/Tabs'
import {
  getReferralLeaderboardQuery,
  getReferrerRankQuery,
} from '@/services/datahub/referral/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx, mutedTextColorStyles } from '@/utils/class-names'
import { Transition } from '@headlessui/react'
import { isDef } from '@subsocial/utils'
import Image from 'next/image'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'
import { HiXMark } from 'react-icons/hi2'
import { UserPreview } from '../StatsPage/LeaderboardTable'

// const DISTRIBUTION_DAY = 0
const DEFAULT_LIST_COUNT = 100

// const getDistributionDaysLeft = () => {
//   // monday: 7 days, tuesday: 6 days, ..., sunday: 1 day
//   return ((DISTRIBUTION_DAY + 7 - dayjs.utc().get('day')) % 7) + 1
// }

type LeaderboardModalProps = {
  isOpen: boolean
  close: () => void
}

const LeaderboardModal = ({ isOpen, close }: LeaderboardModalProps) => {
  return createPortal(
    <>
      <Transition
        appear
        show={isOpen}
        className='fixed inset-0 z-10 h-full w-full bg-background transition duration-300'
        enterFrom={cx('opacity-0')}
        enterTo='opacity-100'
        leaveFrom='h-auto'
        leaveTo='opacity-0 !duration-150'
      />
      <Transition
        appear
        show={isOpen}
        className='fixed inset-0 z-10 flex h-full w-full flex-col bg-background pb-20 transition duration-300'
        enterFrom={cx('opacity-0 -translate-y-48')}
        enterTo='opacity-100 translate-y-0'
        leaveFrom='h-auto'
        leaveTo='opacity-0 -translate-y-24 !duration-150'
      >
        <div className='mx-auto flex w-full max-w-screen-md flex-1 flex-col overflow-auto'>
          <Image
            src={BlueGradient}
            priority
            alt=''
            className='absolute -top-52 left-1/2 w-full -translate-x-1/2'
          />
          <div className='relative mx-auto flex w-full items-center justify-between px-4 pb-2 pt-4'>
            <span className='text-xl font-bold'>Referrers Leaderboard 🏆</span>
            <Button
              className='-mr-2'
              variant='transparent'
              size='circleSm'
              onClick={close}
            >
              <HiXMark className='text-3xl' />
            </Button>
          </div>
          <div className='relative mx-auto flex h-full w-full flex-col items-center px-4'>
            <LeaderboardModalContent />
          </div>
        </div>
      </Transition>
    </>,
    document.body
  )
}

const LeaderboardModalContent = () => {
  const tabs = [
    {
      id: 'contest',
      text: 'Contest',
      content: () => (
        <div className='flex h-full flex-col gap-4'>
          <span className='text-sm text-slate-400'>
            Top 10 users who invite the most friends during the week will be
            rewarded. <span className='font-bold text-[#FF9331]'>Finished</span>
          </span>
          <LeaderboardTable isContest />
        </div>
      ),
    },
    {
      id: 'allTime',
      text: 'All-Time',
      content: () => (
        <div className='flex h-full flex-col gap-4'>
          <span className='text-sm text-slate-400'>
            All users who invite the most friends.
          </span>
          <LeaderboardTable />
        </div>
      ),
    },
  ]

  return (
    <div className='flex h-full w-full flex-col gap-4'>
      <Tabs
        className='rounded-full bg-slate-900 p-[2px]'
        panelClassName='mt-0 w-full h-full max-w-full px-0 z-0'
        containerClassName='h-full'
        tabClassName={(selected) =>
          cx(
            {
              ['bg-background-primary/50 rounded-full [&>span]:!text-text']:
                selected,
            },
            '[&>span]:text-slate-300 leading-6 font-medium p-[6px] [&>span]:text-sm border-none'
          )
        }
        asContainer
        tabStyle='buttons'
        defaultTab={0}
        tabs={tabs}
      />
    </div>
  )
}

export const tableColumns = (): Column[] => [
  {
    index: 'user',
    align: 'left',
    className: cx('p-0 py-2 pr-2'),
  },
  {
    index: 'index',
    align: 'right',
    className: cx('p-0 py-2 pl-2 w-[15%] text-slate-400 '),
  },
]

type LeaderboardTableProps = {
  isContest?: boolean
}

const LeaderboardTable = ({ isContest }: LeaderboardTableProps) => {
  const myAddress = useMyMainAddress()
  const { data: referrersData, isLoading } = getReferralLeaderboardQuery(
    isContest || false
  ).useQuery({})

  const { leaderboardData: items, totalCount } = referrersData || {}

  const { data: referrerData } = getReferrerRankQuery(
    isContest || false
  ).useQuery(myAddress || '')

  const data = useMemo(() => {
    const currentUserRankItem =
      referrerData?.rankIndex !== undefined && myAddress
        ? {
            index: (referrerData?.rankIndex || 0) + 1,
            className: cx('bg-slate-800 sticky bottom-0 z-[11]'),
            user: (
              <UserPreview
                address={myAddress}
                nameClassName='[&>span]:overflow-hidden [&>span]:whitespace-nowrap [&>span]:text-ellipsis'
                desc={
                  <span className='text-sm text-slate-400'>
                    👋 {referrerData.count} frens
                  </span>
                }
              />
            ),
          }
        : undefined

    const leaderboardData =
      items?.map((item, i) => ({
        index: i + 1,
        className: item.address === myAddress ? 'bg-slate-800' : '',
        user: (
          <UserPreview
            address={item.address}
            nameClassName='[&>span]:overflow-hidden [&>span]:whitespace-nowrap [&>span]:text-ellipsis'
            desc={
              <span className='text-sm text-slate-400'>
                👋 {item.count} frens
              </span>
            }
          />
        ),
      })) || []

    return [...leaderboardData, currentUserRankItem]
  }, [referrerData?.rankIndex, referrerData?.count, myAddress, items]).filter(
    isDef
  )

  return (
    <>
      {data.length === 0 &&
        (isLoading ? (
          <Loading title='Loading table data' className='p-7' />
        ) : (
          <div
            className='flex h-full flex-col items-center justify-center p-4 text-center'
            style={{ gridColumn: '1/4' }}
          >
            <Image
              src={MedalsImage}
              alt=''
              className='relative w-[70px] max-w-sm'
            />
            <span className={cx(mutedTextColorStyles)}>
              Invite your frens to show up here!
            </span>
          </div>
        ))}
      {!!data.length && (
        <div className='flex w-full flex-col'>
          <table className='w-full table-fixed text-left'>
            <tbody>
              {data.map((item, i) => {
                return (
                  <>
                    <TableRow
                      key={i}
                      columns={tableColumns()}
                      item={item}
                      withDivider={false}
                      className='first:[&>td]:rounded-s-xl first:[&>td]:pl-2 last:[&>td]:rounded-e-xl last:[&>td]:pr-2'
                    />
                    {isContest && i === 9 && (
                      <tr className='h-0.5'>
                        <td colSpan={2} className='w-100'>
                          <div className='flex w-full items-center gap-2 py-2'>
                            <span className='w-full border border-slate-600'></span>
                            <span className='min-w-max text-sm font-medium text-slate-400'>
                              OTHER MEMBERS
                            </span>
                            <span className='w-full border border-slate-600'></span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
          {totalCount && totalCount > DEFAULT_LIST_COUNT && (
            <div className='flex items-center gap-2 py-2'>
              <span className='w-full border border-slate-600'></span>
              <span className='min-w-max text-sm font-medium text-slate-400'>
                AND {totalCount - DEFAULT_LIST_COUNT} MORE MEMBERS
              </span>
              <span className='w-full border border-slate-600'></span>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default LeaderboardModal
