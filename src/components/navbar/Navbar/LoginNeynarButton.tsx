import MenuList from '@/components/MenuList'
import Modal from '@/components/modals/Modal'
import { env } from '@/env.mjs'
import { NeynarUser, getUserByFid } from '@/services/auth/query'
import { useMyAccount } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import Script from 'next/script'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    onSignInSuccess?: (data: { signer_uuid: string; fid: string }) => void
  }
}
export default function LoginNeynarButton() {
  const [user, setUser] = useState<NeynarUser | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const loginAsTemporaryAccount = useMyAccount.use.loginAsTemporaryAccount()
  const saveProxyAddress = useMyAccount.use.saveProxyAddress()
  useEffect(() => {
    window.onSignInSuccess = async (data) => {
      const [user] = await Promise.all([
        getUserByFid(data.fid),
        loginAsTemporaryAccount(),
        // get linked identity
      ] as const)

      // if linkedidentity exist, just get the verified address from there and saveProxyAddress
      // else, open modal
      setUser(user)
    }

    return () => {
      delete window.onSignInSuccess
    }
  }, [loginAsTemporaryAccount])

  const isLoading = true

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
      <Modal
        title='Please choose the account to connect to'
        description='You have multiple accounts connected to this fid'
        closeModal={() => setIsOpen(false)}
        isOpen={isOpen}
      >
        <MenuList
          className={cx('py-0', isLoading && 'animate-pulse')}
          menus={
            user?.verified_addresses.eth_addresses.map((addr) => ({
              text: (
                <span className='flex flex-1 items-center justify-between gap-4'>
                  <span className='whitespace-nowrap font-mono text-text-muted'>
                    {truncateAddress(addr)}
                  </span>
                </span>
              ),
              disabled: isLoading,
              onClick: async () => {
                // link identity, and create profile
                saveProxyAddress(addr)
                setIsOpen(false)
              },
            })) ?? []
          }
        />
      </Modal>
    </>
  )
}
