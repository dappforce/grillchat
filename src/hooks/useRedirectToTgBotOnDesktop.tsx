import { env } from '@/env.mjs'
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
      window.location.href = `https://t.me/${env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}`
    }
  }, [!!app?.result, isMounted])
}

export default useRedirectToTgBotOnDesktop
