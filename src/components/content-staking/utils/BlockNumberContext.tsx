import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { ApiPromise } from '@polkadot/api'
import BN from 'bignumber.js'
import { createContext, useContext, useEffect, useState } from 'react'

export type BlockNumberContextState = {
  currentBlockNumber?: BN
  blockTime: BN
  currentTimestamp: BN
}

export const getBlockData = async (api: ApiPromise) => {
  const period = '6000'

  const blockTime = new BN(period).multipliedBy(2)
  const currentTimestamp = await api.query.timestamp.now()

  return {
    blockTime,
    currentTimestamp,
  }
}

const BlockNumberContext = createContext<BlockNumberContextState>({} as any)

type BlockNumberContextWrapperProps = {
  children?: React.ReactNode
}

export const BlockNumberContextWrapper: React.FC<BlockNumberContextWrapperProps> = ({
  children,
}) => {
  const [currentBlockNumber, setCurrentBlockNumber] = useState<BN>(new BN(0))
  const [blockTime, setBlockTime] = useState<BN>(new BN(0))
  const [currentTimestamp, setCurrentTimestamp] = useState<BN>(new BN(0))

  useEffect(() => {
    let isMounted = true
    let unsub: any
    let unsubTimeStamp: any

    const sub = async () => {
      setCurrentBlockNumber(new BN(0))
      const subsocialApi = await getSubsocialApi()

      const api = await subsocialApi.substrateApi

      const { blockTime } = await getBlockData(api)

      unsub = await api.query.system.number(async (blockNumber: any) => {
        if (isMounted && blockNumber) {
          setCurrentBlockNumber(new BN(blockNumber.toJSON() as string))
        }
      })

      unsubTimeStamp = await api.query.timestamp.now(async (timestamp: any) => {
        if (isMounted && timestamp) {
          setCurrentTimestamp(new BN(timestamp.toJSON() as string))
        }
      })

      setBlockTime(blockTime)
    }

    isMounted &&
      sub().catch((err) =>
        console.error('Failed to load a pending owner:', err)
      )

    return () => {
      unsub && unsub()
      unsubTimeStamp && unsubTimeStamp()
      isMounted = false
    }
  }, [])

  const value = {
    currentBlockNumber,
    blockTime,
    currentTimestamp,
  }

  return (
    <BlockNumberContext.Provider value={value}>
      {children}
    </BlockNumberContext.Provider>
  )
}

export const useBlockNumberContext = () => useContext(BlockNumberContext)
