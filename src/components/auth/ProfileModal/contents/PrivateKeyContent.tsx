import Button from '@/components/Button'
import { CopyTextInlineButton } from '@/components/CopyText'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { decodeSecretKey, isSecretKeyUsingMiniSecret } from '@/utils/account'
import { useMemo } from 'react'
import { ProfileModalContentProps } from '../types'

function PrivateKeyContent({ setCurrentState }: ProfileModalContentProps) {
  const encodedSecretKey = useMyAccount((state) => state.encodedSecretKey)
  const { secretKey, isUsingMiniSecret } = useMemo(() => {
    const decodedSecretKey = decodeSecretKey(encodedSecretKey ?? '')
    if (isSecretKeyUsingMiniSecret(decodedSecretKey)) {
      return { secretKey: `0x${decodedSecretKey}`, isUsingMiniSecret: true }
    }

    return {
      secretKey: decodedSecretKey,
      isUsingMiniSecret: false,
    }
  }, [encodedSecretKey])

  const sendEvent = useSendEvent()
  const onCopyClick = () => {
    sendEvent('copy_private_key')
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <p className='text-text-muted'>
        Grill key is like a long password. We recommend keeping it in a safe
        place, so you can recover your account.
      </p>
      <CopyTextInlineButton
        onCopyClick={onCopyClick}
        isCodeText
        wordBreakType={isUsingMiniSecret ? 'all' : 'words'}
        text={secretKey || ''}
      />
      <Button
        variant='primaryOutline'
        size='lg'
        className='w-full'
        onClick={() => setCurrentState('share-session')}
      >
        Share my session
      </Button>
    </div>
  )
}

export default PrivateKeyContent
