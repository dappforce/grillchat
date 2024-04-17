import axios from 'axios'

export function getSubIdRequest() {
  return axios.create({ baseURL: 'https://sub.id/api/v1/' })
}
