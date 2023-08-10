import { getPostQuery } from '@/services/api/query'
import { useMyAccount } from '@/stores/my-account'

export default function useIsOwnerOfPost(postId: string) {
  const { data: post } = getPostQuery.useQuery(postId)
  const myAddress = useMyAccount((state) => state.address)

  return post?.struct.ownerId === myAddress
}
