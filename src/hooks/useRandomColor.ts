import { Theme } from '@/@types/theme'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { generateRandomColor } from '@/utils/random-colors'
import useGetTheme from './useGetTheme'

export default function useRandomColor(
  seed: string | null | undefined,
  config: {
    theme?: Theme
  } = {}
) {
  const { theme } = config

  const { theme: configTheme } = useConfigContext()
  const currentTheme = useGetTheme()

  return generateRandomColor(seed, theme ?? configTheme ?? currentTheme)
}
