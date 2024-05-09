import LinkedEvmAddressImage from '@/assets/graphics/linked-evm-address.png'
import Button from '@/components/Button'
import { Identity } from '@/services/datahub/identity/fetcher'
import { useLinkIdentity } from '@/services/datahub/identity/mutation'
import {
  getEvmLinkedIdentityMessageQuery,
  getLinkedIdentityQuery,
} from '@/services/datahub/identity/query'
import { useMyAccount, useMyGrillAddress } from '@/stores/my-account'
import { openNewWindow, twitterShareUrl } from '@/utils/social-share'
import { IdentityProvider } from '@subsocial/data-hub-sdk'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useSignMessage } from 'wagmi'
import { CustomConnectButton } from './CustomConnectButton'

type CommonEVMLoginErrorProps = {
  onFinishSignMessage?: () => void
  onSuccess?: (linkedIdentity: Identity) => void | Promise<void>
  onError?: () => void
  beforeSignEvmAddress?: () => Promise<void>
  isLoading?: boolean
  buttonLabel?: string
}

export const CommonEVMLoginContent = ({
  buttonLabel,
  onFinishSignMessage,
  onSuccess,
  onError,
  beforeSignEvmAddress,
  isLoading: _isLoading,
}: CommonEVMLoginErrorProps) => {
  const client = useQueryClient()
  const [isGettingMessage, setIsGettingMessage] = useState(false)
  const {
    signMessageAsync,
    isLoading: isSigning,
    isSuccess: isSigned,
    reset,
  } = useSignMessage()
  const grillAddress = useMyGrillAddress()
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    grillAddress ?? ''
  )
  const {
    mutateAsync: linkIdentity,
    isLoading,
    isSuccess,
  } = useLinkIdentity({
    onError: () => {
      reset()
      onError?.()
    },
  })

  useEffect(() => {
    if (linkedIdentity) {
      const res = onSuccess?.(linkedIdentity)
      if (res) {
        res.then(() => reset())
      } else {
        reset()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedIdentity])

  const isCalledRef = useRef(false)
  const signAndLinkEvmAddress = async (evmAddress: string) => {
    if (isCalledRef.current) return
    isCalledRef.current = true

    try {
      await beforeSignEvmAddress?.()
      const grillAddress = useMyAccount.getState().address
      if (!grillAddress) {
        throw new Error('Grill address is not found')
      }

      setIsGettingMessage(true)
      const message = await getEvmLinkedIdentityMessageQuery.fetchQuery(
        client,
        evmAddress
      )
      setIsGettingMessage(false)
      const sig = await signMessageAsync({ message })

      onFinishSignMessage?.()

      await linkIdentity({
        externalProvider: {
          id: evmAddress,
          provider: IdentityProvider.EVM,
          evmProofMsg: message,
          evmProofMsgSig: sig,
        },
      })
    } finally {
      isCalledRef.current = false
    }
  }

  return (
    <CustomConnectButton
      isLoading={
        _isLoading || isLoading || isSigning || isSuccess || isGettingMessage
      }
      onSuccessConnect={signAndLinkEvmAddress}
      className='w-full'
      label={buttonLabel}
      secondLabel='Sign Message'
      loadingText={!isSigned ? 'Pending Confirmation...' : 'Please wait...'}
    />
  )
}

export const CommonEvmAddressLinked = () => {
  const twitterUrl = twitterShareUrl(
    'https://grill.chat',
    `I just linked my #EVM wallet to GrillApp.net! Now, I can have a consistent identity and take advantage of new features such as interacting with #ERC20, #NFT, and other smart contracts 🥳`,
    { tags: ['Ethereum', 'Grillchat', 'Subsocial'] }
  )

  return (
    <div className='flex flex-col items-center gap-6'>
      <Image
        src={LinkedEvmAddressImage}
        alt=''
        className='w-full max-w-[260px]'
      />
      <Button
        size={'lg'}
        variant='primary'
        onClick={() => openNewWindow(twitterUrl)}
        className='w-full'
      >
        Post about it on X!
      </Button>
    </div>
  )
}
