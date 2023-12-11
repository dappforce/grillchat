import { CustomConnectButton } from '@/components/auth/common/evm/CustomConnectButton'
import { ContentProps } from '@/components/auth/ProfileModal/types'
import Button from '@/components/Button'
import EvmAddress from '@/components/EvmAddress'
import PopOver from '@/components/floating/PopOver'
import useSignMessageAndLinkEvmAddress from '@/hooks/useSignMessageAndLinkEvmAddress'
import { cx } from '@/utils/class-names'
import { useAccount } from 'wagmi'
import useCanUnlinkAddress from '../../hooks/useCanUnlinkAddress'

function LinkEvmAddressContent({ evmAddress, setCurrentState }: ContentProps) {
  const canUnlinkAddress = useCanUnlinkAddress()
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
      secondLabel='Sign Message'
      variant={isNotEqAddresses ? 'primaryOutline' : 'primary'}
    />
  )

  const unlinkButton = (
    <Button
      onClick={() => setCurrentState('unlink-evm-confirmation')}
      disabled={!canUnlinkAddress}
      className='mt-4 w-full border-red-500'
      variant='primaryOutline'
      size='lg'
    >
      Unlink EVM address
    </Button>
  )

  return (
    <div>
      {evmAddress ? (
        <div>
          <EvmAddress evmAddress={evmAddress} className='mb-2' />
          {isNotEqAddresses && connectionButton}
          {!canUnlinkAddress ? (
            <PopOver
              yOffset={8}
              trigger={<div className='w-full'>{unlinkButton}</div>}
              triggerOnHover
            >
              <p>You need at least 1 identity/account linked to your account</p>
            </PopOver>
          ) : (
            unlinkButton
          )}
        </div>
      ) : (
        connectionButton
      )}
    </div>
  )
}

export default LinkEvmAddressContent
