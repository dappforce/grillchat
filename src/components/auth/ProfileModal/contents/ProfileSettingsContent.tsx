import EthIcon from '@/assets/icons/eth.svg'
import KiltIcon from '@/assets/icons/kilt.svg'
import PolkadotIcon from '@/assets/icons/polkadot.svg'
import Button from '@/components/Button'
import SelectInput, { ListItem } from '@/components/inputs/SelectInput'
import LinkText from '@/components/LinkText'
import { ForceProfileSource, useName } from '@/components/Name'
import ProfilePreview from '@/components/ProfilePreview'
import SubsocialProfileForm from '@/components/subsocial-profile/SubsocialProfileForm'
import Tabs from '@/components/Tabs'
import { getIdentityQuery, getProfileQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { UpsertProfileWrapper } from '@/services/subsocial/profiles/mutation'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import {
  decodeProfileSource,
  encodeProfileSource,
  ProfileSource,
} from '@/utils/profile'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ContentProps } from '../types'

export default function ProfileSettingsContent(props: ContentProps) {
  const { address } = props

  const [selectedTab, setSelectedTab] = useState(2)
  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const hasEns = !!accountData?.ensNames

  const { data: profile } = getProfileQuery.useQuery(address)
  const profileSource = profile?.profileSpace?.content?.profileSource

  const [inputtedName, setInputtedName] = useState('')

  useEffect(() => {
    const { source } = decodeProfileSource(profileSource)
    switch (source) {
      case 'ens':
        setSelectedTab(0)
        break
      case 'polkadot-identity':
      case 'kilt-w3n':
        setSelectedTab(1)
        break
      default:
        setSelectedTab(2)
        break
    }
  }, [profileSource, hasEns])

  const [selectedPolkadotIdentity, setSelectedPolkadotIdentity] = useState<
    ProfileSource | undefined
  >()
  const [selectedEns, setSelectedEns] = useState('')

  let forceProfileSource: ForceProfileSource | undefined = undefined
  switch (selectedTab) {
    case 0:
      forceProfileSource = { content: selectedEns, profileSource: 'ens' }
      break
    case 1:
      forceProfileSource = {
        profileSource: selectedPolkadotIdentity,
      }
      break
    case 2:
      forceProfileSource = {
        profileSource: 'subsocial-profile',
        content: inputtedName,
      }
      break
  }

  return (
    <div className='mt-2 flex flex-col gap-6'>
      <div className='flex flex-col rounded-2xl bg-background-lighter p-4'>
        <ProfilePreview
          address={address}
          forceProfileSource={forceProfileSource}
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
              content: () => (
                <EvmProfileTabContent
                  setSelectedEns={setSelectedEns}
                  {...props}
                />
              ),
            },
            {
              id: 'polkadot',
              text: 'Polkadot',
              content: () => (
                <PolkadotProfileTabContent
                  setSelectedSource={setSelectedPolkadotIdentity}
                  {...props}
                />
              ),
            },
            {
              id: 'custom',
              text: 'Custom',
              content: () => (
                <SubsocialProfileForm onNameChange={setInputtedName} />
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
  setSelectedSource: (source: ProfileSource | undefined) => void
}) {
  const { data: profile } = getProfileQuery.useQuery(address)
  const profileSource = profile?.profileSpace?.content?.profileSource
  const { name } = useName(address)

  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const hasConnectedPolkadot = !!parentProxyAddress
  const { data: identities } = getIdentityQuery.useQuery(
    parentProxyAddress ?? '',
    {
      enabled: !!parentProxyAddress,
    }
  )

  const identitiesOptions = useMemo(() => {
    const options: ListItem[] = []
    if (identities?.polkadot) {
      options.push({
        id: 'polkadot-identity',
        label: identities.polkadot,
        icon: <PolkadotIcon className='text-text-muted' />,
      })
    }
    if (identities?.kilt) {
      options.push({
        id: 'kilt-w3n',
        label: identities.kilt,
        icon: <KiltIcon className='text-text-muted' />,
      })
    }
    return options
  }, [identities])

  const getShouldSelectedProfile = useCallback(() => {
    const { source, content } = decodeProfileSource(profileSource)
    let newSelected: ListItem | undefined
    if (source === 'polkadot-identity') {
      const selected = identitiesOptions.find(
        (item) => item.id === 'polkadot-identity'
      )
      newSelected = selected
    } else if (source === 'kilt-w3n') {
      const selected = identitiesOptions.find(
        (item) => item.label === content && item.id === 'kilt-w3n'
      )
      newSelected = selected
    }
    return newSelected ?? identitiesOptions[0] ?? null
  }, [identitiesOptions, profileSource])

  const [selected, setSelected] = useState<ListItem | null>(
    getShouldSelectedProfile
  )
  useEffect(() => {
    setSelectedSource(selected?.id as ProfileSource)
  }, [selected, setSelectedSource])

  useEffect(() => {
    setSelected(getShouldSelectedProfile())
  }, [getShouldSelectedProfile])

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
          const selectedId = selected?.id as ProfileSource
          if (!selectedId) return

          let newProfileSource: string | undefined
          if (selectedId === 'polkadot-identity') {
            newProfileSource = encodeProfileSource({
              source: 'polkadot-identity',
            })
          } else if (selectedId === 'kilt-w3n') {
            newProfileSource = encodeProfileSource({
              source: 'kilt-w3n',
              content: selected?.label ?? '',
            })
          }
          mutateAsync({
            content: {
              ...profile?.profileSpace?.content,
              profileSource: newProfileSource,
            },
          })
        }

        return (
          <form onSubmit={onSubmit} className={cx('flex flex-col gap-4')}>
            <SelectInput
              items={identitiesOptions}
              selected={selected ?? null}
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

function EvmProfileTabContent({
  address,
  setSelectedEns,
  setCurrentState,
}: ContentProps & { setSelectedEns: (ens: string) => void }) {
  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const { data: profile } = getProfileQuery.useQuery(address)
  const evmAddress = accountData?.evmAddress
  const ensNames = accountData?.ensNames
  const { name } = useName(address)

  const ensOptions = useMemo<ListItem[]>(() => {
    console.log(ensNames)
    return (
      ensNames?.map((ens) => ({
        id: ens,
        label: ens,
        icon: <EthIcon className='text-text-muted' />,
      })) ?? []
    )
  }, [ensNames])

  const profileSource = profile?.profileSpace?.content?.profileSource
  const getShouldSelectedProfile = useCallback(() => {
    const { source, content } = decodeProfileSource(profileSource)
    let newSelected: ListItem | undefined
    if (source === 'ens') {
      const selected = ensOptions.find((item) => item.id === content)
      newSelected = selected
    }
    return newSelected ?? ensOptions[0] ?? null
  }, [ensOptions, profileSource])

  const [selected, setSelected] = useState<ListItem | null>(
    getShouldSelectedProfile
  )
  useEffect(() => {
    setSelectedEns(selected?.id ?? '')
  }, [selected, setSelectedEns])

  useEffect(() => {
    setSelected(getShouldSelectedProfile())
  }, [getShouldSelectedProfile])

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

  const isCurrentProfile = name === selected?.id

  return (
    <UpsertProfileWrapper>
      {({ mutateAsync, isLoading }) => {
        const onSubmit = (e: any) => {
          e.preventDefault()
          if (!selected?.id) return
          mutateAsync({
            content: {
              ...profile?.profileSpace?.content,
              name: profile?.profileSpace?.content?.name ?? '',
              profileSource: encodeProfileSource({
                source: 'ens',
                content: selected.id,
              }),
            },
          })
        }

        return (
          <form onSubmit={onSubmit} className={cx('flex flex-col gap-4')}>
            <SelectInput
              items={ensOptions}
              selected={selected ?? null}
              setSelected={setSelected}
              placeholder='Select your ENS'
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
