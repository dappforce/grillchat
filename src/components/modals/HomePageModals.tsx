import { getUserYesterdayRewardQuery } from '@/services/datahub/content-staking/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { LocalStorage } from '@/utils/storage'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import RewardPerDayModal from './RewardPerDayModal'
import WelcomeModal from './WelcomeModal'

const DailyRewardModal = dynamic(() => import('./DailyRewardModal'), {
  ssr: false,
})

const hasVisitedHomeStorage = new LocalStorage(() => 'has-visited-home')
const progressModalStorage = {
  getIsClosed: () => {
    const today = dayjs.utc().startOf('day').unix()
    const closedTimestamp = localStorage.getItem('progress-modal-closed')
    if (!closedTimestamp) return false
    return today === Number(closedTimestamp)
  },
  close: () => {
    const today = dayjs.utc().startOf('day').unix()
    localStorage.setItem('progress-modal-closed', String(today))
  },
}

export default function HomePageModals() {
  const sendEvent = useSendEvent()
  const [canModalBeOpened, setCanModalBeOpened] = useState<
    'welcome' | 'yesterday-reward'
  >('welcome')

  const [isOpenWelcomeModal, setIsOpenWelcomeModal] = useState(false)
  const [isOpenRewardDayModal, setIsOpenRewardDayModal] = useState(false)

  useEffect(() => {
    const hasVisited = hasVisitedHomeStorage.get() === 'true'
    if (!hasVisited) {
      sendEvent('open_welcome_modal')
      hasVisitedHomeStorage.set('true')
      setIsOpenWelcomeModal(true)
    } else {
      setCanModalBeOpened('yesterday-reward')
    }
  }, [sendEvent])

  const myAddress = useMyMainAddress() ?? ''

  const { data: yesterdayReward } = getUserYesterdayRewardQuery.useQuery({
    address: myAddress ?? '',
  })
  const hasEarnedAnything = !!(
    Number(yesterdayReward?.earned.creator ?? '0') ||
    Number(yesterdayReward?.earned.staker ?? '0')
  )
  useEffect(() => {
    if (canModalBeOpened !== 'yesterday-reward') return
    if (hasEarnedAnything && !progressModalStorage.getIsClosed()) {
      sendEvent('open_progress_modal')
      setIsOpenRewardDayModal(true)
    }
  }, [canModalBeOpened, hasEarnedAnything, sendEvent])

  return (
    <>
      <WelcomeModal
        isOpen={isOpenWelcomeModal}
        closeModal={() => {
          setIsOpenWelcomeModal(false)
          setCanModalBeOpened('yesterday-reward')
        }}
      />
      <RewardPerDayModal
        isOpen={isOpenRewardDayModal}
        close={() => {
          setIsOpenRewardDayModal(false)
          progressModalStorage.close()
        }}
      />
    </>
  )
}
