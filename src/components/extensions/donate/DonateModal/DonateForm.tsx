import Button from '@/components/Button'
import SelectInput from '@/components/inputs/SelectInput'
import ProfilePreview from '@/components/ProfilePreview'
import { SendMessageParams } from '@/services/subsocial/commentIds'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useExtensionModalState } from '@/stores/extension'
import { useMessageData } from '@/stores/message'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import BigNumber from 'bignumber.js'
import { parseUnits } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import CommonExtensionModal from '../../common/CommonExtensionModal'
import { chainIdByChainName } from '../api/config'
import { useDonate, useGetBalance } from '../api/hooks'
import AmountInput from './AmountInput'
import TokenItemPreview from './donateForm/TokenItemPreview'
import { DonateProps } from './types'
import { chainItems, tokensItems } from './utils'

function DonateForm({
  hubId,
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

  const { messageId } = initialData
  const setReplyTo = useMessageData((state) => state.setReplyTo)
  useEffect(() => {
    if (isOpen) setReplyTo(messageId)
  }, [setReplyTo, messageId, isOpen])

  const [selectedChain, setSelectedChain] = chainState
  const [selectedToken, setSelectedToken] = tokenState

  const { isConnected } = useAccount()
  const [inputError, setInputError] = useState<string | undefined>()
  const [amount, setAmount] = useState<string>('')
  const address = useMyMainAddress()
  const { chain } = useNetwork()
  const { address: myEvmAddress } = useAccount()

  const { balance, decimals } = useGetBalance(
    selectedToken.id,
    selectedChain.id,
    isOpen
  )

  useEffect(() => {
    setSelectedToken(tokensItems[selectedChain.id][0])
  }, [selectedChain.id, setSelectedToken])

  const { data: recipientAccountData } = getAccountDataQuery.useQuery(
    initialData.recipient
  )

  const { evmAddress: evmRecipientAddress } = recipientAccountData || {}

  const currentChainId = chain?.id
  const destChainId = chainIdByChainName[selectedChain.id]

  const showSwitchButton = !isConnected || currentChainId !== destChainId

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
      hubId={hubId}
      isOpen={isOpen}
      closeModal={closeModal}
      chatId={chatId}
      showChatForm={!showSwitchButton}
      withDivider={!showSwitchButton}
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
        <div className='mb-2 flex justify-between text-sm font-normal leading-4 text-text-muted'>
          Recipient
        </div>
        <div className={cx('mb-6 mt-2 rounded-2xl bg-background-lighter p-4')}>
          <ProfilePreview
            address={initialData.recipient}
            avatarClassName='h-12 w-12'
          />
        </div>
        <div className='flex flex-col gap-6'>
          <SelectInput
            selected={selectedChain}
            setSelected={setSelectedChain}
            fieldLabel='Chain'
            items={chainItems}
            imgClassName='w-[38px]'
          />

          {(() => {
            return showSwitchButton ? (
              <Button size={'lg'} onClick={onSwitchButtonClick}>
                {!isConnected ? 'Connect' : 'Switch'} to {selectedChain.label}
              </Button>
            ) : (
              <>
                <SelectInput
                  selected={selectedToken}
                  setSelected={setSelectedToken}
                  fieldLabel='Token'
                  items={tokensItems[selectedChain.id]}
                  imgClassName='w-[38px]'
                  renderItem={(item, open) => (
                    <TokenItemPreview
                      item={item}
                      chainName={selectedChain.id}
                      open={open}
                      chainKind='evm'
                    />
                  )}
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
            )
          })()}
        </div>
      </div>
    </CommonExtensionModal>
  )
}

export default DonateForm
