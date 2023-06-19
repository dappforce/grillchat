import Astar from '@/assets/graphics/chains/astar.png'
import Moonbeam from '@/assets/graphics/chains/moonbeam.png'
import Poligon from '@/assets/graphics/chains/poligon.png'
import ProcessingHumster from '@/assets/graphics/processing-humster.png'
import ETH from '@/assets/graphics/tokens/eth.png'
import MATIC from '@/assets/graphics/tokens/matic.png'
import USDC from '@/assets/graphics/tokens/usdc.png'
import USDT from '@/assets/graphics/tokens/usdt.png'
import Button from '@/components/Button'
import CommonExtensionModal from '@/components/extensions/CommonExtensionModal'
import Dropdown, { ListItem } from '@/components/inputs/SelectInput'
import ProfilePreview from '@/components/ProfilePreview'
import useGetTheme from '@/hooks/useGetTheme'
import { SendMessageParams } from '@/services/subsocial/commentIds'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import BigNumber from 'bignumber.js'
import { parseUnits } from 'ethers'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'
import Modal, { ModalFunctionalityProps } from '../../modals/Modal'
import AmountInput from './AmountInput'
import { useDonate, useGetBalance } from './api/hooks'
import { getConnector, openMobileWallet } from './api/utils'

const chainItems = [
  {
    id: 'polygon',
    icon: Poligon,
    label: 'Polygon',
  },
  {
    id: 'astar',
    icon: Astar,
    label: 'Astar',
    disabledItem: true,
  },
  {
    id: 'moonbeam',
    icon: Moonbeam,
    label: 'Moonbeam',
    disabledItem: true,
  },
]

const tokensItems = [
  {
    id: 'usdt',
    icon: USDT,
    label: 'USDT',
  },
  {
    id: 'usdc',
    icon: USDC,
    label: 'USDC',
  },
  {
    id: 'matic',
    icon: MATIC,
    label: 'MATIC',
    isNativeToken: true,
  },
  {
    id: 'eth',
    icon: ETH,
    label: 'ETH',
  },
]

export type DonateModalStep = 'donate-form' | 'wallet-action-required'

type DonateProps = DonateModalProps & {
  setCurrentStep: (currentStep: DonateModalStep) => void
  currentStep: DonateModalStep
}

type DonateModalContent = {
  [key in DonateModalStep]: (props: DonateProps) => JSX.Element
}

const modalByStep: DonateModalContent = {
  'donate-form': DonateForm,
  'wallet-action-required': WalletActionRequiredModal,
}

type DonateModalProps = ModalFunctionalityProps & {
  recipient: string
  messageId: string
  chatId: string
}

export default function DonateModals(props: DonateModalProps) {
  const [currentStep, setCurrentStep] = useState<DonateModalStep>('donate-form')

  useEffect(() => {
    setCurrentStep('donate-form')
  }, [])

  const ModalByStep = modalByStep[currentStep]

  return (
    <ModalByStep
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      {...props}
    />
  )
}

function DonateForm({
  recipient,
  messageId,
  chatId,
  setCurrentStep,
  ...props
}: DonateProps) {
  const theme = useGetTheme()
  const isDarkTheme = theme === 'dark'
  const [selectedChain, setSelectedChain] = useState<ListItem>(chainItems[0])
  const [selectedToken, setSelectedToken] = useState<ListItem>(tokensItems[0])
  const [inputError, setInputError] = useState<string | undefined>()
  const [amount, setAmount] = useState<string>('')
  const address = useMyAccount((state) => state.address)
  const { balance, decimals } = useGetBalance(
    selectedToken.id,
    selectedChain.id
  )

  const { data: recipientAccountData } = getAccountDataQuery.useQuery(recipient)
  const { data: myAccountData } = getAccountDataQuery.useQuery(address || '')

  const { evmAddress: evmRecipientAddress } = recipientAccountData || {}
  const { evmAddress: myEvmAddress } = myAccountData || {}

  const { sendTransferTx } = useDonate(selectedToken.id, selectedChain.id)

  const onButtonClick = async (messageParams: SendMessageParams) => {
    if (!evmRecipientAddress || !myEvmAddress || !amount) {
      return { txPrevented: true }
    }

    const amountValue = parseUnits(parseFloat(amount).toString(), decimals)

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

      props.closeModal()
      return { newMessageParams, txPrevented: false }
    }

    return { txPrevented: true }
  }

  const disableSendButton =
    !amount ||
    !balance ||
    new BigNumber(amount || '0').eq(0) ||
    new BigNumber(balance || '0').eq(0)

  return (
    <CommonExtensionModal
      {...props}
      chatId={chatId}
      disableSendButton={disableSendButton || !!inputError}
      sendButtonText='Send'
      beforeMesageSend={onButtonClick}
      title={'💰 Donate'}
      withCloseButton
      panelClassName='pb-5'
    >
      <div>
        <div className='mb-2 flex justify-between text-sm font-normal leading-4 text-gray-400'>
          Recipient
        </div>
        <div
          className={cx(
            'mb-6 mt-2 rounded-2xl p-4',
            isDarkTheme ? 'bg-slate-700' : 'bg-slate-200'
          )}
        >
          <ProfilePreview
            address={recipient}
            avatarClassName='h-12 w-12'
            withGrillAddress={false}
          />
        </div>
        <div className='flex flex-col gap-6'>
          <Dropdown
            selected={selectedChain}
            setSelected={setSelectedChain}
            fieldLabel='Chain'
            items={chainItems}
          />
          <Dropdown
            selected={selectedToken}
            setSelected={setSelectedToken}
            fieldLabel='Token'
            items={tokensItems}
          />
          <AmountInput
            amount={amount}
            setAmount={setAmount}
            inputError={inputError}
            setInputError={setInputError}
            tokenSymbol={selectedToken.label}
            balance={balance}
            decimals={decimals}
          />
        </div>
      </div>
    </CommonExtensionModal>
  )
}

function WalletActionRequiredModal(props: DonateProps) {
  const { chains } = useNetwork()

  const onButtonClick = async () => {
    const connector = getConnector({ chains })
    await openMobileWallet({ connector })
  }

  return (
    <Modal
      {...props}
      title={'🔐 Wallet Action Required'}
      description={
        'Please open your EVM wallet and perform the necessary actions to ensure its optimal functionality.'
      }
      panelClassName='pb-5'
    >
      <div className='flex w-full flex-col items-center gap-4'>
        <Image
          className='w-64 max-w-xs rounded-full'
          priority
          src={ProcessingHumster}
          alt=''
        />

        {isTouchDevice() && (
          <Button className='w-full' onClick={onButtonClick}>
            Open wallet
          </Button>
        )}
      </div>
    </Modal>
  )
}
