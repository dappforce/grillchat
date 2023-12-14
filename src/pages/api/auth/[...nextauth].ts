import { getLinkedIdentityFromTwitterId } from '@/services/datahub/identity/fetcher'
import { getBlockedResources } from '@/services/datahub/moderation/query'
import { getAppId } from '@/utils/env/client'
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import type { NextAuthOptions } from 'next-auth'
import NextAuth, { getServerSession } from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? '',
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID ?? '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET ?? '',
      version: '2.0',
    }),
  ],
  pages: {
    signIn: '/?auth=true',
  },
  callbacks: {
    async signIn({ user }) {
      const [{ blockedInAppIds }, linkedAddresses] = await Promise.all([
        getBlockedResources({
          appIds: [getAppId()],
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
    async session({ session, token }) {
      let image = session.user.image ?? ''
      image = image.replace('_normal', '')
      return { ...session, user: { ...session.user, image, id: token.sub! } }
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
