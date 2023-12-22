import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import Notice from '@/components/Notice'
import Toast from '@/components/Toast'
import { useLinkFcm } from '@/services/api/notifications/mutation'
import { getMessageToken } from '@/services/firebase/messaging'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { installApp } from '@/utils/install'
import { LocalStorage } from '@/utils/storage'
import { getIsInIos } from '@/utils/window'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ProfileModalContentProps } from '../../types'

const FCM_PUSH_NOTIFICATION_STORAGE_KEY = 'push-notification-fcm-token'
export const fcmPushNotificationStorage = new LocalStorage(
  (address: string) => `${FCM_PUSH_NOTIFICATION_STORAGE_KEY}-${address}`
)

type NotificationUsableStatus = 'need-install' | 'unsupported' | 'usable'
export function getPushNotificationUsableStatus(): NotificationUsableStatus {
  if (typeof Notification === 'undefined') {
    if (getIsInIos()) {
      return 'need-install'
    }
    return 'unsupported'
  }
  return 'usable'
}

export default function PushNotificationContent(
  props: ProfileModalContentProps
) {
  const myAddress = useMyAccount((state) => state.address)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isAfterRegister, setIsAfterRegister] = useState(false)

  useEffect(() => {
    if (!myAddress) return
    const storedFcmToken = fcmPushNotificationStorage.get(myAddress)
    setIsRegistered(!!storedFcmToken)
  }, [isRegistered, myAddress])

  const usableStatus = getPushNotificationUsableStatus()
  if (usableStatus === 'need-install') {
    return (
      <Button variant='primaryOutline' size='lg' onClick={installApp}>
        Install app
      </Button>
    )
  }
  if (usableStatus === 'unsupported') {
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
        {isAfterRegister ? (
          <Button
            variant='primary'
            onClick={() => props.setCurrentState('notifications')}
            size='lg'
          >
            Got it
          </Button>
        ) : (
          <DisableNotificationButton
            setIsRegistered={setIsRegistered}
            {...props}
          />
        )}
      </div>
    )
  }

  return (
    <EnableNotificationButton
      setIsRegistered={(v) => {
        setIsAfterRegister(true)
        setIsRegistered(v)
      }}
      {...props}
    />
  )
}

type NotificationButtonProps = ProfileModalContentProps & {
  setIsRegistered: (v: boolean) => void
}

async function getMessageTokenWithCatch() {
  try {
    const fcmToken = await getMessageToken()
    console.log('FCM Token', fcmToken)
    if (!fcmToken) {
      toast.custom((t) => (
        <Toast
          type='error'
          title='Failed to enable push notification'
          subtitle='Notification permission was not granted.'
          t={t}
          description={
            <span>
              If you have blocked the notification permission, please go to your
              browser settings or go to{' '}
              <LinkText href='chrome://settings/content/notifications'>
                chrome://settings/content/notifications
              </LinkText>{' '}
              and allow it.
            </span>
          }
        />
      ))
      return
    }
    return fcmToken
  } catch {
    toast.custom((t) => (
      <Toast
        type='error'
        title='Failed to enable push notification'
        t={t}
        description='If you are using Brave browser, please go to "brave://settings/privacy" and turn on "Use Google services for push messaging".'
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
  const myAccount = useMyAccount((state) => state.address)

  const { mutate: unlinkFcm, isLoading: isUnlinking } = useLinkFcm({
    onSuccess: (data) => {
      if (!data) throw new Error('Error in disabling notification request')

      // FCM Token Disabled.
      fcmPushNotificationStorage.remove(myAccount ?? '')
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
  const myAddress = useMyAccount((state) => state.address)
  const [isGettingToken, setIsGettingToken] = useState(false)
  const [fcmToken, setFcmToken] = useState<string | undefined>()
  const sendEvent = useSendEvent()

  const { mutate: linkFcm, isLoading: isLinking } = useLinkFcm({
    onSuccess: () => {
      // FCM Token Enabled.
      if (fcmToken && myAddress) {
        fcmPushNotificationStorage.set(fcmToken, myAddress)
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
  const myAddress = useMyAccount((state) => state.address)
  const [isPushNotificationEnabled, setIsPushNotificationEnabled] =
    useState(false)

  useEffect(() => {
    if (typeof Notification === 'undefined' || !myAddress) return

    const permission = Notification.permission
    const storedFcmToken = fcmPushNotificationStorage.get(myAddress)
    setIsPushNotificationEnabled(!!storedFcmToken && permission === 'granted')
  }, [myAddress])

  return isPushNotificationEnabled
}
