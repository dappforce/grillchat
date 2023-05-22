import axios from 'axios'

export const subsocialOffchainApi = axios.create({
  url: 'https://api.subsocial.network',
})
