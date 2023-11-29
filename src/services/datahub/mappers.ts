import {
  DecodedPromoExtension,
  DonateExtension,
  ImageExtension,
  NftExtension,
  PinsExtension,
  PostContent,
  PostContentExtension,
  PostData,
} from '@subsocial/api/types'
import {
  ContentExtensionSchemaId,
  DatahubPostFragmentFragment,
} from './generated-query'

const SQUID_SEPARATOR = ','
const getTokensFromUnifiedString = (data: string | null) =>
  data?.split(SQUID_SEPARATOR).filter(Boolean) ?? []

const mapPostExtensions = (
  extensions: DatahubPostFragmentFragment['extensions']
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

      case ContentExtensionSchemaId.SubsocialPinnedPosts:
        const pinsExtension: PinsExtension = {
          id: 'subsocial-pinned-posts',
          properties: {
            ids:
              (ext.pinnedResources
                ?.map((pinned) => pinned.post?.persistentId || pinned.post?.id)
                .filter(Boolean) as [string]) ?? [],
          },
        }
        return pinsExtension
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
    createdAtBlock: parseInt(post.createdAtBlock?.toString() ?? '0'),
    createdAtTime: new Date(post.createdAtTime).getTime(),
    createdByAccount: post.createdByAccount?.id ?? '',
    downvotesCount: 0,
    dataType: post.dataType,
    hidden: post.hidden,
    id: post.persistentId || post.id,
    isComment: post.isComment,
    isRegularPost: post.kind === 'RegularPost',
    isSharedPost: post.kind === 'SharedPost',
    ownerId: post.ownedByAccount.id,
    upvotesCount: 0,
    contentId: post.content ?? '',
    repliesCount: 0,
    sharesCount: 0,
    spaceId:
      post.space?.persistentId ?? post.rootPost?.space?.persistentId ?? '',
    isUpdated: !!post.updatedAtTime,
    rootPostId: post.rootPost?.persistentId ?? '',
    followersCount: post.followersCount ?? 0,
    blockchainSyncFailed: post.blockchainSyncFailed,
  }

  const data = {
    id: post.persistentId || post.id,
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
      optimisticId: post.optimisticId,
    } as PostContent,
  }

  const extensions = mapPostExtensions(post.extensions)
  if (extensions) {
    data.content.extensions = extensions
  }

  const replyToId = post.inReplyToPost?.persistentId
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
