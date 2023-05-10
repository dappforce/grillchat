import { Theme } from '@/@types/theme'
import { getUrlQuery } from '@/utils/links'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type State = {
  theme: Theme | undefined
  order: string[]
  isChatRoomOnly?: boolean
}
const ConfigContext = createContext<State>({ theme: undefined, order: [] })

export function ConfigProvider({ children }: { children: any }) {
  const [theme, setTheme] = useState<Theme>()
  const [order, setOrder] = useState<string[]>([])
  const [isChatRoomOnly, setIsChatRoomOnly] = useState(false)

  useEffect(() => {
    const theme = getUrlQuery('theme')
    const orderQuery = getUrlQuery('order')
    const isChatRoomOnly = getUrlQuery('isChatRoomOnly')

    if (theme === 'dark' || theme === 'light') {
      setTheme(theme)
    }

    const usedOrder = orderQuery.split(',').filter((value) => !!value)
    if (usedOrder.length > 0) {
      setOrder(usedOrder)
    }

    if (isChatRoomOnly === '1' || isChatRoomOnly === 'true') {
      setIsChatRoomOnly(true)
    }
  }, [])

  const state = useMemo(
    () => ({ order, theme, isChatRoomOnly }),
    [order, theme, isChatRoomOnly]
  )

  return (
    <ConfigContext.Provider value={state}>{children}</ConfigContext.Provider>
  )
}

export function useConfigContext() {
  return useContext(ConfigContext)
}
