import { Theme } from '@/@types/theme'
import { useConfigContext } from '@/providers/ConfigProvider'
import { getEvmAddressQuery } from '@/services/subsocial/evmAddresses'
import { generateRandomColor } from '@/utils/random-colors'
import useGetTheme from './useGetTheme'

export default function useRandomColor(
  seed: string | null | undefined,
  theme?: Theme
) {
  const { theme: configTheme } = useConfigContext()
  const currentTheme = useGetTheme()
  const { data: accountData } = getEvmAddressQuery.useQuery(seed || '')

  const { evmAddress } = accountData || {}

  return generateRandomColor(
    evmAddress || seed,
    theme ?? configTheme ?? currentTheme
  )
}
