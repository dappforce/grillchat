import Button from '@/components/Button'
import { getBalancesQuery } from '@/old/services/substrateBalances/query'
import { useMyMainAddress } from '@/stores/my-account'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import { useEffect } from 'react'
import { MdArrowOutward } from 'react-icons/md'
import { useDonateModalContext } from '../../DonateModalContext'
import { CommonFields, CommonFieldsProps } from './CommonFields'

type SubstrateDonateFormProps = Omit<
  CommonFieldsProps,
  'balance' | 'decimals'
> & {
  isOpen: boolean
  onSwitchButtonClick?: () => void
  disabledSelectInput?: boolean
  middlePart?: React.ReactNode
}

const SubstrateDonateFormPart = ({
  isOpen,
  selectedChain,
  selectedToken,
  ...otherProps
}: SubstrateDonateFormProps) => {
  const { setShowChatForm } = useDonateModalContext()
  const address = useMyMainAddress()

  const { data: balance } = getBalancesQuery.useQuery({
    address: address || '',
    chainName: selectedChain.id,
  })

  const { freeBalance } = balance?.balances['SUB'] || {}

  useEffect(() => {
    setShowChatForm?.(true)
  }, [])

  useEffect(() => {
    setShowChatForm?.(!new BigNumber(freeBalance || '').isZero())
  }, [freeBalance])

  return !new BigNumber(freeBalance || '').isZero() ? (
    <CommonFields
      selectedToken={selectedToken}
      selectedChain={selectedChain}
      {...otherProps}
    />
  ) : (
    <div className='flex flex-col gap-6'>
      <div
        className={clsx(
          'flex items-center gap-2 rounded-[20px] px-4 py-2 text-text-primary',
          'bg-indigo-400/10'
        )}
      >
        <div>ℹ️</div>
        <div>To Donate in SUB, you need to get SUB first.</div>
      </div>
      <Button
        href='https://subsocial.network/get-sub'
        variant={'primaryOutline'}
        target='_blank'
        size={'lg'}
        className='w-full'
      >
        <div className='flex items-center justify-center gap-2'>
          Get SUB <MdArrowOutward className='text-text-primary' size={16} />
        </div>
      </Button>
    </div>
  )
}

export default SubstrateDonateFormPart
