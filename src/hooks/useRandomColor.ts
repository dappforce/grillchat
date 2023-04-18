import { generateRandomColor } from '@/utils/random-colors'
import useGetTheme from './useGetTheme'

export default function useRandomColor(seed: string | null | undefined) {
  const theme = useGetTheme()
  return generateRandomColor(seed, theme)
}
