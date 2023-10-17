import Button from '@/components/Button'
import { RemoveProxyWrapper } from '@/services/subsocial/proxy/mutation'
import { getProxiesQuery } from '@/services/subsocial/proxy/query'
import { useMyAccount } from '@/stores/my-account'
import { Signer } from '@/utils/account'
import { toSubsocialAddress } from '@subsocial/utils'
import { useEffect } from 'react'
import { ContentProps } from '../../types'
import useAccountsFromPreferredWallet from './hooks/useAccountsFromPreferredWallet'

export default function PolkadotConnectUnlink({
  setCurrentState,
  address,
}: ContentProps) {
  const { isStale } = getProxiesQuery.useQuery({ address })
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const disconnectProxy = useMyAccount((state) => state.disconnectProxy)
  const connectWallet = useMyAccount((state) => state.connectWallet)
  const isWalletConnected = useMyAccount(
    (state) => !!state.connectedWallet?.signer
  )
  const { accounts } = useAccountsFromPreferredWallet(() =>
    setCurrentState('polkadot-connect-wallet')
  )

  useEffect(() => {
    if (!accounts || !parentProxyAddress) return

    const account = accounts.find(
      (account) =>
        toSubsocialAddress(account.address)! === toSubsocialAddress(address)!
    )
    if (!account || !account.signer) {
      // TODO: make user need to reconnect its wallet
      setCurrentState('polkadot-connect-wallet')
    } else {
      connectWallet(account.address, account.signer as Signer)
    }
  }, [accounts, parentProxyAddress, address, connectWallet, setCurrentState])

  const onButtonClick = () => {
    setCurrentState('polkadot-connect')
  }

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <Button size='lg' onClick={onButtonClick}>
        No, keep it linked
      </Button>
      <RemoveProxyWrapper
        loadingUntilTxSuccess
        config={{
          txCallbacks: {
            onSuccess: () => {
              setCurrentState('account-settings')
              disconnectProxy()
            },
          },
        }}
      >
        {({ mutateAsync, isLoading }) => (
          <Button
            size='lg'
            onClick={() => mutateAsync(null)}
            variant='primaryOutline'
            className='border-red-500'
            isLoading={isLoading || isStale || !isWalletConnected}
          >
            Yes, unlink
          </Button>
        )}
      </RemoveProxyWrapper>
    </div>
  )
}
