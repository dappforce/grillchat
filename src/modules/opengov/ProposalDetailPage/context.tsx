import { env } from '@/env.mjs'
import useToastError from '@/hooks/useToastError'
import { Proposal } from '@/server/opengov/mapper'
import { useCreateDiscussion } from '@/services/api/mutation'
import { Resource } from '@subsocial/resource-discussions'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

const ProposalDetailContext = createContext<{
  chatId: string
  isLoading: boolean
  createDiscussion: () => void
}>({ chatId: '', createDiscussion: () => undefined, isLoading: false })

export function getProposalResourceId(proposalId: number | string) {
  return new Resource({
    chainName: 'polkadot',
    chainType: 'substrate',
    resourceType: 'proposal',
    resourceValue: {
      id: proposalId.toString(),
    },
    schema: 'chain',
  }).toResourceId()
}

export function ProposalDetailContextProvider({
  proposal,
  children,
}: {
  proposal: Proposal
  children: React.ReactNode
}) {
  const [usedChatId, setUsedChatId] = useState(proposal.chatId ?? '')

  const { mutateAsync, error, isLoading } = useCreateDiscussion()
  useToastError(error, 'Failed to create discussion')

  const createDiscussion = async function () {
    const { data } = await mutateAsync({
      spaceId: env.NEXT_PUBLIC_PROPOSALS_HUB,
      content: {
        title: proposal.title,
      },
      resourceId: getProposalResourceId(proposal.id),
    })
    if (data?.postId) {
      setUsedChatId(data.postId)
    }
  }

  const hasSent = useRef<boolean>()
  useEffect(() => {
    if (!usedChatId && !hasSent.current) {
      hasSent.current = true
      createDiscussion()
    }
  }, [])

  return (
    <ProposalDetailContext.Provider
      value={{ isLoading, chatId: usedChatId, createDiscussion }}
    >
      {children}
    </ProposalDetailContext.Provider>
  )
}

export function useProposalDetailContext() {
  return useContext(ProposalDetailContext)
}
