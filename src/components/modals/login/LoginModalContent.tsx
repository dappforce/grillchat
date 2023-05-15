import Button from '@/components/Button'
import TextArea from '@/components/inputs/TextArea'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import useLoginAndRequestToken from '@/hooks/useLoginAndRequestToken'
import useToastError from '@/hooks/useToastError'
import { ApiRequestTokenResponse } from '@/pages/api/request-token'
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { useLinkEvmAccount } from './linkEvmAccountHook'
import { _TypedDataEncoder } from '@ethersproject/hash'
import { decodeAddress } from '@polkadot/keyring'
import Logo from '@/components/Logo'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { CustomConnectButton } from './CustomConnectButton'
import { useMyAccount } from '@/stores/my-account'

export type LoginModalStep =
  | 'login'
  | 'enter-secret-key'
  | 'account-created'

type ContentProps = ModalFunctionalityProps & {
  setCurrentStep: Dispatch<SetStateAction<LoginModalStep>>
  currentStep: LoginModalStep
  onSubmit: (e: SyntheticEvent) => Promise<void>
  openModal: () => void
  runCaptcha: () => Promise<string | null>
  termsAndService: (className?: string) => JSX.Element
}

export const LoginContent = ({
  onSubmit,
  setCurrentStep,
  currentStep,
  runCaptcha,
  termsAndService,
  ...props
}: ContentProps) => {
  const [hasStartCaptcha, setHasStartCaptcha] = useState(false)

  const {
    mutateAsync: loginAndRequestToken,
    isLoading: loadingRequestToken,
    error,
  } = useLoginAndRequestToken()
  useToastError<ApiRequestTokenResponse>(
    error,
    'Create account failed',
    (e) => e.message
  )

  const isLoading = loadingRequestToken || hasStartCaptcha

  return (
    <div>
      <div className='w-full flex-col flex justify-center'>
        <Logo className='text-5xl mb-8' />
        <div className='flex flex-col gap-4'>
          <Button
            type='button'
            size='lg'
            className='w-full'
            isLoading={isLoading}
            onClick={async () => {
              setHasStartCaptcha(true)
              const token = await runCaptcha()
              if (!token) return
              setHasStartCaptcha(false)
              const newAddress = await loginAndRequestToken({ captchaToken: token })
              if(newAddress) {
                setCurrentStep('account-created')
              }
              // props.closeModal()
            }}
          >
            Create an account
          </Button>
          <Button
            onClick={() => setCurrentStep('enter-secret-key')}
            variant='primaryOutline'
            size='lg'
          >
            Enter Grill secret key
          </Button>
          {termsAndService('mt-4')}
        </div>
      </div>
    </div>
  )
}

export const EnterSecretKeyContent = ({ onSubmit }: ContentProps) => {
  const [privateKey, setPrivateKey] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  return (
    <form onSubmit={onSubmit} className='mt-2 flex flex-col gap-4'>
      <TextArea
        ref={inputRef}
        value={privateKey}
        rows={3}
        size='sm'
        className='bg-background'
        onChange={(e) => setPrivateKey((e.target as HTMLTextAreaElement).value)}
        placeholder='Enter your Grill secret key'
      />
      <Button disabled={!privateKey} size='lg'>
        Login
      </Button>
    </form>
  )
}

function buildMsgParams(evmAddress: string, substrateAddress: Uint8Array) {
  const domain = {
    name: 'SubSocial Evm Address Linkage',
    version: '1',
    salt: '0x1333ee260a234d3a246b85239e279bbdc7618db7188f2dd73f7322963fcd4d02',
  }

  const types = {
    Transaction: [
      { name: 'transactionName', type: 'string' },
      { name: 'substrateAddress', type: 'bytes' },
      { name: 'evmAddress', type: 'bytes' },
    ],
  }

  const value = {
    transactionName: 'LinkEvmAddress',
    substrateAddress,
    evmAddress,
  }

  return JSON.stringify(_TypedDataEncoder.getPayload(domain, types, value))
}

export const AccountCreatedContent = () => {
  const { address: evmAddress, connector } = useAccount()
  const { mutate: linkAccount, error: linkEvmError } = useLinkEvmAccount()

  const myAddress = useMyAccount((state) => state.address)
  const {
    data,
    error: singProofError,
    isLoading,
    signMessage,
    variables,
  } = useSignMessage()

  const signMesageForLinkAccount = () => {
    if(!evmAddress) return

    const decodedAddress = decodeAddress(myAddress)
    const message = buildMsgParams(evmAddress, decodedAddress)
    signMessage({ message })
  }

  useEffect(() => {
    if(evmAddress) {
      signMesageForLinkAccount()
    }
  }, [evmAddress])


  useEffect(() => {
    if (!isLoading && data) {
      console.log(isLoading, data)

      linkAccount({
        evmAccount: evmAddress as string,
        evmSignature: data,
      })
    }
  }, [isLoading, data])


  return <div className='w-full'>
    <CustomConnectButton className='w-full' />
  </div>
}

type LoginModalContents = {
  [key in LoginModalStep]: (props: ContentProps) => JSX.Element
}

export const loginModalContents: LoginModalContents = {
  login: LoginContent,
  'enter-secret-key': EnterSecretKeyContent,
  'account-created': AccountCreatedContent
}
