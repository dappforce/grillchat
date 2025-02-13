import Button from '@/components/Button'
import { env } from '@/env.mjs'
import useToastError from '@/hooks/useToastError'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { getDeterministicId } from '@/services/datahub/posts/mutation'
import { useUpsertPost } from '@/services/subsocial/posts/mutation'
import { useMyMainAddress } from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { getChatPageLink, getUrlQuery } from '@/utils/links'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ChatPage, { ChatPageProps } from './ChatPage'

export default function StubChatPage() {
  const { customTexts } = useConfigContext()
  const myAddress = useMyMainAddress()
  const [newChatId, setNewChatId] = useState<string | null>(null)
  const setSubscriptionState = useSubscriptionState(
    (state) => state.setSubscriptionState
  )

  const { mutateAsync, error, isLoading } = useUpsertPost({
    onSuccess: async (_, data) => {
      if (!myAddress || !('spaceId' in data)) return

      setSubscriptionState('post', 'always-sub')
      const chatId = await getDeterministicId({
        account: myAddress,
        timestamp: data.timestamp.toString(),
        uuid: data.uuid,
      })

      setNewChatId(chatId)
    },
  })
  useToastError(
    error,
    'Failed to create discussion',
    (response: any) => response.message
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
    const hubId = env.NEXT_PUBLIC_RESOURCES_ID as string
    if (!router.isReady || !hubId) return

    const resourceId = router.query.resourceId as string

    const metadata = getMetadataFromUrl()

    console.log(metadata, resourceId, hubId)

    if (!metadata || !resourceId || !hubId) {
      router.replace('/')
      return
    }
    setParams({ metadata, hubId, resourceId })
  }, [router])

  useEffect(() => {
    if (newChatId) {
      router.replace(
        getChatPageLink(router, newChatId, env.NEXT_PUBLIC_RESOURCES_ID)
      )
    }
  }, [newChatId, router])

  const createDiscussion = async function () {
    const { hubId, metadata, resourceId } = params

    await mutateAsync({
      spaceId: hubId ?? '',
      timestamp: Date.now(),
      uuid: crypto.randomUUID(),
      resource: resourceId,
      ...metadata,
    })
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
