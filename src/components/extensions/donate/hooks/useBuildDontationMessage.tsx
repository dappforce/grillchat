import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { SendMessageParams } from '@/services/subsocial/commentIds'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useExtensionModalState } from '@/stores/extension'
import { useMyMainAddress } from '@/stores/my-account'
import { DonateProperies } from '@subsocial/api/types'
import { parseUnits } from 'ethers'
import { useAccount } from 'wagmi'
import { BeforeMessageResult } from '../../common/CommonExtensionModal'
import { useDonate, useGetBalance } from '../api/hooks'
import { useSubstrateDonation } from '../DonateModal/donateForm/mutation'
import {
  ChainListItem,
  DonateModalStep,
  TokenListItem,
} from '../DonateModal/types'

type BuildBeforeSendParams = {
  setCurrentStep: (step: DonateModalStep) => void
  selectedToken: TokenListItem
  selectedChain: ChainListItem
}

type BeforeSendProps = {
  amount: string
  messageParams: SendMessageParams
}

export const useBuildEvmDontationMessage = ({
  setCurrentStep,
  selectedToken,
  selectedChain,
}: BuildBeforeSendParams) => {
  const { sendTransferTx } = useDonate(selectedToken.id, selectedChain.id)
  const { closeModal, initialData } = useExtensionModalState(
    'subsocial-donations'
  )
  const { address: myEvmAddress } = useAccount()
  const { data: recipientAccountData } = getAccountDataQuery.useQuery(
    initialData.recipient
  )

  const { decimals } = useGetBalance(selectedToken.id, selectedChain.id, false)

  const { evmAddress: evmRecipientAddress } = recipientAccountData || {}

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

export const useBuildSubstrateDontationMessage = ({
  setCurrentStep,
  selectedToken,
  selectedChain,
}: BuildBeforeSendParams) => {
  const { closeModal, initialData } = useExtensionModalState(
    'subsocial-donations'
  )
  const address = useMyMainAddress()

  const toDonateForm = () => setCurrentStep('donate-form')
  const { mutateAsync: sendDonation } = useSubstrateDonation(undefined, {
    chainName: selectedChain.id,
    toWalletActionRequired: () => setCurrentStep('wallet-action-required'),
    toDonateForm: toDonateForm,
    onSuccessAction: toDonateForm,
  })

  const chainData = useGetChainDataByNetwork(selectedChain.id)

  const { decimal } = chainData || {}

  const recipient = initialData.recipient

  return async ({
    amount,
    messageParams,
  }: BeforeSendProps): Promise<BeforeMessageResult> =>
    buildMessageParams({
      sendTx: (amountValue) =>
        sendDonation({ recipient, amount: amountValue.toString() }),
      newExtensionMessageParams: {
        chain: selectedChain.id,
        from: address,
        to: recipient,
        token: selectedToken.label,
        decimals: decimal,
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
