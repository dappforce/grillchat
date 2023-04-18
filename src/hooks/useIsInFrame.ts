import { getIsInIframe } from '@/utils/window'
import { useEffect, useState } from 'react'

export default function useIsInFrame() {
  const [isInFrame, setIsInFrame] = useState(false)

  useEffect(() => {
    setIsInFrame(getIsInIframe())
  }, [])

  return isInFrame
}
