import { CopyText } from '@/components/CopyText'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { decodeSecretKey, isSecretKeyUsingMiniSecret } from '@/utils/account'
import { useMemo } from 'react'

function PrivateKeyContent() {
  const encodedSecretKey = useMyAccount((state) => state.encodedSecretKey)
  const secretKey = useMemo(() => {
    const decodedSecretKey = decodeSecretKey(encodedSecretKey ?? '')
    if (isSecretKeyUsingMiniSecret(decodedSecretKey)) {
      return `0x${decodedSecretKey}`
    }

    return Buffer.from(decodedSecretKey, 'hex').toString()
  }, [encodedSecretKey])

  const sendEvent = useSendEvent()
  const onCopyClick = () => {
    sendEvent('click copy_private_key_button')
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <p className='mb-2 text-text-muted'>
        Grill secret key is like a long password. We recommend keeping it in a
        safe place, so you can recover your account.
      </p>
      <CopyText onCopyClick={onCopyClick} isCodeText text={secretKey || ''} />
    </div>
  )
}

export default PrivateKeyContent
