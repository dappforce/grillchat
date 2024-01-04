import useAccountsFromPreferredWallet from '@/components/auth/common/polkadot-connect/hooks/useAccountsFromPreferredWallet'
import SubstrateDonateFormPart from '@/components/extensions/donate/DonateModal/donateForm/SubstrateDonateFormPart'
import {
  ChainListItem,
  TokenListItem,
} from '@/components/extensions/donate/DonateModal/types'
import {
  chainItems,
  tokensItems,
} from '@/components/extensions/donate/DonateModal/utils'
import AutocompleteInput, {
  InputItem,
} from '@/components/inputs/AutocompleteInput'
import SelectInput from '@/components/inputs/SelectInput'
import { useMyMainAddress } from '@/stores/my-account'
import { GenericAccountId } from '@polkadot/types'
import registry from '@subsocial/api/utils/registry'
import { isEmptyArray } from '@subsocial/utils'
import BigNumber from 'bignumber.js'
import { useEffect, useMemo, useState } from 'react'
import { ProfileModalContentProps } from '../../types'
import SubstrateWithdrawButton from './SubstrateWithdrawButton'

export default function WithdrawContent({
  setCurrentState,
}: ProfileModalContentProps) {
  const firstChainItem = chainItems[0]
  const { accounts, isLoading } = useAccountsFromPreferredWallet()
  const myAddress = useMyMainAddress()

  const accountItems = useMemo(() => {
    const items =
      accounts?.map((account) => {
        return {
          id: account.address,
          label: account.address,
        }
      }) || []

    if (!myAddress) return items

    return (
      items?.filter(
        (item) =>
          item.id !== new GenericAccountId(registry, myAddress).toString()
      ) || []
    )
  }, [accounts?.length, isLoading, myAddress])

  const [recipient, setRecipient] = useState<InputItem | undefined>(
    accountItems[0]
  )

  useEffect(() => {
    if (!isLoading && accounts && !isEmptyArray(accounts)) {
      setRecipient(accountItems[0])
    }
  }, [isLoading])

  const [selectedChain, setSelectedChain] =
    useState<ChainListItem>(firstChainItem)
  const [selectedToken, setSelectedToken] = useState<TokenListItem>(
    tokensItems[firstChainItem.id][0]
  )

  const [inputError, setInputError] = useState<string | undefined>()
  const [amount, setAmount] = useState<string>('')

  const amountPreview = amount
    ? ` ${new BigNumber(amount).toFormat()} ${selectedToken.label}`
    : ''

  const chainKind = selectedChain.chainKind

  const commonProps = {
    selectedChain: selectedChain,
    selectedToken: selectedToken,
    isOpen: false,
    amount: amount,
    inputError: inputError,
    disabledSelectInput: true,
    chainKind: chainKind,
    setAmount: setAmount,
    setInputError: setInputError,
    setSelectedToken: setSelectedToken,
    setCurrentStep: setCurrentState,
  }

  const filteredAccountItems = useMemo(() => {
    if (!myAddress) return accountItems

    return (
      accountItems?.filter(
        (item) =>
          item.id !== new GenericAccountId(registry, myAddress).toString() &&
          item.id !== recipient?.id
      ) || []
    )
  }, [recipient, accounts?.length, myAddress])

  return (
    <div className='flex flex-col gap-6'>
      <AutocompleteInput
        value={recipient}
        setValue={setRecipient}
        items={filteredAccountItems}
        label='Recipient'
      />

      <SelectInput
        selected={selectedChain}
        setSelected={setSelectedChain}
        fieldLabel='Chain'
        disabled={true}
        items={chainItems}
        imgClassName='w-[38px]'
      />

      <SubstrateDonateFormPart {...commonProps} />

      <SubstrateWithdrawButton
        setCurrentState={setCurrentState}
        amount={amount}
        amountPreview={amountPreview}
        selectedChain={selectedChain}
        recipient={recipient?.id || ''}
      />
    </div>
  )
}
