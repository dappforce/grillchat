import { setSubsocialConfig } from '@/subsocial-query/subsocial/config'
import { QueryClient } from '@tanstack/react-query'

setSubsocialConfig('staging')

const client = new QueryClient()
export default client
