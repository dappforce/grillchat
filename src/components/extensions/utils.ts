import { PostContentExtension } from '@subsocial/api/types'

// make it so that the properties returned from this functions are typed based on the Id generic
export function getMessageExtensionProperties<
  Id extends PostContentExtension['id']
>(
  extension: PostContentExtension | undefined,
  id: Id
): Extract<PostContentExtension, { id: Id }>['properties'] | null {
  if (!extension || extension.id !== id) return null
  return extension.properties as any
}
