import useAccountsFromPreferredWallet from '@/components/auth/common/polkadot-connect/hooks/useAccountsFromPreferredWallet'
import SubstrateDonateFormPart from '@/components/extensions/donate/DonateModal/donateForm/SubstrateDonateFormPart'
import {
  ChainListItem,
  TokenListItem,
} from '@/components/extensions/donate/DonateModal/types'
import {
  chainItems,
  getAmountPreview,
  tokensItems,
} from '@/components/extensions/donate/DonateModal/utils'
import AutocompleteInput, {
  InputItem,
} from '@/components/inputs/AutocompleteInput'
import SelectInput from '@/components/inputs/SelectInput'
import { useMyMainAddress } from '@/stores/my-account'
import { encodeAddress } from '@polkadot/keyring'
import { GenericAccountId } from '@polkadot/types'
import { isAddress } from '@polkadot/util-crypto'
import registry from '@subsocial/api/utils/registry'
import { isEmptyArray } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useEffect, useMemo, useState } from 'react'
import { ProfileModalContentProps } from '../../types'
import SubstrateWithdrawButton from './SubstrateWithdrawButton'

const WithdrawContent = ({ setCurrentState }: ProfileModalContentProps) => {
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

  const amountPreview = getAmountPreview(amount, selectedToken.label)

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
          encodeAddress(item.id) !== encodeAddress(myAddress).toString() &&
          item.id !== recipient?.id
      ) || []
    )
  }, [recipient, accounts?.length, myAddress])

  const disabledButton =
    new BN(amount || '0').isZero() ||
    !selectedToken ||
    !!inputError ||
    !isAddress(recipient?.id || '')

  return (
    <div className='flex flex-col gap-6'>
      <SelectInput
        selected={selectedChain}
        setSelected={setSelectedChain}
        fieldLabel='Chain'
        disabled={true}
        items={chainItems}
        imgClassName='w-[38px]'
      />

      <SubstrateDonateFormPart
        {...commonProps}
        middlePart={
          <AutocompleteInput
            value={recipient}
            setValue={setRecipient}
            items={filteredAccountItems}
            label='Recipient'
            filterItems={filterItems}
          />
        }
      />

      <SubstrateWithdrawButton
        setCurrentState={setCurrentState}
        amount={amount}
        amountPreview={amountPreview}
        selectedChain={selectedChain}
        recipient={recipient?.id || ''}
        disabled={disabledButton}
      />
    </div>
  )
}
const parseQueryValue = (query: string) =>
  query.toLowerCase().replaceAll(' ', '')

const filterItems = (items: InputItem[], query: string) => {
  if (!query) return items

  const filteredItems = items.filter((item) =>
    parseQueryValue(item.label).includes(parseQueryValue(query))
  )

  if (isAddress(query)) {
    return isEmptyArray(filteredItems)
      ? ([{ id: query, label: query }] as InputItem[])
      : filteredItems
  }

  return filteredItems
}

export default WithdrawContent
