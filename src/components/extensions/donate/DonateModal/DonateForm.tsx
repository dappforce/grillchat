import Button from '@/components/Button'
import Dropdown from '@/components/inputs/SelectInput'
import MetamaskDeepLink, {
  isInsideMetamaskBrowser,
} from '@/components/MetamaskDeepLink'
import ProfilePreview from '@/components/ProfilePreview'
import useGetTheme from '@/hooks/useGetTheme'
import { SendMessageParams } from '@/services/subsocial/commentIds'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useExtensionModalState } from '@/stores/extension'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import BigNumber from 'bignumber.js'
import { parseUnits } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import CommonExtensionModal from '../../CommonExtensionModal'
import { chainIdByChainName } from '../api/config'
import { useDonate, useGetBalance } from '../api/hooks'
import AmountInput from './AmountInput'
import { DonateProps } from './types'
import { chainItems, tokensItems } from './utils'

function DonateForm({
  chatId,
  setCurrentStep,
  chainState,
  tokenState,
  onSwitchButtonClick,
  onSubmit,
}: DonateProps) {
  const { closeModal, isOpen, initialData } = useExtensionModalState(
    'subsocial-donations'
  )

  const [selectedChain, setSelectedChain] = chainState
  const [selectedToken, setSelectedToken] = tokenState

  const theme = useGetTheme()
  const { isConnected } = useAccount()
  const isDarkTheme = theme === 'dark'
  const [inputError, setInputError] = useState<string | undefined>()
  const [amount, setAmount] = useState<string>('')
  const address = useMyAccount((state) => state.address)
  const { chain } = useNetwork()
  const { address: myEvmAddress } = useAccount()

  const { balance, decimals } = useGetBalance(
    selectedToken.id,
    selectedChain.id
  )

  useEffect(() => {
    setSelectedToken(tokensItems[selectedChain.id][0])
  }, [selectedChain.id])

  const { data: recipientAccountData } = getAccountDataQuery.useQuery(
    initialData.recipient
  )

  const { evmAddress: evmRecipientAddress } = recipientAccountData || {}

  const currentChainId = chain?.id
  const destChainId = chainIdByChainName[selectedChain.id]

  const showSwichButton = !isConnected || currentChainId !== destChainId

  const { sendTransferTx } = useDonate(selectedToken.id, selectedChain.id)

  const onButtonClick = async (messageParams: SendMessageParams) => {
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

  const disableSendButton =
    !amount ||
    !balance ||
    new BigNumber(amount || '0').lte(0) ||
    new BigNumber(balance || '0').eq(0)

  const amountPreview = amount
    ? ` ${new BigNumber(amount).toFormat()} ${selectedToken.label}`
    : ''

  return (
    <CommonExtensionModal
      isOpen={isOpen}
      closeModal={closeModal}
      chatId={chatId}
      showChatForm={!showSwichButton}
      withDivider={!showSwichButton}
      disableSendButton={disableSendButton || !!inputError}
      sendButtonText={`Send${amountPreview}`}
      beforeMesageSend={onButtonClick}
      autofocus={false}
      title={'💰 Donate'}
      withCloseButton
      panelClassName='pb-5'
      onSubmit={onSubmit}
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
            address={initialData.recipient}
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
            imgClassName='w-[38px]'
          />

          {!isInsideMetamaskBrowser() ? (
            <MetamaskDeepLink size='lg'>Connect Wallet</MetamaskDeepLink>
          ) : showSwichButton ? (
            <Button size={'lg'} onClick={onSwitchButtonClick}>
              {!isConnected ? 'Connect' : 'Switch'} to {selectedChain.label}
            </Button>
          ) : (
            <>
              <Dropdown
                selected={selectedToken}
                setSelected={setSelectedToken}
                fieldLabel='Token'
                items={tokensItems[selectedChain.id]}
                imgClassName='w-[38px]'
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
            </>
          )}
        </div>
      </div>
    </CommonExtensionModal>
  )
}

export default DonateForm
