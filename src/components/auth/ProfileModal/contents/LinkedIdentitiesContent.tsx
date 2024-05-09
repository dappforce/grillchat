import Farcaster from '@/assets/icons/farcaster.svg'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { useNeynarLogin } from '@/providers/config/NeynarLoginProvider'
import { IdentityProvider } from '@/services/datahub/generated-query'
import { useAddExternalProviderToIdentity } from '@/services/datahub/identity/mutation'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyGrillAddress } from '@/stores/my-account'
import { getCurrentUrlWithoutQuery, getUrlQuery } from '@/utils/links'
import { replaceUrl } from '@/utils/window'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { IconType } from 'react-icons'
import { FaXTwitter } from 'react-icons/fa6'
import { IoLogoGoogle } from 'react-icons/io5'
import { SiEthereum } from 'react-icons/si'
import { getExternalProviderPayload } from '../../OauthLoadingModal'

type ProviderData = {
  name: string
  icon: IconType
  shortName?: string
  provider: IdentityProvider
  connectButton: () => JSX.Element
}

const externalProviders: ProviderData[] = [
  {
    name: 'X',
    icon: FaXTwitter,
    provider: IdentityProvider.Twitter,
    connectButton: () => <OauthConnectButton provider='twitter' />,
  },
  {
    name: 'Google',
    icon: IoLogoGoogle,
    provider: IdentityProvider.Google,
    connectButton: () => <OauthConnectButton provider='google' />,
  },
  {
    name: 'Farcaster',
    icon: Farcaster,
    provider: IdentityProvider.Farcaster,
    connectButton: () => <FarcasterConnectButton />,
  },
  {
    name: 'EVM Address',
    icon: SiEthereum,
    shortName: 'EVM',
    provider: IdentityProvider.Evm,
    connectButton: () => <Button size='sm'>Connect</Button>,
  },
]

export default function LinkedIdentitiesContent() {
  const grillAddress = useMyGrillAddress() ?? ''
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(grillAddress)

  return (
    <div className='flex flex-col gap-6'>
      {externalProviders.map(
        ({
          icon: Icon,
          name,
          shortName,
          provider,
          connectButton: ConnectButton,
        }) => {
          const isLinked = linkedIdentity?.externalProviders.find(
            (p) => p.provider === provider
          )
          return (
            <div className='flex flex-col gap-2' key={name}>
              <span>{name}</span>
              <Card className='flex items-center gap-4 bg-background p-4'>
                <Icon className='flex-shrink-0 text-xl text-text-muted' />
                <span className='flex-1 break-words'>
                  {isLinked
                    ? isLinked.username || isLinked.externalId
                    : `Connect your ${shortName ?? name}`}
                </span>
                {isLinked ? (
                  <Button className='flex-shrink-0' size='sm' disabled>
                    Connected
                  </Button>
                ) : (
                  <ConnectButton />
                )}
              </Card>
            </div>
          )
        }
      )}
    </div>
  )
}

function FarcasterConnectButton() {
  const { loginNeynar, isLoadingOrSubmitted } = useNeynarLogin()
  return (
    <Button
      size='sm'
      onClick={() => loginNeynar()}
      isLoading={isLoadingOrSubmitted}
    >
      Connect
    </Button>
  )
}

function OauthConnectButton({ provider }: { provider: 'google' | 'twitter' }) {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const sendEvent = useSendEvent()
  const calledRef = useRef(false)
  const { data: session } = useSession()
  const { mutate, isLoading } = useAddExternalProviderToIdentity({
    onSuccess: () => {
      signOut({ redirect: false })
      replaceUrl(getCurrentUrlWithoutQuery('login'))
    },
  })

  useEffect(() => {
    const loginProvider = getUrlQuery('login')
    if (loginProvider === provider && session) {
      calledRef.current = true
      const externalProvider = getExternalProviderPayload(session)
      if (!externalProvider) {
        toast.error('Provider not supported')
        return
      }
      mutate({ externalProvider })
    }
  }, [provider, session, mutate])

  return (
    <Button
      size='sm'
      isLoading={isRedirecting || isLoading}
      onClick={() => {
        setIsRedirecting(true)
        sendEvent('add_provider_google_clicked')
        signIn(provider, {
          callbackUrl:
            getCurrentUrlWithoutQuery() +
            `?profile=linked-accounts&login=${provider}`,
        })
      }}
    >
      Connect
    </Button>
  )
}
