import Button from '@/components/Button'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { ContentProps } from '../types'

function LogoutContent({ setCurrentState }: ContentProps) {
  const logout = useMyAccount((state) => state.logout)
  const sendEvent = useSendEvent()

  const onShowPrivateKeyClick = () => {
    setCurrentState('private-key')
  }
  const onLogoutClick = () => {
    sendEvent('account_logout')
    logout()
  }

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <Button size='lg' onClick={onShowPrivateKeyClick}>
        No, show me my Grill secret key
      </Button>
      <Button size='lg' onClick={onLogoutClick} variant='primaryOutline'>
        Yes, log out
      </Button>
    </div>
  )
}

export default LogoutContent
