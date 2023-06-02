import '@subsocial/api/types'
import * as types from '@subsocial/api/types'
import { PostStruct } from '@subsocial/api/types'
import { PostContent as SubsocialPostContent } from '@subsocial/api/types/dto'
import { IpfsCommentContent } from '@subsocial/api/types/ipfs'

declare module '@subsocial/api/types' {
  export default types

  export type HasUuid = {
    /** Unique id to link optimisitic and blockchain posts */
    uuid: string
  }

  export type InReplyTo = {
    kind: 'Post'
    id: string
  }

  export type HasInReplyTo = {
    inReplyTo?: InReplyTo
  }

  export type PostContent = SubsocialPostContent & HasUuid & HasInReplyTo

  export type CommentContentForIpfs = IpfsCommentContent &
    HasUuid &
    HasInReplyTo

  export declare type EntityPostData<
    S extends HasId,
    C extends CommonContent
  > = {
    id: EntityId
    struct: S
    content: C | null
  }
  export declare type PostData = EntityPostData<PostStruct, PostContent>
}
