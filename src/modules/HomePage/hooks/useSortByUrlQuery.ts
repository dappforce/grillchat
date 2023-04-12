import useMounted from '@/hooks/useMounted'
import { getUrlQuery } from '@/utils/window'

export default function useSortByUrlQuery(originalOrder: string[]) {
  const mounted = useMounted()

  if (mounted) {
    const orderQuery = getUrlQuery('order')
    if (!orderQuery || orderQuery.length === 0) return []
    const filteredOrder = orderQuery.filter((item) =>
      originalOrder.includes(item)
    )
    return [
      ...filteredOrder,
      ...originalOrder.filter((item) => !filteredOrder.includes(item)),
    ]
  }
  return []
}
