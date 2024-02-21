import Button from '@/components/Button'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getBackerLedgerQuery } from '@/services/contentStaking/backerLedger/query'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useMyMainAddress } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import BN from 'bignumber.js'
import { useState } from 'react'
import { ACTIVE_STAKING_SPACE_ID, calculateBalanceForStaking } from '../utils'
import StakingModal, { StakingModalVariant } from '../modals/StakeModal'

const BannerActionButtons = () => {
  const myAddress = useMyMainAddress()

  const { data: backerLedger } = getBackerLedgerQuery.useQuery(myAddress || '')

  const { locked } = backerLedger || {}

  const { tokenSymbol } = useGetChainDataByNetwork('subsocial') || {}

  const { data: balanceByNetwork } = getBalancesQuery.useQuery({
    address: myAddress || '',
    chainName: 'subsocial',
  })

  const balanceByCurrency = balanceByNetwork?.balances?.[tokenSymbol || '']

  const availableBalance = balanceByCurrency
    ? calculateBalanceForStaking(balanceByCurrency, 'crestake')
    : new BN(0)

  const haveSub = !availableBalance.isZero()

  const isLockedTokens = !new BN(locked || '0').isZero()

  const text = !haveSub
    ? 'To start earning from Content Staking, you first need to get some SUB:'
    : 'To start earning from Content Staking, you need to lock at least 2,000 SUB:'

  return (
    <div className='flex flex-col items-center gap-4 md:gap-6'>
      {!isLockedTokens && (
        <div className='text-lg font-medium text-slate-50'>
          {text}
        </div>
      )}
      <div>
        {haveSub ? (
          <LockingButtons locked={locked} />
        ) : (
          <Button
            size={isTouchDevice() ? 'md' : 'lg'}
            href='https://docs.subsocial.network/docs/tutorials/GetSUB/get-sub'
            target='_blank'
            className='hover:text-white'
            variant={'primary'}
          >
            Get SUB
          </Button>
        )}
      </div>
    </div>
  )
}

type LockingButtonsProps = {
  locked?: string
}

const LockingButtons = ({ locked }: LockingButtonsProps) => {
  const [openStakeModal, setOpenStakeModal] = useState(false)
  const [modalVariant, setModalVariant] = useState<StakingModalVariant>('stake')
  const [amount, setAmount] = useState('0')

  const isLockedTokens = !new BN(locked || '0').isZero()

  const lockSubButtonText = isLockedTokens ? 'Lock more SUB' : 'Lock SUB'

  const onButtonClick = (modalVariant: StakingModalVariant) => {
    setOpenStakeModal(true)
    setModalVariant(modalVariant)
  }

  return (
    <>
      <div className='flex items-center gap-6'>
        <Button
          size={isTouchDevice() ? 'md' : 'lg'}
          variant={'primary'}
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
