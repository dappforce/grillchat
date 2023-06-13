import ChatPreviewList from '@/components/chats/ChatPreviewList'
import ChatPreviewSkeleton from '@/components/chats/ChatPreviewSkeleton'
import NoChatsFound from '@/components/chats/NoChatsFound'
import useDebounce from '@/hooks/useDebounce'
import useSearch from '@/hooks/useSearch'
import { getPostsBySpaceContentQuery } from '@/services/subsocial/posts'

export type SearchChannelsWrapperProps = {
  children: JSX.Element
  search: string
  getFocusedElementIndex: ReturnType<typeof useSearch>['getFocusedElementIndex']
}

export default function SearchChannelsWrapper({
  children,
  search,
  getFocusedElementIndex,
}: SearchChannelsWrapperProps) {
  const debouncedSearch = useDebounce(search)
  const { data: searchResults, isLoading } =
    getPostsBySpaceContentQuery.useQuery(search, {
      enabled: search === debouncedSearch,
    })

  if (!search) {
    return <div className='flex flex-col'>{children}</div>
  }

  if (isLoading) return <ChatPreviewSkeleton.SkeletonList />

  if (!searchResults || searchResults.length === 0) {
    return <NoChatsFound search={search} />
  }

  return (
    <ChatPreviewList
      chats={searchResults}
      focusedElementIndex={getFocusedElementIndex(searchResults)}
    />
  )
}
