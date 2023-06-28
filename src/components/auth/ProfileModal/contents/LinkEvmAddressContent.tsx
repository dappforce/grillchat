import Button from '@/components/Button'
import EvmAddress from '@/components/EvmAddress'
import useSignMessageAndLinkEvmAddress from '@/hooks/useSignMessageAndLinkEvmAddress'
import { cx } from '@/utils/class-names'
import { useAccount } from 'wagmi'
import { CustomConnectButton } from '../../CustomConnectButton'
import { ContentProps } from '../types'

function LinkEvmAddressContent({ evmAddress, setCurrentState }: ContentProps) {
  const { address: addressFromExt } = useAccount()

  const addressFromExtLowercased = addressFromExt?.toLowerCase()

  const isNotEqAddresses =
    !!addressFromExtLowercased &&
    !!evmAddress &&
    evmAddress !== addressFromExtLowercased

  const { signAndLinkEvmAddress, isLoading } = useSignMessageAndLinkEvmAddress({
    setModalStep: () => setCurrentState('evm-address-linked'),
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
      variant={isNotEqAddresses ? 'primaryOutline' : 'primary'}
    />
  )

  return (
    <div>
      {evmAddress ? (
        <div>
          <EvmAddress evmAddress={evmAddress} />
          {isNotEqAddresses && connectionButton}
          <Button
            onClick={() => setCurrentState('unlink-evm-confirmation')}
            className='mt-6 w-full border-red-500'
            variant='primaryOutline'
            size='lg'
          >
            Unlink EVM address
          </Button>
        </div>
      ) : (
        connectionButton
      )}
    </div>
  )
}

export default LinkEvmAddressContent
