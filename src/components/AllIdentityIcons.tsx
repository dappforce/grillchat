import { getIdentityQuery } from '@/services/api/query'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import {
  profileSourceData,
  ProfileSourceIncludingOffchain,
} from '@/utils/profile'
import { ComponentProps } from 'react'
import { HiArrowUpRight } from 'react-icons/hi2'
import PopOver from './floating/PopOver'
import LinkText from './LinkText'

export type AllIdentityIconsProps = ComponentProps<'div'> & {
  address: string
}

const iconsOrder: ProfileSourceIncludingOffchain[] = [
  'x',
  'subsocial-username',
  'polkadot-identity',
  'ens',
  'kusama-identity',
  'kilt-w3n',
]

export default function AllIdentityIcons({
  address,
  ...props
}: AllIdentityIconsProps) {
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(address)
  const { data: identity } = getIdentityQuery.useQuery(address)
  const { data: accountData } = getAccountDataQuery.useQuery(address)

  return (
    <div {...props} className={cx('flex items-center', props.className)}>
      <IdentityIcon
        identityType='x'
        address={address}
        id={linkedIdentity?.externalId}
      />
      {accountData?.ensNames?.map((name) => (
        <IdentityIcon
          identityType='ens'
          address={address}
          id={name}
          key={name}
        />
      ))}
      {identity?.subsocial?.map((name) => (
        <IdentityIcon
          key={name}
          identityType='subsocial-username'
          address={address}
          id={name}
        />
      ))}
      <IdentityIcon
        identityType='polkadot-identity'
        address={address}
        id={identity?.polkadot}
      />
      <IdentityIcon
        identityType='kusama-identity'
        address={address}
        id={identity?.kusama}
      />
      <IdentityIcon
        identityType='kilt-w3n'
        address={address}
        id={identity?.kilt}
      />
    </div>
  )
}

function IdentityIcon({
  identityType,
  id,
  address,
}: {
  identityType: ProfileSourceIncludingOffchain
  id?: string
  address: string
}) {
  const { icon: Icon, link, tooltip } = profileSourceData[identityType] || {}
  if (!id) return null

  return (
    <PopOver
      trigger={<Icon />}
      panelSize='sm'
      yOffset={4}
      placement='top'
      triggerOnHover
    >
      <LinkText
        href={link?.(id, address)}
        openInNewTab
        onClick={
          () => {}
          // sendEvent('idenity_link_clicked', {
          //   eventSource: getCurrentPageChatId(),
          // })
        }
        variant='primary'
        className='flex items-center font-semibold outline-none'
      >
        <span>{tooltip}</span>
        <HiArrowUpRight />
      </LinkText>
    </PopOver>
  )
}
