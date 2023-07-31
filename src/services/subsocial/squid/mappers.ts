import {
  DecodedPromoExtension,
  DonateExtension,
  ImageExtension,
  NftExtension,
  PostContent,
  PostContentExtension,
  PostData,
  SpaceData,
} from '@subsocial/api/types'
import {
  ContentExtensionSchemaId,
  PostFragmentFragment,
  SpaceFragmentFragment,
} from './generated'

const SQUID_SEPARATOR = ','
const getTokensFromUnifiedString = (data: string | null) =>
  data?.split(SQUID_SEPARATOR).filter(Boolean) ?? []

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

const mapPostExtensions = (
  extensions: PostFragmentFragment['extensions']
): PostContentExtension[] | undefined => {
  const mappedExtensions = extensions?.map((ext) => {
    switch (ext.extensionSchemaId) {
      case ContentExtensionSchemaId.SubsocialEvmNft:
        const nftExtension: NftExtension = {
          id: 'subsocial-evm-nft',
          properties: {
            chain: ext.chain ?? '',
            collectionId: ext.collectionId ?? '',
            nftId: ext.nftId ?? '',
            url: ext.url ?? '',
          },
        }
        return nftExtension

      case ContentExtensionSchemaId.SubsocialDonations:
        const donationExtension: DonateExtension = {
          id: 'subsocial-donations',
          properties: {
            chain: ext?.chain ?? '',
            from: ext?.fromEvm?.id ?? '',
            to: ext?.toEvm?.id ?? '',
            token: ext?.token ?? '',
            decimals: ext?.decimals ?? 0,
            amount: ext?.amount ?? '',
            txHash: ext?.txHash ?? '',
          },
        }
        return donationExtension

      case ContentExtensionSchemaId.SubsocialImage:
        const imageExtension: ImageExtension = {
          id: 'subsocial-image',
          properties: {
            image: ext.image ?? '',
          },
        }
        return imageExtension

      case ContentExtensionSchemaId.SubsocialDecodedPromo:
        const decodedPromoExtension: DecodedPromoExtension = {
          id: 'subsocial-decoded-promo',
          properties: {
            message: ext?.message ?? '',
            recipient: ext?.recipient?.id ?? '',
            nonce: ext?.nonce ? parseInt(ext.nonce) : 0,
          },
        }
        return decodedPromoExtension

      // TODO: wait squid to support pins extension
      // case ContentExtensionSchemaId.SubsocialPins:
      //   const pinsExtension: PinsExtension = {
      //     id: 'subsocial-pinned-posts',
      //     properties: {
      //       pinned: ext?.pinned ?? [],
      //     },
      //   }
      //   return pinsExtension
    }
  })
  const exts = mappedExtensions.filter((ext) => !!ext) as PostContentExtension[]
  if (exts.length === 0) return undefined
  return exts
}

export const mapPostFragment = (post: PostFragmentFragment): PostData => {
  const struct: PostData['struct'] = {
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
    spaceId: post.space?.id ?? post.rootPost?.space?.id ?? '',
    isUpdated: !!post.updatedAtTime,
    rootPostId: post.rootPost?.id ?? '',
    followersCount: post.followersCount,
  }

  const data = {
    id: post.id,
    struct,
    content: {
      summary: post.summary ?? '',
      image: post.image ?? '',
      title: post.title ?? '',
      link: post.link ?? '',
      body: post.body || '',
      canonical: post.canonical ?? '',
      isShowMore: post.isShowMore ?? false,
      tags: getTokensFromUnifiedString(post.tagsOriginal ?? ''),
    } as PostContent,
  }

  const extensions = mapPostExtensions(post.extensions)
  if (extensions) {
    data.content.extensions = extensions
  }

  const replyToId = post.inReplyToPost?.id
  const replyData =
    replyToId &&
    ({
      kind: post.inReplyToKind ?? 'Post',
      id: replyToId,
    } as PostContent['inReplyTo'])
  if (replyData) {
    data.content.inReplyTo = replyData
  }

  return data
}
