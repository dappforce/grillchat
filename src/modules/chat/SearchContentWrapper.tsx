import ChatPreviewList from '@/components/chats/ChatPreviewList'
import ChatPreviewSkeleton from '@/components/chats/ChatPreviewSkeleton'
import ChatSpecialButtons from '@/components/chats/ChatSpecialButtons'
import NoChatsFound from '@/components/chats/NoChatsFound'
import useIsInIframe from '@/hooks/useIsInIframe'
import useSearch from '@/hooks/useSearch'
import { getPostsBySpaceContentQuery } from '@/services/subsocial/posts'

export type SearchContentWrapperProps = {
  children: JSX.Element
  search: string
  showSpecialButtons?: boolean
  isIntegrateChatButtonOnTop?: boolean
  getFocusedElementIndex: ReturnType<typeof useSearch>['getFocusedElementIndex']
}

export default function SearchContentWrapper({
  isIntegrateChatButtonOnTop,
  children,
  search,
  showSpecialButtons,
  getFocusedElementIndex,
}: SearchContentWrapperProps) {
  const isInIframe = useIsInIframe()
  const { data: searchResults, isLoading } =
    getPostsBySpaceContentQuery.useQuery(search)

  if (!search) {
    return (
      <div className='flex flex-col'>
        {showSpecialButtons && !isInIframe && (
          <ChatSpecialButtons
            isIntegrateChatButtonOnTop={!!isIntegrateChatButtonOnTop}
          />
        )}
        {children}
      </div>
    )
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
