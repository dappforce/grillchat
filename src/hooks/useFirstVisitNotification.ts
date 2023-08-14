import { useMyAccount } from '@/stores/my-account'
import { LocalStorage } from '@/utils/storage'
import { useEffect, useState } from 'react'

function getStorage(storageKey: string) {
  const storage = new LocalStorage(
    (address: string) => `${storageKey}:${address}`
  )
  return storage
}

export default function useFirstVisitNotification(storageKey: string) {
  const myAddress = useMyAccount((state) => state.address)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const storage = getStorage(storageKey)
    if (!storage.get(myAddress ?? '')) {
      setShowNotification(true)
    }
  }, [myAddress, storageKey])

  return {
    showNotification,
    closeNotification: () => {
      setShowNotification(false)
      if (!myAddress) return

      const storage = getStorage(storageKey)
      storage.set('1', myAddress)
    },
  }
}
