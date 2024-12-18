import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'

export default function useAddressIdentityId(
  address: string,
  { enabled } = { enabled: true }
) {
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    address || '',
    // disable the query, to not fetch unnecessary data
    // currently this is a workaround, because the linkedIdentity for this query is called when the message is inView
    // so this query will have the correct value when the message is inView (which won't create too much upfront queries)
    { enabled: false }
  )

  return linkedIdentity?.mainAddress || address
}
