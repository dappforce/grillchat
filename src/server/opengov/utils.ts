import axios from 'axios'

export const polkassemblyApi = axios.create({
  baseURL: 'https://api.polkassembly.io/api/v1',
  headers: { 'x-network': 'polkadot' },
})
