import Button from '@/components/Button'
import Toast from '@/components/Toast'
import TextArea from '@/components/inputs/TextArea'
import { useSetReferrerId } from '@/services/datahub/referral/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { getUrlQuery } from '@/utils/links'
import { DataHubClientId } from '@subsocial/data-hub-sdk'
import { SyntheticEvent, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { LoginModalContentProps } from '../LoginModalContent'

export const EnterSecretKeyContent = ({
  beforeLogin,
  afterLogin,
  closeModal,
}: LoginModalContentProps) => {
  const login = useMyAccount((state) => state.login)
  const [privateKey, setPrivateKey] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sendEvent = useSendEvent()

  // TODO: remove after login revamp
  const { mutate: setReferrerId } = useSetReferrerId()

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    beforeLogin?.()

    const trimmedPk = privateKey.trim()
    const refId = getUrlQuery('ref')
    if (await login(trimmedPk)) {
      afterLogin?.()
      if (refId) {
        setReferrerId({ clientId: DataHubClientId.GRILLSO, refId })
      }
      sendEvent('login', { eventSource: 'login_modal' })
      setPrivateKey('')
      closeModal()
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
  }

  return (
    <form onSubmit={onSubmit} className='mt-2 flex flex-col gap-4'>
      <TextArea
        ref={inputRef}
        value={privateKey}
        rows={3}
        size='sm'
        autoFocus
        variant='fill-bg'
        onChange={(e) => setPrivateKey((e.target as HTMLTextAreaElement).value)}
        placeholder='Enter your Grill key'
      />
      <Button disabled={!privateKey} type='submit' size='lg'>
        Login
      </Button>
    </form>
  )
}
