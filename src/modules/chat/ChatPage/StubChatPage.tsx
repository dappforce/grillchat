import Button from '@/components/Button'
import { getHubIdFromAlias } from '@/constants/hubs'
import useToastError from '@/hooks/useToastError'
import { ApiDiscussionResponse } from '@/pages/api/discussion'
import { useConfigContext } from '@/providers/ConfigProvider'
import { useCreateDiscussion } from '@/services/api/mutation'
import { getChatPageLink, getUrlQuery } from '@/utils/links'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ChatPage, { ChatPageProps } from './ChatPage'

export default function StubChatPage() {
  const { customTexts } = useConfigContext()
  const { mutateAsync, error, isLoading } = useCreateDiscussion()
  useToastError<ApiDiscussionResponse>(
    error,
    'Failed to create discussion',
    (response) => response.message
  )

  const [params, setParams] = useState<{
    metadata: NonNullable<ChatPageProps['stubMetadata']>
    hubId: string
    resourceId: string
  }>({
    metadata: {
      body: '',
      image: '',
      title: '',
    },
    hubId: '',
    resourceId: '',
  })

  const router = useRouter()
  useEffect(() => {
    const hubIdOrAlias = router.query.hubId as string
    if (!router.isReady || !hubIdOrAlias) return

    const hubId = getHubIdFromAlias(hubIdOrAlias) || hubIdOrAlias
    const resourceId = router.query.resourceId as string

    const metadata = getMetadataFromUrl()

    if (!metadata || !resourceId || !hubId) {
      router.replace('/')
      return
    }
    setParams({ metadata, hubId, resourceId })
  }, [router])

  const createDiscussion = async function () {
    const { hubId, metadata, resourceId } = params

    const { data } = await mutateAsync({
      spaceId: hubId,
      content: metadata,
      resourceId,
    })
    if (!data?.postId) {
      router.replace('/')
      return
    }

    router.replace(getChatPageLink(router, data?.postId))
  }

  return (
    <ChatPage
      hubId=''
      stubMetadata={params.metadata}
      customAction={
        <Button
          size='lg'
          onClick={createDiscussion}
          isLoading={isLoading || !params.resourceId}
        >
          {customTexts?.createChannelButton ?? 'Start Discussion'}
        </Button>
      }
    />
  )
}

function getMetadataFromUrl() {
  const metadata = decodeURIComponent(getUrlQuery('metadata'))
  const parsedMetadata = metadata ? (JSON.parse(metadata) as any) : undefined
  return parsedMetadata
}
