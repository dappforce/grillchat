import useMounted from '@/hooks/useMounted'
import { useConfigContext } from '@/providers/ConfigProvider'

export default function useSortChatIdsByConfig(chatIds: string[]) {
  const { order } = useConfigContext()
  const mounted = useMounted()

  if (mounted && order) {
    if (order.length === 0) return chatIds
    const filteredOrder = order.filter((item) => chatIds.includes(item))
    return [
      ...filteredOrder,
      ...chatIds.filter((item) => !filteredOrder.includes(item)),
    ]
  }
  return chatIds
}
