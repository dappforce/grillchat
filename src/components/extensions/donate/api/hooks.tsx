import { Connector, useConnect } from 'wagmi'
import { isTouchDevice } from '../../../../utils/device'
import { chainIdByChainName } from './config'
import { openMobileWallet, RainbowKitConnector } from './utils'

export const useConnectToWallet = () => {
  const { connectAsync } = useConnect()

  const connectToWallet = async (
    chainName: string,
    connector: RainbowKitConnector<Connector<any, any>>
  ) => {
    try {
      isTouchDevice() &&
        connector.connector.on(
          'message',
          async ({ type }: { type: string }) => {
            return type === 'connecting'
              ? (async () => {
                  await openMobileWallet({ connector })
                })()
              : undefined
          }
        )

      await connectAsync({
        connector: connector.connector,
        chainId: chainIdByChainName[chainName],
      })
    } catch (e) {
      console.error('Connecting error: ', e)
    }
  }
  return { connectToWallet }
}
