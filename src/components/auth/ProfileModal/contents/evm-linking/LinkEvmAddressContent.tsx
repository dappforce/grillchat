import Button from '@/components/Button'
import EvmAddress from '@/components/EvmAddress'
import { ProfileModalContentProps } from '@/components/auth/ProfileModal/types'
import { CustomConnectButton } from '@/components/auth/common/evm/CustomConnectButton'
import useSignMessageAndLinkEvmAddress from '@/hooks/useSignMessageAndLinkEvmAddress'
import { cx } from '@/utils/class-names'
import { useAccount } from 'wagmi'
import UnlinkAddressWrapper from '../common/UnlinkAddressWrapper'

function LinkEvmAddressContent({
  evmAddress,
  setCurrentState,
}: ProfileModalContentProps) {
  const { address: addressFromExt } = useAccount()

  const addressFromExtLowercased = addressFromExt?.toLowerCase()

  const isNotEqAddresses =
    !!addressFromExtLowercased &&
    !!evmAddress &&
    evmAddress !== addressFromExtLowercased

  const { signAndLinkEvmAddress, isLoading } = useSignMessageAndLinkEvmAddress({
    onSuccess: () => {
      setCurrentState('evm-address-linked')
    },
    onError: () => setCurrentState('evm-linking-error'),
    linkedEvmAddress: evmAddress,
  })

  const connectionButton = (
    <CustomConnectButton
      key='connect-btn'
      className={cx('w-full', { ['mt-4']: isNotEqAddresses })}
      signAndLinkEvmAddress={signAndLinkEvmAddress}
      signAndLinkOnConnect={!isNotEqAddresses}
      isLoading={isLoading}
      label={isNotEqAddresses ? 'Link another account' : undefined}
      secondLabel='Sign Message'
      variant={isNotEqAddresses ? 'primaryOutline' : 'primary'}
    />
  )

  return (
    <div>
      {evmAddress ? (
        <div>
          <EvmAddress evmAddress={evmAddress} className='mb-2' />
          {isNotEqAddresses && connectionButton}
          <UnlinkAddressWrapper>
            {(canUnlinkAddress) => (
              <Button
                onClick={() => setCurrentState('unlink-evm-confirmation')}
                disabled={!canUnlinkAddress}
                className='mt-4 w-full border-red-500'
                variant='primaryOutline'
                size='lg'
              >
                Unlink EVM address
              </Button>
            )}
          </UnlinkAddressWrapper>
        </div>
      ) : (
        connectionButton
      )}
    </div>
  )
}

export default LinkEvmAddressContent
