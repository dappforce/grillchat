import Button from '@/components/Button'
import Notice from '@/components/Notice'
import Toast from '@/components/Toast'
import TextArea from '@/components/inputs/TextArea'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { SyntheticEvent, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { LoginModalContentProps } from '../LoginModalContent'

export const LoginWithGrillKeyContent = ({
  beforeLogin,
  afterLogin,
  closeModal,
}: LoginModalContentProps) => {
  const login = useMyAccount((state) => state.login)
  const [privateKey, setPrivateKey] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sendEvent = useSendEvent()

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    beforeLogin?.()

    const trimmedPk = privateKey.trim()
    if (await login(trimmedPk)) {
      afterLogin?.()
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
      <Notice noticeType='info'>
        IMPORTANT: Do not enter the private key of an account that holds any
        funds, assets, NFTs, etc.
      </Notice>
      <Button disabled={!privateKey} type='submit' size='lg'>
        Login
      </Button>
    </form>
  )
}