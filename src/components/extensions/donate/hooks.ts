import { useMetamaskDeepLink } from '@/components/MetamaskDeepLink'
import { SendMessageParams } from '@/services/subsocial/commentIds'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useExtensionData, useExtensionModalState } from '@/stores/extension'
import { useMyMainAddress } from '@/stores/my-account'
import { parseUnits } from 'ethers'
import { useRouter } from 'next/router'
import urlJoin from 'url-join'
import { useAccount } from 'wagmi'
import { BeforeMessageResult } from '../common/CommonExtensionModal'
import { useDonate, useGetBalance } from './api/hooks'
import {
  ChainListItem,
  DonateModalStep,
  TokenListItem,
} from './DonateModal/types'

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
    openExtensionModal('subsocial-donations', {
      messageId,
      recipient: ownerId,
    })
  }
}

type BuildBeforeSendParams = {
  setCurrentStep: (step: DonateModalStep) => void
  selectedToken: TokenListItem
  selectedChain: ChainListItem
}

type BeforeSendProps = {
  amount: string
  messageParams: SendMessageParams
}

export const useBuildEvmBeforeSend = ({
  setCurrentStep,
  selectedToken,
  selectedChain,
}: BuildBeforeSendParams) => {
  const { sendTransferTx } = useDonate(selectedToken.id, selectedChain.id)
  const { closeModal, initialData } = useExtensionModalState(
    'subsocial-donations'
  )
  const address = useMyMainAddress()
  const { address: myEvmAddress } = useAccount()
  const { data: recipientAccountData } = getAccountDataQuery.useQuery(
    initialData.recipient
  )

  const { decimals } = useGetBalance(selectedToken.id, selectedChain.id, false)

  const { evmAddress: evmRecipientAddress } = recipientAccountData || {}

  return async ({
    amount,
    messageParams,
  }: BeforeSendProps): Promise<BeforeMessageResult> => {
    if (!evmRecipientAddress || !myEvmAddress || !amount) {
      return { txPrevented: true }
    }

    const amountValue = parseUnits(amount, decimals)

    const hash = await sendTransferTx(
      evmRecipientAddress,
      amountValue,
      setCurrentStep,
      selectedToken.isNativeToken,
      decimals
    )

    if (hash && address && decimals) {
      const newMessageParams: SendMessageParams = {
        ...messageParams,
        extensions: [
          {
            id: 'subsocial-donations',
            properties: {
              chain: selectedChain.id,
              from: myEvmAddress,
              to: evmRecipientAddress,
              token: selectedToken.label,
              decimals,
              amount: amountValue.toString(),
              txHash: hash,
            },
          },
        ],
      }

      closeModal()
      setCurrentStep('donate-form')
      return { newMessageParams, txPrevented: false }
    }

    return { txPrevented: true }
  }
}
