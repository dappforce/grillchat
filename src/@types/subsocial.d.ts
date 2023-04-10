import * as types from '@subsocial/api/types'
import { PostStruct } from '@subsocial/api/types'

declare module '@subsocial/api/types' {
  export default types

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
