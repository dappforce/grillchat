import EthIcon from '@/assets/icons/eth.svg'
import Button from '@/components/Button'
import Input from '@/components/inputs/Input'
import ProfilePreview from '@/components/ProfilePreview'
import SubsocialProfileForm from '@/components/subsocial-profile/SubsocialProfileForm'
import Tabs from '@/components/Tabs'
import { getProfileQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { UpsertProfileWrapper } from '@/services/subsocial/profiles/mutation'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { useEffect, useState } from 'react'
import { ContentProps } from '../types'

export default function ProfileSettingsContent(props: ContentProps) {
  const { address } = props

  const [selectedTab, setSelectedTab] = useState(2)
  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const hasEvmAddress = !!accountData?.ensName
  const { data: profile } = getProfileQuery.useQuery(address)
  const hasCustomName = !!profile?.profileSpace?.content?.name
  const defaultProfile = profile?.profileSpace?.content?.defaultProfile

  useEffect(() => {
    // TODO: check based on default profile
    if (hasEvmAddress) {
      setSelectedTab(0)
    }
  }, [defaultProfile, hasEvmAddress])

  let forceDefaultProfile: string | undefined = undefined
  switch (selectedTab) {
    case 0:
      forceDefaultProfile = 'evm'
      break
    case 1:
      forceDefaultProfile = 'polkadot'
      break
    case 2:
      forceDefaultProfile = 'custom'
      break
  }

  return (
    <div className='mt-2 flex flex-col gap-6'>
      <div className='flex flex-col rounded-2xl bg-background-lighter p-4'>
        <ProfilePreview
          address={address}
          forceDefaultProfile={{ defaultProfile: forceDefaultProfile }}
        />
      </div>
      <div className='flex flex-col'>
        <span className='mb-2 text-text-muted'>Identity provider</span>
        <Tabs
          manualTabControl={{ selectedTab, setSelectedTab }}
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

function PolkadotProfileTabContent({ setCurrentState }: ContentProps) {
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const hasConnectedPolkadot = !!parentProxyAddress

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
  const { data: profile } = getProfileQuery.useQuery(address)
  const evmAddress = accountData?.evmAddress
  const ensName = accountData?.ensName

  const defaultProfile = profile?.profileSpace?.content?.defaultProfile

  if (!evmAddress) {
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

  return (
    <UpsertProfileWrapper>
      {({ mutateAsync, isLoading }) => {
        const onSubmit = (e: any) => {
          e.preventDefault()
          mutateAsync({
            content: {
              ...profile?.profileSpace?.content,
              name: profile?.profileSpace?.content?.name ?? '',
              defaultProfile: 'evm',
            },
          })
        }

        return (
          <form onSubmit={onSubmit} className={cx('flex flex-col gap-4')}>
            <Input
              placeholder='Name (3-25 symbols)'
              variant='fill-bg'
              className='pl-10 !brightness-100'
              value={ensName ?? 'You have no ENS'}
              disabled
              leftElement={(className) => (
                <EthIcon className={cx(className, 'left-3')} />
              )}
            />
            <Button
              type='submit'
              isLoading={isLoading}
              size='lg'
              disabled={defaultProfile === 'evm'}
            >
              Save changes
            </Button>
          </form>
        )
      }}
    </UpsertProfileWrapper>
  )
}
