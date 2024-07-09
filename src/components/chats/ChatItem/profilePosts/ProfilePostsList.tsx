import Container from '@/components/Container'
import Loading from '@/components/Loading'
import ScrollableContainer from '@/components/ScrollableContainer'
import useAuthorizedForModeration from '@/hooks/useAuthorizedForModeration'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { getPostQuery } from '@/services/api/query'
import { getPostMetadataQuery } from '@/services/datahub/posts/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { sendMessageToParentWindow } from '@/utils/window'
import { ComponentProps, Fragment, useEffect, useId, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import CenterChatNotice from '../../ChatList/CenterChatNotice'
import ChatItemWithMenu from '../../ChatList/ChatItemWithMenu'
import ChatTopNotice from '../../ChatList/ChatTopNotice'
import { usePaginatedMessageIdsByAccount } from '../../hooks/usePaginatedMessageIds'

export type ChatListProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollContainerRef?: React.RefObject<HTMLDivElement>
  scrollableContainerClassName?: string
  address: string
  hubId: string
  chatId: string
  newMessageNoticeClassName?: string
  topElement?: React.ReactNode
}

export default function ProfilePostsList(props: ChatListProps) {
  const isInitialized = useMyAccount((state) => state.isInitialized)

  return (
    <ProfilePostsListContent
      key={props.chatId}
      {...props}
      className={cx(!isInitialized && 'opacity-0', props.className)}
    />
  )
}

// If using bigger threshold, the scroll will be janky, but if using 0 threshold, it sometimes won't trigger `next` callback
const SCROLL_THRESHOLD = 20

function ProfilePostsListContent({
  asContainer,
  scrollableContainerClassName,
  hubId,
  address,
  chatId,
  scrollContainerRef: _scrollContainerRef,
  newMessageNoticeClassName,
  ...props
}: ChatListProps) {
  const sendEvent = useSendEvent()
  const { enableBackButton } = useConfigContext()
  const { data: postMetadata } = getPostMetadataQuery.useQuery(chatId)

  const scrollableContainerId = useId()

  const innerScrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = _scrollContainerRef || innerScrollContainerRef

  const innerRef = useRef<HTMLDivElement>(null)

  const { isAuthorized } = useAuthorizedForModeration(chatId)

  const { messageIds, hasMore, loadMore, totalDataCount, currentPage } =
    usePaginatedMessageIdsByAccount({
      hubId,
      chatId,
      account: address,
      isModerator: isAuthorized,
    })

  useEffect(() => {
    sendMessageToParentWindow('totalMessage', (totalDataCount ?? 0).toString())
  }, [totalDataCount])

  const myAddress = useMyMainAddress()
  const { data: chat } = getPostQuery.useQuery(chatId)
  const isMyChat = chat?.struct.ownerId === myAddress

  const Component = asContainer ? Container<'div'> : 'div'

  const renderedMessageQueries = getPostQuery.useQueries(messageIds)

  return (
    <div
      {...props}
      className={cx(
        'relative flex w-full flex-1 flex-col overflow-hidden',
        props.className
      )}
    >
      {totalDataCount === 0 && (
        <CenterChatNotice
          isMyChat={isMyChat}
          customText={
            (postMetadata?.totalCommentsCount ?? 0) > 0
              ? 'Loading messages...'
              : undefined
          }
          className='absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2'
        />
      )}
      <ScrollableContainer
        id={scrollableContainerId}
        ref={scrollContainerRef}
        className={cx(
          'flex flex-col-reverse overflow-x-hidden overflow-y-scroll @container',
          scrollableContainerClassName
        )}
      >
        <Component
          ref={innerRef}
          className={cx(enableBackButton === false && 'px-0', 'flex')}
        >
          <div className='flex-1'>
            <InfiniteScroll
              dataLength={renderedMessageQueries.length}
              next={() => {
                loadMore()
                sendEvent('load_more_messages', { currentPage })
              }}
              className={cx(
                'relative flex w-full flex-col-reverse !overflow-hidden pb-2',
                // need to have enough room to open message menu
                'min-h-[400px]'
              )}
              hasMore={hasMore}
              inverse
              scrollableTarget={scrollableContainerId}
              loader={<Loading className='pb-2 pt-4' />}
              endMessage={
                renderedMessageQueries.length === 0 ? null : (
                  <ChatTopNotice
                    className='pb-2 pt-4'
                    label='You have reached the first message of this user!'
                  />
                )
              }
              scrollThreshold={`${SCROLL_THRESHOLD}px`}
            >
              {renderedMessageQueries.map(({ data: message }, index) => {
                // bottom message is the first element, because the flex direction is reversed
                if (!message) return null

                return (
                  <Fragment key={message?.id ?? index}>
                    <ChatItemWithMenu
                      chatItemClassName='mt-2'
                      chatId={chatId}
                      hubId={hubId}
                      message={message}
                      enableProfileModal={false}
                      showBlockedMessage={isAuthorized}
                    />
                  </Fragment>
                )
              })}
            </InfiniteScroll>
          </div>
        </Component>
      </ScrollableContainer>
    </div>
  )
}
