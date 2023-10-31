export type ProfileSource =
  | 'ens'
  | 'polkadot-identity'
  | 'kusama-identity'
  | 'subsocial-username'
  | 'subsocial-profile'
  | 'kilt-w3n'

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
export function encodeProfileSource(source: ProfileSource, content?: string) {
  switch (source) {
    case 'ens':
      return `${prefixes['ens']}${content}`
    case 'polkadot-identity':
      return prefixes['polkadot-identity']
    case 'kusama-identity':
      return prefixes['kusama-identity']
    case 'kilt-w3n':
      return `${prefixes['kilt-w3n']}${content}`
    case 'subsocial-username':
      return `${prefixes['subsocial-username']}${content}`
    default:
      return undefined
  }
}

export function decodeProfileSource(encoded: string | undefined): {
  source: ProfileSource
  content?: string
} {
  const data = prefixEntries.find(([, prefix]) => {
    return encoded.startsWith(prefix)
  }) as [ProfileSource, string] | undefined
  if (!data) return { source: 'subsocial-profile' }

  const [source, prefix] = data
  const content = encoded.split(prefix)[1]
  return { source, content }
}
