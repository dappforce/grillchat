import '@subsocial/api/types'
import * as types from '@subsocial/api/types'
import { PostStruct } from '@subsocial/api/types'
import { PostContent as SubsocialPostContent } from '@subsocial/api/types/dto'

declare module '@subsocial/api/types' {
  export default types

  export type NftProperties = {
    chain: string
    collectionId: string
    nftId: string
    url: string
  }
  export type NftExtension = {
    id: 'subsocial-evm-nft'
    properties: NftProperties
  }
  export type PostContentExtension = NftExtension

  export interface PostContent extends SubsocialPostContent {
    inReplyTo?: {
      kind: 'Post'
      id: string
    }
    extensions?: PostContentExtension[]
  }
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
