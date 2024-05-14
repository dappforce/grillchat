import Farcaster from '@/assets/icons/farcaster.svg'
import Button from '@/components/Button'
import Card from '@/components/Card'
import useToastError from '@/hooks/useToastError'
import useWrapInRef from '@/hooks/useWrapInRef'
import { useNeynarLogin } from '@/providers/config/NeynarLoginProvider'
import { IdentityProvider } from '@/services/datahub/generated-query'
import { useAddExternalProviderToIdentity } from '@/services/datahub/identity/mutation'
import {
  getEvmLinkedIdentityMessageQuery,
  getLinkedIdentityQuery,
} from '@/services/datahub/identity/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyGrillAddress } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { getCurrentUrlWithoutQuery, getUrlQuery } from '@/utils/links'
import { IdentityProvider as SDKIdentityProvider } from '@subsocial/data-hub-sdk'
import { useQueryClient } from '@tanstack/react-query'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { IconType } from 'react-icons'
import { FaXTwitter } from 'react-icons/fa6'
import { IoLogoGoogle } from 'react-icons/io5'
import { SiEthereum } from 'react-icons/si'
import { useSignMessage } from 'wagmi'
import { getExternalProviderPayload } from '../../OauthLoadingModal'
import { CustomConnectButton } from '../../common/evm/CustomConnectButton'

type ProviderData = {
  name: string
  icon: IconType
  shortName?: string
  provider: IdentityProvider
  customName?: (usernameOrId: string) => string
  connectButton: () => JSX.Element
}

const externalProviders: ProviderData[] = [
  {
    name: 'EVM Address',
    icon: SiEthereum,
    shortName: 'EVM',
    provider: IdentityProvider.Evm,
    customName: (nameOrId) => truncateAddress(nameOrId),
    connectButton: () => <EvmConnectButton />,
  },
  {
    name: 'Farcaster',
    icon: Farcaster,
    provider: IdentityProvider.Farcaster,
    connectButton: () => <FarcasterConnectButton />,
  },
  {
    name: 'Google',
    icon: IoLogoGoogle,
    provider: IdentityProvider.Google,
    connectButton: () => <OauthConnectButton provider='google' />,
  },
  {
    name: 'X',
    icon: FaXTwitter,
    provider: IdentityProvider.Twitter,
    connectButton: () => <OauthConnectButton provider='twitter' />,
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
          customName,
        }) => {
          const isLinked = linkedIdentity?.externalProviders.find(
            (p) => p.provider === provider
          )
          let text = `Connect your ${shortName ?? name}`
          if (isLinked) {
            const usernameOrId = isLinked.username || isLinked.externalId
            if (customName) {
              text = customName(usernameOrId)
            } else {
              text = usernameOrId
            }
          }

          return (
            <div className='flex flex-col gap-2' key={name}>
              <span>{name}</span>
              <Card className='flex items-center gap-4 bg-background p-4'>
                <Icon className='flex-shrink-0 text-xl text-text-muted' />
                <span className='flex-1 break-words'>{text}</span>
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

function EvmConnectButton() {
  const sendEvent = useSendEvent()
  const client = useQueryClient()
  const [isGettingMessage, setIsGettingMessage] = useState(false)
  const { signMessageAsync, isLoading: isSigning, reset } = useSignMessage()
  const grillAddress = useMyGrillAddress()
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    grillAddress ?? ''
  )

  const hasEvmProvider = linkedIdentity?.externalProviders.some(
    (p) => p.provider === IdentityProvider.Evm
  )

  const {
    mutateAsync: addProvider,
    isLoading: isAddingProvider,
    error,
  } = useAddExternalProviderToIdentity({
    onError: () => {
      reset()
    },
  })
  useToastError(error, 'Failed to link EVM address')

  const hasTriedSigning = useRef(false)
  const signAndLinkEvmAddress = async (evmAddress: string) => {
    if (hasTriedSigning.current) return
    hasTriedSigning.current = true

    const grillAddress = useMyAccount.getState().address
    if (!grillAddress) {
      hasTriedSigning.current = false
      throw new Error('Grill address is not found')
    }

    try {
      setIsGettingMessage(true)
      const message = await getEvmLinkedIdentityMessageQuery.fetchQuery(
        client,
        evmAddress
      )
      setIsGettingMessage(false)
      const sig = await signMessageAsync({ message })

      await addProvider({
        externalProvider: {
          id: evmAddress,
          provider: SDKIdentityProvider.EVM,
          evmProofMsg: message,
          evmProofMsgSig: sig,
        },
      })
    } finally {
      hasTriedSigning.current = false
    }
  }

  const isLoading =
    !hasEvmProvider && (isGettingMessage || isSigning || isAddingProvider)

  return (
    <CustomConnectButton
      label='Connect'
      withWalletActionImage={false}
      size='sm'
      loadingText={isSigning ? 'Pending' : undefined}
      onSuccessConnect={async (evmAddress) => {
        sendEvent('add_provider_evm_clicked')
        signAndLinkEvmAddress(evmAddress)
      }}
      isLoading={isLoading}
    >
      Connect
    </CustomConnectButton>
  )
}

function FarcasterConnectButton() {
  const sendEvent = useSendEvent()
  const { loginNeynar, isLoadingOrSubmitted } = useNeynarLogin()
  return (
    <Button
      size='sm'
      onClick={() => {
        sendEvent('add_provider_farcaster_clicked')
        loginNeynar()
      }}
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
  const grillAddress = useMyGrillAddress()
  const { data: linkedIdentity, refetch } = getLinkedIdentityQuery.useQuery(
    grillAddress ?? ''
  )
  const router = useRouter()
  const linkedIdentityRef = useWrapInRef(linkedIdentity)
  const { mutate, isLoading } = useAddExternalProviderToIdentity({
    onSuccess: () => {
      signOut({ redirect: false })
      const intervalId = setInterval(async () => {
        if (linkedIdentityRef.current) {
          clearInterval(intervalId)
          return
        }

        const res = await refetch()
        if (res.data) {
          clearInterval(intervalId)
        }
      }, 2_000)
    },
  })

  useEffect(() => {
    const loginProvider = getUrlQuery('provider')
    if (loginProvider === provider && session && !calledRef.current) {
      calledRef.current = true
      router.replace(getCurrentUrlWithoutQuery('provider'), undefined, {
        shallow: true,
      })
      const externalProvider = getExternalProviderPayload(session)
      if (!externalProvider) {
        toast.error('Provider not supported')
        return
      }
      mutate({ externalProvider })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, session, mutate])

  return (
    <Button
      size='sm'
      isLoading={isRedirecting || isLoading}
      onClick={() => {
        setIsRedirecting(true)
        sendEvent(`add_provider_${provider}_clicked`)
        signIn(provider, {
          callbackUrl:
            getCurrentUrlWithoutQuery() +
            `?profile=linked-accounts&provider=${provider}`,
        })
      }}
    >
      Connect
    </Button>
  )
}
