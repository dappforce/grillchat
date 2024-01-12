import CommonExtensionModal from '@/components/extensions/common/CommonExtensionModal'
import SelectInput from '@/components/inputs/SelectInput'
import ProfilePreview from '@/components/ProfilePreview'
import { getPostQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useExtensionModalState } from '@/stores/extension'
import { useMessageData } from '@/stores/message'
import { cx } from '@/utils/class-names'
import { useEffect, useMemo, useState } from 'react'
import { useDonateModalContext } from '../../DonateModalContext'
import { useBuildDonationMessage } from '../../hooks/useBuildDonationMessage'
import { DonateProps } from '../types'
import { chainItems, getAmountPreview, tokensItems } from '../utils'
import EvmDonateFormPart from './EvmDonateFormPart'
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

  const chainKind = selectedChain.chainKind
  const isEvmChain = chainKind === 'evm'

  const beforeMessageSend = useBuildDonationMessage(
    {
      setCurrentStep,
      selectedToken,
      selectedChain,
    },
    isEvmChain
  )

  useEffect(() => {
    setSelectedToken(tokensItems[selectedChain.id][0])
  }, [selectedChain.id, setSelectedToken])

  useEffect(() => {
    setAmount('')
  }, [selectedChain.id, selectedToken.id])

  useEffect(() => {
    if (!isOpen) {
      setAmount('')
      setSelectedChain(chainItems[0])
    }
  }, [isOpen])

  const { data: message } = getPostQuery.useQuery(messageId)

  const { ownerId } = message?.struct || {}

  const { data: messageOwnerAccountData } = getAccountDataQuery.useQuery(
    ownerId ?? ''
  )
  const { evmAddress: messageOwnerEvmAddress } = messageOwnerAccountData || {}

  const amountPreview = getAmountPreview(amount, selectedToken.label)

  const commonProps = {
    selectedChain: selectedChain,
    selectedToken: selectedToken,
    isOpen: isOpen,
    amount: amount,
    inputError: inputError,
    chainKind: chainKind,
    setAmount: setAmount,
    setInputError: setInputError,
    onSwitchButtonClick: onSwitchButtonClick,
    setSelectedToken: setSelectedToken,
  }

  const chainsItemsArray = useMemo(
    () =>
      !messageOwnerEvmAddress
        ? chainItems.map((item) => {
            return {
              disabledItem: item.chainKind === 'evm',
              ...item,
            }
          })
        : chainItems,
    [messageOwnerEvmAddress]
  )

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
            items={chainsItemsArray}
            imgClassName='w-[38px]'
          />
          {isEvmChain ? (
            <EvmDonateFormPart {...commonProps} />
          ) : (
            <SubstrateDonateFormPart {...commonProps} />
          )}
        </div>
      </div>
    </CommonExtensionModal>
  )
}

export default DonateForm
