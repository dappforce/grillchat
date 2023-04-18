import { Theme } from '@/@types/theme'
import { useTheme } from 'next-themes'

export default function useGetTheme(): Theme | undefined {
  const { theme, systemTheme } = useTheme()
  if (theme === undefined) return undefined
  const isDark =
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
  return isDark ? 'dark' : 'light'
}
