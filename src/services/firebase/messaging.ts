import { getFirebaseNotificationAppId } from '@/utils/env/client'
import { getMessaging, getToken } from 'firebase/messaging'
import firebaseApp from './config'

export const getMessageToken = async (): Promise<String | undefined> => {
  const messaging = getMessaging(firebaseApp)

  const permission = Notification.permission

  if (permission === 'granted') {
    // The user has already granted permission.
    const token = await getToken(messaging, {
      vapidKey: getFirebaseNotificationAppId(),
    })

    alert(`Copy the FCM token: ${token}`)
    return token
  } else if (permission === 'denied') {
    // The user has denied permission.
    console.log('Permission denied by the user.')
  } else {
    // The user has not yet been asked for permission.
    Notification.requestPermission().then(async () => {
      // The user has granted or denied permission.
      await getMessageToken()
    })
  }
}
