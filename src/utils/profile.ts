import EnsIcon from '@/assets/icons/ens-dynamic-size.svg'
import XLogoIcon from '@/assets/icons/x-logo-dynamic-size.svg'
import { IdentityProvider } from '@subsocial/data-hub-sdk'
import { IoLogoGoogle } from 'react-icons/io'

type ProfileSourceData =
  | { source: 'ens'; content: string }
  | { source: 'subsocial-profile' }
export type ProfileSource = ProfileSourceData['source']

const prefixes: Record<ProfileSource, string> = {
  ens: 'chain://chainType:evm/chainName:ethereum/accountName:',
  'subsocial-profile': '',
}
const prefixEntries = Object.entries(prefixes)
export function encodeProfileSource(data: ProfileSourceData) {
  switch (data.source) {
    case 'ens':
      return `${prefixes['ens']}${data.content}`
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

export const profileSourceData: {
  [key in IdentityProvider]?: {
    icon: any
    tooltip: string
    link?: (id: string, address: string) => string
  }
} = {
  EVM: {
    icon: EnsIcon,
    tooltip: 'ENS',
    link: (id) => `https://app.ens.domains/${id}`,
  },
  TWITTER: {
    icon: XLogoIcon,
    tooltip: 'X Profile',
    link: (id) => `https://twitter.com/intent/user?user_id=${id}`,
  },
  GOOGLE: {
    icon: IoLogoGoogle,
    tooltip: 'Linked with Google',
  },
}
