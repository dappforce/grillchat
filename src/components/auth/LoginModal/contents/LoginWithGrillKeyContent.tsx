import Button from '@/components/Button'
import Notice from '@/components/Notice'
import Toast from '@/components/Toast'
import TextArea from '@/components/inputs/TextArea'
import { getReferralIdInUrl } from '@/components/referral/ReferralUrlChanger'
import { getProfileQuery } from '@/services/api/query'
import { useSendEvent } from '@/stores/analytics'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount } from '@/stores/my-account'
import { isSecretKeyUsingMiniSecret } from '@/utils/account'
import { useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { LoginModalContentProps } from '../LoginModalContent'
import { finishLogin } from '../utils'

export const LoginWithGrillKeyContent = ({
  beforeLogin,
  afterLogin,
  closeModal,
}: LoginModalContentProps) => {
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
    if (address) {
      const profile = await getProfileQuery.fetchQuery(queryClient, address)
      afterLogin?.()
      sendEvent(
        'login',
        { eventSource: 'login_modal', loginBy: 'grill-key' },
        { ref: getReferralIdInUrl() }
      )
      setPrivateKey('')

      if (!profile?.profileSpace?.id) {
        useLoginModal.getState().openNextStepModal({ step: 'create-profile' })
        closeModal()
      } else {
        finishLogin(closeModal)
      }
    } else {
      toast.custom((t) => (
        <Toast
          t={t}
          type='error'
          title='Login Failed'
          description='The Grill key you provided is not valid'
        />
      ))
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className='mt-2 flex flex-col gap-4'>
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
