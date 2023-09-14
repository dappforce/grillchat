import { getPostQuery } from '@/services/api/query'
import { useMyAccount } from '@/stores/my-account'

export default function useIsOwnerOfPost(postId: string, address?: string) {
  const { data: post } = getPostQuery.useQuery(postId)
  const myAddress = useMyAccount((state) => state.address)
  const usedAddress = address || myAddress

  return post && post?.struct.ownerId === usedAddress
}
