import { useExtensionData } from '@/stores/extension'

export function useOpenDonateExtension(messageId: string, ownerId: string) {
  const openExtensionModal = useExtensionData(
    (state) => state.openExtensionModal
  )

  return () => {
    openExtensionModal('subsocial-donations', {
      messageId,
      recipient: ownerId,
    })
  }
}
