import Button from '@/components/Button'
import { cx } from '@/utils/class-names'
import { getCurrentUrlWithoutQuery, getUrlQuery } from '@/utils/links'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { IoLogoGoogle } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import { SiEthereum } from 'react-icons/si'
import { LoginModalContentProps } from '../LoginModalContent'

export default function NewAccountContent({
  setCurrentState,
}: LoginModalContentProps) {
  return (
    <div className='flex flex-col gap-4'>
      <GoogleButton />
      <XLoginButton />
      <Button
        size='lg'
        variant='primaryOutline'
        onClick={() => {
          setCurrentState('evm-address-link')
        }}
      >
        <div className='flex items-center justify-center gap-2'>
          <SiEthereum className={cx('text-[20px] text-text-muted')} />
          Connect Wallet
        </div>
      </Button>
      <div className='relative text-center text-text-muted'>
        <div className='absolute top-1/2 h-px w-full bg-background-lightest dark:bg-background-lightest/50' />
        <span className='relative inline-block bg-background-light px-4 text-sm'>
          OR
        </span>
      </div>
      <Button
        size='lg'
        variant='primaryOutline'
        onClick={() => setCurrentState('login')}
      >
        <div className='flex flex-col items-center justify-center'>
          <span>I already have an account</span>
          <span className='text-sm text-text-muted'>
            Grill key or Polkadot wallet
          </span>
        </div>
      </Button>
    </div>
  )
}

function GoogleButton() {
  const [loading, setLoading] = useState(false)
  return (
    <Button
      size='lg'
      isLoading={loading}
      onClick={() => {
        setLoading(true)
        signIn('google', {
          callbackUrl: `${getCurrentUrlWithoutQuery()}?login=google&from=${getUrlQuery(
            'from'
          )}`,
        })
      }}
    >
      <div className='flex items-center justify-center gap-2'>
        <IoLogoGoogle
          className={cx('text-[20px] text-text-muted-on-primary')}
        />
        Connect with Google
      </div>
    </Button>
  )
}

function XLoginButton() {
  const [loading, setLoading] = useState(false)
  return (
    <Button
      size='lg'
      variant='primaryOutline'
      isLoading={loading}
      onClick={() => {
        setLoading(true)
        signIn('twitter', {
          callbackUrl: `${getCurrentUrlWithoutQuery()}?login=x&from=${getUrlQuery(
            'from'
          )}`,
        })
      }}
    >
      <div className='flex items-center justify-center gap-2'>
        <RiTwitterXLine className={cx('text-[20px] text-text-muted')} />
        Connect with X
      </div>
    </Button>
  )
}
