import { getIsInIframe } from '@/utils/window'
import { useEffect, useState } from 'react'

export default function useIsInIframe() {
  const [isInIframe, setIsInIframe] = useState(false)

  useEffect(() => {
    setIsInIframe(getIsInIframe())
  }, [])

  return isInIframe
}
