import * as types from '@subsocial/api/types'
import { EntityData, PostStruct } from '@subsocial/api/types'
import { PostContent as SubsocialPostContent } from '@subsocial/api/types/dto'

declare module '@subsocial/api/types' {
  export default types

  export interface PostContent extends SubsocialPostContent {
    inReplyTo?: {
      kind: 'Post'
      id: string
    }
  }
  export declare type PostData = EntityData<PostStruct, PostContent>
}
