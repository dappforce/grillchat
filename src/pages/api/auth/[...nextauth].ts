import { env } from '@/env.mjs'
import { getLinkedIdentityFromTwitterId } from '@/services/datahub/identity/fetcher'
import { getBlockedResources } from '@/services/datahub/moderation/query'
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import type { NextAuthOptions } from 'next-auth'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import TwitterProvider from 'next-auth/providers/twitter'

declare module 'next-auth' {
  interface Session {
    provider: 'google' | 'twitter'
  }
}

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  providers: [
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      version: '2.0',
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/?auth=true',
  },
  callbacks: {
    async signIn({ user }) {
      const [{ blockedInAppIds }, linkedAddresses] = await Promise.all([
        getBlockedResources({
          appIds: [env.NEXT_PUBLIC_APP_ID],
          postEntityIds: [],
          spaceIds: [],
        }),
        getLinkedIdentityFromTwitterId(user.id),
      ])
      const blockedAddressesSet = new Set(
        blockedInAppIds.map((data) => data.blockedResources.address).flat()
      )
      const blockedAddress = linkedAddresses.find((address) =>
        blockedAddressesSet.has(address)
      )

      if (!blockedAddress) return true
      return `/?auth-blocked=${blockedAddress}`
    },
    async jwt(all) {
      const { account, token } = all
      if (account) {
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      let image = session.user.image ?? ''
      image = image.replace('_normal', '')
      return {
        ...session,
        user: { ...session.user, image, id: token.sub! },
        provider: token.provider,
      }
    },
  },
}

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions)
}

export default NextAuth(authOptions)
