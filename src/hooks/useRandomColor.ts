import { Theme } from '@/@types/theme'
import { useConfigContext } from '@/providers/ConfigProvider'
import { generateRandomColor } from '@/utils/random-colors'
import useGetTheme from './useGetTheme'

export default function useRandomColor(
  seed: string | null | undefined,
  theme?: Theme
) {
  const { theme: configTheme } = useConfigContext()
  const currentTheme = useGetTheme()
  return generateRandomColor(seed, theme ?? configTheme ?? currentTheme)
}
