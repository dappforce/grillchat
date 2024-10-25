import { linkIdentity } from '@/server/datahub-queue/identity'
import {
  datahubQueryRequest,
  datahubSubscription,
} from '@/services/datahub/utils'
import { generateManuallyTriggeredPromise } from '@/utils/promise'
import {
  DataHubSubscriptionEventEnum,
  SocialEventDataApiInput,
} from '@subsocial/data-hub-sdk'
import { gql } from 'graphql-request'

const sessionCallbacks: Map<string, (address: string) => void> = new Map()

const SUBSCRIBE_LINKING_IDENTITY = gql`
  subscription SubscribeLinkingIdentity {
    linkedIdentitySubscription {
      event
      entity {
        session {
          id
          linkedIdentity {
            id
          }
        }
      }
    }
  }
`
let isActive = false
function subscribeToLinkingIdentity() {
  if (isActive) return false
  isActive = true

  const client = datahubSubscription()
  let unsub = client.subscribe<{
    linkedIdentitySubscription: {
      event: DataHubSubscriptionEventEnum
      entity: {
        session: {
          id: string
          linkedIdentity: {
            id: string
          }
        }
      }
    }
  }>(
    {
      query: SUBSCRIBE_LINKING_IDENTITY,
    },
    {
      complete: () => undefined,
      next: async (data) => {
        const eventData = data.data?.linkedIdentitySubscription
        if (!eventData) return

        if (
          eventData.event ===
          DataHubSubscriptionEventEnum.LINKED_IDENTITY_SESSION_CREATED
        ) {
          const sessionAddress = eventData.entity.session.id
          const linkedIdentity = eventData.entity.session.linkedIdentity
          if (sessionCallbacks.has(sessionAddress)) {
            sessionCallbacks.get(sessionAddress)!(linkedIdentity.id)
            sessionCallbacks.delete(sessionAddress)
          }
        }

        if (sessionCallbacks.size === 0) {
          unsub()
          isActive = false
        }
      },
      error: () => {
        console.log('error subscription linking identity')
      },
    }
  )

  return true
}

export async function linkIdentityWithResult(
  sessionAddress: string,
  input: SocialEventDataApiInput
) {
  subscribeToLinkingIdentity()

  const { getPromise, getResolver } = generateManuallyTriggeredPromise()
  const promise = getPromise()

  let linkedIdentityAddress = ''
  sessionCallbacks.set(sessionAddress, (address: string) => {
    getResolver()()
    linkedIdentityAddress = address
  })

  await linkIdentity(input)

  function checkLinkedIdentityManually(retry: number = 0) {
    setTimeout(async () => {
      // if no response from subscription
      if (sessionCallbacks.has(sessionAddress)) {
        const address = await getLinkedIdentityAddress(sessionAddress)
        if (address) {
          sessionCallbacks.delete(sessionAddress)
          getResolver()()
          linkedIdentityAddress = address
        } else {
          if (retry < 3) checkLinkedIdentityManually(retry + 1)
          else {
            sessionCallbacks.delete(sessionAddress)
            getResolver()()
            linkedIdentityAddress = address
          }
        }
      }
    }, 1000)
  }
  checkLinkedIdentityManually()

  await promise

  return linkedIdentityAddress
}

export async function getLinkedIdentityAddress(sessionAddress: string) {
  const res = await datahubQueryRequest<{
    linkedIdentity: {
      id: string
    }
  }>({
    document: gql`
      query GetLinkedIdentityAddress($sessionAddress: String!) {
        linkedIdentity(where: { sessionAddress: $sessionAddress }) {
          id
        }
      }
    `,
    variables: { sessionAddress },
  })
  return res.linkedIdentity.id
}

export async function getAddressBalance(address: string) {
  const res = await datahubQueryRequest<{
    socialProfileBalances: {
      activeStakingPoints: number
    }
  }>({
    document: gql`
      query GetAddressBalance($address: String!) {
        socialProfileBalances(args: { where: { address: $address } }) {
          activeStakingPoints
        }
      }
    `,
    variables: { address },
  })
  return res.socialProfileBalances.activeStakingPoints
}
