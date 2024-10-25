import { useGetChainDataByNetwork } from '@/old/services/chainsInfo/query'
import { getBackerLedgerQuery } from '@/old/services/contentStaking/backerLedger/query'
import { getBalancesQuery } from '@/old/services/substrateBalances/query'
import { useMyMainAddress } from '@/stores/my-account'
import BN from 'bignumber.js'
import { createContext, useContext, useEffect, useState } from 'react'
import { calculateBalanceForStaking } from '.'

type Steps = 'login' | 'get-sub' | 'lock-sub'

export type ContentStakingContextState = {
  currentStep: Steps
  setCurrentStep: (step: Steps) => void
  isLockedTokens: boolean
  ledgerLoading: boolean
  isHasSub: boolean
}

const ContentContext = createContext<ContentStakingContextState>({} as any)

type ContextWrapperProps = {
  children: React.ReactNode
}

export const ContentStakingContextWrapper: React.FC<ContextWrapperProps> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState<Steps>('login')
  const [isLockedTokens, setIsLockedTokens] = useState(false)
  const [isHasSub, setIsHasSub] = useState(false)
  const myAddress = useMyMainAddress()
  const { tokenSymbol } = useGetChainDataByNetwork('subsocial') || {}

  const { data: ledger, isLoading: ledgerLoading } =
    getBackerLedgerQuery.useQuery(myAddress || '', { enabled: !!myAddress })

  const { locked } = ledger || {}

  const { data: balanceByNetwork } = getBalancesQuery.useQuery({
    address: myAddress || '',
    chainName: 'subsocial',
  })

  const balanceByCurrency = balanceByNetwork?.balances?.[tokenSymbol || '']

  useEffect(() => {
    const isLockedTokens = !new BN(locked || '0').isZero()

    const availableBalance = balanceByCurrency
      ? calculateBalanceForStaking(balanceByCurrency, 'crestake')
      : new BN(0)

    const isHasSub = availableBalance.isGreaterThan(0)
    setIsLockedTokens(isLockedTokens)
    setIsHasSub(isHasSub)

    if (!myAddress) {
      setCurrentStep('login')
    } else if (myAddress && !isHasSub) {
      setCurrentStep('get-sub')
    } else {
      setCurrentStep('lock-sub')
    }
  }, [balanceByCurrency, locked, myAddress])

  const value = {
    currentStep,
    setCurrentStep,
    isLockedTokens: !myAddress ? false : isLockedTokens,
    ledgerLoading: !myAddress ? false : ledgerLoading,
    isHasSub,
  }

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  )
}

export const useContentStakingContext = () => useContext(ContentContext)
