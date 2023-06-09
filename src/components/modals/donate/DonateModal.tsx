import Astar from '@/assets/graphics/chains/astar.png'
import Moonbeam from '@/assets/graphics/chains/moonbeam.png'
import Poligon from '@/assets/graphics/chains/poligon.png'
import ETH from '@/assets/graphics/tokens/eth.png'
import MATIC from '@/assets/graphics/tokens/matic.png'
import USDC from '@/assets/graphics/tokens/usdc.png'
import USDT from '@/assets/graphics/tokens/usdt.png'
import Button from '@/components/Button'
import CommonExtensionModal from '@/components/extensions/CommonExtensionModal'
import Input from '@/components/inputs/Input'
import Dropdown, { ListItem } from '@/components/inputs/SelectInput'
import ProfilePreview from '@/components/ProfilePreview'
import useGetTheme from '@/hooks/useGetTheme'
import { SendMessageParams } from '@/services/subsocial/commentIds'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'ethers'
import { ChangeEventHandler, useState } from 'react'
import { ModalFunctionalityProps } from '../Modal'
import { useGetBalance, useTransfer } from './api/transfer'

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

type AmountInputProps = {
  setAmount: (amount: string) => void
  amount: string
  tokenSymbol: string
  balance?: string
  decimals?: number
}

const AmountInput = ({
  amount,
  setAmount,
  tokenSymbol,
  balance,
  decimals,
}: AmountInputProps) => {
  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setAmount(e.target.value)
  }

  const balanceValue =
    decimals && balance ? formatUnits(balance, decimals) : '0'

  return (
    <div>
      <div className='mb-2 flex justify-between text-sm font-normal leading-4 text-gray-400'>
        <div>Amount</div>
        <div>
          Balance:{' '}
          <span className='font-bold text-white'>
            {balanceValue.slice(0, 6)} {tokenSymbol}
          </span>
        </div>
      </div>
      <Input
        step={0.1}
        min={0}
        value={amount}
        onChange={onInputChange}
        rightElement={() => (
          <div>
            <Button
              variant='transparent'
              className={cx(
                'absolute bottom-0 right-4 top-0 my-auto p-1 text-indigo-400',
                'hover:text-indigo-500 hover:ring-0'
              )}
              onClick={() => balance && setAmount(balanceValue)}
            >
              Max
            </Button>
          </div>
        )}
        type='number'
        className={cx(
          'h-[54px] bg-slate-900 pr-16 text-base leading-6 ring-1 ring-inset ring-gray-500',
          'focus:outline-none focus:ring-1 focus:ring-gray-400',
          'hover:outline-none hover:ring-1 hover:ring-gray-400',
          'focus-visible:!ring-1 focus-visible:ring-gray-400'
        )}
      />
    </div>
  )
}

type DonateModalProps = ModalFunctionalityProps & {
  recipient: string
  messageId: string
  chatId: string
}

export default function DonateModal({
  recipient,
  messageId,
  chatId,
  ...props
}: DonateModalProps) {
  const theme = useGetTheme()
  const isDarkTheme = theme === 'dark'
  const [selectedChain, setSelectedChain] = useState<ListItem>(chainItems[0])
  const [selectedToken, setSelectedToken] = useState<ListItem>(tokensItems[0])
  const [amount, setAmount] = useState<string>('0')
  const address = useMyAccount((state) => state.address)

  const { balance, decimals } = useGetBalance(selectedToken.id)

  const { data: recipientAccountData } = getAccountDataQuery.useQuery(recipient)
  const { data: myAccountData } = getAccountDataQuery.useQuery(address)

  const { evmAddress: evmRecipientAddress } = recipientAccountData || {}
  const { evmAddress: myEvmAddress } = myAccountData || {}

  const { sendTransferTx } = useTransfer(selectedToken.id, selectedChain.id)

  const onButtonClick = async (messageParams: SendMessageParams) => {
    if (!evmRecipientAddress || !myEvmAddress || !amount) {
      return { txPrevented: true }
    }

    const hash = await sendTransferTx(
      evmRecipientAddress,
      amount.replace(',', '.'),
      selectedToken.isNativeToken,
      decimals
    )

    if (hash && address) {
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
              amount: amount,
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
    !balance ||
    new BigNumber(balance || '0').eq(0) ||
    !amount ||
    new BigNumber(amount || '0').eq(0)

  return (
    <CommonExtensionModal
      {...props}
      formProps={{
        chatId,
        replyTo: messageId,
        allowEmptyMessage: true,
        sendButtonProps: {
          disabled: disableSendButton,
        },
        sendButtonText: 'Send',
        beforeMesageSend: onButtonClick,
      }}
      title='💰 Donate'
      withCloseButton
      {...props}
    >
      <div>
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
            evmAddress={evmRecipientAddress}
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
            tokenSymbol={selectedToken.label}
            balance={balance}
            decimals={decimals}
          />
        </div>
      </div>
    </CommonExtensionModal>
  )
}
