import KiltIcon from '@/assets/icons/kilt.svg'
import KusamaIcon from '@/assets/icons/kusama.svg'
import PolkadotIcon from '@/assets/icons/polkadot.svg'
import SubsocialIcon from '@/assets/icons/subsocial.svg'
import Button from '@/components/Button'
import SelectInput, { ListItem } from '@/components/inputs/SelectInput'
import LinkText from '@/components/LinkText'
import { useName } from '@/components/Name'
import { getIdentityQuery, getProfileQuery } from '@/services/api/query'
import { UpsertProfileWrapper } from '@/services/subsocial/profiles/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import {
  decodeProfileSource,
  encodeProfileSource,
  ProfileSource,
} from '@/utils/profile'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ContentProps } from '../../types'

export default function PolkadotProfileTabContent({
  address,
  setCurrentState,
  setSelectedSource,
}: ContentProps & {
  setSelectedSource: (
    source: { source: ProfileSource; content?: string } | undefined
  ) => void
}) {
  const { data: profile } = getProfileQuery.useQuery(address)
  const profileSource = profile?.profileSpace?.content?.profileSource
  const { name } = useName(address)
  const sendEvent = useSendEvent()

  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const hasConnectedPolkadot = !!parentProxyAddress
  const { data: identities, isFetching: isFetchingIdentities } =
    getIdentityQuery.useQuery(parentProxyAddress ?? '', {
      enabled: !!parentProxyAddress,
    })

  const identitiesOptions = useMemo(() => {
    const options: ListItem[] = []
    if (identities?.polkadot) {
      options.push({
        id: 'polkadot-identity',
        label: identities.polkadot,
        icon: <PolkadotIcon className='text-text-muted' />,
      })
    }
    if (identities?.subsocial) {
      identities.subsocial.forEach((username) => {
        options.push({
          id: 'subsocial-username',
          label: username,
          icon: <SubsocialIcon className='text-text-muted' />,
        })
      })
    }
    if (identities?.kusama) {
      options.push({
        id: 'kusama-identity',
        label: identities.kusama,
        icon: <KusamaIcon className='text-text-muted' />,
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
    } else if (source === 'kusama-identity') {
      const selected = identitiesOptions.find(
        (item) => item.id === 'kusama-identity'
      )
      newSelected = selected
    } else if (source === 'kilt-w3n') {
      const selected = identitiesOptions.find(
        (item) => item.label === content && item.id === 'kilt-w3n'
      )
      newSelected = selected
    } else if (source === 'subsocial-username') {
      const selected = identitiesOptions.find(
        (item) => item.label === content && item.id === 'subsocial-username'
      )
      newSelected = selected
    }
    return newSelected ?? identitiesOptions[0] ?? null
  }, [identitiesOptions, profileSource])

  const [selected, setSelected] = useState<ListItem | null>(
    getShouldSelectedProfile
  )
  useEffect(() => {
    setSelectedSource({
      source: selected?.id as ProfileSource,
      content: selected?.label,
    })
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

  if (
    !identities?.polkadot &&
    !identities?.kilt &&
    !identities?.kusama &&
    !identities?.subsocial?.length &&
    !isFetchingIdentities
  ) {
    return (
      <p className='text-text-muted'>
        To use a Polkadot identity, you need to set it up first. We support{' '}
        <LinkText
          href='https://polkaverse.com/dd'
          openInNewTab
          variant='primary'
        >
          Subsocial Usernames
        </LinkText>
        ,{' '}
        <LinkText
          href='https://support.polkadot.network/support/solutions/articles/65000181981-how-to-set-and-clear-an-identity#Setting-an-Identity'
          openInNewTab
          variant='primary'
        >
          Polkadot Identity
        </LinkText>
        ,{' '}
        <LinkText
          href='https://support.polkadot.network/support/solutions/articles/65000181981-how-to-set-and-clear-an-identity#Setting-an-Identity'
          openInNewTab
          variant='primary'
        >
          Kusama Identity
        </LinkText>
        , and{' '}
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
          } else if (selectedId === 'kusama-identity') {
            newProfileSource = encodeProfileSource({
              source: 'kusama-identity',
            })
          } else if (selectedId === 'kilt-w3n') {
            newProfileSource = encodeProfileSource({
              source: 'kilt-w3n',
              content: selected?.label ?? '',
            })
          } else if (selectedId === 'subsocial-username') {
            newProfileSource = encodeProfileSource({
              source: 'subsocial-username',
              content: selected?.label ?? '',
            })
          }
          mutateAsync({
            content: {
              ...profile?.profileSpace?.content,
              profileSource: newProfileSource,
            },
          })
          sendEvent('account_settings_changed', { profileSource: selectedId })
        }

        return (
          <form onSubmit={onSubmit} className={cx('flex flex-col gap-4')}>
            <SelectInput
              items={identitiesOptions}
              selected={selected ?? null}
              setSelected={setSelected}
              placeholder={
                isFetchingIdentities ? 'Loading...' : 'Select identity provider'
              }
            />
            <Button
              type='submit'
              isLoading={isLoading || isFetchingIdentities}
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
