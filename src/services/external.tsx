import axios from 'axios'

export function getSubIdRequest() {
  return axios.create({ baseURL: 'https://sub.id/api/v1' })
}

export function getNeynarApi() {
  return axios.create({ baseURL: 'https://api.neynar.com/v2' })
}
