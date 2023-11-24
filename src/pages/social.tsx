import DefaultLayout from '@/components/layouts/DefaultLayout'
import { useLinkIdentity } from '@/services/subsocial/datahub/posts/mutation'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { IdentityProvider } from '@subsocial/data-hub-sdk'
import { signIn, signOut, useSession } from 'next-auth/react'

function Component() {
  const { data: session } = useSession()
  const address = useMyMainAddress()
  const loginAsTemporaryAccount = useMyAccount(
    (state) => state.loginAsTemporaryAccount
  )

  const { mutate: link } = useLinkIdentity({
    onSuccess: () => window.alert('Successfully linked'),
    onError: (error) => window.alert(error),
  })
  if (session) {
    return (
      <>
        Signed in as {JSON.stringify(session.user)}::::{address} <br />
        <button
          onClick={async () => {
            !address && (await loginAsTemporaryAccount())
            link({
              // @ts-ignore
              external_id: session?.user.id!,
              provider: IdentityProvider.TWITTER,
            })
          }}
        >
          Link for datahub
        </button>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button
        onClick={() =>
          signIn('twitter', {
            callbackUrl: `/social`,
          })
        }
      >
        Sign in
      </button>
    </>
  )
}

export default function Social() {
  return (
    <DefaultLayout>
      <Component />
    </DefaultLayout>
  )
}
