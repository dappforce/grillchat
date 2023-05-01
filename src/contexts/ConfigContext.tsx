import { Theme } from '@/@types/theme'
import { getUrlQuery } from '@/utils/window'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type State = { theme: Theme | undefined; order: string[] }
const ConfigContext = createContext<State>({ theme: undefined, order: [] })

export function ConfigProvider({ children }: { children: any }) {
  const [theme, setTheme] = useState<Theme>()
  const [order, setOrder] = useState<string[]>([])

  useEffect(() => {
    const theme = getUrlQuery('theme')
    const orderQuery = getUrlQuery('order')

    if (theme === 'dark' || theme === 'light') {
      setTheme(theme)
    }
    const usedOrder = orderQuery.split(',').filter((value) => !!value)
    if (usedOrder.length > 0) {
      setOrder(usedOrder)
    }
  }, [])

  const state = useMemo(() => ({ order, theme }), [order, theme])

  return (
    <ConfigContext.Provider value={state}>{children}</ConfigContext.Provider>
  )
}

export function useConfigContext() {
  return useContext(ConfigContext)
}
