import Button from '@/components/Button'
import ProfilePreview from '@/components/ProfilePreview'
import SubsocialProfileForm from '@/components/subsocial-profile/SubsocialProfileForm'
import Tabs from '@/components/Tabs'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { ContentProps } from '../types'

export default function ProfileSettingsContent(props: ContentProps) {
  const { address } = props

  return (
    <div className='mt-2 flex flex-col gap-6'>
      <div className='flex flex-col rounded-2xl bg-background-lighter p-4'>
        <ProfilePreview address={address} />
      </div>
      <div className='flex flex-col'>
        <span className='mb-2 text-text-muted'>Identity provider</span>
        <Tabs
          panelClassName='mt-4'
          tabStyle='buttons'
          tabs={[
            {
              id: 'evm',
              text: 'EVM',
              content: () => <EvmProfileTabContent {...props} />,
            },
            {
              id: 'polkadot',
              text: 'Polkadot',
              content: () => <PolkadotProfileTabContent {...props} />,
            },
            {
              id: 'custom',
              text: 'Custom',
              content: () => <SubsocialProfileForm />,
            },
          ]}
        />
      </div>
    </div>
  )
}

function PolkadotProfileTabContent({ address, setCurrentState }: ContentProps) {
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const hasConnectedPolkadot = !!parentProxyAddress
  console.log(parentProxyAddress)

  if (!hasConnectedPolkadot) {
    return (
      <div className='flex flex-col gap-4'>
        <p className='text-text-muted'>
          To use a Polkadot identity, you need to connect an address first.
        </p>
        <Button
          variant='primaryOutline'
          onClick={() =>
            setCurrentState('polkadot-connect', 'profile-settings')
          }
          size='lg'
        >
          Connect Address
        </Button>
      </div>
    )
  }

  return <div>polkadot form</div>
}

function EvmProfileTabContent({ address, setCurrentState }: ContentProps) {
  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const hasEvmAddress = !!accountData?.evmAddress

  if (!hasEvmAddress) {
    return (
      <div className='flex flex-col gap-4'>
        <p className='text-text-muted'>
          To use an EVM identity, you need to connect an address first.
        </p>
        <Button
          variant='primaryOutline'
          onClick={() =>
            setCurrentState('link-evm-address', 'profile-settings')
          }
          size='lg'
        >
          Connect Address
        </Button>
      </div>
    )
  }

  return <div>evm form</div>
}
