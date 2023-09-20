import firebaseApp from '@/services/firebase/config'
import { getMessaging, onMessage } from 'firebase/messaging'
import { useEffect } from 'react'

export default function ForegroundNotificationHandler() {
  useEffect(() => {
    console.log('SUBSCRIBED FOREGROUND NOTIFICATION')
    const messaging = getMessaging(firebaseApp)
    onMessage(messaging, (payload) => {
      const notificationData = payload.data
      console.log('RECEIVE NOTIFICATION', payload)

      if (!notificationData) return
      try {
        // @ts-ignore
        // const data = notificationData?.['FCM_MSG']?.['data']
        // const { postId, rootPostId, spaceId } = data || {}
        // const urlToOpen = `/${spaceId}/${rootPostId}/${postId}`
        // toast.custom((t) => (
        //   <Toast t={t} title={} />
        // ))
      } catch (e) {
        console.log('Error in loading notification response:', e)
      }
    })
  }, [])
  return null
}
