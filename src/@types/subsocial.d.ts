import '@subsocial/api/types'
import * as types from '@subsocial/api/types'
import { PostStruct } from '@subsocial/api/types'
import { PostContent as SubsocialPostContent } from '@subsocial/api/types/dto'

declare module '@subsocial/api/types' {
  export default types

  export type ImageProperties = {
    image: string
  }
  export type NftProperties = {
    chain: string
    collectionId: string
    nftId: string
    url: string
  }
  export type DonateProperies = {
    chain: string
    from: string
    to: string
    token: string
    decimals: number
    amount: string
    txHash: string
  }

  export type NftExtension = {
    id: 'subsocial-evm-nft'
    properties: NftProperties
  }
  export type DonateExtension = {
    id: 'subsocial-donations'
    properties: DonateProperies
  }
  export type ImageExtension = {
    id: 'subsocial-image'
    properties: ImageProperties
  }

  export type PostContentExtension =
    | NftExtension
    | DonateExtension
    | ImageExtension

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
