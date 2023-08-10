import { getIsInIframe } from '@/utils/window'
import { useEffect, useState } from 'react'

export default function useIsInIframe(initValue = false) {
  const [isInIframe, setIsInIframe] = useState(initValue)

  useEffect(() => {
    setIsInIframe(getIsInIframe())
  }, [])

  return isInIframe
}
