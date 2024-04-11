import { isTouchDevice } from '@/utils/device'
import { useEffect, useState } from 'react'

const useIsTouchDevice = () => {
  const [isTouchDeviceValue, setIsTouchDevice] = useState(false)

  const isMobile = isTouchDevice()

  useEffect(() => {
    setIsTouchDevice(isMobile)
  }, [isMobile])

  return isTouchDeviceValue
}

export default useIsTouchDevice
