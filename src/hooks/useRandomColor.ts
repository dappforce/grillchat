import { Theme } from '@/@types/theme'
import { useConfigContext } from '@/providers/ConfigProvider'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { generateRandomColor } from '@/utils/random-colors'
import useGetTheme from './useGetTheme'

export default function useRandomColor(
  address: string | null | undefined,
  theme?: Theme
) {
  const { theme: configTheme } = useConfigContext()
  const currentTheme = useGetTheme()
  const { data: accountData } = getAccountDataQuery.useQuery(address || '')

  const { evmAddress } = accountData || {}

  return generateRandomColor(
    evmAddress || address,
    theme ?? configTheme ?? currentTheme
  )
}
