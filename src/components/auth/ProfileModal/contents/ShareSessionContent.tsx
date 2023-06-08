import { CopyText } from '@/components/CopyText'
import QrCode from '@/components/QrCode'
import { ACCOUNT_SECRET_KEY_URL_PARAMS } from '@/pages/account'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { getCurrentUrlOrigin } from '@/utils/links'
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
      <QrCode url={shareSessionLink} />
      <CopyText text={shareSessionLink} onCopyClick={onCopyClick} />
    </div>
  )
}

export default ShareSessionContent
