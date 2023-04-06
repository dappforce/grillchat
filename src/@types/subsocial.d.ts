import * as types from '@subsocial/api/types'

declare module '@subsocial/api/types' {
  export default types

  export interface PostContent {
    replyTo?: string
  }
}
