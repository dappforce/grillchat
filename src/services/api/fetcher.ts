import { ApiIdentitiesResponse } from '@/pages/api/identities'
import { ApiPostsResponse } from '@/pages/api/posts'
import { ApiProfilesResponse } from '@/pages/api/profiles'
import axios from 'axios'

export async function getPosts(postIds: string[]) {
  const requestedIds = postIds.filter((id) => !!id)
  if (requestedIds.length === 0) return []
  const res = await axios.get(
    '/api/posts?' + requestedIds.map((n) => `postIds=${n}`).join('&')
  )
  return (res.data as ApiPostsResponse).data ?? []
}

export async function getProfiles(addresses: string[]) {
  const requestedIds = addresses.filter((id) => !!id)
  if (requestedIds.length === 0) return []
  const res = await axios.get(
    '/api/profiles?' + requestedIds.map((n) => `addresses=${n}`).join('&')
  )
  return (res.data as ApiProfilesResponse).data ?? []
}

export async function getIdentities(addresses: string[]) {
  const requestedAddresses = addresses.filter((id) => !!id)
  if (requestedAddresses.length === 0) return []
  const res = await axios.get(
    '/api/identities?' +
      requestedAddresses.map((n) => `addresses=${n}`).join('&')
  )
  return (res.data as ApiIdentitiesResponse).data ?? []
}
