import Button from '@/components/Button'
import { useLinkFcm } from '@/services/api/notifications/mutation'
import { getMessageToken } from '@/services/firebase/messaging'
import { useSendEvent } from '@/stores/analytics'
import { LocalStorage } from '@/utils/storage'
import { useEffect, useState } from 'react'
import { ContentProps } from '../../types'

const FCM_PUSH_NOTIFICATION_STORAGE_KEY = 'push-notification-fcm-token'
export const fcmPushNotificationStorage = new LocalStorage(
  () => FCM_PUSH_NOTIFICATION_STORAGE_KEY
)

export default function PushNotificationContent(props: ContentProps) {
  const isNotificationNotSupported = typeof Notification === 'undefined'

  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const storedFcmToken = fcmPushNotificationStorage.get()
    setIsRegistered(!!storedFcmToken)
  }, [isRegistered])

  if (isNotificationNotSupported) {
    return (
      <Button disabled size='lg'>
        Unsupported Browser Notifications
      </Button>
    )
  }

  const permission = Notification.permission
  if (permission === 'granted' && isRegistered) {
    return (
      <DisableNotificationButton setIsRegistered={setIsRegistered} {...props} />
    )
  }

  return (
    <EnableNotificationButton setIsRegistered={setIsRegistered} {...props} />
  )
}

type NotificationButtonProps = ContentProps & {
  setIsRegistered: (v: boolean) => void
}

function DisableNotificationButton({
  address,
  setIsRegistered,
}: NotificationButtonProps) {
  const [isGettingToken, setIsGettingToken] = useState(false)

  const { mutate: unlinkFcm, isLoading: isUnlinking } = useLinkFcm({
    onSuccess: (data) => {
      if (!data) throw new Error('Error in disabling notification request')

      // FCM Token Disabled.
      fcmPushNotificationStorage.remove()
      setIsRegistered(false)
    },
  })

  const isLoading = isUnlinking || isGettingToken

  const handleClickDisable = async () => {
    if (!address) return
    setIsGettingToken(true)
    const fcmToken = await getMessageToken()
    setIsGettingToken(false)
    if (!fcmToken) return

    unlinkFcm({ address, fcmToken, action: 'unlink' })
  }

  return (
    <Button size='lg' onClick={handleClickDisable} isLoading={isLoading}>
      Disable Notifications
    </Button>
  )
}

function EnableNotificationButton({
  address,
  setIsRegistered,
}: NotificationButtonProps) {
  const [isGettingToken, setIsGettingToken] = useState(false)
  const [fcmToken, setFcmToken] = useState<string | undefined>()
  const sendEvent = useSendEvent()

  const { mutate: linkFcm, isLoading: isLinking } = useLinkFcm({
    onSuccess: (data) => {
      // FCM Token Enabled.
      if (fcmToken) {
        fcmPushNotificationStorage.set(fcmToken)
        setIsRegistered(true)
        sendEvent('wp_notifs_allowed', { wpNotifsAllowed: true })
      }
    },
  })

  const isLoading = isLinking || isGettingToken

  const handleClickEnable = async () => {
    if (!address) return
    setIsGettingToken(true)
    const fcmToken = await getMessageToken()
    setIsGettingToken(false)
    console.log('FCM Token', fcmToken)
    if (!fcmToken) return

    setFcmToken(fcmToken)
    linkFcm({ address, fcmToken, action: 'link' })
    sendEvent('wp_notifs_asked')
  }

  return (
    <Button size='lg' onClick={handleClickEnable} isLoading={isLoading}>
      Enable Notifications
    </Button>
  )
}
