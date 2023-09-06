import usePrevious from '@/hooks/usePrevious'
import { useCallback, useEffect, useState } from 'react'

export default function useAnyNewData(
  dataLength: number,
  initialNewMessageCount?: number
) {
  const [anyNewData, setAnyNewData] = useState(initialNewMessageCount ?? 0)
  const previousDataLength = usePrevious(dataLength)

  useEffect(() => {
    const newDataLength = dataLength - (previousDataLength ?? dataLength)
    if (newDataLength > 0) setAnyNewData((prev) => prev + newDataLength)
  }, [previousDataLength, dataLength])

  const clearAnyNewData = useCallback(() => setAnyNewData(0), [])

  return {
    anyNewData,
    clearAnyNewData,
  }
}
