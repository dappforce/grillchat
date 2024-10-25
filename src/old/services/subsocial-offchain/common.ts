import axios from 'axios'

export const subsocialOffchainApi = axios.create({
  baseURL: 'https://api.subsocial.network',
})
