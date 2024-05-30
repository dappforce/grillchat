import { isTouchDevice } from '@/utils/device'
import { useMiniAppRaw } from '@tma.js/sdk-react'
import { useEffect } from 'react'
import useIsMounted from './useIsMounted'

const useRedirectToTgBotOnDesktop = () => {
  const app = useMiniAppRaw(true)
  const isMounted = useIsMounted()

  useEffect(() => {
    const isMobile = isTouchDevice()

    if (!isMobile && !app?.result && isMounted) {
      console.log('redirect')

      window.location.href = 'https://t.me/botb1o1t_bot'
    }
  }, [!!app?.result, isMounted])
}

export default useRedirectToTgBotOnDesktop
