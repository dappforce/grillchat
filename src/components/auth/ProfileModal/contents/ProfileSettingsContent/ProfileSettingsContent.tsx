import { ForceProfileSource } from '@/components/Name'
import ProfilePreview from '@/components/ProfilePreview'
import SubsocialProfileForm, {
  validateNickname,
} from '@/components/subsocial-profile/SubsocialProfileForm'
import Tabs from '@/components/Tabs'
import { getIdentityQuery, getProfileQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { decodeProfileSource, ProfileSource } from '@/utils/profile'
import { useCallback, useEffect, useState } from 'react'
import { forceBackFlowStorage } from '../../ProfileModal'
import { ContentProps, ProfileModalState } from '../../types'
import EvmProfileTabContent from './EvmProfileTabContent'
import PolkadotProfileTabContent from './PolkadotProfileTabContent'

export default function ProfileSettingsContent(props: ContentProps) {
  const customProps = useProfileModal(
    (state) =>
      state.customInternalStepProps as
        | {
            defaultTab: 'evm' | 'polkadot' | 'custom'
          }
        | undefined
  )

  const clearInternalProps = useProfileModal(
    (state) => state.clearInternalProps
  )
  useEffect(() => {
    return () => {
      clearInternalProps()
    }
  }, [clearInternalProps])

  const { address } = props

  const { data: profile } = getProfileQuery.useQuery(address)
  const profileSource = profile?.profileSpace?.content?.profileSource
  const getShouldSelectedTab = useCallback(() => {
    try {
      const data = JSON.parse(forceBackFlowStorage.get() || '{}') as any
      const { from } = data as {
        from: ProfileModalState
        to: ProfileModalState
      }
      if (from === 'polkadot-connect') return 1
      if (from === 'link-evm-address') return 0
    } catch {}

    if (customProps) {
      switch (customProps.defaultTab) {
        case 'evm':
          return 0
        case 'polkadot':
          return 1
        case 'custom':
          return 2
      }
    }

    const { source } = decodeProfileSource(profileSource)
    switch (source) {
      case 'ens':
        return 0
      case 'polkadot-identity':
      case 'kusama-identity':
      case 'kilt-w3n':
      case 'subsocial-username':
        return 1
      default:
        return 2
    }
  }, [profileSource, customProps])

  const [selectedTab, setSelectedTab] = useState(getShouldSelectedTab)
  const [inputtedName, setInputtedName] = useState('')

  const identitiesCount = useIdentitiesCount(address)

  const [selectedPolkadotIdentity, setSelectedPolkadotIdentity] = useState<
    { source: ProfileSource; content?: string } | undefined
  >()
  const [selectedEns, setSelectedEns] = useState('')

  let forceProfileSource: ForceProfileSource | undefined = undefined
  switch (selectedTab) {
    case 0:
      forceProfileSource = { content: selectedEns, profileSource: 'ens' }
      break
    case 1:
      forceProfileSource = {
        profileSource: selectedPolkadotIdentity?.source ?? 'polkadot-identity',
        content: selectedPolkadotIdentity?.content,
      }
      break
    case 2:
      forceProfileSource = {
        profileSource: 'subsocial-profile',
        content: validateNickname(inputtedName) ? inputtedName : '',
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
          panelClassName='mt-4 flex flex-col justify-end'
          tabStyle='buttons'
          tabs={[
            {
              id: 'evm',
              text: <TabTitle title='EVM' amount={identitiesCount.evm} />,
              content: () => (
                <EvmProfileTabContent
                  setSelectedEns={setSelectedEns}
                  {...props}
                />
              ),
            },
            {
              id: 'polkadot',
              text: (
                <TabTitle title='Polkadot' amount={identitiesCount.polkadot} />
              ),
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

function TabTitle({ title, amount }: { title: string; amount: number }) {
  return (
    <span className='flex items-center gap-2'>
      <span>{title}</span>
      {!!amount && <span className='text-text-muted'>{amount}</span>}
    </span>
  )
}

function useIdentitiesCount(address: string) {
  const { data: accountData, isLoading: isLoadingEvm } =
    getAccountDataQuery.useQuery(address)
  const ensNames = accountData?.ensNames

  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const { data: identities, isLoading: isLoadingPolkadot } =
    getIdentityQuery.useQuery(parentProxyAddress ?? '', {
      enabled: !!parentProxyAddress,
    })

  let polkadotIdentitiesCount = 0
  if (identities?.kilt) polkadotIdentitiesCount++
  if (identities?.kusama) polkadotIdentitiesCount++
  if (identities?.polkadot) polkadotIdentitiesCount++
  if (identities?.subsocial)
    polkadotIdentitiesCount += identities.subsocial.length

  return {
    evm: ensNames?.length ?? 0,
    polkadot: polkadotIdentitiesCount ?? 0,
    isLoading: isLoadingEvm || isLoadingPolkadot,
  }
}
