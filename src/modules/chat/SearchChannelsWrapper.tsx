import ChatPreviewList from '@/components/chats/ChatPreviewList'
import ChatPreviewSkeleton from '@/components/chats/ChatPreviewSkeleton'
import NoChatsFound from '@/components/chats/NoChatsFound'
import useDebounce from '@/hooks/useDebounce'
import useSearch from '@/hooks/useSearch'
import { getPostsBySpaceContentQuery } from '@/services/subsocial/posts'
import { removeDoubleSpaces } from '@/utils/strings'
import { PostData } from '@subsocial/api/types'
import { matchSorter } from 'match-sorter'

export type SearchChannelsWrapperProps = {
  children: JSX.Element
  search: string
  getFocusedElementIndex: ReturnType<typeof useSearch>['getFocusedElementIndex']
  localSearch?: {
    data: (PostData | null | undefined)[]
    searchKeys: string[]
  }
}

export default function SearchChannelsWrapper({
  children,
  search,
  getFocusedElementIndex,
  localSearch,
}: SearchChannelsWrapperProps) {
  const cleanedSearch = removeDoubleSpaces(search)

  const debouncedSearch = useDebounce(cleanedSearch)
  const { data: searchResults, isLoading } =
    getPostsBySpaceContentQuery.useQuery(cleanedSearch, {
      enabled: !localSearch && cleanedSearch === debouncedSearch,
    })

  let usedSearchResults = searchResults
  if (localSearch) {
    const filteredData = (localSearch.data?.filter(Boolean) ?? []) as PostData[]
    usedSearchResults = matchSorter(filteredData, cleanedSearch, {
      keys: localSearch.searchKeys,
    })
  }

  if (!cleanedSearch) {
    return <div className='flex flex-col'>{children}</div>
  }

  if (!localSearch && isLoading) return <ChatPreviewSkeleton.SkeletonList />

  if (!usedSearchResults || usedSearchResults.length === 0) {
    return <NoChatsFound search={search} />
  }

  return (
    <ChatPreviewList
      chats={usedSearchResults}
      focusedElementIndex={getFocusedElementIndex(usedSearchResults)}
    />
  )
}
