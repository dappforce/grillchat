import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

/** The Account entity */
export type Account = {
  __typename?: 'Account';
  /** A One-To-Many relationship with the Activities which have been performed by an Account (foreign key - "account") */
  activities: Array<Activity>;
  /** A list of extensions created by the account. */
  extensions: Array<ContentExtension>;
  /**
   * A One-To-Many relationship between an Account and the Activities it has performed in the network through NewsFeed (foreign key - "account").
   * Each Activity has the "event<EventName>" and "post" fields, which can be used for adding created Posts to a user's Feed.
   */
  feeds: Array<NewsFeed>;
  /** A One-To-Many relationship between the current Account and a follower Account through AccountFollowers (foreign key - "followingAccount") */
  followers: Array<AccountFollowers>;
  /** The total number of followers that an Account has (followers.length) */
  followersCount: Scalars['Int']['output'];
  /** A One-To-Many relationship between the current Account and an Account being followed through AccountFollowers (foreign key - "followerAccount") */
  followingAccounts: Array<AccountFollowers>;
  /** The total number of all accounts being followed by the current Account (followingAccounts.length) */
  followingAccountsCount: Scalars['Int']['output'];
  /** The total number of Posts that an Account is following (currently, a post is only followed by its creator) */
  followingPostsCount: Scalars['Int']['output'];
  /** The total number of Spaces that an Account is following */
  followingSpacesCount: Scalars['Int']['output'];
  /** The account's public key converted to ss58 format for the Subsocial chain (prefix "28") */
  id: Scalars['String']['output'];
  /** A list of linked Evm Accounts */
  linkedEvmAccounts: Array<EvmSubstrateAccountLink>;
  /** A Many-To-Many relationship between an Account and Activities done in the network through Notification (foreign key - "account"). */
  notifications: Array<Notification>;
  /** A One-To-Many relationship with the Posts which are owned by an Account (foreign key - "ownedByAccount") */
  ownedPosts: Array<Post>;
  /** The total number of Posts owned by an Account (ownedPosts.length) */
  ownedPostsCount: Scalars['Int']['output'];
  /** A One-To-Many relationship with the Posts which are created by an Account (foreign key - "createdByAccount") */
  posts: Array<Post>;
  /** A One-To-One relationship with the particular Space entity which is defined as the Account Profile */
  profileSpace?: Maybe<Space>;
  /** A One-To-Many relationship with the Reactions that are made by an Account (foreign key - "account") */
  reactions: Array<Reaction>;
  /** A One-To-Many relationship with the Spaces that have been created by an Account (foreign key - "createdByAccount") */
  spacesCreated: Array<Space>;
  /** A One-To-Many relationship between an Account and the Spaces that it follows through SpaceFollowers (foreign key - "followerAccount") */
  spacesFollowed: Array<SpaceFollowers>;
  /** A One-To-Many relationship with the Spaces that are currently owned by an Account  (foreign key - "ownedByAccount") */
  spacesOwned: Array<Space>;
  /** The block height when an Account was updated by the Profiles.ProfileUpdated event */
  updatedAtBlock?: Maybe<Scalars['BigInt']['output']>;
  /** The DateTime when an Account was updated by the Profiles.ProfileUpdated event */
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>;
  /** A list of the usernames that an Account owns. */
  usernames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};


/** The Account entity */
export type AccountActivitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ActivityOrderByInput>>;
  where?: InputMaybe<ActivityWhereInput>;
};


/** The Account entity */
export type AccountExtensionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ContentExtensionOrderByInput>>;
  where?: InputMaybe<ContentExtensionWhereInput>;
};


/** The Account entity */
export type AccountFeedsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NewsFeedOrderByInput>>;
  where?: InputMaybe<NewsFeedWhereInput>;
};


/** The Account entity */
export type AccountFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AccountFollowersOrderByInput>>;
  where?: InputMaybe<AccountFollowersWhereInput>;
};


/** The Account entity */
export type AccountFollowingAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AccountFollowersOrderByInput>>;
  where?: InputMaybe<AccountFollowersWhereInput>;
};


/** The Account entity */
export type AccountLinkedEvmAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EvmSubstrateAccountLinkOrderByInput>>;
  where?: InputMaybe<EvmSubstrateAccountLinkWhereInput>;
};


/** The Account entity */
export type AccountNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotificationOrderByInput>>;
  where?: InputMaybe<NotificationWhereInput>;
};


/** The Account entity */
export type AccountOwnedPostsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostOrderByInput>>;
  where?: InputMaybe<PostWhereInput>;
};


/** The Account entity */
export type AccountPostsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostOrderByInput>>;
  where?: InputMaybe<PostWhereInput>;
};


/** The Account entity */
export type AccountReactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ReactionOrderByInput>>;
  where?: InputMaybe<ReactionWhereInput>;
};


/** The Account entity */
export type AccountSpacesCreatedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SpaceOrderByInput>>;
  where?: InputMaybe<SpaceWhereInput>;
};


/** The Account entity */
export type AccountSpacesFollowedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SpaceFollowersOrderByInput>>;
  where?: InputMaybe<SpaceFollowersWhereInput>;
};


/** The Account entity */
export type AccountSpacesOwnedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SpaceOrderByInput>>;
  where?: InputMaybe<SpaceWhereInput>;
};

export type AccountEdge = {
  __typename?: 'AccountEdge';
  cursor: Scalars['String']['output'];
  node: Account;
};

/** The junction table for the Many-to-Many relationship between follower and following Accounts */
export type AccountFollowers = {
  __typename?: 'AccountFollowers';
  followerAccount: Account;
  followingAccount: Account;
  id: Scalars['String']['output'];
};

export type AccountFollowersConnection = {
  __typename?: 'AccountFollowersConnection';
  edges: Array<AccountFollowersEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AccountFollowersEdge = {
  __typename?: 'AccountFollowersEdge';
  cursor: Scalars['String']['output'];
  node: AccountFollowers;
};

export enum AccountFollowersOrderByInput {
  FollowerAccountFollowersCountAsc = 'followerAccount_followersCount_ASC',
  FollowerAccountFollowersCountDesc = 'followerAccount_followersCount_DESC',
  FollowerAccountFollowingAccountsCountAsc = 'followerAccount_followingAccountsCount_ASC',
  FollowerAccountFollowingAccountsCountDesc = 'followerAccount_followingAccountsCount_DESC',
  FollowerAccountFollowingPostsCountAsc = 'followerAccount_followingPostsCount_ASC',
  FollowerAccountFollowingPostsCountDesc = 'followerAccount_followingPostsCount_DESC',
  FollowerAccountFollowingSpacesCountAsc = 'followerAccount_followingSpacesCount_ASC',
  FollowerAccountFollowingSpacesCountDesc = 'followerAccount_followingSpacesCount_DESC',
  FollowerAccountIdAsc = 'followerAccount_id_ASC',
  FollowerAccountIdDesc = 'followerAccount_id_DESC',
  FollowerAccountOwnedPostsCountAsc = 'followerAccount_ownedPostsCount_ASC',
  FollowerAccountOwnedPostsCountDesc = 'followerAccount_ownedPostsCount_DESC',
  FollowerAccountUpdatedAtBlockAsc = 'followerAccount_updatedAtBlock_ASC',
  FollowerAccountUpdatedAtBlockDesc = 'followerAccount_updatedAtBlock_DESC',
  FollowerAccountUpdatedAtTimeAsc = 'followerAccount_updatedAtTime_ASC',
  FollowerAccountUpdatedAtTimeDesc = 'followerAccount_updatedAtTime_DESC',
  FollowingAccountFollowersCountAsc = 'followingAccount_followersCount_ASC',
  FollowingAccountFollowersCountDesc = 'followingAccount_followersCount_DESC',
  FollowingAccountFollowingAccountsCountAsc = 'followingAccount_followingAccountsCount_ASC',
  FollowingAccountFollowingAccountsCountDesc = 'followingAccount_followingAccountsCount_DESC',
  FollowingAccountFollowingPostsCountAsc = 'followingAccount_followingPostsCount_ASC',
  FollowingAccountFollowingPostsCountDesc = 'followingAccount_followingPostsCount_DESC',
  FollowingAccountFollowingSpacesCountAsc = 'followingAccount_followingSpacesCount_ASC',
  FollowingAccountFollowingSpacesCountDesc = 'followingAccount_followingSpacesCount_DESC',
  FollowingAccountIdAsc = 'followingAccount_id_ASC',
  FollowingAccountIdDesc = 'followingAccount_id_DESC',
  FollowingAccountOwnedPostsCountAsc = 'followingAccount_ownedPostsCount_ASC',
  FollowingAccountOwnedPostsCountDesc = 'followingAccount_ownedPostsCount_DESC',
  FollowingAccountUpdatedAtBlockAsc = 'followingAccount_updatedAtBlock_ASC',
  FollowingAccountUpdatedAtBlockDesc = 'followingAccount_updatedAtBlock_DESC',
  FollowingAccountUpdatedAtTimeAsc = 'followingAccount_updatedAtTime_ASC',
  FollowingAccountUpdatedAtTimeDesc = 'followingAccount_updatedAtTime_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type AccountFollowersWhereInput = {
  AND?: InputMaybe<Array<AccountFollowersWhereInput>>;
  OR?: InputMaybe<Array<AccountFollowersWhereInput>>;
  followerAccount?: InputMaybe<AccountWhereInput>;
  followerAccount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  followingAccount?: InputMaybe<AccountWhereInput>;
  followingAccount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum AccountOrderByInput {
  FollowersCountAsc = 'followersCount_ASC',
  FollowersCountDesc = 'followersCount_DESC',
  FollowingAccountsCountAsc = 'followingAccountsCount_ASC',
  FollowingAccountsCountDesc = 'followingAccountsCount_DESC',
  FollowingPostsCountAsc = 'followingPostsCount_ASC',
  FollowingPostsCountDesc = 'followingPostsCount_DESC',
  FollowingSpacesCountAsc = 'followingSpacesCount_ASC',
  FollowingSpacesCountDesc = 'followingSpacesCount_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  OwnedPostsCountAsc = 'ownedPostsCount_ASC',
  OwnedPostsCountDesc = 'ownedPostsCount_DESC',
  ProfileSpaceAboutAsc = 'profileSpace_about_ASC',
  ProfileSpaceAboutDesc = 'profileSpace_about_DESC',
  ProfileSpaceCanEveryoneCreatePostsAsc = 'profileSpace_canEveryoneCreatePosts_ASC',
  ProfileSpaceCanEveryoneCreatePostsDesc = 'profileSpace_canEveryoneCreatePosts_DESC',
  ProfileSpaceCanFollowerCreatePostsAsc = 'profileSpace_canFollowerCreatePosts_ASC',
  ProfileSpaceCanFollowerCreatePostsDesc = 'profileSpace_canFollowerCreatePosts_DESC',
  ProfileSpaceContentAsc = 'profileSpace_content_ASC',
  ProfileSpaceContentDesc = 'profileSpace_content_DESC',
  ProfileSpaceCreatedAtBlockAsc = 'profileSpace_createdAtBlock_ASC',
  ProfileSpaceCreatedAtBlockDesc = 'profileSpace_createdAtBlock_DESC',
  ProfileSpaceCreatedAtTimeAsc = 'profileSpace_createdAtTime_ASC',
  ProfileSpaceCreatedAtTimeDesc = 'profileSpace_createdAtTime_DESC',
  ProfileSpaceCreatedOnDayAsc = 'profileSpace_createdOnDay_ASC',
  ProfileSpaceCreatedOnDayDesc = 'profileSpace_createdOnDay_DESC',
  ProfileSpaceEmailAsc = 'profileSpace_email_ASC',
  ProfileSpaceEmailDesc = 'profileSpace_email_DESC',
  ProfileSpaceFollowersCountAsc = 'profileSpace_followersCount_ASC',
  ProfileSpaceFollowersCountDesc = 'profileSpace_followersCount_DESC',
  ProfileSpaceFormatAsc = 'profileSpace_format_ASC',
  ProfileSpaceFormatDesc = 'profileSpace_format_DESC',
  ProfileSpaceHandleAsc = 'profileSpace_handle_ASC',
  ProfileSpaceHandleDesc = 'profileSpace_handle_DESC',
  ProfileSpaceHiddenPostsCountAsc = 'profileSpace_hiddenPostsCount_ASC',
  ProfileSpaceHiddenPostsCountDesc = 'profileSpace_hiddenPostsCount_DESC',
  ProfileSpaceHiddenAsc = 'profileSpace_hidden_ASC',
  ProfileSpaceHiddenDesc = 'profileSpace_hidden_DESC',
  ProfileSpaceIdAsc = 'profileSpace_id_ASC',
  ProfileSpaceIdDesc = 'profileSpace_id_DESC',
  ProfileSpaceImageAsc = 'profileSpace_image_ASC',
  ProfileSpaceImageDesc = 'profileSpace_image_DESC',
  ProfileSpaceInterestsOriginalAsc = 'profileSpace_interestsOriginal_ASC',
  ProfileSpaceInterestsOriginalDesc = 'profileSpace_interestsOriginal_DESC',
  ProfileSpaceIsShowMoreAsc = 'profileSpace_isShowMore_ASC',
  ProfileSpaceIsShowMoreDesc = 'profileSpace_isShowMore_DESC',
  ProfileSpaceLinksOriginalAsc = 'profileSpace_linksOriginal_ASC',
  ProfileSpaceLinksOriginalDesc = 'profileSpace_linksOriginal_DESC',
  ProfileSpaceNameAsc = 'profileSpace_name_ASC',
  ProfileSpaceNameDesc = 'profileSpace_name_DESC',
  ProfileSpacePostsCountAsc = 'profileSpace_postsCount_ASC',
  ProfileSpacePostsCountDesc = 'profileSpace_postsCount_DESC',
  ProfileSpacePublicPostsCountAsc = 'profileSpace_publicPostsCount_ASC',
  ProfileSpacePublicPostsCountDesc = 'profileSpace_publicPostsCount_DESC',
  ProfileSpaceSummaryAsc = 'profileSpace_summary_ASC',
  ProfileSpaceSummaryDesc = 'profileSpace_summary_DESC',
  ProfileSpaceTagsOriginalAsc = 'profileSpace_tagsOriginal_ASC',
  ProfileSpaceTagsOriginalDesc = 'profileSpace_tagsOriginal_DESC',
  ProfileSpaceUpdatedAtBlockAsc = 'profileSpace_updatedAtBlock_ASC',
  ProfileSpaceUpdatedAtBlockDesc = 'profileSpace_updatedAtBlock_DESC',
  ProfileSpaceUpdatedAtTimeAsc = 'profileSpace_updatedAtTime_ASC',
  ProfileSpaceUpdatedAtTimeDesc = 'profileSpace_updatedAtTime_DESC',
  ProfileSpaceUsernameAsc = 'profileSpace_username_ASC',
  ProfileSpaceUsernameDesc = 'profileSpace_username_DESC',
  UpdatedAtBlockAsc = 'updatedAtBlock_ASC',
  UpdatedAtBlockDesc = 'updatedAtBlock_DESC',
  UpdatedAtTimeAsc = 'updatedAtTime_ASC',
  UpdatedAtTimeDesc = 'updatedAtTime_DESC'
}

export type AccountWhereInput = {
  AND?: InputMaybe<Array<AccountWhereInput>>;
  OR?: InputMaybe<Array<AccountWhereInput>>;
  activities_every?: InputMaybe<ActivityWhereInput>;
  activities_none?: InputMaybe<ActivityWhereInput>;
  activities_some?: InputMaybe<ActivityWhereInput>;
  extensions_every?: InputMaybe<ContentExtensionWhereInput>;
  extensions_none?: InputMaybe<ContentExtensionWhereInput>;
  extensions_some?: InputMaybe<ContentExtensionWhereInput>;
  feeds_every?: InputMaybe<NewsFeedWhereInput>;
  feeds_none?: InputMaybe<NewsFeedWhereInput>;
  feeds_some?: InputMaybe<NewsFeedWhereInput>;
  followersCount_eq?: InputMaybe<Scalars['Int']['input']>;
  followersCount_gt?: InputMaybe<Scalars['Int']['input']>;
  followersCount_gte?: InputMaybe<Scalars['Int']['input']>;
  followersCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  followersCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  followersCount_lt?: InputMaybe<Scalars['Int']['input']>;
  followersCount_lte?: InputMaybe<Scalars['Int']['input']>;
  followersCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  followersCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  followers_every?: InputMaybe<AccountFollowersWhereInput>;
  followers_none?: InputMaybe<AccountFollowersWhereInput>;
  followers_some?: InputMaybe<AccountFollowersWhereInput>;
  followingAccountsCount_eq?: InputMaybe<Scalars['Int']['input']>;
  followingAccountsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  followingAccountsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  followingAccountsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  followingAccountsCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  followingAccountsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  followingAccountsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  followingAccountsCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  followingAccountsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  followingAccounts_every?: InputMaybe<AccountFollowersWhereInput>;
  followingAccounts_none?: InputMaybe<AccountFollowersWhereInput>;
  followingAccounts_some?: InputMaybe<AccountFollowersWhereInput>;
  followingPostsCount_eq?: InputMaybe<Scalars['Int']['input']>;
  followingPostsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  followingPostsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  followingPostsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  followingPostsCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  followingPostsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  followingPostsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  followingPostsCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  followingPostsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  followingSpacesCount_eq?: InputMaybe<Scalars['Int']['input']>;
  followingSpacesCount_gt?: InputMaybe<Scalars['Int']['input']>;
  followingSpacesCount_gte?: InputMaybe<Scalars['Int']['input']>;
  followingSpacesCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  followingSpacesCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  followingSpacesCount_lt?: InputMaybe<Scalars['Int']['input']>;
  followingSpacesCount_lte?: InputMaybe<Scalars['Int']['input']>;
  followingSpacesCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  followingSpacesCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  linkedEvmAccounts_every?: InputMaybe<EvmSubstrateAccountLinkWhereInput>;
  linkedEvmAccounts_none?: InputMaybe<EvmSubstrateAccountLinkWhereInput>;
  linkedEvmAccounts_some?: InputMaybe<EvmSubstrateAccountLinkWhereInput>;
  notifications_every?: InputMaybe<NotificationWhereInput>;
  notifications_none?: InputMaybe<NotificationWhereInput>;
  notifications_some?: InputMaybe<NotificationWhereInput>;
  ownedPostsCount_eq?: InputMaybe<Scalars['Int']['input']>;
  ownedPostsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  ownedPostsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  ownedPostsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  ownedPostsCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  ownedPostsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  ownedPostsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  ownedPostsCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  ownedPostsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  ownedPosts_every?: InputMaybe<PostWhereInput>;
  ownedPosts_none?: InputMaybe<PostWhereInput>;
  ownedPosts_some?: InputMaybe<PostWhereInput>;
  posts_every?: InputMaybe<PostWhereInput>;
  posts_none?: InputMaybe<PostWhereInput>;
  posts_some?: InputMaybe<PostWhereInput>;
  profileSpace?: InputMaybe<SpaceWhereInput>;
  profileSpace_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  reactions_every?: InputMaybe<ReactionWhereInput>;
  reactions_none?: InputMaybe<ReactionWhereInput>;
  reactions_some?: InputMaybe<ReactionWhereInput>;
  spacesCreated_every?: InputMaybe<SpaceWhereInput>;
  spacesCreated_none?: InputMaybe<SpaceWhereInput>;
  spacesCreated_some?: InputMaybe<SpaceWhereInput>;
  spacesFollowed_every?: InputMaybe<SpaceFollowersWhereInput>;
  spacesFollowed_none?: InputMaybe<SpaceFollowersWhereInput>;
  spacesFollowed_some?: InputMaybe<SpaceFollowersWhereInput>;
  spacesOwned_every?: InputMaybe<SpaceWhereInput>;
  spacesOwned_none?: InputMaybe<SpaceWhereInput>;
  spacesOwned_some?: InputMaybe<SpaceWhereInput>;
  updatedAtBlock_eq?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAtBlock_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAtBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAtTime_eq?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_gt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_gte?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  updatedAtTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAtTime_lt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_lte?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  usernames_containsAll?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  usernames_containsAny?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  usernames_containsNone?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  usernames_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountsConnection = {
  __typename?: 'AccountsConnection';
  edges: Array<AccountEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ActiveUsersTotalCount = {
  __typename?: 'ActiveUsersTotalCount';
  account_count: Scalars['Float']['output'];
};

export type ActivitiesConnection = {
  __typename?: 'ActivitiesConnection';
  edges: Array<ActivityEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** The Activity entity, which represents any activity on the blockchain (within the list of tracked events). */
export type Activity = {
  __typename?: 'Activity';
  /** A One-To-One relationship with the Account that initiated the current activity (it's usually a caller Account) */
  account: Account;
  /** The total number of Activities of the same event type for a specific Account. */
  aggCount: Scalars['BigInt']['output'];
  /** Is this Activity the most recent in the list of Activities of this type (same event) from this account? */
  aggregated?: Maybe<Scalars['Boolean']['output']>;
  /** The block height when an activity was done */
  blockNumber: Scalars['BigInt']['output'];
  /** The DateTime when the current activity was done */
  date: Scalars['DateTime']['output'];
  /** A One-to-One relationship with the domain recipient Account */
  domainRecipient?: Maybe<Account>;
  /** The event's name */
  event: EventName;
  /** The event's index in the block */
  eventIndex: Scalars['Int']['output'];
  /** The ContentExtension which was created in this particular Activity. */
  extension?: Maybe<ContentExtension>;
  /** A One-to-One relationship with the following Account if the event is `AccountFollowed` or `AccountUnfollowed`. */
  followingAccount?: Maybe<Account>;
  /** The ID of an Activity. It has the following structure: <blockNumber>-<indexInBlock>-<md5Hash(eventName)>` (e.g. 1093209-1001-1ee8fd8482c322254acff29a8f52f5e1) */
  id: Scalars['String']['output'];
  /** A One-to-One relationship with the previous owner's Account if the event is "SpaceOwnershipTransferAccepted" */
  newOwner?: Maybe<Account>;
  /** A One-to-One relationship with the new owner's Account if the event is "SpaceOwnershipTransferAccepted" */
  oldOwner?: Maybe<Account>;
  /** A One-to-One relationship with the Post that is involved in the current Activity */
  post?: Maybe<Post>;
  /** A One-to-One relationship with the Reaction that is involved in the current Activity */
  reaction?: Maybe<Reaction>;
  /** A One-to-One relationship with the Space that is involved in the current Activity */
  space?: Maybe<Space>;
  /** A One-to-One relationship with the previous Space if the event is `PostMoved` or `DomainMetaUpdated` */
  spacePrev?: Maybe<Space>;
  /** The username of a Space or Account which was registered or updated in this particular Activity. */
  username?: Maybe<Scalars['String']['output']>;
};

export type ActivityEdge = {
  __typename?: 'ActivityEdge';
  cursor: Scalars['String']['output'];
  node: Activity;
};

export enum ActivityOrderByInput {
  AccountFollowersCountAsc = 'account_followersCount_ASC',
  AccountFollowersCountDesc = 'account_followersCount_DESC',
  AccountFollowingAccountsCountAsc = 'account_followingAccountsCount_ASC',
  AccountFollowingAccountsCountDesc = 'account_followingAccountsCount_DESC',
  AccountFollowingPostsCountAsc = 'account_followingPostsCount_ASC',
  AccountFollowingPostsCountDesc = 'account_followingPostsCount_DESC',
  AccountFollowingSpacesCountAsc = 'account_followingSpacesCount_ASC',
  AccountFollowingSpacesCountDesc = 'account_followingSpacesCount_DESC',
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountOwnedPostsCountAsc = 'account_ownedPostsCount_ASC',
  AccountOwnedPostsCountDesc = 'account_ownedPostsCount_DESC',
  AccountUpdatedAtBlockAsc = 'account_updatedAtBlock_ASC',
  AccountUpdatedAtBlockDesc = 'account_updatedAtBlock_DESC',
  AccountUpdatedAtTimeAsc = 'account_updatedAtTime_ASC',
  AccountUpdatedAtTimeDesc = 'account_updatedAtTime_DESC',
  AggCountAsc = 'aggCount_ASC',
  AggCountDesc = 'aggCount_DESC',
  AggregatedAsc = 'aggregated_ASC',
  AggregatedDesc = 'aggregated_DESC',
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberDesc = 'blockNumber_DESC',
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC',
  DomainRecipientFollowersCountAsc = 'domainRecipient_followersCount_ASC',
  DomainRecipientFollowersCountDesc = 'domainRecipient_followersCount_DESC',
  DomainRecipientFollowingAccountsCountAsc = 'domainRecipient_followingAccountsCount_ASC',
  DomainRecipientFollowingAccountsCountDesc = 'domainRecipient_followingAccountsCount_DESC',
  DomainRecipientFollowingPostsCountAsc = 'domainRecipient_followingPostsCount_ASC',
  DomainRecipientFollowingPostsCountDesc = 'domainRecipient_followingPostsCount_DESC',
  DomainRecipientFollowingSpacesCountAsc = 'domainRecipient_followingSpacesCount_ASC',
  DomainRecipientFollowingSpacesCountDesc = 'domainRecipient_followingSpacesCount_DESC',
  DomainRecipientIdAsc = 'domainRecipient_id_ASC',
  DomainRecipientIdDesc = 'domainRecipient_id_DESC',
  DomainRecipientOwnedPostsCountAsc = 'domainRecipient_ownedPostsCount_ASC',
  DomainRecipientOwnedPostsCountDesc = 'domainRecipient_ownedPostsCount_DESC',
  DomainRecipientUpdatedAtBlockAsc = 'domainRecipient_updatedAtBlock_ASC',
  DomainRecipientUpdatedAtBlockDesc = 'domainRecipient_updatedAtBlock_DESC',
  DomainRecipientUpdatedAtTimeAsc = 'domainRecipient_updatedAtTime_ASC',
  DomainRecipientUpdatedAtTimeDesc = 'domainRecipient_updatedAtTime_DESC',
  EventIndexAsc = 'eventIndex_ASC',
  EventIndexDesc = 'eventIndex_DESC',
  EventAsc = 'event_ASC',
  EventDesc = 'event_DESC',
  ExtensionAmountAsc = 'extension_amount_ASC',
  ExtensionAmountDesc = 'extension_amount_DESC',
  ExtensionChainAsc = 'extension_chain_ASC',
  ExtensionChainDesc = 'extension_chain_DESC',
  ExtensionCollectionIdAsc = 'extension_collectionId_ASC',
  ExtensionCollectionIdDesc = 'extension_collectionId_DESC',
  ExtensionDecimalsAsc = 'extension_decimals_ASC',
  ExtensionDecimalsDesc = 'extension_decimals_DESC',
  ExtensionExtensionSchemaIdAsc = 'extension_extensionSchemaId_ASC',
  ExtensionExtensionSchemaIdDesc = 'extension_extensionSchemaId_DESC',
  ExtensionIdAsc = 'extension_id_ASC',
  ExtensionIdDesc = 'extension_id_DESC',
  ExtensionImageAsc = 'extension_image_ASC',
  ExtensionImageDesc = 'extension_image_DESC',
  ExtensionMessageAsc = 'extension_message_ASC',
  ExtensionMessageDesc = 'extension_message_DESC',
  ExtensionNftIdAsc = 'extension_nftId_ASC',
  ExtensionNftIdDesc = 'extension_nftId_DESC',
  ExtensionNonceAsc = 'extension_nonce_ASC',
  ExtensionNonceDesc = 'extension_nonce_DESC',
  ExtensionTokenAsc = 'extension_token_ASC',
  ExtensionTokenDesc = 'extension_token_DESC',
  ExtensionTxHashAsc = 'extension_txHash_ASC',
  ExtensionTxHashDesc = 'extension_txHash_DESC',
  ExtensionUrlAsc = 'extension_url_ASC',
  ExtensionUrlDesc = 'extension_url_DESC',
  FollowingAccountFollowersCountAsc = 'followingAccount_followersCount_ASC',
  FollowingAccountFollowersCountDesc = 'followingAccount_followersCount_DESC',
  FollowingAccountFollowingAccountsCountAsc = 'followingAccount_followingAccountsCount_ASC',
  FollowingAccountFollowingAccountsCountDesc = 'followingAccount_followingAccountsCount_DESC',
  FollowingAccountFollowingPostsCountAsc = 'followingAccount_followingPostsCount_ASC',
  FollowingAccountFollowingPostsCountDesc = 'followingAccount_followingPostsCount_DESC',
  FollowingAccountFollowingSpacesCountAsc = 'followingAccount_followingSpacesCount_ASC',
  FollowingAccountFollowingSpacesCountDesc = 'followingAccount_followingSpacesCount_DESC',
  FollowingAccountIdAsc = 'followingAccount_id_ASC',
  FollowingAccountIdDesc = 'followingAccount_id_DESC',
  FollowingAccountOwnedPostsCountAsc = 'followingAccount_ownedPostsCount_ASC',
  FollowingAccountOwnedPostsCountDesc = 'followingAccount_ownedPostsCount_DESC',
  FollowingAccountUpdatedAtBlockAsc = 'followingAccount_updatedAtBlock_ASC',
  FollowingAccountUpdatedAtBlockDesc = 'followingAccount_updatedAtBlock_DESC',
  FollowingAccountUpdatedAtTimeAsc = 'followingAccount_updatedAtTime_ASC',
  FollowingAccountUpdatedAtTimeDesc = 'followingAccount_updatedAtTime_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NewOwnerFollowersCountAsc = 'newOwner_followersCount_ASC',
  NewOwnerFollowersCountDesc = 'newOwner_followersCount_DESC',
  NewOwnerFollowingAccountsCountAsc = 'newOwner_followingAccountsCount_ASC',
  NewOwnerFollowingAccountsCountDesc = 'newOwner_followingAccountsCount_DESC',
  NewOwnerFollowingPostsCountAsc = 'newOwner_followingPostsCount_ASC',
  NewOwnerFollowingPostsCountDesc = 'newOwner_followingPostsCount_DESC',
  NewOwnerFollowingSpacesCountAsc = 'newOwner_followingSpacesCount_ASC',
  NewOwnerFollowingSpacesCountDesc = 'newOwner_followingSpacesCount_DESC',
  NewOwnerIdAsc = 'newOwner_id_ASC',
  NewOwnerIdDesc = 'newOwner_id_DESC',
  NewOwnerOwnedPostsCountAsc = 'newOwner_ownedPostsCount_ASC',
  NewOwnerOwnedPostsCountDesc = 'newOwner_ownedPostsCount_DESC',
  NewOwnerUpdatedAtBlockAsc = 'newOwner_updatedAtBlock_ASC',
  NewOwnerUpdatedAtBlockDesc = 'newOwner_updatedAtBlock_DESC',
  NewOwnerUpdatedAtTimeAsc = 'newOwner_updatedAtTime_ASC',
  NewOwnerUpdatedAtTimeDesc = 'newOwner_updatedAtTime_DESC',
  OldOwnerFollowersCountAsc = 'oldOwner_followersCount_ASC',
  OldOwnerFollowersCountDesc = 'oldOwner_followersCount_DESC',
  OldOwnerFollowingAccountsCountAsc = 'oldOwner_followingAccountsCount_ASC',
  OldOwnerFollowingAccountsCountDesc = 'oldOwner_followingAccountsCount_DESC',
  OldOwnerFollowingPostsCountAsc = 'oldOwner_followingPostsCount_ASC',
  OldOwnerFollowingPostsCountDesc = 'oldOwner_followingPostsCount_DESC',
  OldOwnerFollowingSpacesCountAsc = 'oldOwner_followingSpacesCount_ASC',
  OldOwnerFollowingSpacesCountDesc = 'oldOwner_followingSpacesCount_DESC',
  OldOwnerIdAsc = 'oldOwner_id_ASC',
  OldOwnerIdDesc = 'oldOwner_id_DESC',
  OldOwnerOwnedPostsCountAsc = 'oldOwner_ownedPostsCount_ASC',
  OldOwnerOwnedPostsCountDesc = 'oldOwner_ownedPostsCount_DESC',
  OldOwnerUpdatedAtBlockAsc = 'oldOwner_updatedAtBlock_ASC',
  OldOwnerUpdatedAtBlockDesc = 'oldOwner_updatedAtBlock_DESC',
  OldOwnerUpdatedAtTimeAsc = 'oldOwner_updatedAtTime_ASC',
  OldOwnerUpdatedAtTimeDesc = 'oldOwner_updatedAtTime_DESC',
  PostBodyAsc = 'post_body_ASC',
  PostBodyDesc = 'post_body_DESC',
  PostCanonicalAsc = 'post_canonical_ASC',
  PostCanonicalDesc = 'post_canonical_DESC',
  PostContentAsc = 'post_content_ASC',
  PostContentDesc = 'post_content_DESC',
  PostCreatedAtBlockAsc = 'post_createdAtBlock_ASC',
  PostCreatedAtBlockDesc = 'post_createdAtBlock_DESC',
  PostCreatedAtTimeAsc = 'post_createdAtTime_ASC',
  PostCreatedAtTimeDesc = 'post_createdAtTime_DESC',
  PostCreatedOnDayAsc = 'post_createdOnDay_ASC',
  PostCreatedOnDayDesc = 'post_createdOnDay_DESC',
  PostDownvotesCountAsc = 'post_downvotesCount_ASC',
  PostDownvotesCountDesc = 'post_downvotesCount_DESC',
  PostFollowersCountAsc = 'post_followersCount_ASC',
  PostFollowersCountDesc = 'post_followersCount_DESC',
  PostFormatAsc = 'post_format_ASC',
  PostFormatDesc = 'post_format_DESC',
  PostHiddenRepliesCountAsc = 'post_hiddenRepliesCount_ASC',
  PostHiddenRepliesCountDesc = 'post_hiddenRepliesCount_DESC',
  PostHiddenAsc = 'post_hidden_ASC',
  PostHiddenDesc = 'post_hidden_DESC',
  PostIdAsc = 'post_id_ASC',
  PostIdDesc = 'post_id_DESC',
  PostImageAsc = 'post_image_ASC',
  PostImageDesc = 'post_image_DESC',
  PostInReplyToKindAsc = 'post_inReplyToKind_ASC',
  PostInReplyToKindDesc = 'post_inReplyToKind_DESC',
  PostIsCommentAsc = 'post_isComment_ASC',
  PostIsCommentDesc = 'post_isComment_DESC',
  PostIsShowMoreAsc = 'post_isShowMore_ASC',
  PostIsShowMoreDesc = 'post_isShowMore_DESC',
  PostKindAsc = 'post_kind_ASC',
  PostKindDesc = 'post_kind_DESC',
  PostLinkAsc = 'post_link_ASC',
  PostLinkDesc = 'post_link_DESC',
  PostMetaAsc = 'post_meta_ASC',
  PostMetaDesc = 'post_meta_DESC',
  PostProposalIndexAsc = 'post_proposalIndex_ASC',
  PostProposalIndexDesc = 'post_proposalIndex_DESC',
  PostPublicRepliesCountAsc = 'post_publicRepliesCount_ASC',
  PostPublicRepliesCountDesc = 'post_publicRepliesCount_DESC',
  PostReactionsCountAsc = 'post_reactionsCount_ASC',
  PostReactionsCountDesc = 'post_reactionsCount_DESC',
  PostRepliesCountAsc = 'post_repliesCount_ASC',
  PostRepliesCountDesc = 'post_repliesCount_DESC',
  PostSharesCountAsc = 'post_sharesCount_ASC',
  PostSharesCountDesc = 'post_sharesCount_DESC',
  PostSlugAsc = 'post_slug_ASC',
  PostSlugDesc = 'post_slug_DESC',
  PostSummaryAsc = 'post_summary_ASC',
  PostSummaryDesc = 'post_summary_DESC',
  PostTagsOriginalAsc = 'post_tagsOriginal_ASC',
  PostTagsOriginalDesc = 'post_tagsOriginal_DESC',
  PostTitleAsc = 'post_title_ASC',
  PostTitleDesc = 'post_title_DESC',
  PostTweetIdAsc = 'post_tweetId_ASC',
  PostTweetIdDesc = 'post_tweetId_DESC',
  PostUpdatedAtTimeAsc = 'post_updatedAtTime_ASC',
  PostUpdatedAtTimeDesc = 'post_updatedAtTime_DESC',
  PostUpvotesCountAsc = 'post_upvotesCount_ASC',
  PostUpvotesCountDesc = 'post_upvotesCount_DESC',
  ReactionCreatedAtBlockAsc = 'reaction_createdAtBlock_ASC',
  ReactionCreatedAtBlockDesc = 'reaction_createdAtBlock_DESC',
  ReactionCreatedAtTimeAsc = 'reaction_createdAtTime_ASC',
  ReactionCreatedAtTimeDesc = 'reaction_createdAtTime_DESC',
  ReactionIdAsc = 'reaction_id_ASC',
  ReactionIdDesc = 'reaction_id_DESC',
  ReactionKindAsc = 'reaction_kind_ASC',
  ReactionKindDesc = 'reaction_kind_DESC',
  ReactionStatusAsc = 'reaction_status_ASC',
  ReactionStatusDesc = 'reaction_status_DESC',
  ReactionUpdatedAtBlockAsc = 'reaction_updatedAtBlock_ASC',
  ReactionUpdatedAtBlockDesc = 'reaction_updatedAtBlock_DESC',
  ReactionUpdatedAtTimeAsc = 'reaction_updatedAtTime_ASC',
  ReactionUpdatedAtTimeDesc = 'reaction_updatedAtTime_DESC',
  SpacePrevAboutAsc = 'spacePrev_about_ASC',
  SpacePrevAboutDesc = 'spacePrev_about_DESC',
  SpacePrevCanEveryoneCreatePostsAsc = 'spacePrev_canEveryoneCreatePosts_ASC',
  SpacePrevCanEveryoneCreatePostsDesc = 'spacePrev_canEveryoneCreatePosts_DESC',
  SpacePrevCanFollowerCreatePostsAsc = 'spacePrev_canFollowerCreatePosts_ASC',
  SpacePrevCanFollowerCreatePostsDesc = 'spacePrev_canFollowerCreatePosts_DESC',
  SpacePrevContentAsc = 'spacePrev_content_ASC',
  SpacePrevContentDesc = 'spacePrev_content_DESC',
  SpacePrevCreatedAtBlockAsc = 'spacePrev_createdAtBlock_ASC',
  SpacePrevCreatedAtBlockDesc = 'spacePrev_createdAtBlock_DESC',
  SpacePrevCreatedAtTimeAsc = 'spacePrev_createdAtTime_ASC',
  SpacePrevCreatedAtTimeDesc = 'spacePrev_createdAtTime_DESC',
  SpacePrevCreatedOnDayAsc = 'spacePrev_createdOnDay_ASC',
  SpacePrevCreatedOnDayDesc = 'spacePrev_createdOnDay_DESC',
  SpacePrevEmailAsc = 'spacePrev_email_ASC',
  SpacePrevEmailDesc = 'spacePrev_email_DESC',
  SpacePrevFollowersCountAsc = 'spacePrev_followersCount_ASC',
  SpacePrevFollowersCountDesc = 'spacePrev_followersCount_DESC',
  SpacePrevFormatAsc = 'spacePrev_format_ASC',
  SpacePrevFormatDesc = 'spacePrev_format_DESC',
  SpacePrevHandleAsc = 'spacePrev_handle_ASC',
  SpacePrevHandleDesc = 'spacePrev_handle_DESC',
  SpacePrevHiddenPostsCountAsc = 'spacePrev_hiddenPostsCount_ASC',
  SpacePrevHiddenPostsCountDesc = 'spacePrev_hiddenPostsCount_DESC',
  SpacePrevHiddenAsc = 'spacePrev_hidden_ASC',
  SpacePrevHiddenDesc = 'spacePrev_hidden_DESC',
  SpacePrevIdAsc = 'spacePrev_id_ASC',
  SpacePrevIdDesc = 'spacePrev_id_DESC',
  SpacePrevImageAsc = 'spacePrev_image_ASC',
  SpacePrevImageDesc = 'spacePrev_image_DESC',
  SpacePrevInterestsOriginalAsc = 'spacePrev_interestsOriginal_ASC',
  SpacePrevInterestsOriginalDesc = 'spacePrev_interestsOriginal_DESC',
  SpacePrevIsShowMoreAsc = 'spacePrev_isShowMore_ASC',
  SpacePrevIsShowMoreDesc = 'spacePrev_isShowMore_DESC',
  SpacePrevLinksOriginalAsc = 'spacePrev_linksOriginal_ASC',
  SpacePrevLinksOriginalDesc = 'spacePrev_linksOriginal_DESC',
  SpacePrevNameAsc = 'spacePrev_name_ASC',
  SpacePrevNameDesc = 'spacePrev_name_DESC',
  SpacePrevPostsCountAsc = 'spacePrev_postsCount_ASC',
  SpacePrevPostsCountDesc = 'spacePrev_postsCount_DESC',
  SpacePrevPublicPostsCountAsc = 'spacePrev_publicPostsCount_ASC',
  SpacePrevPublicPostsCountDesc = 'spacePrev_publicPostsCount_DESC',
  SpacePrevSummaryAsc = 'spacePrev_summary_ASC',
  SpacePrevSummaryDesc = 'spacePrev_summary_DESC',
  SpacePrevTagsOriginalAsc = 'spacePrev_tagsOriginal_ASC',
  SpacePrevTagsOriginalDesc = 'spacePrev_tagsOriginal_DESC',
  SpacePrevUpdatedAtBlockAsc = 'spacePrev_updatedAtBlock_ASC',
  SpacePrevUpdatedAtBlockDesc = 'spacePrev_updatedAtBlock_DESC',
  SpacePrevUpdatedAtTimeAsc = 'spacePrev_updatedAtTime_ASC',
  SpacePrevUpdatedAtTimeDesc = 'spacePrev_updatedAtTime_DESC',
  SpacePrevUsernameAsc = 'spacePrev_username_ASC',
  SpacePrevUsernameDesc = 'spacePrev_username_DESC',
  SpaceAboutAsc = 'space_about_ASC',
  SpaceAboutDesc = 'space_about_DESC',
  SpaceCanEveryoneCreatePostsAsc = 'space_canEveryoneCreatePosts_ASC',
  SpaceCanEveryoneCreatePostsDesc = 'space_canEveryoneCreatePosts_DESC',
  SpaceCanFollowerCreatePostsAsc = 'space_canFollowerCreatePosts_ASC',
  SpaceCanFollowerCreatePostsDesc = 'space_canFollowerCreatePosts_DESC',
  SpaceContentAsc = 'space_content_ASC',
  SpaceContentDesc = 'space_content_DESC',
  SpaceCreatedAtBlockAsc = 'space_createdAtBlock_ASC',
  SpaceCreatedAtBlockDesc = 'space_createdAtBlock_DESC',
  SpaceCreatedAtTimeAsc = 'space_createdAtTime_ASC',
  SpaceCreatedAtTimeDesc = 'space_createdAtTime_DESC',
  SpaceCreatedOnDayAsc = 'space_createdOnDay_ASC',
  SpaceCreatedOnDayDesc = 'space_createdOnDay_DESC',
  SpaceEmailAsc = 'space_email_ASC',
  SpaceEmailDesc = 'space_email_DESC',
  SpaceFollowersCountAsc = 'space_followersCount_ASC',
  SpaceFollowersCountDesc = 'space_followersCount_DESC',
  SpaceFormatAsc = 'space_format_ASC',
  SpaceFormatDesc = 'space_format_DESC',
  SpaceHandleAsc = 'space_handle_ASC',
  SpaceHandleDesc = 'space_handle_DESC',
  SpaceHiddenPostsCountAsc = 'space_hiddenPostsCount_ASC',
  SpaceHiddenPostsCountDesc = 'space_hiddenPostsCount_DESC',
  SpaceHiddenAsc = 'space_hidden_ASC',
  SpaceHiddenDesc = 'space_hidden_DESC',
  SpaceIdAsc = 'space_id_ASC',
  SpaceIdDesc = 'space_id_DESC',
  SpaceImageAsc = 'space_image_ASC',
  SpaceImageDesc = 'space_image_DESC',
  SpaceInterestsOriginalAsc = 'space_interestsOriginal_ASC',
  SpaceInterestsOriginalDesc = 'space_interestsOriginal_DESC',
  SpaceIsShowMoreAsc = 'space_isShowMore_ASC',
  SpaceIsShowMoreDesc = 'space_isShowMore_DESC',
  SpaceLinksOriginalAsc = 'space_linksOriginal_ASC',
  SpaceLinksOriginalDesc = 'space_linksOriginal_DESC',
  SpaceNameAsc = 'space_name_ASC',
  SpaceNameDesc = 'space_name_DESC',
  SpacePostsCountAsc = 'space_postsCount_ASC',
  SpacePostsCountDesc = 'space_postsCount_DESC',
  SpacePublicPostsCountAsc = 'space_publicPostsCount_ASC',
  SpacePublicPostsCountDesc = 'space_publicPostsCount_DESC',
  SpaceSummaryAsc = 'space_summary_ASC',
  SpaceSummaryDesc = 'space_summary_DESC',
  SpaceTagsOriginalAsc = 'space_tagsOriginal_ASC',
  SpaceTagsOriginalDesc = 'space_tagsOriginal_DESC',
  SpaceUpdatedAtBlockAsc = 'space_updatedAtBlock_ASC',
  SpaceUpdatedAtBlockDesc = 'space_updatedAtBlock_DESC',
  SpaceUpdatedAtTimeAsc = 'space_updatedAtTime_ASC',
  SpaceUpdatedAtTimeDesc = 'space_updatedAtTime_DESC',
  SpaceUsernameAsc = 'space_username_ASC',
  SpaceUsernameDesc = 'space_username_DESC',
  UsernameAsc = 'username_ASC',
  UsernameDesc = 'username_DESC'
}

export type ActivityWhereInput = {
  AND?: InputMaybe<Array<ActivityWhereInput>>;
  OR?: InputMaybe<Array<ActivityWhereInput>>;
  account?: InputMaybe<AccountWhereInput>;
  account_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  aggCount_eq?: InputMaybe<Scalars['BigInt']['input']>;
  aggCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  aggCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  aggCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  aggCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  aggCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  aggCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  aggCount_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  aggCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  aggregated_eq?: InputMaybe<Scalars['Boolean']['input']>;
  aggregated_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  aggregated_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_eq?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_eq?: InputMaybe<Scalars['DateTime']['input']>;
  date_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  date_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  date_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  domainRecipient?: InputMaybe<AccountWhereInput>;
  domainRecipient_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  eventIndex_eq?: InputMaybe<Scalars['Int']['input']>;
  eventIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  eventIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  eventIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  eventIndex_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  eventIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  eventIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  eventIndex_not_eq?: InputMaybe<Scalars['Int']['input']>;
  eventIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  event_eq?: InputMaybe<EventName>;
  event_in?: InputMaybe<Array<EventName>>;
  event_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  event_not_eq?: InputMaybe<EventName>;
  event_not_in?: InputMaybe<Array<EventName>>;
  extension?: InputMaybe<ContentExtensionWhereInput>;
  extension_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  followingAccount?: InputMaybe<AccountWhereInput>;
  followingAccount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  newOwner?: InputMaybe<AccountWhereInput>;
  newOwner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  oldOwner?: InputMaybe<AccountWhereInput>;
  oldOwner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  post?: InputMaybe<PostWhereInput>;
  post_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  reaction?: InputMaybe<ReactionWhereInput>;
  reaction_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  space?: InputMaybe<SpaceWhereInput>;
  spacePrev?: InputMaybe<SpaceWhereInput>;
  spacePrev_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  space_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  username_contains?: InputMaybe<Scalars['String']['input']>;
  username_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  username_endsWith?: InputMaybe<Scalars['String']['input']>;
  username_eq?: InputMaybe<Scalars['String']['input']>;
  username_gt?: InputMaybe<Scalars['String']['input']>;
  username_gte?: InputMaybe<Scalars['String']['input']>;
  username_in?: InputMaybe<Array<Scalars['String']['input']>>;
  username_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  username_lt?: InputMaybe<Scalars['String']['input']>;
  username_lte?: InputMaybe<Scalars['String']['input']>;
  username_not_contains?: InputMaybe<Scalars['String']['input']>;
  username_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  username_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  username_not_eq?: InputMaybe<Scalars['String']['input']>;
  username_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  username_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  username_startsWith?: InputMaybe<Scalars['String']['input']>;
};

/** The junction table for Many-to-Many relationship between follower Account and following Comment */
export type CommentFollowers = {
  __typename?: 'CommentFollowers';
  followerAccount: Account;
  followingComment: Post;
  id: Scalars['String']['output'];
};

export type CommentFollowersConnection = {
  __typename?: 'CommentFollowersConnection';
  edges: Array<CommentFollowersEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CommentFollowersEdge = {
  __typename?: 'CommentFollowersEdge';
  cursor: Scalars['String']['output'];
  node: CommentFollowers;
};

export enum CommentFollowersOrderByInput {
  FollowerAccountFollowersCountAsc = 'followerAccount_followersCount_ASC',
  FollowerAccountFollowersCountDesc = 'followerAccount_followersCount_DESC',
  FollowerAccountFollowingAccountsCountAsc = 'followerAccount_followingAccountsCount_ASC',
  FollowerAccountFollowingAccountsCountDesc = 'followerAccount_followingAccountsCount_DESC',
  FollowerAccountFollowingPostsCountAsc = 'followerAccount_followingPostsCount_ASC',
  FollowerAccountFollowingPostsCountDesc = 'followerAccount_followingPostsCount_DESC',
  FollowerAccountFollowingSpacesCountAsc = 'followerAccount_followingSpacesCount_ASC',
  FollowerAccountFollowingSpacesCountDesc = 'followerAccount_followingSpacesCount_DESC',
  FollowerAccountIdAsc = 'followerAccount_id_ASC',
  FollowerAccountIdDesc = 'followerAccount_id_DESC',
  FollowerAccountOwnedPostsCountAsc = 'followerAccount_ownedPostsCount_ASC',
  FollowerAccountOwnedPostsCountDesc = 'followerAccount_ownedPostsCount_DESC',
  FollowerAccountUpdatedAtBlockAsc = 'followerAccount_updatedAtBlock_ASC',
  FollowerAccountUpdatedAtBlockDesc = 'followerAccount_updatedAtBlock_DESC',
  FollowerAccountUpdatedAtTimeAsc = 'followerAccount_updatedAtTime_ASC',
  FollowerAccountUpdatedAtTimeDesc = 'followerAccount_updatedAtTime_DESC',
  FollowingCommentBodyAsc = 'followingComment_body_ASC',
  FollowingCommentBodyDesc = 'followingComment_body_DESC',
  FollowingCommentCanonicalAsc = 'followingComment_canonical_ASC',
  FollowingCommentCanonicalDesc = 'followingComment_canonical_DESC',
  FollowingCommentContentAsc = 'followingComment_content_ASC',
  FollowingCommentContentDesc = 'followingComment_content_DESC',
  FollowingCommentCreatedAtBlockAsc = 'followingComment_createdAtBlock_ASC',
  FollowingCommentCreatedAtBlockDesc = 'followingComment_createdAtBlock_DESC',
  FollowingCommentCreatedAtTimeAsc = 'followingComment_createdAtTime_ASC',
  FollowingCommentCreatedAtTimeDesc = 'followingComment_createdAtTime_DESC',
  FollowingCommentCreatedOnDayAsc = 'followingComment_createdOnDay_ASC',
  FollowingCommentCreatedOnDayDesc = 'followingComment_createdOnDay_DESC',
  FollowingCommentDownvotesCountAsc = 'followingComment_downvotesCount_ASC',
  FollowingCommentDownvotesCountDesc = 'followingComment_downvotesCount_DESC',
  FollowingCommentFollowersCountAsc = 'followingComment_followersCount_ASC',
  FollowingCommentFollowersCountDesc = 'followingComment_followersCount_DESC',
  FollowingCommentFormatAsc = 'followingComment_format_ASC',
  FollowingCommentFormatDesc = 'followingComment_format_DESC',
  FollowingCommentHiddenRepliesCountAsc = 'followingComment_hiddenRepliesCount_ASC',
  FollowingCommentHiddenRepliesCountDesc = 'followingComment_hiddenRepliesCount_DESC',
  FollowingCommentHiddenAsc = 'followingComment_hidden_ASC',
  FollowingCommentHiddenDesc = 'followingComment_hidden_DESC',
  FollowingCommentIdAsc = 'followingComment_id_ASC',
  FollowingCommentIdDesc = 'followingComment_id_DESC',
  FollowingCommentImageAsc = 'followingComment_image_ASC',
  FollowingCommentImageDesc = 'followingComment_image_DESC',
  FollowingCommentInReplyToKindAsc = 'followingComment_inReplyToKind_ASC',
  FollowingCommentInReplyToKindDesc = 'followingComment_inReplyToKind_DESC',
  FollowingCommentIsCommentAsc = 'followingComment_isComment_ASC',
  FollowingCommentIsCommentDesc = 'followingComment_isComment_DESC',
  FollowingCommentIsShowMoreAsc = 'followingComment_isShowMore_ASC',
  FollowingCommentIsShowMoreDesc = 'followingComment_isShowMore_DESC',
  FollowingCommentKindAsc = 'followingComment_kind_ASC',
  FollowingCommentKindDesc = 'followingComment_kind_DESC',
  FollowingCommentLinkAsc = 'followingComment_link_ASC',
  FollowingCommentLinkDesc = 'followingComment_link_DESC',
  FollowingCommentMetaAsc = 'followingComment_meta_ASC',
  FollowingCommentMetaDesc = 'followingComment_meta_DESC',
  FollowingCommentProposalIndexAsc = 'followingComment_proposalIndex_ASC',
  FollowingCommentProposalIndexDesc = 'followingComment_proposalIndex_DESC',
  FollowingCommentPublicRepliesCountAsc = 'followingComment_publicRepliesCount_ASC',
  FollowingCommentPublicRepliesCountDesc = 'followingComment_publicRepliesCount_DESC',
  FollowingCommentReactionsCountAsc = 'followingComment_reactionsCount_ASC',
  FollowingCommentReactionsCountDesc = 'followingComment_reactionsCount_DESC',
  FollowingCommentRepliesCountAsc = 'followingComment_repliesCount_ASC',
  FollowingCommentRepliesCountDesc = 'followingComment_repliesCount_DESC',
  FollowingCommentSharesCountAsc = 'followingComment_sharesCount_ASC',
  FollowingCommentSharesCountDesc = 'followingComment_sharesCount_DESC',
  FollowingCommentSlugAsc = 'followingComment_slug_ASC',
  FollowingCommentSlugDesc = 'followingComment_slug_DESC',
  FollowingCommentSummaryAsc = 'followingComment_summary_ASC',
  FollowingCommentSummaryDesc = 'followingComment_summary_DESC',
  FollowingCommentTagsOriginalAsc = 'followingComment_tagsOriginal_ASC',
  FollowingCommentTagsOriginalDesc = 'followingComment_tagsOriginal_DESC',
  FollowingCommentTitleAsc = 'followingComment_title_ASC',
  FollowingCommentTitleDesc = 'followingComment_title_DESC',
  FollowingCommentTweetIdAsc = 'followingComment_tweetId_ASC',
  FollowingCommentTweetIdDesc = 'followingComment_tweetId_DESC',
  FollowingCommentUpdatedAtTimeAsc = 'followingComment_updatedAtTime_ASC',
  FollowingCommentUpdatedAtTimeDesc = 'followingComment_updatedAtTime_DESC',
  FollowingCommentUpvotesCountAsc = 'followingComment_upvotesCount_ASC',
  FollowingCommentUpvotesCountDesc = 'followingComment_upvotesCount_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type CommentFollowersWhereInput = {
  AND?: InputMaybe<Array<CommentFollowersWhereInput>>;
  OR?: InputMaybe<Array<CommentFollowersWhereInput>>;
  followerAccount?: InputMaybe<AccountWhereInput>;
  followerAccount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  followingComment?: InputMaybe<PostWhereInput>;
  followingComment_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
};

/** Detailed information about the Tweet attached to a Post */
export type ContentExtension = {
  __typename?: 'ContentExtension';
  /** The amount of tokens transferred in the Donation transaction (actual for 'subsocial-donations") */
  amount?: Maybe<Scalars['BigInt']['output']>;
  /** The name of the blockchain that contains the attached NFT (actual for 'subsocial-evm-nft") */
  chain?: Maybe<Scalars['String']['output']>;
  /** The collection ID of the attached NFT (actual for 'subsocial-evm-nft") */
  collectionId?: Maybe<Scalars['String']['output']>;
  /** A One-To-One relationship with the Account entity of a ContentExtension's creator. */
  createdBy: Account;
  /** The decimals value of token transferred in the Donation transaction (actual for 'subsocial-donations") */
  decimals?: Maybe<Scalars['Int']['output']>;
  /** The ContentExtension properties schema ID. */
  extensionSchemaId: ContentExtensionSchemaId;
  /** The Evm Account of the sender of the Donation transaction (actual for 'subsocial-donations") */
  fromEvm?: Maybe<EvmAccount>;
  /** The Substrate Account of the sender of the Donation transaction (actual for 'subsocial-donations") */
  fromSubstrate?: Maybe<Account>;
  /**
   * The ContentExtension ID.
   * Consists of the parent post ID plus the index in the extensions list, which are attached to the Post.
   * (e.g. "4940-0")
   */
  id: Scalars['String']['output'];
  /** The URL or CID of attached image (actual for 'subsocial-image") */
  image?: Maybe<Scalars['String']['output']>;
  /** The message of secret Secret box (actual for 'subsocial-secret-box") */
  message?: Maybe<Scalars['String']['output']>;
  /** The ID of the attached NFT (actual for 'subsocial-evm-nft") */
  nftId?: Maybe<Scalars['String']['output']>;
  /** The nonce of encrypted Secret box (actual for 'subsocial-secret-box") */
  nonce?: Maybe<Scalars['String']['output']>;
  /** The Post where the extension was published. */
  parentPost: Post;
  /** The pinned posts list (actual for 'subsocial-pinned-posts") */
  pinnedResources: Array<ExtensionPinnedResource>;
  /** The recipient Account of Secret box message (actual for 'subsocial-secret-box") */
  recipient?: Maybe<Account>;
  /** The Evm Account of the target (recipient) of the Donation transaction (actual for 'subsocial-donations") */
  toEvm?: Maybe<EvmAccount>;
  /** The Substrate Account of the target (recipient) of the Donation transaction (actual for 'subsocial-donations") */
  toSubstrate?: Maybe<Account>;
  /** The name of the token transferred in the Donation transaction (actual for 'subsocial-donations") */
  token?: Maybe<Scalars['String']['output']>;
  /** The transaction hash of the Donation transfer (actual for 'subsocial-donations") */
  txHash?: Maybe<Scalars['String']['output']>;
  /** The URL of the attached NFT (actual for 'subsocial-evm-nft") */
  url?: Maybe<Scalars['String']['output']>;
};


/** Detailed information about the Tweet attached to a Post */
export type ContentExtensionPinnedResourcesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ExtensionPinnedResourceOrderByInput>>;
  where?: InputMaybe<ExtensionPinnedResourceWhereInput>;
};

export type ContentExtensionEdge = {
  __typename?: 'ContentExtensionEdge';
  cursor: Scalars['String']['output'];
  node: ContentExtension;
};

export enum ContentExtensionOrderByInput {
  AmountAsc = 'amount_ASC',
  AmountDesc = 'amount_DESC',
  ChainAsc = 'chain_ASC',
  ChainDesc = 'chain_DESC',
  CollectionIdAsc = 'collectionId_ASC',
  CollectionIdDesc = 'collectionId_DESC',
  CreatedByFollowersCountAsc = 'createdBy_followersCount_ASC',
  CreatedByFollowersCountDesc = 'createdBy_followersCount_DESC',
  CreatedByFollowingAccountsCountAsc = 'createdBy_followingAccountsCount_ASC',
  CreatedByFollowingAccountsCountDesc = 'createdBy_followingAccountsCount_DESC',
  CreatedByFollowingPostsCountAsc = 'createdBy_followingPostsCount_ASC',
  CreatedByFollowingPostsCountDesc = 'createdBy_followingPostsCount_DESC',
  CreatedByFollowingSpacesCountAsc = 'createdBy_followingSpacesCount_ASC',
  CreatedByFollowingSpacesCountDesc = 'createdBy_followingSpacesCount_DESC',
  CreatedByIdAsc = 'createdBy_id_ASC',
  CreatedByIdDesc = 'createdBy_id_DESC',
  CreatedByOwnedPostsCountAsc = 'createdBy_ownedPostsCount_ASC',
  CreatedByOwnedPostsCountDesc = 'createdBy_ownedPostsCount_DESC',
  CreatedByUpdatedAtBlockAsc = 'createdBy_updatedAtBlock_ASC',
  CreatedByUpdatedAtBlockDesc = 'createdBy_updatedAtBlock_DESC',
  CreatedByUpdatedAtTimeAsc = 'createdBy_updatedAtTime_ASC',
  CreatedByUpdatedAtTimeDesc = 'createdBy_updatedAtTime_DESC',
  DecimalsAsc = 'decimals_ASC',
  DecimalsDesc = 'decimals_DESC',
  ExtensionSchemaIdAsc = 'extensionSchemaId_ASC',
  ExtensionSchemaIdDesc = 'extensionSchemaId_DESC',
  FromEvmIdAsc = 'fromEvm_id_ASC',
  FromEvmIdDesc = 'fromEvm_id_DESC',
  FromSubstrateFollowersCountAsc = 'fromSubstrate_followersCount_ASC',
  FromSubstrateFollowersCountDesc = 'fromSubstrate_followersCount_DESC',
  FromSubstrateFollowingAccountsCountAsc = 'fromSubstrate_followingAccountsCount_ASC',
  FromSubstrateFollowingAccountsCountDesc = 'fromSubstrate_followingAccountsCount_DESC',
  FromSubstrateFollowingPostsCountAsc = 'fromSubstrate_followingPostsCount_ASC',
  FromSubstrateFollowingPostsCountDesc = 'fromSubstrate_followingPostsCount_DESC',
  FromSubstrateFollowingSpacesCountAsc = 'fromSubstrate_followingSpacesCount_ASC',
  FromSubstrateFollowingSpacesCountDesc = 'fromSubstrate_followingSpacesCount_DESC',
  FromSubstrateIdAsc = 'fromSubstrate_id_ASC',
  FromSubstrateIdDesc = 'fromSubstrate_id_DESC',
  FromSubstrateOwnedPostsCountAsc = 'fromSubstrate_ownedPostsCount_ASC',
  FromSubstrateOwnedPostsCountDesc = 'fromSubstrate_ownedPostsCount_DESC',
  FromSubstrateUpdatedAtBlockAsc = 'fromSubstrate_updatedAtBlock_ASC',
  FromSubstrateUpdatedAtBlockDesc = 'fromSubstrate_updatedAtBlock_DESC',
  FromSubstrateUpdatedAtTimeAsc = 'fromSubstrate_updatedAtTime_ASC',
  FromSubstrateUpdatedAtTimeDesc = 'fromSubstrate_updatedAtTime_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  MessageAsc = 'message_ASC',
  MessageDesc = 'message_DESC',
  NftIdAsc = 'nftId_ASC',
  NftIdDesc = 'nftId_DESC',
  NonceAsc = 'nonce_ASC',
  NonceDesc = 'nonce_DESC',
  ParentPostBodyAsc = 'parentPost_body_ASC',
  ParentPostBodyDesc = 'parentPost_body_DESC',
  ParentPostCanonicalAsc = 'parentPost_canonical_ASC',
  ParentPostCanonicalDesc = 'parentPost_canonical_DESC',
  ParentPostContentAsc = 'parentPost_content_ASC',
  ParentPostContentDesc = 'parentPost_content_DESC',
  ParentPostCreatedAtBlockAsc = 'parentPost_createdAtBlock_ASC',
  ParentPostCreatedAtBlockDesc = 'parentPost_createdAtBlock_DESC',
  ParentPostCreatedAtTimeAsc = 'parentPost_createdAtTime_ASC',
  ParentPostCreatedAtTimeDesc = 'parentPost_createdAtTime_DESC',
  ParentPostCreatedOnDayAsc = 'parentPost_createdOnDay_ASC',
  ParentPostCreatedOnDayDesc = 'parentPost_createdOnDay_DESC',
  ParentPostDownvotesCountAsc = 'parentPost_downvotesCount_ASC',
  ParentPostDownvotesCountDesc = 'parentPost_downvotesCount_DESC',
  ParentPostFollowersCountAsc = 'parentPost_followersCount_ASC',
  ParentPostFollowersCountDesc = 'parentPost_followersCount_DESC',
  ParentPostFormatAsc = 'parentPost_format_ASC',
  ParentPostFormatDesc = 'parentPost_format_DESC',
  ParentPostHiddenRepliesCountAsc = 'parentPost_hiddenRepliesCount_ASC',
  ParentPostHiddenRepliesCountDesc = 'parentPost_hiddenRepliesCount_DESC',
  ParentPostHiddenAsc = 'parentPost_hidden_ASC',
  ParentPostHiddenDesc = 'parentPost_hidden_DESC',
  ParentPostIdAsc = 'parentPost_id_ASC',
  ParentPostIdDesc = 'parentPost_id_DESC',
  ParentPostImageAsc = 'parentPost_image_ASC',
  ParentPostImageDesc = 'parentPost_image_DESC',
  ParentPostInReplyToKindAsc = 'parentPost_inReplyToKind_ASC',
  ParentPostInReplyToKindDesc = 'parentPost_inReplyToKind_DESC',
  ParentPostIsCommentAsc = 'parentPost_isComment_ASC',
  ParentPostIsCommentDesc = 'parentPost_isComment_DESC',
  ParentPostIsShowMoreAsc = 'parentPost_isShowMore_ASC',
  ParentPostIsShowMoreDesc = 'parentPost_isShowMore_DESC',
  ParentPostKindAsc = 'parentPost_kind_ASC',
  ParentPostKindDesc = 'parentPost_kind_DESC',
  ParentPostLinkAsc = 'parentPost_link_ASC',
  ParentPostLinkDesc = 'parentPost_link_DESC',
  ParentPostMetaAsc = 'parentPost_meta_ASC',
  ParentPostMetaDesc = 'parentPost_meta_DESC',
  ParentPostProposalIndexAsc = 'parentPost_proposalIndex_ASC',
  ParentPostProposalIndexDesc = 'parentPost_proposalIndex_DESC',
  ParentPostPublicRepliesCountAsc = 'parentPost_publicRepliesCount_ASC',
  ParentPostPublicRepliesCountDesc = 'parentPost_publicRepliesCount_DESC',
  ParentPostReactionsCountAsc = 'parentPost_reactionsCount_ASC',
  ParentPostReactionsCountDesc = 'parentPost_reactionsCount_DESC',
  ParentPostRepliesCountAsc = 'parentPost_repliesCount_ASC',
  ParentPostRepliesCountDesc = 'parentPost_repliesCount_DESC',
  ParentPostSharesCountAsc = 'parentPost_sharesCount_ASC',
  ParentPostSharesCountDesc = 'parentPost_sharesCount_DESC',
  ParentPostSlugAsc = 'parentPost_slug_ASC',
  ParentPostSlugDesc = 'parentPost_slug_DESC',
  ParentPostSummaryAsc = 'parentPost_summary_ASC',
  ParentPostSummaryDesc = 'parentPost_summary_DESC',
  ParentPostTagsOriginalAsc = 'parentPost_tagsOriginal_ASC',
  ParentPostTagsOriginalDesc = 'parentPost_tagsOriginal_DESC',
  ParentPostTitleAsc = 'parentPost_title_ASC',
  ParentPostTitleDesc = 'parentPost_title_DESC',
  ParentPostTweetIdAsc = 'parentPost_tweetId_ASC',
  ParentPostTweetIdDesc = 'parentPost_tweetId_DESC',
  ParentPostUpdatedAtTimeAsc = 'parentPost_updatedAtTime_ASC',
  ParentPostUpdatedAtTimeDesc = 'parentPost_updatedAtTime_DESC',
  ParentPostUpvotesCountAsc = 'parentPost_upvotesCount_ASC',
  ParentPostUpvotesCountDesc = 'parentPost_upvotesCount_DESC',
  RecipientFollowersCountAsc = 'recipient_followersCount_ASC',
  RecipientFollowersCountDesc = 'recipient_followersCount_DESC',
  RecipientFollowingAccountsCountAsc = 'recipient_followingAccountsCount_ASC',
  RecipientFollowingAccountsCountDesc = 'recipient_followingAccountsCount_DESC',
  RecipientFollowingPostsCountAsc = 'recipient_followingPostsCount_ASC',
  RecipientFollowingPostsCountDesc = 'recipient_followingPostsCount_DESC',
  RecipientFollowingSpacesCountAsc = 'recipient_followingSpacesCount_ASC',
  RecipientFollowingSpacesCountDesc = 'recipient_followingSpacesCount_DESC',
  RecipientIdAsc = 'recipient_id_ASC',
  RecipientIdDesc = 'recipient_id_DESC',
  RecipientOwnedPostsCountAsc = 'recipient_ownedPostsCount_ASC',
  RecipientOwnedPostsCountDesc = 'recipient_ownedPostsCount_DESC',
  RecipientUpdatedAtBlockAsc = 'recipient_updatedAtBlock_ASC',
  RecipientUpdatedAtBlockDesc = 'recipient_updatedAtBlock_DESC',
  RecipientUpdatedAtTimeAsc = 'recipient_updatedAtTime_ASC',
  RecipientUpdatedAtTimeDesc = 'recipient_updatedAtTime_DESC',
  ToEvmIdAsc = 'toEvm_id_ASC',
  ToEvmIdDesc = 'toEvm_id_DESC',
  ToSubstrateFollowersCountAsc = 'toSubstrate_followersCount_ASC',
  ToSubstrateFollowersCountDesc = 'toSubstrate_followersCount_DESC',
  ToSubstrateFollowingAccountsCountAsc = 'toSubstrate_followingAccountsCount_ASC',
  ToSubstrateFollowingAccountsCountDesc = 'toSubstrate_followingAccountsCount_DESC',
  ToSubstrateFollowingPostsCountAsc = 'toSubstrate_followingPostsCount_ASC',
  ToSubstrateFollowingPostsCountDesc = 'toSubstrate_followingPostsCount_DESC',
  ToSubstrateFollowingSpacesCountAsc = 'toSubstrate_followingSpacesCount_ASC',
  ToSubstrateFollowingSpacesCountDesc = 'toSubstrate_followingSpacesCount_DESC',
  ToSubstrateIdAsc = 'toSubstrate_id_ASC',
  ToSubstrateIdDesc = 'toSubstrate_id_DESC',
  ToSubstrateOwnedPostsCountAsc = 'toSubstrate_ownedPostsCount_ASC',
  ToSubstrateOwnedPostsCountDesc = 'toSubstrate_ownedPostsCount_DESC',
  ToSubstrateUpdatedAtBlockAsc = 'toSubstrate_updatedAtBlock_ASC',
  ToSubstrateUpdatedAtBlockDesc = 'toSubstrate_updatedAtBlock_DESC',
  ToSubstrateUpdatedAtTimeAsc = 'toSubstrate_updatedAtTime_ASC',
  ToSubstrateUpdatedAtTimeDesc = 'toSubstrate_updatedAtTime_DESC',
  TokenAsc = 'token_ASC',
  TokenDesc = 'token_DESC',
  TxHashAsc = 'txHash_ASC',
  TxHashDesc = 'txHash_DESC',
  UrlAsc = 'url_ASC',
  UrlDesc = 'url_DESC'
}

/** The schema ID of the content extensions. */
export enum ContentExtensionSchemaId {
  SubsocialDecodedPromo = 'subsocial_decoded_promo',
  SubsocialDonations = 'subsocial_donations',
  SubsocialEvmNft = 'subsocial_evm_nft',
  SubsocialImage = 'subsocial_image',
  SubsocialPinnedPosts = 'subsocial_pinned_posts',
  SubsocialSecretBox = 'subsocial_secret_box'
}

export type ContentExtensionWhereInput = {
  AND?: InputMaybe<Array<ContentExtensionWhereInput>>;
  OR?: InputMaybe<Array<ContentExtensionWhereInput>>;
  amount_eq?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  chain_contains?: InputMaybe<Scalars['String']['input']>;
  chain_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  chain_endsWith?: InputMaybe<Scalars['String']['input']>;
  chain_eq?: InputMaybe<Scalars['String']['input']>;
  chain_gt?: InputMaybe<Scalars['String']['input']>;
  chain_gte?: InputMaybe<Scalars['String']['input']>;
  chain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  chain_lt?: InputMaybe<Scalars['String']['input']>;
  chain_lte?: InputMaybe<Scalars['String']['input']>;
  chain_not_contains?: InputMaybe<Scalars['String']['input']>;
  chain_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  chain_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  chain_not_eq?: InputMaybe<Scalars['String']['input']>;
  chain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  chain_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  chain_startsWith?: InputMaybe<Scalars['String']['input']>;
  collectionId_contains?: InputMaybe<Scalars['String']['input']>;
  collectionId_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  collectionId_endsWith?: InputMaybe<Scalars['String']['input']>;
  collectionId_eq?: InputMaybe<Scalars['String']['input']>;
  collectionId_gt?: InputMaybe<Scalars['String']['input']>;
  collectionId_gte?: InputMaybe<Scalars['String']['input']>;
  collectionId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collectionId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  collectionId_lt?: InputMaybe<Scalars['String']['input']>;
  collectionId_lte?: InputMaybe<Scalars['String']['input']>;
  collectionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  collectionId_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  collectionId_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  collectionId_not_eq?: InputMaybe<Scalars['String']['input']>;
  collectionId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collectionId_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  collectionId_startsWith?: InputMaybe<Scalars['String']['input']>;
  createdBy?: InputMaybe<AccountWhereInput>;
  createdBy_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  decimals_eq?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_eq?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  extensionSchemaId_eq?: InputMaybe<ContentExtensionSchemaId>;
  extensionSchemaId_in?: InputMaybe<Array<ContentExtensionSchemaId>>;
  extensionSchemaId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  extensionSchemaId_not_eq?: InputMaybe<ContentExtensionSchemaId>;
  extensionSchemaId_not_in?: InputMaybe<Array<ContentExtensionSchemaId>>;
  fromEvm?: InputMaybe<EvmAccountWhereInput>;
  fromEvm_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  fromSubstrate?: InputMaybe<AccountWhereInput>;
  fromSubstrate_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_contains?: InputMaybe<Scalars['String']['input']>;
  image_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_eq?: InputMaybe<Scalars['String']['input']>;
  image_gt?: InputMaybe<Scalars['String']['input']>;
  image_gte?: InputMaybe<Scalars['String']['input']>;
  image_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  image_lt?: InputMaybe<Scalars['String']['input']>;
  image_lte?: InputMaybe<Scalars['String']['input']>;
  image_not_contains?: InputMaybe<Scalars['String']['input']>;
  image_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_not_eq?: InputMaybe<Scalars['String']['input']>;
  image_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_startsWith?: InputMaybe<Scalars['String']['input']>;
  message_contains?: InputMaybe<Scalars['String']['input']>;
  message_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  message_endsWith?: InputMaybe<Scalars['String']['input']>;
  message_eq?: InputMaybe<Scalars['String']['input']>;
  message_gt?: InputMaybe<Scalars['String']['input']>;
  message_gte?: InputMaybe<Scalars['String']['input']>;
  message_in?: InputMaybe<Array<Scalars['String']['input']>>;
  message_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  message_lt?: InputMaybe<Scalars['String']['input']>;
  message_lte?: InputMaybe<Scalars['String']['input']>;
  message_not_contains?: InputMaybe<Scalars['String']['input']>;
  message_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  message_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  message_not_eq?: InputMaybe<Scalars['String']['input']>;
  message_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  message_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  message_startsWith?: InputMaybe<Scalars['String']['input']>;
  nftId_contains?: InputMaybe<Scalars['String']['input']>;
  nftId_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  nftId_endsWith?: InputMaybe<Scalars['String']['input']>;
  nftId_eq?: InputMaybe<Scalars['String']['input']>;
  nftId_gt?: InputMaybe<Scalars['String']['input']>;
  nftId_gte?: InputMaybe<Scalars['String']['input']>;
  nftId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nftId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  nftId_lt?: InputMaybe<Scalars['String']['input']>;
  nftId_lte?: InputMaybe<Scalars['String']['input']>;
  nftId_not_contains?: InputMaybe<Scalars['String']['input']>;
  nftId_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  nftId_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  nftId_not_eq?: InputMaybe<Scalars['String']['input']>;
  nftId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nftId_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  nftId_startsWith?: InputMaybe<Scalars['String']['input']>;
  nonce_contains?: InputMaybe<Scalars['String']['input']>;
  nonce_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  nonce_endsWith?: InputMaybe<Scalars['String']['input']>;
  nonce_eq?: InputMaybe<Scalars['String']['input']>;
  nonce_gt?: InputMaybe<Scalars['String']['input']>;
  nonce_gte?: InputMaybe<Scalars['String']['input']>;
  nonce_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nonce_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  nonce_lt?: InputMaybe<Scalars['String']['input']>;
  nonce_lte?: InputMaybe<Scalars['String']['input']>;
  nonce_not_contains?: InputMaybe<Scalars['String']['input']>;
  nonce_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  nonce_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  nonce_not_eq?: InputMaybe<Scalars['String']['input']>;
  nonce_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  nonce_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  nonce_startsWith?: InputMaybe<Scalars['String']['input']>;
  parentPost?: InputMaybe<PostWhereInput>;
  parentPost_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  pinnedResources_every?: InputMaybe<ExtensionPinnedResourceWhereInput>;
  pinnedResources_none?: InputMaybe<ExtensionPinnedResourceWhereInput>;
  pinnedResources_some?: InputMaybe<ExtensionPinnedResourceWhereInput>;
  recipient?: InputMaybe<AccountWhereInput>;
  recipient_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  toEvm?: InputMaybe<EvmAccountWhereInput>;
  toEvm_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  toSubstrate?: InputMaybe<AccountWhereInput>;
  toSubstrate_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  token_endsWith?: InputMaybe<Scalars['String']['input']>;
  token_eq?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  token_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  token_not_eq?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  token_startsWith?: InputMaybe<Scalars['String']['input']>;
  txHash_contains?: InputMaybe<Scalars['String']['input']>;
  txHash_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  txHash_endsWith?: InputMaybe<Scalars['String']['input']>;
  txHash_eq?: InputMaybe<Scalars['String']['input']>;
  txHash_gt?: InputMaybe<Scalars['String']['input']>;
  txHash_gte?: InputMaybe<Scalars['String']['input']>;
  txHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txHash_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  txHash_lt?: InputMaybe<Scalars['String']['input']>;
  txHash_lte?: InputMaybe<Scalars['String']['input']>;
  txHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  txHash_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  txHash_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  txHash_not_eq?: InputMaybe<Scalars['String']['input']>;
  txHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  txHash_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  txHash_startsWith?: InputMaybe<Scalars['String']['input']>;
  url_contains?: InputMaybe<Scalars['String']['input']>;
  url_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  url_endsWith?: InputMaybe<Scalars['String']['input']>;
  url_eq?: InputMaybe<Scalars['String']['input']>;
  url_gt?: InputMaybe<Scalars['String']['input']>;
  url_gte?: InputMaybe<Scalars['String']['input']>;
  url_in?: InputMaybe<Array<Scalars['String']['input']>>;
  url_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  url_lt?: InputMaybe<Scalars['String']['input']>;
  url_lte?: InputMaybe<Scalars['String']['input']>;
  url_not_contains?: InputMaybe<Scalars['String']['input']>;
  url_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  url_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  url_not_eq?: InputMaybe<Scalars['String']['input']>;
  url_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  url_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  url_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type ContentExtensionsConnection = {
  __typename?: 'ContentExtensionsConnection';
  edges: Array<ContentExtensionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type EsError = {
  __typename?: 'ESError';
  /** Error message text message. */
  reason: Scalars['String']['output'];
  /** Error status code. */
  status?: Maybe<Scalars['Int']['output']>;
};

export enum ElasticSearchIndexType {
  All = 'all',
  Posts = 'posts',
  Spaces = 'spaces'
}

export type ElasticSearchQueryResultEntity = {
  __typename?: 'ElasticSearchQueryResultEntity';
  /** Occurred error. */
  err?: Maybe<EsError>;
  /** Search results list. */
  hits: Array<Maybe<HitItem>>;
  /** General information about particular search query result. */
  total: SearchTotals;
};

/**
 * # enum EventName
 *
 * The squid tracks these on-chain events:
 *   * Posts.PostCreated
 *   * Posts.PostUpdated
 *   * Posts.PostMoved
 *   * Reactions.PostReactionCreated
 *   * Reactions.PostReactionUpdated
 *   * Reactions.PostReactionDeleted
 *   * Spaces.SpaceCreated
 *   * Spaces.SpaceUpdated
 *   * Profiles.ProfileUpdated
 *   * SpaceFollows.SpaceFollowed
 *   * SpaceFollows.SpaceUnfollowed
 *   * SpaceOwnership.SpaceOwnershipTransferAccepted
 *   * AccountFollows.AccountFollowed
 *   * AccountFollows.AccountUnfollowed
 *   * Domains.DomainRegistered
 *   * Domains.DomainMetaUpdated
 *   * EvmAddressUnlinkedFromAccount
 *   * EvmAddressLinkedToAccount
 *
 * ***
 *
 * However, some of the on-chain events have multiple logical meanings.
 * As a result, the squid uses synthetic events in addition to native on-chain events.
 *
 * > **"Synthetic event"** - a logical event which does not exist on the blockchain and can
 * > generated by a blockchain event with specific data conditions.
 *
 * ### The events available on the squid are:
 * * PostCreated
 * * PostDeleted - *synthetic*
 * * PostUpdated
 * * PostShared -  *synthetic*
 * * PostMoved
 * * PostFollowed - *synthetic*
 * * PostUnfollowed - *synthetic*
 * * PostReactionCreated
 * * PostReactionUpdated
 * * PostReactionDeleted
 * * SpaceCreated
 * * SpaceUpdated
 * * SpaceFollowed
 * * SpaceUnfollowed
 * * SpaceOwnershipTransferAccepted
 * * SpaceOwnershipTransferCreated
 * * AccountFollowed
 * * AccountUnfollowed
 * * ProfileUpdated
 * * CommentCreated - *synthetic*
 * * CommentDeleted - *synthetic*
 * * CommentUpdated - *synthetic*
 * * CommentShared - *synthetic*
 * * CommentReactionCreated - *synthetic*
 * * CommentReactionUpdated - *synthetic*
 * * CommentReactionDeleted - *synthetic*
 * * CommentReplyCreated - *synthetic*
 * * CommentReplyDeleted - *synthetic*
 * * CommentReplyUpdated - *synthetic*
 * * CommentReplyShared - *synthetic*
 * * CommentReplyReactionCreated - *synthetic*
 * * CommentReplyReactionUpdated - *synthetic*
 * * CommentReplyReactionDeleted - *synthetic*
 * * UserNameRegistered - *synthetic*
 * * UserNameUpdated - *synthetic*
 * * ExtensionDonationCreated - *synthetic*
 * * ExtensionEvmNftShared - *synthetic*
 * * ExtensionImageCreated - *synthetic*
 * * ExtensionSecretBoxCreated - *synthetic*
 * * ExtensionPinnedPostsCreated - *synthetic*
 * * EvmAddressLinkedToAccount
 * * EvmAddressUnlinkedFromAccount
 */
export enum EventName {
  AccountFollowed = 'AccountFollowed',
  AccountUnfollowed = 'AccountUnfollowed',
  CommentCreated = 'CommentCreated',
  CommentDeleted = 'CommentDeleted',
  CommentFollowed = 'CommentFollowed',
  CommentReactionCreated = 'CommentReactionCreated',
  CommentReactionDeleted = 'CommentReactionDeleted',
  CommentReactionUpdated = 'CommentReactionUpdated',
  CommentReplyCreated = 'CommentReplyCreated',
  CommentReplyDeleted = 'CommentReplyDeleted',
  CommentReplyReactionCreated = 'CommentReplyReactionCreated',
  CommentReplyReactionDeleted = 'CommentReplyReactionDeleted',
  CommentReplyReactionUpdated = 'CommentReplyReactionUpdated',
  CommentReplyShared = 'CommentReplyShared',
  CommentReplyUpdated = 'CommentReplyUpdated',
  CommentShared = 'CommentShared',
  CommentUnfollowed = 'CommentUnfollowed',
  CommentUpdated = 'CommentUpdated',
  EvmAddressLinkedToAccount = 'EvmAddressLinkedToAccount',
  EvmAddressUnlinkedFromAccount = 'EvmAddressUnlinkedFromAccount',
  ExtensionDonationCreated = 'ExtensionDonationCreated',
  ExtensionEvmNftShared = 'ExtensionEvmNftShared',
  ExtensionImageCreated = 'ExtensionImageCreated',
  ExtensionPinnedPostsCreated = 'ExtensionPinnedPostsCreated',
  ExtensionSecretBoxCreated = 'ExtensionSecretBoxCreated',
  PostCreated = 'PostCreated',
  PostDeleted = 'PostDeleted',
  PostFollowed = 'PostFollowed',
  PostMoved = 'PostMoved',
  PostReactionCreated = 'PostReactionCreated',
  PostReactionDeleted = 'PostReactionDeleted',
  PostReactionUpdated = 'PostReactionUpdated',
  PostShared = 'PostShared',
  PostUnfollowed = 'PostUnfollowed',
  PostUpdated = 'PostUpdated',
  ProfileUpdated = 'ProfileUpdated',
  SpaceCreated = 'SpaceCreated',
  SpaceFollowed = 'SpaceFollowed',
  SpaceOwnershipTransferAccepted = 'SpaceOwnershipTransferAccepted',
  SpaceOwnershipTransferCreated = 'SpaceOwnershipTransferCreated',
  SpaceUnfollowed = 'SpaceUnfollowed',
  SpaceUpdated = 'SpaceUpdated',
  UserNameRegistered = 'UserNameRegistered',
  UserNameUpdated = 'UserNameUpdated'
}

/** The Evm Account entity */
export type EvmAccount = {
  __typename?: 'EvmAccount';
  /** The account's Evm address */
  id: Scalars['String']['output'];
  /** A list of linked Substrate Accounts */
  linkedSubstrateAccounts: Array<EvmSubstrateAccountLink>;
};


/** The Evm Account entity */
export type EvmAccountLinkedSubstrateAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EvmSubstrateAccountLinkOrderByInput>>;
  where?: InputMaybe<EvmSubstrateAccountLinkWhereInput>;
};

export type EvmAccountEdge = {
  __typename?: 'EvmAccountEdge';
  cursor: Scalars['String']['output'];
  node: EvmAccount;
};

export enum EvmAccountOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type EvmAccountWhereInput = {
  AND?: InputMaybe<Array<EvmAccountWhereInput>>;
  OR?: InputMaybe<Array<EvmAccountWhereInput>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  linkedSubstrateAccounts_every?: InputMaybe<EvmSubstrateAccountLinkWhereInput>;
  linkedSubstrateAccounts_none?: InputMaybe<EvmSubstrateAccountLinkWhereInput>;
  linkedSubstrateAccounts_some?: InputMaybe<EvmSubstrateAccountLinkWhereInput>;
};

export type EvmAccountsConnection = {
  __typename?: 'EvmAccountsConnection';
  edges: Array<EvmAccountEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** The junction table for Many-to-Many relationship between Substrate Accounts and Ethereum Accounts */
export type EvmSubstrateAccountLink = {
  __typename?: 'EvmSubstrateAccountLink';
  /** Is the link of this particular account active? (This is necessary for the soft deletion of the link.) */
  active: Scalars['Boolean']['output'];
  /** The block height when a EvmSubstrateAccountLink was created. */
  createdAtBlock?: Maybe<Scalars['BigInt']['output']>;
  /** The DateTime when a EvmSubstrateAccountLink was created. */
  createdAtTime?: Maybe<Scalars['DateTime']['output']>;
  /** Evm account */
  evmAccount: EvmAccount;
  id: Scalars['String']['output'];
  /** Substrate account */
  substrateAccount: Account;
};

export type EvmSubstrateAccountLinkEdge = {
  __typename?: 'EvmSubstrateAccountLinkEdge';
  cursor: Scalars['String']['output'];
  node: EvmSubstrateAccountLink;
};

export enum EvmSubstrateAccountLinkOrderByInput {
  ActiveAsc = 'active_ASC',
  ActiveDesc = 'active_DESC',
  CreatedAtBlockAsc = 'createdAtBlock_ASC',
  CreatedAtBlockDesc = 'createdAtBlock_DESC',
  CreatedAtTimeAsc = 'createdAtTime_ASC',
  CreatedAtTimeDesc = 'createdAtTime_DESC',
  EvmAccountIdAsc = 'evmAccount_id_ASC',
  EvmAccountIdDesc = 'evmAccount_id_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  SubstrateAccountFollowersCountAsc = 'substrateAccount_followersCount_ASC',
  SubstrateAccountFollowersCountDesc = 'substrateAccount_followersCount_DESC',
  SubstrateAccountFollowingAccountsCountAsc = 'substrateAccount_followingAccountsCount_ASC',
  SubstrateAccountFollowingAccountsCountDesc = 'substrateAccount_followingAccountsCount_DESC',
  SubstrateAccountFollowingPostsCountAsc = 'substrateAccount_followingPostsCount_ASC',
  SubstrateAccountFollowingPostsCountDesc = 'substrateAccount_followingPostsCount_DESC',
  SubstrateAccountFollowingSpacesCountAsc = 'substrateAccount_followingSpacesCount_ASC',
  SubstrateAccountFollowingSpacesCountDesc = 'substrateAccount_followingSpacesCount_DESC',
  SubstrateAccountIdAsc = 'substrateAccount_id_ASC',
  SubstrateAccountIdDesc = 'substrateAccount_id_DESC',
  SubstrateAccountOwnedPostsCountAsc = 'substrateAccount_ownedPostsCount_ASC',
  SubstrateAccountOwnedPostsCountDesc = 'substrateAccount_ownedPostsCount_DESC',
  SubstrateAccountUpdatedAtBlockAsc = 'substrateAccount_updatedAtBlock_ASC',
  SubstrateAccountUpdatedAtBlockDesc = 'substrateAccount_updatedAtBlock_DESC',
  SubstrateAccountUpdatedAtTimeAsc = 'substrateAccount_updatedAtTime_ASC',
  SubstrateAccountUpdatedAtTimeDesc = 'substrateAccount_updatedAtTime_DESC'
}

export type EvmSubstrateAccountLinkWhereInput = {
  AND?: InputMaybe<Array<EvmSubstrateAccountLinkWhereInput>>;
  OR?: InputMaybe<Array<EvmSubstrateAccountLinkWhereInput>>;
  active_eq?: InputMaybe<Scalars['Boolean']['input']>;
  active_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  active_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtBlock_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtBlock_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtTime_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_gt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_gte?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  createdAtTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtTime_lt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_lte?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  evmAccount?: InputMaybe<EvmAccountWhereInput>;
  evmAccount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  substrateAccount?: InputMaybe<AccountWhereInput>;
  substrateAccount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EvmSubstrateAccountLinksConnection = {
  __typename?: 'EvmSubstrateAccountLinksConnection';
  edges: Array<EvmSubstrateAccountLinkEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ExtensionPinnedResource = {
  __typename?: 'ExtensionPinnedResource';
  contentExtension: ContentExtension;
  /**
   * The ExtensionPinnedResource ID.
   * Consists of the Content Extension ID plus the pinned resource type (Post or Space) plus pinned resource ID.
   * (e.g. "4940-0")
   */
  id: Scalars['String']['output'];
  post?: Maybe<Post>;
  resourceType: PinnedResourceType;
  space?: Maybe<Space>;
};

export type ExtensionPinnedResourceEdge = {
  __typename?: 'ExtensionPinnedResourceEdge';
  cursor: Scalars['String']['output'];
  node: ExtensionPinnedResource;
};

export enum ExtensionPinnedResourceOrderByInput {
  ContentExtensionAmountAsc = 'contentExtension_amount_ASC',
  ContentExtensionAmountDesc = 'contentExtension_amount_DESC',
  ContentExtensionChainAsc = 'contentExtension_chain_ASC',
  ContentExtensionChainDesc = 'contentExtension_chain_DESC',
  ContentExtensionCollectionIdAsc = 'contentExtension_collectionId_ASC',
  ContentExtensionCollectionIdDesc = 'contentExtension_collectionId_DESC',
  ContentExtensionDecimalsAsc = 'contentExtension_decimals_ASC',
  ContentExtensionDecimalsDesc = 'contentExtension_decimals_DESC',
  ContentExtensionExtensionSchemaIdAsc = 'contentExtension_extensionSchemaId_ASC',
  ContentExtensionExtensionSchemaIdDesc = 'contentExtension_extensionSchemaId_DESC',
  ContentExtensionIdAsc = 'contentExtension_id_ASC',
  ContentExtensionIdDesc = 'contentExtension_id_DESC',
  ContentExtensionImageAsc = 'contentExtension_image_ASC',
  ContentExtensionImageDesc = 'contentExtension_image_DESC',
  ContentExtensionMessageAsc = 'contentExtension_message_ASC',
  ContentExtensionMessageDesc = 'contentExtension_message_DESC',
  ContentExtensionNftIdAsc = 'contentExtension_nftId_ASC',
  ContentExtensionNftIdDesc = 'contentExtension_nftId_DESC',
  ContentExtensionNonceAsc = 'contentExtension_nonce_ASC',
  ContentExtensionNonceDesc = 'contentExtension_nonce_DESC',
  ContentExtensionTokenAsc = 'contentExtension_token_ASC',
  ContentExtensionTokenDesc = 'contentExtension_token_DESC',
  ContentExtensionTxHashAsc = 'contentExtension_txHash_ASC',
  ContentExtensionTxHashDesc = 'contentExtension_txHash_DESC',
  ContentExtensionUrlAsc = 'contentExtension_url_ASC',
  ContentExtensionUrlDesc = 'contentExtension_url_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PostBodyAsc = 'post_body_ASC',
  PostBodyDesc = 'post_body_DESC',
  PostCanonicalAsc = 'post_canonical_ASC',
  PostCanonicalDesc = 'post_canonical_DESC',
  PostContentAsc = 'post_content_ASC',
  PostContentDesc = 'post_content_DESC',
  PostCreatedAtBlockAsc = 'post_createdAtBlock_ASC',
  PostCreatedAtBlockDesc = 'post_createdAtBlock_DESC',
  PostCreatedAtTimeAsc = 'post_createdAtTime_ASC',
  PostCreatedAtTimeDesc = 'post_createdAtTime_DESC',
  PostCreatedOnDayAsc = 'post_createdOnDay_ASC',
  PostCreatedOnDayDesc = 'post_createdOnDay_DESC',
  PostDownvotesCountAsc = 'post_downvotesCount_ASC',
  PostDownvotesCountDesc = 'post_downvotesCount_DESC',
  PostFollowersCountAsc = 'post_followersCount_ASC',
  PostFollowersCountDesc = 'post_followersCount_DESC',
  PostFormatAsc = 'post_format_ASC',
  PostFormatDesc = 'post_format_DESC',
  PostHiddenRepliesCountAsc = 'post_hiddenRepliesCount_ASC',
  PostHiddenRepliesCountDesc = 'post_hiddenRepliesCount_DESC',
  PostHiddenAsc = 'post_hidden_ASC',
  PostHiddenDesc = 'post_hidden_DESC',
  PostIdAsc = 'post_id_ASC',
  PostIdDesc = 'post_id_DESC',
  PostImageAsc = 'post_image_ASC',
  PostImageDesc = 'post_image_DESC',
  PostInReplyToKindAsc = 'post_inReplyToKind_ASC',
  PostInReplyToKindDesc = 'post_inReplyToKind_DESC',
  PostIsCommentAsc = 'post_isComment_ASC',
  PostIsCommentDesc = 'post_isComment_DESC',
  PostIsShowMoreAsc = 'post_isShowMore_ASC',
  PostIsShowMoreDesc = 'post_isShowMore_DESC',
  PostKindAsc = 'post_kind_ASC',
  PostKindDesc = 'post_kind_DESC',
  PostLinkAsc = 'post_link_ASC',
  PostLinkDesc = 'post_link_DESC',
  PostMetaAsc = 'post_meta_ASC',
  PostMetaDesc = 'post_meta_DESC',
  PostProposalIndexAsc = 'post_proposalIndex_ASC',
  PostProposalIndexDesc = 'post_proposalIndex_DESC',
  PostPublicRepliesCountAsc = 'post_publicRepliesCount_ASC',
  PostPublicRepliesCountDesc = 'post_publicRepliesCount_DESC',
  PostReactionsCountAsc = 'post_reactionsCount_ASC',
  PostReactionsCountDesc = 'post_reactionsCount_DESC',
  PostRepliesCountAsc = 'post_repliesCount_ASC',
  PostRepliesCountDesc = 'post_repliesCount_DESC',
  PostSharesCountAsc = 'post_sharesCount_ASC',
  PostSharesCountDesc = 'post_sharesCount_DESC',
  PostSlugAsc = 'post_slug_ASC',
  PostSlugDesc = 'post_slug_DESC',
  PostSummaryAsc = 'post_summary_ASC',
  PostSummaryDesc = 'post_summary_DESC',
  PostTagsOriginalAsc = 'post_tagsOriginal_ASC',
  PostTagsOriginalDesc = 'post_tagsOriginal_DESC',
  PostTitleAsc = 'post_title_ASC',
  PostTitleDesc = 'post_title_DESC',
  PostTweetIdAsc = 'post_tweetId_ASC',
  PostTweetIdDesc = 'post_tweetId_DESC',
  PostUpdatedAtTimeAsc = 'post_updatedAtTime_ASC',
  PostUpdatedAtTimeDesc = 'post_updatedAtTime_DESC',
  PostUpvotesCountAsc = 'post_upvotesCount_ASC',
  PostUpvotesCountDesc = 'post_upvotesCount_DESC',
  ResourceTypeAsc = 'resourceType_ASC',
  ResourceTypeDesc = 'resourceType_DESC',
  SpaceAboutAsc = 'space_about_ASC',
  SpaceAboutDesc = 'space_about_DESC',
  SpaceCanEveryoneCreatePostsAsc = 'space_canEveryoneCreatePosts_ASC',
  SpaceCanEveryoneCreatePostsDesc = 'space_canEveryoneCreatePosts_DESC',
  SpaceCanFollowerCreatePostsAsc = 'space_canFollowerCreatePosts_ASC',
  SpaceCanFollowerCreatePostsDesc = 'space_canFollowerCreatePosts_DESC',
  SpaceContentAsc = 'space_content_ASC',
  SpaceContentDesc = 'space_content_DESC',
  SpaceCreatedAtBlockAsc = 'space_createdAtBlock_ASC',
  SpaceCreatedAtBlockDesc = 'space_createdAtBlock_DESC',
  SpaceCreatedAtTimeAsc = 'space_createdAtTime_ASC',
  SpaceCreatedAtTimeDesc = 'space_createdAtTime_DESC',
  SpaceCreatedOnDayAsc = 'space_createdOnDay_ASC',
  SpaceCreatedOnDayDesc = 'space_createdOnDay_DESC',
  SpaceEmailAsc = 'space_email_ASC',
  SpaceEmailDesc = 'space_email_DESC',
  SpaceFollowersCountAsc = 'space_followersCount_ASC',
  SpaceFollowersCountDesc = 'space_followersCount_DESC',
  SpaceFormatAsc = 'space_format_ASC',
  SpaceFormatDesc = 'space_format_DESC',
  SpaceHandleAsc = 'space_handle_ASC',
  SpaceHandleDesc = 'space_handle_DESC',
  SpaceHiddenPostsCountAsc = 'space_hiddenPostsCount_ASC',
  SpaceHiddenPostsCountDesc = 'space_hiddenPostsCount_DESC',
  SpaceHiddenAsc = 'space_hidden_ASC',
  SpaceHiddenDesc = 'space_hidden_DESC',
  SpaceIdAsc = 'space_id_ASC',
  SpaceIdDesc = 'space_id_DESC',
  SpaceImageAsc = 'space_image_ASC',
  SpaceImageDesc = 'space_image_DESC',
  SpaceInterestsOriginalAsc = 'space_interestsOriginal_ASC',
  SpaceInterestsOriginalDesc = 'space_interestsOriginal_DESC',
  SpaceIsShowMoreAsc = 'space_isShowMore_ASC',
  SpaceIsShowMoreDesc = 'space_isShowMore_DESC',
  SpaceLinksOriginalAsc = 'space_linksOriginal_ASC',
  SpaceLinksOriginalDesc = 'space_linksOriginal_DESC',
  SpaceNameAsc = 'space_name_ASC',
  SpaceNameDesc = 'space_name_DESC',
  SpacePostsCountAsc = 'space_postsCount_ASC',
  SpacePostsCountDesc = 'space_postsCount_DESC',
  SpacePublicPostsCountAsc = 'space_publicPostsCount_ASC',
  SpacePublicPostsCountDesc = 'space_publicPostsCount_DESC',
  SpaceSummaryAsc = 'space_summary_ASC',
  SpaceSummaryDesc = 'space_summary_DESC',
  SpaceTagsOriginalAsc = 'space_tagsOriginal_ASC',
  SpaceTagsOriginalDesc = 'space_tagsOriginal_DESC',
  SpaceUpdatedAtBlockAsc = 'space_updatedAtBlock_ASC',
  SpaceUpdatedAtBlockDesc = 'space_updatedAtBlock_DESC',
  SpaceUpdatedAtTimeAsc = 'space_updatedAtTime_ASC',
  SpaceUpdatedAtTimeDesc = 'space_updatedAtTime_DESC',
  SpaceUsernameAsc = 'space_username_ASC',
  SpaceUsernameDesc = 'space_username_DESC'
}

export type ExtensionPinnedResourceWhereInput = {
  AND?: InputMaybe<Array<ExtensionPinnedResourceWhereInput>>;
  OR?: InputMaybe<Array<ExtensionPinnedResourceWhereInput>>;
  contentExtension?: InputMaybe<ContentExtensionWhereInput>;
  contentExtension_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  post?: InputMaybe<PostWhereInput>;
  post_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  resourceType_eq?: InputMaybe<PinnedResourceType>;
  resourceType_in?: InputMaybe<Array<PinnedResourceType>>;
  resourceType_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  resourceType_not_eq?: InputMaybe<PinnedResourceType>;
  resourceType_not_in?: InputMaybe<Array<PinnedResourceType>>;
  space?: InputMaybe<SpaceWhereInput>;
  space_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ExtensionPinnedResourcesConnection = {
  __typename?: 'ExtensionPinnedResourcesConnection';
  edges: Array<ExtensionPinnedResourceEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type HitItem = {
  __typename?: 'HitItem';
  /** Document source */
  _content: HitItemContent;
  /** Document ID (equal to on-chain entity ID) */
  _id: Scalars['String']['output'];
  /** Index particular document is located in */
  _index: Scalars['String']['output'];
  /** Search score of particular document */
  _score: Scalars['Float']['output'];
};

export type HitItemContent = {
  __typename?: 'HitItemContent';
  /** Value of field `about` (actual only for Space entity) */
  about?: Maybe<Scalars['String']['output']>;
  /** Value of field `body` (actual only for Post entity) */
  body?: Maybe<Scalars['String']['output']>;
  /** Value of field `name` (actual only for Space entity) */
  name?: Maybe<Scalars['String']['output']>;
  /** Value of field `spaceId` (actual only for Post entity) */
  spaceId?: Maybe<Scalars['String']['output']>;
  /** List of tags */
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** Value of field `title` (actual only for Post entity) */
  title?: Maybe<Scalars['String']['output']>;
  /** Value of field `username` (actual only for Space entity) */
  username?: Maybe<Scalars['String']['output']>;
};

export type InBatchNotifications = {
  __typename?: 'InBatchNotifications';
  activityIds: Array<Scalars['String']['output']>;
  batchEndBlockNumber: Scalars['BigInt']['output'];
  batchStartBlockNumber: Scalars['BigInt']['output'];
  id: Scalars['String']['output'];
};

export type InBatchNotificationsConnection = {
  __typename?: 'InBatchNotificationsConnection';
  edges: Array<InBatchNotificationsEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InBatchNotificationsEdge = {
  __typename?: 'InBatchNotificationsEdge';
  cursor: Scalars['String']['output'];
  node: InBatchNotifications;
};

export enum InBatchNotificationsOrderByInput {
  BatchEndBlockNumberAsc = 'batchEndBlockNumber_ASC',
  BatchEndBlockNumberDesc = 'batchEndBlockNumber_DESC',
  BatchStartBlockNumberAsc = 'batchStartBlockNumber_ASC',
  BatchStartBlockNumberDesc = 'batchStartBlockNumber_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type InBatchNotificationsWhereInput = {
  AND?: InputMaybe<Array<InBatchNotificationsWhereInput>>;
  OR?: InputMaybe<Array<InBatchNotificationsWhereInput>>;
  activityIds_containsAll?: InputMaybe<Array<Scalars['String']['input']>>;
  activityIds_containsAny?: InputMaybe<Array<Scalars['String']['input']>>;
  activityIds_containsNone?: InputMaybe<Array<Scalars['String']['input']>>;
  activityIds_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  batchEndBlockNumber_eq?: InputMaybe<Scalars['BigInt']['input']>;
  batchEndBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  batchEndBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  batchEndBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  batchEndBlockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  batchEndBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  batchEndBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  batchEndBlockNumber_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  batchEndBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  batchStartBlockNumber_eq?: InputMaybe<Scalars['BigInt']['input']>;
  batchStartBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  batchStartBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  batchStartBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  batchStartBlockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  batchStartBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  batchStartBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  batchStartBlockNumber_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  batchStartBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum InReplyToKind {
  Post = 'Post'
}

export type IpfsFetchLog = {
  __typename?: 'IpfsFetchLog';
  blockHeight: Scalars['Int']['output'];
  cid?: Maybe<Scalars['String']['output']>;
  errorMsg?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
};

export type IpfsFetchLogEdge = {
  __typename?: 'IpfsFetchLogEdge';
  cursor: Scalars['String']['output'];
  node: IpfsFetchLog;
};

export enum IpfsFetchLogOrderByInput {
  BlockHeightAsc = 'blockHeight_ASC',
  BlockHeightDesc = 'blockHeight_DESC',
  CidAsc = 'cid_ASC',
  CidDesc = 'cid_DESC',
  ErrorMsgAsc = 'errorMsg_ASC',
  ErrorMsgDesc = 'errorMsg_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type IpfsFetchLogWhereInput = {
  AND?: InputMaybe<Array<IpfsFetchLogWhereInput>>;
  OR?: InputMaybe<Array<IpfsFetchLogWhereInput>>;
  blockHeight_eq?: InputMaybe<Scalars['Int']['input']>;
  blockHeight_gt?: InputMaybe<Scalars['Int']['input']>;
  blockHeight_gte?: InputMaybe<Scalars['Int']['input']>;
  blockHeight_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockHeight_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  blockHeight_lt?: InputMaybe<Scalars['Int']['input']>;
  blockHeight_lte?: InputMaybe<Scalars['Int']['input']>;
  blockHeight_not_eq?: InputMaybe<Scalars['Int']['input']>;
  blockHeight_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cid_contains?: InputMaybe<Scalars['String']['input']>;
  cid_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  cid_endsWith?: InputMaybe<Scalars['String']['input']>;
  cid_eq?: InputMaybe<Scalars['String']['input']>;
  cid_gt?: InputMaybe<Scalars['String']['input']>;
  cid_gte?: InputMaybe<Scalars['String']['input']>;
  cid_in?: InputMaybe<Array<Scalars['String']['input']>>;
  cid_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  cid_lt?: InputMaybe<Scalars['String']['input']>;
  cid_lte?: InputMaybe<Scalars['String']['input']>;
  cid_not_contains?: InputMaybe<Scalars['String']['input']>;
  cid_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  cid_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  cid_not_eq?: InputMaybe<Scalars['String']['input']>;
  cid_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  cid_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  cid_startsWith?: InputMaybe<Scalars['String']['input']>;
  errorMsg_contains?: InputMaybe<Scalars['String']['input']>;
  errorMsg_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  errorMsg_endsWith?: InputMaybe<Scalars['String']['input']>;
  errorMsg_eq?: InputMaybe<Scalars['String']['input']>;
  errorMsg_gt?: InputMaybe<Scalars['String']['input']>;
  errorMsg_gte?: InputMaybe<Scalars['String']['input']>;
  errorMsg_in?: InputMaybe<Array<Scalars['String']['input']>>;
  errorMsg_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  errorMsg_lt?: InputMaybe<Scalars['String']['input']>;
  errorMsg_lte?: InputMaybe<Scalars['String']['input']>;
  errorMsg_not_contains?: InputMaybe<Scalars['String']['input']>;
  errorMsg_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  errorMsg_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  errorMsg_not_eq?: InputMaybe<Scalars['String']['input']>;
  errorMsg_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  errorMsg_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  errorMsg_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type IpfsFetchLogsConnection = {
  __typename?: 'IpfsFetchLogsConnection';
  edges: Array<IpfsFetchLogEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** The junction table for Many-to-Many relationship between Account and Activity */
export type NewsFeed = {
  __typename?: 'NewsFeed';
  account: Account;
  activity: Activity;
  id: Scalars['String']['output'];
};

export type NewsFeedEdge = {
  __typename?: 'NewsFeedEdge';
  cursor: Scalars['String']['output'];
  node: NewsFeed;
};

export enum NewsFeedOrderByInput {
  AccountFollowersCountAsc = 'account_followersCount_ASC',
  AccountFollowersCountDesc = 'account_followersCount_DESC',
  AccountFollowingAccountsCountAsc = 'account_followingAccountsCount_ASC',
  AccountFollowingAccountsCountDesc = 'account_followingAccountsCount_DESC',
  AccountFollowingPostsCountAsc = 'account_followingPostsCount_ASC',
  AccountFollowingPostsCountDesc = 'account_followingPostsCount_DESC',
  AccountFollowingSpacesCountAsc = 'account_followingSpacesCount_ASC',
  AccountFollowingSpacesCountDesc = 'account_followingSpacesCount_DESC',
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountOwnedPostsCountAsc = 'account_ownedPostsCount_ASC',
  AccountOwnedPostsCountDesc = 'account_ownedPostsCount_DESC',
  AccountUpdatedAtBlockAsc = 'account_updatedAtBlock_ASC',
  AccountUpdatedAtBlockDesc = 'account_updatedAtBlock_DESC',
  AccountUpdatedAtTimeAsc = 'account_updatedAtTime_ASC',
  AccountUpdatedAtTimeDesc = 'account_updatedAtTime_DESC',
  ActivityAggCountAsc = 'activity_aggCount_ASC',
  ActivityAggCountDesc = 'activity_aggCount_DESC',
  ActivityAggregatedAsc = 'activity_aggregated_ASC',
  ActivityAggregatedDesc = 'activity_aggregated_DESC',
  ActivityBlockNumberAsc = 'activity_blockNumber_ASC',
  ActivityBlockNumberDesc = 'activity_blockNumber_DESC',
  ActivityDateAsc = 'activity_date_ASC',
  ActivityDateDesc = 'activity_date_DESC',
  ActivityEventIndexAsc = 'activity_eventIndex_ASC',
  ActivityEventIndexDesc = 'activity_eventIndex_DESC',
  ActivityEventAsc = 'activity_event_ASC',
  ActivityEventDesc = 'activity_event_DESC',
  ActivityIdAsc = 'activity_id_ASC',
  ActivityIdDesc = 'activity_id_DESC',
  ActivityUsernameAsc = 'activity_username_ASC',
  ActivityUsernameDesc = 'activity_username_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type NewsFeedWhereInput = {
  AND?: InputMaybe<Array<NewsFeedWhereInput>>;
  OR?: InputMaybe<Array<NewsFeedWhereInput>>;
  account?: InputMaybe<AccountWhereInput>;
  account_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  activity?: InputMaybe<ActivityWhereInput>;
  activity_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NewsFeedsConnection = {
  __typename?: 'NewsFeedsConnection';
  edges: Array<NewsFeedEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** The junction table for Many-to-Many relationship between Account and Notification */
export type Notification = {
  __typename?: 'Notification';
  account: Account;
  activity: Activity;
  id: Scalars['String']['output'];
};

export type NotificationEdge = {
  __typename?: 'NotificationEdge';
  cursor: Scalars['String']['output'];
  node: Notification;
};

export enum NotificationOrderByInput {
  AccountFollowersCountAsc = 'account_followersCount_ASC',
  AccountFollowersCountDesc = 'account_followersCount_DESC',
  AccountFollowingAccountsCountAsc = 'account_followingAccountsCount_ASC',
  AccountFollowingAccountsCountDesc = 'account_followingAccountsCount_DESC',
  AccountFollowingPostsCountAsc = 'account_followingPostsCount_ASC',
  AccountFollowingPostsCountDesc = 'account_followingPostsCount_DESC',
  AccountFollowingSpacesCountAsc = 'account_followingSpacesCount_ASC',
  AccountFollowingSpacesCountDesc = 'account_followingSpacesCount_DESC',
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountOwnedPostsCountAsc = 'account_ownedPostsCount_ASC',
  AccountOwnedPostsCountDesc = 'account_ownedPostsCount_DESC',
  AccountUpdatedAtBlockAsc = 'account_updatedAtBlock_ASC',
  AccountUpdatedAtBlockDesc = 'account_updatedAtBlock_DESC',
  AccountUpdatedAtTimeAsc = 'account_updatedAtTime_ASC',
  AccountUpdatedAtTimeDesc = 'account_updatedAtTime_DESC',
  ActivityAggCountAsc = 'activity_aggCount_ASC',
  ActivityAggCountDesc = 'activity_aggCount_DESC',
  ActivityAggregatedAsc = 'activity_aggregated_ASC',
  ActivityAggregatedDesc = 'activity_aggregated_DESC',
  ActivityBlockNumberAsc = 'activity_blockNumber_ASC',
  ActivityBlockNumberDesc = 'activity_blockNumber_DESC',
  ActivityDateAsc = 'activity_date_ASC',
  ActivityDateDesc = 'activity_date_DESC',
  ActivityEventIndexAsc = 'activity_eventIndex_ASC',
  ActivityEventIndexDesc = 'activity_eventIndex_DESC',
  ActivityEventAsc = 'activity_event_ASC',
  ActivityEventDesc = 'activity_event_DESC',
  ActivityIdAsc = 'activity_id_ASC',
  ActivityIdDesc = 'activity_id_DESC',
  ActivityUsernameAsc = 'activity_username_ASC',
  ActivityUsernameDesc = 'activity_username_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type NotificationWhereInput = {
  AND?: InputMaybe<Array<NotificationWhereInput>>;
  OR?: InputMaybe<Array<NotificationWhereInput>>;
  account?: InputMaybe<AccountWhereInput>;
  account_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  activity?: InputMaybe<ActivityWhereInput>;
  activity_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NotificationsConnection = {
  __typename?: 'NotificationsConnection';
  edges: Array<NotificationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['String']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Scalars['String']['output'];
};

export enum PinnedResourceType {
  Post = 'Post',
  Space = 'Space'
}

/** The Post entity */
export type Post = {
  __typename?: 'Post';
  /** The body text of the Post (IPFS content) */
  body?: Maybe<Scalars['String']['output']>;
  /** Post canonical URL (IPFS content) */
  canonical?: Maybe<Scalars['String']['output']>;
  /**
   * A One-To-Many relationship between a Comment Post or Comment Reply and the Accounts that follow the Comment through CommentFollowers (foreign key - "followingComment")
   * (currently, a post is only followed by its creator)
   */
  commentFollowers: Array<CommentFollowers>;
  /** The CID of the content on IPFS. */
  content?: Maybe<Scalars['String']['output']>;
  /** The block height when a Post was created. */
  createdAtBlock?: Maybe<Scalars['BigInt']['output']>;
  /** The DateTime when a Post was created. */
  createdAtTime?: Maybe<Scalars['DateTime']['output']>;
  /** A One-To-One relationship with the Account entity of a Post's creator. */
  createdByAccount: Account;
  /** The day when a Post was created. */
  createdOnDay?: Maybe<Scalars['DateTime']['output']>;
  /** The total number of DownVote reactions to the current Post. */
  downvotesCount: Scalars['Int']['output'];
  /** The properties of a Post from its IPFS content which are not supported by the current squid's DB schema. */
  experimental?: Maybe<Scalars['JSON']['output']>;
  /** The extensions published with this Post. */
  extensions: Array<ContentExtension>;
  /** The total number of followers that a Post has. */
  followersCount: Scalars['Int']['output'];
  /** The Post format (IPFS content) */
  format?: Maybe<Scalars['String']['output']>;
  /** Is the current post hidden? */
  hidden: Scalars['Boolean']['output'];
  /** The total number of hidden replies to the current Post. */
  hiddenRepliesCount: Scalars['Int']['output'];
  /** The Post ID, the same as it is on the blockchain. */
  id: Scalars['String']['output'];
  /** The URL for the Post's cover image (IPFS content) */
  image?: Maybe<Scalars['String']['output']>;
  inReplyToKind?: Maybe<InReplyToKind>;
  inReplyToPost?: Maybe<Post>;
  /** Is the current Post a Comment to a Regular Post or a Comment Post? */
  isComment: Scalars['Boolean']['output'];
  /** Is the Post body longer than the summary? */
  isShowMore?: Maybe<Scalars['Boolean']['output']>;
  /** The type of Post (Comment, SharedPost, or RegularPost) */
  kind?: Maybe<PostKind>;
  /** The link of the Post (IPFS content) */
  link?: Maybe<Scalars['String']['output']>;
  /** ! Deprecated field and will be removed ! */
  meta?: Maybe<Scalars['String']['output']>;
  /** A One-To-One relationship with the Account entity of a Post's owner. Currently we do not have Post transfer functionality. */
  ownedByAccount: Account;
  /** A One-to-One relationship with a Post. This field only has a value if the current Post is a Reply to a Comment and contains a relationship with a Comment Post or another Reply (in case there is discussion within context of some Comment). */
  parentPost?: Maybe<Post>;
  pinnedByExtensions: Array<ExtensionPinnedResource>;
  /**
   * A One-To-Many relationship between a Regular Post and the Accounts that follow the post through PostFollowers (foreign key - "followingPost")
   * (currently, a post is only followed by its creator)
   */
  postFollowers: Array<PostFollowers>;
  /** ! Deprecated field and will be removed ! */
  proposalIndex?: Maybe<Scalars['Int']['output']>;
  /** The total number of public (non-hidden) replies to the current Post. */
  publicRepliesCount: Scalars['Int']['output'];
  /** A One-To-Many relationship with Reactions for the current Post (foreign key - "post") */
  reactions: Array<Reaction>;
  /** The total number of all reactions to the current Post. */
  reactionsCount: Scalars['Int']['output'];
  /** The total number of replies to the current Post. */
  repliesCount: Scalars['Int']['output'];
  /** A One-to-One relationship with a Post. This field only has a value if the current Post is a Comment or a Reply to a Comment, and contains a relationship with a top level Regular Post. */
  rootPost?: Maybe<Post>;
  /** A One-to-One relationship with a Post which has been shared. The Current Post is a new Post which has been created as a result of the sharing action, and can contain an additional body as a comment on the shared Post. "sharedPost" is relationhip with the Post that was shared. */
  sharedPost?: Maybe<Post>;
  /** How many times the current Post has been shared. */
  sharesCount: Scalars['Int']['output'];
  /** Post slug URL (IPFS content) */
  slug?: Maybe<Scalars['String']['output']>;
  /** A One-To-One relationship with a Space that the current Post has been created in. It can be null if the Post is deleted (moved to Space with ID === null) */
  space?: Maybe<Space>;
  /** The summary of the Post body */
  summary?: Maybe<Scalars['String']['output']>;
  /** A list of a Post's tags, converted to a string with "comma" as a separator (IPFS content) */
  tagsOriginal?: Maybe<Scalars['String']['output']>;
  /** The title of the Post (IPFS content) */
  title?: Maybe<Scalars['String']['output']>;
  /** The details of the tweet, such as creation time, username of the poster, etc. (IPFS content) */
  tweetDetails?: Maybe<TweetDetails>;
  /** The ID of the tweet attached to the current Post (IPFS content) */
  tweetId?: Maybe<Scalars['String']['output']>;
  /** The time when a Post was created. */
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>;
  /** The total number of UpVote reactions to the current Post. */
  upvotesCount: Scalars['Int']['output'];
};


/** The Post entity */
export type PostCommentFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CommentFollowersOrderByInput>>;
  where?: InputMaybe<CommentFollowersWhereInput>;
};


/** The Post entity */
export type PostExtensionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ContentExtensionOrderByInput>>;
  where?: InputMaybe<ContentExtensionWhereInput>;
};


/** The Post entity */
export type PostPinnedByExtensionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ExtensionPinnedResourceOrderByInput>>;
  where?: InputMaybe<ExtensionPinnedResourceWhereInput>;
};


/** The Post entity */
export type PostPostFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostFollowersOrderByInput>>;
  where?: InputMaybe<PostFollowersWhereInput>;
};


/** The Post entity */
export type PostReactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ReactionOrderByInput>>;
  where?: InputMaybe<ReactionWhereInput>;
};

export type PostEdge = {
  __typename?: 'PostEdge';
  cursor: Scalars['String']['output'];
  node: Post;
};

/** The junction table for Many-to-Many relationship between follower Account and following Post */
export type PostFollowers = {
  __typename?: 'PostFollowers';
  followerAccount: Account;
  followingPost: Post;
  id: Scalars['String']['output'];
};

export type PostFollowersConnection = {
  __typename?: 'PostFollowersConnection';
  edges: Array<PostFollowersEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PostFollowersEdge = {
  __typename?: 'PostFollowersEdge';
  cursor: Scalars['String']['output'];
  node: PostFollowers;
};

export enum PostFollowersOrderByInput {
  FollowerAccountFollowersCountAsc = 'followerAccount_followersCount_ASC',
  FollowerAccountFollowersCountDesc = 'followerAccount_followersCount_DESC',
  FollowerAccountFollowingAccountsCountAsc = 'followerAccount_followingAccountsCount_ASC',
  FollowerAccountFollowingAccountsCountDesc = 'followerAccount_followingAccountsCount_DESC',
  FollowerAccountFollowingPostsCountAsc = 'followerAccount_followingPostsCount_ASC',
  FollowerAccountFollowingPostsCountDesc = 'followerAccount_followingPostsCount_DESC',
  FollowerAccountFollowingSpacesCountAsc = 'followerAccount_followingSpacesCount_ASC',
  FollowerAccountFollowingSpacesCountDesc = 'followerAccount_followingSpacesCount_DESC',
  FollowerAccountIdAsc = 'followerAccount_id_ASC',
  FollowerAccountIdDesc = 'followerAccount_id_DESC',
  FollowerAccountOwnedPostsCountAsc = 'followerAccount_ownedPostsCount_ASC',
  FollowerAccountOwnedPostsCountDesc = 'followerAccount_ownedPostsCount_DESC',
  FollowerAccountUpdatedAtBlockAsc = 'followerAccount_updatedAtBlock_ASC',
  FollowerAccountUpdatedAtBlockDesc = 'followerAccount_updatedAtBlock_DESC',
  FollowerAccountUpdatedAtTimeAsc = 'followerAccount_updatedAtTime_ASC',
  FollowerAccountUpdatedAtTimeDesc = 'followerAccount_updatedAtTime_DESC',
  FollowingPostBodyAsc = 'followingPost_body_ASC',
  FollowingPostBodyDesc = 'followingPost_body_DESC',
  FollowingPostCanonicalAsc = 'followingPost_canonical_ASC',
  FollowingPostCanonicalDesc = 'followingPost_canonical_DESC',
  FollowingPostContentAsc = 'followingPost_content_ASC',
  FollowingPostContentDesc = 'followingPost_content_DESC',
  FollowingPostCreatedAtBlockAsc = 'followingPost_createdAtBlock_ASC',
  FollowingPostCreatedAtBlockDesc = 'followingPost_createdAtBlock_DESC',
  FollowingPostCreatedAtTimeAsc = 'followingPost_createdAtTime_ASC',
  FollowingPostCreatedAtTimeDesc = 'followingPost_createdAtTime_DESC',
  FollowingPostCreatedOnDayAsc = 'followingPost_createdOnDay_ASC',
  FollowingPostCreatedOnDayDesc = 'followingPost_createdOnDay_DESC',
  FollowingPostDownvotesCountAsc = 'followingPost_downvotesCount_ASC',
  FollowingPostDownvotesCountDesc = 'followingPost_downvotesCount_DESC',
  FollowingPostFollowersCountAsc = 'followingPost_followersCount_ASC',
  FollowingPostFollowersCountDesc = 'followingPost_followersCount_DESC',
  FollowingPostFormatAsc = 'followingPost_format_ASC',
  FollowingPostFormatDesc = 'followingPost_format_DESC',
  FollowingPostHiddenRepliesCountAsc = 'followingPost_hiddenRepliesCount_ASC',
  FollowingPostHiddenRepliesCountDesc = 'followingPost_hiddenRepliesCount_DESC',
  FollowingPostHiddenAsc = 'followingPost_hidden_ASC',
  FollowingPostHiddenDesc = 'followingPost_hidden_DESC',
  FollowingPostIdAsc = 'followingPost_id_ASC',
  FollowingPostIdDesc = 'followingPost_id_DESC',
  FollowingPostImageAsc = 'followingPost_image_ASC',
  FollowingPostImageDesc = 'followingPost_image_DESC',
  FollowingPostInReplyToKindAsc = 'followingPost_inReplyToKind_ASC',
  FollowingPostInReplyToKindDesc = 'followingPost_inReplyToKind_DESC',
  FollowingPostIsCommentAsc = 'followingPost_isComment_ASC',
  FollowingPostIsCommentDesc = 'followingPost_isComment_DESC',
  FollowingPostIsShowMoreAsc = 'followingPost_isShowMore_ASC',
  FollowingPostIsShowMoreDesc = 'followingPost_isShowMore_DESC',
  FollowingPostKindAsc = 'followingPost_kind_ASC',
  FollowingPostKindDesc = 'followingPost_kind_DESC',
  FollowingPostLinkAsc = 'followingPost_link_ASC',
  FollowingPostLinkDesc = 'followingPost_link_DESC',
  FollowingPostMetaAsc = 'followingPost_meta_ASC',
  FollowingPostMetaDesc = 'followingPost_meta_DESC',
  FollowingPostProposalIndexAsc = 'followingPost_proposalIndex_ASC',
  FollowingPostProposalIndexDesc = 'followingPost_proposalIndex_DESC',
  FollowingPostPublicRepliesCountAsc = 'followingPost_publicRepliesCount_ASC',
  FollowingPostPublicRepliesCountDesc = 'followingPost_publicRepliesCount_DESC',
  FollowingPostReactionsCountAsc = 'followingPost_reactionsCount_ASC',
  FollowingPostReactionsCountDesc = 'followingPost_reactionsCount_DESC',
  FollowingPostRepliesCountAsc = 'followingPost_repliesCount_ASC',
  FollowingPostRepliesCountDesc = 'followingPost_repliesCount_DESC',
  FollowingPostSharesCountAsc = 'followingPost_sharesCount_ASC',
  FollowingPostSharesCountDesc = 'followingPost_sharesCount_DESC',
  FollowingPostSlugAsc = 'followingPost_slug_ASC',
  FollowingPostSlugDesc = 'followingPost_slug_DESC',
  FollowingPostSummaryAsc = 'followingPost_summary_ASC',
  FollowingPostSummaryDesc = 'followingPost_summary_DESC',
  FollowingPostTagsOriginalAsc = 'followingPost_tagsOriginal_ASC',
  FollowingPostTagsOriginalDesc = 'followingPost_tagsOriginal_DESC',
  FollowingPostTitleAsc = 'followingPost_title_ASC',
  FollowingPostTitleDesc = 'followingPost_title_DESC',
  FollowingPostTweetIdAsc = 'followingPost_tweetId_ASC',
  FollowingPostTweetIdDesc = 'followingPost_tweetId_DESC',
  FollowingPostUpdatedAtTimeAsc = 'followingPost_updatedAtTime_ASC',
  FollowingPostUpdatedAtTimeDesc = 'followingPost_updatedAtTime_DESC',
  FollowingPostUpvotesCountAsc = 'followingPost_upvotesCount_ASC',
  FollowingPostUpvotesCountDesc = 'followingPost_upvotesCount_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type PostFollowersWhereInput = {
  AND?: InputMaybe<Array<PostFollowersWhereInput>>;
  OR?: InputMaybe<Array<PostFollowersWhereInput>>;
  followerAccount?: InputMaybe<AccountWhereInput>;
  followerAccount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  followingPost?: InputMaybe<PostWhereInput>;
  followingPost_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Post types.
 *   - Comment - This post is a Comment or Comment Reply
 *   - SharedPost - This post has been created as a result of another post being shared
 *   - RegularPost - Regular top level post
 */
export enum PostKind {
  Comment = 'Comment',
  RegularPost = 'RegularPost',
  SharedPost = 'SharedPost'
}

export enum PostOrderByInput {
  BodyAsc = 'body_ASC',
  BodyDesc = 'body_DESC',
  CanonicalAsc = 'canonical_ASC',
  CanonicalDesc = 'canonical_DESC',
  ContentAsc = 'content_ASC',
  ContentDesc = 'content_DESC',
  CreatedAtBlockAsc = 'createdAtBlock_ASC',
  CreatedAtBlockDesc = 'createdAtBlock_DESC',
  CreatedAtTimeAsc = 'createdAtTime_ASC',
  CreatedAtTimeDesc = 'createdAtTime_DESC',
  CreatedByAccountFollowersCountAsc = 'createdByAccount_followersCount_ASC',
  CreatedByAccountFollowersCountDesc = 'createdByAccount_followersCount_DESC',
  CreatedByAccountFollowingAccountsCountAsc = 'createdByAccount_followingAccountsCount_ASC',
  CreatedByAccountFollowingAccountsCountDesc = 'createdByAccount_followingAccountsCount_DESC',
  CreatedByAccountFollowingPostsCountAsc = 'createdByAccount_followingPostsCount_ASC',
  CreatedByAccountFollowingPostsCountDesc = 'createdByAccount_followingPostsCount_DESC',
  CreatedByAccountFollowingSpacesCountAsc = 'createdByAccount_followingSpacesCount_ASC',
  CreatedByAccountFollowingSpacesCountDesc = 'createdByAccount_followingSpacesCount_DESC',
  CreatedByAccountIdAsc = 'createdByAccount_id_ASC',
  CreatedByAccountIdDesc = 'createdByAccount_id_DESC',
  CreatedByAccountOwnedPostsCountAsc = 'createdByAccount_ownedPostsCount_ASC',
  CreatedByAccountOwnedPostsCountDesc = 'createdByAccount_ownedPostsCount_DESC',
  CreatedByAccountUpdatedAtBlockAsc = 'createdByAccount_updatedAtBlock_ASC',
  CreatedByAccountUpdatedAtBlockDesc = 'createdByAccount_updatedAtBlock_DESC',
  CreatedByAccountUpdatedAtTimeAsc = 'createdByAccount_updatedAtTime_ASC',
  CreatedByAccountUpdatedAtTimeDesc = 'createdByAccount_updatedAtTime_DESC',
  CreatedOnDayAsc = 'createdOnDay_ASC',
  CreatedOnDayDesc = 'createdOnDay_DESC',
  DownvotesCountAsc = 'downvotesCount_ASC',
  DownvotesCountDesc = 'downvotesCount_DESC',
  FollowersCountAsc = 'followersCount_ASC',
  FollowersCountDesc = 'followersCount_DESC',
  FormatAsc = 'format_ASC',
  FormatDesc = 'format_DESC',
  HiddenRepliesCountAsc = 'hiddenRepliesCount_ASC',
  HiddenRepliesCountDesc = 'hiddenRepliesCount_DESC',
  HiddenAsc = 'hidden_ASC',
  HiddenDesc = 'hidden_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  InReplyToKindAsc = 'inReplyToKind_ASC',
  InReplyToKindDesc = 'inReplyToKind_DESC',
  InReplyToPostBodyAsc = 'inReplyToPost_body_ASC',
  InReplyToPostBodyDesc = 'inReplyToPost_body_DESC',
  InReplyToPostCanonicalAsc = 'inReplyToPost_canonical_ASC',
  InReplyToPostCanonicalDesc = 'inReplyToPost_canonical_DESC',
  InReplyToPostContentAsc = 'inReplyToPost_content_ASC',
  InReplyToPostContentDesc = 'inReplyToPost_content_DESC',
  InReplyToPostCreatedAtBlockAsc = 'inReplyToPost_createdAtBlock_ASC',
  InReplyToPostCreatedAtBlockDesc = 'inReplyToPost_createdAtBlock_DESC',
  InReplyToPostCreatedAtTimeAsc = 'inReplyToPost_createdAtTime_ASC',
  InReplyToPostCreatedAtTimeDesc = 'inReplyToPost_createdAtTime_DESC',
  InReplyToPostCreatedOnDayAsc = 'inReplyToPost_createdOnDay_ASC',
  InReplyToPostCreatedOnDayDesc = 'inReplyToPost_createdOnDay_DESC',
  InReplyToPostDownvotesCountAsc = 'inReplyToPost_downvotesCount_ASC',
  InReplyToPostDownvotesCountDesc = 'inReplyToPost_downvotesCount_DESC',
  InReplyToPostFollowersCountAsc = 'inReplyToPost_followersCount_ASC',
  InReplyToPostFollowersCountDesc = 'inReplyToPost_followersCount_DESC',
  InReplyToPostFormatAsc = 'inReplyToPost_format_ASC',
  InReplyToPostFormatDesc = 'inReplyToPost_format_DESC',
  InReplyToPostHiddenRepliesCountAsc = 'inReplyToPost_hiddenRepliesCount_ASC',
  InReplyToPostHiddenRepliesCountDesc = 'inReplyToPost_hiddenRepliesCount_DESC',
  InReplyToPostHiddenAsc = 'inReplyToPost_hidden_ASC',
  InReplyToPostHiddenDesc = 'inReplyToPost_hidden_DESC',
  InReplyToPostIdAsc = 'inReplyToPost_id_ASC',
  InReplyToPostIdDesc = 'inReplyToPost_id_DESC',
  InReplyToPostImageAsc = 'inReplyToPost_image_ASC',
  InReplyToPostImageDesc = 'inReplyToPost_image_DESC',
  InReplyToPostInReplyToKindAsc = 'inReplyToPost_inReplyToKind_ASC',
  InReplyToPostInReplyToKindDesc = 'inReplyToPost_inReplyToKind_DESC',
  InReplyToPostIsCommentAsc = 'inReplyToPost_isComment_ASC',
  InReplyToPostIsCommentDesc = 'inReplyToPost_isComment_DESC',
  InReplyToPostIsShowMoreAsc = 'inReplyToPost_isShowMore_ASC',
  InReplyToPostIsShowMoreDesc = 'inReplyToPost_isShowMore_DESC',
  InReplyToPostKindAsc = 'inReplyToPost_kind_ASC',
  InReplyToPostKindDesc = 'inReplyToPost_kind_DESC',
  InReplyToPostLinkAsc = 'inReplyToPost_link_ASC',
  InReplyToPostLinkDesc = 'inReplyToPost_link_DESC',
  InReplyToPostMetaAsc = 'inReplyToPost_meta_ASC',
  InReplyToPostMetaDesc = 'inReplyToPost_meta_DESC',
  InReplyToPostProposalIndexAsc = 'inReplyToPost_proposalIndex_ASC',
  InReplyToPostProposalIndexDesc = 'inReplyToPost_proposalIndex_DESC',
  InReplyToPostPublicRepliesCountAsc = 'inReplyToPost_publicRepliesCount_ASC',
  InReplyToPostPublicRepliesCountDesc = 'inReplyToPost_publicRepliesCount_DESC',
  InReplyToPostReactionsCountAsc = 'inReplyToPost_reactionsCount_ASC',
  InReplyToPostReactionsCountDesc = 'inReplyToPost_reactionsCount_DESC',
  InReplyToPostRepliesCountAsc = 'inReplyToPost_repliesCount_ASC',
  InReplyToPostRepliesCountDesc = 'inReplyToPost_repliesCount_DESC',
  InReplyToPostSharesCountAsc = 'inReplyToPost_sharesCount_ASC',
  InReplyToPostSharesCountDesc = 'inReplyToPost_sharesCount_DESC',
  InReplyToPostSlugAsc = 'inReplyToPost_slug_ASC',
  InReplyToPostSlugDesc = 'inReplyToPost_slug_DESC',
  InReplyToPostSummaryAsc = 'inReplyToPost_summary_ASC',
  InReplyToPostSummaryDesc = 'inReplyToPost_summary_DESC',
  InReplyToPostTagsOriginalAsc = 'inReplyToPost_tagsOriginal_ASC',
  InReplyToPostTagsOriginalDesc = 'inReplyToPost_tagsOriginal_DESC',
  InReplyToPostTitleAsc = 'inReplyToPost_title_ASC',
  InReplyToPostTitleDesc = 'inReplyToPost_title_DESC',
  InReplyToPostTweetIdAsc = 'inReplyToPost_tweetId_ASC',
  InReplyToPostTweetIdDesc = 'inReplyToPost_tweetId_DESC',
  InReplyToPostUpdatedAtTimeAsc = 'inReplyToPost_updatedAtTime_ASC',
  InReplyToPostUpdatedAtTimeDesc = 'inReplyToPost_updatedAtTime_DESC',
  InReplyToPostUpvotesCountAsc = 'inReplyToPost_upvotesCount_ASC',
  InReplyToPostUpvotesCountDesc = 'inReplyToPost_upvotesCount_DESC',
  IsCommentAsc = 'isComment_ASC',
  IsCommentDesc = 'isComment_DESC',
  IsShowMoreAsc = 'isShowMore_ASC',
  IsShowMoreDesc = 'isShowMore_DESC',
  KindAsc = 'kind_ASC',
  KindDesc = 'kind_DESC',
  LinkAsc = 'link_ASC',
  LinkDesc = 'link_DESC',
  MetaAsc = 'meta_ASC',
  MetaDesc = 'meta_DESC',
  OwnedByAccountFollowersCountAsc = 'ownedByAccount_followersCount_ASC',
  OwnedByAccountFollowersCountDesc = 'ownedByAccount_followersCount_DESC',
  OwnedByAccountFollowingAccountsCountAsc = 'ownedByAccount_followingAccountsCount_ASC',
  OwnedByAccountFollowingAccountsCountDesc = 'ownedByAccount_followingAccountsCount_DESC',
  OwnedByAccountFollowingPostsCountAsc = 'ownedByAccount_followingPostsCount_ASC',
  OwnedByAccountFollowingPostsCountDesc = 'ownedByAccount_followingPostsCount_DESC',
  OwnedByAccountFollowingSpacesCountAsc = 'ownedByAccount_followingSpacesCount_ASC',
  OwnedByAccountFollowingSpacesCountDesc = 'ownedByAccount_followingSpacesCount_DESC',
  OwnedByAccountIdAsc = 'ownedByAccount_id_ASC',
  OwnedByAccountIdDesc = 'ownedByAccount_id_DESC',
  OwnedByAccountOwnedPostsCountAsc = 'ownedByAccount_ownedPostsCount_ASC',
  OwnedByAccountOwnedPostsCountDesc = 'ownedByAccount_ownedPostsCount_DESC',
  OwnedByAccountUpdatedAtBlockAsc = 'ownedByAccount_updatedAtBlock_ASC',
  OwnedByAccountUpdatedAtBlockDesc = 'ownedByAccount_updatedAtBlock_DESC',
  OwnedByAccountUpdatedAtTimeAsc = 'ownedByAccount_updatedAtTime_ASC',
  OwnedByAccountUpdatedAtTimeDesc = 'ownedByAccount_updatedAtTime_DESC',
  ParentPostBodyAsc = 'parentPost_body_ASC',
  ParentPostBodyDesc = 'parentPost_body_DESC',
  ParentPostCanonicalAsc = 'parentPost_canonical_ASC',
  ParentPostCanonicalDesc = 'parentPost_canonical_DESC',
  ParentPostContentAsc = 'parentPost_content_ASC',
  ParentPostContentDesc = 'parentPost_content_DESC',
  ParentPostCreatedAtBlockAsc = 'parentPost_createdAtBlock_ASC',
  ParentPostCreatedAtBlockDesc = 'parentPost_createdAtBlock_DESC',
  ParentPostCreatedAtTimeAsc = 'parentPost_createdAtTime_ASC',
  ParentPostCreatedAtTimeDesc = 'parentPost_createdAtTime_DESC',
  ParentPostCreatedOnDayAsc = 'parentPost_createdOnDay_ASC',
  ParentPostCreatedOnDayDesc = 'parentPost_createdOnDay_DESC',
  ParentPostDownvotesCountAsc = 'parentPost_downvotesCount_ASC',
  ParentPostDownvotesCountDesc = 'parentPost_downvotesCount_DESC',
  ParentPostFollowersCountAsc = 'parentPost_followersCount_ASC',
  ParentPostFollowersCountDesc = 'parentPost_followersCount_DESC',
  ParentPostFormatAsc = 'parentPost_format_ASC',
  ParentPostFormatDesc = 'parentPost_format_DESC',
  ParentPostHiddenRepliesCountAsc = 'parentPost_hiddenRepliesCount_ASC',
  ParentPostHiddenRepliesCountDesc = 'parentPost_hiddenRepliesCount_DESC',
  ParentPostHiddenAsc = 'parentPost_hidden_ASC',
  ParentPostHiddenDesc = 'parentPost_hidden_DESC',
  ParentPostIdAsc = 'parentPost_id_ASC',
  ParentPostIdDesc = 'parentPost_id_DESC',
  ParentPostImageAsc = 'parentPost_image_ASC',
  ParentPostImageDesc = 'parentPost_image_DESC',
  ParentPostInReplyToKindAsc = 'parentPost_inReplyToKind_ASC',
  ParentPostInReplyToKindDesc = 'parentPost_inReplyToKind_DESC',
  ParentPostIsCommentAsc = 'parentPost_isComment_ASC',
  ParentPostIsCommentDesc = 'parentPost_isComment_DESC',
  ParentPostIsShowMoreAsc = 'parentPost_isShowMore_ASC',
  ParentPostIsShowMoreDesc = 'parentPost_isShowMore_DESC',
  ParentPostKindAsc = 'parentPost_kind_ASC',
  ParentPostKindDesc = 'parentPost_kind_DESC',
  ParentPostLinkAsc = 'parentPost_link_ASC',
  ParentPostLinkDesc = 'parentPost_link_DESC',
  ParentPostMetaAsc = 'parentPost_meta_ASC',
  ParentPostMetaDesc = 'parentPost_meta_DESC',
  ParentPostProposalIndexAsc = 'parentPost_proposalIndex_ASC',
  ParentPostProposalIndexDesc = 'parentPost_proposalIndex_DESC',
  ParentPostPublicRepliesCountAsc = 'parentPost_publicRepliesCount_ASC',
  ParentPostPublicRepliesCountDesc = 'parentPost_publicRepliesCount_DESC',
  ParentPostReactionsCountAsc = 'parentPost_reactionsCount_ASC',
  ParentPostReactionsCountDesc = 'parentPost_reactionsCount_DESC',
  ParentPostRepliesCountAsc = 'parentPost_repliesCount_ASC',
  ParentPostRepliesCountDesc = 'parentPost_repliesCount_DESC',
  ParentPostSharesCountAsc = 'parentPost_sharesCount_ASC',
  ParentPostSharesCountDesc = 'parentPost_sharesCount_DESC',
  ParentPostSlugAsc = 'parentPost_slug_ASC',
  ParentPostSlugDesc = 'parentPost_slug_DESC',
  ParentPostSummaryAsc = 'parentPost_summary_ASC',
  ParentPostSummaryDesc = 'parentPost_summary_DESC',
  ParentPostTagsOriginalAsc = 'parentPost_tagsOriginal_ASC',
  ParentPostTagsOriginalDesc = 'parentPost_tagsOriginal_DESC',
  ParentPostTitleAsc = 'parentPost_title_ASC',
  ParentPostTitleDesc = 'parentPost_title_DESC',
  ParentPostTweetIdAsc = 'parentPost_tweetId_ASC',
  ParentPostTweetIdDesc = 'parentPost_tweetId_DESC',
  ParentPostUpdatedAtTimeAsc = 'parentPost_updatedAtTime_ASC',
  ParentPostUpdatedAtTimeDesc = 'parentPost_updatedAtTime_DESC',
  ParentPostUpvotesCountAsc = 'parentPost_upvotesCount_ASC',
  ParentPostUpvotesCountDesc = 'parentPost_upvotesCount_DESC',
  ProposalIndexAsc = 'proposalIndex_ASC',
  ProposalIndexDesc = 'proposalIndex_DESC',
  PublicRepliesCountAsc = 'publicRepliesCount_ASC',
  PublicRepliesCountDesc = 'publicRepliesCount_DESC',
  ReactionsCountAsc = 'reactionsCount_ASC',
  ReactionsCountDesc = 'reactionsCount_DESC',
  RepliesCountAsc = 'repliesCount_ASC',
  RepliesCountDesc = 'repliesCount_DESC',
  RootPostBodyAsc = 'rootPost_body_ASC',
  RootPostBodyDesc = 'rootPost_body_DESC',
  RootPostCanonicalAsc = 'rootPost_canonical_ASC',
  RootPostCanonicalDesc = 'rootPost_canonical_DESC',
  RootPostContentAsc = 'rootPost_content_ASC',
  RootPostContentDesc = 'rootPost_content_DESC',
  RootPostCreatedAtBlockAsc = 'rootPost_createdAtBlock_ASC',
  RootPostCreatedAtBlockDesc = 'rootPost_createdAtBlock_DESC',
  RootPostCreatedAtTimeAsc = 'rootPost_createdAtTime_ASC',
  RootPostCreatedAtTimeDesc = 'rootPost_createdAtTime_DESC',
  RootPostCreatedOnDayAsc = 'rootPost_createdOnDay_ASC',
  RootPostCreatedOnDayDesc = 'rootPost_createdOnDay_DESC',
  RootPostDownvotesCountAsc = 'rootPost_downvotesCount_ASC',
  RootPostDownvotesCountDesc = 'rootPost_downvotesCount_DESC',
  RootPostFollowersCountAsc = 'rootPost_followersCount_ASC',
  RootPostFollowersCountDesc = 'rootPost_followersCount_DESC',
  RootPostFormatAsc = 'rootPost_format_ASC',
  RootPostFormatDesc = 'rootPost_format_DESC',
  RootPostHiddenRepliesCountAsc = 'rootPost_hiddenRepliesCount_ASC',
  RootPostHiddenRepliesCountDesc = 'rootPost_hiddenRepliesCount_DESC',
  RootPostHiddenAsc = 'rootPost_hidden_ASC',
  RootPostHiddenDesc = 'rootPost_hidden_DESC',
  RootPostIdAsc = 'rootPost_id_ASC',
  RootPostIdDesc = 'rootPost_id_DESC',
  RootPostImageAsc = 'rootPost_image_ASC',
  RootPostImageDesc = 'rootPost_image_DESC',
  RootPostInReplyToKindAsc = 'rootPost_inReplyToKind_ASC',
  RootPostInReplyToKindDesc = 'rootPost_inReplyToKind_DESC',
  RootPostIsCommentAsc = 'rootPost_isComment_ASC',
  RootPostIsCommentDesc = 'rootPost_isComment_DESC',
  RootPostIsShowMoreAsc = 'rootPost_isShowMore_ASC',
  RootPostIsShowMoreDesc = 'rootPost_isShowMore_DESC',
  RootPostKindAsc = 'rootPost_kind_ASC',
  RootPostKindDesc = 'rootPost_kind_DESC',
  RootPostLinkAsc = 'rootPost_link_ASC',
  RootPostLinkDesc = 'rootPost_link_DESC',
  RootPostMetaAsc = 'rootPost_meta_ASC',
  RootPostMetaDesc = 'rootPost_meta_DESC',
  RootPostProposalIndexAsc = 'rootPost_proposalIndex_ASC',
  RootPostProposalIndexDesc = 'rootPost_proposalIndex_DESC',
  RootPostPublicRepliesCountAsc = 'rootPost_publicRepliesCount_ASC',
  RootPostPublicRepliesCountDesc = 'rootPost_publicRepliesCount_DESC',
  RootPostReactionsCountAsc = 'rootPost_reactionsCount_ASC',
  RootPostReactionsCountDesc = 'rootPost_reactionsCount_DESC',
  RootPostRepliesCountAsc = 'rootPost_repliesCount_ASC',
  RootPostRepliesCountDesc = 'rootPost_repliesCount_DESC',
  RootPostSharesCountAsc = 'rootPost_sharesCount_ASC',
  RootPostSharesCountDesc = 'rootPost_sharesCount_DESC',
  RootPostSlugAsc = 'rootPost_slug_ASC',
  RootPostSlugDesc = 'rootPost_slug_DESC',
  RootPostSummaryAsc = 'rootPost_summary_ASC',
  RootPostSummaryDesc = 'rootPost_summary_DESC',
  RootPostTagsOriginalAsc = 'rootPost_tagsOriginal_ASC',
  RootPostTagsOriginalDesc = 'rootPost_tagsOriginal_DESC',
  RootPostTitleAsc = 'rootPost_title_ASC',
  RootPostTitleDesc = 'rootPost_title_DESC',
  RootPostTweetIdAsc = 'rootPost_tweetId_ASC',
  RootPostTweetIdDesc = 'rootPost_tweetId_DESC',
  RootPostUpdatedAtTimeAsc = 'rootPost_updatedAtTime_ASC',
  RootPostUpdatedAtTimeDesc = 'rootPost_updatedAtTime_DESC',
  RootPostUpvotesCountAsc = 'rootPost_upvotesCount_ASC',
  RootPostUpvotesCountDesc = 'rootPost_upvotesCount_DESC',
  SharedPostBodyAsc = 'sharedPost_body_ASC',
  SharedPostBodyDesc = 'sharedPost_body_DESC',
  SharedPostCanonicalAsc = 'sharedPost_canonical_ASC',
  SharedPostCanonicalDesc = 'sharedPost_canonical_DESC',
  SharedPostContentAsc = 'sharedPost_content_ASC',
  SharedPostContentDesc = 'sharedPost_content_DESC',
  SharedPostCreatedAtBlockAsc = 'sharedPost_createdAtBlock_ASC',
  SharedPostCreatedAtBlockDesc = 'sharedPost_createdAtBlock_DESC',
  SharedPostCreatedAtTimeAsc = 'sharedPost_createdAtTime_ASC',
  SharedPostCreatedAtTimeDesc = 'sharedPost_createdAtTime_DESC',
  SharedPostCreatedOnDayAsc = 'sharedPost_createdOnDay_ASC',
  SharedPostCreatedOnDayDesc = 'sharedPost_createdOnDay_DESC',
  SharedPostDownvotesCountAsc = 'sharedPost_downvotesCount_ASC',
  SharedPostDownvotesCountDesc = 'sharedPost_downvotesCount_DESC',
  SharedPostFollowersCountAsc = 'sharedPost_followersCount_ASC',
  SharedPostFollowersCountDesc = 'sharedPost_followersCount_DESC',
  SharedPostFormatAsc = 'sharedPost_format_ASC',
  SharedPostFormatDesc = 'sharedPost_format_DESC',
  SharedPostHiddenRepliesCountAsc = 'sharedPost_hiddenRepliesCount_ASC',
  SharedPostHiddenRepliesCountDesc = 'sharedPost_hiddenRepliesCount_DESC',
  SharedPostHiddenAsc = 'sharedPost_hidden_ASC',
  SharedPostHiddenDesc = 'sharedPost_hidden_DESC',
  SharedPostIdAsc = 'sharedPost_id_ASC',
  SharedPostIdDesc = 'sharedPost_id_DESC',
  SharedPostImageAsc = 'sharedPost_image_ASC',
  SharedPostImageDesc = 'sharedPost_image_DESC',
  SharedPostInReplyToKindAsc = 'sharedPost_inReplyToKind_ASC',
  SharedPostInReplyToKindDesc = 'sharedPost_inReplyToKind_DESC',
  SharedPostIsCommentAsc = 'sharedPost_isComment_ASC',
  SharedPostIsCommentDesc = 'sharedPost_isComment_DESC',
  SharedPostIsShowMoreAsc = 'sharedPost_isShowMore_ASC',
  SharedPostIsShowMoreDesc = 'sharedPost_isShowMore_DESC',
  SharedPostKindAsc = 'sharedPost_kind_ASC',
  SharedPostKindDesc = 'sharedPost_kind_DESC',
  SharedPostLinkAsc = 'sharedPost_link_ASC',
  SharedPostLinkDesc = 'sharedPost_link_DESC',
  SharedPostMetaAsc = 'sharedPost_meta_ASC',
  SharedPostMetaDesc = 'sharedPost_meta_DESC',
  SharedPostProposalIndexAsc = 'sharedPost_proposalIndex_ASC',
  SharedPostProposalIndexDesc = 'sharedPost_proposalIndex_DESC',
  SharedPostPublicRepliesCountAsc = 'sharedPost_publicRepliesCount_ASC',
  SharedPostPublicRepliesCountDesc = 'sharedPost_publicRepliesCount_DESC',
  SharedPostReactionsCountAsc = 'sharedPost_reactionsCount_ASC',
  SharedPostReactionsCountDesc = 'sharedPost_reactionsCount_DESC',
  SharedPostRepliesCountAsc = 'sharedPost_repliesCount_ASC',
  SharedPostRepliesCountDesc = 'sharedPost_repliesCount_DESC',
  SharedPostSharesCountAsc = 'sharedPost_sharesCount_ASC',
  SharedPostSharesCountDesc = 'sharedPost_sharesCount_DESC',
  SharedPostSlugAsc = 'sharedPost_slug_ASC',
  SharedPostSlugDesc = 'sharedPost_slug_DESC',
  SharedPostSummaryAsc = 'sharedPost_summary_ASC',
  SharedPostSummaryDesc = 'sharedPost_summary_DESC',
  SharedPostTagsOriginalAsc = 'sharedPost_tagsOriginal_ASC',
  SharedPostTagsOriginalDesc = 'sharedPost_tagsOriginal_DESC',
  SharedPostTitleAsc = 'sharedPost_title_ASC',
  SharedPostTitleDesc = 'sharedPost_title_DESC',
  SharedPostTweetIdAsc = 'sharedPost_tweetId_ASC',
  SharedPostTweetIdDesc = 'sharedPost_tweetId_DESC',
  SharedPostUpdatedAtTimeAsc = 'sharedPost_updatedAtTime_ASC',
  SharedPostUpdatedAtTimeDesc = 'sharedPost_updatedAtTime_DESC',
  SharedPostUpvotesCountAsc = 'sharedPost_upvotesCount_ASC',
  SharedPostUpvotesCountDesc = 'sharedPost_upvotesCount_DESC',
  SharesCountAsc = 'sharesCount_ASC',
  SharesCountDesc = 'sharesCount_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SpaceAboutAsc = 'space_about_ASC',
  SpaceAboutDesc = 'space_about_DESC',
  SpaceCanEveryoneCreatePostsAsc = 'space_canEveryoneCreatePosts_ASC',
  SpaceCanEveryoneCreatePostsDesc = 'space_canEveryoneCreatePosts_DESC',
  SpaceCanFollowerCreatePostsAsc = 'space_canFollowerCreatePosts_ASC',
  SpaceCanFollowerCreatePostsDesc = 'space_canFollowerCreatePosts_DESC',
  SpaceContentAsc = 'space_content_ASC',
  SpaceContentDesc = 'space_content_DESC',
  SpaceCreatedAtBlockAsc = 'space_createdAtBlock_ASC',
  SpaceCreatedAtBlockDesc = 'space_createdAtBlock_DESC',
  SpaceCreatedAtTimeAsc = 'space_createdAtTime_ASC',
  SpaceCreatedAtTimeDesc = 'space_createdAtTime_DESC',
  SpaceCreatedOnDayAsc = 'space_createdOnDay_ASC',
  SpaceCreatedOnDayDesc = 'space_createdOnDay_DESC',
  SpaceEmailAsc = 'space_email_ASC',
  SpaceEmailDesc = 'space_email_DESC',
  SpaceFollowersCountAsc = 'space_followersCount_ASC',
  SpaceFollowersCountDesc = 'space_followersCount_DESC',
  SpaceFormatAsc = 'space_format_ASC',
  SpaceFormatDesc = 'space_format_DESC',
  SpaceHandleAsc = 'space_handle_ASC',
  SpaceHandleDesc = 'space_handle_DESC',
  SpaceHiddenPostsCountAsc = 'space_hiddenPostsCount_ASC',
  SpaceHiddenPostsCountDesc = 'space_hiddenPostsCount_DESC',
  SpaceHiddenAsc = 'space_hidden_ASC',
  SpaceHiddenDesc = 'space_hidden_DESC',
  SpaceIdAsc = 'space_id_ASC',
  SpaceIdDesc = 'space_id_DESC',
  SpaceImageAsc = 'space_image_ASC',
  SpaceImageDesc = 'space_image_DESC',
  SpaceInterestsOriginalAsc = 'space_interestsOriginal_ASC',
  SpaceInterestsOriginalDesc = 'space_interestsOriginal_DESC',
  SpaceIsShowMoreAsc = 'space_isShowMore_ASC',
  SpaceIsShowMoreDesc = 'space_isShowMore_DESC',
  SpaceLinksOriginalAsc = 'space_linksOriginal_ASC',
  SpaceLinksOriginalDesc = 'space_linksOriginal_DESC',
  SpaceNameAsc = 'space_name_ASC',
  SpaceNameDesc = 'space_name_DESC',
  SpacePostsCountAsc = 'space_postsCount_ASC',
  SpacePostsCountDesc = 'space_postsCount_DESC',
  SpacePublicPostsCountAsc = 'space_publicPostsCount_ASC',
  SpacePublicPostsCountDesc = 'space_publicPostsCount_DESC',
  SpaceSummaryAsc = 'space_summary_ASC',
  SpaceSummaryDesc = 'space_summary_DESC',
  SpaceTagsOriginalAsc = 'space_tagsOriginal_ASC',
  SpaceTagsOriginalDesc = 'space_tagsOriginal_DESC',
  SpaceUpdatedAtBlockAsc = 'space_updatedAtBlock_ASC',
  SpaceUpdatedAtBlockDesc = 'space_updatedAtBlock_DESC',
  SpaceUpdatedAtTimeAsc = 'space_updatedAtTime_ASC',
  SpaceUpdatedAtTimeDesc = 'space_updatedAtTime_DESC',
  SpaceUsernameAsc = 'space_username_ASC',
  SpaceUsernameDesc = 'space_username_DESC',
  SummaryAsc = 'summary_ASC',
  SummaryDesc = 'summary_DESC',
  TagsOriginalAsc = 'tagsOriginal_ASC',
  TagsOriginalDesc = 'tagsOriginal_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TweetDetailsAuthorIdAsc = 'tweetDetails_authorId_ASC',
  TweetDetailsAuthorIdDesc = 'tweetDetails_authorId_DESC',
  TweetDetailsConversationIdAsc = 'tweetDetails_conversationId_ASC',
  TweetDetailsConversationIdDesc = 'tweetDetails_conversationId_DESC',
  TweetDetailsCreatedAtAsc = 'tweetDetails_createdAt_ASC',
  TweetDetailsCreatedAtDesc = 'tweetDetails_createdAt_DESC',
  TweetDetailsInReplyToUserIdAsc = 'tweetDetails_inReplyToUserId_ASC',
  TweetDetailsInReplyToUserIdDesc = 'tweetDetails_inReplyToUserId_DESC',
  TweetDetailsLangAsc = 'tweetDetails_lang_ASC',
  TweetDetailsLangDesc = 'tweetDetails_lang_DESC',
  TweetDetailsUsernameAsc = 'tweetDetails_username_ASC',
  TweetDetailsUsernameDesc = 'tweetDetails_username_DESC',
  TweetIdAsc = 'tweetId_ASC',
  TweetIdDesc = 'tweetId_DESC',
  UpdatedAtTimeAsc = 'updatedAtTime_ASC',
  UpdatedAtTimeDesc = 'updatedAtTime_DESC',
  UpvotesCountAsc = 'upvotesCount_ASC',
  UpvotesCountDesc = 'upvotesCount_DESC'
}

export type PostWhereInput = {
  AND?: InputMaybe<Array<PostWhereInput>>;
  OR?: InputMaybe<Array<PostWhereInput>>;
  body_contains?: InputMaybe<Scalars['String']['input']>;
  body_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  body_endsWith?: InputMaybe<Scalars['String']['input']>;
  body_eq?: InputMaybe<Scalars['String']['input']>;
  body_gt?: InputMaybe<Scalars['String']['input']>;
  body_gte?: InputMaybe<Scalars['String']['input']>;
  body_in?: InputMaybe<Array<Scalars['String']['input']>>;
  body_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  body_lt?: InputMaybe<Scalars['String']['input']>;
  body_lte?: InputMaybe<Scalars['String']['input']>;
  body_not_contains?: InputMaybe<Scalars['String']['input']>;
  body_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  body_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  body_not_eq?: InputMaybe<Scalars['String']['input']>;
  body_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  body_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  body_startsWith?: InputMaybe<Scalars['String']['input']>;
  canonical_contains?: InputMaybe<Scalars['String']['input']>;
  canonical_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  canonical_endsWith?: InputMaybe<Scalars['String']['input']>;
  canonical_eq?: InputMaybe<Scalars['String']['input']>;
  canonical_gt?: InputMaybe<Scalars['String']['input']>;
  canonical_gte?: InputMaybe<Scalars['String']['input']>;
  canonical_in?: InputMaybe<Array<Scalars['String']['input']>>;
  canonical_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  canonical_lt?: InputMaybe<Scalars['String']['input']>;
  canonical_lte?: InputMaybe<Scalars['String']['input']>;
  canonical_not_contains?: InputMaybe<Scalars['String']['input']>;
  canonical_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  canonical_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  canonical_not_eq?: InputMaybe<Scalars['String']['input']>;
  canonical_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  canonical_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  canonical_startsWith?: InputMaybe<Scalars['String']['input']>;
  commentFollowers_every?: InputMaybe<CommentFollowersWhereInput>;
  commentFollowers_none?: InputMaybe<CommentFollowersWhereInput>;
  commentFollowers_some?: InputMaybe<CommentFollowersWhereInput>;
  content_contains?: InputMaybe<Scalars['String']['input']>;
  content_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  content_endsWith?: InputMaybe<Scalars['String']['input']>;
  content_eq?: InputMaybe<Scalars['String']['input']>;
  content_gt?: InputMaybe<Scalars['String']['input']>;
  content_gte?: InputMaybe<Scalars['String']['input']>;
  content_in?: InputMaybe<Array<Scalars['String']['input']>>;
  content_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  content_lt?: InputMaybe<Scalars['String']['input']>;
  content_lte?: InputMaybe<Scalars['String']['input']>;
  content_not_contains?: InputMaybe<Scalars['String']['input']>;
  content_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  content_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  content_not_eq?: InputMaybe<Scalars['String']['input']>;
  content_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  content_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  content_startsWith?: InputMaybe<Scalars['String']['input']>;
  createdAtBlock_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtBlock_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtTime_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_gt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_gte?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  createdAtTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtTime_lt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_lte?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  createdByAccount?: InputMaybe<AccountWhereInput>;
  createdByAccount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdOnDay_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdOnDay_gt?: InputMaybe<Scalars['DateTime']['input']>;
  createdOnDay_gte?: InputMaybe<Scalars['DateTime']['input']>;
  createdOnDay_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  createdOnDay_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdOnDay_lt?: InputMaybe<Scalars['DateTime']['input']>;
  createdOnDay_lte?: InputMaybe<Scalars['DateTime']['input']>;
  createdOnDay_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdOnDay_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  downvotesCount_eq?: InputMaybe<Scalars['Int']['input']>;
  downvotesCount_gt?: InputMaybe<Scalars['Int']['input']>;
  downvotesCount_gte?: InputMaybe<Scalars['Int']['input']>;
  downvotesCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  downvotesCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  downvotesCount_lt?: InputMaybe<Scalars['Int']['input']>;
  downvotesCount_lte?: InputMaybe<Scalars['Int']['input']>;
  downvotesCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  downvotesCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  experimental_eq?: InputMaybe<Scalars['JSON']['input']>;
  experimental_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  experimental_jsonContains?: InputMaybe<Scalars['JSON']['input']>;
  experimental_jsonHasKey?: InputMaybe<Scalars['JSON']['input']>;
  experimental_not_eq?: InputMaybe<Scalars['JSON']['input']>;
  extensions_every?: InputMaybe<ContentExtensionWhereInput>;
  extensions_none?: InputMaybe<ContentExtensionWhereInput>;
  extensions_some?: InputMaybe<ContentExtensionWhereInput>;
  followersCount_eq?: InputMaybe<Scalars['Int']['input']>;
  followersCount_gt?: InputMaybe<Scalars['Int']['input']>;
  followersCount_gte?: InputMaybe<Scalars['Int']['input']>;
  followersCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  followersCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  followersCount_lt?: InputMaybe<Scalars['Int']['input']>;
  followersCount_lte?: InputMaybe<Scalars['Int']['input']>;
  followersCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  followersCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  format_contains?: InputMaybe<Scalars['String']['input']>;
  format_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  format_endsWith?: InputMaybe<Scalars['String']['input']>;
  format_eq?: InputMaybe<Scalars['String']['input']>;
  format_gt?: InputMaybe<Scalars['String']['input']>;
  format_gte?: InputMaybe<Scalars['String']['input']>;
  format_in?: InputMaybe<Array<Scalars['String']['input']>>;
  format_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  format_lt?: InputMaybe<Scalars['String']['input']>;
  format_lte?: InputMaybe<Scalars['String']['input']>;
  format_not_contains?: InputMaybe<Scalars['String']['input']>;
  format_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  format_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  format_not_eq?: InputMaybe<Scalars['String']['input']>;
  format_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  format_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  format_startsWith?: InputMaybe<Scalars['String']['input']>;
  hiddenRepliesCount_eq?: InputMaybe<Scalars['Int']['input']>;
  hiddenRepliesCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hiddenRepliesCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hiddenRepliesCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hiddenRepliesCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hiddenRepliesCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hiddenRepliesCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hiddenRepliesCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  hiddenRepliesCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hidden_eq?: InputMaybe<Scalars['Boolean']['input']>;
  hidden_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hidden_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_contains?: InputMaybe<Scalars['String']['input']>;
  image_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_eq?: InputMaybe<Scalars['String']['input']>;
  image_gt?: InputMaybe<Scalars['String']['input']>;
  image_gte?: InputMaybe<Scalars['String']['input']>;
  image_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  image_lt?: InputMaybe<Scalars['String']['input']>;
  image_lte?: InputMaybe<Scalars['String']['input']>;
  image_not_contains?: InputMaybe<Scalars['String']['input']>;
  image_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_not_eq?: InputMaybe<Scalars['String']['input']>;
  image_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_startsWith?: InputMaybe<Scalars['String']['input']>;
  inReplyToKind_eq?: InputMaybe<InReplyToKind>;
  inReplyToKind_in?: InputMaybe<Array<InReplyToKind>>;
  inReplyToKind_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  inReplyToKind_not_eq?: InputMaybe<InReplyToKind>;
  inReplyToKind_not_in?: InputMaybe<Array<InReplyToKind>>;
  inReplyToPost?: InputMaybe<PostWhereInput>;
  inReplyToPost_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  isComment_eq?: InputMaybe<Scalars['Boolean']['input']>;
  isComment_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  isComment_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  isShowMore_eq?: InputMaybe<Scalars['Boolean']['input']>;
  isShowMore_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  isShowMore_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  kind_eq?: InputMaybe<PostKind>;
  kind_in?: InputMaybe<Array<PostKind>>;
  kind_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  kind_not_eq?: InputMaybe<PostKind>;
  kind_not_in?: InputMaybe<Array<PostKind>>;
  link_contains?: InputMaybe<Scalars['String']['input']>;
  link_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  link_endsWith?: InputMaybe<Scalars['String']['input']>;
  link_eq?: InputMaybe<Scalars['String']['input']>;
  link_gt?: InputMaybe<Scalars['String']['input']>;
  link_gte?: InputMaybe<Scalars['String']['input']>;
  link_in?: InputMaybe<Array<Scalars['String']['input']>>;
  link_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  link_lt?: InputMaybe<Scalars['String']['input']>;
  link_lte?: InputMaybe<Scalars['String']['input']>;
  link_not_contains?: InputMaybe<Scalars['String']['input']>;
  link_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  link_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  link_not_eq?: InputMaybe<Scalars['String']['input']>;
  link_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  link_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  link_startsWith?: InputMaybe<Scalars['String']['input']>;
  meta_contains?: InputMaybe<Scalars['String']['input']>;
  meta_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  meta_endsWith?: InputMaybe<Scalars['String']['input']>;
  meta_eq?: InputMaybe<Scalars['String']['input']>;
  meta_gt?: InputMaybe<Scalars['String']['input']>;
  meta_gte?: InputMaybe<Scalars['String']['input']>;
  meta_in?: InputMaybe<Array<Scalars['String']['input']>>;
  meta_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  meta_lt?: InputMaybe<Scalars['String']['input']>;
  meta_lte?: InputMaybe<Scalars['String']['input']>;
  meta_not_contains?: InputMaybe<Scalars['String']['input']>;
  meta_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  meta_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  meta_not_eq?: InputMaybe<Scalars['String']['input']>;
  meta_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  meta_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  meta_startsWith?: InputMaybe<Scalars['String']['input']>;
  ownedByAccount?: InputMaybe<AccountWhereInput>;
  ownedByAccount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  parentPost?: InputMaybe<PostWhereInput>;
  parentPost_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  pinnedByExtensions_every?: InputMaybe<ExtensionPinnedResourceWhereInput>;
  pinnedByExtensions_none?: InputMaybe<ExtensionPinnedResourceWhereInput>;
  pinnedByExtensions_some?: InputMaybe<ExtensionPinnedResourceWhereInput>;
  postFollowers_every?: InputMaybe<PostFollowersWhereInput>;
  postFollowers_none?: InputMaybe<PostFollowersWhereInput>;
  postFollowers_some?: InputMaybe<PostFollowersWhereInput>;
  proposalIndex_eq?: InputMaybe<Scalars['Int']['input']>;
  proposalIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  proposalIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  proposalIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  proposalIndex_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  proposalIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  proposalIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  proposalIndex_not_eq?: InputMaybe<Scalars['Int']['input']>;
  proposalIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  publicRepliesCount_eq?: InputMaybe<Scalars['Int']['input']>;
  publicRepliesCount_gt?: InputMaybe<Scalars['Int']['input']>;
  publicRepliesCount_gte?: InputMaybe<Scalars['Int']['input']>;
  publicRepliesCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  publicRepliesCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  publicRepliesCount_lt?: InputMaybe<Scalars['Int']['input']>;
  publicRepliesCount_lte?: InputMaybe<Scalars['Int']['input']>;
  publicRepliesCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  publicRepliesCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  reactionsCount_eq?: InputMaybe<Scalars['Int']['input']>;
  reactionsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  reactionsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  reactionsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  reactionsCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  reactionsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  reactionsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  reactionsCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  reactionsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  reactions_every?: InputMaybe<ReactionWhereInput>;
  reactions_none?: InputMaybe<ReactionWhereInput>;
  reactions_some?: InputMaybe<ReactionWhereInput>;
  repliesCount_eq?: InputMaybe<Scalars['Int']['input']>;
  repliesCount_gt?: InputMaybe<Scalars['Int']['input']>;
  repliesCount_gte?: InputMaybe<Scalars['Int']['input']>;
  repliesCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  repliesCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  repliesCount_lt?: InputMaybe<Scalars['Int']['input']>;
  repliesCount_lte?: InputMaybe<Scalars['Int']['input']>;
  repliesCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  repliesCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rootPost?: InputMaybe<PostWhereInput>;
  rootPost_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  sharedPost?: InputMaybe<PostWhereInput>;
  sharedPost_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  sharesCount_eq?: InputMaybe<Scalars['Int']['input']>;
  sharesCount_gt?: InputMaybe<Scalars['Int']['input']>;
  sharesCount_gte?: InputMaybe<Scalars['Int']['input']>;
  sharesCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  sharesCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  sharesCount_lt?: InputMaybe<Scalars['Int']['input']>;
  sharesCount_lte?: InputMaybe<Scalars['Int']['input']>;
  sharesCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  sharesCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  slug_contains?: InputMaybe<Scalars['String']['input']>;
  slug_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  slug_endsWith?: InputMaybe<Scalars['String']['input']>;
  slug_eq?: InputMaybe<Scalars['String']['input']>;
  slug_gt?: InputMaybe<Scalars['String']['input']>;
  slug_gte?: InputMaybe<Scalars['String']['input']>;
  slug_in?: InputMaybe<Array<Scalars['String']['input']>>;
  slug_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  slug_lt?: InputMaybe<Scalars['String']['input']>;
  slug_lte?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains?: InputMaybe<Scalars['String']['input']>;
  slug_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  slug_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  slug_not_eq?: InputMaybe<Scalars['String']['input']>;
  slug_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  slug_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  slug_startsWith?: InputMaybe<Scalars['String']['input']>;
  space?: InputMaybe<SpaceWhereInput>;
  space_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  summary_contains?: InputMaybe<Scalars['String']['input']>;
  summary_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  summary_endsWith?: InputMaybe<Scalars['String']['input']>;
  summary_eq?: InputMaybe<Scalars['String']['input']>;
  summary_gt?: InputMaybe<Scalars['String']['input']>;
  summary_gte?: InputMaybe<Scalars['String']['input']>;
  summary_in?: InputMaybe<Array<Scalars['String']['input']>>;
  summary_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  summary_lt?: InputMaybe<Scalars['String']['input']>;
  summary_lte?: InputMaybe<Scalars['String']['input']>;
  summary_not_contains?: InputMaybe<Scalars['String']['input']>;
  summary_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  summary_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  summary_not_eq?: InputMaybe<Scalars['String']['input']>;
  summary_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  summary_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  summary_startsWith?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_contains?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_endsWith?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_eq?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_gt?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_gte?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tagsOriginal_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  tagsOriginal_lt?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_lte?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_not_contains?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_not_eq?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tagsOriginal_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_startsWith?: InputMaybe<Scalars['String']['input']>;
  title_contains?: InputMaybe<Scalars['String']['input']>;
  title_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  title_endsWith?: InputMaybe<Scalars['String']['input']>;
  title_eq?: InputMaybe<Scalars['String']['input']>;
  title_gt?: InputMaybe<Scalars['String']['input']>;
  title_gte?: InputMaybe<Scalars['String']['input']>;
  title_in?: InputMaybe<Array<Scalars['String']['input']>>;
  title_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  title_lt?: InputMaybe<Scalars['String']['input']>;
  title_lte?: InputMaybe<Scalars['String']['input']>;
  title_not_contains?: InputMaybe<Scalars['String']['input']>;
  title_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  title_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  title_not_eq?: InputMaybe<Scalars['String']['input']>;
  title_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  title_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  title_startsWith?: InputMaybe<Scalars['String']['input']>;
  tweetDetails?: InputMaybe<TweetDetailsWhereInput>;
  tweetDetails_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  tweetId_contains?: InputMaybe<Scalars['String']['input']>;
  tweetId_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  tweetId_endsWith?: InputMaybe<Scalars['String']['input']>;
  tweetId_eq?: InputMaybe<Scalars['String']['input']>;
  tweetId_gt?: InputMaybe<Scalars['String']['input']>;
  tweetId_gte?: InputMaybe<Scalars['String']['input']>;
  tweetId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tweetId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  tweetId_lt?: InputMaybe<Scalars['String']['input']>;
  tweetId_lte?: InputMaybe<Scalars['String']['input']>;
  tweetId_not_contains?: InputMaybe<Scalars['String']['input']>;
  tweetId_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  tweetId_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  tweetId_not_eq?: InputMaybe<Scalars['String']['input']>;
  tweetId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tweetId_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  tweetId_startsWith?: InputMaybe<Scalars['String']['input']>;
  updatedAtTime_eq?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_gt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_gte?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  updatedAtTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAtTime_lt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_lte?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  upvotesCount_eq?: InputMaybe<Scalars['Int']['input']>;
  upvotesCount_gt?: InputMaybe<Scalars['Int']['input']>;
  upvotesCount_gte?: InputMaybe<Scalars['Int']['input']>;
  upvotesCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  upvotesCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  upvotesCount_lt?: InputMaybe<Scalars['Int']['input']>;
  upvotesCount_lte?: InputMaybe<Scalars['Int']['input']>;
  upvotesCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  upvotesCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type PostsConnection = {
  __typename?: 'PostsConnection';
  edges: Array<PostEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  accountById?: Maybe<Account>;
  /** @deprecated Use accountById */
  accountByUniqueInput?: Maybe<Account>;
  accountFollowers: Array<AccountFollowers>;
  accountFollowersById?: Maybe<AccountFollowers>;
  /** @deprecated Use accountFollowersById */
  accountFollowersByUniqueInput?: Maybe<AccountFollowers>;
  accountFollowersConnection: AccountFollowersConnection;
  accounts: Array<Account>;
  accountsConnection: AccountsConnection;
  activeUsersTotalCount: ActiveUsersTotalCount;
  activeUsersTotalCountWithFilters: UserRetentionCountModel;
  activities: Array<Activity>;
  activitiesConnection: ActivitiesConnection;
  activityById?: Maybe<Activity>;
  /** @deprecated Use activityById */
  activityByUniqueInput?: Maybe<Activity>;
  commentFollowers: Array<CommentFollowers>;
  commentFollowersById?: Maybe<CommentFollowers>;
  /** @deprecated Use commentFollowersById */
  commentFollowersByUniqueInput?: Maybe<CommentFollowers>;
  commentFollowersConnection: CommentFollowersConnection;
  contentExtensionById?: Maybe<ContentExtension>;
  /** @deprecated Use contentExtensionById */
  contentExtensionByUniqueInput?: Maybe<ContentExtension>;
  contentExtensions: Array<ContentExtension>;
  contentExtensionsConnection: ContentExtensionsConnection;
  evmAccountById?: Maybe<EvmAccount>;
  /** @deprecated Use evmAccountById */
  evmAccountByUniqueInput?: Maybe<EvmAccount>;
  evmAccounts: Array<EvmAccount>;
  evmAccountsConnection: EvmAccountsConnection;
  evmSubstrateAccountLinkById?: Maybe<EvmSubstrateAccountLink>;
  /** @deprecated Use evmSubstrateAccountLinkById */
  evmSubstrateAccountLinkByUniqueInput?: Maybe<EvmSubstrateAccountLink>;
  evmSubstrateAccountLinks: Array<EvmSubstrateAccountLink>;
  evmSubstrateAccountLinksConnection: EvmSubstrateAccountLinksConnection;
  extensionPinnedResourceById?: Maybe<ExtensionPinnedResource>;
  /** @deprecated Use extensionPinnedResourceById */
  extensionPinnedResourceByUniqueInput?: Maybe<ExtensionPinnedResource>;
  extensionPinnedResources: Array<ExtensionPinnedResource>;
  extensionPinnedResourcesConnection: ExtensionPinnedResourcesConnection;
  inBatchNotifications: Array<InBatchNotifications>;
  inBatchNotificationsById?: Maybe<InBatchNotifications>;
  /** @deprecated Use inBatchNotificationsById */
  inBatchNotificationsByUniqueInput?: Maybe<InBatchNotifications>;
  inBatchNotificationsConnection: InBatchNotificationsConnection;
  ipfsFetchLogById?: Maybe<IpfsFetchLog>;
  /** @deprecated Use ipfsFetchLogById */
  ipfsFetchLogByUniqueInput?: Maybe<IpfsFetchLog>;
  ipfsFetchLogs: Array<IpfsFetchLog>;
  ipfsFetchLogsConnection: IpfsFetchLogsConnection;
  newsFeedById?: Maybe<NewsFeed>;
  /** @deprecated Use newsFeedById */
  newsFeedByUniqueInput?: Maybe<NewsFeed>;
  newsFeeds: Array<NewsFeed>;
  newsFeedsConnection: NewsFeedsConnection;
  notificationById?: Maybe<Notification>;
  /** @deprecated Use notificationById */
  notificationByUniqueInput?: Maybe<Notification>;
  notifications: Array<Notification>;
  notificationsConnection: NotificationsConnection;
  postById?: Maybe<Post>;
  /** @deprecated Use postById */
  postByUniqueInput?: Maybe<Post>;
  postFollowers: Array<PostFollowers>;
  postFollowersById?: Maybe<PostFollowers>;
  /** @deprecated Use postFollowersById */
  postFollowersByUniqueInput?: Maybe<PostFollowers>;
  postFollowersConnection: PostFollowersConnection;
  posts: Array<Post>;
  postsConnection: PostsConnection;
  reactionById?: Maybe<Reaction>;
  /** @deprecated Use reactionById */
  reactionByUniqueInput?: Maybe<Reaction>;
  reactions: Array<Reaction>;
  reactionsConnection: ReactionsConnection;
  searchQuery: ElasticSearchQueryResultEntity;
  spaceById?: Maybe<Space>;
  /** @deprecated Use spaceById */
  spaceByUniqueInput?: Maybe<Space>;
  spaceFollowers: Array<SpaceFollowers>;
  spaceFollowersById?: Maybe<SpaceFollowers>;
  /** @deprecated Use spaceFollowersById */
  spaceFollowersByUniqueInput?: Maybe<SpaceFollowers>;
  spaceFollowersConnection: SpaceFollowersConnection;
  spaces: Array<Space>;
  spacesConnection: SpacesConnection;
  squidStatus?: Maybe<SquidStatus>;
  userRetentionCount: UserRetentionCountFullModel;
};


export type QueryAccountByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryAccountByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryAccountFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AccountFollowersOrderByInput>>;
  where?: InputMaybe<AccountFollowersWhereInput>;
};


export type QueryAccountFollowersByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryAccountFollowersByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryAccountFollowersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<AccountFollowersOrderByInput>;
  where?: InputMaybe<AccountFollowersWhereInput>;
};


export type QueryAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AccountOrderByInput>>;
  where?: InputMaybe<AccountWhereInput>;
};


export type QueryAccountsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<AccountOrderByInput>;
  where?: InputMaybe<AccountWhereInput>;
};


export type QueryActiveUsersTotalCountArgs = {
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
};


export type QueryActiveUsersTotalCountWithFiltersArgs = {
  exclude_body?: InputMaybe<Array<Scalars['String']['input']>>;
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
  total_min_posts_number: Scalars['Float']['input'];
};


export type QueryActivitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ActivityOrderByInput>>;
  where?: InputMaybe<ActivityWhereInput>;
};


export type QueryActivitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<ActivityOrderByInput>;
  where?: InputMaybe<ActivityWhereInput>;
};


export type QueryActivityByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryActivityByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryCommentFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CommentFollowersOrderByInput>>;
  where?: InputMaybe<CommentFollowersWhereInput>;
};


export type QueryCommentFollowersByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryCommentFollowersByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryCommentFollowersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<CommentFollowersOrderByInput>;
  where?: InputMaybe<CommentFollowersWhereInput>;
};


export type QueryContentExtensionByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryContentExtensionByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryContentExtensionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ContentExtensionOrderByInput>>;
  where?: InputMaybe<ContentExtensionWhereInput>;
};


export type QueryContentExtensionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<ContentExtensionOrderByInput>;
  where?: InputMaybe<ContentExtensionWhereInput>;
};


export type QueryEvmAccountByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryEvmAccountByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryEvmAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EvmAccountOrderByInput>>;
  where?: InputMaybe<EvmAccountWhereInput>;
};


export type QueryEvmAccountsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<EvmAccountOrderByInput>;
  where?: InputMaybe<EvmAccountWhereInput>;
};


export type QueryEvmSubstrateAccountLinkByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryEvmSubstrateAccountLinkByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryEvmSubstrateAccountLinksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EvmSubstrateAccountLinkOrderByInput>>;
  where?: InputMaybe<EvmSubstrateAccountLinkWhereInput>;
};


export type QueryEvmSubstrateAccountLinksConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<EvmSubstrateAccountLinkOrderByInput>;
  where?: InputMaybe<EvmSubstrateAccountLinkWhereInput>;
};


export type QueryExtensionPinnedResourceByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryExtensionPinnedResourceByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryExtensionPinnedResourcesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ExtensionPinnedResourceOrderByInput>>;
  where?: InputMaybe<ExtensionPinnedResourceWhereInput>;
};


export type QueryExtensionPinnedResourcesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<ExtensionPinnedResourceOrderByInput>;
  where?: InputMaybe<ExtensionPinnedResourceWhereInput>;
};


export type QueryInBatchNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InBatchNotificationsOrderByInput>>;
  where?: InputMaybe<InBatchNotificationsWhereInput>;
};


export type QueryInBatchNotificationsByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryInBatchNotificationsByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryInBatchNotificationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<InBatchNotificationsOrderByInput>;
  where?: InputMaybe<InBatchNotificationsWhereInput>;
};


export type QueryIpfsFetchLogByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryIpfsFetchLogByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryIpfsFetchLogsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<IpfsFetchLogOrderByInput>>;
  where?: InputMaybe<IpfsFetchLogWhereInput>;
};


export type QueryIpfsFetchLogsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<IpfsFetchLogOrderByInput>;
  where?: InputMaybe<IpfsFetchLogWhereInput>;
};


export type QueryNewsFeedByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryNewsFeedByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryNewsFeedsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NewsFeedOrderByInput>>;
  where?: InputMaybe<NewsFeedWhereInput>;
};


export type QueryNewsFeedsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<NewsFeedOrderByInput>;
  where?: InputMaybe<NewsFeedWhereInput>;
};


export type QueryNotificationByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryNotificationByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotificationOrderByInput>>;
  where?: InputMaybe<NotificationWhereInput>;
};


export type QueryNotificationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<NotificationOrderByInput>;
  where?: InputMaybe<NotificationWhereInput>;
};


export type QueryPostByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryPostByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryPostFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostFollowersOrderByInput>>;
  where?: InputMaybe<PostFollowersWhereInput>;
};


export type QueryPostFollowersByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryPostFollowersByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryPostFollowersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<PostFollowersOrderByInput>;
  where?: InputMaybe<PostFollowersWhereInput>;
};


export type QueryPostsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostOrderByInput>>;
  where?: InputMaybe<PostWhereInput>;
};


export type QueryPostsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<PostOrderByInput>;
  where?: InputMaybe<PostWhereInput>;
};


export type QueryReactionByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryReactionByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryReactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ReactionOrderByInput>>;
  where?: InputMaybe<ReactionWhereInput>;
};


export type QueryReactionsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<ReactionOrderByInput>;
  where?: InputMaybe<ReactionWhereInput>;
};


export type QuerySearchQueryArgs = {
  indexes?: Array<ElasticSearchIndexType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  spaceId?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QuerySpaceByIdArgs = {
  id: Scalars['String']['input'];
};


export type QuerySpaceByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QuerySpaceFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SpaceFollowersOrderByInput>>;
  where?: InputMaybe<SpaceFollowersWhereInput>;
};


export type QuerySpaceFollowersByIdArgs = {
  id: Scalars['String']['input'];
};


export type QuerySpaceFollowersByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QuerySpaceFollowersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<SpaceFollowersOrderByInput>;
  where?: InputMaybe<SpaceFollowersWhereInput>;
};


export type QuerySpacesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SpaceOrderByInput>>;
  where?: InputMaybe<SpaceWhereInput>;
};


export type QuerySpacesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<SpaceOrderByInput>;
  where?: InputMaybe<SpaceWhereInput>;
};


export type QueryUserRetentionCountArgs = {
  exclude_body?: InputMaybe<Array<Scalars['String']['input']>>;
  first_range_from: Scalars['String']['input'];
  first_range_min_posts_number: Scalars['Int']['input'];
  first_range_to: Scalars['String']['input'];
  full_query_range_from: Scalars['String']['input'];
  full_query_range_to: Scalars['String']['input'];
  last_range_from: Scalars['String']['input'];
  last_range_min_posts_number: Scalars['Int']['input'];
  last_range_to: Scalars['String']['input'];
  total_min_posts_number: Scalars['Int']['input'];
};

/** The Post Reaction entity */
export type Reaction = {
  __typename?: 'Reaction';
  /** A One-to-One relationship with the Account that created the Reaction. */
  account: Account;
  /** The block height when a Reaction was created. */
  createdAtBlock: Scalars['BigInt']['output'];
  /** The DateTime when a Reaction was created. */
  createdAtTime: Scalars['DateTime']['output'];
  /** The ID of a Reaction, which will have the same value and reaction ID on the blockchain. */
  id: Scalars['String']['output'];
  /** The type of Reaction (Upvote, Downvote). */
  kind: ReactionKind;
  /** A One-to-One relationship with the Post that the current reaction has been made for. */
  post: Post;
  /**
   * The status of a Reaction (Active, Deleted). This is a synthetic value.
   * It does not exist on the blockchain and is only used in the squid.
   */
  status: Status;
  /** The Block height when a Reaction was updated. */
  updatedAtBlock?: Maybe<Scalars['BigInt']['output']>;
  /** The DateTime when a Reaction was updated. */
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>;
};

export type ReactionEdge = {
  __typename?: 'ReactionEdge';
  cursor: Scalars['String']['output'];
  node: Reaction;
};

export enum ReactionKind {
  Downvote = 'Downvote',
  Upvote = 'Upvote'
}

export enum ReactionOrderByInput {
  AccountFollowersCountAsc = 'account_followersCount_ASC',
  AccountFollowersCountDesc = 'account_followersCount_DESC',
  AccountFollowingAccountsCountAsc = 'account_followingAccountsCount_ASC',
  AccountFollowingAccountsCountDesc = 'account_followingAccountsCount_DESC',
  AccountFollowingPostsCountAsc = 'account_followingPostsCount_ASC',
  AccountFollowingPostsCountDesc = 'account_followingPostsCount_DESC',
  AccountFollowingSpacesCountAsc = 'account_followingSpacesCount_ASC',
  AccountFollowingSpacesCountDesc = 'account_followingSpacesCount_DESC',
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountOwnedPostsCountAsc = 'account_ownedPostsCount_ASC',
  AccountOwnedPostsCountDesc = 'account_ownedPostsCount_DESC',
  AccountUpdatedAtBlockAsc = 'account_updatedAtBlock_ASC',
  AccountUpdatedAtBlockDesc = 'account_updatedAtBlock_DESC',
  AccountUpdatedAtTimeAsc = 'account_updatedAtTime_ASC',
  AccountUpdatedAtTimeDesc = 'account_updatedAtTime_DESC',
  CreatedAtBlockAsc = 'createdAtBlock_ASC',
  CreatedAtBlockDesc = 'createdAtBlock_DESC',
  CreatedAtTimeAsc = 'createdAtTime_ASC',
  CreatedAtTimeDesc = 'createdAtTime_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  KindAsc = 'kind_ASC',
  KindDesc = 'kind_DESC',
  PostBodyAsc = 'post_body_ASC',
  PostBodyDesc = 'post_body_DESC',
  PostCanonicalAsc = 'post_canonical_ASC',
  PostCanonicalDesc = 'post_canonical_DESC',
  PostContentAsc = 'post_content_ASC',
  PostContentDesc = 'post_content_DESC',
  PostCreatedAtBlockAsc = 'post_createdAtBlock_ASC',
  PostCreatedAtBlockDesc = 'post_createdAtBlock_DESC',
  PostCreatedAtTimeAsc = 'post_createdAtTime_ASC',
  PostCreatedAtTimeDesc = 'post_createdAtTime_DESC',
  PostCreatedOnDayAsc = 'post_createdOnDay_ASC',
  PostCreatedOnDayDesc = 'post_createdOnDay_DESC',
  PostDownvotesCountAsc = 'post_downvotesCount_ASC',
  PostDownvotesCountDesc = 'post_downvotesCount_DESC',
  PostFollowersCountAsc = 'post_followersCount_ASC',
  PostFollowersCountDesc = 'post_followersCount_DESC',
  PostFormatAsc = 'post_format_ASC',
  PostFormatDesc = 'post_format_DESC',
  PostHiddenRepliesCountAsc = 'post_hiddenRepliesCount_ASC',
  PostHiddenRepliesCountDesc = 'post_hiddenRepliesCount_DESC',
  PostHiddenAsc = 'post_hidden_ASC',
  PostHiddenDesc = 'post_hidden_DESC',
  PostIdAsc = 'post_id_ASC',
  PostIdDesc = 'post_id_DESC',
  PostImageAsc = 'post_image_ASC',
  PostImageDesc = 'post_image_DESC',
  PostInReplyToKindAsc = 'post_inReplyToKind_ASC',
  PostInReplyToKindDesc = 'post_inReplyToKind_DESC',
  PostIsCommentAsc = 'post_isComment_ASC',
  PostIsCommentDesc = 'post_isComment_DESC',
  PostIsShowMoreAsc = 'post_isShowMore_ASC',
  PostIsShowMoreDesc = 'post_isShowMore_DESC',
  PostKindAsc = 'post_kind_ASC',
  PostKindDesc = 'post_kind_DESC',
  PostLinkAsc = 'post_link_ASC',
  PostLinkDesc = 'post_link_DESC',
  PostMetaAsc = 'post_meta_ASC',
  PostMetaDesc = 'post_meta_DESC',
  PostProposalIndexAsc = 'post_proposalIndex_ASC',
  PostProposalIndexDesc = 'post_proposalIndex_DESC',
  PostPublicRepliesCountAsc = 'post_publicRepliesCount_ASC',
  PostPublicRepliesCountDesc = 'post_publicRepliesCount_DESC',
  PostReactionsCountAsc = 'post_reactionsCount_ASC',
  PostReactionsCountDesc = 'post_reactionsCount_DESC',
  PostRepliesCountAsc = 'post_repliesCount_ASC',
  PostRepliesCountDesc = 'post_repliesCount_DESC',
  PostSharesCountAsc = 'post_sharesCount_ASC',
  PostSharesCountDesc = 'post_sharesCount_DESC',
  PostSlugAsc = 'post_slug_ASC',
  PostSlugDesc = 'post_slug_DESC',
  PostSummaryAsc = 'post_summary_ASC',
  PostSummaryDesc = 'post_summary_DESC',
  PostTagsOriginalAsc = 'post_tagsOriginal_ASC',
  PostTagsOriginalDesc = 'post_tagsOriginal_DESC',
  PostTitleAsc = 'post_title_ASC',
  PostTitleDesc = 'post_title_DESC',
  PostTweetIdAsc = 'post_tweetId_ASC',
  PostTweetIdDesc = 'post_tweetId_DESC',
  PostUpdatedAtTimeAsc = 'post_updatedAtTime_ASC',
  PostUpdatedAtTimeDesc = 'post_updatedAtTime_DESC',
  PostUpvotesCountAsc = 'post_upvotesCount_ASC',
  PostUpvotesCountDesc = 'post_upvotesCount_DESC',
  StatusAsc = 'status_ASC',
  StatusDesc = 'status_DESC',
  UpdatedAtBlockAsc = 'updatedAtBlock_ASC',
  UpdatedAtBlockDesc = 'updatedAtBlock_DESC',
  UpdatedAtTimeAsc = 'updatedAtTime_ASC',
  UpdatedAtTimeDesc = 'updatedAtTime_DESC'
}

export type ReactionWhereInput = {
  AND?: InputMaybe<Array<ReactionWhereInput>>;
  OR?: InputMaybe<Array<ReactionWhereInput>>;
  account?: InputMaybe<AccountWhereInput>;
  account_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtBlock_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtBlock_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtTime_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_gt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_gte?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  createdAtTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtTime_lt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_lte?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  kind_eq?: InputMaybe<ReactionKind>;
  kind_in?: InputMaybe<Array<ReactionKind>>;
  kind_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  kind_not_eq?: InputMaybe<ReactionKind>;
  kind_not_in?: InputMaybe<Array<ReactionKind>>;
  post?: InputMaybe<PostWhereInput>;
  post_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  status_eq?: InputMaybe<Status>;
  status_in?: InputMaybe<Array<Status>>;
  status_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  status_not_eq?: InputMaybe<Status>;
  status_not_in?: InputMaybe<Array<Status>>;
  updatedAtBlock_eq?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAtBlock_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAtBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAtTime_eq?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_gt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_gte?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  updatedAtTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAtTime_lt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_lte?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type ReactionsConnection = {
  __typename?: 'ReactionsConnection';
  edges: Array<ReactionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ReferencedTweetDetails = {
  __typename?: 'ReferencedTweetDetails';
  id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type SearchTotals = {
  __typename?: 'SearchTotals';
  /** Number of search hits per page, which has been used for this particular request. */
  limit: Scalars['Int']['output'];
  /** Maximum score within results scope of this particular search request. */
  maxScore: Scalars['Float']['output'];
  /** Page offset, which has been used for this particular request. */
  offset: Scalars['Int']['output'];
  /** Total number of hits matched to this particular request */
  totalResults: Scalars['Int']['output'];
};

/** The Space entity */
export type Space = {
  __typename?: 'Space';
  /** The about text (bio) of a Space (IPFS content) */
  about?: Maybe<Scalars['String']['output']>;
  /** Is this a public space where anyone can post? */
  canEveryoneCreatePosts?: Maybe<Scalars['Boolean']['output']>;
  /** Are followers allowed to post in the Space? */
  canFollowerCreatePosts?: Maybe<Scalars['Boolean']['output']>;
  /** The CID of the content on IPFS */
  content?: Maybe<Scalars['String']['output']>;
  /** The block height when a Space was created. */
  createdAtBlock?: Maybe<Scalars['BigInt']['output']>;
  /** The DateTime when a Space was created. */
  createdAtTime?: Maybe<Scalars['DateTime']['output']>;
  /** A One-To-One relationship with the Account entity that created a Space. */
  createdByAccount: Account;
  /** The day when a Space was created. */
  createdOnDay?: Maybe<Scalars['DateTime']['output']>;
  /** The email address of a Space (IPFS content) */
  email?: Maybe<Scalars['String']['output']>;
  /** Space permissions rule */
  everyonePermissions?: Maybe<SpacePermissions>;
  /** The properties of a Space from its IPFS content which are not supported by the current squid's DB schema. */
  experimental?: Maybe<Scalars['JSON']['output']>;
  /** Space permissions rule */
  followerPermissions?: Maybe<SpacePermissions>;
  /** A Many-To-Many relationship between a Space and the Accounts that follow it through SpaceFollowers (foreign key - "followingSpace") */
  followers: Array<SpaceFollowers>;
  /** The total number of Accounts following a Space */
  followersCount: Scalars['Int']['output'];
  /** Space format (IPFS content) */
  format?: Maybe<Scalars['String']['output']>;
  /** The username of a Space (will be removed in further versions as it is deprecated. You should use the username field instead.) (IPFS content) */
  handle?: Maybe<Scalars['String']['output']>;
  /** Is the Space hidden? */
  hidden: Scalars['Boolean']['output'];
  /** The total number of hidden Posts in the current Space (post.length) */
  hiddenPostsCount: Scalars['Int']['output'];
  /** The ID of a Space, which will have the same value and Space ID on the blockchain. */
  id: Scalars['String']['output'];
  /** The URL of the Space's image (IPFS content) */
  image?: Maybe<Scalars['String']['output']>;
  /** A list of a Space's interests converted to a string with "comma" as a separator (IPFS content) */
  interestsOriginal?: Maybe<Scalars['String']['output']>;
  /** Is the Space's "About" section longer than its summary? */
  isShowMore?: Maybe<Scalars['Boolean']['output']>;
  /** A list of the Space's links converted to a string with "comma" as a separator (IPFS content) */
  linksOriginal?: Maybe<Scalars['String']['output']>;
  /** The name of a Space (IPFS content) */
  name?: Maybe<Scalars['String']['output']>;
  /** Space permissions rule */
  nonePermissions?: Maybe<SpacePermissions>;
  /** A One-To-One relationship with the Account entity that owns a Space. */
  ownedByAccount: Account;
  pinnedByExtensions: Array<ExtensionPinnedResource>;
  /** A One-To-Many relationship with the Posts created within the current Space (foreign key - "space") */
  posts: Array<Post>;
  /** The total number of all Posts (public and hidden) in the current Space (post.length) */
  postsCount: Scalars['Int']['output'];
  /** A One-To-One relationship with the Account which uses the current Space as its profile. */
  profileSpace?: Maybe<Account>;
  /** The total number of public (non-hidden) Posts in the current Space (post.length) */
  publicPostsCount: Scalars['Int']['output'];
  /** Space permissions rule */
  spaceOwnerPermissions?: Maybe<SpacePermissions>;
  /** The summary of the content of a Space (IPFS content) */
  summary?: Maybe<Scalars['String']['output']>;
  /** A list of a Space's tags, converted to a string with "comma" as a separator (IPFS content) */
  tagsOriginal?: Maybe<Scalars['String']['output']>;
  /** The block height when a Space was updated. */
  updatedAtBlock?: Maybe<Scalars['BigInt']['output']>;
  /** The DateTime when a Space was updated. */
  updatedAtTime?: Maybe<Scalars['DateTime']['output']>;
  /** The username of a Space (IPFS content) */
  username?: Maybe<Scalars['String']['output']>;
};


/** The Space entity */
export type SpaceFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SpaceFollowersOrderByInput>>;
  where?: InputMaybe<SpaceFollowersWhereInput>;
};


/** The Space entity */
export type SpacePinnedByExtensionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ExtensionPinnedResourceOrderByInput>>;
  where?: InputMaybe<ExtensionPinnedResourceWhereInput>;
};


/** The Space entity */
export type SpacePostsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostOrderByInput>>;
  where?: InputMaybe<PostWhereInput>;
};

export type SpaceEdge = {
  __typename?: 'SpaceEdge';
  cursor: Scalars['String']['output'];
  node: Space;
};

/** The junction table for Many-to-Many relationship between follower Account and following Space */
export type SpaceFollowers = {
  __typename?: 'SpaceFollowers';
  followerAccount: Account;
  followingSpace: Space;
  id: Scalars['String']['output'];
};

export type SpaceFollowersConnection = {
  __typename?: 'SpaceFollowersConnection';
  edges: Array<SpaceFollowersEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SpaceFollowersEdge = {
  __typename?: 'SpaceFollowersEdge';
  cursor: Scalars['String']['output'];
  node: SpaceFollowers;
};

export enum SpaceFollowersOrderByInput {
  FollowerAccountFollowersCountAsc = 'followerAccount_followersCount_ASC',
  FollowerAccountFollowersCountDesc = 'followerAccount_followersCount_DESC',
  FollowerAccountFollowingAccountsCountAsc = 'followerAccount_followingAccountsCount_ASC',
  FollowerAccountFollowingAccountsCountDesc = 'followerAccount_followingAccountsCount_DESC',
  FollowerAccountFollowingPostsCountAsc = 'followerAccount_followingPostsCount_ASC',
  FollowerAccountFollowingPostsCountDesc = 'followerAccount_followingPostsCount_DESC',
  FollowerAccountFollowingSpacesCountAsc = 'followerAccount_followingSpacesCount_ASC',
  FollowerAccountFollowingSpacesCountDesc = 'followerAccount_followingSpacesCount_DESC',
  FollowerAccountIdAsc = 'followerAccount_id_ASC',
  FollowerAccountIdDesc = 'followerAccount_id_DESC',
  FollowerAccountOwnedPostsCountAsc = 'followerAccount_ownedPostsCount_ASC',
  FollowerAccountOwnedPostsCountDesc = 'followerAccount_ownedPostsCount_DESC',
  FollowerAccountUpdatedAtBlockAsc = 'followerAccount_updatedAtBlock_ASC',
  FollowerAccountUpdatedAtBlockDesc = 'followerAccount_updatedAtBlock_DESC',
  FollowerAccountUpdatedAtTimeAsc = 'followerAccount_updatedAtTime_ASC',
  FollowerAccountUpdatedAtTimeDesc = 'followerAccount_updatedAtTime_DESC',
  FollowingSpaceAboutAsc = 'followingSpace_about_ASC',
  FollowingSpaceAboutDesc = 'followingSpace_about_DESC',
  FollowingSpaceCanEveryoneCreatePostsAsc = 'followingSpace_canEveryoneCreatePosts_ASC',
  FollowingSpaceCanEveryoneCreatePostsDesc = 'followingSpace_canEveryoneCreatePosts_DESC',
  FollowingSpaceCanFollowerCreatePostsAsc = 'followingSpace_canFollowerCreatePosts_ASC',
  FollowingSpaceCanFollowerCreatePostsDesc = 'followingSpace_canFollowerCreatePosts_DESC',
  FollowingSpaceContentAsc = 'followingSpace_content_ASC',
  FollowingSpaceContentDesc = 'followingSpace_content_DESC',
  FollowingSpaceCreatedAtBlockAsc = 'followingSpace_createdAtBlock_ASC',
  FollowingSpaceCreatedAtBlockDesc = 'followingSpace_createdAtBlock_DESC',
  FollowingSpaceCreatedAtTimeAsc = 'followingSpace_createdAtTime_ASC',
  FollowingSpaceCreatedAtTimeDesc = 'followingSpace_createdAtTime_DESC',
  FollowingSpaceCreatedOnDayAsc = 'followingSpace_createdOnDay_ASC',
  FollowingSpaceCreatedOnDayDesc = 'followingSpace_createdOnDay_DESC',
  FollowingSpaceEmailAsc = 'followingSpace_email_ASC',
  FollowingSpaceEmailDesc = 'followingSpace_email_DESC',
  FollowingSpaceFollowersCountAsc = 'followingSpace_followersCount_ASC',
  FollowingSpaceFollowersCountDesc = 'followingSpace_followersCount_DESC',
  FollowingSpaceFormatAsc = 'followingSpace_format_ASC',
  FollowingSpaceFormatDesc = 'followingSpace_format_DESC',
  FollowingSpaceHandleAsc = 'followingSpace_handle_ASC',
  FollowingSpaceHandleDesc = 'followingSpace_handle_DESC',
  FollowingSpaceHiddenPostsCountAsc = 'followingSpace_hiddenPostsCount_ASC',
  FollowingSpaceHiddenPostsCountDesc = 'followingSpace_hiddenPostsCount_DESC',
  FollowingSpaceHiddenAsc = 'followingSpace_hidden_ASC',
  FollowingSpaceHiddenDesc = 'followingSpace_hidden_DESC',
  FollowingSpaceIdAsc = 'followingSpace_id_ASC',
  FollowingSpaceIdDesc = 'followingSpace_id_DESC',
  FollowingSpaceImageAsc = 'followingSpace_image_ASC',
  FollowingSpaceImageDesc = 'followingSpace_image_DESC',
  FollowingSpaceInterestsOriginalAsc = 'followingSpace_interestsOriginal_ASC',
  FollowingSpaceInterestsOriginalDesc = 'followingSpace_interestsOriginal_DESC',
  FollowingSpaceIsShowMoreAsc = 'followingSpace_isShowMore_ASC',
  FollowingSpaceIsShowMoreDesc = 'followingSpace_isShowMore_DESC',
  FollowingSpaceLinksOriginalAsc = 'followingSpace_linksOriginal_ASC',
  FollowingSpaceLinksOriginalDesc = 'followingSpace_linksOriginal_DESC',
  FollowingSpaceNameAsc = 'followingSpace_name_ASC',
  FollowingSpaceNameDesc = 'followingSpace_name_DESC',
  FollowingSpacePostsCountAsc = 'followingSpace_postsCount_ASC',
  FollowingSpacePostsCountDesc = 'followingSpace_postsCount_DESC',
  FollowingSpacePublicPostsCountAsc = 'followingSpace_publicPostsCount_ASC',
  FollowingSpacePublicPostsCountDesc = 'followingSpace_publicPostsCount_DESC',
  FollowingSpaceSummaryAsc = 'followingSpace_summary_ASC',
  FollowingSpaceSummaryDesc = 'followingSpace_summary_DESC',
  FollowingSpaceTagsOriginalAsc = 'followingSpace_tagsOriginal_ASC',
  FollowingSpaceTagsOriginalDesc = 'followingSpace_tagsOriginal_DESC',
  FollowingSpaceUpdatedAtBlockAsc = 'followingSpace_updatedAtBlock_ASC',
  FollowingSpaceUpdatedAtBlockDesc = 'followingSpace_updatedAtBlock_DESC',
  FollowingSpaceUpdatedAtTimeAsc = 'followingSpace_updatedAtTime_ASC',
  FollowingSpaceUpdatedAtTimeDesc = 'followingSpace_updatedAtTime_DESC',
  FollowingSpaceUsernameAsc = 'followingSpace_username_ASC',
  FollowingSpaceUsernameDesc = 'followingSpace_username_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type SpaceFollowersWhereInput = {
  AND?: InputMaybe<Array<SpaceFollowersWhereInput>>;
  OR?: InputMaybe<Array<SpaceFollowersWhereInput>>;
  followerAccount?: InputMaybe<AccountWhereInput>;
  followerAccount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  followingSpace?: InputMaybe<SpaceWhereInput>;
  followingSpace_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum SpaceOrderByInput {
  AboutAsc = 'about_ASC',
  AboutDesc = 'about_DESC',
  CanEveryoneCreatePostsAsc = 'canEveryoneCreatePosts_ASC',
  CanEveryoneCreatePostsDesc = 'canEveryoneCreatePosts_DESC',
  CanFollowerCreatePostsAsc = 'canFollowerCreatePosts_ASC',
  CanFollowerCreatePostsDesc = 'canFollowerCreatePosts_DESC',
  ContentAsc = 'content_ASC',
  ContentDesc = 'content_DESC',
  CreatedAtBlockAsc = 'createdAtBlock_ASC',
  CreatedAtBlockDesc = 'createdAtBlock_DESC',
  CreatedAtTimeAsc = 'createdAtTime_ASC',
  CreatedAtTimeDesc = 'createdAtTime_DESC',
  CreatedByAccountFollowersCountAsc = 'createdByAccount_followersCount_ASC',
  CreatedByAccountFollowersCountDesc = 'createdByAccount_followersCount_DESC',
  CreatedByAccountFollowingAccountsCountAsc = 'createdByAccount_followingAccountsCount_ASC',
  CreatedByAccountFollowingAccountsCountDesc = 'createdByAccount_followingAccountsCount_DESC',
  CreatedByAccountFollowingPostsCountAsc = 'createdByAccount_followingPostsCount_ASC',
  CreatedByAccountFollowingPostsCountDesc = 'createdByAccount_followingPostsCount_DESC',
  CreatedByAccountFollowingSpacesCountAsc = 'createdByAccount_followingSpacesCount_ASC',
  CreatedByAccountFollowingSpacesCountDesc = 'createdByAccount_followingSpacesCount_DESC',
  CreatedByAccountIdAsc = 'createdByAccount_id_ASC',
  CreatedByAccountIdDesc = 'createdByAccount_id_DESC',
  CreatedByAccountOwnedPostsCountAsc = 'createdByAccount_ownedPostsCount_ASC',
  CreatedByAccountOwnedPostsCountDesc = 'createdByAccount_ownedPostsCount_DESC',
  CreatedByAccountUpdatedAtBlockAsc = 'createdByAccount_updatedAtBlock_ASC',
  CreatedByAccountUpdatedAtBlockDesc = 'createdByAccount_updatedAtBlock_DESC',
  CreatedByAccountUpdatedAtTimeAsc = 'createdByAccount_updatedAtTime_ASC',
  CreatedByAccountUpdatedAtTimeDesc = 'createdByAccount_updatedAtTime_DESC',
  CreatedOnDayAsc = 'createdOnDay_ASC',
  CreatedOnDayDesc = 'createdOnDay_DESC',
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  EveryonePermissionsCreateCommentsAsc = 'everyonePermissions_createComments_ASC',
  EveryonePermissionsCreateCommentsDesc = 'everyonePermissions_createComments_DESC',
  EveryonePermissionsCreatePostsAsc = 'everyonePermissions_createPosts_ASC',
  EveryonePermissionsCreatePostsDesc = 'everyonePermissions_createPosts_DESC',
  EveryonePermissionsCreateSubspacesAsc = 'everyonePermissions_createSubspaces_ASC',
  EveryonePermissionsCreateSubspacesDesc = 'everyonePermissions_createSubspaces_DESC',
  EveryonePermissionsDeleteAnyPostAsc = 'everyonePermissions_deleteAnyPost_ASC',
  EveryonePermissionsDeleteAnyPostDesc = 'everyonePermissions_deleteAnyPost_DESC',
  EveryonePermissionsDeleteAnySubspaceAsc = 'everyonePermissions_deleteAnySubspace_ASC',
  EveryonePermissionsDeleteAnySubspaceDesc = 'everyonePermissions_deleteAnySubspace_DESC',
  EveryonePermissionsDeleteOwnCommentsAsc = 'everyonePermissions_deleteOwnComments_ASC',
  EveryonePermissionsDeleteOwnCommentsDesc = 'everyonePermissions_deleteOwnComments_DESC',
  EveryonePermissionsDeleteOwnPostsAsc = 'everyonePermissions_deleteOwnPosts_ASC',
  EveryonePermissionsDeleteOwnPostsDesc = 'everyonePermissions_deleteOwnPosts_DESC',
  EveryonePermissionsDeleteOwnSubspacesAsc = 'everyonePermissions_deleteOwnSubspaces_ASC',
  EveryonePermissionsDeleteOwnSubspacesDesc = 'everyonePermissions_deleteOwnSubspaces_DESC',
  EveryonePermissionsDownvoteAsc = 'everyonePermissions_downvote_ASC',
  EveryonePermissionsDownvoteDesc = 'everyonePermissions_downvote_DESC',
  EveryonePermissionsHideAnyCommentAsc = 'everyonePermissions_hideAnyComment_ASC',
  EveryonePermissionsHideAnyCommentDesc = 'everyonePermissions_hideAnyComment_DESC',
  EveryonePermissionsHideAnyPostAsc = 'everyonePermissions_hideAnyPost_ASC',
  EveryonePermissionsHideAnyPostDesc = 'everyonePermissions_hideAnyPost_DESC',
  EveryonePermissionsHideAnySubspaceAsc = 'everyonePermissions_hideAnySubspace_ASC',
  EveryonePermissionsHideAnySubspaceDesc = 'everyonePermissions_hideAnySubspace_DESC',
  EveryonePermissionsHideOwnCommentsAsc = 'everyonePermissions_hideOwnComments_ASC',
  EveryonePermissionsHideOwnCommentsDesc = 'everyonePermissions_hideOwnComments_DESC',
  EveryonePermissionsHideOwnPostsAsc = 'everyonePermissions_hideOwnPosts_ASC',
  EveryonePermissionsHideOwnPostsDesc = 'everyonePermissions_hideOwnPosts_DESC',
  EveryonePermissionsHideOwnSubspacesAsc = 'everyonePermissions_hideOwnSubspaces_ASC',
  EveryonePermissionsHideOwnSubspacesDesc = 'everyonePermissions_hideOwnSubspaces_DESC',
  EveryonePermissionsManageRolesAsc = 'everyonePermissions_manageRoles_ASC',
  EveryonePermissionsManageRolesDesc = 'everyonePermissions_manageRoles_DESC',
  EveryonePermissionsOverridePostPermissionsAsc = 'everyonePermissions_overridePostPermissions_ASC',
  EveryonePermissionsOverridePostPermissionsDesc = 'everyonePermissions_overridePostPermissions_DESC',
  EveryonePermissionsOverrideSubspacePermissionsAsc = 'everyonePermissions_overrideSubspacePermissions_ASC',
  EveryonePermissionsOverrideSubspacePermissionsDesc = 'everyonePermissions_overrideSubspacePermissions_DESC',
  EveryonePermissionsRepresentSpaceExternallyAsc = 'everyonePermissions_representSpaceExternally_ASC',
  EveryonePermissionsRepresentSpaceExternallyDesc = 'everyonePermissions_representSpaceExternally_DESC',
  EveryonePermissionsRepresentSpaceInternallyAsc = 'everyonePermissions_representSpaceInternally_ASC',
  EveryonePermissionsRepresentSpaceInternallyDesc = 'everyonePermissions_representSpaceInternally_DESC',
  EveryonePermissionsShareAsc = 'everyonePermissions_share_ASC',
  EveryonePermissionsShareDesc = 'everyonePermissions_share_DESC',
  EveryonePermissionsSuggestEntityStatusAsc = 'everyonePermissions_suggestEntityStatus_ASC',
  EveryonePermissionsSuggestEntityStatusDesc = 'everyonePermissions_suggestEntityStatus_DESC',
  EveryonePermissionsUpdateAnyPostAsc = 'everyonePermissions_updateAnyPost_ASC',
  EveryonePermissionsUpdateAnyPostDesc = 'everyonePermissions_updateAnyPost_DESC',
  EveryonePermissionsUpdateAnySubspaceAsc = 'everyonePermissions_updateAnySubspace_ASC',
  EveryonePermissionsUpdateAnySubspaceDesc = 'everyonePermissions_updateAnySubspace_DESC',
  EveryonePermissionsUpdateEntityStatusAsc = 'everyonePermissions_updateEntityStatus_ASC',
  EveryonePermissionsUpdateEntityStatusDesc = 'everyonePermissions_updateEntityStatus_DESC',
  EveryonePermissionsUpdateOwnCommentsAsc = 'everyonePermissions_updateOwnComments_ASC',
  EveryonePermissionsUpdateOwnCommentsDesc = 'everyonePermissions_updateOwnComments_DESC',
  EveryonePermissionsUpdateOwnPostsAsc = 'everyonePermissions_updateOwnPosts_ASC',
  EveryonePermissionsUpdateOwnPostsDesc = 'everyonePermissions_updateOwnPosts_DESC',
  EveryonePermissionsUpdateOwnSubspacesAsc = 'everyonePermissions_updateOwnSubspaces_ASC',
  EveryonePermissionsUpdateOwnSubspacesDesc = 'everyonePermissions_updateOwnSubspaces_DESC',
  EveryonePermissionsUpdateSpaceSettingsAsc = 'everyonePermissions_updateSpaceSettings_ASC',
  EveryonePermissionsUpdateSpaceSettingsDesc = 'everyonePermissions_updateSpaceSettings_DESC',
  EveryonePermissionsUpdateSpaceAsc = 'everyonePermissions_updateSpace_ASC',
  EveryonePermissionsUpdateSpaceDesc = 'everyonePermissions_updateSpace_DESC',
  EveryonePermissionsUpvoteAsc = 'everyonePermissions_upvote_ASC',
  EveryonePermissionsUpvoteDesc = 'everyonePermissions_upvote_DESC',
  FollowerPermissionsCreateCommentsAsc = 'followerPermissions_createComments_ASC',
  FollowerPermissionsCreateCommentsDesc = 'followerPermissions_createComments_DESC',
  FollowerPermissionsCreatePostsAsc = 'followerPermissions_createPosts_ASC',
  FollowerPermissionsCreatePostsDesc = 'followerPermissions_createPosts_DESC',
  FollowerPermissionsCreateSubspacesAsc = 'followerPermissions_createSubspaces_ASC',
  FollowerPermissionsCreateSubspacesDesc = 'followerPermissions_createSubspaces_DESC',
  FollowerPermissionsDeleteAnyPostAsc = 'followerPermissions_deleteAnyPost_ASC',
  FollowerPermissionsDeleteAnyPostDesc = 'followerPermissions_deleteAnyPost_DESC',
  FollowerPermissionsDeleteAnySubspaceAsc = 'followerPermissions_deleteAnySubspace_ASC',
  FollowerPermissionsDeleteAnySubspaceDesc = 'followerPermissions_deleteAnySubspace_DESC',
  FollowerPermissionsDeleteOwnCommentsAsc = 'followerPermissions_deleteOwnComments_ASC',
  FollowerPermissionsDeleteOwnCommentsDesc = 'followerPermissions_deleteOwnComments_DESC',
  FollowerPermissionsDeleteOwnPostsAsc = 'followerPermissions_deleteOwnPosts_ASC',
  FollowerPermissionsDeleteOwnPostsDesc = 'followerPermissions_deleteOwnPosts_DESC',
  FollowerPermissionsDeleteOwnSubspacesAsc = 'followerPermissions_deleteOwnSubspaces_ASC',
  FollowerPermissionsDeleteOwnSubspacesDesc = 'followerPermissions_deleteOwnSubspaces_DESC',
  FollowerPermissionsDownvoteAsc = 'followerPermissions_downvote_ASC',
  FollowerPermissionsDownvoteDesc = 'followerPermissions_downvote_DESC',
  FollowerPermissionsHideAnyCommentAsc = 'followerPermissions_hideAnyComment_ASC',
  FollowerPermissionsHideAnyCommentDesc = 'followerPermissions_hideAnyComment_DESC',
  FollowerPermissionsHideAnyPostAsc = 'followerPermissions_hideAnyPost_ASC',
  FollowerPermissionsHideAnyPostDesc = 'followerPermissions_hideAnyPost_DESC',
  FollowerPermissionsHideAnySubspaceAsc = 'followerPermissions_hideAnySubspace_ASC',
  FollowerPermissionsHideAnySubspaceDesc = 'followerPermissions_hideAnySubspace_DESC',
  FollowerPermissionsHideOwnCommentsAsc = 'followerPermissions_hideOwnComments_ASC',
  FollowerPermissionsHideOwnCommentsDesc = 'followerPermissions_hideOwnComments_DESC',
  FollowerPermissionsHideOwnPostsAsc = 'followerPermissions_hideOwnPosts_ASC',
  FollowerPermissionsHideOwnPostsDesc = 'followerPermissions_hideOwnPosts_DESC',
  FollowerPermissionsHideOwnSubspacesAsc = 'followerPermissions_hideOwnSubspaces_ASC',
  FollowerPermissionsHideOwnSubspacesDesc = 'followerPermissions_hideOwnSubspaces_DESC',
  FollowerPermissionsManageRolesAsc = 'followerPermissions_manageRoles_ASC',
  FollowerPermissionsManageRolesDesc = 'followerPermissions_manageRoles_DESC',
  FollowerPermissionsOverridePostPermissionsAsc = 'followerPermissions_overridePostPermissions_ASC',
  FollowerPermissionsOverridePostPermissionsDesc = 'followerPermissions_overridePostPermissions_DESC',
  FollowerPermissionsOverrideSubspacePermissionsAsc = 'followerPermissions_overrideSubspacePermissions_ASC',
  FollowerPermissionsOverrideSubspacePermissionsDesc = 'followerPermissions_overrideSubspacePermissions_DESC',
  FollowerPermissionsRepresentSpaceExternallyAsc = 'followerPermissions_representSpaceExternally_ASC',
  FollowerPermissionsRepresentSpaceExternallyDesc = 'followerPermissions_representSpaceExternally_DESC',
  FollowerPermissionsRepresentSpaceInternallyAsc = 'followerPermissions_representSpaceInternally_ASC',
  FollowerPermissionsRepresentSpaceInternallyDesc = 'followerPermissions_representSpaceInternally_DESC',
  FollowerPermissionsShareAsc = 'followerPermissions_share_ASC',
  FollowerPermissionsShareDesc = 'followerPermissions_share_DESC',
  FollowerPermissionsSuggestEntityStatusAsc = 'followerPermissions_suggestEntityStatus_ASC',
  FollowerPermissionsSuggestEntityStatusDesc = 'followerPermissions_suggestEntityStatus_DESC',
  FollowerPermissionsUpdateAnyPostAsc = 'followerPermissions_updateAnyPost_ASC',
  FollowerPermissionsUpdateAnyPostDesc = 'followerPermissions_updateAnyPost_DESC',
  FollowerPermissionsUpdateAnySubspaceAsc = 'followerPermissions_updateAnySubspace_ASC',
  FollowerPermissionsUpdateAnySubspaceDesc = 'followerPermissions_updateAnySubspace_DESC',
  FollowerPermissionsUpdateEntityStatusAsc = 'followerPermissions_updateEntityStatus_ASC',
  FollowerPermissionsUpdateEntityStatusDesc = 'followerPermissions_updateEntityStatus_DESC',
  FollowerPermissionsUpdateOwnCommentsAsc = 'followerPermissions_updateOwnComments_ASC',
  FollowerPermissionsUpdateOwnCommentsDesc = 'followerPermissions_updateOwnComments_DESC',
  FollowerPermissionsUpdateOwnPostsAsc = 'followerPermissions_updateOwnPosts_ASC',
  FollowerPermissionsUpdateOwnPostsDesc = 'followerPermissions_updateOwnPosts_DESC',
  FollowerPermissionsUpdateOwnSubspacesAsc = 'followerPermissions_updateOwnSubspaces_ASC',
  FollowerPermissionsUpdateOwnSubspacesDesc = 'followerPermissions_updateOwnSubspaces_DESC',
  FollowerPermissionsUpdateSpaceSettingsAsc = 'followerPermissions_updateSpaceSettings_ASC',
  FollowerPermissionsUpdateSpaceSettingsDesc = 'followerPermissions_updateSpaceSettings_DESC',
  FollowerPermissionsUpdateSpaceAsc = 'followerPermissions_updateSpace_ASC',
  FollowerPermissionsUpdateSpaceDesc = 'followerPermissions_updateSpace_DESC',
  FollowerPermissionsUpvoteAsc = 'followerPermissions_upvote_ASC',
  FollowerPermissionsUpvoteDesc = 'followerPermissions_upvote_DESC',
  FollowersCountAsc = 'followersCount_ASC',
  FollowersCountDesc = 'followersCount_DESC',
  FormatAsc = 'format_ASC',
  FormatDesc = 'format_DESC',
  HandleAsc = 'handle_ASC',
  HandleDesc = 'handle_DESC',
  HiddenPostsCountAsc = 'hiddenPostsCount_ASC',
  HiddenPostsCountDesc = 'hiddenPostsCount_DESC',
  HiddenAsc = 'hidden_ASC',
  HiddenDesc = 'hidden_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  InterestsOriginalAsc = 'interestsOriginal_ASC',
  InterestsOriginalDesc = 'interestsOriginal_DESC',
  IsShowMoreAsc = 'isShowMore_ASC',
  IsShowMoreDesc = 'isShowMore_DESC',
  LinksOriginalAsc = 'linksOriginal_ASC',
  LinksOriginalDesc = 'linksOriginal_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  NonePermissionsCreateCommentsAsc = 'nonePermissions_createComments_ASC',
  NonePermissionsCreateCommentsDesc = 'nonePermissions_createComments_DESC',
  NonePermissionsCreatePostsAsc = 'nonePermissions_createPosts_ASC',
  NonePermissionsCreatePostsDesc = 'nonePermissions_createPosts_DESC',
  NonePermissionsCreateSubspacesAsc = 'nonePermissions_createSubspaces_ASC',
  NonePermissionsCreateSubspacesDesc = 'nonePermissions_createSubspaces_DESC',
  NonePermissionsDeleteAnyPostAsc = 'nonePermissions_deleteAnyPost_ASC',
  NonePermissionsDeleteAnyPostDesc = 'nonePermissions_deleteAnyPost_DESC',
  NonePermissionsDeleteAnySubspaceAsc = 'nonePermissions_deleteAnySubspace_ASC',
  NonePermissionsDeleteAnySubspaceDesc = 'nonePermissions_deleteAnySubspace_DESC',
  NonePermissionsDeleteOwnCommentsAsc = 'nonePermissions_deleteOwnComments_ASC',
  NonePermissionsDeleteOwnCommentsDesc = 'nonePermissions_deleteOwnComments_DESC',
  NonePermissionsDeleteOwnPostsAsc = 'nonePermissions_deleteOwnPosts_ASC',
  NonePermissionsDeleteOwnPostsDesc = 'nonePermissions_deleteOwnPosts_DESC',
  NonePermissionsDeleteOwnSubspacesAsc = 'nonePermissions_deleteOwnSubspaces_ASC',
  NonePermissionsDeleteOwnSubspacesDesc = 'nonePermissions_deleteOwnSubspaces_DESC',
  NonePermissionsDownvoteAsc = 'nonePermissions_downvote_ASC',
  NonePermissionsDownvoteDesc = 'nonePermissions_downvote_DESC',
  NonePermissionsHideAnyCommentAsc = 'nonePermissions_hideAnyComment_ASC',
  NonePermissionsHideAnyCommentDesc = 'nonePermissions_hideAnyComment_DESC',
  NonePermissionsHideAnyPostAsc = 'nonePermissions_hideAnyPost_ASC',
  NonePermissionsHideAnyPostDesc = 'nonePermissions_hideAnyPost_DESC',
  NonePermissionsHideAnySubspaceAsc = 'nonePermissions_hideAnySubspace_ASC',
  NonePermissionsHideAnySubspaceDesc = 'nonePermissions_hideAnySubspace_DESC',
  NonePermissionsHideOwnCommentsAsc = 'nonePermissions_hideOwnComments_ASC',
  NonePermissionsHideOwnCommentsDesc = 'nonePermissions_hideOwnComments_DESC',
  NonePermissionsHideOwnPostsAsc = 'nonePermissions_hideOwnPosts_ASC',
  NonePermissionsHideOwnPostsDesc = 'nonePermissions_hideOwnPosts_DESC',
  NonePermissionsHideOwnSubspacesAsc = 'nonePermissions_hideOwnSubspaces_ASC',
  NonePermissionsHideOwnSubspacesDesc = 'nonePermissions_hideOwnSubspaces_DESC',
  NonePermissionsManageRolesAsc = 'nonePermissions_manageRoles_ASC',
  NonePermissionsManageRolesDesc = 'nonePermissions_manageRoles_DESC',
  NonePermissionsOverridePostPermissionsAsc = 'nonePermissions_overridePostPermissions_ASC',
  NonePermissionsOverridePostPermissionsDesc = 'nonePermissions_overridePostPermissions_DESC',
  NonePermissionsOverrideSubspacePermissionsAsc = 'nonePermissions_overrideSubspacePermissions_ASC',
  NonePermissionsOverrideSubspacePermissionsDesc = 'nonePermissions_overrideSubspacePermissions_DESC',
  NonePermissionsRepresentSpaceExternallyAsc = 'nonePermissions_representSpaceExternally_ASC',
  NonePermissionsRepresentSpaceExternallyDesc = 'nonePermissions_representSpaceExternally_DESC',
  NonePermissionsRepresentSpaceInternallyAsc = 'nonePermissions_representSpaceInternally_ASC',
  NonePermissionsRepresentSpaceInternallyDesc = 'nonePermissions_representSpaceInternally_DESC',
  NonePermissionsShareAsc = 'nonePermissions_share_ASC',
  NonePermissionsShareDesc = 'nonePermissions_share_DESC',
  NonePermissionsSuggestEntityStatusAsc = 'nonePermissions_suggestEntityStatus_ASC',
  NonePermissionsSuggestEntityStatusDesc = 'nonePermissions_suggestEntityStatus_DESC',
  NonePermissionsUpdateAnyPostAsc = 'nonePermissions_updateAnyPost_ASC',
  NonePermissionsUpdateAnyPostDesc = 'nonePermissions_updateAnyPost_DESC',
  NonePermissionsUpdateAnySubspaceAsc = 'nonePermissions_updateAnySubspace_ASC',
  NonePermissionsUpdateAnySubspaceDesc = 'nonePermissions_updateAnySubspace_DESC',
  NonePermissionsUpdateEntityStatusAsc = 'nonePermissions_updateEntityStatus_ASC',
  NonePermissionsUpdateEntityStatusDesc = 'nonePermissions_updateEntityStatus_DESC',
  NonePermissionsUpdateOwnCommentsAsc = 'nonePermissions_updateOwnComments_ASC',
  NonePermissionsUpdateOwnCommentsDesc = 'nonePermissions_updateOwnComments_DESC',
  NonePermissionsUpdateOwnPostsAsc = 'nonePermissions_updateOwnPosts_ASC',
  NonePermissionsUpdateOwnPostsDesc = 'nonePermissions_updateOwnPosts_DESC',
  NonePermissionsUpdateOwnSubspacesAsc = 'nonePermissions_updateOwnSubspaces_ASC',
  NonePermissionsUpdateOwnSubspacesDesc = 'nonePermissions_updateOwnSubspaces_DESC',
  NonePermissionsUpdateSpaceSettingsAsc = 'nonePermissions_updateSpaceSettings_ASC',
  NonePermissionsUpdateSpaceSettingsDesc = 'nonePermissions_updateSpaceSettings_DESC',
  NonePermissionsUpdateSpaceAsc = 'nonePermissions_updateSpace_ASC',
  NonePermissionsUpdateSpaceDesc = 'nonePermissions_updateSpace_DESC',
  NonePermissionsUpvoteAsc = 'nonePermissions_upvote_ASC',
  NonePermissionsUpvoteDesc = 'nonePermissions_upvote_DESC',
  OwnedByAccountFollowersCountAsc = 'ownedByAccount_followersCount_ASC',
  OwnedByAccountFollowersCountDesc = 'ownedByAccount_followersCount_DESC',
  OwnedByAccountFollowingAccountsCountAsc = 'ownedByAccount_followingAccountsCount_ASC',
  OwnedByAccountFollowingAccountsCountDesc = 'ownedByAccount_followingAccountsCount_DESC',
  OwnedByAccountFollowingPostsCountAsc = 'ownedByAccount_followingPostsCount_ASC',
  OwnedByAccountFollowingPostsCountDesc = 'ownedByAccount_followingPostsCount_DESC',
  OwnedByAccountFollowingSpacesCountAsc = 'ownedByAccount_followingSpacesCount_ASC',
  OwnedByAccountFollowingSpacesCountDesc = 'ownedByAccount_followingSpacesCount_DESC',
  OwnedByAccountIdAsc = 'ownedByAccount_id_ASC',
  OwnedByAccountIdDesc = 'ownedByAccount_id_DESC',
  OwnedByAccountOwnedPostsCountAsc = 'ownedByAccount_ownedPostsCount_ASC',
  OwnedByAccountOwnedPostsCountDesc = 'ownedByAccount_ownedPostsCount_DESC',
  OwnedByAccountUpdatedAtBlockAsc = 'ownedByAccount_updatedAtBlock_ASC',
  OwnedByAccountUpdatedAtBlockDesc = 'ownedByAccount_updatedAtBlock_DESC',
  OwnedByAccountUpdatedAtTimeAsc = 'ownedByAccount_updatedAtTime_ASC',
  OwnedByAccountUpdatedAtTimeDesc = 'ownedByAccount_updatedAtTime_DESC',
  PostsCountAsc = 'postsCount_ASC',
  PostsCountDesc = 'postsCount_DESC',
  ProfileSpaceFollowersCountAsc = 'profileSpace_followersCount_ASC',
  ProfileSpaceFollowersCountDesc = 'profileSpace_followersCount_DESC',
  ProfileSpaceFollowingAccountsCountAsc = 'profileSpace_followingAccountsCount_ASC',
  ProfileSpaceFollowingAccountsCountDesc = 'profileSpace_followingAccountsCount_DESC',
  ProfileSpaceFollowingPostsCountAsc = 'profileSpace_followingPostsCount_ASC',
  ProfileSpaceFollowingPostsCountDesc = 'profileSpace_followingPostsCount_DESC',
  ProfileSpaceFollowingSpacesCountAsc = 'profileSpace_followingSpacesCount_ASC',
  ProfileSpaceFollowingSpacesCountDesc = 'profileSpace_followingSpacesCount_DESC',
  ProfileSpaceIdAsc = 'profileSpace_id_ASC',
  ProfileSpaceIdDesc = 'profileSpace_id_DESC',
  ProfileSpaceOwnedPostsCountAsc = 'profileSpace_ownedPostsCount_ASC',
  ProfileSpaceOwnedPostsCountDesc = 'profileSpace_ownedPostsCount_DESC',
  ProfileSpaceUpdatedAtBlockAsc = 'profileSpace_updatedAtBlock_ASC',
  ProfileSpaceUpdatedAtBlockDesc = 'profileSpace_updatedAtBlock_DESC',
  ProfileSpaceUpdatedAtTimeAsc = 'profileSpace_updatedAtTime_ASC',
  ProfileSpaceUpdatedAtTimeDesc = 'profileSpace_updatedAtTime_DESC',
  PublicPostsCountAsc = 'publicPostsCount_ASC',
  PublicPostsCountDesc = 'publicPostsCount_DESC',
  SpaceOwnerPermissionsCreateCommentsAsc = 'spaceOwnerPermissions_createComments_ASC',
  SpaceOwnerPermissionsCreateCommentsDesc = 'spaceOwnerPermissions_createComments_DESC',
  SpaceOwnerPermissionsCreatePostsAsc = 'spaceOwnerPermissions_createPosts_ASC',
  SpaceOwnerPermissionsCreatePostsDesc = 'spaceOwnerPermissions_createPosts_DESC',
  SpaceOwnerPermissionsCreateSubspacesAsc = 'spaceOwnerPermissions_createSubspaces_ASC',
  SpaceOwnerPermissionsCreateSubspacesDesc = 'spaceOwnerPermissions_createSubspaces_DESC',
  SpaceOwnerPermissionsDeleteAnyPostAsc = 'spaceOwnerPermissions_deleteAnyPost_ASC',
  SpaceOwnerPermissionsDeleteAnyPostDesc = 'spaceOwnerPermissions_deleteAnyPost_DESC',
  SpaceOwnerPermissionsDeleteAnySubspaceAsc = 'spaceOwnerPermissions_deleteAnySubspace_ASC',
  SpaceOwnerPermissionsDeleteAnySubspaceDesc = 'spaceOwnerPermissions_deleteAnySubspace_DESC',
  SpaceOwnerPermissionsDeleteOwnCommentsAsc = 'spaceOwnerPermissions_deleteOwnComments_ASC',
  SpaceOwnerPermissionsDeleteOwnCommentsDesc = 'spaceOwnerPermissions_deleteOwnComments_DESC',
  SpaceOwnerPermissionsDeleteOwnPostsAsc = 'spaceOwnerPermissions_deleteOwnPosts_ASC',
  SpaceOwnerPermissionsDeleteOwnPostsDesc = 'spaceOwnerPermissions_deleteOwnPosts_DESC',
  SpaceOwnerPermissionsDeleteOwnSubspacesAsc = 'spaceOwnerPermissions_deleteOwnSubspaces_ASC',
  SpaceOwnerPermissionsDeleteOwnSubspacesDesc = 'spaceOwnerPermissions_deleteOwnSubspaces_DESC',
  SpaceOwnerPermissionsDownvoteAsc = 'spaceOwnerPermissions_downvote_ASC',
  SpaceOwnerPermissionsDownvoteDesc = 'spaceOwnerPermissions_downvote_DESC',
  SpaceOwnerPermissionsHideAnyCommentAsc = 'spaceOwnerPermissions_hideAnyComment_ASC',
  SpaceOwnerPermissionsHideAnyCommentDesc = 'spaceOwnerPermissions_hideAnyComment_DESC',
  SpaceOwnerPermissionsHideAnyPostAsc = 'spaceOwnerPermissions_hideAnyPost_ASC',
  SpaceOwnerPermissionsHideAnyPostDesc = 'spaceOwnerPermissions_hideAnyPost_DESC',
  SpaceOwnerPermissionsHideAnySubspaceAsc = 'spaceOwnerPermissions_hideAnySubspace_ASC',
  SpaceOwnerPermissionsHideAnySubspaceDesc = 'spaceOwnerPermissions_hideAnySubspace_DESC',
  SpaceOwnerPermissionsHideOwnCommentsAsc = 'spaceOwnerPermissions_hideOwnComments_ASC',
  SpaceOwnerPermissionsHideOwnCommentsDesc = 'spaceOwnerPermissions_hideOwnComments_DESC',
  SpaceOwnerPermissionsHideOwnPostsAsc = 'spaceOwnerPermissions_hideOwnPosts_ASC',
  SpaceOwnerPermissionsHideOwnPostsDesc = 'spaceOwnerPermissions_hideOwnPosts_DESC',
  SpaceOwnerPermissionsHideOwnSubspacesAsc = 'spaceOwnerPermissions_hideOwnSubspaces_ASC',
  SpaceOwnerPermissionsHideOwnSubspacesDesc = 'spaceOwnerPermissions_hideOwnSubspaces_DESC',
  SpaceOwnerPermissionsManageRolesAsc = 'spaceOwnerPermissions_manageRoles_ASC',
  SpaceOwnerPermissionsManageRolesDesc = 'spaceOwnerPermissions_manageRoles_DESC',
  SpaceOwnerPermissionsOverridePostPermissionsAsc = 'spaceOwnerPermissions_overridePostPermissions_ASC',
  SpaceOwnerPermissionsOverridePostPermissionsDesc = 'spaceOwnerPermissions_overridePostPermissions_DESC',
  SpaceOwnerPermissionsOverrideSubspacePermissionsAsc = 'spaceOwnerPermissions_overrideSubspacePermissions_ASC',
  SpaceOwnerPermissionsOverrideSubspacePermissionsDesc = 'spaceOwnerPermissions_overrideSubspacePermissions_DESC',
  SpaceOwnerPermissionsRepresentSpaceExternallyAsc = 'spaceOwnerPermissions_representSpaceExternally_ASC',
  SpaceOwnerPermissionsRepresentSpaceExternallyDesc = 'spaceOwnerPermissions_representSpaceExternally_DESC',
  SpaceOwnerPermissionsRepresentSpaceInternallyAsc = 'spaceOwnerPermissions_representSpaceInternally_ASC',
  SpaceOwnerPermissionsRepresentSpaceInternallyDesc = 'spaceOwnerPermissions_representSpaceInternally_DESC',
  SpaceOwnerPermissionsShareAsc = 'spaceOwnerPermissions_share_ASC',
  SpaceOwnerPermissionsShareDesc = 'spaceOwnerPermissions_share_DESC',
  SpaceOwnerPermissionsSuggestEntityStatusAsc = 'spaceOwnerPermissions_suggestEntityStatus_ASC',
  SpaceOwnerPermissionsSuggestEntityStatusDesc = 'spaceOwnerPermissions_suggestEntityStatus_DESC',
  SpaceOwnerPermissionsUpdateAnyPostAsc = 'spaceOwnerPermissions_updateAnyPost_ASC',
  SpaceOwnerPermissionsUpdateAnyPostDesc = 'spaceOwnerPermissions_updateAnyPost_DESC',
  SpaceOwnerPermissionsUpdateAnySubspaceAsc = 'spaceOwnerPermissions_updateAnySubspace_ASC',
  SpaceOwnerPermissionsUpdateAnySubspaceDesc = 'spaceOwnerPermissions_updateAnySubspace_DESC',
  SpaceOwnerPermissionsUpdateEntityStatusAsc = 'spaceOwnerPermissions_updateEntityStatus_ASC',
  SpaceOwnerPermissionsUpdateEntityStatusDesc = 'spaceOwnerPermissions_updateEntityStatus_DESC',
  SpaceOwnerPermissionsUpdateOwnCommentsAsc = 'spaceOwnerPermissions_updateOwnComments_ASC',
  SpaceOwnerPermissionsUpdateOwnCommentsDesc = 'spaceOwnerPermissions_updateOwnComments_DESC',
  SpaceOwnerPermissionsUpdateOwnPostsAsc = 'spaceOwnerPermissions_updateOwnPosts_ASC',
  SpaceOwnerPermissionsUpdateOwnPostsDesc = 'spaceOwnerPermissions_updateOwnPosts_DESC',
  SpaceOwnerPermissionsUpdateOwnSubspacesAsc = 'spaceOwnerPermissions_updateOwnSubspaces_ASC',
  SpaceOwnerPermissionsUpdateOwnSubspacesDesc = 'spaceOwnerPermissions_updateOwnSubspaces_DESC',
  SpaceOwnerPermissionsUpdateSpaceSettingsAsc = 'spaceOwnerPermissions_updateSpaceSettings_ASC',
  SpaceOwnerPermissionsUpdateSpaceSettingsDesc = 'spaceOwnerPermissions_updateSpaceSettings_DESC',
  SpaceOwnerPermissionsUpdateSpaceAsc = 'spaceOwnerPermissions_updateSpace_ASC',
  SpaceOwnerPermissionsUpdateSpaceDesc = 'spaceOwnerPermissions_updateSpace_DESC',
  SpaceOwnerPermissionsUpvoteAsc = 'spaceOwnerPermissions_upvote_ASC',
  SpaceOwnerPermissionsUpvoteDesc = 'spaceOwnerPermissions_upvote_DESC',
  SummaryAsc = 'summary_ASC',
  SummaryDesc = 'summary_DESC',
  TagsOriginalAsc = 'tagsOriginal_ASC',
  TagsOriginalDesc = 'tagsOriginal_DESC',
  UpdatedAtBlockAsc = 'updatedAtBlock_ASC',
  UpdatedAtBlockDesc = 'updatedAtBlock_DESC',
  UpdatedAtTimeAsc = 'updatedAtTime_ASC',
  UpdatedAtTimeDesc = 'updatedAtTime_DESC',
  UsernameAsc = 'username_ASC',
  UsernameDesc = 'username_DESC'
}

/** The permission settings of a Space */
export type SpacePermissions = {
  __typename?: 'SpacePermissions';
  createComments?: Maybe<Scalars['Boolean']['output']>;
  createPosts?: Maybe<Scalars['Boolean']['output']>;
  createSubspaces?: Maybe<Scalars['Boolean']['output']>;
  deleteAnyPost?: Maybe<Scalars['Boolean']['output']>;
  deleteAnySubspace?: Maybe<Scalars['Boolean']['output']>;
  deleteOwnComments?: Maybe<Scalars['Boolean']['output']>;
  deleteOwnPosts?: Maybe<Scalars['Boolean']['output']>;
  deleteOwnSubspaces?: Maybe<Scalars['Boolean']['output']>;
  downvote?: Maybe<Scalars['Boolean']['output']>;
  hideAnyComment?: Maybe<Scalars['Boolean']['output']>;
  hideAnyPost?: Maybe<Scalars['Boolean']['output']>;
  hideAnySubspace?: Maybe<Scalars['Boolean']['output']>;
  hideOwnComments?: Maybe<Scalars['Boolean']['output']>;
  hideOwnPosts?: Maybe<Scalars['Boolean']['output']>;
  hideOwnSubspaces?: Maybe<Scalars['Boolean']['output']>;
  manageRoles?: Maybe<Scalars['Boolean']['output']>;
  overridePostPermissions?: Maybe<Scalars['Boolean']['output']>;
  overrideSubspacePermissions?: Maybe<Scalars['Boolean']['output']>;
  representSpaceExternally?: Maybe<Scalars['Boolean']['output']>;
  representSpaceInternally?: Maybe<Scalars['Boolean']['output']>;
  share?: Maybe<Scalars['Boolean']['output']>;
  suggestEntityStatus?: Maybe<Scalars['Boolean']['output']>;
  updateAnyPost?: Maybe<Scalars['Boolean']['output']>;
  updateAnySubspace?: Maybe<Scalars['Boolean']['output']>;
  updateEntityStatus?: Maybe<Scalars['Boolean']['output']>;
  updateOwnComments?: Maybe<Scalars['Boolean']['output']>;
  updateOwnPosts?: Maybe<Scalars['Boolean']['output']>;
  updateOwnSubspaces?: Maybe<Scalars['Boolean']['output']>;
  updateSpace?: Maybe<Scalars['Boolean']['output']>;
  updateSpaceSettings?: Maybe<Scalars['Boolean']['output']>;
  upvote?: Maybe<Scalars['Boolean']['output']>;
};

export type SpacePermissionsWhereInput = {
  createComments_eq?: InputMaybe<Scalars['Boolean']['input']>;
  createComments_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createComments_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  createPosts_eq?: InputMaybe<Scalars['Boolean']['input']>;
  createPosts_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createPosts_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  createSubspaces_eq?: InputMaybe<Scalars['Boolean']['input']>;
  createSubspaces_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createSubspaces_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  deleteAnyPost_eq?: InputMaybe<Scalars['Boolean']['input']>;
  deleteAnyPost_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  deleteAnyPost_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  deleteAnySubspace_eq?: InputMaybe<Scalars['Boolean']['input']>;
  deleteAnySubspace_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  deleteAnySubspace_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  deleteOwnComments_eq?: InputMaybe<Scalars['Boolean']['input']>;
  deleteOwnComments_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  deleteOwnComments_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  deleteOwnPosts_eq?: InputMaybe<Scalars['Boolean']['input']>;
  deleteOwnPosts_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  deleteOwnPosts_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  deleteOwnSubspaces_eq?: InputMaybe<Scalars['Boolean']['input']>;
  deleteOwnSubspaces_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  deleteOwnSubspaces_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  downvote_eq?: InputMaybe<Scalars['Boolean']['input']>;
  downvote_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  downvote_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  hideAnyComment_eq?: InputMaybe<Scalars['Boolean']['input']>;
  hideAnyComment_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hideAnyComment_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  hideAnyPost_eq?: InputMaybe<Scalars['Boolean']['input']>;
  hideAnyPost_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hideAnyPost_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  hideAnySubspace_eq?: InputMaybe<Scalars['Boolean']['input']>;
  hideAnySubspace_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hideAnySubspace_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  hideOwnComments_eq?: InputMaybe<Scalars['Boolean']['input']>;
  hideOwnComments_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hideOwnComments_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  hideOwnPosts_eq?: InputMaybe<Scalars['Boolean']['input']>;
  hideOwnPosts_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hideOwnPosts_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  hideOwnSubspaces_eq?: InputMaybe<Scalars['Boolean']['input']>;
  hideOwnSubspaces_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hideOwnSubspaces_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  manageRoles_eq?: InputMaybe<Scalars['Boolean']['input']>;
  manageRoles_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  manageRoles_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  overridePostPermissions_eq?: InputMaybe<Scalars['Boolean']['input']>;
  overridePostPermissions_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  overridePostPermissions_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  overrideSubspacePermissions_eq?: InputMaybe<Scalars['Boolean']['input']>;
  overrideSubspacePermissions_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  overrideSubspacePermissions_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  representSpaceExternally_eq?: InputMaybe<Scalars['Boolean']['input']>;
  representSpaceExternally_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  representSpaceExternally_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  representSpaceInternally_eq?: InputMaybe<Scalars['Boolean']['input']>;
  representSpaceInternally_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  representSpaceInternally_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  share_eq?: InputMaybe<Scalars['Boolean']['input']>;
  share_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  share_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  suggestEntityStatus_eq?: InputMaybe<Scalars['Boolean']['input']>;
  suggestEntityStatus_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  suggestEntityStatus_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateAnyPost_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateAnyPost_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updateAnyPost_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateAnySubspace_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateAnySubspace_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updateAnySubspace_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateEntityStatus_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateEntityStatus_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updateEntityStatus_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateOwnComments_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateOwnComments_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updateOwnComments_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateOwnPosts_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateOwnPosts_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updateOwnPosts_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateOwnSubspaces_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateOwnSubspaces_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updateOwnSubspaces_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateSpaceSettings_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateSpaceSettings_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updateSpaceSettings_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateSpace_eq?: InputMaybe<Scalars['Boolean']['input']>;
  updateSpace_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updateSpace_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  upvote_eq?: InputMaybe<Scalars['Boolean']['input']>;
  upvote_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  upvote_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SpaceWhereInput = {
  AND?: InputMaybe<Array<SpaceWhereInput>>;
  OR?: InputMaybe<Array<SpaceWhereInput>>;
  about_contains?: InputMaybe<Scalars['String']['input']>;
  about_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  about_endsWith?: InputMaybe<Scalars['String']['input']>;
  about_eq?: InputMaybe<Scalars['String']['input']>;
  about_gt?: InputMaybe<Scalars['String']['input']>;
  about_gte?: InputMaybe<Scalars['String']['input']>;
  about_in?: InputMaybe<Array<Scalars['String']['input']>>;
  about_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  about_lt?: InputMaybe<Scalars['String']['input']>;
  about_lte?: InputMaybe<Scalars['String']['input']>;
  about_not_contains?: InputMaybe<Scalars['String']['input']>;
  about_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  about_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  about_not_eq?: InputMaybe<Scalars['String']['input']>;
  about_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  about_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  about_startsWith?: InputMaybe<Scalars['String']['input']>;
  canEveryoneCreatePosts_eq?: InputMaybe<Scalars['Boolean']['input']>;
  canEveryoneCreatePosts_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  canEveryoneCreatePosts_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  canFollowerCreatePosts_eq?: InputMaybe<Scalars['Boolean']['input']>;
  canFollowerCreatePosts_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  canFollowerCreatePosts_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  content_contains?: InputMaybe<Scalars['String']['input']>;
  content_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  content_endsWith?: InputMaybe<Scalars['String']['input']>;
  content_eq?: InputMaybe<Scalars['String']['input']>;
  content_gt?: InputMaybe<Scalars['String']['input']>;
  content_gte?: InputMaybe<Scalars['String']['input']>;
  content_in?: InputMaybe<Array<Scalars['String']['input']>>;
  content_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  content_lt?: InputMaybe<Scalars['String']['input']>;
  content_lte?: InputMaybe<Scalars['String']['input']>;
  content_not_contains?: InputMaybe<Scalars['String']['input']>;
  content_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  content_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  content_not_eq?: InputMaybe<Scalars['String']['input']>;
  content_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  content_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  content_startsWith?: InputMaybe<Scalars['String']['input']>;
  createdAtBlock_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtBlock_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtTime_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_gt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_gte?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  createdAtTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtTime_lt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_lte?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTime_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  createdByAccount?: InputMaybe<AccountWhereInput>;
  createdByAccount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdOnDay_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdOnDay_gt?: InputMaybe<Scalars['DateTime']['input']>;
  createdOnDay_gte?: InputMaybe<Scalars['DateTime']['input']>;
  createdOnDay_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  createdOnDay_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdOnDay_lt?: InputMaybe<Scalars['DateTime']['input']>;
  createdOnDay_lte?: InputMaybe<Scalars['DateTime']['input']>;
  createdOnDay_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  createdOnDay_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  email_contains?: InputMaybe<Scalars['String']['input']>;
  email_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  email_endsWith?: InputMaybe<Scalars['String']['input']>;
  email_eq?: InputMaybe<Scalars['String']['input']>;
  email_gt?: InputMaybe<Scalars['String']['input']>;
  email_gte?: InputMaybe<Scalars['String']['input']>;
  email_in?: InputMaybe<Array<Scalars['String']['input']>>;
  email_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  email_lt?: InputMaybe<Scalars['String']['input']>;
  email_lte?: InputMaybe<Scalars['String']['input']>;
  email_not_contains?: InputMaybe<Scalars['String']['input']>;
  email_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  email_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  email_not_eq?: InputMaybe<Scalars['String']['input']>;
  email_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  email_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  email_startsWith?: InputMaybe<Scalars['String']['input']>;
  everyonePermissions?: InputMaybe<SpacePermissionsWhereInput>;
  everyonePermissions_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  experimental_eq?: InputMaybe<Scalars['JSON']['input']>;
  experimental_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  experimental_jsonContains?: InputMaybe<Scalars['JSON']['input']>;
  experimental_jsonHasKey?: InputMaybe<Scalars['JSON']['input']>;
  experimental_not_eq?: InputMaybe<Scalars['JSON']['input']>;
  followerPermissions?: InputMaybe<SpacePermissionsWhereInput>;
  followerPermissions_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  followersCount_eq?: InputMaybe<Scalars['Int']['input']>;
  followersCount_gt?: InputMaybe<Scalars['Int']['input']>;
  followersCount_gte?: InputMaybe<Scalars['Int']['input']>;
  followersCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  followersCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  followersCount_lt?: InputMaybe<Scalars['Int']['input']>;
  followersCount_lte?: InputMaybe<Scalars['Int']['input']>;
  followersCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  followersCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  followers_every?: InputMaybe<SpaceFollowersWhereInput>;
  followers_none?: InputMaybe<SpaceFollowersWhereInput>;
  followers_some?: InputMaybe<SpaceFollowersWhereInput>;
  format_contains?: InputMaybe<Scalars['String']['input']>;
  format_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  format_endsWith?: InputMaybe<Scalars['String']['input']>;
  format_eq?: InputMaybe<Scalars['String']['input']>;
  format_gt?: InputMaybe<Scalars['String']['input']>;
  format_gte?: InputMaybe<Scalars['String']['input']>;
  format_in?: InputMaybe<Array<Scalars['String']['input']>>;
  format_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  format_lt?: InputMaybe<Scalars['String']['input']>;
  format_lte?: InputMaybe<Scalars['String']['input']>;
  format_not_contains?: InputMaybe<Scalars['String']['input']>;
  format_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  format_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  format_not_eq?: InputMaybe<Scalars['String']['input']>;
  format_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  format_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  format_startsWith?: InputMaybe<Scalars['String']['input']>;
  handle_contains?: InputMaybe<Scalars['String']['input']>;
  handle_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  handle_endsWith?: InputMaybe<Scalars['String']['input']>;
  handle_eq?: InputMaybe<Scalars['String']['input']>;
  handle_gt?: InputMaybe<Scalars['String']['input']>;
  handle_gte?: InputMaybe<Scalars['String']['input']>;
  handle_in?: InputMaybe<Array<Scalars['String']['input']>>;
  handle_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  handle_lt?: InputMaybe<Scalars['String']['input']>;
  handle_lte?: InputMaybe<Scalars['String']['input']>;
  handle_not_contains?: InputMaybe<Scalars['String']['input']>;
  handle_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  handle_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  handle_not_eq?: InputMaybe<Scalars['String']['input']>;
  handle_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  handle_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  handle_startsWith?: InputMaybe<Scalars['String']['input']>;
  hiddenPostsCount_eq?: InputMaybe<Scalars['Int']['input']>;
  hiddenPostsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hiddenPostsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hiddenPostsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hiddenPostsCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hiddenPostsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hiddenPostsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hiddenPostsCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  hiddenPostsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hidden_eq?: InputMaybe<Scalars['Boolean']['input']>;
  hidden_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  hidden_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_contains?: InputMaybe<Scalars['String']['input']>;
  image_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_eq?: InputMaybe<Scalars['String']['input']>;
  image_gt?: InputMaybe<Scalars['String']['input']>;
  image_gte?: InputMaybe<Scalars['String']['input']>;
  image_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  image_lt?: InputMaybe<Scalars['String']['input']>;
  image_lte?: InputMaybe<Scalars['String']['input']>;
  image_not_contains?: InputMaybe<Scalars['String']['input']>;
  image_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_not_eq?: InputMaybe<Scalars['String']['input']>;
  image_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_startsWith?: InputMaybe<Scalars['String']['input']>;
  interestsOriginal_contains?: InputMaybe<Scalars['String']['input']>;
  interestsOriginal_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  interestsOriginal_endsWith?: InputMaybe<Scalars['String']['input']>;
  interestsOriginal_eq?: InputMaybe<Scalars['String']['input']>;
  interestsOriginal_gt?: InputMaybe<Scalars['String']['input']>;
  interestsOriginal_gte?: InputMaybe<Scalars['String']['input']>;
  interestsOriginal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  interestsOriginal_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  interestsOriginal_lt?: InputMaybe<Scalars['String']['input']>;
  interestsOriginal_lte?: InputMaybe<Scalars['String']['input']>;
  interestsOriginal_not_contains?: InputMaybe<Scalars['String']['input']>;
  interestsOriginal_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  interestsOriginal_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  interestsOriginal_not_eq?: InputMaybe<Scalars['String']['input']>;
  interestsOriginal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  interestsOriginal_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  interestsOriginal_startsWith?: InputMaybe<Scalars['String']['input']>;
  isShowMore_eq?: InputMaybe<Scalars['Boolean']['input']>;
  isShowMore_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  isShowMore_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  linksOriginal_contains?: InputMaybe<Scalars['String']['input']>;
  linksOriginal_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  linksOriginal_endsWith?: InputMaybe<Scalars['String']['input']>;
  linksOriginal_eq?: InputMaybe<Scalars['String']['input']>;
  linksOriginal_gt?: InputMaybe<Scalars['String']['input']>;
  linksOriginal_gte?: InputMaybe<Scalars['String']['input']>;
  linksOriginal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  linksOriginal_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  linksOriginal_lt?: InputMaybe<Scalars['String']['input']>;
  linksOriginal_lte?: InputMaybe<Scalars['String']['input']>;
  linksOriginal_not_contains?: InputMaybe<Scalars['String']['input']>;
  linksOriginal_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  linksOriginal_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  linksOriginal_not_eq?: InputMaybe<Scalars['String']['input']>;
  linksOriginal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  linksOriginal_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  linksOriginal_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_not_eq?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_startsWith?: InputMaybe<Scalars['String']['input']>;
  nonePermissions?: InputMaybe<SpacePermissionsWhereInput>;
  nonePermissions_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  ownedByAccount?: InputMaybe<AccountWhereInput>;
  ownedByAccount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  pinnedByExtensions_every?: InputMaybe<ExtensionPinnedResourceWhereInput>;
  pinnedByExtensions_none?: InputMaybe<ExtensionPinnedResourceWhereInput>;
  pinnedByExtensions_some?: InputMaybe<ExtensionPinnedResourceWhereInput>;
  postsCount_eq?: InputMaybe<Scalars['Int']['input']>;
  postsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  postsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  postsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  postsCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  postsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  postsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  postsCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  postsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  posts_every?: InputMaybe<PostWhereInput>;
  posts_none?: InputMaybe<PostWhereInput>;
  posts_some?: InputMaybe<PostWhereInput>;
  profileSpace?: InputMaybe<AccountWhereInput>;
  profileSpace_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  publicPostsCount_eq?: InputMaybe<Scalars['Int']['input']>;
  publicPostsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  publicPostsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  publicPostsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  publicPostsCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  publicPostsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  publicPostsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  publicPostsCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  publicPostsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  spaceOwnerPermissions?: InputMaybe<SpacePermissionsWhereInput>;
  spaceOwnerPermissions_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  summary_contains?: InputMaybe<Scalars['String']['input']>;
  summary_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  summary_endsWith?: InputMaybe<Scalars['String']['input']>;
  summary_eq?: InputMaybe<Scalars['String']['input']>;
  summary_gt?: InputMaybe<Scalars['String']['input']>;
  summary_gte?: InputMaybe<Scalars['String']['input']>;
  summary_in?: InputMaybe<Array<Scalars['String']['input']>>;
  summary_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  summary_lt?: InputMaybe<Scalars['String']['input']>;
  summary_lte?: InputMaybe<Scalars['String']['input']>;
  summary_not_contains?: InputMaybe<Scalars['String']['input']>;
  summary_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  summary_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  summary_not_eq?: InputMaybe<Scalars['String']['input']>;
  summary_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  summary_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  summary_startsWith?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_contains?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_endsWith?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_eq?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_gt?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_gte?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tagsOriginal_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  tagsOriginal_lt?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_lte?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_not_contains?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_not_eq?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tagsOriginal_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  tagsOriginal_startsWith?: InputMaybe<Scalars['String']['input']>;
  updatedAtBlock_eq?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAtBlock_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAtBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAtTime_eq?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_gt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_gte?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  updatedAtTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAtTime_lt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_lte?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTime_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  username_contains?: InputMaybe<Scalars['String']['input']>;
  username_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  username_endsWith?: InputMaybe<Scalars['String']['input']>;
  username_eq?: InputMaybe<Scalars['String']['input']>;
  username_gt?: InputMaybe<Scalars['String']['input']>;
  username_gte?: InputMaybe<Scalars['String']['input']>;
  username_in?: InputMaybe<Array<Scalars['String']['input']>>;
  username_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  username_lt?: InputMaybe<Scalars['String']['input']>;
  username_lte?: InputMaybe<Scalars['String']['input']>;
  username_not_contains?: InputMaybe<Scalars['String']['input']>;
  username_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  username_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  username_not_eq?: InputMaybe<Scalars['String']['input']>;
  username_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  username_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  username_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type SpacesConnection = {
  __typename?: 'SpacesConnection';
  edges: Array<SpaceEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SquidStatus = {
  __typename?: 'SquidStatus';
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']['output']>;
};

export enum Status {
  Active = 'Active',
  Deleted = 'Deleted'
}

export type Subscription = {
  __typename?: 'Subscription';
  accountById?: Maybe<Account>;
  accountFollowers: Array<AccountFollowers>;
  accountFollowersById?: Maybe<AccountFollowers>;
  accounts: Array<Account>;
  activities: Array<Activity>;
  activityById?: Maybe<Activity>;
  commentFollowers: Array<CommentFollowers>;
  commentFollowersById?: Maybe<CommentFollowers>;
  contentExtensionById?: Maybe<ContentExtension>;
  contentExtensions: Array<ContentExtension>;
  evmAccountById?: Maybe<EvmAccount>;
  evmAccounts: Array<EvmAccount>;
  evmSubstrateAccountLinkById?: Maybe<EvmSubstrateAccountLink>;
  evmSubstrateAccountLinks: Array<EvmSubstrateAccountLink>;
  extensionPinnedResourceById?: Maybe<ExtensionPinnedResource>;
  extensionPinnedResources: Array<ExtensionPinnedResource>;
  inBatchNotifications: Array<InBatchNotifications>;
  inBatchNotificationsById?: Maybe<InBatchNotifications>;
  ipfsFetchLogById?: Maybe<IpfsFetchLog>;
  ipfsFetchLogs: Array<IpfsFetchLog>;
  newsFeedById?: Maybe<NewsFeed>;
  newsFeeds: Array<NewsFeed>;
  notificationById?: Maybe<Notification>;
  notifications: Array<Notification>;
  postById?: Maybe<Post>;
  postFollowers: Array<PostFollowers>;
  postFollowersById?: Maybe<PostFollowers>;
  posts: Array<Post>;
  reactionById?: Maybe<Reaction>;
  reactions: Array<Reaction>;
  spaceById?: Maybe<Space>;
  spaceFollowers: Array<SpaceFollowers>;
  spaceFollowersById?: Maybe<SpaceFollowers>;
  spaces: Array<Space>;
};


export type SubscriptionAccountByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionAccountFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AccountFollowersOrderByInput>>;
  where?: InputMaybe<AccountFollowersWhereInput>;
};


export type SubscriptionAccountFollowersByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AccountOrderByInput>>;
  where?: InputMaybe<AccountWhereInput>;
};


export type SubscriptionActivitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ActivityOrderByInput>>;
  where?: InputMaybe<ActivityWhereInput>;
};


export type SubscriptionActivityByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionCommentFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CommentFollowersOrderByInput>>;
  where?: InputMaybe<CommentFollowersWhereInput>;
};


export type SubscriptionCommentFollowersByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionContentExtensionByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionContentExtensionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ContentExtensionOrderByInput>>;
  where?: InputMaybe<ContentExtensionWhereInput>;
};


export type SubscriptionEvmAccountByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionEvmAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EvmAccountOrderByInput>>;
  where?: InputMaybe<EvmAccountWhereInput>;
};


export type SubscriptionEvmSubstrateAccountLinkByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionEvmSubstrateAccountLinksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EvmSubstrateAccountLinkOrderByInput>>;
  where?: InputMaybe<EvmSubstrateAccountLinkWhereInput>;
};


export type SubscriptionExtensionPinnedResourceByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionExtensionPinnedResourcesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ExtensionPinnedResourceOrderByInput>>;
  where?: InputMaybe<ExtensionPinnedResourceWhereInput>;
};


export type SubscriptionInBatchNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InBatchNotificationsOrderByInput>>;
  where?: InputMaybe<InBatchNotificationsWhereInput>;
};


export type SubscriptionInBatchNotificationsByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionIpfsFetchLogByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionIpfsFetchLogsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<IpfsFetchLogOrderByInput>>;
  where?: InputMaybe<IpfsFetchLogWhereInput>;
};


export type SubscriptionNewsFeedByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionNewsFeedsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NewsFeedOrderByInput>>;
  where?: InputMaybe<NewsFeedWhereInput>;
};


export type SubscriptionNotificationByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NotificationOrderByInput>>;
  where?: InputMaybe<NotificationWhereInput>;
};


export type SubscriptionPostByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionPostFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostFollowersOrderByInput>>;
  where?: InputMaybe<PostFollowersWhereInput>;
};


export type SubscriptionPostFollowersByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionPostsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostOrderByInput>>;
  where?: InputMaybe<PostWhereInput>;
};


export type SubscriptionReactionByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionReactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ReactionOrderByInput>>;
  where?: InputMaybe<ReactionWhereInput>;
};


export type SubscriptionSpaceByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionSpaceFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SpaceFollowersOrderByInput>>;
  where?: InputMaybe<SpaceFollowersWhereInput>;
};


export type SubscriptionSpaceFollowersByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionSpacesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SpaceOrderByInput>>;
  where?: InputMaybe<SpaceWhereInput>;
};

export type TweetAttachmentsDetails = {
  __typename?: 'TweetAttachmentsDetails';
  mediaKeys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  pollIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** Detailed information about the Tweet attached to a Post */
export type TweetDetails = {
  __typename?: 'TweetDetails';
  attachments?: Maybe<TweetAttachmentsDetails>;
  authorId?: Maybe<Scalars['String']['output']>;
  conversationId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  editHistoryTweetIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  inReplyToUserId?: Maybe<Scalars['String']['output']>;
  lang?: Maybe<Scalars['String']['output']>;
  referencedTweets?: Maybe<Array<Maybe<ReferencedTweetDetails>>>;
  username?: Maybe<Scalars['String']['output']>;
};

export type TweetDetailsWhereInput = {
  attachments_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  authorId_contains?: InputMaybe<Scalars['String']['input']>;
  authorId_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  authorId_endsWith?: InputMaybe<Scalars['String']['input']>;
  authorId_eq?: InputMaybe<Scalars['String']['input']>;
  authorId_gt?: InputMaybe<Scalars['String']['input']>;
  authorId_gte?: InputMaybe<Scalars['String']['input']>;
  authorId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  authorId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  authorId_lt?: InputMaybe<Scalars['String']['input']>;
  authorId_lte?: InputMaybe<Scalars['String']['input']>;
  authorId_not_contains?: InputMaybe<Scalars['String']['input']>;
  authorId_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  authorId_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  authorId_not_eq?: InputMaybe<Scalars['String']['input']>;
  authorId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  authorId_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  authorId_startsWith?: InputMaybe<Scalars['String']['input']>;
  conversationId_contains?: InputMaybe<Scalars['String']['input']>;
  conversationId_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  conversationId_endsWith?: InputMaybe<Scalars['String']['input']>;
  conversationId_eq?: InputMaybe<Scalars['String']['input']>;
  conversationId_gt?: InputMaybe<Scalars['String']['input']>;
  conversationId_gte?: InputMaybe<Scalars['String']['input']>;
  conversationId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  conversationId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  conversationId_lt?: InputMaybe<Scalars['String']['input']>;
  conversationId_lte?: InputMaybe<Scalars['String']['input']>;
  conversationId_not_contains?: InputMaybe<Scalars['String']['input']>;
  conversationId_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  conversationId_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  conversationId_not_eq?: InputMaybe<Scalars['String']['input']>;
  conversationId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  conversationId_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  conversationId_startsWith?: InputMaybe<Scalars['String']['input']>;
  createdAt_contains?: InputMaybe<Scalars['String']['input']>;
  createdAt_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  createdAt_endsWith?: InputMaybe<Scalars['String']['input']>;
  createdAt_eq?: InputMaybe<Scalars['String']['input']>;
  createdAt_gt?: InputMaybe<Scalars['String']['input']>;
  createdAt_gte?: InputMaybe<Scalars['String']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['String']['input']>>;
  createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt_lt?: InputMaybe<Scalars['String']['input']>;
  createdAt_lte?: InputMaybe<Scalars['String']['input']>;
  createdAt_not_contains?: InputMaybe<Scalars['String']['input']>;
  createdAt_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  createdAt_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  createdAt_not_eq?: InputMaybe<Scalars['String']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  createdAt_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  createdAt_startsWith?: InputMaybe<Scalars['String']['input']>;
  editHistoryTweetIds_containsAll?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editHistoryTweetIds_containsAny?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editHistoryTweetIds_containsNone?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editHistoryTweetIds_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  inReplyToUserId_contains?: InputMaybe<Scalars['String']['input']>;
  inReplyToUserId_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  inReplyToUserId_endsWith?: InputMaybe<Scalars['String']['input']>;
  inReplyToUserId_eq?: InputMaybe<Scalars['String']['input']>;
  inReplyToUserId_gt?: InputMaybe<Scalars['String']['input']>;
  inReplyToUserId_gte?: InputMaybe<Scalars['String']['input']>;
  inReplyToUserId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  inReplyToUserId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  inReplyToUserId_lt?: InputMaybe<Scalars['String']['input']>;
  inReplyToUserId_lte?: InputMaybe<Scalars['String']['input']>;
  inReplyToUserId_not_contains?: InputMaybe<Scalars['String']['input']>;
  inReplyToUserId_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  inReplyToUserId_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  inReplyToUserId_not_eq?: InputMaybe<Scalars['String']['input']>;
  inReplyToUserId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  inReplyToUserId_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  inReplyToUserId_startsWith?: InputMaybe<Scalars['String']['input']>;
  lang_contains?: InputMaybe<Scalars['String']['input']>;
  lang_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  lang_endsWith?: InputMaybe<Scalars['String']['input']>;
  lang_eq?: InputMaybe<Scalars['String']['input']>;
  lang_gt?: InputMaybe<Scalars['String']['input']>;
  lang_gte?: InputMaybe<Scalars['String']['input']>;
  lang_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lang_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lang_lt?: InputMaybe<Scalars['String']['input']>;
  lang_lte?: InputMaybe<Scalars['String']['input']>;
  lang_not_contains?: InputMaybe<Scalars['String']['input']>;
  lang_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  lang_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  lang_not_eq?: InputMaybe<Scalars['String']['input']>;
  lang_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lang_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  lang_startsWith?: InputMaybe<Scalars['String']['input']>;
  referencedTweets_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  username_contains?: InputMaybe<Scalars['String']['input']>;
  username_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  username_endsWith?: InputMaybe<Scalars['String']['input']>;
  username_eq?: InputMaybe<Scalars['String']['input']>;
  username_gt?: InputMaybe<Scalars['String']['input']>;
  username_gte?: InputMaybe<Scalars['String']['input']>;
  username_in?: InputMaybe<Array<Scalars['String']['input']>>;
  username_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  username_lt?: InputMaybe<Scalars['String']['input']>;
  username_lte?: InputMaybe<Scalars['String']['input']>;
  username_not_contains?: InputMaybe<Scalars['String']['input']>;
  username_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  username_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  username_not_eq?: InputMaybe<Scalars['String']['input']>;
  username_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  username_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  username_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type UserRetentionCountFullModel = {
  __typename?: 'UserRetentionCountFullModel';
  retention_count: Scalars['Float']['output'];
};

export type UserRetentionCountModel = {
  __typename?: 'UserRetentionCountModel';
  retention_count: Scalars['Float']['output'];
};

export type WhereIdInput = {
  id: Scalars['String']['input'];
};

export type GetEvmAddressesQueryVariables = Exact<{
  addresses?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetEvmAddressesQuery = { __typename?: 'Query', evmSubstrateAccountLinks: Array<{ __typename?: 'EvmSubstrateAccountLink', evmAccount: { __typename?: 'EvmAccount', id: string }, substrateAccount: { __typename?: 'Account', id: string } }> };

export type GetPostsQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetPostsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', content?: string | null, createdAtBlock?: any | null, createdAtTime?: any | null, title?: string | null, body?: string | null, summary?: string | null, isShowMore?: boolean | null, image?: string | null, link?: string | null, downvotesCount: number, hidden: boolean, id: string, isComment: boolean, kind?: PostKind | null, repliesCount: number, sharesCount: number, upvotesCount: number, updatedAtTime?: any | null, inReplyToKind?: InReplyToKind | null, followersCount: number, canonical?: string | null, tagsOriginal?: string | null, createdByAccount: { __typename?: 'Account', id: string }, inReplyToPost?: { __typename?: 'Post', id: string } | null, ownedByAccount: { __typename?: 'Account', id: string }, space?: { __typename?: 'Space', id: string } | null, rootPost?: { __typename?: 'Post', id: string, space?: { __typename?: 'Space', id: string } | null } | null, sharedPost?: { __typename?: 'Post', id: string } | null, extensions: Array<{ __typename?: 'ContentExtension', image?: string | null, amount?: any | null, chain?: string | null, collectionId?: string | null, decimals?: number | null, extensionSchemaId: ContentExtensionSchemaId, id: string, nftId?: string | null, token?: string | null, txHash?: string | null, message?: string | null, nonce?: string | null, url?: string | null, recipient?: { __typename?: 'Account', id: string } | null, fromEvm?: { __typename?: 'EvmAccount', id: string } | null, toEvm?: { __typename?: 'EvmAccount', id: string } | null, pinnedResources: Array<{ __typename?: 'ExtensionPinnedResource', post?: { __typename?: 'Post', id: string } | null }> }> }> };

export type GetPostsByContentQueryVariables = Exact<{
  search: Scalars['String']['input'];
  spaceIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
  postIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type GetPostsByContentQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', content?: string | null, createdAtBlock?: any | null, createdAtTime?: any | null, title?: string | null, body?: string | null, summary?: string | null, isShowMore?: boolean | null, image?: string | null, link?: string | null, downvotesCount: number, hidden: boolean, id: string, isComment: boolean, kind?: PostKind | null, repliesCount: number, sharesCount: number, upvotesCount: number, updatedAtTime?: any | null, inReplyToKind?: InReplyToKind | null, followersCount: number, canonical?: string | null, tagsOriginal?: string | null, createdByAccount: { __typename?: 'Account', id: string }, inReplyToPost?: { __typename?: 'Post', id: string } | null, ownedByAccount: { __typename?: 'Account', id: string }, space?: { __typename?: 'Space', id: string } | null, rootPost?: { __typename?: 'Post', id: string, space?: { __typename?: 'Space', id: string } | null } | null, sharedPost?: { __typename?: 'Post', id: string } | null, extensions: Array<{ __typename?: 'ContentExtension', image?: string | null, amount?: any | null, chain?: string | null, collectionId?: string | null, decimals?: number | null, extensionSchemaId: ContentExtensionSchemaId, id: string, nftId?: string | null, token?: string | null, txHash?: string | null, message?: string | null, nonce?: string | null, url?: string | null, recipient?: { __typename?: 'Account', id: string } | null, fromEvm?: { __typename?: 'EvmAccount', id: string } | null, toEvm?: { __typename?: 'EvmAccount', id: string } | null, pinnedResources: Array<{ __typename?: 'ExtensionPinnedResource', post?: { __typename?: 'Post', id: string } | null }> }> }> };

export type GetOwnedPostIdsQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type GetOwnedPostIdsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', id: string }> };

export type GetProfilesQueryVariables = Exact<{
  addresses?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetProfilesQuery = { __typename?: 'Query', accounts: Array<{ __typename?: 'Account', id: string, profileSpace?: { __typename?: 'Space', id: string, name?: string | null, image?: string | null } | null }> };

export type GetSpacesQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetSpacesQuery = { __typename?: 'Query', spaces: Array<{ __typename?: 'Space', canEveryoneCreatePosts?: boolean | null, canFollowerCreatePosts?: boolean | null, content?: string | null, createdAtBlock?: any | null, createdAtTime?: any | null, email?: string | null, name?: string | null, summary?: string | null, isShowMore?: boolean | null, linksOriginal?: string | null, hidden: boolean, id: string, updatedAtTime?: any | null, postsCount: number, image?: string | null, tagsOriginal?: string | null, about?: string | null, createdByAccount: { __typename?: 'Account', id: string }, ownedByAccount: { __typename?: 'Account', id: string } }> };

export type SpaceFragmentFragment = { __typename?: 'Space', canEveryoneCreatePosts?: boolean | null, canFollowerCreatePosts?: boolean | null, content?: string | null, createdAtBlock?: any | null, createdAtTime?: any | null, email?: string | null, name?: string | null, summary?: string | null, isShowMore?: boolean | null, linksOriginal?: string | null, hidden: boolean, id: string, updatedAtTime?: any | null, postsCount: number, image?: string | null, tagsOriginal?: string | null, about?: string | null, createdByAccount: { __typename?: 'Account', id: string }, ownedByAccount: { __typename?: 'Account', id: string } };

export type PostFragmentFragment = { __typename?: 'Post', content?: string | null, createdAtBlock?: any | null, createdAtTime?: any | null, title?: string | null, body?: string | null, summary?: string | null, isShowMore?: boolean | null, image?: string | null, link?: string | null, downvotesCount: number, hidden: boolean, id: string, isComment: boolean, kind?: PostKind | null, repliesCount: number, sharesCount: number, upvotesCount: number, updatedAtTime?: any | null, inReplyToKind?: InReplyToKind | null, followersCount: number, canonical?: string | null, tagsOriginal?: string | null, createdByAccount: { __typename?: 'Account', id: string }, inReplyToPost?: { __typename?: 'Post', id: string } | null, ownedByAccount: { __typename?: 'Account', id: string }, space?: { __typename?: 'Space', id: string } | null, rootPost?: { __typename?: 'Post', id: string, space?: { __typename?: 'Space', id: string } | null } | null, sharedPost?: { __typename?: 'Post', id: string } | null, extensions: Array<{ __typename?: 'ContentExtension', image?: string | null, amount?: any | null, chain?: string | null, collectionId?: string | null, decimals?: number | null, extensionSchemaId: ContentExtensionSchemaId, id: string, nftId?: string | null, token?: string | null, txHash?: string | null, message?: string | null, nonce?: string | null, url?: string | null, recipient?: { __typename?: 'Account', id: string } | null, fromEvm?: { __typename?: 'EvmAccount', id: string } | null, toEvm?: { __typename?: 'EvmAccount', id: string } | null, pinnedResources: Array<{ __typename?: 'ExtensionPinnedResource', post?: { __typename?: 'Post', id: string } | null }> }> };

export const SpaceFragment = gql`
    fragment SpaceFragment on Space {
  canEveryoneCreatePosts
  canFollowerCreatePosts
  content
  createdAtBlock
  createdAtTime
  createdByAccount {
    id
  }
  email
  name
  summary
  isShowMore
  linksOriginal
  hidden
  id
  updatedAtTime
  postsCount
  image
  tagsOriginal
  about
  ownedByAccount {
    id
  }
}
    `;
export const PostFragment = gql`
    fragment PostFragment on Post {
  content
  createdAtBlock
  createdAtTime
  createdByAccount {
    id
  }
  title
  body
  summary
  isShowMore
  image
  link
  downvotesCount
  hidden
  id
  isComment
  kind
  repliesCount
  sharesCount
  upvotesCount
  updatedAtTime
  inReplyToKind
  followersCount
  inReplyToPost {
    id
  }
  canonical
  tagsOriginal
  ownedByAccount {
    id
  }
  space {
    id
  }
  rootPost {
    id
    space {
      id
    }
  }
  sharedPost {
    id
  }
  extensions {
    image
    amount
    chain
    collectionId
    decimals
    extensionSchemaId
    id
    nftId
    token
    txHash
    message
    recipient {
      id
    }
    nonce
    url
    fromEvm {
      id
    }
    toEvm {
      id
    }
    pinnedResources {
      post {
        id
      }
    }
  }
}
    `;
export const GetEvmAddresses = gql`
    query getEvmAddresses($addresses: [String!]) {
  evmSubstrateAccountLinks(
    where: {substrateAccount: {id_in: $addresses}, active_eq: true}
  ) {
    evmAccount {
      id
    }
    substrateAccount {
      id
    }
  }
}
    `;
export const GetPosts = gql`
    query GetPosts($ids: [String!]) {
  posts(where: {id_in: $ids}) {
    ...PostFragment
  }
}
    ${PostFragment}`;
export const GetPostsByContent = gql`
    query GetPostsByContent($search: String!, $spaceIds: [String!]!, $postIds: [String!]!) {
  posts(
    where: {AND: [{hidden_eq: false, isComment_eq: false}, {title_containsInsensitive: $search, OR: {body_containsInsensitive: $search}}, {space: {id_in: $spaceIds}, OR: {id_in: $postIds}}]}
  ) {
    ...PostFragment
  }
}
    ${PostFragment}`;
export const GetOwnedPostIds = gql`
    query GetOwnedPostIds($address: String!) {
  posts(where: {ownedByAccount: {id_eq: $address}, isComment_eq: false}) {
    id
  }
}
    `;
export const GetProfiles = gql`
    query GetProfiles($addresses: [String!]) {
  accounts(where: {id_in: $addresses}) {
    id
    profileSpace {
      id
      name
      image
    }
  }
}
    `;
export const GetSpaces = gql`
    query getSpaces($ids: [String!]) {
  spaces(where: {id_in: $ids, hidden_eq: false}) {
    ...SpaceFragment
  }
}
    ${SpaceFragment}`;