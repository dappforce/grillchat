import { getCovalentApiKey } from '@/utils/env/server'
import axios from 'axios'

export const covalentRequest = axios.create({
  baseURL: 'https://api.covalenthq.com/v1/',
  headers: {
    Authorization: `Bearer ${getCovalentApiKey()}`,
  },
})
