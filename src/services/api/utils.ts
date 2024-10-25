import { env } from '@/env.mjs'
import axios from 'axios'

export const apiInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_BASE_PATH,
})
