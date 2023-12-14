import EthIcon from '@/assets/icons/eth.svg'
import Button from '@/components/Button'
import SelectInput, { ListItem } from '@/components/inputs/SelectInput'
import LinkText from '@/components/LinkText'
import { useName } from '@/components/Name'
import { getProfileQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { UpsertProfileWrapper } from '@/services/subsocial/profiles/mutation'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { decodeProfileSource, encodeProfileSource } from '@/utils/profile'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ProfileModalContentProps } from '../../types'

export default function EvmProfileTabContent({
  address,
  setSelectedEns,
  setCurrentState,
}: ProfileModalContentProps & { setSelectedEns: (ens: string) => void }) {
  const { data: accountData, isLoading: isLoadingAccountData } =
    getAccountDataQuery.useQuery(address)
  const { data: profile } = getProfileQuery.useQuery(address)
  const evmAddress = accountData?.evmAddress
  const ensNames = accountData?.ensNames
  const { name } = useName(address)
  const sendEvent = useSendEvent()

  const ensOptions = useMemo<ListItem[]>(() => {
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

  if (!ensNames?.length) {
    return (
      <p className='text-text-muted'>
        Use an EVM identity (such as{' '}
        <LinkText
          className='https://app.ens.domains/'
          openInNewTab
          variant='primary'
        >
          ENS
        </LinkText>
        ) on your profile. You currently have no EVM identities .
      </p>
    )
  }

  return (
    <UpsertProfileWrapper>
      {({ mutateAsync, isLoading }) => {
        const onSubmit = (e: any) => {
          e.preventDefault()
          if (!selected?.id) return
          sendEvent('account_settings_changed', { profileSource: 'ens' })
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
              placeholder={
                isLoadingAccountData ? 'Loading...' : 'Select your ENS'
              }
            />
            <Button
              type='submit'
              isLoading={isLoading}
              size='lg'
              disabled={
                !selected?.id || isCurrentProfile || isLoadingAccountData
              }
            >
              {isCurrentProfile ? 'Your current profile' : 'Save changes'}
            </Button>
          </form>
        )
      }}
    </UpsertProfileWrapper>
  )
}
