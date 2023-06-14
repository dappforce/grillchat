import Button from '@/components/Button'
import { CopyTextInline } from '@/components/CopyText'
import LinkText from '@/components/LinkText'
import useSignMessageAndLinkEvmAddress from '@/hooks/useSignMessageAndLinkEvmAddress'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { HiArrowUpRight } from 'react-icons/hi2'
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
          <div className='flex justify-between'>
            <CopyTextInline
              text={truncateAddress(evmAddress)}
              tooltip='Copy my EVM address'
              tooltipPlacement='top'
              textToCopy={evmAddress}
              textClassName='font-mono'
            />
            <LinkText
              openInNewTab
              href={`https://etherscan.io/address/${evmAddress}`}
              variant='primary'
            >
              <span className='flex items-center'>
                Etherscan <HiArrowUpRight className='ml-2 text-text-muted' />
              </span>
            </LinkText>
          </div>
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
