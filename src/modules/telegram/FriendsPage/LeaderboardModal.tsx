import BlueGradient from '@/assets/graphics/landing/gradients/blue.png'
import MedalsImage from '@/assets/graphics/medals.png'
import Button from '@/components/Button'
import Loading from '@/components/Loading'
import { Column, TableRow } from '@/components/Table'
import { getReferralLeaderboardQuery } from '@/services/datahub/referral/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx, mutedTextColorStyles } from '@/utils/class-names'
import { Transition } from '@headlessui/react'
import Image from 'next/image'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'
import { HiXMark } from 'react-icons/hi2'
import { UserPreview } from '../StatsPage/LeaderboardTable'

type LeaderboardModalProps = {
  isOpen: boolean
  close: () => void
}

const LeaderboardModal = ({ isOpen, close }: LeaderboardModalProps) => {
  const myAddress = useMyMainAddress()

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
            className='absolute -top-56 left-1/2 w-full -translate-x-1/2'
          />
          <div className='flex flex-col gap-2'>
            <div className='relative mx-auto flex w-full items-center justify-between px-4 py-4'>
              <span className='text-xl font-bold'>
                Referrers Leaderboard 🏆
              </span>
              <Button
                className='-mr-2'
                variant='transparent'
                size='circleSm'
                onClick={close}
              >
                <HiXMark className='text-3xl' />
              </Button>
            </div>
            <span></span>
          </div>
          <div className='relative mx-auto flex h-full w-full flex-col items-center px-4'>
            <LeaderboardTable />
          </div>
        </div>
      </Transition>
    </>,
    document.body
  )
}

export const tableColumns = (): Column[] => [
  {
    index: 'user',
    align: 'left',
    className: cx('p-0 py-2 pr-2'),
  },
  {
    index: 'id',
    align: 'right',
    className: cx('p-0 py-2 pl-2 w-[15%] text-slate-400 '),
  },
]

const LeaderboardTable = () => {
  const myAddress = useMyMainAddress()
  const { data: referrersData, isLoading } =
    getReferralLeaderboardQuery.useQuery(myAddress || '')

  const data = useMemo(() => {
    return (
      referrersData?.map((item, i) => ({
        id: i + 1,
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
    )
  }, [referrersData])

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
                  <TableRow
                    key={i}
                    columns={tableColumns()}
                    item={item}
                    withDivider={false}
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

export default LeaderboardModal
