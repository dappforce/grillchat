import Button from '@/components/Button'
import ProfilePreview from '@/components/ProfilePreview'
import { AddProxyWrapper } from '@/services/subsocial/proxy/mutation'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { toSubsocialAddress } from '@subsocial/utils'
import { ContentProps } from '../types'

export default function PolkadotConnectConfirmationContent({
  setCurrentState,
}: ContentProps) {
  const temporarySelectedAccount = useMyAccount(
    (state) => state.temporarySelectedAccount
  )
  const isLoadingEnergy = useMyAccount(
    (state) => state.connectedWallet?.energy === null
  )
  const connectWallet = useMyAccount((state) => state.connectWallet)
  const saveConnectedWallet = useMyAccount((state) => state.saveConnectedWallet)

  return (
    <div className='mt-2 flex flex-col gap-6'>
      <div className='flex flex-col rounded-2xl bg-background-lighter p-4'>
        <ProfilePreview
          address={toSubsocialAddress(temporarySelectedAccount?.address) ?? ''}
          avatarClassName={cx('h-16 w-16')}
        />
      </div>
      <div className='flex flex-col gap-4'>
        <AddProxyWrapper
          loadingUntilTxSuccess
          config={{
            txCallbacks: {
              onSuccess: () => {
                saveConnectedWallet()
                setCurrentState('account-settings')
              },
            },
          }}
        >
          {({ isLoading, mutateAsync: addProxy }) => {
            return (
              <Button
                size='lg'
                onClick={async () => {
                  const address = toSubsocialAddress(
                    temporarySelectedAccount?.address
                  )
                  const signer = temporarySelectedAccount?.signer
                  if (address && signer) {
                    connectWallet(address, signer)
                    addProxy(null)
                  }
                }}
                isLoading={isLoading || isLoadingEnergy}
              >
                Use this account
              </Button>
            )
          }}
        </AddProxyWrapper>
        <Button
          size='lg'
          variant='primaryOutline'
          onClick={() => setCurrentState('polkadot-connect-account')}
        >
          Select another account
        </Button>
      </div>
    </div>
  )
}
