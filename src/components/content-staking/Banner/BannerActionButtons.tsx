import Button from '@/components/Button'
import useLoginOption from '@/hooks/useLoginOption'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getBackerLedgerQuery } from '@/services/contentStaking/backerLedger/query'
import { getStakingConstsData } from '@/services/contentStaking/stakingConsts/query'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import { convertToBalanceWithDecimal } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useState } from 'react'
import { cx } from '../../../utils/class-names'
import StakingModal, { StakingModalVariant } from '../modals/StakeModal'
import { ACTIVE_STAKING_SPACE_ID, calculateBalanceForStaking } from '../utils'
import { useContentStakingContext } from '../utils/ContentStakingContext'
import { mutedTextColorStyles } from '../utils/commonStyles'

const BannerActionButtons = () => {
  const myAddress = useMyMainAddress()
  const { currentStep } = useContentStakingContext()
  const { data } = getStakingConstsData()
  const sendEvent = useSendEvent()
  const { promptUserForLogin } = useLoginOption()

  const { minimumStakingAmount } = data || {}

  const { data: backerLedger } = getBackerLedgerQuery.useQuery(myAddress || '')

  const { locked } = backerLedger || {}

  const { tokenSymbol, decimal } = useGetChainDataByNetwork('subsocial') || {}

  const { data: balanceByNetwork } = getBalancesQuery.useQuery({
    address: myAddress || '',
    chainName: 'subsocial',
  })

  const balanceByCurrency = balanceByNetwork?.balances?.[tokenSymbol || '']

  const availableBalance = balanceByCurrency
    ? calculateBalanceForStaking(balanceByCurrency, 'crestake')
    : new BN(0)

  const balanceWithDecimals = convertToBalanceWithDecimal(
    availableBalance.toString(),
    decimal || 0
  )

  const minimumStakingAmountWithDecimals = convertToBalanceWithDecimal(
    minimumStakingAmount || '0',
    decimal || 0
  )

  const buttonsByCurrentStep = {
    login: {
      text: 'To start earning from Content Staking, you need to login first:',
      buttons: (
        <Button
          size={isTouchDevice() ? 'md' : 'lg'}
          variant={'primary'}
          onClick={() => {
            sendEvent('login_button_clicked', { eventSource: 'staking' })
            promptUserForLogin()
          }}
        >
          Login
        </Button>
      ),
    },
    'get-sub': {
      text: 'To start earning from Content Staking, you first need to get some SUB:',
      buttons: (
        <Button
          size={isTouchDevice() ? 'md' : 'lg'}
          href='https://docs.subsocial.network/docs/tutorials/GetSUB/get-sub'
          target='_blank'
          className='hover:text-white'
          variant={'primary'}
          onClick={() => sendEvent('cs_get_sub')}
        >
          Get SUB
        </Button>
      ),
    },
    'lock-sub': {
      text: (
        <>
          You have{' '}
          <span className='font-bold text-text'>
            {balanceWithDecimals.toFixed(2)} {tokenSymbol}
          </span>{' '}
          available to lock. To start earning from Content Staking, you need to
          lock at least{' '}
          <span className='font-bold text-text'>
            {minimumStakingAmountWithDecimals.toFixed(2)} {tokenSymbol}
          </span>
          :
        </>
      ),
      buttons: <LockingButtons />,
    },
  }

  const isLockedTokens = !new BN(locked || '0').isZero()

  const { text, buttons } = buttonsByCurrentStep[currentStep]

  return (
    <>
      <div className='flex flex-col items-center gap-4'>
        {text && !isLockedTokens && (
          <div
            className={cx(
              'w-full max-w-[552px] text-center text-base font-normal',
              mutedTextColorStyles
            )}
          >
            {text}
          </div>
        )}
        <div>{buttons}</div>
      </div>
    </>
  )
}

const LockingButtons = () => {
  const [openStakeModal, setOpenStakeModal] = useState(false)
  const [modalVariant, setModalVariant] = useState<StakingModalVariant>('stake')
  const [amount, setAmount] = useState('0')
  const { isLockedTokens } = useContentStakingContext()

  const lockSubButtonText = isLockedTokens ? 'Lock more SUB' : 'Lock SUB'

  const onButtonClick = (modalVariant: StakingModalVariant) => {
    setOpenStakeModal(true)
    setModalVariant(modalVariant)
  }

  return (
    <>
      <div className='flex items-center gap-4 md:gap-6'>
        <Button
          size={isTouchDevice() ? 'md' : 'lg'}
          variant={isLockedTokens ? 'primaryOutline' : 'primary'}
          className={cx({
            ['border-text-primary text-text-primary']: isLockedTokens,
          })}
          onClick={() =>
            onButtonClick(isLockedTokens ? 'increaseStake' : 'stake')
          }
        >
          {lockSubButtonText}
        </Button>
        {isLockedTokens && (
          <Button
            size={isTouchDevice() ? 'md' : 'lg'}
            variant={'redOutline'}
            className='text-text-red'
            onClick={() => onButtonClick('unstake')}
          >
            Unlock SUB
          </Button>
        )}

        <StakingModal
          open={openStakeModal}
          closeModal={() => setOpenStakeModal(false)}
          spaceId={ACTIVE_STAKING_SPACE_ID}
          eventSource='creator-card'
          modalVariant={modalVariant}
          amount={amount}
          setAmount={setAmount}
        />
      </div>
    </>
  )
}

export default BannerActionButtons
