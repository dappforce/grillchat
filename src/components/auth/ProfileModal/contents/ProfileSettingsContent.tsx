import EthIcon from '@/assets/icons/eth.svg'
import KiltIcon from '@/assets/icons/kilt.svg'
import PolkadotIcon from '@/assets/icons/polkadot.svg'
import Button from '@/components/Button'
import Input from '@/components/inputs/Input'
import SelectInput, { ListItem } from '@/components/inputs/SelectInput'
import LinkText from '@/components/LinkText'
import { useName } from '@/components/Name'
import ProfilePreview from '@/components/ProfilePreview'
import SubsocialProfileForm from '@/components/subsocial-profile/SubsocialProfileForm'
import Tabs from '@/components/Tabs'
import { getIdentityQuery, getProfileQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { UpsertProfileWrapper } from '@/services/subsocial/profiles/mutation'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { SpaceContent } from '@subsocial/api/types'
import { useEffect, useMemo, useState } from 'react'
import { ContentProps } from '../types'

export default function ProfileSettingsContent(props: ContentProps) {
  const { address } = props

  const [selectedTab, setSelectedTab] = useState(2)
  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const hasEns = !!accountData?.ensName

  const { data: profile } = getProfileQuery.useQuery(address)
  const profileSource = profile?.profileSpace?.content?.profileSource

  const { data: identities } = getIdentityQuery.useQuery(address, {
    enabled: !!address,
  })
  const hasPolkadotIdentity = !!(identities?.polkadot || identities?.kilt)

  const [inputtedName, setInputtedName] = useState('')

  useEffect(() => {
    switch (profileSource) {
      case 'ens':
        setSelectedTab(0)
        break
      case 'polkadot-identity':
      case 'kilt-w3n':
        setSelectedTab(1)
        break
      case 'subsocial-profile':
        setSelectedTab(2)
        break
      default:
        if (hasEns) {
          setSelectedTab(0)
        }
    }
  }, [profileSource, hasEns])

  const [polkadotIdentitySelected, setPolkadotIdentitySelected] = useState<
    SpaceContent['profileSource'] | undefined
  >()

  let forceProfileSource: SpaceContent['profileSource'] | undefined = undefined
  switch (selectedTab) {
    case 0:
      forceProfileSource = 'ens'
      break
    case 1:
      forceProfileSource = polkadotIdentitySelected
      break
    case 2:
      forceProfileSource = 'subsocial-profile'
      break
  }

  return (
    <div className='mt-2 flex flex-col gap-6'>
      <div className='flex flex-col rounded-2xl bg-background-lighter p-4'>
        <ProfilePreview
          address={address}
          forceProfileSource={{
            profileSource: forceProfileSource,
            name:
              forceProfileSource === 'subsocial-profile'
                ? inputtedName
                : undefined,
          }}
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
              content: () => (
                <PolkadotProfileTabContent
                  setSelectedSource={setPolkadotIdentitySelected}
                  {...props}
                />
              ),
            },
            {
              id: 'custom',
              text: 'Custom',
              content: () => (
                <SubsocialProfileForm
                  onNameChange={setInputtedName}
                  shouldSetAsProfileSource={hasPolkadotIdentity || hasEns}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}

function PolkadotProfileTabContent({
  address,
  setCurrentState,
  setSelectedSource,
}: ContentProps & {
  setSelectedSource: (source: SpaceContent['profileSource'] | undefined) => void
}) {
  const { data: profile } = getProfileQuery.useQuery(address)
  const { name } = useName(address)

  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const hasConnectedPolkadot = !!parentProxyAddress
  const { data: identities } = getIdentityQuery.useQuery(
    parentProxyAddress ?? '',
    {
      enabled: !!parentProxyAddress,
    }
  )

  const identityOptionsMap = useMemo(
    () =>
      ({
        polkadot: identities?.polkadot
          ? {
              id: 'polkadot-identity',
              label: identities.polkadot,
              icon: <PolkadotIcon className='text-text-muted' />,
            }
          : null,
        kilt: identities?.kilt
          ? {
              id: 'kilt-w3n',
              label: identities.kilt,
              icon: <KiltIcon className='text-text-muted' />,
            }
          : null,
      } satisfies Record<string, ListItem | null>),
    [identities]
  )

  const [selected, setSelected] = useState<null | ListItem>(() => {
    if (identities?.polkadot) {
      return identityOptionsMap.polkadot
    } else if (identities?.kilt) {
      return identityOptionsMap.kilt
    }
    return null
  })
  useEffect(() => {
    setSelectedSource(selected?.id as SpaceContent['profileSource'])
  }, [selected, setSelectedSource])

  useEffect(() => {
    if (identities?.polkadot) {
      setSelected(identityOptionsMap.polkadot)
    } else if (identities?.kilt) {
      setSelected(identityOptionsMap.kilt)
    }
  }, [identities, identityOptionsMap])

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

  if (!identities?.polkadot && !identities?.kilt) {
    return (
      <p className='text-text-muted'>
        To use a Polkadot identity, you need to set it up first. We support{' '}
        <LinkText
          href='https://support.polkadot.network/support/solutions/articles/65000181981-how-to-set-and-clear-an-identity#Setting-an-Identity'
          openInNewTab
          variant='primary'
        >
          Polkadot Identity
        </LinkText>{' '}
        and{' '}
        <LinkText href='https://w3n.id/' variant='primary' openInNewTab>
          KILT w3name
        </LinkText>
        .
      </p>
    )
  }

  const isCurrentProfile = name === selected?.label

  return (
    <UpsertProfileWrapper>
      {({ mutateAsync, isLoading }) => {
        const onSubmit = (e: any) => {
          e.preventDefault()
          const selectedId = selected?.id
          if (!selectedId) return
          mutateAsync({
            content: {
              ...profile?.profileSpace?.content,
              profileSource: selectedId as SpaceContent['profileSource'],
            },
          })
        }

        return (
          <form onSubmit={onSubmit} className={cx('flex flex-col gap-4')}>
            <SelectInput
              items={Object.values(identityOptionsMap).filter(Boolean)}
              selected={selected}
              setSelected={setSelected}
              placeholder='Select identity provider'
            />
            <Button
              type='submit'
              isLoading={isLoading}
              size='lg'
              disabled={!selected?.id || isCurrentProfile}
            >
              {isCurrentProfile ? 'Your current profile' : 'Save changes'}
            </Button>
          </form>
        )
      }}
    </UpsertProfileWrapper>
  )
}

function EvmProfileTabContent({ address, setCurrentState }: ContentProps) {
  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const { data: profile } = getProfileQuery.useQuery(address)
  const evmAddress = accountData?.evmAddress
  const ensName = accountData?.ensName
  const { name } = useName(address)

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

  const isCurrentProfile = name === ensName

  return (
    <UpsertProfileWrapper>
      {({ mutateAsync, isLoading }) => {
        const onSubmit = (e: any) => {
          e.preventDefault()
          mutateAsync({
            content: {
              ...profile?.profileSpace?.content,
              name: profile?.profileSpace?.content?.name ?? '',
              profileSource: 'ens',
            },
          })
        }

        return (
          <form onSubmit={onSubmit} className={cx('flex flex-col gap-4')}>
            <Input
              placeholder='Name (3-25 symbols)'
              variant='fill-bg'
              className='pl-12 !brightness-100'
              value={ensName ?? 'You have no ENS'}
              disabled
              leftElement={(className) => (
                <EthIcon className={cx(className, 'left-4 text-text-muted')} />
              )}
            />
            <Button
              type='submit'
              isLoading={isLoading}
              size='lg'
              disabled={isCurrentProfile}
            >
              {isCurrentProfile ? 'Your current profile' : 'Save changes'}
            </Button>
          </form>
        )
      }}
    </UpsertProfileWrapper>
  )
}
