import CommonExtensionModal from '@/components/extensions/common/CommonExtensionModal'
import SelectInput from '@/components/inputs/SelectInput'
import ProfilePreview from '@/components/ProfilePreview'
import { useExtensionModalState } from '@/stores/extension'
import { useMessageData } from '@/stores/message'
import { cx } from '@/utils/class-names'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { useDonateModalContext } from '../../DonateModalContext'
import { useBuildEvmBeforeSend, useBuildSubtrateBeforeSend } from '../../hooks'
import { DonateProps } from '../types'
import { chainItems, tokensItems } from '../utils'
import EvmDonateForm from './EvmDonateFormPart'
import SubstrateDonateFormPart from './SubstrateDonateFormPart'

const DonateForm = ({
  chainState,
  tokenState,
  onSubmit,
  hubId,
  chatId,
  setCurrentStep,
  onSwitchButtonClick,
}: DonateProps) => {
  const { closeModal, isOpen, initialData } = useExtensionModalState(
    'subsocial-donations'
  )
  const { showChatForm, disableButton } = useDonateModalContext()

  const { messageId } = initialData
  const setReplyTo = useMessageData((state) => state.setReplyTo)

  useEffect(() => {
    if (isOpen) setReplyTo(messageId)
  }, [setReplyTo, messageId, isOpen])

  const [selectedChain, setSelectedChain] = chainState
  const [selectedToken, setSelectedToken] = tokenState

  const [inputError, setInputError] = useState<string | undefined>()
  const [amount, setAmount] = useState<string>('')

  const amountPreview = amount
    ? ` ${new BigNumber(amount).toFormat()} ${selectedToken.label}`
    : ''

  const evmBeforeMessageSend = useBuildEvmBeforeSend({
    selectedChain,
    selectedToken,
    setCurrentStep,
  })

  const substrateBeforeMessageSend = useBuildSubtrateBeforeSend({
    selectedChain,
    selectedToken,
    setCurrentStep,
  })

  useEffect(() => {
    setSelectedToken(tokensItems[selectedChain.id][0])
  }, [selectedChain.id, setSelectedToken])

  useEffect(() => {
    setAmount('')
  }, [selectedChain.id, selectedToken.id])

  const chainKind = selectedChain.chainKind

  const beforeMessageSend =
    chainKind === 'evm' ? evmBeforeMessageSend : substrateBeforeMessageSend

  return (
    <CommonExtensionModal
      hubId={hubId}
      isOpen={isOpen}
      closeModal={closeModal}
      chatId={chatId}
      showChatForm={showChatForm}
      withDivider={showChatForm}
      disableSendButton={disableButton || !!inputError}
      sendButtonText={`Send${amountPreview}`}
      beforeMesageSend={(messageParams) =>
        beforeMessageSend({
          amount,
          messageParams,
        })
      }
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
          {chainKind === 'evm' ? (
            <EvmDonateForm
              selectedChain={selectedChain}
              selectedToken={selectedToken}
              isOpen={isOpen}
              amount={amount}
              setAmount={setAmount}
              inputError={inputError}
              setInputError={setInputError}
              onSwitchButtonClick={onSwitchButtonClick}
              setSelectedToken={setSelectedToken}
              setCurrentStep={setCurrentStep}
              chainKind={chainKind}
            />
          ) : (
            <SubstrateDonateFormPart
              selectedChain={selectedChain}
              selectedToken={selectedToken}
              isOpen={isOpen}
              amount={amount}
              setAmount={setAmount}
              inputError={inputError}
              setInputError={setInputError}
              onSwitchButtonClick={onSwitchButtonClick}
              setSelectedToken={setSelectedToken}
              setCurrentStep={setCurrentStep}
              chainKind={chainKind}
            />
          )}
        </div>
      </div>
    </CommonExtensionModal>
  )
}

export default DonateForm
