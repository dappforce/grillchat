import { useMetamaskDeepLink } from '@/components/MetamaskDeepLink'
import { useExtensionData } from '@/stores/extension'
import { useRouter } from 'next/router'
import urlJoin from 'url-join'

export function useOpenDonateExtension(messageId: string, ownerId: string) {
  const router = useRouter()

  const openExtensionModal = useExtensionData(
    (state) => state.openExtensionModal
  )
  const deepLink = useMetamaskDeepLink({
    customDeeplinkReturnUrl: (currentUrl) =>
      urlJoin(
        currentUrl,
        `?donateTo=${JSON.stringify({
          messageId,
          recipient: ownerId,
        })}`
      ),
  })

  return () => {
    // if (!isInsideMetamaskBrowser()) {
    //   router.push(deepLink)
    // } else {
    openExtensionModal('subsocial-donations', {
      messageId,
      recipient: ownerId,
    })
    // }
  }
}
