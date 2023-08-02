import { getFirebaseNotificationAppId } from '@/utils/env/client'
import { getMessaging, getToken } from 'firebase/messaging'
import firebaseApp from './config'

export const getMessageToken = async (): Promise<string | undefined> => {
  const messaging = getMessaging(firebaseApp)

  const permission = Notification.permission

  if (permission === 'granted') {
    // The user has already granted permission.
    const registration = await navigator.serviceWorker.ready
    if (!registration) throw new Error('Registration not found')

    alert('GETTING TOKEN')
    const token = await getToken(messaging, {
      vapidKey: getFirebaseNotificationAppId(),
      serviceWorkerRegistration: registration,
    })
    alert(`TOKEN ${token}`)
    return token
  } else if (permission === 'denied') {
    // The user has denied permission.
    console.log('Permission denied by the user.')
  } else {
    // The user has not yet been asked for permission.
    return Notification.requestPermission().then(async () => {
      // The user has granted or denied permission.
      return await getMessageToken()
    })
  }
}
