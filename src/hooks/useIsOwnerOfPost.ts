import { getPostQuery } from '@/services/api/query'
import { useMyMainAddress } from '@/stores/my-account'

export default function useIsOwnerOfPost(postId: string, address?: string) {
  const { data: post } = getPostQuery.useQuery(postId)
  const myAddress = useMyMainAddress()
  const usedAddress = address || myAddress

  return post && post?.struct.ownerId === usedAddress
}
