import { useConfigContext } from '@/contexts/ConfigContext'
import useMounted from '@/hooks/useMounted'

export default function useSortByConfig(originalOrder: string[]) {
  const { order } = useConfigContext()
  const mounted = useMounted()

  if (mounted && order) {
    if (order.length === 0) return originalOrder
    const filteredOrder = order.filter((item) => originalOrder.includes(item))
    return [
      ...filteredOrder,
      ...originalOrder.filter((item) => !filteredOrder.includes(item)),
    ]
  }
  return originalOrder
}
