import Button from '@/components/Button'
import Notice from '@/components/Notice'
import TextArea from '@/components/inputs/TextArea'
import { sendEventWithRef } from '@/components/referral/analytics'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { useSendEvent } from '@/stores/analytics'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount } from '@/stores/my-account'
import { isSecretKeyUsingMiniSecret } from '@/utils/account'
import { useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useRef, useState } from 'react'
import { LoginModalContentProps } from '../LoginModalContent'
import ScanQRButton from '../ScanQRButton'
import { finishLogin } from '../utils'

export const LoginWithGrillKeyContent = (props: LoginModalContentProps) => {
  const { beforeLogin, afterLogin, closeModal } = props

  const login = useMyAccount((state) => state.login)
  const [privateKey, setPrivateKey] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sendEvent = useSendEvent()
  const queryClient = useQueryClient()

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)
    beforeLogin?.()

    const trimmedPk = privateKey.trim()
    const address = await login(trimmedPk)
    const mainAddress = useMyAccount.getState().parentProxyAddress || address
    if (mainAddress) {
      const profile = await getProfileQuery.fetchQuery(queryClient, mainAddress)
      afterLogin?.()
      setPrivateKey('')

      if (!profile?.profileSpace?.id) {
        useLoginModal.getState().openNextStepModal({ step: 'create-profile' })
        closeModal()

        sendEventWithRef(mainAddress, (refId) => {
          sendEvent(
            'login',
            { eventSource: 'login_modal', loginBy: 'grill-key' },
            { ref: refId }
          )
        })
      } else {
        await sendEventWithRef(mainAddress, (refId) => {
          sendEvent(
            'login',
            { eventSource: 'login_modal', loginBy: 'grill-key' },
            { ref: refId }
          )
        })

        finishLogin(closeModal)
      }
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className='mt-2 flex flex-col gap-4'>
      <ScanQRButton {...props} />
      <TextArea
        ref={inputRef}
        value={privateKey}
        rows={3}
        size='sm'
        autoFocus
        onPaste={() => sendEvent('login_grill_key_pasted')}
        variant='fill-bg'
        onChange={(e) => setPrivateKey((e.target as HTMLTextAreaElement).value)}
        placeholder='Enter your Grill key'
      />
      <Notice noticeType='info'>
        IMPORTANT: Do not enter the private key of an account that holds any
        funds, assets, NFTs, etc.
      </Notice>
      <Button
        isLoading={isLoading}
        disabled={!isValidSecretKey(privateKey)}
        type='submit'
        size='lg'
      >
        Login
      </Button>
    </form>
  )
}

function isValidSecretKey(key: string) {
  if (key.startsWith('0x')) {
    const augmented = key.slice(2)
    return isSecretKeyUsingMiniSecret(augmented)
  }

  const words = key.split(' ').filter(Boolean)
  if (words.length !== 12) {
    return false
  }

  return true
}
