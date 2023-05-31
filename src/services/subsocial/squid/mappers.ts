import { PostData, SpaceData } from '@subsocial/api/types'
import { PostFragmentFragment, SpaceFragmentFragment } from './generated'

const SQUID_SEPARATOR = ','
const getTokensFromUnifiedString = (data: string | null) =>
  data?.split(SQUID_SEPARATOR) ?? []

export const mapSpaceFragment = (space: SpaceFragmentFragment): SpaceData => {
  return {
    struct: {
      canEveryoneCreatePosts: space.canEveryoneCreatePosts ?? false,
      canFollowerCreatePosts: space.canFollowerCreatePosts ?? false,
      createdAtBlock: space.createdAtBlock,
      createdAtTime: space.createdAtTime,
      createdByAccount: space.createdByAccount.id,
      hidden: space.hidden,
      id: space.id,
      ownerId: space.ownedByAccount.id,
      contentId: space.content ?? '',
      handle: '',
      postsCount: space.postsCount,
    },
    id: space.id,
    content: {
      image: space.image ?? '',
      name: space.name ?? '',
      tags: getTokensFromUnifiedString(space.tagsOriginal ?? ''),
      summary: space.summary ?? '',
      about: space.about ?? '',
      email: space.email ?? '',
      links: getTokensFromUnifiedString(space.linksOriginal ?? ''),
      isShowMore: space.isShowMore ?? false,
    },
  }
}

export const mapPostFragment = (post: PostFragmentFragment): PostData => {
  return {
    id: post.id,
    struct: {
      createdAtBlock: parseInt(post.createdAtBlock),
      createdAtTime: new Date(post.createdAtTime).getTime(),
      createdByAccount: post.createdByAccount.id,
      downvotesCount: post.downvotesCount,
      hidden: post.hidden,
      id: post.id,
      isComment: post.isComment,
      isRegularPost: post.kind === 'RegularPost',
      isSharedPost: post.kind === 'SharedPost',
      ownerId: post.ownedByAccount.id,
      upvotesCount: post.upvotesCount,
      contentId: post.content ?? '',
      repliesCount: post.repliesCount,
      sharesCount: post.sharesCount,
      spaceId: post.space?.id,
      isUpdated: !!post.updatedAtTime,
    },
    content: {
      summary: post.summary ?? '',
      image: post.image ?? '',
      title: post.title ?? '',
      link: post.link ?? '',
      body: post.body || '',
      canonical: post.canonical ?? '',
      isShowMore: post.isShowMore ?? false,
      tags: getTokensFromUnifiedString(post.tagsOriginal ?? ''),
    },
  }
}
