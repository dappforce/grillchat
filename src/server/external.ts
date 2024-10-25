import { env } from '@/env.mjs'
import '@kiltprotocol/augment-api'
import axios from 'axios'

export const covalentRequest = axios.create({
  baseURL: 'https://api.covalenthq.com/v1/',
  headers: {
    Authorization: `Bearer ${env.COVALENT_API_KEY}`,
  },
})
