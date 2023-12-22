import EnsIcon from '@/assets/icons/ens-dynamic-size.svg'
import KiltIcon from '@/assets/icons/kilt-dynamic-size.svg'
import KusamaIcon from '@/assets/icons/kusama-dynamic-size.svg'
import PolkadotIcon from '@/assets/icons/polkadot-dynamic-size.svg'
import SubsocialIcon from '@/assets/icons/subsocial-dynamic-size.svg'
import XLogoIcon from '@/assets/icons/x-logo-dynamic-size.svg'

type ProfileSourceData =
  | { source: 'ens'; content: string }
  | { source: 'polkadot-identity' }
  | { source: 'kusama-identity' }
  | { source: 'subsocial-username'; content: string }
  | { source: 'subsocial-profile' }
  | { source: 'kilt-w3n'; content: string }
export type ProfileSource = ProfileSourceData['source']

const prefixes: Record<ProfileSource, string> = {
  ens: 'chain://chainType:evm/chainName:ethereum/accountName:',
  'polkadot-identity': 'chain://chainType:substrate/chainName:polkadot',
  'kusama-identity': 'chain://chainType:substrate/chainName:kusama',
  'subsocial-username':
    'chain://chainType:substrate/chainName:subsocial/accountName:',
  'kilt-w3n': 'chain://chainType:substrate/chainName:kilt/accountName:',
  'subsocial-profile': '',
}
const prefixEntries = Object.entries(prefixes)
export function encodeProfileSource(data: ProfileSourceData) {
  switch (data.source) {
    case 'ens':
      return `${prefixes['ens']}${data.content}`
    case 'polkadot-identity':
      return prefixes['polkadot-identity']
    case 'kusama-identity':
      return prefixes['kusama-identity']
    case 'kilt-w3n':
      return `${prefixes['kilt-w3n']}${data.content}`
    case 'subsocial-username':
      return `${prefixes['subsocial-username']}${data.content}`
    default:
      return undefined
  }
}

export function decodeProfileSource(encoded: string | undefined): {
  source: ProfileSource
  content?: string
} {
  if (!encoded) return { source: 'subsocial-profile' }

  const data = prefixEntries.find(([, prefix]) => {
    return encoded.startsWith(prefix)
  }) as [ProfileSource, string] | undefined
  if (!data || data[0] === 'subsocial-profile')
    return { source: 'subsocial-profile' }

  const [source, prefix] = data
  const content = encoded.split(prefix)[1]
  return { source, content }
}

export type ProfileSourceIncludingOffchain = ProfileSource | 'x'
export const profileSourceData: {
  [key in ProfileSourceIncludingOffchain]?: {
    icon: any
    tooltip: string
    link: (id: string, address: string) => string
  }
} = {
  'kilt-w3n': {
    icon: KiltIcon,
    tooltip: 'Kilt W3Name',
    link: () => '',
  },
  ens: {
    icon: EnsIcon,
    tooltip: 'ENS',
    link: (id) => `https://app.ens.domains/${id}`,
  },
  'kusama-identity': {
    icon: KusamaIcon,
    tooltip: 'Kusama Identity',
    link: (_, address) => `https://sub.id/${address}`,
  },
  'polkadot-identity': {
    icon: PolkadotIcon,
    tooltip: 'Polkadot Identity',
    link: (_, address) => `https://sub.id/${address}`,
  },
  'subsocial-username': {
    icon: SubsocialIcon,
    tooltip: 'Subsocial Username',
    link: (id) => `https://sub.id/${id}`,
  },
  x: {
    icon: XLogoIcon,
    tooltip: 'X Profile',
    link: (id) => `https://twitter.com/intent/user?user_id=${id}`,
  },
}
