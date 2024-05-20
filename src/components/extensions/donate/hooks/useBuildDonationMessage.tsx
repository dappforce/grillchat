import useLinkedEvmAddress from '@/hooks/useLinkedEvmAddress'
import { SendMessageParams } from '@/services/subsocial/commentIds/types'
import { useExtensionModalState } from '@/stores/extension'
import { DonateProperies } from '@subsocial/api/types'
import { parseUnits } from 'ethers'
import { useAccount } from 'wagmi'
import { BeforeMessageResult } from '../../common/CommonExtensionModal'
import {
  ChainListItem,
  DonateModalStep,
  TokenListItem,
} from '../DonateModal/types'
import { useDonate, useGetBalance } from '../api/hooks'

type BuildBeforeSendParams = {
  setCurrentStep: (step: DonateModalStep) => void
  selectedToken: TokenListItem
  selectedChain: ChainListItem
}

type BeforeSendProps = {
  amount: string
  messageParams: SendMessageParams
}

export function useBuildDonationMessage(props: BuildBeforeSendParams) {
  const buildEvmMessage = useBuildEvmDonationMessage(props)
  return buildEvmMessage
}

export function useBuildEvmDonationMessage({
  setCurrentStep,
  selectedToken,
  selectedChain,
}: BuildBeforeSendParams) {
  const { sendTransferTx } = useDonate(selectedToken.id, selectedChain.id)
  const { closeModal, initialData } = useExtensionModalState(
    'subsocial-donations'
  )
  const { address: myEvmAddress } = useAccount()
  const { evmAddress: evmRecipientAddress } = useLinkedEvmAddress(
    initialData.recipient
  )

  const { decimals } = useGetBalance(selectedToken.id, selectedChain.id, false)

  return async ({
    amount,
    messageParams,
  }: BeforeSendProps): Promise<BeforeMessageResult> =>
    buildMessageParams({
      sendTx: (amountValue) =>
        sendTransferTx(
          evmRecipientAddress || '',
          amountValue,
          setCurrentStep,
          selectedToken.isNativeToken,
          decimals
        ),
      newExtensionMessageParams: {
        chain: selectedChain.id,
        from: myEvmAddress as string,
        to: evmRecipientAddress || '',
        token: selectedToken.label,
        decimals,
        amount,
      },
      messageParams,
      closeModal,
      setCurrentStep,
    })
}

type MessageParams = {
  chain: string
  from: string | null
  to?: string
  token: string
  decimals?: number
  amount: string
}

type BuildMessageParamsProps = {
  newExtensionMessageParams: MessageParams
  messageParams: SendMessageParams
  closeModal: () => void
  setCurrentStep: (step: DonateModalStep) => void
  sendTx: (amountValue: bigint) => Promise<string | undefined>
}

const buildMessageParams = async ({
  newExtensionMessageParams,
  messageParams,
  closeModal,
  setCurrentStep,
  sendTx,
}: BuildMessageParamsProps): Promise<BeforeMessageResult> => {
  const { to, from, amount, decimals } = newExtensionMessageParams

  if (!to || !from || !amount) {
    return { txPrevented: true }
  }

  const amountValue = parseUnits(amount, decimals)

  const hash = await sendTx(amountValue)

  if (hash && from && decimals) {
    const newMessageParams: SendMessageParams = {
      ...messageParams,
      extensions: [
        {
          id: 'subsocial-donations',
          properties: {
            ...(newExtensionMessageParams as DonateProperies),
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
