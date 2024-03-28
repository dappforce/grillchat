import axios from 'axios'

export const subsquareApi = axios.create({
  baseURL: 'https://polkadot.subsquare.io/api',
})
