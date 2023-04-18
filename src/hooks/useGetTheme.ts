import { useTheme } from 'next-themes'

export default function useGetTheme() {
  const { theme, systemTheme } = useTheme()
  if (theme === undefined) return undefined
  const isDark =
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
  return isDark ? 'dark' : 'light'
}
