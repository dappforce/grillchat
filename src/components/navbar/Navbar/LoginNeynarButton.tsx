import { env } from '@/env.mjs'
import Script from 'next/script'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    onSignInSuccess?: (data: { signer_uuid: string; fid: string }) => void
  }
}
export default function LoginNeynarButton() {
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    window.onSignInSuccess = (data) => {
      console.log('SIGNIN SUCCESS', data)
      setUser({
        signerUuid: data.signer_uuid,
        fid: data.fid,
      })
    }

    return () => {
      delete window.onSignInSuccess // Clean up the global callback
    }
  }, [])

  console.log(user, env.NEXT_PUBLIC_NEYNAR_CLIENT_ID)

  return (
    <>
      <Script src='https://neynarxyz.github.io/siwn/raw/1.2.0/index.js' async />
      <div
        className='neynar_signin [&>button]:!min-w-[auto]'
        data-client_id={env.NEXT_PUBLIC_NEYNAR_CLIENT_ID}
        data-height='38px'
        data-font_size='14px'
        data-border_radius='50px'
        data-logo_size='24px'
        data-width='190px'
        data-success-callback='onSignInSuccess'
        data-theme='dark'
        data-background_color='#4287f5'
      />
    </>
  )
}
