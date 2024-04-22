import { getNeynarApi } from '../external'

export type NeynarUser = {
  fid: number
  custody_address: string
  username: string
  display_name: string
  pfp_url: string
  profile: { bio: { text: string } }
  follower_count: number
  following_count: number
  verifications: string[]
  verified_addresses: {
    eth_addresses: string[]
  }
  active_status: string
  power_badge: boolean
}

export async function getUserByFid(fid: number | string) {
  const res = await getNeynarApi().get('/farcaster/user/bulk', {
    params: {
      fids: fid,
    },
  })
  const user = res.data.users[0] as NeynarUser
  return user
}
