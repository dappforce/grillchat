import { Theme } from '@/@types/theme'
import { useConfigContext } from '@/contexts/ConfigContext'
import { generateRandomColor } from '@/utils/random-colors'
import useGetTheme from './useGetTheme'

export default function useRandomColor(
  seed: string | null | undefined,
  theme?: Theme
) {
  const { theme: currentThemeConfig } = useConfigContext()
  const currentTheme = useGetTheme()
  return generateRandomColor(seed, theme ?? currentThemeConfig ?? currentTheme)
}
