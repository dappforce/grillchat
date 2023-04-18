import { Theme } from '@/@types/theme'
import { generateRandomColor } from '@/utils/random-colors'
import useGetTheme from './useGetTheme'

export default function useRandomColor(
  seed: string | null | undefined,
  theme?: Theme
) {
  const currentTheme = useGetTheme()
  return generateRandomColor(seed, theme ?? currentTheme)
}
