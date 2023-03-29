import usePrevious from '@/hooks/usePrevious'
import { useCallback, useEffect, useState } from 'react'

export default function useAnyNewData(data: unknown[]) {
  const [anyNewData, setAnyNewData] = useState(0)
  const previousDataLength = usePrevious(data.length)

  useEffect(() => {
    const newDataLength = data.length - (previousDataLength ?? data.length)
    if (newDataLength > 0) setAnyNewData((prev) => prev + newDataLength)
  }, [previousDataLength, data])

  const clearAnyNewData = useCallback(() => setAnyNewData(0), [])

  return {
    anyNewData,
    clearAnyNewData,
  }
}
