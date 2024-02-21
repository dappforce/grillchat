import { Theme } from '@/@types/theme'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { useTheme } from 'next-themes'

export default function useGetTheme(): Theme | undefined {
  const { theme, systemTheme } = useTheme()
  const { theme: configTheme } = useConfigContext()

  if (configTheme) return configTheme
  if (theme === undefined) return undefined

  const isDark =
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
  return isDark ? 'dark' : 'light'
}
