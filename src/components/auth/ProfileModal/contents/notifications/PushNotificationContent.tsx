import Button from '@/components/Button'
import Notice from '@/components/Notice'
import Toast from '@/components/Toast'
import { useLinkFcm } from '@/services/api/notifications/mutation'
import { getMessageToken } from '@/services/firebase/messaging'
import { useSendEvent } from '@/stores/analytics'
import { LocalStorage } from '@/utils/storage'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
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
      <div className='flex flex-col gap-6'>
        <Notice leftIcon='✅'>Push Notifications Enabled</Notice>
        <DisableNotificationButton
          setIsRegistered={setIsRegistered}
          {...props}
        />
      </div>
    )
  }

  return (
    <EnableNotificationButton setIsRegistered={setIsRegistered} {...props} />
  )
}

type NotificationButtonProps = ContentProps & {
  setIsRegistered: (v: boolean) => void
}

async function getMessageTokenWithCatch() {
  try {
    const fcmToken = await getMessageToken()
    console.log('FCM Token', fcmToken)
    if (!fcmToken) return
    return fcmToken
  } catch (err: any) {
    toast.custom((t) => (
      <Toast
        type='error'
        title='Failed to enable push notification'
        t={t}
        description='If you are using Brave browser, please go to brave://settings/privacy and turn on "Use Google services for push messaging".'
      />
    ))
  }
}

function DisableNotificationButton({
  address,
  setIsRegistered,
}: NotificationButtonProps) {
  const [isGettingToken, setIsGettingToken] = useState(false)
  const sendEvent = useSendEvent()

  const { mutate: unlinkFcm, isLoading: isUnlinking } = useLinkFcm({
    onSuccess: (data) => {
      if (!data) throw new Error('Error in disabling notification request')

      // FCM Token Disabled.
      fcmPushNotificationStorage.remove()
      setIsRegistered(false)
      sendEvent('wp_notifs_disabled', undefined, { webNotifsEnabled: false })
    },
  })

  const isLoading = isUnlinking || isGettingToken

  const handleClickDisable = async () => {
    if (!address) return
    setIsGettingToken(true)
    const fcmToken = await getMessageTokenWithCatch()
    setIsGettingToken(false)
    if (!fcmToken) return

    unlinkFcm({ address, fcmToken, action: 'unlink' })
  }

  return (
    <Button
      size='lg'
      variant='redOutline'
      onClick={handleClickDisable}
      isLoading={isLoading}
    >
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
    onSuccess: () => {
      // FCM Token Enabled.
      if (fcmToken) {
        fcmPushNotificationStorage.set(fcmToken)
        setIsRegistered(true)
        sendEvent('wp_notifs_allowed', undefined, { webNotifsEnabled: true })
      }
    },
  })

  const isLoading = isLinking || isGettingToken

  const handleClickEnable = async () => {
    if (!address) return
    setIsGettingToken(true)
    const fcmToken = await getMessageTokenWithCatch()
    setIsGettingToken(false)
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

export function useIsPushNotificationEnabled() {
  const [isPushNotificationEnabled, setIsPushNotificationEnabled] =
    useState(false)

  useEffect(() => {
    if (typeof Notification === 'undefined') return

    const permission = Notification.permission
    const storedFcmToken = fcmPushNotificationStorage.get()
    setIsPushNotificationEnabled(!!storedFcmToken && permission === 'granted')
  }, [])

  return isPushNotificationEnabled
}
