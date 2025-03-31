import {
  ImageExtension,
  PostContent,
  PostContentExtension,
  PostData,
  SpaceData,
} from '@subsocial/api/types'
import {
  ContentExtensionSchemaId,
  DatahubPostFragmentFragment,
  SpaceFragmentFragment,
} from './generated-query'

const mapPostExtensions = (
  extensions: DatahubPostFragmentFragment['extensions']
): PostContentExtension[] | undefined => {
  const mappedExtensions = extensions?.map((ext) => {
    switch (ext.extensionSchemaId) {
      case ContentExtensionSchemaId.SubsocialImage:
        const imageExtension: ImageExtension = {
          id: 'subsocial-image',
          properties: {
            image: ext.image ?? '',
          },
        }
        return imageExtension
    }
  })
  const exts = mappedExtensions.filter((ext) => !!ext) as PostContentExtension[]
  if (exts.length === 0) return undefined
  return exts
}

export const mapDatahubPostFragment = (
  post: DatahubPostFragmentFragment
): PostData => {
  const struct: PostData['struct'] = {
    createdAtBlock: 0,
    createdAtTime: new Date(post.createdAtTime).getTime(),
    createdByAccount: post.createdByAccount?.id ?? '',
    downvotesCount: 0,
    dataType: 'offChain',
    hidden: post.hidden ?? false,
    id: post.id,
    isComment: true,
    isRegularPost: true,
    isSharedPost: false,
    ownerId: post.ownedByAccount.id,
    upvotesCount: 0,
    contentId: '',
    repliesCount: 0,
    sharesCount: 0,
    spaceId: post.space?.id ?? '',
    isUpdated: !!post.updatedAtTime,
    rootPostId: post.rootPost?.persistentId ?? '',
    parentPostId: null,
    followersCount: 0,
    blockchainSyncFailed: true,
  }

  const data = {
    id: post.id,
    struct,
    entityId: post.id,
    content: {
      summary: post.body,
      image: '',
      title: post.title ?? '',
      link: '',
      body: (post.body || '').replace(/\n{3,}/g, '\n\n'),
      canonical: '',
      isShowMore: false,
      tags: [],
    } as PostContent,
  } satisfies PostData

  const extensions = mapPostExtensions(post.extensions)
  if (extensions) {
    data.content.extensions = extensions
  }

  return data
}

export const mapDatahubSpaceFragment = (
  space: SpaceFragmentFragment
): SpaceData => {
  return {
    id: space.id,
    content: {
      summary: space.about ?? '',
      isShowMore: false,
      name: space.name ?? '',
      image: space.image ?? '',
      about: space.about ?? '',
      email: '',
      links: [],
      tags: [],
    },
    struct: {
      hidden: space.hidden ?? false,
      canEveryoneCreatePosts: false,
      canFollowerCreatePosts: false,
      createdAtBlock: space.createdAtBlock ?? 0,
      createdAtTime: space.createdAtTime ?? 0,
      createdByAccount: space.createdByAccount.id,
      id: space.id,
      ownerId: space.ownedByAccount.id,
      contentId: space.content ?? '',
    },
  }
}
