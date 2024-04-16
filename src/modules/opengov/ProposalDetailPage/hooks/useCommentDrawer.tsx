import usePaginatedMessageIds from '@/components/chats/hooks/usePaginatedMessageIds'
import { env } from '@/env.mjs'
import { Proposal } from '@/server/opengov/mapper'
import { getCurrentUrlWithoutQuery, getUrlQuery } from '@/utils/links'
import { replaceUrl } from '@/utils/window'
import { useEffect, useState } from 'react'

function getIsDirectlyOpeningDrawer() {
  return getUrlQuery('chat') === 'true'
}

export type CommentDrawerTab = 'grill' | 'others'

export default function useCommentDrawer(proposal: Proposal) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<CommentDrawerTab>('grill')

  const { allIds, isLoading } = usePaginatedMessageIds({
    chatId: proposal.chatId ?? '',
    hubId: env.NEXT_PUBLIC_PROPOSALS_HUB,
  })
  const hasGrillComments = !isLoading && allIds.length > 0
  const shouldDisplayExternalSourceAsDefault =
    !hasGrillComments && !!proposal.comments.length

  useEffect(() => {
    const shouldOpenDrawer = getIsDirectlyOpeningDrawer()
    if (shouldOpenDrawer) {
      setIsOpen(true)
      replaceUrl(getCurrentUrlWithoutQuery('chat'))
    }
  }, [])

  useEffect(() => {
    const isDirectlyOpeningDrawer = getIsDirectlyOpeningDrawer()
    if (isOpen && !isLoading && !isDirectlyOpeningDrawer) {
      setSelectedTab(shouldDisplayExternalSourceAsDefault ? 'others' : 'grill')
    }
  }, [shouldDisplayExternalSourceAsDefault, isOpen, isLoading])

  return {
    isOpen,
    setIsOpen,
    selectedTab,
    setSelectedTab,
    allIds,
    isLoading,
  }
}
