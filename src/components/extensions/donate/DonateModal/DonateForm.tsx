import Astar from '@/assets/graphics/chains/astar.png'
import Moonbeam from '@/assets/graphics/chains/moonbeam.png'
import Poligon from '@/assets/graphics/chains/poligon.png'
import ETH from '@/assets/graphics/tokens/eth.png'
import MATIC from '@/assets/graphics/tokens/matic.png'
import USDC from '@/assets/graphics/tokens/usdc.png'
import USDT from '@/assets/graphics/tokens/usdt.png'
import Dropdown, { ListItem } from '@/components/inputs/SelectInput'
import ProfilePreview from '@/components/ProfilePreview'
import useGetTheme from '@/hooks/useGetTheme'
import { SendMessageParams } from '@/services/subsocial/commentIds'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import BigNumber from 'bignumber.js'
import { parseUnits } from 'ethers'
import { useState } from 'react'
import CommonExtensionModal from '../../CommonExtensionModal'
import { useDonate, useGetBalance } from '../api/hooks'
import AmountInput from './AmountInput'
import { DonateProps } from './types'

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
      autofocus={false}
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

export default DonateForm
