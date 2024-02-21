import { Theme } from '@/@types/theme'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { generateRandomColor } from '@/utils/random-colors'
import useAddressIdentityId from './useAddressIdentityId'
import useGetTheme from './useGetTheme'

export default function useRandomColor(
  seed: string | null | undefined,
  config: {
    isAddress?: boolean
    theme?: Theme
  } = {}
) {
  const { isAddress, theme } = config

  const { theme: configTheme } = useConfigContext()
  const currentTheme = useGetTheme()
  const addressSeed = useAddressIdentityId(seed ?? '', {
    enabled: !!isAddress && !!seed,
  })

  return generateRandomColor(
    addressSeed || seed,
    theme ?? configTheme ?? currentTheme
  )
}
