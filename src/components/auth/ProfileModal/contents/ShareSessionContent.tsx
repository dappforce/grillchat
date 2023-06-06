import { CopyText } from '@/components/CopyText'
import { ACCOUNT_SECRET_KEY_URL_PARAMS } from '@/pages/account'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { getCurrentUrlOrigin } from '@/utils/links'
import QRCode from 'react-qr-code'
import urlJoin from 'url-join'

function ShareSessionContent() {
  const encodedSecretKey = useMyAccount((state) => state.encodedSecretKey)
  const sendEvent = useSendEvent()
  const onCopyClick = () => {
    sendEvent('click copy_share_session_link')
  }

  const shareSessionLink = urlJoin(
    getCurrentUrlOrigin(),
    `/account?${ACCOUNT_SECRET_KEY_URL_PARAMS}=${encodedSecretKey}`
  )

  return (
    <div className='mt-2 flex flex-col gap-4'>
      <div className='mx-auto mb-2 h-40 w-40 rounded-2xl bg-white p-4'>
        <QRCode
          value={shareSessionLink}
          size={256}
          className='h-full w-full'
          viewBox='0 0 256 256'
        />
      </div>
      <CopyText text={shareSessionLink} onCopyClick={onCopyClick} />
    </div>
  )
}

export default ShareSessionContent
