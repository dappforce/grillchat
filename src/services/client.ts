import { setSubsocialConfig } from '@/subsocial-query'
import { QueryClient } from '@tanstack/react-query'

setSubsocialConfig('staging')

const client = new QueryClient()
export default client
