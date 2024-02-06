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
  FollowerAccountFollowersCountAscNullsFirst = 'followerAccount_followersCount_ASC_NULLS_FIRST',
  FollowerAccountFollowersCountDesc = 'followerAccount_followersCount_DESC',
  FollowerAccountFollowersCountDescNullsLast = 'followerAccount_followersCount_DESC_NULLS_LAST',
  FollowerAccountFollowingAccountsCountAsc = 'followerAccount_followingAccountsCount_ASC',
  FollowerAccountFollowingAccountsCountAscNullsFirst = 'followerAccount_followingAccountsCount_ASC_NULLS_FIRST',
  FollowerAccountFollowingAccountsCountDesc = 'followerAccount_followingAccountsCount_DESC',
  FollowerAccountFollowingAccountsCountDescNullsLast = 'followerAccount_followingAccountsCount_DESC_NULLS_LAST',
  FollowerAccountFollowingPostsCountAsc = 'followerAccount_followingPostsCount_ASC',
  FollowerAccountFollowingPostsCountAscNullsFirst = 'followerAccount_followingPostsCount_ASC_NULLS_FIRST',
  FollowerAccountFollowingPostsCountDesc = 'followerAccount_followingPostsCount_DESC',
  FollowerAccountFollowingPostsCountDescNullsLast = 'followerAccount_followingPostsCount_DESC_NULLS_LAST',
  FollowerAccountFollowingSpacesCountAsc = 'followerAccount_followingSpacesCount_ASC',
  FollowerAccountFollowingSpacesCountAscNullsFirst = 'followerAccount_followingSpacesCount_ASC_NULLS_FIRST',
  FollowerAccountFollowingSpacesCountDesc = 'followerAccount_followingSpacesCount_DESC',
  FollowerAccountFollowingSpacesCountDescNullsLast = 'followerAccount_followingSpacesCount_DESC_NULLS_LAST',
  FollowerAccountIdAsc = 'followerAccount_id_ASC',
  FollowerAccountIdAscNullsFirst = 'followerAccount_id_ASC_NULLS_FIRST',
  FollowerAccountIdDesc = 'followerAccount_id_DESC',
  FollowerAccountIdDescNullsLast = 'followerAccount_id_DESC_NULLS_LAST',
  FollowerAccountOwnedPostsCountAsc = 'followerAccount_ownedPostsCount_ASC',
  FollowerAccountOwnedPostsCountAscNullsFirst = 'followerAccount_ownedPostsCount_ASC_NULLS_FIRST',
  FollowerAccountOwnedPostsCountDesc = 'followerAccount_ownedPostsCount_DESC',
  FollowerAccountOwnedPostsCountDescNullsLast = 'followerAccount_ownedPostsCount_DESC_NULLS_LAST',
  FollowerAccountUpdatedAtBlockAsc = 'followerAccount_updatedAtBlock_ASC',
  FollowerAccountUpdatedAtBlockAscNullsFirst = 'followerAccount_updatedAtBlock_ASC_NULLS_FIRST',
  FollowerAccountUpdatedAtBlockDesc = 'followerAccount_updatedAtBlock_DESC',
  FollowerAccountUpdatedAtBlockDescNullsLast = 'followerAccount_updatedAtBlock_DESC_NULLS_LAST',
  FollowerAccountUpdatedAtTimeAsc = 'followerAccount_updatedAtTime_ASC',
  FollowerAccountUpdatedAtTimeAscNullsFirst = 'followerAccount_updatedAtTime_ASC_NULLS_FIRST',
  FollowerAccountUpdatedAtTimeDesc = 'followerAccount_updatedAtTime_DESC',
  FollowerAccountUpdatedAtTimeDescNullsLast = 'followerAccount_updatedAtTime_DESC_NULLS_LAST',
  FollowingAccountFollowersCountAsc = 'followingAccount_followersCount_ASC',
  FollowingAccountFollowersCountAscNullsFirst = 'followingAccount_followersCount_ASC_NULLS_FIRST',
  FollowingAccountFollowersCountDesc = 'followingAccount_followersCount_DESC',
  FollowingAccountFollowersCountDescNullsLast = 'followingAccount_followersCount_DESC_NULLS_LAST',
  FollowingAccountFollowingAccountsCountAsc = 'followingAccount_followingAccountsCount_ASC',
  FollowingAccountFollowingAccountsCountAscNullsFirst = 'followingAccount_followingAccountsCount_ASC_NULLS_FIRST',
  FollowingAccountFollowingAccountsCountDesc = 'followingAccount_followingAccountsCount_DESC',
  FollowingAccountFollowingAccountsCountDescNullsLast = 'followingAccount_followingAccountsCount_DESC_NULLS_LAST',
  FollowingAccountFollowingPostsCountAsc = 'followingAccount_followingPostsCount_ASC',
  FollowingAccountFollowingPostsCountAscNullsFirst = 'followingAccount_followingPostsCount_ASC_NULLS_FIRST',
  FollowingAccountFollowingPostsCountDesc = 'followingAccount_followingPostsCount_DESC',
  FollowingAccountFollowingPostsCountDescNullsLast = 'followingAccount_followingPostsCount_DESC_NULLS_LAST',
  FollowingAccountFollowingSpacesCountAsc = 'followingAccount_followingSpacesCount_ASC',
  FollowingAccountFollowingSpacesCountAscNullsFirst = 'followingAccount_followingSpacesCount_ASC_NULLS_FIRST',
  FollowingAccountFollowingSpacesCountDesc = 'followingAccount_followingSpacesCount_DESC',
  FollowingAccountFollowingSpacesCountDescNullsLast = 'followingAccount_followingSpacesCount_DESC_NULLS_LAST',
  FollowingAccountIdAsc = 'followingAccount_id_ASC',
  FollowingAccountIdAscNullsFirst = 'followingAccount_id_ASC_NULLS_FIRST',
  FollowingAccountIdDesc = 'followingAccount_id_DESC',
  FollowingAccountIdDescNullsLast = 'followingAccount_id_DESC_NULLS_LAST',
  FollowingAccountOwnedPostsCountAsc = 'followingAccount_ownedPostsCount_ASC',
  FollowingAccountOwnedPostsCountAscNullsFirst = 'followingAccount_ownedPostsCount_ASC_NULLS_FIRST',
  FollowingAccountOwnedPostsCountDesc = 'followingAccount_ownedPostsCount_DESC',
  FollowingAccountOwnedPostsCountDescNullsLast = 'followingAccount_ownedPostsCount_DESC_NULLS_LAST',
  FollowingAccountUpdatedAtBlockAsc = 'followingAccount_updatedAtBlock_ASC',
  FollowingAccountUpdatedAtBlockAscNullsFirst = 'followingAccount_updatedAtBlock_ASC_NULLS_FIRST',
  FollowingAccountUpdatedAtBlockDesc = 'followingAccount_updatedAtBlock_DESC',
  FollowingAccountUpdatedAtBlockDescNullsLast = 'followingAccount_updatedAtBlock_DESC_NULLS_LAST',
  FollowingAccountUpdatedAtTimeAsc = 'followingAccount_updatedAtTime_ASC',
  FollowingAccountUpdatedAtTimeAscNullsFirst = 'followingAccount_updatedAtTime_ASC_NULLS_FIRST',
  FollowingAccountUpdatedAtTimeDesc = 'followingAccount_updatedAtTime_DESC',
  FollowingAccountUpdatedAtTimeDescNullsLast = 'followingAccount_updatedAtTime_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST'
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
  FollowersCountAscNullsFirst = 'followersCount_ASC_NULLS_FIRST',
  FollowersCountDesc = 'followersCount_DESC',
  FollowersCountDescNullsLast = 'followersCount_DESC_NULLS_LAST',
  FollowingAccountsCountAsc = 'followingAccountsCount_ASC',
  FollowingAccountsCountAscNullsFirst = 'followingAccountsCount_ASC_NULLS_FIRST',
  FollowingAccountsCountDesc = 'followingAccountsCount_DESC',
  FollowingAccountsCountDescNullsLast = 'followingAccountsCount_DESC_NULLS_LAST',
  FollowingPostsCountAsc = 'followingPostsCount_ASC',
  FollowingPostsCountAscNullsFirst = 'followingPostsCount_ASC_NULLS_FIRST',
  FollowingPostsCountDesc = 'followingPostsCount_DESC',
  FollowingPostsCountDescNullsLast = 'followingPostsCount_DESC_NULLS_LAST',
  FollowingSpacesCountAsc = 'followingSpacesCount_ASC',
  FollowingSpacesCountAscNullsFirst = 'followingSpacesCount_ASC_NULLS_FIRST',
  FollowingSpacesCountDesc = 'followingSpacesCount_DESC',
  FollowingSpacesCountDescNullsLast = 'followingSpacesCount_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  OwnedPostsCountAsc = 'ownedPostsCount_ASC',
  OwnedPostsCountAscNullsFirst = 'ownedPostsCount_ASC_NULLS_FIRST',
  OwnedPostsCountDesc = 'ownedPostsCount_DESC',
  OwnedPostsCountDescNullsLast = 'ownedPostsCount_DESC_NULLS_LAST',
  ProfileSpaceAboutAsc = 'profileSpace_about_ASC',
  ProfileSpaceAboutAscNullsFirst = 'profileSpace_about_ASC_NULLS_FIRST',
  ProfileSpaceAboutDesc = 'profileSpace_about_DESC',
  ProfileSpaceAboutDescNullsLast = 'profileSpace_about_DESC_NULLS_LAST',
  ProfileSpaceCanEveryoneCreatePostsAsc = 'profileSpace_canEveryoneCreatePosts_ASC',
  ProfileSpaceCanEveryoneCreatePostsAscNullsFirst = 'profileSpace_canEveryoneCreatePosts_ASC_NULLS_FIRST',
  ProfileSpaceCanEveryoneCreatePostsDesc = 'profileSpace_canEveryoneCreatePosts_DESC',
  ProfileSpaceCanEveryoneCreatePostsDescNullsLast = 'profileSpace_canEveryoneCreatePosts_DESC_NULLS_LAST',
  ProfileSpaceCanFollowerCreatePostsAsc = 'profileSpace_canFollowerCreatePosts_ASC',
  ProfileSpaceCanFollowerCreatePostsAscNullsFirst = 'profileSpace_canFollowerCreatePosts_ASC_NULLS_FIRST',
  ProfileSpaceCanFollowerCreatePostsDesc = 'profileSpace_canFollowerCreatePosts_DESC',
  ProfileSpaceCanFollowerCreatePostsDescNullsLast = 'profileSpace_canFollowerCreatePosts_DESC_NULLS_LAST',
  ProfileSpaceContentAsc = 'profileSpace_content_ASC',
  ProfileSpaceContentAscNullsFirst = 'profileSpace_content_ASC_NULLS_FIRST',
  ProfileSpaceContentDesc = 'profileSpace_content_DESC',
  ProfileSpaceContentDescNullsLast = 'profileSpace_content_DESC_NULLS_LAST',
  ProfileSpaceCreatedAtBlockAsc = 'profileSpace_createdAtBlock_ASC',
  ProfileSpaceCreatedAtBlockAscNullsFirst = 'profileSpace_createdAtBlock_ASC_NULLS_FIRST',
  ProfileSpaceCreatedAtBlockDesc = 'profileSpace_createdAtBlock_DESC',
  ProfileSpaceCreatedAtBlockDescNullsLast = 'profileSpace_createdAtBlock_DESC_NULLS_LAST',
  ProfileSpaceCreatedAtTimeAsc = 'profileSpace_createdAtTime_ASC',
  ProfileSpaceCreatedAtTimeAscNullsFirst = 'profileSpace_createdAtTime_ASC_NULLS_FIRST',
  ProfileSpaceCreatedAtTimeDesc = 'profileSpace_createdAtTime_DESC',
  ProfileSpaceCreatedAtTimeDescNullsLast = 'profileSpace_createdAtTime_DESC_NULLS_LAST',
  ProfileSpaceCreatedOnDayAsc = 'profileSpace_createdOnDay_ASC',
  ProfileSpaceCreatedOnDayAscNullsFirst = 'profileSpace_createdOnDay_ASC_NULLS_FIRST',
  ProfileSpaceCreatedOnDayDesc = 'profileSpace_createdOnDay_DESC',
  ProfileSpaceCreatedOnDayDescNullsLast = 'profileSpace_createdOnDay_DESC_NULLS_LAST',
  ProfileSpaceEmailAsc = 'profileSpace_email_ASC',
  ProfileSpaceEmailAscNullsFirst = 'profileSpace_email_ASC_NULLS_FIRST',
  ProfileSpaceEmailDesc = 'profileSpace_email_DESC',
  ProfileSpaceEmailDescNullsLast = 'profileSpace_email_DESC_NULLS_LAST',
  ProfileSpaceFollowersCountAsc = 'profileSpace_followersCount_ASC',
  ProfileSpaceFollowersCountAscNullsFirst = 'profileSpace_followersCount_ASC_NULLS_FIRST',
  ProfileSpaceFollowersCountDesc = 'profileSpace_followersCount_DESC',
  ProfileSpaceFollowersCountDescNullsLast = 'profileSpace_followersCount_DESC_NULLS_LAST',
  ProfileSpaceFormatAsc = 'profileSpace_format_ASC',
  ProfileSpaceFormatAscNullsFirst = 'profileSpace_format_ASC_NULLS_FIRST',
  ProfileSpaceFormatDesc = 'profileSpace_format_DESC',
  ProfileSpaceFormatDescNullsLast = 'profileSpace_format_DESC_NULLS_LAST',
  ProfileSpaceHandleAsc = 'profileSpace_handle_ASC',
  ProfileSpaceHandleAscNullsFirst = 'profileSpace_handle_ASC_NULLS_FIRST',
  ProfileSpaceHandleDesc = 'profileSpace_handle_DESC',
  ProfileSpaceHandleDescNullsLast = 'profileSpace_handle_DESC_NULLS_LAST',
  ProfileSpaceHiddenPostsCountAsc = 'profileSpace_hiddenPostsCount_ASC',
  ProfileSpaceHiddenPostsCountAscNullsFirst = 'profileSpace_hiddenPostsCount_ASC_NULLS_FIRST',
  ProfileSpaceHiddenPostsCountDesc = 'profileSpace_hiddenPostsCount_DESC',
  ProfileSpaceHiddenPostsCountDescNullsLast = 'profileSpace_hiddenPostsCount_DESC_NULLS_LAST',
  ProfileSpaceHiddenAsc = 'profileSpace_hidden_ASC',
  ProfileSpaceHiddenAscNullsFirst = 'profileSpace_hidden_ASC_NULLS_FIRST',
  ProfileSpaceHiddenDesc = 'profileSpace_hidden_DESC',
  ProfileSpaceHiddenDescNullsLast = 'profileSpace_hidden_DESC_NULLS_LAST',
  ProfileSpaceIdAsc = 'profileSpace_id_ASC',
  ProfileSpaceIdAscNullsFirst = 'profileSpace_id_ASC_NULLS_FIRST',
  ProfileSpaceIdDesc = 'profileSpace_id_DESC',
  ProfileSpaceIdDescNullsLast = 'profileSpace_id_DESC_NULLS_LAST',
  ProfileSpaceImageAsc = 'profileSpace_image_ASC',
  ProfileSpaceImageAscNullsFirst = 'profileSpace_image_ASC_NULLS_FIRST',
  ProfileSpaceImageDesc = 'profileSpace_image_DESC',
  ProfileSpaceImageDescNullsLast = 'profileSpace_image_DESC_NULLS_LAST',
  ProfileSpaceInterestsOriginalAsc = 'profileSpace_interestsOriginal_ASC',
  ProfileSpaceInterestsOriginalAscNullsFirst = 'profileSpace_interestsOriginal_ASC_NULLS_FIRST',
  ProfileSpaceInterestsOriginalDesc = 'profileSpace_interestsOriginal_DESC',
  ProfileSpaceInterestsOriginalDescNullsLast = 'profileSpace_interestsOriginal_DESC_NULLS_LAST',
  ProfileSpaceIsShowMoreAsc = 'profileSpace_isShowMore_ASC',
  ProfileSpaceIsShowMoreAscNullsFirst = 'profileSpace_isShowMore_ASC_NULLS_FIRST',
  ProfileSpaceIsShowMoreDesc = 'profileSpace_isShowMore_DESC',
  ProfileSpaceIsShowMoreDescNullsLast = 'profileSpace_isShowMore_DESC_NULLS_LAST',
  ProfileSpaceLinksOriginalAsc = 'profileSpace_linksOriginal_ASC',
  ProfileSpaceLinksOriginalAscNullsFirst = 'profileSpace_linksOriginal_ASC_NULLS_FIRST',
  ProfileSpaceLinksOriginalDesc = 'profileSpace_linksOriginal_DESC',
  ProfileSpaceLinksOriginalDescNullsLast = 'profileSpace_linksOriginal_DESC_NULLS_LAST',
  ProfileSpaceNameAsc = 'profileSpace_name_ASC',
  ProfileSpaceNameAscNullsFirst = 'profileSpace_name_ASC_NULLS_FIRST',
  ProfileSpaceNameDesc = 'profileSpace_name_DESC',
  ProfileSpaceNameDescNullsLast = 'profileSpace_name_DESC_NULLS_LAST',
  ProfileSpacePostsCountAsc = 'profileSpace_postsCount_ASC',
  ProfileSpacePostsCountAscNullsFirst = 'profileSpace_postsCount_ASC_NULLS_FIRST',
  ProfileSpacePostsCountDesc = 'profileSpace_postsCount_DESC',
  ProfileSpacePostsCountDescNullsLast = 'profileSpace_postsCount_DESC_NULLS_LAST',
  ProfileSpaceProfileSourceAsc = 'profileSpace_profileSource_ASC',
  ProfileSpaceProfileSourceAscNullsFirst = 'profileSpace_profileSource_ASC_NULLS_FIRST',
  ProfileSpaceProfileSourceDesc = 'profileSpace_profileSource_DESC',
  ProfileSpaceProfileSourceDescNullsLast = 'profileSpace_profileSource_DESC_NULLS_LAST',
  ProfileSpacePublicPostsCountAsc = 'profileSpace_publicPostsCount_ASC',
  ProfileSpacePublicPostsCountAscNullsFirst = 'profileSpace_publicPostsCount_ASC_NULLS_FIRST',
  ProfileSpacePublicPostsCountDesc = 'profileSpace_publicPostsCount_DESC',
  ProfileSpacePublicPostsCountDescNullsLast = 'profileSpace_publicPostsCount_DESC_NULLS_LAST',
  ProfileSpaceSummaryAsc = 'profileSpace_summary_ASC',
  ProfileSpaceSummaryAscNullsFirst = 'profileSpace_summary_ASC_NULLS_FIRST',
  ProfileSpaceSummaryDesc = 'profileSpace_summary_DESC',
  ProfileSpaceSummaryDescNullsLast = 'profileSpace_summary_DESC_NULLS_LAST',
  ProfileSpaceTagsOriginalAsc = 'profileSpace_tagsOriginal_ASC',
  ProfileSpaceTagsOriginalAscNullsFirst = 'profileSpace_tagsOriginal_ASC_NULLS_FIRST',
  ProfileSpaceTagsOriginalDesc = 'profileSpace_tagsOriginal_DESC',
  ProfileSpaceTagsOriginalDescNullsLast = 'profileSpace_tagsOriginal_DESC_NULLS_LAST',
  ProfileSpaceUpdatedAtBlockAsc = 'profileSpace_updatedAtBlock_ASC',
  ProfileSpaceUpdatedAtBlockAscNullsFirst = 'profileSpace_updatedAtBlock_ASC_NULLS_FIRST',
  ProfileSpaceUpdatedAtBlockDesc = 'profileSpace_updatedAtBlock_DESC',
  ProfileSpaceUpdatedAtBlockDescNullsLast = 'profileSpace_updatedAtBlock_DESC_NULLS_LAST',
  ProfileSpaceUpdatedAtTimeAsc = 'profileSpace_updatedAtTime_ASC',
  ProfileSpaceUpdatedAtTimeAscNullsFirst = 'profileSpace_updatedAtTime_ASC_NULLS_FIRST',
  ProfileSpaceUpdatedAtTimeDesc = 'profileSpace_updatedAtTime_DESC',
  ProfileSpaceUpdatedAtTimeDescNullsLast = 'profileSpace_updatedAtTime_DESC_NULLS_LAST',
  ProfileSpaceUsernameAsc = 'profileSpace_username_ASC',
  ProfileSpaceUsernameAscNullsFirst = 'profileSpace_username_ASC_NULLS_FIRST',
  ProfileSpaceUsernameDesc = 'profileSpace_username_DESC',
  ProfileSpaceUsernameDescNullsLast = 'profileSpace_username_DESC_NULLS_LAST',
  UpdatedAtBlockAsc = 'updatedAtBlock_ASC',
  UpdatedAtBlockAscNullsFirst = 'updatedAtBlock_ASC_NULLS_FIRST',
  UpdatedAtBlockDesc = 'updatedAtBlock_DESC',
  UpdatedAtBlockDescNullsLast = 'updatedAtBlock_DESC_NULLS_LAST',
  UpdatedAtTimeAsc = 'updatedAtTime_ASC',
  UpdatedAtTimeAscNullsFirst = 'updatedAtTime_ASC_NULLS_FIRST',
  UpdatedAtTimeDesc = 'updatedAtTime_DESC',
  UpdatedAtTimeDescNullsLast = 'updatedAtTime_DESC_NULLS_LAST'
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
  AccountFollowersCountAscNullsFirst = 'account_followersCount_ASC_NULLS_FIRST',
  AccountFollowersCountDesc = 'account_followersCount_DESC',
  AccountFollowersCountDescNullsLast = 'account_followersCount_DESC_NULLS_LAST',
  AccountFollowingAccountsCountAsc = 'account_followingAccountsCount_ASC',
  AccountFollowingAccountsCountAscNullsFirst = 'account_followingAccountsCount_ASC_NULLS_FIRST',
  AccountFollowingAccountsCountDesc = 'account_followingAccountsCount_DESC',
  AccountFollowingAccountsCountDescNullsLast = 'account_followingAccountsCount_DESC_NULLS_LAST',
  AccountFollowingPostsCountAsc = 'account_followingPostsCount_ASC',
  AccountFollowingPostsCountAscNullsFirst = 'account_followingPostsCount_ASC_NULLS_FIRST',
  AccountFollowingPostsCountDesc = 'account_followingPostsCount_DESC',
  AccountFollowingPostsCountDescNullsLast = 'account_followingPostsCount_DESC_NULLS_LAST',
  AccountFollowingSpacesCountAsc = 'account_followingSpacesCount_ASC',
  AccountFollowingSpacesCountAscNullsFirst = 'account_followingSpacesCount_ASC_NULLS_FIRST',
  AccountFollowingSpacesCountDesc = 'account_followingSpacesCount_DESC',
  AccountFollowingSpacesCountDescNullsLast = 'account_followingSpacesCount_DESC_NULLS_LAST',
  AccountIdAsc = 'account_id_ASC',
  AccountIdAscNullsFirst = 'account_id_ASC_NULLS_FIRST',
  AccountIdDesc = 'account_id_DESC',
  AccountIdDescNullsLast = 'account_id_DESC_NULLS_LAST',
  AccountOwnedPostsCountAsc = 'account_ownedPostsCount_ASC',
  AccountOwnedPostsCountAscNullsFirst = 'account_ownedPostsCount_ASC_NULLS_FIRST',
  AccountOwnedPostsCountDesc = 'account_ownedPostsCount_DESC',
  AccountOwnedPostsCountDescNullsLast = 'account_ownedPostsCount_DESC_NULLS_LAST',
  AccountUpdatedAtBlockAsc = 'account_updatedAtBlock_ASC',
  AccountUpdatedAtBlockAscNullsFirst = 'account_updatedAtBlock_ASC_NULLS_FIRST',
  AccountUpdatedAtBlockDesc = 'account_updatedAtBlock_DESC',
  AccountUpdatedAtBlockDescNullsLast = 'account_updatedAtBlock_DESC_NULLS_LAST',
  AccountUpdatedAtTimeAsc = 'account_updatedAtTime_ASC',
  AccountUpdatedAtTimeAscNullsFirst = 'account_updatedAtTime_ASC_NULLS_FIRST',
  AccountUpdatedAtTimeDesc = 'account_updatedAtTime_DESC',
  AccountUpdatedAtTimeDescNullsLast = 'account_updatedAtTime_DESC_NULLS_LAST',
  AggCountAsc = 'aggCount_ASC',
  AggCountAscNullsFirst = 'aggCount_ASC_NULLS_FIRST',
  AggCountDesc = 'aggCount_DESC',
  AggCountDescNullsLast = 'aggCount_DESC_NULLS_LAST',
  AggregatedAsc = 'aggregated_ASC',
  AggregatedAscNullsFirst = 'aggregated_ASC_NULLS_FIRST',
  AggregatedDesc = 'aggregated_DESC',
  AggregatedDescNullsLast = 'aggregated_DESC_NULLS_LAST',
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  DateAsc = 'date_ASC',
  DateAscNullsFirst = 'date_ASC_NULLS_FIRST',
  DateDesc = 'date_DESC',
  DateDescNullsLast = 'date_DESC_NULLS_LAST',
  DomainRecipientFollowersCountAsc = 'domainRecipient_followersCount_ASC',
  DomainRecipientFollowersCountAscNullsFirst = 'domainRecipient_followersCount_ASC_NULLS_FIRST',
  DomainRecipientFollowersCountDesc = 'domainRecipient_followersCount_DESC',
  DomainRecipientFollowersCountDescNullsLast = 'domainRecipient_followersCount_DESC_NULLS_LAST',
  DomainRecipientFollowingAccountsCountAsc = 'domainRecipient_followingAccountsCount_ASC',
  DomainRecipientFollowingAccountsCountAscNullsFirst = 'domainRecipient_followingAccountsCount_ASC_NULLS_FIRST',
  DomainRecipientFollowingAccountsCountDesc = 'domainRecipient_followingAccountsCount_DESC',
  DomainRecipientFollowingAccountsCountDescNullsLast = 'domainRecipient_followingAccountsCount_DESC_NULLS_LAST',
  DomainRecipientFollowingPostsCountAsc = 'domainRecipient_followingPostsCount_ASC',
  DomainRecipientFollowingPostsCountAscNullsFirst = 'domainRecipient_followingPostsCount_ASC_NULLS_FIRST',
  DomainRecipientFollowingPostsCountDesc = 'domainRecipient_followingPostsCount_DESC',
  DomainRecipientFollowingPostsCountDescNullsLast = 'domainRecipient_followingPostsCount_DESC_NULLS_LAST',
  DomainRecipientFollowingSpacesCountAsc = 'domainRecipient_followingSpacesCount_ASC',
  DomainRecipientFollowingSpacesCountAscNullsFirst = 'domainRecipient_followingSpacesCount_ASC_NULLS_FIRST',
  DomainRecipientFollowingSpacesCountDesc = 'domainRecipient_followingSpacesCount_DESC',
  DomainRecipientFollowingSpacesCountDescNullsLast = 'domainRecipient_followingSpacesCount_DESC_NULLS_LAST',
  DomainRecipientIdAsc = 'domainRecipient_id_ASC',
  DomainRecipientIdAscNullsFirst = 'domainRecipient_id_ASC_NULLS_FIRST',
  DomainRecipientIdDesc = 'domainRecipient_id_DESC',
  DomainRecipientIdDescNullsLast = 'domainRecipient_id_DESC_NULLS_LAST',
  DomainRecipientOwnedPostsCountAsc = 'domainRecipient_ownedPostsCount_ASC',
  DomainRecipientOwnedPostsCountAscNullsFirst = 'domainRecipient_ownedPostsCount_ASC_NULLS_FIRST',
  DomainRecipientOwnedPostsCountDesc = 'domainRecipient_ownedPostsCount_DESC',
  DomainRecipientOwnedPostsCountDescNullsLast = 'domainRecipient_ownedPostsCount_DESC_NULLS_LAST',
  DomainRecipientUpdatedAtBlockAsc = 'domainRecipient_updatedAtBlock_ASC',
  DomainRecipientUpdatedAtBlockAscNullsFirst = 'domainRecipient_updatedAtBlock_ASC_NULLS_FIRST',
  DomainRecipientUpdatedAtBlockDesc = 'domainRecipient_updatedAtBlock_DESC',
  DomainRecipientUpdatedAtBlockDescNullsLast = 'domainRecipient_updatedAtBlock_DESC_NULLS_LAST',
  DomainRecipientUpdatedAtTimeAsc = 'domainRecipient_updatedAtTime_ASC',
  DomainRecipientUpdatedAtTimeAscNullsFirst = 'domainRecipient_updatedAtTime_ASC_NULLS_FIRST',
  DomainRecipientUpdatedAtTimeDesc = 'domainRecipient_updatedAtTime_DESC',
  DomainRecipientUpdatedAtTimeDescNullsLast = 'domainRecipient_updatedAtTime_DESC_NULLS_LAST',
  EventIndexAsc = 'eventIndex_ASC',
  EventIndexAscNullsFirst = 'eventIndex_ASC_NULLS_FIRST',
  EventIndexDesc = 'eventIndex_DESC',
  EventIndexDescNullsLast = 'eventIndex_DESC_NULLS_LAST',
  EventAsc = 'event_ASC',
  EventAscNullsFirst = 'event_ASC_NULLS_FIRST',
  EventDesc = 'event_DESC',
  EventDescNullsLast = 'event_DESC_NULLS_LAST',
  ExtensionAmountAsc = 'extension_amount_ASC',
  ExtensionAmountAscNullsFirst = 'extension_amount_ASC_NULLS_FIRST',
  ExtensionAmountDesc = 'extension_amount_DESC',
  ExtensionAmountDescNullsLast = 'extension_amount_DESC_NULLS_LAST',
  ExtensionChainAsc = 'extension_chain_ASC',
  ExtensionChainAscNullsFirst = 'extension_chain_ASC_NULLS_FIRST',
  ExtensionChainDesc = 'extension_chain_DESC',
  ExtensionChainDescNullsLast = 'extension_chain_DESC_NULLS_LAST',
  ExtensionCollectionIdAsc = 'extension_collectionId_ASC',
  ExtensionCollectionIdAscNullsFirst = 'extension_collectionId_ASC_NULLS_FIRST',
  ExtensionCollectionIdDesc = 'extension_collectionId_DESC',
  ExtensionCollectionIdDescNullsLast = 'extension_collectionId_DESC_NULLS_LAST',
  ExtensionDecimalsAsc = 'extension_decimals_ASC',
  ExtensionDecimalsAscNullsFirst = 'extension_decimals_ASC_NULLS_FIRST',
  ExtensionDecimalsDesc = 'extension_decimals_DESC',
  ExtensionDecimalsDescNullsLast = 'extension_decimals_DESC_NULLS_LAST',
  ExtensionExtensionSchemaIdAsc = 'extension_extensionSchemaId_ASC',
  ExtensionExtensionSchemaIdAscNullsFirst = 'extension_extensionSchemaId_ASC_NULLS_FIRST',
  ExtensionExtensionSchemaIdDesc = 'extension_extensionSchemaId_DESC',
  ExtensionExtensionSchemaIdDescNullsLast = 'extension_extensionSchemaId_DESC_NULLS_LAST',
  ExtensionIdAsc = 'extension_id_ASC',
  ExtensionIdAscNullsFirst = 'extension_id_ASC_NULLS_FIRST',
  ExtensionIdDesc = 'extension_id_DESC',
  ExtensionIdDescNullsLast = 'extension_id_DESC_NULLS_LAST',
  ExtensionImageAsc = 'extension_image_ASC',
  ExtensionImageAscNullsFirst = 'extension_image_ASC_NULLS_FIRST',
  ExtensionImageDesc = 'extension_image_DESC',
  ExtensionImageDescNullsLast = 'extension_image_DESC_NULLS_LAST',
  ExtensionMessageAsc = 'extension_message_ASC',
  ExtensionMessageAscNullsFirst = 'extension_message_ASC_NULLS_FIRST',
  ExtensionMessageDesc = 'extension_message_DESC',
  ExtensionMessageDescNullsLast = 'extension_message_DESC_NULLS_LAST',
  ExtensionNftIdAsc = 'extension_nftId_ASC',
  ExtensionNftIdAscNullsFirst = 'extension_nftId_ASC_NULLS_FIRST',
  ExtensionNftIdDesc = 'extension_nftId_DESC',
  ExtensionNftIdDescNullsLast = 'extension_nftId_DESC_NULLS_LAST',
  ExtensionNonceAsc = 'extension_nonce_ASC',
  ExtensionNonceAscNullsFirst = 'extension_nonce_ASC_NULLS_FIRST',
  ExtensionNonceDesc = 'extension_nonce_DESC',
  ExtensionNonceDescNullsLast = 'extension_nonce_DESC_NULLS_LAST',
  ExtensionTokenAsc = 'extension_token_ASC',
  ExtensionTokenAscNullsFirst = 'extension_token_ASC_NULLS_FIRST',
  ExtensionTokenDesc = 'extension_token_DESC',
  ExtensionTokenDescNullsLast = 'extension_token_DESC_NULLS_LAST',
  ExtensionTxHashAsc = 'extension_txHash_ASC',
  ExtensionTxHashAscNullsFirst = 'extension_txHash_ASC_NULLS_FIRST',
  ExtensionTxHashDesc = 'extension_txHash_DESC',
  ExtensionTxHashDescNullsLast = 'extension_txHash_DESC_NULLS_LAST',
  ExtensionUrlAsc = 'extension_url_ASC',
  ExtensionUrlAscNullsFirst = 'extension_url_ASC_NULLS_FIRST',
  ExtensionUrlDesc = 'extension_url_DESC',
  ExtensionUrlDescNullsLast = 'extension_url_DESC_NULLS_LAST',
  FollowingAccountFollowersCountAsc = 'followingAccount_followersCount_ASC',
  FollowingAccountFollowersCountAscNullsFirst = 'followingAccount_followersCount_ASC_NULLS_FIRST',
  FollowingAccountFollowersCountDesc = 'followingAccount_followersCount_DESC',
  FollowingAccountFollowersCountDescNullsLast = 'followingAccount_followersCount_DESC_NULLS_LAST',
  FollowingAccountFollowingAccountsCountAsc = 'followingAccount_followingAccountsCount_ASC',
  FollowingAccountFollowingAccountsCountAscNullsFirst = 'followingAccount_followingAccountsCount_ASC_NULLS_FIRST',
  FollowingAccountFollowingAccountsCountDesc = 'followingAccount_followingAccountsCount_DESC',
  FollowingAccountFollowingAccountsCountDescNullsLast = 'followingAccount_followingAccountsCount_DESC_NULLS_LAST',
  FollowingAccountFollowingPostsCountAsc = 'followingAccount_followingPostsCount_ASC',
  FollowingAccountFollowingPostsCountAscNullsFirst = 'followingAccount_followingPostsCount_ASC_NULLS_FIRST',
  FollowingAccountFollowingPostsCountDesc = 'followingAccount_followingPostsCount_DESC',
  FollowingAccountFollowingPostsCountDescNullsLast = 'followingAccount_followingPostsCount_DESC_NULLS_LAST',
  FollowingAccountFollowingSpacesCountAsc = 'followingAccount_followingSpacesCount_ASC',
  FollowingAccountFollowingSpacesCountAscNullsFirst = 'followingAccount_followingSpacesCount_ASC_NULLS_FIRST',
  FollowingAccountFollowingSpacesCountDesc = 'followingAccount_followingSpacesCount_DESC',
  FollowingAccountFollowingSpacesCountDescNullsLast = 'followingAccount_followingSpacesCount_DESC_NULLS_LAST',
  FollowingAccountIdAsc = 'followingAccount_id_ASC',
  FollowingAccountIdAscNullsFirst = 'followingAccount_id_ASC_NULLS_FIRST',
  FollowingAccountIdDesc = 'followingAccount_id_DESC',
  FollowingAccountIdDescNullsLast = 'followingAccount_id_DESC_NULLS_LAST',
  FollowingAccountOwnedPostsCountAsc = 'followingAccount_ownedPostsCount_ASC',
  FollowingAccountOwnedPostsCountAscNullsFirst = 'followingAccount_ownedPostsCount_ASC_NULLS_FIRST',
  FollowingAccountOwnedPostsCountDesc = 'followingAccount_ownedPostsCount_DESC',
  FollowingAccountOwnedPostsCountDescNullsLast = 'followingAccount_ownedPostsCount_DESC_NULLS_LAST',
  FollowingAccountUpdatedAtBlockAsc = 'followingAccount_updatedAtBlock_ASC',
  FollowingAccountUpdatedAtBlockAscNullsFirst = 'followingAccount_updatedAtBlock_ASC_NULLS_FIRST',
  FollowingAccountUpdatedAtBlockDesc = 'followingAccount_updatedAtBlock_DESC',
  FollowingAccountUpdatedAtBlockDescNullsLast = 'followingAccount_updatedAtBlock_DESC_NULLS_LAST',
  FollowingAccountUpdatedAtTimeAsc = 'followingAccount_updatedAtTime_ASC',
  FollowingAccountUpdatedAtTimeAscNullsFirst = 'followingAccount_updatedAtTime_ASC_NULLS_FIRST',
  FollowingAccountUpdatedAtTimeDesc = 'followingAccount_updatedAtTime_DESC',
  FollowingAccountUpdatedAtTimeDescNullsLast = 'followingAccount_updatedAtTime_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  NewOwnerFollowersCountAsc = 'newOwner_followersCount_ASC',
  NewOwnerFollowersCountAscNullsFirst = 'newOwner_followersCount_ASC_NULLS_FIRST',
  NewOwnerFollowersCountDesc = 'newOwner_followersCount_DESC',
  NewOwnerFollowersCountDescNullsLast = 'newOwner_followersCount_DESC_NULLS_LAST',
  NewOwnerFollowingAccountsCountAsc = 'newOwner_followingAccountsCount_ASC',
  NewOwnerFollowingAccountsCountAscNullsFirst = 'newOwner_followingAccountsCount_ASC_NULLS_FIRST',
  NewOwnerFollowingAccountsCountDesc = 'newOwner_followingAccountsCount_DESC',
  NewOwnerFollowingAccountsCountDescNullsLast = 'newOwner_followingAccountsCount_DESC_NULLS_LAST',
  NewOwnerFollowingPostsCountAsc = 'newOwner_followingPostsCount_ASC',
  NewOwnerFollowingPostsCountAscNullsFirst = 'newOwner_followingPostsCount_ASC_NULLS_FIRST',
  NewOwnerFollowingPostsCountDesc = 'newOwner_followingPostsCount_DESC',
  NewOwnerFollowingPostsCountDescNullsLast = 'newOwner_followingPostsCount_DESC_NULLS_LAST',
  NewOwnerFollowingSpacesCountAsc = 'newOwner_followingSpacesCount_ASC',
  NewOwnerFollowingSpacesCountAscNullsFirst = 'newOwner_followingSpacesCount_ASC_NULLS_FIRST',
  NewOwnerFollowingSpacesCountDesc = 'newOwner_followingSpacesCount_DESC',
  NewOwnerFollowingSpacesCountDescNullsLast = 'newOwner_followingSpacesCount_DESC_NULLS_LAST',
  NewOwnerIdAsc = 'newOwner_id_ASC',
  NewOwnerIdAscNullsFirst = 'newOwner_id_ASC_NULLS_FIRST',
  NewOwnerIdDesc = 'newOwner_id_DESC',
  NewOwnerIdDescNullsLast = 'newOwner_id_DESC_NULLS_LAST',
  NewOwnerOwnedPostsCountAsc = 'newOwner_ownedPostsCount_ASC',
  NewOwnerOwnedPostsCountAscNullsFirst = 'newOwner_ownedPostsCount_ASC_NULLS_FIRST',
  NewOwnerOwnedPostsCountDesc = 'newOwner_ownedPostsCount_DESC',
  NewOwnerOwnedPostsCountDescNullsLast = 'newOwner_ownedPostsCount_DESC_NULLS_LAST',
  NewOwnerUpdatedAtBlockAsc = 'newOwner_updatedAtBlock_ASC',
  NewOwnerUpdatedAtBlockAscNullsFirst = 'newOwner_updatedAtBlock_ASC_NULLS_FIRST',
  NewOwnerUpdatedAtBlockDesc = 'newOwner_updatedAtBlock_DESC',
  NewOwnerUpdatedAtBlockDescNullsLast = 'newOwner_updatedAtBlock_DESC_NULLS_LAST',
  NewOwnerUpdatedAtTimeAsc = 'newOwner_updatedAtTime_ASC',
  NewOwnerUpdatedAtTimeAscNullsFirst = 'newOwner_updatedAtTime_ASC_NULLS_FIRST',
  NewOwnerUpdatedAtTimeDesc = 'newOwner_updatedAtTime_DESC',
  NewOwnerUpdatedAtTimeDescNullsLast = 'newOwner_updatedAtTime_DESC_NULLS_LAST',
  OldOwnerFollowersCountAsc = 'oldOwner_followersCount_ASC',
  OldOwnerFollowersCountAscNullsFirst = 'oldOwner_followersCount_ASC_NULLS_FIRST',
  OldOwnerFollowersCountDesc = 'oldOwner_followersCount_DESC',
  OldOwnerFollowersCountDescNullsLast = 'oldOwner_followersCount_DESC_NULLS_LAST',
  OldOwnerFollowingAccountsCountAsc = 'oldOwner_followingAccountsCount_ASC',
  OldOwnerFollowingAccountsCountAscNullsFirst = 'oldOwner_followingAccountsCount_ASC_NULLS_FIRST',
  OldOwnerFollowingAccountsCountDesc = 'oldOwner_followingAccountsCount_DESC',
  OldOwnerFollowingAccountsCountDescNullsLast = 'oldOwner_followingAccountsCount_DESC_NULLS_LAST',
  OldOwnerFollowingPostsCountAsc = 'oldOwner_followingPostsCount_ASC',
  OldOwnerFollowingPostsCountAscNullsFirst = 'oldOwner_followingPostsCount_ASC_NULLS_FIRST',
  OldOwnerFollowingPostsCountDesc = 'oldOwner_followingPostsCount_DESC',
  OldOwnerFollowingPostsCountDescNullsLast = 'oldOwner_followingPostsCount_DESC_NULLS_LAST',
  OldOwnerFollowingSpacesCountAsc = 'oldOwner_followingSpacesCount_ASC',
  OldOwnerFollowingSpacesCountAscNullsFirst = 'oldOwner_followingSpacesCount_ASC_NULLS_FIRST',
  OldOwnerFollowingSpacesCountDesc = 'oldOwner_followingSpacesCount_DESC',
  OldOwnerFollowingSpacesCountDescNullsLast = 'oldOwner_followingSpacesCount_DESC_NULLS_LAST',
  OldOwnerIdAsc = 'oldOwner_id_ASC',
  OldOwnerIdAscNullsFirst = 'oldOwner_id_ASC_NULLS_FIRST',
  OldOwnerIdDesc = 'oldOwner_id_DESC',
  OldOwnerIdDescNullsLast = 'oldOwner_id_DESC_NULLS_LAST',
  OldOwnerOwnedPostsCountAsc = 'oldOwner_ownedPostsCount_ASC',
  OldOwnerOwnedPostsCountAscNullsFirst = 'oldOwner_ownedPostsCount_ASC_NULLS_FIRST',
  OldOwnerOwnedPostsCountDesc = 'oldOwner_ownedPostsCount_DESC',
  OldOwnerOwnedPostsCountDescNullsLast = 'oldOwner_ownedPostsCount_DESC_NULLS_LAST',
  OldOwnerUpdatedAtBlockAsc = 'oldOwner_updatedAtBlock_ASC',
  OldOwnerUpdatedAtBlockAscNullsFirst = 'oldOwner_updatedAtBlock_ASC_NULLS_FIRST',
  OldOwnerUpdatedAtBlockDesc = 'oldOwner_updatedAtBlock_DESC',
  OldOwnerUpdatedAtBlockDescNullsLast = 'oldOwner_updatedAtBlock_DESC_NULLS_LAST',
  OldOwnerUpdatedAtTimeAsc = 'oldOwner_updatedAtTime_ASC',
  OldOwnerUpdatedAtTimeAscNullsFirst = 'oldOwner_updatedAtTime_ASC_NULLS_FIRST',
  OldOwnerUpdatedAtTimeDesc = 'oldOwner_updatedAtTime_DESC',
  OldOwnerUpdatedAtTimeDescNullsLast = 'oldOwner_updatedAtTime_DESC_NULLS_LAST',
  PostBodyAsc = 'post_body_ASC',
  PostBodyAscNullsFirst = 'post_body_ASC_NULLS_FIRST',
  PostBodyDesc = 'post_body_DESC',
  PostBodyDescNullsLast = 'post_body_DESC_NULLS_LAST',
  PostCanonicalAsc = 'post_canonical_ASC',
  PostCanonicalAscNullsFirst = 'post_canonical_ASC_NULLS_FIRST',
  PostCanonicalDesc = 'post_canonical_DESC',
  PostCanonicalDescNullsLast = 'post_canonical_DESC_NULLS_LAST',
  PostContentAsc = 'post_content_ASC',
  PostContentAscNullsFirst = 'post_content_ASC_NULLS_FIRST',
  PostContentDesc = 'post_content_DESC',
  PostContentDescNullsLast = 'post_content_DESC_NULLS_LAST',
  PostCreatedAtBlockAsc = 'post_createdAtBlock_ASC',
  PostCreatedAtBlockAscNullsFirst = 'post_createdAtBlock_ASC_NULLS_FIRST',
  PostCreatedAtBlockDesc = 'post_createdAtBlock_DESC',
  PostCreatedAtBlockDescNullsLast = 'post_createdAtBlock_DESC_NULLS_LAST',
  PostCreatedAtTimeAsc = 'post_createdAtTime_ASC',
  PostCreatedAtTimeAscNullsFirst = 'post_createdAtTime_ASC_NULLS_FIRST',
  PostCreatedAtTimeDesc = 'post_createdAtTime_DESC',
  PostCreatedAtTimeDescNullsLast = 'post_createdAtTime_DESC_NULLS_LAST',
  PostCreatedOnDayAsc = 'post_createdOnDay_ASC',
  PostCreatedOnDayAscNullsFirst = 'post_createdOnDay_ASC_NULLS_FIRST',
  PostCreatedOnDayDesc = 'post_createdOnDay_DESC',
  PostCreatedOnDayDescNullsLast = 'post_createdOnDay_DESC_NULLS_LAST',
  PostDownvotesCountAsc = 'post_downvotesCount_ASC',
  PostDownvotesCountAscNullsFirst = 'post_downvotesCount_ASC_NULLS_FIRST',
  PostDownvotesCountDesc = 'post_downvotesCount_DESC',
  PostDownvotesCountDescNullsLast = 'post_downvotesCount_DESC_NULLS_LAST',
  PostFollowersCountAsc = 'post_followersCount_ASC',
  PostFollowersCountAscNullsFirst = 'post_followersCount_ASC_NULLS_FIRST',
  PostFollowersCountDesc = 'post_followersCount_DESC',
  PostFollowersCountDescNullsLast = 'post_followersCount_DESC_NULLS_LAST',
  PostFormatAsc = 'post_format_ASC',
  PostFormatAscNullsFirst = 'post_format_ASC_NULLS_FIRST',
  PostFormatDesc = 'post_format_DESC',
  PostFormatDescNullsLast = 'post_format_DESC_NULLS_LAST',
  PostHiddenRepliesCountAsc = 'post_hiddenRepliesCount_ASC',
  PostHiddenRepliesCountAscNullsFirst = 'post_hiddenRepliesCount_ASC_NULLS_FIRST',
  PostHiddenRepliesCountDesc = 'post_hiddenRepliesCount_DESC',
  PostHiddenRepliesCountDescNullsLast = 'post_hiddenRepliesCount_DESC_NULLS_LAST',
  PostHiddenAsc = 'post_hidden_ASC',
  PostHiddenAscNullsFirst = 'post_hidden_ASC_NULLS_FIRST',
  PostHiddenDesc = 'post_hidden_DESC',
  PostHiddenDescNullsLast = 'post_hidden_DESC_NULLS_LAST',
  PostIdAsc = 'post_id_ASC',
  PostIdAscNullsFirst = 'post_id_ASC_NULLS_FIRST',
  PostIdDesc = 'post_id_DESC',
  PostIdDescNullsLast = 'post_id_DESC_NULLS_LAST',
  PostImageAsc = 'post_image_ASC',
  PostImageAscNullsFirst = 'post_image_ASC_NULLS_FIRST',
  PostImageDesc = 'post_image_DESC',
  PostImageDescNullsLast = 'post_image_DESC_NULLS_LAST',
  PostInReplyToKindAsc = 'post_inReplyToKind_ASC',
  PostInReplyToKindAscNullsFirst = 'post_inReplyToKind_ASC_NULLS_FIRST',
  PostInReplyToKindDesc = 'post_inReplyToKind_DESC',
  PostInReplyToKindDescNullsLast = 'post_inReplyToKind_DESC_NULLS_LAST',
  PostIsCommentAsc = 'post_isComment_ASC',
  PostIsCommentAscNullsFirst = 'post_isComment_ASC_NULLS_FIRST',
  PostIsCommentDesc = 'post_isComment_DESC',
  PostIsCommentDescNullsLast = 'post_isComment_DESC_NULLS_LAST',
  PostIsShowMoreAsc = 'post_isShowMore_ASC',
  PostIsShowMoreAscNullsFirst = 'post_isShowMore_ASC_NULLS_FIRST',
  PostIsShowMoreDesc = 'post_isShowMore_DESC',
  PostIsShowMoreDescNullsLast = 'post_isShowMore_DESC_NULLS_LAST',
  PostKindAsc = 'post_kind_ASC',
  PostKindAscNullsFirst = 'post_kind_ASC_NULLS_FIRST',
  PostKindDesc = 'post_kind_DESC',
  PostKindDescNullsLast = 'post_kind_DESC_NULLS_LAST',
  PostLinkAsc = 'post_link_ASC',
  PostLinkAscNullsFirst = 'post_link_ASC_NULLS_FIRST',
  PostLinkDesc = 'post_link_DESC',
  PostLinkDescNullsLast = 'post_link_DESC_NULLS_LAST',
  PostMetaAsc = 'post_meta_ASC',
  PostMetaAscNullsFirst = 'post_meta_ASC_NULLS_FIRST',
  PostMetaDesc = 'post_meta_DESC',
  PostMetaDescNullsLast = 'post_meta_DESC_NULLS_LAST',
  PostProposalIndexAsc = 'post_proposalIndex_ASC',
  PostProposalIndexAscNullsFirst = 'post_proposalIndex_ASC_NULLS_FIRST',
  PostProposalIndexDesc = 'post_proposalIndex_DESC',
  PostProposalIndexDescNullsLast = 'post_proposalIndex_DESC_NULLS_LAST',
  PostPublicRepliesCountAsc = 'post_publicRepliesCount_ASC',
  PostPublicRepliesCountAscNullsFirst = 'post_publicRepliesCount_ASC_NULLS_FIRST',
  PostPublicRepliesCountDesc = 'post_publicRepliesCount_DESC',
  PostPublicRepliesCountDescNullsLast = 'post_publicRepliesCount_DESC_NULLS_LAST',
  PostReactionsCountAsc = 'post_reactionsCount_ASC',
  PostReactionsCountAscNullsFirst = 'post_reactionsCount_ASC_NULLS_FIRST',
  PostReactionsCountDesc = 'post_reactionsCount_DESC',
  PostReactionsCountDescNullsLast = 'post_reactionsCount_DESC_NULLS_LAST',
  PostRepliesCountAsc = 'post_repliesCount_ASC',
  PostRepliesCountAscNullsFirst = 'post_repliesCount_ASC_NULLS_FIRST',
  PostRepliesCountDesc = 'post_repliesCount_DESC',
  PostRepliesCountDescNullsLast = 'post_repliesCount_DESC_NULLS_LAST',
  PostSharesCountAsc = 'post_sharesCount_ASC',
  PostSharesCountAscNullsFirst = 'post_sharesCount_ASC_NULLS_FIRST',
  PostSharesCountDesc = 'post_sharesCount_DESC',
  PostSharesCountDescNullsLast = 'post_sharesCount_DESC_NULLS_LAST',
  PostSlugAsc = 'post_slug_ASC',
  PostSlugAscNullsFirst = 'post_slug_ASC_NULLS_FIRST',
  PostSlugDesc = 'post_slug_DESC',
  PostSlugDescNullsLast = 'post_slug_DESC_NULLS_LAST',
  PostSummaryAsc = 'post_summary_ASC',
  PostSummaryAscNullsFirst = 'post_summary_ASC_NULLS_FIRST',
  PostSummaryDesc = 'post_summary_DESC',
  PostSummaryDescNullsLast = 'post_summary_DESC_NULLS_LAST',
  PostTagsOriginalAsc = 'post_tagsOriginal_ASC',
  PostTagsOriginalAscNullsFirst = 'post_tagsOriginal_ASC_NULLS_FIRST',
  PostTagsOriginalDesc = 'post_tagsOriginal_DESC',
  PostTagsOriginalDescNullsLast = 'post_tagsOriginal_DESC_NULLS_LAST',
  PostTitleAsc = 'post_title_ASC',
  PostTitleAscNullsFirst = 'post_title_ASC_NULLS_FIRST',
  PostTitleDesc = 'post_title_DESC',
  PostTitleDescNullsLast = 'post_title_DESC_NULLS_LAST',
  PostTweetIdAsc = 'post_tweetId_ASC',
  PostTweetIdAscNullsFirst = 'post_tweetId_ASC_NULLS_FIRST',
  PostTweetIdDesc = 'post_tweetId_DESC',
  PostTweetIdDescNullsLast = 'post_tweetId_DESC_NULLS_LAST',
  PostUpdatedAtTimeAsc = 'post_updatedAtTime_ASC',
  PostUpdatedAtTimeAscNullsFirst = 'post_updatedAtTime_ASC_NULLS_FIRST',
  PostUpdatedAtTimeDesc = 'post_updatedAtTime_DESC',
  PostUpdatedAtTimeDescNullsLast = 'post_updatedAtTime_DESC_NULLS_LAST',
  PostUpvotesCountAsc = 'post_upvotesCount_ASC',
  PostUpvotesCountAscNullsFirst = 'post_upvotesCount_ASC_NULLS_FIRST',
  PostUpvotesCountDesc = 'post_upvotesCount_DESC',
  PostUpvotesCountDescNullsLast = 'post_upvotesCount_DESC_NULLS_LAST',
  ReactionCreatedAtBlockAsc = 'reaction_createdAtBlock_ASC',
  ReactionCreatedAtBlockAscNullsFirst = 'reaction_createdAtBlock_ASC_NULLS_FIRST',
  ReactionCreatedAtBlockDesc = 'reaction_createdAtBlock_DESC',
  ReactionCreatedAtBlockDescNullsLast = 'reaction_createdAtBlock_DESC_NULLS_LAST',
  ReactionCreatedAtTimeAsc = 'reaction_createdAtTime_ASC',
  ReactionCreatedAtTimeAscNullsFirst = 'reaction_createdAtTime_ASC_NULLS_FIRST',
  ReactionCreatedAtTimeDesc = 'reaction_createdAtTime_DESC',
  ReactionCreatedAtTimeDescNullsLast = 'reaction_createdAtTime_DESC_NULLS_LAST',
  ReactionIdAsc = 'reaction_id_ASC',
  ReactionIdAscNullsFirst = 'reaction_id_ASC_NULLS_FIRST',
  ReactionIdDesc = 'reaction_id_DESC',
  ReactionIdDescNullsLast = 'reaction_id_DESC_NULLS_LAST',
  ReactionKindAsc = 'reaction_kind_ASC',
  ReactionKindAscNullsFirst = 'reaction_kind_ASC_NULLS_FIRST',
  ReactionKindDesc = 'reaction_kind_DESC',
  ReactionKindDescNullsLast = 'reaction_kind_DESC_NULLS_LAST',
  ReactionStatusAsc = 'reaction_status_ASC',
  ReactionStatusAscNullsFirst = 'reaction_status_ASC_NULLS_FIRST',
  ReactionStatusDesc = 'reaction_status_DESC',
  ReactionStatusDescNullsLast = 'reaction_status_DESC_NULLS_LAST',
  ReactionUpdatedAtBlockAsc = 'reaction_updatedAtBlock_ASC',
  ReactionUpdatedAtBlockAscNullsFirst = 'reaction_updatedAtBlock_ASC_NULLS_FIRST',
  ReactionUpdatedAtBlockDesc = 'reaction_updatedAtBlock_DESC',
  ReactionUpdatedAtBlockDescNullsLast = 'reaction_updatedAtBlock_DESC_NULLS_LAST',
  ReactionUpdatedAtTimeAsc = 'reaction_updatedAtTime_ASC',
  ReactionUpdatedAtTimeAscNullsFirst = 'reaction_updatedAtTime_ASC_NULLS_FIRST',
  ReactionUpdatedAtTimeDesc = 'reaction_updatedAtTime_DESC',
  ReactionUpdatedAtTimeDescNullsLast = 'reaction_updatedAtTime_DESC_NULLS_LAST',
  SpacePrevAboutAsc = 'spacePrev_about_ASC',
  SpacePrevAboutAscNullsFirst = 'spacePrev_about_ASC_NULLS_FIRST',
  SpacePrevAboutDesc = 'spacePrev_about_DESC',
  SpacePrevAboutDescNullsLast = 'spacePrev_about_DESC_NULLS_LAST',
  SpacePrevCanEveryoneCreatePostsAsc = 'spacePrev_canEveryoneCreatePosts_ASC',
  SpacePrevCanEveryoneCreatePostsAscNullsFirst = 'spacePrev_canEveryoneCreatePosts_ASC_NULLS_FIRST',
  SpacePrevCanEveryoneCreatePostsDesc = 'spacePrev_canEveryoneCreatePosts_DESC',
  SpacePrevCanEveryoneCreatePostsDescNullsLast = 'spacePrev_canEveryoneCreatePosts_DESC_NULLS_LAST',
  SpacePrevCanFollowerCreatePostsAsc = 'spacePrev_canFollowerCreatePosts_ASC',
  SpacePrevCanFollowerCreatePostsAscNullsFirst = 'spacePrev_canFollowerCreatePosts_ASC_NULLS_FIRST',
  SpacePrevCanFollowerCreatePostsDesc = 'spacePrev_canFollowerCreatePosts_DESC',
  SpacePrevCanFollowerCreatePostsDescNullsLast = 'spacePrev_canFollowerCreatePosts_DESC_NULLS_LAST',
  SpacePrevContentAsc = 'spacePrev_content_ASC',
  SpacePrevContentAscNullsFirst = 'spacePrev_content_ASC_NULLS_FIRST',
  SpacePrevContentDesc = 'spacePrev_content_DESC',
  SpacePrevContentDescNullsLast = 'spacePrev_content_DESC_NULLS_LAST',
  SpacePrevCreatedAtBlockAsc = 'spacePrev_createdAtBlock_ASC',
  SpacePrevCreatedAtBlockAscNullsFirst = 'spacePrev_createdAtBlock_ASC_NULLS_FIRST',
  SpacePrevCreatedAtBlockDesc = 'spacePrev_createdAtBlock_DESC',
  SpacePrevCreatedAtBlockDescNullsLast = 'spacePrev_createdAtBlock_DESC_NULLS_LAST',
  SpacePrevCreatedAtTimeAsc = 'spacePrev_createdAtTime_ASC',
  SpacePrevCreatedAtTimeAscNullsFirst = 'spacePrev_createdAtTime_ASC_NULLS_FIRST',
  SpacePrevCreatedAtTimeDesc = 'spacePrev_createdAtTime_DESC',
  SpacePrevCreatedAtTimeDescNullsLast = 'spacePrev_createdAtTime_DESC_NULLS_LAST',
  SpacePrevCreatedOnDayAsc = 'spacePrev_createdOnDay_ASC',
  SpacePrevCreatedOnDayAscNullsFirst = 'spacePrev_createdOnDay_ASC_NULLS_FIRST',
  SpacePrevCreatedOnDayDesc = 'spacePrev_createdOnDay_DESC',
  SpacePrevCreatedOnDayDescNullsLast = 'spacePrev_createdOnDay_DESC_NULLS_LAST',
  SpacePrevEmailAsc = 'spacePrev_email_ASC',
  SpacePrevEmailAscNullsFirst = 'spacePrev_email_ASC_NULLS_FIRST',
  SpacePrevEmailDesc = 'spacePrev_email_DESC',
  SpacePrevEmailDescNullsLast = 'spacePrev_email_DESC_NULLS_LAST',
  SpacePrevFollowersCountAsc = 'spacePrev_followersCount_ASC',
  SpacePrevFollowersCountAscNullsFirst = 'spacePrev_followersCount_ASC_NULLS_FIRST',
  SpacePrevFollowersCountDesc = 'spacePrev_followersCount_DESC',
  SpacePrevFollowersCountDescNullsLast = 'spacePrev_followersCount_DESC_NULLS_LAST',
  SpacePrevFormatAsc = 'spacePrev_format_ASC',
  SpacePrevFormatAscNullsFirst = 'spacePrev_format_ASC_NULLS_FIRST',
  SpacePrevFormatDesc = 'spacePrev_format_DESC',
  SpacePrevFormatDescNullsLast = 'spacePrev_format_DESC_NULLS_LAST',
  SpacePrevHandleAsc = 'spacePrev_handle_ASC',
  SpacePrevHandleAscNullsFirst = 'spacePrev_handle_ASC_NULLS_FIRST',
  SpacePrevHandleDesc = 'spacePrev_handle_DESC',
  SpacePrevHandleDescNullsLast = 'spacePrev_handle_DESC_NULLS_LAST',
  SpacePrevHiddenPostsCountAsc = 'spacePrev_hiddenPostsCount_ASC',
  SpacePrevHiddenPostsCountAscNullsFirst = 'spacePrev_hiddenPostsCount_ASC_NULLS_FIRST',
  SpacePrevHiddenPostsCountDesc = 'spacePrev_hiddenPostsCount_DESC',
  SpacePrevHiddenPostsCountDescNullsLast = 'spacePrev_hiddenPostsCount_DESC_NULLS_LAST',
  SpacePrevHiddenAsc = 'spacePrev_hidden_ASC',
  SpacePrevHiddenAscNullsFirst = 'spacePrev_hidden_ASC_NULLS_FIRST',
  SpacePrevHiddenDesc = 'spacePrev_hidden_DESC',
  SpacePrevHiddenDescNullsLast = 'spacePrev_hidden_DESC_NULLS_LAST',
  SpacePrevIdAsc = 'spacePrev_id_ASC',
  SpacePrevIdAscNullsFirst = 'spacePrev_id_ASC_NULLS_FIRST',
  SpacePrevIdDesc = 'spacePrev_id_DESC',
  SpacePrevIdDescNullsLast = 'spacePrev_id_DESC_NULLS_LAST',
  SpacePrevImageAsc = 'spacePrev_image_ASC',
  SpacePrevImageAscNullsFirst = 'spacePrev_image_ASC_NULLS_FIRST',
  SpacePrevImageDesc = 'spacePrev_image_DESC',
  SpacePrevImageDescNullsLast = 'spacePrev_image_DESC_NULLS_LAST',
  SpacePrevInterestsOriginalAsc = 'spacePrev_interestsOriginal_ASC',
  SpacePrevInterestsOriginalAscNullsFirst = 'spacePrev_interestsOriginal_ASC_NULLS_FIRST',
  SpacePrevInterestsOriginalDesc = 'spacePrev_interestsOriginal_DESC',
  SpacePrevInterestsOriginalDescNullsLast = 'spacePrev_interestsOriginal_DESC_NULLS_LAST',
  SpacePrevIsShowMoreAsc = 'spacePrev_isShowMore_ASC',
  SpacePrevIsShowMoreAscNullsFirst = 'spacePrev_isShowMore_ASC_NULLS_FIRST',
  SpacePrevIsShowMoreDesc = 'spacePrev_isShowMore_DESC',
  SpacePrevIsShowMoreDescNullsLast = 'spacePrev_isShowMore_DESC_NULLS_LAST',
  SpacePrevLinksOriginalAsc = 'spacePrev_linksOriginal_ASC',
  SpacePrevLinksOriginalAscNullsFirst = 'spacePrev_linksOriginal_ASC_NULLS_FIRST',
  SpacePrevLinksOriginalDesc = 'spacePrev_linksOriginal_DESC',
  SpacePrevLinksOriginalDescNullsLast = 'spacePrev_linksOriginal_DESC_NULLS_LAST',
  SpacePrevNameAsc = 'spacePrev_name_ASC',
  SpacePrevNameAscNullsFirst = 'spacePrev_name_ASC_NULLS_FIRST',
  SpacePrevNameDesc = 'spacePrev_name_DESC',
  SpacePrevNameDescNullsLast = 'spacePrev_name_DESC_NULLS_LAST',
  SpacePrevPostsCountAsc = 'spacePrev_postsCount_ASC',
  SpacePrevPostsCountAscNullsFirst = 'spacePrev_postsCount_ASC_NULLS_FIRST',
  SpacePrevPostsCountDesc = 'spacePrev_postsCount_DESC',
  SpacePrevPostsCountDescNullsLast = 'spacePrev_postsCount_DESC_NULLS_LAST',
  SpacePrevProfileSourceAsc = 'spacePrev_profileSource_ASC',
  SpacePrevProfileSourceAscNullsFirst = 'spacePrev_profileSource_ASC_NULLS_FIRST',
  SpacePrevProfileSourceDesc = 'spacePrev_profileSource_DESC',
  SpacePrevProfileSourceDescNullsLast = 'spacePrev_profileSource_DESC_NULLS_LAST',
  SpacePrevPublicPostsCountAsc = 'spacePrev_publicPostsCount_ASC',
  SpacePrevPublicPostsCountAscNullsFirst = 'spacePrev_publicPostsCount_ASC_NULLS_FIRST',
  SpacePrevPublicPostsCountDesc = 'spacePrev_publicPostsCount_DESC',
  SpacePrevPublicPostsCountDescNullsLast = 'spacePrev_publicPostsCount_DESC_NULLS_LAST',
  SpacePrevSummaryAsc = 'spacePrev_summary_ASC',
  SpacePrevSummaryAscNullsFirst = 'spacePrev_summary_ASC_NULLS_FIRST',
  SpacePrevSummaryDesc = 'spacePrev_summary_DESC',
  SpacePrevSummaryDescNullsLast = 'spacePrev_summary_DESC_NULLS_LAST',
  SpacePrevTagsOriginalAsc = 'spacePrev_tagsOriginal_ASC',
  SpacePrevTagsOriginalAscNullsFirst = 'spacePrev_tagsOriginal_ASC_NULLS_FIRST',
  SpacePrevTagsOriginalDesc = 'spacePrev_tagsOriginal_DESC',
  SpacePrevTagsOriginalDescNullsLast = 'spacePrev_tagsOriginal_DESC_NULLS_LAST',
  SpacePrevUpdatedAtBlockAsc = 'spacePrev_updatedAtBlock_ASC',
  SpacePrevUpdatedAtBlockAscNullsFirst = 'spacePrev_updatedAtBlock_ASC_NULLS_FIRST',
  SpacePrevUpdatedAtBlockDesc = 'spacePrev_updatedAtBlock_DESC',
  SpacePrevUpdatedAtBlockDescNullsLast = 'spacePrev_updatedAtBlock_DESC_NULLS_LAST',
  SpacePrevUpdatedAtTimeAsc = 'spacePrev_updatedAtTime_ASC',
  SpacePrevUpdatedAtTimeAscNullsFirst = 'spacePrev_updatedAtTime_ASC_NULLS_FIRST',
  SpacePrevUpdatedAtTimeDesc = 'spacePrev_updatedAtTime_DESC',
  SpacePrevUpdatedAtTimeDescNullsLast = 'spacePrev_updatedAtTime_DESC_NULLS_LAST',
  SpacePrevUsernameAsc = 'spacePrev_username_ASC',
  SpacePrevUsernameAscNullsFirst = 'spacePrev_username_ASC_NULLS_FIRST',
  SpacePrevUsernameDesc = 'spacePrev_username_DESC',
  SpacePrevUsernameDescNullsLast = 'spacePrev_username_DESC_NULLS_LAST',
  SpaceAboutAsc = 'space_about_ASC',
  SpaceAboutAscNullsFirst = 'space_about_ASC_NULLS_FIRST',
  SpaceAboutDesc = 'space_about_DESC',
  SpaceAboutDescNullsLast = 'space_about_DESC_NULLS_LAST',
  SpaceCanEveryoneCreatePostsAsc = 'space_canEveryoneCreatePosts_ASC',
  SpaceCanEveryoneCreatePostsAscNullsFirst = 'space_canEveryoneCreatePosts_ASC_NULLS_FIRST',
  SpaceCanEveryoneCreatePostsDesc = 'space_canEveryoneCreatePosts_DESC',
  SpaceCanEveryoneCreatePostsDescNullsLast = 'space_canEveryoneCreatePosts_DESC_NULLS_LAST',
  SpaceCanFollowerCreatePostsAsc = 'space_canFollowerCreatePosts_ASC',
  SpaceCanFollowerCreatePostsAscNullsFirst = 'space_canFollowerCreatePosts_ASC_NULLS_FIRST',
  SpaceCanFollowerCreatePostsDesc = 'space_canFollowerCreatePosts_DESC',
  SpaceCanFollowerCreatePostsDescNullsLast = 'space_canFollowerCreatePosts_DESC_NULLS_LAST',
  SpaceContentAsc = 'space_content_ASC',
  SpaceContentAscNullsFirst = 'space_content_ASC_NULLS_FIRST',
  SpaceContentDesc = 'space_content_DESC',
  SpaceContentDescNullsLast = 'space_content_DESC_NULLS_LAST',
  SpaceCreatedAtBlockAsc = 'space_createdAtBlock_ASC',
  SpaceCreatedAtBlockAscNullsFirst = 'space_createdAtBlock_ASC_NULLS_FIRST',
  SpaceCreatedAtBlockDesc = 'space_createdAtBlock_DESC',
  SpaceCreatedAtBlockDescNullsLast = 'space_createdAtBlock_DESC_NULLS_LAST',
  SpaceCreatedAtTimeAsc = 'space_createdAtTime_ASC',
  SpaceCreatedAtTimeAscNullsFirst = 'space_createdAtTime_ASC_NULLS_FIRST',
  SpaceCreatedAtTimeDesc = 'space_createdAtTime_DESC',
  SpaceCreatedAtTimeDescNullsLast = 'space_createdAtTime_DESC_NULLS_LAST',
  SpaceCreatedOnDayAsc = 'space_createdOnDay_ASC',
  SpaceCreatedOnDayAscNullsFirst = 'space_createdOnDay_ASC_NULLS_FIRST',
  SpaceCreatedOnDayDesc = 'space_createdOnDay_DESC',
  SpaceCreatedOnDayDescNullsLast = 'space_createdOnDay_DESC_NULLS_LAST',
  SpaceEmailAsc = 'space_email_ASC',
  SpaceEmailAscNullsFirst = 'space_email_ASC_NULLS_FIRST',
  SpaceEmailDesc = 'space_email_DESC',
  SpaceEmailDescNullsLast = 'space_email_DESC_NULLS_LAST',
  SpaceFollowersCountAsc = 'space_followersCount_ASC',
  SpaceFollowersCountAscNullsFirst = 'space_followersCount_ASC_NULLS_FIRST',
  SpaceFollowersCountDesc = 'space_followersCount_DESC',
  SpaceFollowersCountDescNullsLast = 'space_followersCount_DESC_NULLS_LAST',
  SpaceFormatAsc = 'space_format_ASC',
  SpaceFormatAscNullsFirst = 'space_format_ASC_NULLS_FIRST',
  SpaceFormatDesc = 'space_format_DESC',
  SpaceFormatDescNullsLast = 'space_format_DESC_NULLS_LAST',
  SpaceHandleAsc = 'space_handle_ASC',
  SpaceHandleAscNullsFirst = 'space_handle_ASC_NULLS_FIRST',
  SpaceHandleDesc = 'space_handle_DESC',
  SpaceHandleDescNullsLast = 'space_handle_DESC_NULLS_LAST',
  SpaceHiddenPostsCountAsc = 'space_hiddenPostsCount_ASC',
  SpaceHiddenPostsCountAscNullsFirst = 'space_hiddenPostsCount_ASC_NULLS_FIRST',
  SpaceHiddenPostsCountDesc = 'space_hiddenPostsCount_DESC',
  SpaceHiddenPostsCountDescNullsLast = 'space_hiddenPostsCount_DESC_NULLS_LAST',
  SpaceHiddenAsc = 'space_hidden_ASC',
  SpaceHiddenAscNullsFirst = 'space_hidden_ASC_NULLS_FIRST',
  SpaceHiddenDesc = 'space_hidden_DESC',
  SpaceHiddenDescNullsLast = 'space_hidden_DESC_NULLS_LAST',
  SpaceIdAsc = 'space_id_ASC',
  SpaceIdAscNullsFirst = 'space_id_ASC_NULLS_FIRST',
  SpaceIdDesc = 'space_id_DESC',
  SpaceIdDescNullsLast = 'space_id_DESC_NULLS_LAST',
  SpaceImageAsc = 'space_image_ASC',
  SpaceImageAscNullsFirst = 'space_image_ASC_NULLS_FIRST',
  SpaceImageDesc = 'space_image_DESC',
  SpaceImageDescNullsLast = 'space_image_DESC_NULLS_LAST',
  SpaceInterestsOriginalAsc = 'space_interestsOriginal_ASC',
  SpaceInterestsOriginalAscNullsFirst = 'space_interestsOriginal_ASC_NULLS_FIRST',
  SpaceInterestsOriginalDesc = 'space_interestsOriginal_DESC',
  SpaceInterestsOriginalDescNullsLast = 'space_interestsOriginal_DESC_NULLS_LAST',
  SpaceIsShowMoreAsc = 'space_isShowMore_ASC',
  SpaceIsShowMoreAscNullsFirst = 'space_isShowMore_ASC_NULLS_FIRST',
  SpaceIsShowMoreDesc = 'space_isShowMore_DESC',
  SpaceIsShowMoreDescNullsLast = 'space_isShowMore_DESC_NULLS_LAST',
  SpaceLinksOriginalAsc = 'space_linksOriginal_ASC',
  SpaceLinksOriginalAscNullsFirst = 'space_linksOriginal_ASC_NULLS_FIRST',
  SpaceLinksOriginalDesc = 'space_linksOriginal_DESC',
  SpaceLinksOriginalDescNullsLast = 'space_linksOriginal_DESC_NULLS_LAST',
  SpaceNameAsc = 'space_name_ASC',
  SpaceNameAscNullsFirst = 'space_name_ASC_NULLS_FIRST',
  SpaceNameDesc = 'space_name_DESC',
  SpaceNameDescNullsLast = 'space_name_DESC_NULLS_LAST',
  SpacePostsCountAsc = 'space_postsCount_ASC',
  SpacePostsCountAscNullsFirst = 'space_postsCount_ASC_NULLS_FIRST',
  SpacePostsCountDesc = 'space_postsCount_DESC',
  SpacePostsCountDescNullsLast = 'space_postsCount_DESC_NULLS_LAST',
  SpaceProfileSourceAsc = 'space_profileSource_ASC',
  SpaceProfileSourceAscNullsFirst = 'space_profileSource_ASC_NULLS_FIRST',
  SpaceProfileSourceDesc = 'space_profileSource_DESC',
  SpaceProfileSourceDescNullsLast = 'space_profileSource_DESC_NULLS_LAST',
  SpacePublicPostsCountAsc = 'space_publicPostsCount_ASC',
  SpacePublicPostsCountAscNullsFirst = 'space_publicPostsCount_ASC_NULLS_FIRST',
  SpacePublicPostsCountDesc = 'space_publicPostsCount_DESC',
  SpacePublicPostsCountDescNullsLast = 'space_publicPostsCount_DESC_NULLS_LAST',
  SpaceSummaryAsc = 'space_summary_ASC',
  SpaceSummaryAscNullsFirst = 'space_summary_ASC_NULLS_FIRST',
  SpaceSummaryDesc = 'space_summary_DESC',
  SpaceSummaryDescNullsLast = 'space_summary_DESC_NULLS_LAST',
  SpaceTagsOriginalAsc = 'space_tagsOriginal_ASC',
  SpaceTagsOriginalAscNullsFirst = 'space_tagsOriginal_ASC_NULLS_FIRST',
  SpaceTagsOriginalDesc = 'space_tagsOriginal_DESC',
  SpaceTagsOriginalDescNullsLast = 'space_tagsOriginal_DESC_NULLS_LAST',
  SpaceUpdatedAtBlockAsc = 'space_updatedAtBlock_ASC',
  SpaceUpdatedAtBlockAscNullsFirst = 'space_updatedAtBlock_ASC_NULLS_FIRST',
  SpaceUpdatedAtBlockDesc = 'space_updatedAtBlock_DESC',
  SpaceUpdatedAtBlockDescNullsLast = 'space_updatedAtBlock_DESC_NULLS_LAST',
  SpaceUpdatedAtTimeAsc = 'space_updatedAtTime_ASC',
  SpaceUpdatedAtTimeAscNullsFirst = 'space_updatedAtTime_ASC_NULLS_FIRST',
  SpaceUpdatedAtTimeDesc = 'space_updatedAtTime_DESC',
  SpaceUpdatedAtTimeDescNullsLast = 'space_updatedAtTime_DESC_NULLS_LAST',
  SpaceUsernameAsc = 'space_username_ASC',
  SpaceUsernameAscNullsFirst = 'space_username_ASC_NULLS_FIRST',
  SpaceUsernameDesc = 'space_username_DESC',
  SpaceUsernameDescNullsLast = 'space_username_DESC_NULLS_LAST',
  UsernameAsc = 'username_ASC',
  UsernameAscNullsFirst = 'username_ASC_NULLS_FIRST',
  UsernameDesc = 'username_DESC',
  UsernameDescNullsLast = 'username_DESC_NULLS_LAST'
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
  FollowerAccountFollowersCountAscNullsFirst = 'followerAccount_followersCount_ASC_NULLS_FIRST',
  FollowerAccountFollowersCountDesc = 'followerAccount_followersCount_DESC',
  FollowerAccountFollowersCountDescNullsLast = 'followerAccount_followersCount_DESC_NULLS_LAST',
  FollowerAccountFollowingAccountsCountAsc = 'followerAccount_followingAccountsCount_ASC',
  FollowerAccountFollowingAccountsCountAscNullsFirst = 'followerAccount_followingAccountsCount_ASC_NULLS_FIRST',
  FollowerAccountFollowingAccountsCountDesc = 'followerAccount_followingAccountsCount_DESC',
  FollowerAccountFollowingAccountsCountDescNullsLast = 'followerAccount_followingAccountsCount_DESC_NULLS_LAST',
  FollowerAccountFollowingPostsCountAsc = 'followerAccount_followingPostsCount_ASC',
  FollowerAccountFollowingPostsCountAscNullsFirst = 'followerAccount_followingPostsCount_ASC_NULLS_FIRST',
  FollowerAccountFollowingPostsCountDesc = 'followerAccount_followingPostsCount_DESC',
  FollowerAccountFollowingPostsCountDescNullsLast = 'followerAccount_followingPostsCount_DESC_NULLS_LAST',
  FollowerAccountFollowingSpacesCountAsc = 'followerAccount_followingSpacesCount_ASC',
  FollowerAccountFollowingSpacesCountAscNullsFirst = 'followerAccount_followingSpacesCount_ASC_NULLS_FIRST',
  FollowerAccountFollowingSpacesCountDesc = 'followerAccount_followingSpacesCount_DESC',
  FollowerAccountFollowingSpacesCountDescNullsLast = 'followerAccount_followingSpacesCount_DESC_NULLS_LAST',
  FollowerAccountIdAsc = 'followerAccount_id_ASC',
  FollowerAccountIdAscNullsFirst = 'followerAccount_id_ASC_NULLS_FIRST',
  FollowerAccountIdDesc = 'followerAccount_id_DESC',
  FollowerAccountIdDescNullsLast = 'followerAccount_id_DESC_NULLS_LAST',
  FollowerAccountOwnedPostsCountAsc = 'followerAccount_ownedPostsCount_ASC',
  FollowerAccountOwnedPostsCountAscNullsFirst = 'followerAccount_ownedPostsCount_ASC_NULLS_FIRST',
  FollowerAccountOwnedPostsCountDesc = 'followerAccount_ownedPostsCount_DESC',
  FollowerAccountOwnedPostsCountDescNullsLast = 'followerAccount_ownedPostsCount_DESC_NULLS_LAST',
  FollowerAccountUpdatedAtBlockAsc = 'followerAccount_updatedAtBlock_ASC',
  FollowerAccountUpdatedAtBlockAscNullsFirst = 'followerAccount_updatedAtBlock_ASC_NULLS_FIRST',
  FollowerAccountUpdatedAtBlockDesc = 'followerAccount_updatedAtBlock_DESC',
  FollowerAccountUpdatedAtBlockDescNullsLast = 'followerAccount_updatedAtBlock_DESC_NULLS_LAST',
  FollowerAccountUpdatedAtTimeAsc = 'followerAccount_updatedAtTime_ASC',
  FollowerAccountUpdatedAtTimeAscNullsFirst = 'followerAccount_updatedAtTime_ASC_NULLS_FIRST',
  FollowerAccountUpdatedAtTimeDesc = 'followerAccount_updatedAtTime_DESC',
  FollowerAccountUpdatedAtTimeDescNullsLast = 'followerAccount_updatedAtTime_DESC_NULLS_LAST',
  FollowingCommentBodyAsc = 'followingComment_body_ASC',
  FollowingCommentBodyAscNullsFirst = 'followingComment_body_ASC_NULLS_FIRST',
  FollowingCommentBodyDesc = 'followingComment_body_DESC',
  FollowingCommentBodyDescNullsLast = 'followingComment_body_DESC_NULLS_LAST',
  FollowingCommentCanonicalAsc = 'followingComment_canonical_ASC',
  FollowingCommentCanonicalAscNullsFirst = 'followingComment_canonical_ASC_NULLS_FIRST',
  FollowingCommentCanonicalDesc = 'followingComment_canonical_DESC',
  FollowingCommentCanonicalDescNullsLast = 'followingComment_canonical_DESC_NULLS_LAST',
  FollowingCommentContentAsc = 'followingComment_content_ASC',
  FollowingCommentContentAscNullsFirst = 'followingComment_content_ASC_NULLS_FIRST',
  FollowingCommentContentDesc = 'followingComment_content_DESC',
  FollowingCommentContentDescNullsLast = 'followingComment_content_DESC_NULLS_LAST',
  FollowingCommentCreatedAtBlockAsc = 'followingComment_createdAtBlock_ASC',
  FollowingCommentCreatedAtBlockAscNullsFirst = 'followingComment_createdAtBlock_ASC_NULLS_FIRST',
  FollowingCommentCreatedAtBlockDesc = 'followingComment_createdAtBlock_DESC',
  FollowingCommentCreatedAtBlockDescNullsLast = 'followingComment_createdAtBlock_DESC_NULLS_LAST',
  FollowingCommentCreatedAtTimeAsc = 'followingComment_createdAtTime_ASC',
  FollowingCommentCreatedAtTimeAscNullsFirst = 'followingComment_createdAtTime_ASC_NULLS_FIRST',
  FollowingCommentCreatedAtTimeDesc = 'followingComment_createdAtTime_DESC',
  FollowingCommentCreatedAtTimeDescNullsLast = 'followingComment_createdAtTime_DESC_NULLS_LAST',
  FollowingCommentCreatedOnDayAsc = 'followingComment_createdOnDay_ASC',
  FollowingCommentCreatedOnDayAscNullsFirst = 'followingComment_createdOnDay_ASC_NULLS_FIRST',
  FollowingCommentCreatedOnDayDesc = 'followingComment_createdOnDay_DESC',
  FollowingCommentCreatedOnDayDescNullsLast = 'followingComment_createdOnDay_DESC_NULLS_LAST',
  FollowingCommentDownvotesCountAsc = 'followingComment_downvotesCount_ASC',
  FollowingCommentDownvotesCountAscNullsFirst = 'followingComment_downvotesCount_ASC_NULLS_FIRST',
  FollowingCommentDownvotesCountDesc = 'followingComment_downvotesCount_DESC',
  FollowingCommentDownvotesCountDescNullsLast = 'followingComment_downvotesCount_DESC_NULLS_LAST',
  FollowingCommentFollowersCountAsc = 'followingComment_followersCount_ASC',
  FollowingCommentFollowersCountAscNullsFirst = 'followingComment_followersCount_ASC_NULLS_FIRST',
  FollowingCommentFollowersCountDesc = 'followingComment_followersCount_DESC',
  FollowingCommentFollowersCountDescNullsLast = 'followingComment_followersCount_DESC_NULLS_LAST',
  FollowingCommentFormatAsc = 'followingComment_format_ASC',
  FollowingCommentFormatAscNullsFirst = 'followingComment_format_ASC_NULLS_FIRST',
  FollowingCommentFormatDesc = 'followingComment_format_DESC',
  FollowingCommentFormatDescNullsLast = 'followingComment_format_DESC_NULLS_LAST',
  FollowingCommentHiddenRepliesCountAsc = 'followingComment_hiddenRepliesCount_ASC',
  FollowingCommentHiddenRepliesCountAscNullsFirst = 'followingComment_hiddenRepliesCount_ASC_NULLS_FIRST',
  FollowingCommentHiddenRepliesCountDesc = 'followingComment_hiddenRepliesCount_DESC',
  FollowingCommentHiddenRepliesCountDescNullsLast = 'followingComment_hiddenRepliesCount_DESC_NULLS_LAST',
  FollowingCommentHiddenAsc = 'followingComment_hidden_ASC',
  FollowingCommentHiddenAscNullsFirst = 'followingComment_hidden_ASC_NULLS_FIRST',
  FollowingCommentHiddenDesc = 'followingComment_hidden_DESC',
  FollowingCommentHiddenDescNullsLast = 'followingComment_hidden_DESC_NULLS_LAST',
  FollowingCommentIdAsc = 'followingComment_id_ASC',
  FollowingCommentIdAscNullsFirst = 'followingComment_id_ASC_NULLS_FIRST',
  FollowingCommentIdDesc = 'followingComment_id_DESC',
  FollowingCommentIdDescNullsLast = 'followingComment_id_DESC_NULLS_LAST',
  FollowingCommentImageAsc = 'followingComment_image_ASC',
  FollowingCommentImageAscNullsFirst = 'followingComment_image_ASC_NULLS_FIRST',
  FollowingCommentImageDesc = 'followingComment_image_DESC',
  FollowingCommentImageDescNullsLast = 'followingComment_image_DESC_NULLS_LAST',
  FollowingCommentInReplyToKindAsc = 'followingComment_inReplyToKind_ASC',
  FollowingCommentInReplyToKindAscNullsFirst = 'followingComment_inReplyToKind_ASC_NULLS_FIRST',
  FollowingCommentInReplyToKindDesc = 'followingComment_inReplyToKind_DESC',
  FollowingCommentInReplyToKindDescNullsLast = 'followingComment_inReplyToKind_DESC_NULLS_LAST',
  FollowingCommentIsCommentAsc = 'followingComment_isComment_ASC',
  FollowingCommentIsCommentAscNullsFirst = 'followingComment_isComment_ASC_NULLS_FIRST',
  FollowingCommentIsCommentDesc = 'followingComment_isComment_DESC',
  FollowingCommentIsCommentDescNullsLast = 'followingComment_isComment_DESC_NULLS_LAST',
  FollowingCommentIsShowMoreAsc = 'followingComment_isShowMore_ASC',
  FollowingCommentIsShowMoreAscNullsFirst = 'followingComment_isShowMore_ASC_NULLS_FIRST',
  FollowingCommentIsShowMoreDesc = 'followingComment_isShowMore_DESC',
  FollowingCommentIsShowMoreDescNullsLast = 'followingComment_isShowMore_DESC_NULLS_LAST',
  FollowingCommentKindAsc = 'followingComment_kind_ASC',
  FollowingCommentKindAscNullsFirst = 'followingComment_kind_ASC_NULLS_FIRST',
  FollowingCommentKindDesc = 'followingComment_kind_DESC',
  FollowingCommentKindDescNullsLast = 'followingComment_kind_DESC_NULLS_LAST',
  FollowingCommentLinkAsc = 'followingComment_link_ASC',
  FollowingCommentLinkAscNullsFirst = 'followingComment_link_ASC_NULLS_FIRST',
  FollowingCommentLinkDesc = 'followingComment_link_DESC',
  FollowingCommentLinkDescNullsLast = 'followingComment_link_DESC_NULLS_LAST',
  FollowingCommentMetaAsc = 'followingComment_meta_ASC',
  FollowingCommentMetaAscNullsFirst = 'followingComment_meta_ASC_NULLS_FIRST',
  FollowingCommentMetaDesc = 'followingComment_meta_DESC',
  FollowingCommentMetaDescNullsLast = 'followingComment_meta_DESC_NULLS_LAST',
  FollowingCommentProposalIndexAsc = 'followingComment_proposalIndex_ASC',
  FollowingCommentProposalIndexAscNullsFirst = 'followingComment_proposalIndex_ASC_NULLS_FIRST',
  FollowingCommentProposalIndexDesc = 'followingComment_proposalIndex_DESC',
  FollowingCommentProposalIndexDescNullsLast = 'followingComment_proposalIndex_DESC_NULLS_LAST',
  FollowingCommentPublicRepliesCountAsc = 'followingComment_publicRepliesCount_ASC',
  FollowingCommentPublicRepliesCountAscNullsFirst = 'followingComment_publicRepliesCount_ASC_NULLS_FIRST',
  FollowingCommentPublicRepliesCountDesc = 'followingComment_publicRepliesCount_DESC',
  FollowingCommentPublicRepliesCountDescNullsLast = 'followingComment_publicRepliesCount_DESC_NULLS_LAST',
  FollowingCommentReactionsCountAsc = 'followingComment_reactionsCount_ASC',
  FollowingCommentReactionsCountAscNullsFirst = 'followingComment_reactionsCount_ASC_NULLS_FIRST',
  FollowingCommentReactionsCountDesc = 'followingComment_reactionsCount_DESC',
  FollowingCommentReactionsCountDescNullsLast = 'followingComment_reactionsCount_DESC_NULLS_LAST',
  FollowingCommentRepliesCountAsc = 'followingComment_repliesCount_ASC',
  FollowingCommentRepliesCountAscNullsFirst = 'followingComment_repliesCount_ASC_NULLS_FIRST',
  FollowingCommentRepliesCountDesc = 'followingComment_repliesCount_DESC',
  FollowingCommentRepliesCountDescNullsLast = 'followingComment_repliesCount_DESC_NULLS_LAST',
  FollowingCommentSharesCountAsc = 'followingComment_sharesCount_ASC',
  FollowingCommentSharesCountAscNullsFirst = 'followingComment_sharesCount_ASC_NULLS_FIRST',
  FollowingCommentSharesCountDesc = 'followingComment_sharesCount_DESC',
  FollowingCommentSharesCountDescNullsLast = 'followingComment_sharesCount_DESC_NULLS_LAST',
  FollowingCommentSlugAsc = 'followingComment_slug_ASC',
  FollowingCommentSlugAscNullsFirst = 'followingComment_slug_ASC_NULLS_FIRST',
  FollowingCommentSlugDesc = 'followingComment_slug_DESC',
  FollowingCommentSlugDescNullsLast = 'followingComment_slug_DESC_NULLS_LAST',
  FollowingCommentSummaryAsc = 'followingComment_summary_ASC',
  FollowingCommentSummaryAscNullsFirst = 'followingComment_summary_ASC_NULLS_FIRST',
  FollowingCommentSummaryDesc = 'followingComment_summary_DESC',
  FollowingCommentSummaryDescNullsLast = 'followingComment_summary_DESC_NULLS_LAST',
  FollowingCommentTagsOriginalAsc = 'followingComment_tagsOriginal_ASC',
  FollowingCommentTagsOriginalAscNullsFirst = 'followingComment_tagsOriginal_ASC_NULLS_FIRST',
  FollowingCommentTagsOriginalDesc = 'followingComment_tagsOriginal_DESC',
  FollowingCommentTagsOriginalDescNullsLast = 'followingComment_tagsOriginal_DESC_NULLS_LAST',
  FollowingCommentTitleAsc = 'followingComment_title_ASC',
  FollowingCommentTitleAscNullsFirst = 'followingComment_title_ASC_NULLS_FIRST',
  FollowingCommentTitleDesc = 'followingComment_title_DESC',
  FollowingCommentTitleDescNullsLast = 'followingComment_title_DESC_NULLS_LAST',
  FollowingCommentTweetIdAsc = 'followingComment_tweetId_ASC',
  FollowingCommentTweetIdAscNullsFirst = 'followingComment_tweetId_ASC_NULLS_FIRST',
  FollowingCommentTweetIdDesc = 'followingComment_tweetId_DESC',
  FollowingCommentTweetIdDescNullsLast = 'followingComment_tweetId_DESC_NULLS_LAST',
  FollowingCommentUpdatedAtTimeAsc = 'followingComment_updatedAtTime_ASC',
  FollowingCommentUpdatedAtTimeAscNullsFirst = 'followingComment_updatedAtTime_ASC_NULLS_FIRST',
  FollowingCommentUpdatedAtTimeDesc = 'followingComment_updatedAtTime_DESC',
  FollowingCommentUpdatedAtTimeDescNullsLast = 'followingComment_updatedAtTime_DESC_NULLS_LAST',
  FollowingCommentUpvotesCountAsc = 'followingComment_upvotesCount_ASC',
  FollowingCommentUpvotesCountAscNullsFirst = 'followingComment_upvotesCount_ASC_NULLS_FIRST',
  FollowingCommentUpvotesCountDesc = 'followingComment_upvotesCount_DESC',
  FollowingCommentUpvotesCountDescNullsLast = 'followingComment_upvotesCount_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST'
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
  AmountAscNullsFirst = 'amount_ASC_NULLS_FIRST',
  AmountDesc = 'amount_DESC',
  AmountDescNullsLast = 'amount_DESC_NULLS_LAST',
  ChainAsc = 'chain_ASC',
  ChainAscNullsFirst = 'chain_ASC_NULLS_FIRST',
  ChainDesc = 'chain_DESC',
  ChainDescNullsLast = 'chain_DESC_NULLS_LAST',
  CollectionIdAsc = 'collectionId_ASC',
  CollectionIdAscNullsFirst = 'collectionId_ASC_NULLS_FIRST',
  CollectionIdDesc = 'collectionId_DESC',
  CollectionIdDescNullsLast = 'collectionId_DESC_NULLS_LAST',
  CreatedByFollowersCountAsc = 'createdBy_followersCount_ASC',
  CreatedByFollowersCountAscNullsFirst = 'createdBy_followersCount_ASC_NULLS_FIRST',
  CreatedByFollowersCountDesc = 'createdBy_followersCount_DESC',
  CreatedByFollowersCountDescNullsLast = 'createdBy_followersCount_DESC_NULLS_LAST',
  CreatedByFollowingAccountsCountAsc = 'createdBy_followingAccountsCount_ASC',
  CreatedByFollowingAccountsCountAscNullsFirst = 'createdBy_followingAccountsCount_ASC_NULLS_FIRST',
  CreatedByFollowingAccountsCountDesc = 'createdBy_followingAccountsCount_DESC',
  CreatedByFollowingAccountsCountDescNullsLast = 'createdBy_followingAccountsCount_DESC_NULLS_LAST',
  CreatedByFollowingPostsCountAsc = 'createdBy_followingPostsCount_ASC',
  CreatedByFollowingPostsCountAscNullsFirst = 'createdBy_followingPostsCount_ASC_NULLS_FIRST',
  CreatedByFollowingPostsCountDesc = 'createdBy_followingPostsCount_DESC',
  CreatedByFollowingPostsCountDescNullsLast = 'createdBy_followingPostsCount_DESC_NULLS_LAST',
  CreatedByFollowingSpacesCountAsc = 'createdBy_followingSpacesCount_ASC',
  CreatedByFollowingSpacesCountAscNullsFirst = 'createdBy_followingSpacesCount_ASC_NULLS_FIRST',
  CreatedByFollowingSpacesCountDesc = 'createdBy_followingSpacesCount_DESC',
  CreatedByFollowingSpacesCountDescNullsLast = 'createdBy_followingSpacesCount_DESC_NULLS_LAST',
  CreatedByIdAsc = 'createdBy_id_ASC',
  CreatedByIdAscNullsFirst = 'createdBy_id_ASC_NULLS_FIRST',
  CreatedByIdDesc = 'createdBy_id_DESC',
  CreatedByIdDescNullsLast = 'createdBy_id_DESC_NULLS_LAST',
  CreatedByOwnedPostsCountAsc = 'createdBy_ownedPostsCount_ASC',
  CreatedByOwnedPostsCountAscNullsFirst = 'createdBy_ownedPostsCount_ASC_NULLS_FIRST',
  CreatedByOwnedPostsCountDesc = 'createdBy_ownedPostsCount_DESC',
  CreatedByOwnedPostsCountDescNullsLast = 'createdBy_ownedPostsCount_DESC_NULLS_LAST',
  CreatedByUpdatedAtBlockAsc = 'createdBy_updatedAtBlock_ASC',
  CreatedByUpdatedAtBlockAscNullsFirst = 'createdBy_updatedAtBlock_ASC_NULLS_FIRST',
  CreatedByUpdatedAtBlockDesc = 'createdBy_updatedAtBlock_DESC',
  CreatedByUpdatedAtBlockDescNullsLast = 'createdBy_updatedAtBlock_DESC_NULLS_LAST',
  CreatedByUpdatedAtTimeAsc = 'createdBy_updatedAtTime_ASC',
  CreatedByUpdatedAtTimeAscNullsFirst = 'createdBy_updatedAtTime_ASC_NULLS_FIRST',
  CreatedByUpdatedAtTimeDesc = 'createdBy_updatedAtTime_DESC',
  CreatedByUpdatedAtTimeDescNullsLast = 'createdBy_updatedAtTime_DESC_NULLS_LAST',
  DecimalsAsc = 'decimals_ASC',
  DecimalsAscNullsFirst = 'decimals_ASC_NULLS_FIRST',
  DecimalsDesc = 'decimals_DESC',
  DecimalsDescNullsLast = 'decimals_DESC_NULLS_LAST',
  ExtensionSchemaIdAsc = 'extensionSchemaId_ASC',
  ExtensionSchemaIdAscNullsFirst = 'extensionSchemaId_ASC_NULLS_FIRST',
  ExtensionSchemaIdDesc = 'extensionSchemaId_DESC',
  ExtensionSchemaIdDescNullsLast = 'extensionSchemaId_DESC_NULLS_LAST',
  FromEvmIdAsc = 'fromEvm_id_ASC',
  FromEvmIdAscNullsFirst = 'fromEvm_id_ASC_NULLS_FIRST',
  FromEvmIdDesc = 'fromEvm_id_DESC',
  FromEvmIdDescNullsLast = 'fromEvm_id_DESC_NULLS_LAST',
  FromSubstrateFollowersCountAsc = 'fromSubstrate_followersCount_ASC',
  FromSubstrateFollowersCountAscNullsFirst = 'fromSubstrate_followersCount_ASC_NULLS_FIRST',
  FromSubstrateFollowersCountDesc = 'fromSubstrate_followersCount_DESC',
  FromSubstrateFollowersCountDescNullsLast = 'fromSubstrate_followersCount_DESC_NULLS_LAST',
  FromSubstrateFollowingAccountsCountAsc = 'fromSubstrate_followingAccountsCount_ASC',
  FromSubstrateFollowingAccountsCountAscNullsFirst = 'fromSubstrate_followingAccountsCount_ASC_NULLS_FIRST',
  FromSubstrateFollowingAccountsCountDesc = 'fromSubstrate_followingAccountsCount_DESC',
  FromSubstrateFollowingAccountsCountDescNullsLast = 'fromSubstrate_followingAccountsCount_DESC_NULLS_LAST',
  FromSubstrateFollowingPostsCountAsc = 'fromSubstrate_followingPostsCount_ASC',
  FromSubstrateFollowingPostsCountAscNullsFirst = 'fromSubstrate_followingPostsCount_ASC_NULLS_FIRST',
  FromSubstrateFollowingPostsCountDesc = 'fromSubstrate_followingPostsCount_DESC',
  FromSubstrateFollowingPostsCountDescNullsLast = 'fromSubstrate_followingPostsCount_DESC_NULLS_LAST',
  FromSubstrateFollowingSpacesCountAsc = 'fromSubstrate_followingSpacesCount_ASC',
  FromSubstrateFollowingSpacesCountAscNullsFirst = 'fromSubstrate_followingSpacesCount_ASC_NULLS_FIRST',
  FromSubstrateFollowingSpacesCountDesc = 'fromSubstrate_followingSpacesCount_DESC',
  FromSubstrateFollowingSpacesCountDescNullsLast = 'fromSubstrate_followingSpacesCount_DESC_NULLS_LAST',
  FromSubstrateIdAsc = 'fromSubstrate_id_ASC',
  FromSubstrateIdAscNullsFirst = 'fromSubstrate_id_ASC_NULLS_FIRST',
  FromSubstrateIdDesc = 'fromSubstrate_id_DESC',
  FromSubstrateIdDescNullsLast = 'fromSubstrate_id_DESC_NULLS_LAST',
  FromSubstrateOwnedPostsCountAsc = 'fromSubstrate_ownedPostsCount_ASC',
  FromSubstrateOwnedPostsCountAscNullsFirst = 'fromSubstrate_ownedPostsCount_ASC_NULLS_FIRST',
  FromSubstrateOwnedPostsCountDesc = 'fromSubstrate_ownedPostsCount_DESC',
  FromSubstrateOwnedPostsCountDescNullsLast = 'fromSubstrate_ownedPostsCount_DESC_NULLS_LAST',
  FromSubstrateUpdatedAtBlockAsc = 'fromSubstrate_updatedAtBlock_ASC',
  FromSubstrateUpdatedAtBlockAscNullsFirst = 'fromSubstrate_updatedAtBlock_ASC_NULLS_FIRST',
  FromSubstrateUpdatedAtBlockDesc = 'fromSubstrate_updatedAtBlock_DESC',
  FromSubstrateUpdatedAtBlockDescNullsLast = 'fromSubstrate_updatedAtBlock_DESC_NULLS_LAST',
  FromSubstrateUpdatedAtTimeAsc = 'fromSubstrate_updatedAtTime_ASC',
  FromSubstrateUpdatedAtTimeAscNullsFirst = 'fromSubstrate_updatedAtTime_ASC_NULLS_FIRST',
  FromSubstrateUpdatedAtTimeDesc = 'fromSubstrate_updatedAtTime_DESC',
  FromSubstrateUpdatedAtTimeDescNullsLast = 'fromSubstrate_updatedAtTime_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  ImageAsc = 'image_ASC',
  ImageAscNullsFirst = 'image_ASC_NULLS_FIRST',
  ImageDesc = 'image_DESC',
  ImageDescNullsLast = 'image_DESC_NULLS_LAST',
  MessageAsc = 'message_ASC',
  MessageAscNullsFirst = 'message_ASC_NULLS_FIRST',
  MessageDesc = 'message_DESC',
  MessageDescNullsLast = 'message_DESC_NULLS_LAST',
  NftIdAsc = 'nftId_ASC',
  NftIdAscNullsFirst = 'nftId_ASC_NULLS_FIRST',
  NftIdDesc = 'nftId_DESC',
  NftIdDescNullsLast = 'nftId_DESC_NULLS_LAST',
  NonceAsc = 'nonce_ASC',
  NonceAscNullsFirst = 'nonce_ASC_NULLS_FIRST',
  NonceDesc = 'nonce_DESC',
  NonceDescNullsLast = 'nonce_DESC_NULLS_LAST',
  ParentPostBodyAsc = 'parentPost_body_ASC',
  ParentPostBodyAscNullsFirst = 'parentPost_body_ASC_NULLS_FIRST',
  ParentPostBodyDesc = 'parentPost_body_DESC',
  ParentPostBodyDescNullsLast = 'parentPost_body_DESC_NULLS_LAST',
  ParentPostCanonicalAsc = 'parentPost_canonical_ASC',
  ParentPostCanonicalAscNullsFirst = 'parentPost_canonical_ASC_NULLS_FIRST',
  ParentPostCanonicalDesc = 'parentPost_canonical_DESC',
  ParentPostCanonicalDescNullsLast = 'parentPost_canonical_DESC_NULLS_LAST',
  ParentPostContentAsc = 'parentPost_content_ASC',
  ParentPostContentAscNullsFirst = 'parentPost_content_ASC_NULLS_FIRST',
  ParentPostContentDesc = 'parentPost_content_DESC',
  ParentPostContentDescNullsLast = 'parentPost_content_DESC_NULLS_LAST',
  ParentPostCreatedAtBlockAsc = 'parentPost_createdAtBlock_ASC',
  ParentPostCreatedAtBlockAscNullsFirst = 'parentPost_createdAtBlock_ASC_NULLS_FIRST',
  ParentPostCreatedAtBlockDesc = 'parentPost_createdAtBlock_DESC',
  ParentPostCreatedAtBlockDescNullsLast = 'parentPost_createdAtBlock_DESC_NULLS_LAST',
  ParentPostCreatedAtTimeAsc = 'parentPost_createdAtTime_ASC',
  ParentPostCreatedAtTimeAscNullsFirst = 'parentPost_createdAtTime_ASC_NULLS_FIRST',
  ParentPostCreatedAtTimeDesc = 'parentPost_createdAtTime_DESC',
  ParentPostCreatedAtTimeDescNullsLast = 'parentPost_createdAtTime_DESC_NULLS_LAST',
  ParentPostCreatedOnDayAsc = 'parentPost_createdOnDay_ASC',
  ParentPostCreatedOnDayAscNullsFirst = 'parentPost_createdOnDay_ASC_NULLS_FIRST',
  ParentPostCreatedOnDayDesc = 'parentPost_createdOnDay_DESC',
  ParentPostCreatedOnDayDescNullsLast = 'parentPost_createdOnDay_DESC_NULLS_LAST',
  ParentPostDownvotesCountAsc = 'parentPost_downvotesCount_ASC',
  ParentPostDownvotesCountAscNullsFirst = 'parentPost_downvotesCount_ASC_NULLS_FIRST',
  ParentPostDownvotesCountDesc = 'parentPost_downvotesCount_DESC',
  ParentPostDownvotesCountDescNullsLast = 'parentPost_downvotesCount_DESC_NULLS_LAST',
  ParentPostFollowersCountAsc = 'parentPost_followersCount_ASC',
  ParentPostFollowersCountAscNullsFirst = 'parentPost_followersCount_ASC_NULLS_FIRST',
  ParentPostFollowersCountDesc = 'parentPost_followersCount_DESC',
  ParentPostFollowersCountDescNullsLast = 'parentPost_followersCount_DESC_NULLS_LAST',
  ParentPostFormatAsc = 'parentPost_format_ASC',
  ParentPostFormatAscNullsFirst = 'parentPost_format_ASC_NULLS_FIRST',
  ParentPostFormatDesc = 'parentPost_format_DESC',
  ParentPostFormatDescNullsLast = 'parentPost_format_DESC_NULLS_LAST',
  ParentPostHiddenRepliesCountAsc = 'parentPost_hiddenRepliesCount_ASC',
  ParentPostHiddenRepliesCountAscNullsFirst = 'parentPost_hiddenRepliesCount_ASC_NULLS_FIRST',
  ParentPostHiddenRepliesCountDesc = 'parentPost_hiddenRepliesCount_DESC',
  ParentPostHiddenRepliesCountDescNullsLast = 'parentPost_hiddenRepliesCount_DESC_NULLS_LAST',
  ParentPostHiddenAsc = 'parentPost_hidden_ASC',
  ParentPostHiddenAscNullsFirst = 'parentPost_hidden_ASC_NULLS_FIRST',
  ParentPostHiddenDesc = 'parentPost_hidden_DESC',
  ParentPostHiddenDescNullsLast = 'parentPost_hidden_DESC_NULLS_LAST',
  ParentPostIdAsc = 'parentPost_id_ASC',
  ParentPostIdAscNullsFirst = 'parentPost_id_ASC_NULLS_FIRST',
  ParentPostIdDesc = 'parentPost_id_DESC',
  ParentPostIdDescNullsLast = 'parentPost_id_DESC_NULLS_LAST',
  ParentPostImageAsc = 'parentPost_image_ASC',
  ParentPostImageAscNullsFirst = 'parentPost_image_ASC_NULLS_FIRST',
  ParentPostImageDesc = 'parentPost_image_DESC',
  ParentPostImageDescNullsLast = 'parentPost_image_DESC_NULLS_LAST',
  ParentPostInReplyToKindAsc = 'parentPost_inReplyToKind_ASC',
  ParentPostInReplyToKindAscNullsFirst = 'parentPost_inReplyToKind_ASC_NULLS_FIRST',
  ParentPostInReplyToKindDesc = 'parentPost_inReplyToKind_DESC',
  ParentPostInReplyToKindDescNullsLast = 'parentPost_inReplyToKind_DESC_NULLS_LAST',
  ParentPostIsCommentAsc = 'parentPost_isComment_ASC',
  ParentPostIsCommentAscNullsFirst = 'parentPost_isComment_ASC_NULLS_FIRST',
  ParentPostIsCommentDesc = 'parentPost_isComment_DESC',
  ParentPostIsCommentDescNullsLast = 'parentPost_isComment_DESC_NULLS_LAST',
  ParentPostIsShowMoreAsc = 'parentPost_isShowMore_ASC',
  ParentPostIsShowMoreAscNullsFirst = 'parentPost_isShowMore_ASC_NULLS_FIRST',
  ParentPostIsShowMoreDesc = 'parentPost_isShowMore_DESC',
  ParentPostIsShowMoreDescNullsLast = 'parentPost_isShowMore_DESC_NULLS_LAST',
  ParentPostKindAsc = 'parentPost_kind_ASC',
  ParentPostKindAscNullsFirst = 'parentPost_kind_ASC_NULLS_FIRST',
  ParentPostKindDesc = 'parentPost_kind_DESC',
  ParentPostKindDescNullsLast = 'parentPost_kind_DESC_NULLS_LAST',
  ParentPostLinkAsc = 'parentPost_link_ASC',
  ParentPostLinkAscNullsFirst = 'parentPost_link_ASC_NULLS_FIRST',
  ParentPostLinkDesc = 'parentPost_link_DESC',
  ParentPostLinkDescNullsLast = 'parentPost_link_DESC_NULLS_LAST',
  ParentPostMetaAsc = 'parentPost_meta_ASC',
  ParentPostMetaAscNullsFirst = 'parentPost_meta_ASC_NULLS_FIRST',
  ParentPostMetaDesc = 'parentPost_meta_DESC',
  ParentPostMetaDescNullsLast = 'parentPost_meta_DESC_NULLS_LAST',
  ParentPostProposalIndexAsc = 'parentPost_proposalIndex_ASC',
  ParentPostProposalIndexAscNullsFirst = 'parentPost_proposalIndex_ASC_NULLS_FIRST',
  ParentPostProposalIndexDesc = 'parentPost_proposalIndex_DESC',
  ParentPostProposalIndexDescNullsLast = 'parentPost_proposalIndex_DESC_NULLS_LAST',
  ParentPostPublicRepliesCountAsc = 'parentPost_publicRepliesCount_ASC',
  ParentPostPublicRepliesCountAscNullsFirst = 'parentPost_publicRepliesCount_ASC_NULLS_FIRST',
  ParentPostPublicRepliesCountDesc = 'parentPost_publicRepliesCount_DESC',
  ParentPostPublicRepliesCountDescNullsLast = 'parentPost_publicRepliesCount_DESC_NULLS_LAST',
  ParentPostReactionsCountAsc = 'parentPost_reactionsCount_ASC',
  ParentPostReactionsCountAscNullsFirst = 'parentPost_reactionsCount_ASC_NULLS_FIRST',
  ParentPostReactionsCountDesc = 'parentPost_reactionsCount_DESC',
  ParentPostReactionsCountDescNullsLast = 'parentPost_reactionsCount_DESC_NULLS_LAST',
  ParentPostRepliesCountAsc = 'parentPost_repliesCount_ASC',
  ParentPostRepliesCountAscNullsFirst = 'parentPost_repliesCount_ASC_NULLS_FIRST',
  ParentPostRepliesCountDesc = 'parentPost_repliesCount_DESC',
  ParentPostRepliesCountDescNullsLast = 'parentPost_repliesCount_DESC_NULLS_LAST',
  ParentPostSharesCountAsc = 'parentPost_sharesCount_ASC',
  ParentPostSharesCountAscNullsFirst = 'parentPost_sharesCount_ASC_NULLS_FIRST',
  ParentPostSharesCountDesc = 'parentPost_sharesCount_DESC',
  ParentPostSharesCountDescNullsLast = 'parentPost_sharesCount_DESC_NULLS_LAST',
  ParentPostSlugAsc = 'parentPost_slug_ASC',
  ParentPostSlugAscNullsFirst = 'parentPost_slug_ASC_NULLS_FIRST',
  ParentPostSlugDesc = 'parentPost_slug_DESC',
  ParentPostSlugDescNullsLast = 'parentPost_slug_DESC_NULLS_LAST',
  ParentPostSummaryAsc = 'parentPost_summary_ASC',
  ParentPostSummaryAscNullsFirst = 'parentPost_summary_ASC_NULLS_FIRST',
  ParentPostSummaryDesc = 'parentPost_summary_DESC',
  ParentPostSummaryDescNullsLast = 'parentPost_summary_DESC_NULLS_LAST',
  ParentPostTagsOriginalAsc = 'parentPost_tagsOriginal_ASC',
  ParentPostTagsOriginalAscNullsFirst = 'parentPost_tagsOriginal_ASC_NULLS_FIRST',
  ParentPostTagsOriginalDesc = 'parentPost_tagsOriginal_DESC',
  ParentPostTagsOriginalDescNullsLast = 'parentPost_tagsOriginal_DESC_NULLS_LAST',
  ParentPostTitleAsc = 'parentPost_title_ASC',
  ParentPostTitleAscNullsFirst = 'parentPost_title_ASC_NULLS_FIRST',
  ParentPostTitleDesc = 'parentPost_title_DESC',
  ParentPostTitleDescNullsLast = 'parentPost_title_DESC_NULLS_LAST',
  ParentPostTweetIdAsc = 'parentPost_tweetId_ASC',
  ParentPostTweetIdAscNullsFirst = 'parentPost_tweetId_ASC_NULLS_FIRST',
  ParentPostTweetIdDesc = 'parentPost_tweetId_DESC',
  ParentPostTweetIdDescNullsLast = 'parentPost_tweetId_DESC_NULLS_LAST',
  ParentPostUpdatedAtTimeAsc = 'parentPost_updatedAtTime_ASC',
  ParentPostUpdatedAtTimeAscNullsFirst = 'parentPost_updatedAtTime_ASC_NULLS_FIRST',
  ParentPostUpdatedAtTimeDesc = 'parentPost_updatedAtTime_DESC',
  ParentPostUpdatedAtTimeDescNullsLast = 'parentPost_updatedAtTime_DESC_NULLS_LAST',
  ParentPostUpvotesCountAsc = 'parentPost_upvotesCount_ASC',
  ParentPostUpvotesCountAscNullsFirst = 'parentPost_upvotesCount_ASC_NULLS_FIRST',
  ParentPostUpvotesCountDesc = 'parentPost_upvotesCount_DESC',
  ParentPostUpvotesCountDescNullsLast = 'parentPost_upvotesCount_DESC_NULLS_LAST',
  RecipientFollowersCountAsc = 'recipient_followersCount_ASC',
  RecipientFollowersCountAscNullsFirst = 'recipient_followersCount_ASC_NULLS_FIRST',
  RecipientFollowersCountDesc = 'recipient_followersCount_DESC',
  RecipientFollowersCountDescNullsLast = 'recipient_followersCount_DESC_NULLS_LAST',
  RecipientFollowingAccountsCountAsc = 'recipient_followingAccountsCount_ASC',
  RecipientFollowingAccountsCountAscNullsFirst = 'recipient_followingAccountsCount_ASC_NULLS_FIRST',
  RecipientFollowingAccountsCountDesc = 'recipient_followingAccountsCount_DESC',
  RecipientFollowingAccountsCountDescNullsLast = 'recipient_followingAccountsCount_DESC_NULLS_LAST',
  RecipientFollowingPostsCountAsc = 'recipient_followingPostsCount_ASC',
  RecipientFollowingPostsCountAscNullsFirst = 'recipient_followingPostsCount_ASC_NULLS_FIRST',
  RecipientFollowingPostsCountDesc = 'recipient_followingPostsCount_DESC',
  RecipientFollowingPostsCountDescNullsLast = 'recipient_followingPostsCount_DESC_NULLS_LAST',
  RecipientFollowingSpacesCountAsc = 'recipient_followingSpacesCount_ASC',
  RecipientFollowingSpacesCountAscNullsFirst = 'recipient_followingSpacesCount_ASC_NULLS_FIRST',
  RecipientFollowingSpacesCountDesc = 'recipient_followingSpacesCount_DESC',
  RecipientFollowingSpacesCountDescNullsLast = 'recipient_followingSpacesCount_DESC_NULLS_LAST',
  RecipientIdAsc = 'recipient_id_ASC',
  RecipientIdAscNullsFirst = 'recipient_id_ASC_NULLS_FIRST',
  RecipientIdDesc = 'recipient_id_DESC',
  RecipientIdDescNullsLast = 'recipient_id_DESC_NULLS_LAST',
  RecipientOwnedPostsCountAsc = 'recipient_ownedPostsCount_ASC',
  RecipientOwnedPostsCountAscNullsFirst = 'recipient_ownedPostsCount_ASC_NULLS_FIRST',
  RecipientOwnedPostsCountDesc = 'recipient_ownedPostsCount_DESC',
  RecipientOwnedPostsCountDescNullsLast = 'recipient_ownedPostsCount_DESC_NULLS_LAST',
  RecipientUpdatedAtBlockAsc = 'recipient_updatedAtBlock_ASC',
  RecipientUpdatedAtBlockAscNullsFirst = 'recipient_updatedAtBlock_ASC_NULLS_FIRST',
  RecipientUpdatedAtBlockDesc = 'recipient_updatedAtBlock_DESC',
  RecipientUpdatedAtBlockDescNullsLast = 'recipient_updatedAtBlock_DESC_NULLS_LAST',
  RecipientUpdatedAtTimeAsc = 'recipient_updatedAtTime_ASC',
  RecipientUpdatedAtTimeAscNullsFirst = 'recipient_updatedAtTime_ASC_NULLS_FIRST',
  RecipientUpdatedAtTimeDesc = 'recipient_updatedAtTime_DESC',
  RecipientUpdatedAtTimeDescNullsLast = 'recipient_updatedAtTime_DESC_NULLS_LAST',
  ToEvmIdAsc = 'toEvm_id_ASC',
  ToEvmIdAscNullsFirst = 'toEvm_id_ASC_NULLS_FIRST',
  ToEvmIdDesc = 'toEvm_id_DESC',
  ToEvmIdDescNullsLast = 'toEvm_id_DESC_NULLS_LAST',
  ToSubstrateFollowersCountAsc = 'toSubstrate_followersCount_ASC',
  ToSubstrateFollowersCountAscNullsFirst = 'toSubstrate_followersCount_ASC_NULLS_FIRST',
  ToSubstrateFollowersCountDesc = 'toSubstrate_followersCount_DESC',
  ToSubstrateFollowersCountDescNullsLast = 'toSubstrate_followersCount_DESC_NULLS_LAST',
  ToSubstrateFollowingAccountsCountAsc = 'toSubstrate_followingAccountsCount_ASC',
  ToSubstrateFollowingAccountsCountAscNullsFirst = 'toSubstrate_followingAccountsCount_ASC_NULLS_FIRST',
  ToSubstrateFollowingAccountsCountDesc = 'toSubstrate_followingAccountsCount_DESC',
  ToSubstrateFollowingAccountsCountDescNullsLast = 'toSubstrate_followingAccountsCount_DESC_NULLS_LAST',
  ToSubstrateFollowingPostsCountAsc = 'toSubstrate_followingPostsCount_ASC',
  ToSubstrateFollowingPostsCountAscNullsFirst = 'toSubstrate_followingPostsCount_ASC_NULLS_FIRST',
  ToSubstrateFollowingPostsCountDesc = 'toSubstrate_followingPostsCount_DESC',
  ToSubstrateFollowingPostsCountDescNullsLast = 'toSubstrate_followingPostsCount_DESC_NULLS_LAST',
  ToSubstrateFollowingSpacesCountAsc = 'toSubstrate_followingSpacesCount_ASC',
  ToSubstrateFollowingSpacesCountAscNullsFirst = 'toSubstrate_followingSpacesCount_ASC_NULLS_FIRST',
  ToSubstrateFollowingSpacesCountDesc = 'toSubstrate_followingSpacesCount_DESC',
  ToSubstrateFollowingSpacesCountDescNullsLast = 'toSubstrate_followingSpacesCount_DESC_NULLS_LAST',
  ToSubstrateIdAsc = 'toSubstrate_id_ASC',
  ToSubstrateIdAscNullsFirst = 'toSubstrate_id_ASC_NULLS_FIRST',
  ToSubstrateIdDesc = 'toSubstrate_id_DESC',
  ToSubstrateIdDescNullsLast = 'toSubstrate_id_DESC_NULLS_LAST',
  ToSubstrateOwnedPostsCountAsc = 'toSubstrate_ownedPostsCount_ASC',
  ToSubstrateOwnedPostsCountAscNullsFirst = 'toSubstrate_ownedPostsCount_ASC_NULLS_FIRST',
  ToSubstrateOwnedPostsCountDesc = 'toSubstrate_ownedPostsCount_DESC',
  ToSubstrateOwnedPostsCountDescNullsLast = 'toSubstrate_ownedPostsCount_DESC_NULLS_LAST',
  ToSubstrateUpdatedAtBlockAsc = 'toSubstrate_updatedAtBlock_ASC',
  ToSubstrateUpdatedAtBlockAscNullsFirst = 'toSubstrate_updatedAtBlock_ASC_NULLS_FIRST',
  ToSubstrateUpdatedAtBlockDesc = 'toSubstrate_updatedAtBlock_DESC',
  ToSubstrateUpdatedAtBlockDescNullsLast = 'toSubstrate_updatedAtBlock_DESC_NULLS_LAST',
  ToSubstrateUpdatedAtTimeAsc = 'toSubstrate_updatedAtTime_ASC',
  ToSubstrateUpdatedAtTimeAscNullsFirst = 'toSubstrate_updatedAtTime_ASC_NULLS_FIRST',
  ToSubstrateUpdatedAtTimeDesc = 'toSubstrate_updatedAtTime_DESC',
  ToSubstrateUpdatedAtTimeDescNullsLast = 'toSubstrate_updatedAtTime_DESC_NULLS_LAST',
  TokenAsc = 'token_ASC',
  TokenAscNullsFirst = 'token_ASC_NULLS_FIRST',
  TokenDesc = 'token_DESC',
  TokenDescNullsLast = 'token_DESC_NULLS_LAST',
  TxHashAsc = 'txHash_ASC',
  TxHashAscNullsFirst = 'txHash_ASC_NULLS_FIRST',
  TxHashDesc = 'txHash_DESC',
  TxHashDescNullsLast = 'txHash_DESC_NULLS_LAST',
  UrlAsc = 'url_ASC',
  UrlAscNullsFirst = 'url_ASC_NULLS_FIRST',
  UrlDesc = 'url_DESC',
  UrlDescNullsLast = 'url_DESC_NULLS_LAST'
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
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST'
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
  ActiveAscNullsFirst = 'active_ASC_NULLS_FIRST',
  ActiveDesc = 'active_DESC',
  ActiveDescNullsLast = 'active_DESC_NULLS_LAST',
  CreatedAtBlockAsc = 'createdAtBlock_ASC',
  CreatedAtBlockAscNullsFirst = 'createdAtBlock_ASC_NULLS_FIRST',
  CreatedAtBlockDesc = 'createdAtBlock_DESC',
  CreatedAtBlockDescNullsLast = 'createdAtBlock_DESC_NULLS_LAST',
  CreatedAtTimeAsc = 'createdAtTime_ASC',
  CreatedAtTimeAscNullsFirst = 'createdAtTime_ASC_NULLS_FIRST',
  CreatedAtTimeDesc = 'createdAtTime_DESC',
  CreatedAtTimeDescNullsLast = 'createdAtTime_DESC_NULLS_LAST',
  EvmAccountIdAsc = 'evmAccount_id_ASC',
  EvmAccountIdAscNullsFirst = 'evmAccount_id_ASC_NULLS_FIRST',
  EvmAccountIdDesc = 'evmAccount_id_DESC',
  EvmAccountIdDescNullsLast = 'evmAccount_id_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  SubstrateAccountFollowersCountAsc = 'substrateAccount_followersCount_ASC',
  SubstrateAccountFollowersCountAscNullsFirst = 'substrateAccount_followersCount_ASC_NULLS_FIRST',
  SubstrateAccountFollowersCountDesc = 'substrateAccount_followersCount_DESC',
  SubstrateAccountFollowersCountDescNullsLast = 'substrateAccount_followersCount_DESC_NULLS_LAST',
  SubstrateAccountFollowingAccountsCountAsc = 'substrateAccount_followingAccountsCount_ASC',
  SubstrateAccountFollowingAccountsCountAscNullsFirst = 'substrateAccount_followingAccountsCount_ASC_NULLS_FIRST',
  SubstrateAccountFollowingAccountsCountDesc = 'substrateAccount_followingAccountsCount_DESC',
  SubstrateAccountFollowingAccountsCountDescNullsLast = 'substrateAccount_followingAccountsCount_DESC_NULLS_LAST',
  SubstrateAccountFollowingPostsCountAsc = 'substrateAccount_followingPostsCount_ASC',
  SubstrateAccountFollowingPostsCountAscNullsFirst = 'substrateAccount_followingPostsCount_ASC_NULLS_FIRST',
  SubstrateAccountFollowingPostsCountDesc = 'substrateAccount_followingPostsCount_DESC',
  SubstrateAccountFollowingPostsCountDescNullsLast = 'substrateAccount_followingPostsCount_DESC_NULLS_LAST',
  SubstrateAccountFollowingSpacesCountAsc = 'substrateAccount_followingSpacesCount_ASC',
  SubstrateAccountFollowingSpacesCountAscNullsFirst = 'substrateAccount_followingSpacesCount_ASC_NULLS_FIRST',
  SubstrateAccountFollowingSpacesCountDesc = 'substrateAccount_followingSpacesCount_DESC',
  SubstrateAccountFollowingSpacesCountDescNullsLast = 'substrateAccount_followingSpacesCount_DESC_NULLS_LAST',
  SubstrateAccountIdAsc = 'substrateAccount_id_ASC',
  SubstrateAccountIdAscNullsFirst = 'substrateAccount_id_ASC_NULLS_FIRST',
  SubstrateAccountIdDesc = 'substrateAccount_id_DESC',
  SubstrateAccountIdDescNullsLast = 'substrateAccount_id_DESC_NULLS_LAST',
  SubstrateAccountOwnedPostsCountAsc = 'substrateAccount_ownedPostsCount_ASC',
  SubstrateAccountOwnedPostsCountAscNullsFirst = 'substrateAccount_ownedPostsCount_ASC_NULLS_FIRST',
  SubstrateAccountOwnedPostsCountDesc = 'substrateAccount_ownedPostsCount_DESC',
  SubstrateAccountOwnedPostsCountDescNullsLast = 'substrateAccount_ownedPostsCount_DESC_NULLS_LAST',
  SubstrateAccountUpdatedAtBlockAsc = 'substrateAccount_updatedAtBlock_ASC',
  SubstrateAccountUpdatedAtBlockAscNullsFirst = 'substrateAccount_updatedAtBlock_ASC_NULLS_FIRST',
  SubstrateAccountUpdatedAtBlockDesc = 'substrateAccount_updatedAtBlock_DESC',
  SubstrateAccountUpdatedAtBlockDescNullsLast = 'substrateAccount_updatedAtBlock_DESC_NULLS_LAST',
  SubstrateAccountUpdatedAtTimeAsc = 'substrateAccount_updatedAtTime_ASC',
  SubstrateAccountUpdatedAtTimeAscNullsFirst = 'substrateAccount_updatedAtTime_ASC_NULLS_FIRST',
  SubstrateAccountUpdatedAtTimeDesc = 'substrateAccount_updatedAtTime_DESC',
  SubstrateAccountUpdatedAtTimeDescNullsLast = 'substrateAccount_updatedAtTime_DESC_NULLS_LAST'
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
  ContentExtensionAmountAscNullsFirst = 'contentExtension_amount_ASC_NULLS_FIRST',
  ContentExtensionAmountDesc = 'contentExtension_amount_DESC',
  ContentExtensionAmountDescNullsLast = 'contentExtension_amount_DESC_NULLS_LAST',
  ContentExtensionChainAsc = 'contentExtension_chain_ASC',
  ContentExtensionChainAscNullsFirst = 'contentExtension_chain_ASC_NULLS_FIRST',
  ContentExtensionChainDesc = 'contentExtension_chain_DESC',
  ContentExtensionChainDescNullsLast = 'contentExtension_chain_DESC_NULLS_LAST',
  ContentExtensionCollectionIdAsc = 'contentExtension_collectionId_ASC',
  ContentExtensionCollectionIdAscNullsFirst = 'contentExtension_collectionId_ASC_NULLS_FIRST',
  ContentExtensionCollectionIdDesc = 'contentExtension_collectionId_DESC',
  ContentExtensionCollectionIdDescNullsLast = 'contentExtension_collectionId_DESC_NULLS_LAST',
  ContentExtensionDecimalsAsc = 'contentExtension_decimals_ASC',
  ContentExtensionDecimalsAscNullsFirst = 'contentExtension_decimals_ASC_NULLS_FIRST',
  ContentExtensionDecimalsDesc = 'contentExtension_decimals_DESC',
  ContentExtensionDecimalsDescNullsLast = 'contentExtension_decimals_DESC_NULLS_LAST',
  ContentExtensionExtensionSchemaIdAsc = 'contentExtension_extensionSchemaId_ASC',
  ContentExtensionExtensionSchemaIdAscNullsFirst = 'contentExtension_extensionSchemaId_ASC_NULLS_FIRST',
  ContentExtensionExtensionSchemaIdDesc = 'contentExtension_extensionSchemaId_DESC',
  ContentExtensionExtensionSchemaIdDescNullsLast = 'contentExtension_extensionSchemaId_DESC_NULLS_LAST',
  ContentExtensionIdAsc = 'contentExtension_id_ASC',
  ContentExtensionIdAscNullsFirst = 'contentExtension_id_ASC_NULLS_FIRST',
  ContentExtensionIdDesc = 'contentExtension_id_DESC',
  ContentExtensionIdDescNullsLast = 'contentExtension_id_DESC_NULLS_LAST',
  ContentExtensionImageAsc = 'contentExtension_image_ASC',
  ContentExtensionImageAscNullsFirst = 'contentExtension_image_ASC_NULLS_FIRST',
  ContentExtensionImageDesc = 'contentExtension_image_DESC',
  ContentExtensionImageDescNullsLast = 'contentExtension_image_DESC_NULLS_LAST',
  ContentExtensionMessageAsc = 'contentExtension_message_ASC',
  ContentExtensionMessageAscNullsFirst = 'contentExtension_message_ASC_NULLS_FIRST',
  ContentExtensionMessageDesc = 'contentExtension_message_DESC',
  ContentExtensionMessageDescNullsLast = 'contentExtension_message_DESC_NULLS_LAST',
  ContentExtensionNftIdAsc = 'contentExtension_nftId_ASC',
  ContentExtensionNftIdAscNullsFirst = 'contentExtension_nftId_ASC_NULLS_FIRST',
  ContentExtensionNftIdDesc = 'contentExtension_nftId_DESC',
  ContentExtensionNftIdDescNullsLast = 'contentExtension_nftId_DESC_NULLS_LAST',
  ContentExtensionNonceAsc = 'contentExtension_nonce_ASC',
  ContentExtensionNonceAscNullsFirst = 'contentExtension_nonce_ASC_NULLS_FIRST',
  ContentExtensionNonceDesc = 'contentExtension_nonce_DESC',
  ContentExtensionNonceDescNullsLast = 'contentExtension_nonce_DESC_NULLS_LAST',
  ContentExtensionTokenAsc = 'contentExtension_token_ASC',
  ContentExtensionTokenAscNullsFirst = 'contentExtension_token_ASC_NULLS_FIRST',
  ContentExtensionTokenDesc = 'contentExtension_token_DESC',
  ContentExtensionTokenDescNullsLast = 'contentExtension_token_DESC_NULLS_LAST',
  ContentExtensionTxHashAsc = 'contentExtension_txHash_ASC',
  ContentExtensionTxHashAscNullsFirst = 'contentExtension_txHash_ASC_NULLS_FIRST',
  ContentExtensionTxHashDesc = 'contentExtension_txHash_DESC',
  ContentExtensionTxHashDescNullsLast = 'contentExtension_txHash_DESC_NULLS_LAST',
  ContentExtensionUrlAsc = 'contentExtension_url_ASC',
  ContentExtensionUrlAscNullsFirst = 'contentExtension_url_ASC_NULLS_FIRST',
  ContentExtensionUrlDesc = 'contentExtension_url_DESC',
  ContentExtensionUrlDescNullsLast = 'contentExtension_url_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  PostBodyAsc = 'post_body_ASC',
  PostBodyAscNullsFirst = 'post_body_ASC_NULLS_FIRST',
  PostBodyDesc = 'post_body_DESC',
  PostBodyDescNullsLast = 'post_body_DESC_NULLS_LAST',
  PostCanonicalAsc = 'post_canonical_ASC',
  PostCanonicalAscNullsFirst = 'post_canonical_ASC_NULLS_FIRST',
  PostCanonicalDesc = 'post_canonical_DESC',
  PostCanonicalDescNullsLast = 'post_canonical_DESC_NULLS_LAST',
  PostContentAsc = 'post_content_ASC',
  PostContentAscNullsFirst = 'post_content_ASC_NULLS_FIRST',
  PostContentDesc = 'post_content_DESC',
  PostContentDescNullsLast = 'post_content_DESC_NULLS_LAST',
  PostCreatedAtBlockAsc = 'post_createdAtBlock_ASC',
  PostCreatedAtBlockAscNullsFirst = 'post_createdAtBlock_ASC_NULLS_FIRST',
  PostCreatedAtBlockDesc = 'post_createdAtBlock_DESC',
  PostCreatedAtBlockDescNullsLast = 'post_createdAtBlock_DESC_NULLS_LAST',
  PostCreatedAtTimeAsc = 'post_createdAtTime_ASC',
  PostCreatedAtTimeAscNullsFirst = 'post_createdAtTime_ASC_NULLS_FIRST',
  PostCreatedAtTimeDesc = 'post_createdAtTime_DESC',
  PostCreatedAtTimeDescNullsLast = 'post_createdAtTime_DESC_NULLS_LAST',
  PostCreatedOnDayAsc = 'post_createdOnDay_ASC',
  PostCreatedOnDayAscNullsFirst = 'post_createdOnDay_ASC_NULLS_FIRST',
  PostCreatedOnDayDesc = 'post_createdOnDay_DESC',
  PostCreatedOnDayDescNullsLast = 'post_createdOnDay_DESC_NULLS_LAST',
  PostDownvotesCountAsc = 'post_downvotesCount_ASC',
  PostDownvotesCountAscNullsFirst = 'post_downvotesCount_ASC_NULLS_FIRST',
  PostDownvotesCountDesc = 'post_downvotesCount_DESC',
  PostDownvotesCountDescNullsLast = 'post_downvotesCount_DESC_NULLS_LAST',
  PostFollowersCountAsc = 'post_followersCount_ASC',
  PostFollowersCountAscNullsFirst = 'post_followersCount_ASC_NULLS_FIRST',
  PostFollowersCountDesc = 'post_followersCount_DESC',
  PostFollowersCountDescNullsLast = 'post_followersCount_DESC_NULLS_LAST',
  PostFormatAsc = 'post_format_ASC',
  PostFormatAscNullsFirst = 'post_format_ASC_NULLS_FIRST',
  PostFormatDesc = 'post_format_DESC',
  PostFormatDescNullsLast = 'post_format_DESC_NULLS_LAST',
  PostHiddenRepliesCountAsc = 'post_hiddenRepliesCount_ASC',
  PostHiddenRepliesCountAscNullsFirst = 'post_hiddenRepliesCount_ASC_NULLS_FIRST',
  PostHiddenRepliesCountDesc = 'post_hiddenRepliesCount_DESC',
  PostHiddenRepliesCountDescNullsLast = 'post_hiddenRepliesCount_DESC_NULLS_LAST',
  PostHiddenAsc = 'post_hidden_ASC',
  PostHiddenAscNullsFirst = 'post_hidden_ASC_NULLS_FIRST',
  PostHiddenDesc = 'post_hidden_DESC',
  PostHiddenDescNullsLast = 'post_hidden_DESC_NULLS_LAST',
  PostIdAsc = 'post_id_ASC',
  PostIdAscNullsFirst = 'post_id_ASC_NULLS_FIRST',
  PostIdDesc = 'post_id_DESC',
  PostIdDescNullsLast = 'post_id_DESC_NULLS_LAST',
  PostImageAsc = 'post_image_ASC',
  PostImageAscNullsFirst = 'post_image_ASC_NULLS_FIRST',
  PostImageDesc = 'post_image_DESC',
  PostImageDescNullsLast = 'post_image_DESC_NULLS_LAST',
  PostInReplyToKindAsc = 'post_inReplyToKind_ASC',
  PostInReplyToKindAscNullsFirst = 'post_inReplyToKind_ASC_NULLS_FIRST',
  PostInReplyToKindDesc = 'post_inReplyToKind_DESC',
  PostInReplyToKindDescNullsLast = 'post_inReplyToKind_DESC_NULLS_LAST',
  PostIsCommentAsc = 'post_isComment_ASC',
  PostIsCommentAscNullsFirst = 'post_isComment_ASC_NULLS_FIRST',
  PostIsCommentDesc = 'post_isComment_DESC',
  PostIsCommentDescNullsLast = 'post_isComment_DESC_NULLS_LAST',
  PostIsShowMoreAsc = 'post_isShowMore_ASC',
  PostIsShowMoreAscNullsFirst = 'post_isShowMore_ASC_NULLS_FIRST',
  PostIsShowMoreDesc = 'post_isShowMore_DESC',
  PostIsShowMoreDescNullsLast = 'post_isShowMore_DESC_NULLS_LAST',
  PostKindAsc = 'post_kind_ASC',
  PostKindAscNullsFirst = 'post_kind_ASC_NULLS_FIRST',
  PostKindDesc = 'post_kind_DESC',
  PostKindDescNullsLast = 'post_kind_DESC_NULLS_LAST',
  PostLinkAsc = 'post_link_ASC',
  PostLinkAscNullsFirst = 'post_link_ASC_NULLS_FIRST',
  PostLinkDesc = 'post_link_DESC',
  PostLinkDescNullsLast = 'post_link_DESC_NULLS_LAST',
  PostMetaAsc = 'post_meta_ASC',
  PostMetaAscNullsFirst = 'post_meta_ASC_NULLS_FIRST',
  PostMetaDesc = 'post_meta_DESC',
  PostMetaDescNullsLast = 'post_meta_DESC_NULLS_LAST',
  PostProposalIndexAsc = 'post_proposalIndex_ASC',
  PostProposalIndexAscNullsFirst = 'post_proposalIndex_ASC_NULLS_FIRST',
  PostProposalIndexDesc = 'post_proposalIndex_DESC',
  PostProposalIndexDescNullsLast = 'post_proposalIndex_DESC_NULLS_LAST',
  PostPublicRepliesCountAsc = 'post_publicRepliesCount_ASC',
  PostPublicRepliesCountAscNullsFirst = 'post_publicRepliesCount_ASC_NULLS_FIRST',
  PostPublicRepliesCountDesc = 'post_publicRepliesCount_DESC',
  PostPublicRepliesCountDescNullsLast = 'post_publicRepliesCount_DESC_NULLS_LAST',
  PostReactionsCountAsc = 'post_reactionsCount_ASC',
  PostReactionsCountAscNullsFirst = 'post_reactionsCount_ASC_NULLS_FIRST',
  PostReactionsCountDesc = 'post_reactionsCount_DESC',
  PostReactionsCountDescNullsLast = 'post_reactionsCount_DESC_NULLS_LAST',
  PostRepliesCountAsc = 'post_repliesCount_ASC',
  PostRepliesCountAscNullsFirst = 'post_repliesCount_ASC_NULLS_FIRST',
  PostRepliesCountDesc = 'post_repliesCount_DESC',
  PostRepliesCountDescNullsLast = 'post_repliesCount_DESC_NULLS_LAST',
  PostSharesCountAsc = 'post_sharesCount_ASC',
  PostSharesCountAscNullsFirst = 'post_sharesCount_ASC_NULLS_FIRST',
  PostSharesCountDesc = 'post_sharesCount_DESC',
  PostSharesCountDescNullsLast = 'post_sharesCount_DESC_NULLS_LAST',
  PostSlugAsc = 'post_slug_ASC',
  PostSlugAscNullsFirst = 'post_slug_ASC_NULLS_FIRST',
  PostSlugDesc = 'post_slug_DESC',
  PostSlugDescNullsLast = 'post_slug_DESC_NULLS_LAST',
  PostSummaryAsc = 'post_summary_ASC',
  PostSummaryAscNullsFirst = 'post_summary_ASC_NULLS_FIRST',
  PostSummaryDesc = 'post_summary_DESC',
  PostSummaryDescNullsLast = 'post_summary_DESC_NULLS_LAST',
  PostTagsOriginalAsc = 'post_tagsOriginal_ASC',
  PostTagsOriginalAscNullsFirst = 'post_tagsOriginal_ASC_NULLS_FIRST',
  PostTagsOriginalDesc = 'post_tagsOriginal_DESC',
  PostTagsOriginalDescNullsLast = 'post_tagsOriginal_DESC_NULLS_LAST',
  PostTitleAsc = 'post_title_ASC',
  PostTitleAscNullsFirst = 'post_title_ASC_NULLS_FIRST',
  PostTitleDesc = 'post_title_DESC',
  PostTitleDescNullsLast = 'post_title_DESC_NULLS_LAST',
  PostTweetIdAsc = 'post_tweetId_ASC',
  PostTweetIdAscNullsFirst = 'post_tweetId_ASC_NULLS_FIRST',
  PostTweetIdDesc = 'post_tweetId_DESC',
  PostTweetIdDescNullsLast = 'post_tweetId_DESC_NULLS_LAST',
  PostUpdatedAtTimeAsc = 'post_updatedAtTime_ASC',
  PostUpdatedAtTimeAscNullsFirst = 'post_updatedAtTime_ASC_NULLS_FIRST',
  PostUpdatedAtTimeDesc = 'post_updatedAtTime_DESC',
  PostUpdatedAtTimeDescNullsLast = 'post_updatedAtTime_DESC_NULLS_LAST',
  PostUpvotesCountAsc = 'post_upvotesCount_ASC',
  PostUpvotesCountAscNullsFirst = 'post_upvotesCount_ASC_NULLS_FIRST',
  PostUpvotesCountDesc = 'post_upvotesCount_DESC',
  PostUpvotesCountDescNullsLast = 'post_upvotesCount_DESC_NULLS_LAST',
  ResourceTypeAsc = 'resourceType_ASC',
  ResourceTypeAscNullsFirst = 'resourceType_ASC_NULLS_FIRST',
  ResourceTypeDesc = 'resourceType_DESC',
  ResourceTypeDescNullsLast = 'resourceType_DESC_NULLS_LAST',
  SpaceAboutAsc = 'space_about_ASC',
  SpaceAboutAscNullsFirst = 'space_about_ASC_NULLS_FIRST',
  SpaceAboutDesc = 'space_about_DESC',
  SpaceAboutDescNullsLast = 'space_about_DESC_NULLS_LAST',
  SpaceCanEveryoneCreatePostsAsc = 'space_canEveryoneCreatePosts_ASC',
  SpaceCanEveryoneCreatePostsAscNullsFirst = 'space_canEveryoneCreatePosts_ASC_NULLS_FIRST',
  SpaceCanEveryoneCreatePostsDesc = 'space_canEveryoneCreatePosts_DESC',
  SpaceCanEveryoneCreatePostsDescNullsLast = 'space_canEveryoneCreatePosts_DESC_NULLS_LAST',
  SpaceCanFollowerCreatePostsAsc = 'space_canFollowerCreatePosts_ASC',
  SpaceCanFollowerCreatePostsAscNullsFirst = 'space_canFollowerCreatePosts_ASC_NULLS_FIRST',
  SpaceCanFollowerCreatePostsDesc = 'space_canFollowerCreatePosts_DESC',
  SpaceCanFollowerCreatePostsDescNullsLast = 'space_canFollowerCreatePosts_DESC_NULLS_LAST',
  SpaceContentAsc = 'space_content_ASC',
  SpaceContentAscNullsFirst = 'space_content_ASC_NULLS_FIRST',
  SpaceContentDesc = 'space_content_DESC',
  SpaceContentDescNullsLast = 'space_content_DESC_NULLS_LAST',
  SpaceCreatedAtBlockAsc = 'space_createdAtBlock_ASC',
  SpaceCreatedAtBlockAscNullsFirst = 'space_createdAtBlock_ASC_NULLS_FIRST',
  SpaceCreatedAtBlockDesc = 'space_createdAtBlock_DESC',
  SpaceCreatedAtBlockDescNullsLast = 'space_createdAtBlock_DESC_NULLS_LAST',
  SpaceCreatedAtTimeAsc = 'space_createdAtTime_ASC',
  SpaceCreatedAtTimeAscNullsFirst = 'space_createdAtTime_ASC_NULLS_FIRST',
  SpaceCreatedAtTimeDesc = 'space_createdAtTime_DESC',
  SpaceCreatedAtTimeDescNullsLast = 'space_createdAtTime_DESC_NULLS_LAST',
  SpaceCreatedOnDayAsc = 'space_createdOnDay_ASC',
  SpaceCreatedOnDayAscNullsFirst = 'space_createdOnDay_ASC_NULLS_FIRST',
  SpaceCreatedOnDayDesc = 'space_createdOnDay_DESC',
  SpaceCreatedOnDayDescNullsLast = 'space_createdOnDay_DESC_NULLS_LAST',
  SpaceEmailAsc = 'space_email_ASC',
  SpaceEmailAscNullsFirst = 'space_email_ASC_NULLS_FIRST',
  SpaceEmailDesc = 'space_email_DESC',
  SpaceEmailDescNullsLast = 'space_email_DESC_NULLS_LAST',
  SpaceFollowersCountAsc = 'space_followersCount_ASC',
  SpaceFollowersCountAscNullsFirst = 'space_followersCount_ASC_NULLS_FIRST',
  SpaceFollowersCountDesc = 'space_followersCount_DESC',
  SpaceFollowersCountDescNullsLast = 'space_followersCount_DESC_NULLS_LAST',
  SpaceFormatAsc = 'space_format_ASC',
  SpaceFormatAscNullsFirst = 'space_format_ASC_NULLS_FIRST',
  SpaceFormatDesc = 'space_format_DESC',
  SpaceFormatDescNullsLast = 'space_format_DESC_NULLS_LAST',
  SpaceHandleAsc = 'space_handle_ASC',
  SpaceHandleAscNullsFirst = 'space_handle_ASC_NULLS_FIRST',
  SpaceHandleDesc = 'space_handle_DESC',
  SpaceHandleDescNullsLast = 'space_handle_DESC_NULLS_LAST',
  SpaceHiddenPostsCountAsc = 'space_hiddenPostsCount_ASC',
  SpaceHiddenPostsCountAscNullsFirst = 'space_hiddenPostsCount_ASC_NULLS_FIRST',
  SpaceHiddenPostsCountDesc = 'space_hiddenPostsCount_DESC',
  SpaceHiddenPostsCountDescNullsLast = 'space_hiddenPostsCount_DESC_NULLS_LAST',
  SpaceHiddenAsc = 'space_hidden_ASC',
  SpaceHiddenAscNullsFirst = 'space_hidden_ASC_NULLS_FIRST',
  SpaceHiddenDesc = 'space_hidden_DESC',
  SpaceHiddenDescNullsLast = 'space_hidden_DESC_NULLS_LAST',
  SpaceIdAsc = 'space_id_ASC',
  SpaceIdAscNullsFirst = 'space_id_ASC_NULLS_FIRST',
  SpaceIdDesc = 'space_id_DESC',
  SpaceIdDescNullsLast = 'space_id_DESC_NULLS_LAST',
  SpaceImageAsc = 'space_image_ASC',
  SpaceImageAscNullsFirst = 'space_image_ASC_NULLS_FIRST',
  SpaceImageDesc = 'space_image_DESC',
  SpaceImageDescNullsLast = 'space_image_DESC_NULLS_LAST',
  SpaceInterestsOriginalAsc = 'space_interestsOriginal_ASC',
  SpaceInterestsOriginalAscNullsFirst = 'space_interestsOriginal_ASC_NULLS_FIRST',
  SpaceInterestsOriginalDesc = 'space_interestsOriginal_DESC',
  SpaceInterestsOriginalDescNullsLast = 'space_interestsOriginal_DESC_NULLS_LAST',
  SpaceIsShowMoreAsc = 'space_isShowMore_ASC',
  SpaceIsShowMoreAscNullsFirst = 'space_isShowMore_ASC_NULLS_FIRST',
  SpaceIsShowMoreDesc = 'space_isShowMore_DESC',
  SpaceIsShowMoreDescNullsLast = 'space_isShowMore_DESC_NULLS_LAST',
  SpaceLinksOriginalAsc = 'space_linksOriginal_ASC',
  SpaceLinksOriginalAscNullsFirst = 'space_linksOriginal_ASC_NULLS_FIRST',
  SpaceLinksOriginalDesc = 'space_linksOriginal_DESC',
  SpaceLinksOriginalDescNullsLast = 'space_linksOriginal_DESC_NULLS_LAST',
  SpaceNameAsc = 'space_name_ASC',
  SpaceNameAscNullsFirst = 'space_name_ASC_NULLS_FIRST',
  SpaceNameDesc = 'space_name_DESC',
  SpaceNameDescNullsLast = 'space_name_DESC_NULLS_LAST',
  SpacePostsCountAsc = 'space_postsCount_ASC',
  SpacePostsCountAscNullsFirst = 'space_postsCount_ASC_NULLS_FIRST',
  SpacePostsCountDesc = 'space_postsCount_DESC',
  SpacePostsCountDescNullsLast = 'space_postsCount_DESC_NULLS_LAST',
  SpaceProfileSourceAsc = 'space_profileSource_ASC',
  SpaceProfileSourceAscNullsFirst = 'space_profileSource_ASC_NULLS_FIRST',
  SpaceProfileSourceDesc = 'space_profileSource_DESC',
  SpaceProfileSourceDescNullsLast = 'space_profileSource_DESC_NULLS_LAST',
  SpacePublicPostsCountAsc = 'space_publicPostsCount_ASC',
  SpacePublicPostsCountAscNullsFirst = 'space_publicPostsCount_ASC_NULLS_FIRST',
  SpacePublicPostsCountDesc = 'space_publicPostsCount_DESC',
  SpacePublicPostsCountDescNullsLast = 'space_publicPostsCount_DESC_NULLS_LAST',
  SpaceSummaryAsc = 'space_summary_ASC',
  SpaceSummaryAscNullsFirst = 'space_summary_ASC_NULLS_FIRST',
  SpaceSummaryDesc = 'space_summary_DESC',
  SpaceSummaryDescNullsLast = 'space_summary_DESC_NULLS_LAST',
  SpaceTagsOriginalAsc = 'space_tagsOriginal_ASC',
  SpaceTagsOriginalAscNullsFirst = 'space_tagsOriginal_ASC_NULLS_FIRST',
  SpaceTagsOriginalDesc = 'space_tagsOriginal_DESC',
  SpaceTagsOriginalDescNullsLast = 'space_tagsOriginal_DESC_NULLS_LAST',
  SpaceUpdatedAtBlockAsc = 'space_updatedAtBlock_ASC',
  SpaceUpdatedAtBlockAscNullsFirst = 'space_updatedAtBlock_ASC_NULLS_FIRST',
  SpaceUpdatedAtBlockDesc = 'space_updatedAtBlock_DESC',
  SpaceUpdatedAtBlockDescNullsLast = 'space_updatedAtBlock_DESC_NULLS_LAST',
  SpaceUpdatedAtTimeAsc = 'space_updatedAtTime_ASC',
  SpaceUpdatedAtTimeAscNullsFirst = 'space_updatedAtTime_ASC_NULLS_FIRST',
  SpaceUpdatedAtTimeDesc = 'space_updatedAtTime_DESC',
  SpaceUpdatedAtTimeDescNullsLast = 'space_updatedAtTime_DESC_NULLS_LAST',
  SpaceUsernameAsc = 'space_username_ASC',
  SpaceUsernameAscNullsFirst = 'space_username_ASC_NULLS_FIRST',
  SpaceUsernameDesc = 'space_username_DESC',
  SpaceUsernameDescNullsLast = 'space_username_DESC_NULLS_LAST'
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
  BatchEndBlockNumberAscNullsFirst = 'batchEndBlockNumber_ASC_NULLS_FIRST',
  BatchEndBlockNumberDesc = 'batchEndBlockNumber_DESC',
  BatchEndBlockNumberDescNullsLast = 'batchEndBlockNumber_DESC_NULLS_LAST',
  BatchStartBlockNumberAsc = 'batchStartBlockNumber_ASC',
  BatchStartBlockNumberAscNullsFirst = 'batchStartBlockNumber_ASC_NULLS_FIRST',
  BatchStartBlockNumberDesc = 'batchStartBlockNumber_DESC',
  BatchStartBlockNumberDescNullsLast = 'batchStartBlockNumber_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST'
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
  BlockHeightAscNullsFirst = 'blockHeight_ASC_NULLS_FIRST',
  BlockHeightDesc = 'blockHeight_DESC',
  BlockHeightDescNullsLast = 'blockHeight_DESC_NULLS_LAST',
  CidAsc = 'cid_ASC',
  CidAscNullsFirst = 'cid_ASC_NULLS_FIRST',
  CidDesc = 'cid_DESC',
  CidDescNullsLast = 'cid_DESC_NULLS_LAST',
  ErrorMsgAsc = 'errorMsg_ASC',
  ErrorMsgAscNullsFirst = 'errorMsg_ASC_NULLS_FIRST',
  ErrorMsgDesc = 'errorMsg_DESC',
  ErrorMsgDescNullsLast = 'errorMsg_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST'
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
  AccountFollowersCountAscNullsFirst = 'account_followersCount_ASC_NULLS_FIRST',
  AccountFollowersCountDesc = 'account_followersCount_DESC',
  AccountFollowersCountDescNullsLast = 'account_followersCount_DESC_NULLS_LAST',
  AccountFollowingAccountsCountAsc = 'account_followingAccountsCount_ASC',
  AccountFollowingAccountsCountAscNullsFirst = 'account_followingAccountsCount_ASC_NULLS_FIRST',
  AccountFollowingAccountsCountDesc = 'account_followingAccountsCount_DESC',
  AccountFollowingAccountsCountDescNullsLast = 'account_followingAccountsCount_DESC_NULLS_LAST',
  AccountFollowingPostsCountAsc = 'account_followingPostsCount_ASC',
  AccountFollowingPostsCountAscNullsFirst = 'account_followingPostsCount_ASC_NULLS_FIRST',
  AccountFollowingPostsCountDesc = 'account_followingPostsCount_DESC',
  AccountFollowingPostsCountDescNullsLast = 'account_followingPostsCount_DESC_NULLS_LAST',
  AccountFollowingSpacesCountAsc = 'account_followingSpacesCount_ASC',
  AccountFollowingSpacesCountAscNullsFirst = 'account_followingSpacesCount_ASC_NULLS_FIRST',
  AccountFollowingSpacesCountDesc = 'account_followingSpacesCount_DESC',
  AccountFollowingSpacesCountDescNullsLast = 'account_followingSpacesCount_DESC_NULLS_LAST',
  AccountIdAsc = 'account_id_ASC',
  AccountIdAscNullsFirst = 'account_id_ASC_NULLS_FIRST',
  AccountIdDesc = 'account_id_DESC',
  AccountIdDescNullsLast = 'account_id_DESC_NULLS_LAST',
  AccountOwnedPostsCountAsc = 'account_ownedPostsCount_ASC',
  AccountOwnedPostsCountAscNullsFirst = 'account_ownedPostsCount_ASC_NULLS_FIRST',
  AccountOwnedPostsCountDesc = 'account_ownedPostsCount_DESC',
  AccountOwnedPostsCountDescNullsLast = 'account_ownedPostsCount_DESC_NULLS_LAST',
  AccountUpdatedAtBlockAsc = 'account_updatedAtBlock_ASC',
  AccountUpdatedAtBlockAscNullsFirst = 'account_updatedAtBlock_ASC_NULLS_FIRST',
  AccountUpdatedAtBlockDesc = 'account_updatedAtBlock_DESC',
  AccountUpdatedAtBlockDescNullsLast = 'account_updatedAtBlock_DESC_NULLS_LAST',
  AccountUpdatedAtTimeAsc = 'account_updatedAtTime_ASC',
  AccountUpdatedAtTimeAscNullsFirst = 'account_updatedAtTime_ASC_NULLS_FIRST',
  AccountUpdatedAtTimeDesc = 'account_updatedAtTime_DESC',
  AccountUpdatedAtTimeDescNullsLast = 'account_updatedAtTime_DESC_NULLS_LAST',
  ActivityAggCountAsc = 'activity_aggCount_ASC',
  ActivityAggCountAscNullsFirst = 'activity_aggCount_ASC_NULLS_FIRST',
  ActivityAggCountDesc = 'activity_aggCount_DESC',
  ActivityAggCountDescNullsLast = 'activity_aggCount_DESC_NULLS_LAST',
  ActivityAggregatedAsc = 'activity_aggregated_ASC',
  ActivityAggregatedAscNullsFirst = 'activity_aggregated_ASC_NULLS_FIRST',
  ActivityAggregatedDesc = 'activity_aggregated_DESC',
  ActivityAggregatedDescNullsLast = 'activity_aggregated_DESC_NULLS_LAST',
  ActivityBlockNumberAsc = 'activity_blockNumber_ASC',
  ActivityBlockNumberAscNullsFirst = 'activity_blockNumber_ASC_NULLS_FIRST',
  ActivityBlockNumberDesc = 'activity_blockNumber_DESC',
  ActivityBlockNumberDescNullsLast = 'activity_blockNumber_DESC_NULLS_LAST',
  ActivityDateAsc = 'activity_date_ASC',
  ActivityDateAscNullsFirst = 'activity_date_ASC_NULLS_FIRST',
  ActivityDateDesc = 'activity_date_DESC',
  ActivityDateDescNullsLast = 'activity_date_DESC_NULLS_LAST',
  ActivityEventIndexAsc = 'activity_eventIndex_ASC',
  ActivityEventIndexAscNullsFirst = 'activity_eventIndex_ASC_NULLS_FIRST',
  ActivityEventIndexDesc = 'activity_eventIndex_DESC',
  ActivityEventIndexDescNullsLast = 'activity_eventIndex_DESC_NULLS_LAST',
  ActivityEventAsc = 'activity_event_ASC',
  ActivityEventAscNullsFirst = 'activity_event_ASC_NULLS_FIRST',
  ActivityEventDesc = 'activity_event_DESC',
  ActivityEventDescNullsLast = 'activity_event_DESC_NULLS_LAST',
  ActivityIdAsc = 'activity_id_ASC',
  ActivityIdAscNullsFirst = 'activity_id_ASC_NULLS_FIRST',
  ActivityIdDesc = 'activity_id_DESC',
  ActivityIdDescNullsLast = 'activity_id_DESC_NULLS_LAST',
  ActivityUsernameAsc = 'activity_username_ASC',
  ActivityUsernameAscNullsFirst = 'activity_username_ASC_NULLS_FIRST',
  ActivityUsernameDesc = 'activity_username_DESC',
  ActivityUsernameDescNullsLast = 'activity_username_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST'
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
  AccountFollowersCountAscNullsFirst = 'account_followersCount_ASC_NULLS_FIRST',
  AccountFollowersCountDesc = 'account_followersCount_DESC',
  AccountFollowersCountDescNullsLast = 'account_followersCount_DESC_NULLS_LAST',
  AccountFollowingAccountsCountAsc = 'account_followingAccountsCount_ASC',
  AccountFollowingAccountsCountAscNullsFirst = 'account_followingAccountsCount_ASC_NULLS_FIRST',
  AccountFollowingAccountsCountDesc = 'account_followingAccountsCount_DESC',
  AccountFollowingAccountsCountDescNullsLast = 'account_followingAccountsCount_DESC_NULLS_LAST',
  AccountFollowingPostsCountAsc = 'account_followingPostsCount_ASC',
  AccountFollowingPostsCountAscNullsFirst = 'account_followingPostsCount_ASC_NULLS_FIRST',
  AccountFollowingPostsCountDesc = 'account_followingPostsCount_DESC',
  AccountFollowingPostsCountDescNullsLast = 'account_followingPostsCount_DESC_NULLS_LAST',
  AccountFollowingSpacesCountAsc = 'account_followingSpacesCount_ASC',
  AccountFollowingSpacesCountAscNullsFirst = 'account_followingSpacesCount_ASC_NULLS_FIRST',
  AccountFollowingSpacesCountDesc = 'account_followingSpacesCount_DESC',
  AccountFollowingSpacesCountDescNullsLast = 'account_followingSpacesCount_DESC_NULLS_LAST',
  AccountIdAsc = 'account_id_ASC',
  AccountIdAscNullsFirst = 'account_id_ASC_NULLS_FIRST',
  AccountIdDesc = 'account_id_DESC',
  AccountIdDescNullsLast = 'account_id_DESC_NULLS_LAST',
  AccountOwnedPostsCountAsc = 'account_ownedPostsCount_ASC',
  AccountOwnedPostsCountAscNullsFirst = 'account_ownedPostsCount_ASC_NULLS_FIRST',
  AccountOwnedPostsCountDesc = 'account_ownedPostsCount_DESC',
  AccountOwnedPostsCountDescNullsLast = 'account_ownedPostsCount_DESC_NULLS_LAST',
  AccountUpdatedAtBlockAsc = 'account_updatedAtBlock_ASC',
  AccountUpdatedAtBlockAscNullsFirst = 'account_updatedAtBlock_ASC_NULLS_FIRST',
  AccountUpdatedAtBlockDesc = 'account_updatedAtBlock_DESC',
  AccountUpdatedAtBlockDescNullsLast = 'account_updatedAtBlock_DESC_NULLS_LAST',
  AccountUpdatedAtTimeAsc = 'account_updatedAtTime_ASC',
  AccountUpdatedAtTimeAscNullsFirst = 'account_updatedAtTime_ASC_NULLS_FIRST',
  AccountUpdatedAtTimeDesc = 'account_updatedAtTime_DESC',
  AccountUpdatedAtTimeDescNullsLast = 'account_updatedAtTime_DESC_NULLS_LAST',
  ActivityAggCountAsc = 'activity_aggCount_ASC',
  ActivityAggCountAscNullsFirst = 'activity_aggCount_ASC_NULLS_FIRST',
  ActivityAggCountDesc = 'activity_aggCount_DESC',
  ActivityAggCountDescNullsLast = 'activity_aggCount_DESC_NULLS_LAST',
  ActivityAggregatedAsc = 'activity_aggregated_ASC',
  ActivityAggregatedAscNullsFirst = 'activity_aggregated_ASC_NULLS_FIRST',
  ActivityAggregatedDesc = 'activity_aggregated_DESC',
  ActivityAggregatedDescNullsLast = 'activity_aggregated_DESC_NULLS_LAST',
  ActivityBlockNumberAsc = 'activity_blockNumber_ASC',
  ActivityBlockNumberAscNullsFirst = 'activity_blockNumber_ASC_NULLS_FIRST',
  ActivityBlockNumberDesc = 'activity_blockNumber_DESC',
  ActivityBlockNumberDescNullsLast = 'activity_blockNumber_DESC_NULLS_LAST',
  ActivityDateAsc = 'activity_date_ASC',
  ActivityDateAscNullsFirst = 'activity_date_ASC_NULLS_FIRST',
  ActivityDateDesc = 'activity_date_DESC',
  ActivityDateDescNullsLast = 'activity_date_DESC_NULLS_LAST',
  ActivityEventIndexAsc = 'activity_eventIndex_ASC',
  ActivityEventIndexAscNullsFirst = 'activity_eventIndex_ASC_NULLS_FIRST',
  ActivityEventIndexDesc = 'activity_eventIndex_DESC',
  ActivityEventIndexDescNullsLast = 'activity_eventIndex_DESC_NULLS_LAST',
  ActivityEventAsc = 'activity_event_ASC',
  ActivityEventAscNullsFirst = 'activity_event_ASC_NULLS_FIRST',
  ActivityEventDesc = 'activity_event_DESC',
  ActivityEventDescNullsLast = 'activity_event_DESC_NULLS_LAST',
  ActivityIdAsc = 'activity_id_ASC',
  ActivityIdAscNullsFirst = 'activity_id_ASC_NULLS_FIRST',
  ActivityIdDesc = 'activity_id_DESC',
  ActivityIdDescNullsLast = 'activity_id_DESC_NULLS_LAST',
  ActivityUsernameAsc = 'activity_username_ASC',
  ActivityUsernameAscNullsFirst = 'activity_username_ASC_NULLS_FIRST',
  ActivityUsernameDesc = 'activity_username_DESC',
  ActivityUsernameDescNullsLast = 'activity_username_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST'
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
  FollowerAccountFollowersCountAscNullsFirst = 'followerAccount_followersCount_ASC_NULLS_FIRST',
  FollowerAccountFollowersCountDesc = 'followerAccount_followersCount_DESC',
  FollowerAccountFollowersCountDescNullsLast = 'followerAccount_followersCount_DESC_NULLS_LAST',
  FollowerAccountFollowingAccountsCountAsc = 'followerAccount_followingAccountsCount_ASC',
  FollowerAccountFollowingAccountsCountAscNullsFirst = 'followerAccount_followingAccountsCount_ASC_NULLS_FIRST',
  FollowerAccountFollowingAccountsCountDesc = 'followerAccount_followingAccountsCount_DESC',
  FollowerAccountFollowingAccountsCountDescNullsLast = 'followerAccount_followingAccountsCount_DESC_NULLS_LAST',
  FollowerAccountFollowingPostsCountAsc = 'followerAccount_followingPostsCount_ASC',
  FollowerAccountFollowingPostsCountAscNullsFirst = 'followerAccount_followingPostsCount_ASC_NULLS_FIRST',
  FollowerAccountFollowingPostsCountDesc = 'followerAccount_followingPostsCount_DESC',
  FollowerAccountFollowingPostsCountDescNullsLast = 'followerAccount_followingPostsCount_DESC_NULLS_LAST',
  FollowerAccountFollowingSpacesCountAsc = 'followerAccount_followingSpacesCount_ASC',
  FollowerAccountFollowingSpacesCountAscNullsFirst = 'followerAccount_followingSpacesCount_ASC_NULLS_FIRST',
  FollowerAccountFollowingSpacesCountDesc = 'followerAccount_followingSpacesCount_DESC',
  FollowerAccountFollowingSpacesCountDescNullsLast = 'followerAccount_followingSpacesCount_DESC_NULLS_LAST',
  FollowerAccountIdAsc = 'followerAccount_id_ASC',
  FollowerAccountIdAscNullsFirst = 'followerAccount_id_ASC_NULLS_FIRST',
  FollowerAccountIdDesc = 'followerAccount_id_DESC',
  FollowerAccountIdDescNullsLast = 'followerAccount_id_DESC_NULLS_LAST',
  FollowerAccountOwnedPostsCountAsc = 'followerAccount_ownedPostsCount_ASC',
  FollowerAccountOwnedPostsCountAscNullsFirst = 'followerAccount_ownedPostsCount_ASC_NULLS_FIRST',
  FollowerAccountOwnedPostsCountDesc = 'followerAccount_ownedPostsCount_DESC',
  FollowerAccountOwnedPostsCountDescNullsLast = 'followerAccount_ownedPostsCount_DESC_NULLS_LAST',
  FollowerAccountUpdatedAtBlockAsc = 'followerAccount_updatedAtBlock_ASC',
  FollowerAccountUpdatedAtBlockAscNullsFirst = 'followerAccount_updatedAtBlock_ASC_NULLS_FIRST',
  FollowerAccountUpdatedAtBlockDesc = 'followerAccount_updatedAtBlock_DESC',
  FollowerAccountUpdatedAtBlockDescNullsLast = 'followerAccount_updatedAtBlock_DESC_NULLS_LAST',
  FollowerAccountUpdatedAtTimeAsc = 'followerAccount_updatedAtTime_ASC',
  FollowerAccountUpdatedAtTimeAscNullsFirst = 'followerAccount_updatedAtTime_ASC_NULLS_FIRST',
  FollowerAccountUpdatedAtTimeDesc = 'followerAccount_updatedAtTime_DESC',
  FollowerAccountUpdatedAtTimeDescNullsLast = 'followerAccount_updatedAtTime_DESC_NULLS_LAST',
  FollowingPostBodyAsc = 'followingPost_body_ASC',
  FollowingPostBodyAscNullsFirst = 'followingPost_body_ASC_NULLS_FIRST',
  FollowingPostBodyDesc = 'followingPost_body_DESC',
  FollowingPostBodyDescNullsLast = 'followingPost_body_DESC_NULLS_LAST',
  FollowingPostCanonicalAsc = 'followingPost_canonical_ASC',
  FollowingPostCanonicalAscNullsFirst = 'followingPost_canonical_ASC_NULLS_FIRST',
  FollowingPostCanonicalDesc = 'followingPost_canonical_DESC',
  FollowingPostCanonicalDescNullsLast = 'followingPost_canonical_DESC_NULLS_LAST',
  FollowingPostContentAsc = 'followingPost_content_ASC',
  FollowingPostContentAscNullsFirst = 'followingPost_content_ASC_NULLS_FIRST',
  FollowingPostContentDesc = 'followingPost_content_DESC',
  FollowingPostContentDescNullsLast = 'followingPost_content_DESC_NULLS_LAST',
  FollowingPostCreatedAtBlockAsc = 'followingPost_createdAtBlock_ASC',
  FollowingPostCreatedAtBlockAscNullsFirst = 'followingPost_createdAtBlock_ASC_NULLS_FIRST',
  FollowingPostCreatedAtBlockDesc = 'followingPost_createdAtBlock_DESC',
  FollowingPostCreatedAtBlockDescNullsLast = 'followingPost_createdAtBlock_DESC_NULLS_LAST',
  FollowingPostCreatedAtTimeAsc = 'followingPost_createdAtTime_ASC',
  FollowingPostCreatedAtTimeAscNullsFirst = 'followingPost_createdAtTime_ASC_NULLS_FIRST',
  FollowingPostCreatedAtTimeDesc = 'followingPost_createdAtTime_DESC',
  FollowingPostCreatedAtTimeDescNullsLast = 'followingPost_createdAtTime_DESC_NULLS_LAST',
  FollowingPostCreatedOnDayAsc = 'followingPost_createdOnDay_ASC',
  FollowingPostCreatedOnDayAscNullsFirst = 'followingPost_createdOnDay_ASC_NULLS_FIRST',
  FollowingPostCreatedOnDayDesc = 'followingPost_createdOnDay_DESC',
  FollowingPostCreatedOnDayDescNullsLast = 'followingPost_createdOnDay_DESC_NULLS_LAST',
  FollowingPostDownvotesCountAsc = 'followingPost_downvotesCount_ASC',
  FollowingPostDownvotesCountAscNullsFirst = 'followingPost_downvotesCount_ASC_NULLS_FIRST',
  FollowingPostDownvotesCountDesc = 'followingPost_downvotesCount_DESC',
  FollowingPostDownvotesCountDescNullsLast = 'followingPost_downvotesCount_DESC_NULLS_LAST',
  FollowingPostFollowersCountAsc = 'followingPost_followersCount_ASC',
  FollowingPostFollowersCountAscNullsFirst = 'followingPost_followersCount_ASC_NULLS_FIRST',
  FollowingPostFollowersCountDesc = 'followingPost_followersCount_DESC',
  FollowingPostFollowersCountDescNullsLast = 'followingPost_followersCount_DESC_NULLS_LAST',
  FollowingPostFormatAsc = 'followingPost_format_ASC',
  FollowingPostFormatAscNullsFirst = 'followingPost_format_ASC_NULLS_FIRST',
  FollowingPostFormatDesc = 'followingPost_format_DESC',
  FollowingPostFormatDescNullsLast = 'followingPost_format_DESC_NULLS_LAST',
  FollowingPostHiddenRepliesCountAsc = 'followingPost_hiddenRepliesCount_ASC',
  FollowingPostHiddenRepliesCountAscNullsFirst = 'followingPost_hiddenRepliesCount_ASC_NULLS_FIRST',
  FollowingPostHiddenRepliesCountDesc = 'followingPost_hiddenRepliesCount_DESC',
  FollowingPostHiddenRepliesCountDescNullsLast = 'followingPost_hiddenRepliesCount_DESC_NULLS_LAST',
  FollowingPostHiddenAsc = 'followingPost_hidden_ASC',
  FollowingPostHiddenAscNullsFirst = 'followingPost_hidden_ASC_NULLS_FIRST',
  FollowingPostHiddenDesc = 'followingPost_hidden_DESC',
  FollowingPostHiddenDescNullsLast = 'followingPost_hidden_DESC_NULLS_LAST',
  FollowingPostIdAsc = 'followingPost_id_ASC',
  FollowingPostIdAscNullsFirst = 'followingPost_id_ASC_NULLS_FIRST',
  FollowingPostIdDesc = 'followingPost_id_DESC',
  FollowingPostIdDescNullsLast = 'followingPost_id_DESC_NULLS_LAST',
  FollowingPostImageAsc = 'followingPost_image_ASC',
  FollowingPostImageAscNullsFirst = 'followingPost_image_ASC_NULLS_FIRST',
  FollowingPostImageDesc = 'followingPost_image_DESC',
  FollowingPostImageDescNullsLast = 'followingPost_image_DESC_NULLS_LAST',
  FollowingPostInReplyToKindAsc = 'followingPost_inReplyToKind_ASC',
  FollowingPostInReplyToKindAscNullsFirst = 'followingPost_inReplyToKind_ASC_NULLS_FIRST',
  FollowingPostInReplyToKindDesc = 'followingPost_inReplyToKind_DESC',
  FollowingPostInReplyToKindDescNullsLast = 'followingPost_inReplyToKind_DESC_NULLS_LAST',
  FollowingPostIsCommentAsc = 'followingPost_isComment_ASC',
  FollowingPostIsCommentAscNullsFirst = 'followingPost_isComment_ASC_NULLS_FIRST',
  FollowingPostIsCommentDesc = 'followingPost_isComment_DESC',
  FollowingPostIsCommentDescNullsLast = 'followingPost_isComment_DESC_NULLS_LAST',
  FollowingPostIsShowMoreAsc = 'followingPost_isShowMore_ASC',
  FollowingPostIsShowMoreAscNullsFirst = 'followingPost_isShowMore_ASC_NULLS_FIRST',
  FollowingPostIsShowMoreDesc = 'followingPost_isShowMore_DESC',
  FollowingPostIsShowMoreDescNullsLast = 'followingPost_isShowMore_DESC_NULLS_LAST',
  FollowingPostKindAsc = 'followingPost_kind_ASC',
  FollowingPostKindAscNullsFirst = 'followingPost_kind_ASC_NULLS_FIRST',
  FollowingPostKindDesc = 'followingPost_kind_DESC',
  FollowingPostKindDescNullsLast = 'followingPost_kind_DESC_NULLS_LAST',
  FollowingPostLinkAsc = 'followingPost_link_ASC',
  FollowingPostLinkAscNullsFirst = 'followingPost_link_ASC_NULLS_FIRST',
  FollowingPostLinkDesc = 'followingPost_link_DESC',
  FollowingPostLinkDescNullsLast = 'followingPost_link_DESC_NULLS_LAST',
  FollowingPostMetaAsc = 'followingPost_meta_ASC',
  FollowingPostMetaAscNullsFirst = 'followingPost_meta_ASC_NULLS_FIRST',
  FollowingPostMetaDesc = 'followingPost_meta_DESC',
  FollowingPostMetaDescNullsLast = 'followingPost_meta_DESC_NULLS_LAST',
  FollowingPostProposalIndexAsc = 'followingPost_proposalIndex_ASC',
  FollowingPostProposalIndexAscNullsFirst = 'followingPost_proposalIndex_ASC_NULLS_FIRST',
  FollowingPostProposalIndexDesc = 'followingPost_proposalIndex_DESC',
  FollowingPostProposalIndexDescNullsLast = 'followingPost_proposalIndex_DESC_NULLS_LAST',
  FollowingPostPublicRepliesCountAsc = 'followingPost_publicRepliesCount_ASC',
  FollowingPostPublicRepliesCountAscNullsFirst = 'followingPost_publicRepliesCount_ASC_NULLS_FIRST',
  FollowingPostPublicRepliesCountDesc = 'followingPost_publicRepliesCount_DESC',
  FollowingPostPublicRepliesCountDescNullsLast = 'followingPost_publicRepliesCount_DESC_NULLS_LAST',
  FollowingPostReactionsCountAsc = 'followingPost_reactionsCount_ASC',
  FollowingPostReactionsCountAscNullsFirst = 'followingPost_reactionsCount_ASC_NULLS_FIRST',
  FollowingPostReactionsCountDesc = 'followingPost_reactionsCount_DESC',
  FollowingPostReactionsCountDescNullsLast = 'followingPost_reactionsCount_DESC_NULLS_LAST',
  FollowingPostRepliesCountAsc = 'followingPost_repliesCount_ASC',
  FollowingPostRepliesCountAscNullsFirst = 'followingPost_repliesCount_ASC_NULLS_FIRST',
  FollowingPostRepliesCountDesc = 'followingPost_repliesCount_DESC',
  FollowingPostRepliesCountDescNullsLast = 'followingPost_repliesCount_DESC_NULLS_LAST',
  FollowingPostSharesCountAsc = 'followingPost_sharesCount_ASC',
  FollowingPostSharesCountAscNullsFirst = 'followingPost_sharesCount_ASC_NULLS_FIRST',
  FollowingPostSharesCountDesc = 'followingPost_sharesCount_DESC',
  FollowingPostSharesCountDescNullsLast = 'followingPost_sharesCount_DESC_NULLS_LAST',
  FollowingPostSlugAsc = 'followingPost_slug_ASC',
  FollowingPostSlugAscNullsFirst = 'followingPost_slug_ASC_NULLS_FIRST',
  FollowingPostSlugDesc = 'followingPost_slug_DESC',
  FollowingPostSlugDescNullsLast = 'followingPost_slug_DESC_NULLS_LAST',
  FollowingPostSummaryAsc = 'followingPost_summary_ASC',
  FollowingPostSummaryAscNullsFirst = 'followingPost_summary_ASC_NULLS_FIRST',
  FollowingPostSummaryDesc = 'followingPost_summary_DESC',
  FollowingPostSummaryDescNullsLast = 'followingPost_summary_DESC_NULLS_LAST',
  FollowingPostTagsOriginalAsc = 'followingPost_tagsOriginal_ASC',
  FollowingPostTagsOriginalAscNullsFirst = 'followingPost_tagsOriginal_ASC_NULLS_FIRST',
  FollowingPostTagsOriginalDesc = 'followingPost_tagsOriginal_DESC',
  FollowingPostTagsOriginalDescNullsLast = 'followingPost_tagsOriginal_DESC_NULLS_LAST',
  FollowingPostTitleAsc = 'followingPost_title_ASC',
  FollowingPostTitleAscNullsFirst = 'followingPost_title_ASC_NULLS_FIRST',
  FollowingPostTitleDesc = 'followingPost_title_DESC',
  FollowingPostTitleDescNullsLast = 'followingPost_title_DESC_NULLS_LAST',
  FollowingPostTweetIdAsc = 'followingPost_tweetId_ASC',
  FollowingPostTweetIdAscNullsFirst = 'followingPost_tweetId_ASC_NULLS_FIRST',
  FollowingPostTweetIdDesc = 'followingPost_tweetId_DESC',
  FollowingPostTweetIdDescNullsLast = 'followingPost_tweetId_DESC_NULLS_LAST',
  FollowingPostUpdatedAtTimeAsc = 'followingPost_updatedAtTime_ASC',
  FollowingPostUpdatedAtTimeAscNullsFirst = 'followingPost_updatedAtTime_ASC_NULLS_FIRST',
  FollowingPostUpdatedAtTimeDesc = 'followingPost_updatedAtTime_DESC',
  FollowingPostUpdatedAtTimeDescNullsLast = 'followingPost_updatedAtTime_DESC_NULLS_LAST',
  FollowingPostUpvotesCountAsc = 'followingPost_upvotesCount_ASC',
  FollowingPostUpvotesCountAscNullsFirst = 'followingPost_upvotesCount_ASC_NULLS_FIRST',
  FollowingPostUpvotesCountDesc = 'followingPost_upvotesCount_DESC',
  FollowingPostUpvotesCountDescNullsLast = 'followingPost_upvotesCount_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST'
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
  BodyAscNullsFirst = 'body_ASC_NULLS_FIRST',
  BodyDesc = 'body_DESC',
  BodyDescNullsLast = 'body_DESC_NULLS_LAST',
  CanonicalAsc = 'canonical_ASC',
  CanonicalAscNullsFirst = 'canonical_ASC_NULLS_FIRST',
  CanonicalDesc = 'canonical_DESC',
  CanonicalDescNullsLast = 'canonical_DESC_NULLS_LAST',
  ContentAsc = 'content_ASC',
  ContentAscNullsFirst = 'content_ASC_NULLS_FIRST',
  ContentDesc = 'content_DESC',
  ContentDescNullsLast = 'content_DESC_NULLS_LAST',
  CreatedAtBlockAsc = 'createdAtBlock_ASC',
  CreatedAtBlockAscNullsFirst = 'createdAtBlock_ASC_NULLS_FIRST',
  CreatedAtBlockDesc = 'createdAtBlock_DESC',
  CreatedAtBlockDescNullsLast = 'createdAtBlock_DESC_NULLS_LAST',
  CreatedAtTimeAsc = 'createdAtTime_ASC',
  CreatedAtTimeAscNullsFirst = 'createdAtTime_ASC_NULLS_FIRST',
  CreatedAtTimeDesc = 'createdAtTime_DESC',
  CreatedAtTimeDescNullsLast = 'createdAtTime_DESC_NULLS_LAST',
  CreatedByAccountFollowersCountAsc = 'createdByAccount_followersCount_ASC',
  CreatedByAccountFollowersCountAscNullsFirst = 'createdByAccount_followersCount_ASC_NULLS_FIRST',
  CreatedByAccountFollowersCountDesc = 'createdByAccount_followersCount_DESC',
  CreatedByAccountFollowersCountDescNullsLast = 'createdByAccount_followersCount_DESC_NULLS_LAST',
  CreatedByAccountFollowingAccountsCountAsc = 'createdByAccount_followingAccountsCount_ASC',
  CreatedByAccountFollowingAccountsCountAscNullsFirst = 'createdByAccount_followingAccountsCount_ASC_NULLS_FIRST',
  CreatedByAccountFollowingAccountsCountDesc = 'createdByAccount_followingAccountsCount_DESC',
  CreatedByAccountFollowingAccountsCountDescNullsLast = 'createdByAccount_followingAccountsCount_DESC_NULLS_LAST',
  CreatedByAccountFollowingPostsCountAsc = 'createdByAccount_followingPostsCount_ASC',
  CreatedByAccountFollowingPostsCountAscNullsFirst = 'createdByAccount_followingPostsCount_ASC_NULLS_FIRST',
  CreatedByAccountFollowingPostsCountDesc = 'createdByAccount_followingPostsCount_DESC',
  CreatedByAccountFollowingPostsCountDescNullsLast = 'createdByAccount_followingPostsCount_DESC_NULLS_LAST',
  CreatedByAccountFollowingSpacesCountAsc = 'createdByAccount_followingSpacesCount_ASC',
  CreatedByAccountFollowingSpacesCountAscNullsFirst = 'createdByAccount_followingSpacesCount_ASC_NULLS_FIRST',
  CreatedByAccountFollowingSpacesCountDesc = 'createdByAccount_followingSpacesCount_DESC',
  CreatedByAccountFollowingSpacesCountDescNullsLast = 'createdByAccount_followingSpacesCount_DESC_NULLS_LAST',
  CreatedByAccountIdAsc = 'createdByAccount_id_ASC',
  CreatedByAccountIdAscNullsFirst = 'createdByAccount_id_ASC_NULLS_FIRST',
  CreatedByAccountIdDesc = 'createdByAccount_id_DESC',
  CreatedByAccountIdDescNullsLast = 'createdByAccount_id_DESC_NULLS_LAST',
  CreatedByAccountOwnedPostsCountAsc = 'createdByAccount_ownedPostsCount_ASC',
  CreatedByAccountOwnedPostsCountAscNullsFirst = 'createdByAccount_ownedPostsCount_ASC_NULLS_FIRST',
  CreatedByAccountOwnedPostsCountDesc = 'createdByAccount_ownedPostsCount_DESC',
  CreatedByAccountOwnedPostsCountDescNullsLast = 'createdByAccount_ownedPostsCount_DESC_NULLS_LAST',
  CreatedByAccountUpdatedAtBlockAsc = 'createdByAccount_updatedAtBlock_ASC',
  CreatedByAccountUpdatedAtBlockAscNullsFirst = 'createdByAccount_updatedAtBlock_ASC_NULLS_FIRST',
  CreatedByAccountUpdatedAtBlockDesc = 'createdByAccount_updatedAtBlock_DESC',
  CreatedByAccountUpdatedAtBlockDescNullsLast = 'createdByAccount_updatedAtBlock_DESC_NULLS_LAST',
  CreatedByAccountUpdatedAtTimeAsc = 'createdByAccount_updatedAtTime_ASC',
  CreatedByAccountUpdatedAtTimeAscNullsFirst = 'createdByAccount_updatedAtTime_ASC_NULLS_FIRST',
  CreatedByAccountUpdatedAtTimeDesc = 'createdByAccount_updatedAtTime_DESC',
  CreatedByAccountUpdatedAtTimeDescNullsLast = 'createdByAccount_updatedAtTime_DESC_NULLS_LAST',
  CreatedOnDayAsc = 'createdOnDay_ASC',
  CreatedOnDayAscNullsFirst = 'createdOnDay_ASC_NULLS_FIRST',
  CreatedOnDayDesc = 'createdOnDay_DESC',
  CreatedOnDayDescNullsLast = 'createdOnDay_DESC_NULLS_LAST',
  DownvotesCountAsc = 'downvotesCount_ASC',
  DownvotesCountAscNullsFirst = 'downvotesCount_ASC_NULLS_FIRST',
  DownvotesCountDesc = 'downvotesCount_DESC',
  DownvotesCountDescNullsLast = 'downvotesCount_DESC_NULLS_LAST',
  FollowersCountAsc = 'followersCount_ASC',
  FollowersCountAscNullsFirst = 'followersCount_ASC_NULLS_FIRST',
  FollowersCountDesc = 'followersCount_DESC',
  FollowersCountDescNullsLast = 'followersCount_DESC_NULLS_LAST',
  FormatAsc = 'format_ASC',
  FormatAscNullsFirst = 'format_ASC_NULLS_FIRST',
  FormatDesc = 'format_DESC',
  FormatDescNullsLast = 'format_DESC_NULLS_LAST',
  HiddenRepliesCountAsc = 'hiddenRepliesCount_ASC',
  HiddenRepliesCountAscNullsFirst = 'hiddenRepliesCount_ASC_NULLS_FIRST',
  HiddenRepliesCountDesc = 'hiddenRepliesCount_DESC',
  HiddenRepliesCountDescNullsLast = 'hiddenRepliesCount_DESC_NULLS_LAST',
  HiddenAsc = 'hidden_ASC',
  HiddenAscNullsFirst = 'hidden_ASC_NULLS_FIRST',
  HiddenDesc = 'hidden_DESC',
  HiddenDescNullsLast = 'hidden_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  ImageAsc = 'image_ASC',
  ImageAscNullsFirst = 'image_ASC_NULLS_FIRST',
  ImageDesc = 'image_DESC',
  ImageDescNullsLast = 'image_DESC_NULLS_LAST',
  InReplyToKindAsc = 'inReplyToKind_ASC',
  InReplyToKindAscNullsFirst = 'inReplyToKind_ASC_NULLS_FIRST',
  InReplyToKindDesc = 'inReplyToKind_DESC',
  InReplyToKindDescNullsLast = 'inReplyToKind_DESC_NULLS_LAST',
  InReplyToPostBodyAsc = 'inReplyToPost_body_ASC',
  InReplyToPostBodyAscNullsFirst = 'inReplyToPost_body_ASC_NULLS_FIRST',
  InReplyToPostBodyDesc = 'inReplyToPost_body_DESC',
  InReplyToPostBodyDescNullsLast = 'inReplyToPost_body_DESC_NULLS_LAST',
  InReplyToPostCanonicalAsc = 'inReplyToPost_canonical_ASC',
  InReplyToPostCanonicalAscNullsFirst = 'inReplyToPost_canonical_ASC_NULLS_FIRST',
  InReplyToPostCanonicalDesc = 'inReplyToPost_canonical_DESC',
  InReplyToPostCanonicalDescNullsLast = 'inReplyToPost_canonical_DESC_NULLS_LAST',
  InReplyToPostContentAsc = 'inReplyToPost_content_ASC',
  InReplyToPostContentAscNullsFirst = 'inReplyToPost_content_ASC_NULLS_FIRST',
  InReplyToPostContentDesc = 'inReplyToPost_content_DESC',
  InReplyToPostContentDescNullsLast = 'inReplyToPost_content_DESC_NULLS_LAST',
  InReplyToPostCreatedAtBlockAsc = 'inReplyToPost_createdAtBlock_ASC',
  InReplyToPostCreatedAtBlockAscNullsFirst = 'inReplyToPost_createdAtBlock_ASC_NULLS_FIRST',
  InReplyToPostCreatedAtBlockDesc = 'inReplyToPost_createdAtBlock_DESC',
  InReplyToPostCreatedAtBlockDescNullsLast = 'inReplyToPost_createdAtBlock_DESC_NULLS_LAST',
  InReplyToPostCreatedAtTimeAsc = 'inReplyToPost_createdAtTime_ASC',
  InReplyToPostCreatedAtTimeAscNullsFirst = 'inReplyToPost_createdAtTime_ASC_NULLS_FIRST',
  InReplyToPostCreatedAtTimeDesc = 'inReplyToPost_createdAtTime_DESC',
  InReplyToPostCreatedAtTimeDescNullsLast = 'inReplyToPost_createdAtTime_DESC_NULLS_LAST',
  InReplyToPostCreatedOnDayAsc = 'inReplyToPost_createdOnDay_ASC',
  InReplyToPostCreatedOnDayAscNullsFirst = 'inReplyToPost_createdOnDay_ASC_NULLS_FIRST',
  InReplyToPostCreatedOnDayDesc = 'inReplyToPost_createdOnDay_DESC',
  InReplyToPostCreatedOnDayDescNullsLast = 'inReplyToPost_createdOnDay_DESC_NULLS_LAST',
  InReplyToPostDownvotesCountAsc = 'inReplyToPost_downvotesCount_ASC',
  InReplyToPostDownvotesCountAscNullsFirst = 'inReplyToPost_downvotesCount_ASC_NULLS_FIRST',
  InReplyToPostDownvotesCountDesc = 'inReplyToPost_downvotesCount_DESC',
  InReplyToPostDownvotesCountDescNullsLast = 'inReplyToPost_downvotesCount_DESC_NULLS_LAST',
  InReplyToPostFollowersCountAsc = 'inReplyToPost_followersCount_ASC',
  InReplyToPostFollowersCountAscNullsFirst = 'inReplyToPost_followersCount_ASC_NULLS_FIRST',
  InReplyToPostFollowersCountDesc = 'inReplyToPost_followersCount_DESC',
  InReplyToPostFollowersCountDescNullsLast = 'inReplyToPost_followersCount_DESC_NULLS_LAST',
  InReplyToPostFormatAsc = 'inReplyToPost_format_ASC',
  InReplyToPostFormatAscNullsFirst = 'inReplyToPost_format_ASC_NULLS_FIRST',
  InReplyToPostFormatDesc = 'inReplyToPost_format_DESC',
  InReplyToPostFormatDescNullsLast = 'inReplyToPost_format_DESC_NULLS_LAST',
  InReplyToPostHiddenRepliesCountAsc = 'inReplyToPost_hiddenRepliesCount_ASC',
  InReplyToPostHiddenRepliesCountAscNullsFirst = 'inReplyToPost_hiddenRepliesCount_ASC_NULLS_FIRST',
  InReplyToPostHiddenRepliesCountDesc = 'inReplyToPost_hiddenRepliesCount_DESC',
  InReplyToPostHiddenRepliesCountDescNullsLast = 'inReplyToPost_hiddenRepliesCount_DESC_NULLS_LAST',
  InReplyToPostHiddenAsc = 'inReplyToPost_hidden_ASC',
  InReplyToPostHiddenAscNullsFirst = 'inReplyToPost_hidden_ASC_NULLS_FIRST',
  InReplyToPostHiddenDesc = 'inReplyToPost_hidden_DESC',
  InReplyToPostHiddenDescNullsLast = 'inReplyToPost_hidden_DESC_NULLS_LAST',
  InReplyToPostIdAsc = 'inReplyToPost_id_ASC',
  InReplyToPostIdAscNullsFirst = 'inReplyToPost_id_ASC_NULLS_FIRST',
  InReplyToPostIdDesc = 'inReplyToPost_id_DESC',
  InReplyToPostIdDescNullsLast = 'inReplyToPost_id_DESC_NULLS_LAST',
  InReplyToPostImageAsc = 'inReplyToPost_image_ASC',
  InReplyToPostImageAscNullsFirst = 'inReplyToPost_image_ASC_NULLS_FIRST',
  InReplyToPostImageDesc = 'inReplyToPost_image_DESC',
  InReplyToPostImageDescNullsLast = 'inReplyToPost_image_DESC_NULLS_LAST',
  InReplyToPostInReplyToKindAsc = 'inReplyToPost_inReplyToKind_ASC',
  InReplyToPostInReplyToKindAscNullsFirst = 'inReplyToPost_inReplyToKind_ASC_NULLS_FIRST',
  InReplyToPostInReplyToKindDesc = 'inReplyToPost_inReplyToKind_DESC',
  InReplyToPostInReplyToKindDescNullsLast = 'inReplyToPost_inReplyToKind_DESC_NULLS_LAST',
  InReplyToPostIsCommentAsc = 'inReplyToPost_isComment_ASC',
  InReplyToPostIsCommentAscNullsFirst = 'inReplyToPost_isComment_ASC_NULLS_FIRST',
  InReplyToPostIsCommentDesc = 'inReplyToPost_isComment_DESC',
  InReplyToPostIsCommentDescNullsLast = 'inReplyToPost_isComment_DESC_NULLS_LAST',
  InReplyToPostIsShowMoreAsc = 'inReplyToPost_isShowMore_ASC',
  InReplyToPostIsShowMoreAscNullsFirst = 'inReplyToPost_isShowMore_ASC_NULLS_FIRST',
  InReplyToPostIsShowMoreDesc = 'inReplyToPost_isShowMore_DESC',
  InReplyToPostIsShowMoreDescNullsLast = 'inReplyToPost_isShowMore_DESC_NULLS_LAST',
  InReplyToPostKindAsc = 'inReplyToPost_kind_ASC',
  InReplyToPostKindAscNullsFirst = 'inReplyToPost_kind_ASC_NULLS_FIRST',
  InReplyToPostKindDesc = 'inReplyToPost_kind_DESC',
  InReplyToPostKindDescNullsLast = 'inReplyToPost_kind_DESC_NULLS_LAST',
  InReplyToPostLinkAsc = 'inReplyToPost_link_ASC',
  InReplyToPostLinkAscNullsFirst = 'inReplyToPost_link_ASC_NULLS_FIRST',
  InReplyToPostLinkDesc = 'inReplyToPost_link_DESC',
  InReplyToPostLinkDescNullsLast = 'inReplyToPost_link_DESC_NULLS_LAST',
  InReplyToPostMetaAsc = 'inReplyToPost_meta_ASC',
  InReplyToPostMetaAscNullsFirst = 'inReplyToPost_meta_ASC_NULLS_FIRST',
  InReplyToPostMetaDesc = 'inReplyToPost_meta_DESC',
  InReplyToPostMetaDescNullsLast = 'inReplyToPost_meta_DESC_NULLS_LAST',
  InReplyToPostProposalIndexAsc = 'inReplyToPost_proposalIndex_ASC',
  InReplyToPostProposalIndexAscNullsFirst = 'inReplyToPost_proposalIndex_ASC_NULLS_FIRST',
  InReplyToPostProposalIndexDesc = 'inReplyToPost_proposalIndex_DESC',
  InReplyToPostProposalIndexDescNullsLast = 'inReplyToPost_proposalIndex_DESC_NULLS_LAST',
  InReplyToPostPublicRepliesCountAsc = 'inReplyToPost_publicRepliesCount_ASC',
  InReplyToPostPublicRepliesCountAscNullsFirst = 'inReplyToPost_publicRepliesCount_ASC_NULLS_FIRST',
  InReplyToPostPublicRepliesCountDesc = 'inReplyToPost_publicRepliesCount_DESC',
  InReplyToPostPublicRepliesCountDescNullsLast = 'inReplyToPost_publicRepliesCount_DESC_NULLS_LAST',
  InReplyToPostReactionsCountAsc = 'inReplyToPost_reactionsCount_ASC',
  InReplyToPostReactionsCountAscNullsFirst = 'inReplyToPost_reactionsCount_ASC_NULLS_FIRST',
  InReplyToPostReactionsCountDesc = 'inReplyToPost_reactionsCount_DESC',
  InReplyToPostReactionsCountDescNullsLast = 'inReplyToPost_reactionsCount_DESC_NULLS_LAST',
  InReplyToPostRepliesCountAsc = 'inReplyToPost_repliesCount_ASC',
  InReplyToPostRepliesCountAscNullsFirst = 'inReplyToPost_repliesCount_ASC_NULLS_FIRST',
  InReplyToPostRepliesCountDesc = 'inReplyToPost_repliesCount_DESC',
  InReplyToPostRepliesCountDescNullsLast = 'inReplyToPost_repliesCount_DESC_NULLS_LAST',
  InReplyToPostSharesCountAsc = 'inReplyToPost_sharesCount_ASC',
  InReplyToPostSharesCountAscNullsFirst = 'inReplyToPost_sharesCount_ASC_NULLS_FIRST',
  InReplyToPostSharesCountDesc = 'inReplyToPost_sharesCount_DESC',
  InReplyToPostSharesCountDescNullsLast = 'inReplyToPost_sharesCount_DESC_NULLS_LAST',
  InReplyToPostSlugAsc = 'inReplyToPost_slug_ASC',
  InReplyToPostSlugAscNullsFirst = 'inReplyToPost_slug_ASC_NULLS_FIRST',
  InReplyToPostSlugDesc = 'inReplyToPost_slug_DESC',
  InReplyToPostSlugDescNullsLast = 'inReplyToPost_slug_DESC_NULLS_LAST',
  InReplyToPostSummaryAsc = 'inReplyToPost_summary_ASC',
  InReplyToPostSummaryAscNullsFirst = 'inReplyToPost_summary_ASC_NULLS_FIRST',
  InReplyToPostSummaryDesc = 'inReplyToPost_summary_DESC',
  InReplyToPostSummaryDescNullsLast = 'inReplyToPost_summary_DESC_NULLS_LAST',
  InReplyToPostTagsOriginalAsc = 'inReplyToPost_tagsOriginal_ASC',
  InReplyToPostTagsOriginalAscNullsFirst = 'inReplyToPost_tagsOriginal_ASC_NULLS_FIRST',
  InReplyToPostTagsOriginalDesc = 'inReplyToPost_tagsOriginal_DESC',
  InReplyToPostTagsOriginalDescNullsLast = 'inReplyToPost_tagsOriginal_DESC_NULLS_LAST',
  InReplyToPostTitleAsc = 'inReplyToPost_title_ASC',
  InReplyToPostTitleAscNullsFirst = 'inReplyToPost_title_ASC_NULLS_FIRST',
  InReplyToPostTitleDesc = 'inReplyToPost_title_DESC',
  InReplyToPostTitleDescNullsLast = 'inReplyToPost_title_DESC_NULLS_LAST',
  InReplyToPostTweetIdAsc = 'inReplyToPost_tweetId_ASC',
  InReplyToPostTweetIdAscNullsFirst = 'inReplyToPost_tweetId_ASC_NULLS_FIRST',
  InReplyToPostTweetIdDesc = 'inReplyToPost_tweetId_DESC',
  InReplyToPostTweetIdDescNullsLast = 'inReplyToPost_tweetId_DESC_NULLS_LAST',
  InReplyToPostUpdatedAtTimeAsc = 'inReplyToPost_updatedAtTime_ASC',
  InReplyToPostUpdatedAtTimeAscNullsFirst = 'inReplyToPost_updatedAtTime_ASC_NULLS_FIRST',
  InReplyToPostUpdatedAtTimeDesc = 'inReplyToPost_updatedAtTime_DESC',
  InReplyToPostUpdatedAtTimeDescNullsLast = 'inReplyToPost_updatedAtTime_DESC_NULLS_LAST',
  InReplyToPostUpvotesCountAsc = 'inReplyToPost_upvotesCount_ASC',
  InReplyToPostUpvotesCountAscNullsFirst = 'inReplyToPost_upvotesCount_ASC_NULLS_FIRST',
  InReplyToPostUpvotesCountDesc = 'inReplyToPost_upvotesCount_DESC',
  InReplyToPostUpvotesCountDescNullsLast = 'inReplyToPost_upvotesCount_DESC_NULLS_LAST',
  IsCommentAsc = 'isComment_ASC',
  IsCommentAscNullsFirst = 'isComment_ASC_NULLS_FIRST',
  IsCommentDesc = 'isComment_DESC',
  IsCommentDescNullsLast = 'isComment_DESC_NULLS_LAST',
  IsShowMoreAsc = 'isShowMore_ASC',
  IsShowMoreAscNullsFirst = 'isShowMore_ASC_NULLS_FIRST',
  IsShowMoreDesc = 'isShowMore_DESC',
  IsShowMoreDescNullsLast = 'isShowMore_DESC_NULLS_LAST',
  KindAsc = 'kind_ASC',
  KindAscNullsFirst = 'kind_ASC_NULLS_FIRST',
  KindDesc = 'kind_DESC',
  KindDescNullsLast = 'kind_DESC_NULLS_LAST',
  LinkAsc = 'link_ASC',
  LinkAscNullsFirst = 'link_ASC_NULLS_FIRST',
  LinkDesc = 'link_DESC',
  LinkDescNullsLast = 'link_DESC_NULLS_LAST',
  MetaAsc = 'meta_ASC',
  MetaAscNullsFirst = 'meta_ASC_NULLS_FIRST',
  MetaDesc = 'meta_DESC',
  MetaDescNullsLast = 'meta_DESC_NULLS_LAST',
  OwnedByAccountFollowersCountAsc = 'ownedByAccount_followersCount_ASC',
  OwnedByAccountFollowersCountAscNullsFirst = 'ownedByAccount_followersCount_ASC_NULLS_FIRST',
  OwnedByAccountFollowersCountDesc = 'ownedByAccount_followersCount_DESC',
  OwnedByAccountFollowersCountDescNullsLast = 'ownedByAccount_followersCount_DESC_NULLS_LAST',
  OwnedByAccountFollowingAccountsCountAsc = 'ownedByAccount_followingAccountsCount_ASC',
  OwnedByAccountFollowingAccountsCountAscNullsFirst = 'ownedByAccount_followingAccountsCount_ASC_NULLS_FIRST',
  OwnedByAccountFollowingAccountsCountDesc = 'ownedByAccount_followingAccountsCount_DESC',
  OwnedByAccountFollowingAccountsCountDescNullsLast = 'ownedByAccount_followingAccountsCount_DESC_NULLS_LAST',
  OwnedByAccountFollowingPostsCountAsc = 'ownedByAccount_followingPostsCount_ASC',
  OwnedByAccountFollowingPostsCountAscNullsFirst = 'ownedByAccount_followingPostsCount_ASC_NULLS_FIRST',
  OwnedByAccountFollowingPostsCountDesc = 'ownedByAccount_followingPostsCount_DESC',
  OwnedByAccountFollowingPostsCountDescNullsLast = 'ownedByAccount_followingPostsCount_DESC_NULLS_LAST',
  OwnedByAccountFollowingSpacesCountAsc = 'ownedByAccount_followingSpacesCount_ASC',
  OwnedByAccountFollowingSpacesCountAscNullsFirst = 'ownedByAccount_followingSpacesCount_ASC_NULLS_FIRST',
  OwnedByAccountFollowingSpacesCountDesc = 'ownedByAccount_followingSpacesCount_DESC',
  OwnedByAccountFollowingSpacesCountDescNullsLast = 'ownedByAccount_followingSpacesCount_DESC_NULLS_LAST',
  OwnedByAccountIdAsc = 'ownedByAccount_id_ASC',
  OwnedByAccountIdAscNullsFirst = 'ownedByAccount_id_ASC_NULLS_FIRST',
  OwnedByAccountIdDesc = 'ownedByAccount_id_DESC',
  OwnedByAccountIdDescNullsLast = 'ownedByAccount_id_DESC_NULLS_LAST',
  OwnedByAccountOwnedPostsCountAsc = 'ownedByAccount_ownedPostsCount_ASC',
  OwnedByAccountOwnedPostsCountAscNullsFirst = 'ownedByAccount_ownedPostsCount_ASC_NULLS_FIRST',
  OwnedByAccountOwnedPostsCountDesc = 'ownedByAccount_ownedPostsCount_DESC',
  OwnedByAccountOwnedPostsCountDescNullsLast = 'ownedByAccount_ownedPostsCount_DESC_NULLS_LAST',
  OwnedByAccountUpdatedAtBlockAsc = 'ownedByAccount_updatedAtBlock_ASC',
  OwnedByAccountUpdatedAtBlockAscNullsFirst = 'ownedByAccount_updatedAtBlock_ASC_NULLS_FIRST',
  OwnedByAccountUpdatedAtBlockDesc = 'ownedByAccount_updatedAtBlock_DESC',
  OwnedByAccountUpdatedAtBlockDescNullsLast = 'ownedByAccount_updatedAtBlock_DESC_NULLS_LAST',
  OwnedByAccountUpdatedAtTimeAsc = 'ownedByAccount_updatedAtTime_ASC',
  OwnedByAccountUpdatedAtTimeAscNullsFirst = 'ownedByAccount_updatedAtTime_ASC_NULLS_FIRST',
  OwnedByAccountUpdatedAtTimeDesc = 'ownedByAccount_updatedAtTime_DESC',
  OwnedByAccountUpdatedAtTimeDescNullsLast = 'ownedByAccount_updatedAtTime_DESC_NULLS_LAST',
  ParentPostBodyAsc = 'parentPost_body_ASC',
  ParentPostBodyAscNullsFirst = 'parentPost_body_ASC_NULLS_FIRST',
  ParentPostBodyDesc = 'parentPost_body_DESC',
  ParentPostBodyDescNullsLast = 'parentPost_body_DESC_NULLS_LAST',
  ParentPostCanonicalAsc = 'parentPost_canonical_ASC',
  ParentPostCanonicalAscNullsFirst = 'parentPost_canonical_ASC_NULLS_FIRST',
  ParentPostCanonicalDesc = 'parentPost_canonical_DESC',
  ParentPostCanonicalDescNullsLast = 'parentPost_canonical_DESC_NULLS_LAST',
  ParentPostContentAsc = 'parentPost_content_ASC',
  ParentPostContentAscNullsFirst = 'parentPost_content_ASC_NULLS_FIRST',
  ParentPostContentDesc = 'parentPost_content_DESC',
  ParentPostContentDescNullsLast = 'parentPost_content_DESC_NULLS_LAST',
  ParentPostCreatedAtBlockAsc = 'parentPost_createdAtBlock_ASC',
  ParentPostCreatedAtBlockAscNullsFirst = 'parentPost_createdAtBlock_ASC_NULLS_FIRST',
  ParentPostCreatedAtBlockDesc = 'parentPost_createdAtBlock_DESC',
  ParentPostCreatedAtBlockDescNullsLast = 'parentPost_createdAtBlock_DESC_NULLS_LAST',
  ParentPostCreatedAtTimeAsc = 'parentPost_createdAtTime_ASC',
  ParentPostCreatedAtTimeAscNullsFirst = 'parentPost_createdAtTime_ASC_NULLS_FIRST',
  ParentPostCreatedAtTimeDesc = 'parentPost_createdAtTime_DESC',
  ParentPostCreatedAtTimeDescNullsLast = 'parentPost_createdAtTime_DESC_NULLS_LAST',
  ParentPostCreatedOnDayAsc = 'parentPost_createdOnDay_ASC',
  ParentPostCreatedOnDayAscNullsFirst = 'parentPost_createdOnDay_ASC_NULLS_FIRST',
  ParentPostCreatedOnDayDesc = 'parentPost_createdOnDay_DESC',
  ParentPostCreatedOnDayDescNullsLast = 'parentPost_createdOnDay_DESC_NULLS_LAST',
  ParentPostDownvotesCountAsc = 'parentPost_downvotesCount_ASC',
  ParentPostDownvotesCountAscNullsFirst = 'parentPost_downvotesCount_ASC_NULLS_FIRST',
  ParentPostDownvotesCountDesc = 'parentPost_downvotesCount_DESC',
  ParentPostDownvotesCountDescNullsLast = 'parentPost_downvotesCount_DESC_NULLS_LAST',
  ParentPostFollowersCountAsc = 'parentPost_followersCount_ASC',
  ParentPostFollowersCountAscNullsFirst = 'parentPost_followersCount_ASC_NULLS_FIRST',
  ParentPostFollowersCountDesc = 'parentPost_followersCount_DESC',
  ParentPostFollowersCountDescNullsLast = 'parentPost_followersCount_DESC_NULLS_LAST',
  ParentPostFormatAsc = 'parentPost_format_ASC',
  ParentPostFormatAscNullsFirst = 'parentPost_format_ASC_NULLS_FIRST',
  ParentPostFormatDesc = 'parentPost_format_DESC',
  ParentPostFormatDescNullsLast = 'parentPost_format_DESC_NULLS_LAST',
  ParentPostHiddenRepliesCountAsc = 'parentPost_hiddenRepliesCount_ASC',
  ParentPostHiddenRepliesCountAscNullsFirst = 'parentPost_hiddenRepliesCount_ASC_NULLS_FIRST',
  ParentPostHiddenRepliesCountDesc = 'parentPost_hiddenRepliesCount_DESC',
  ParentPostHiddenRepliesCountDescNullsLast = 'parentPost_hiddenRepliesCount_DESC_NULLS_LAST',
  ParentPostHiddenAsc = 'parentPost_hidden_ASC',
  ParentPostHiddenAscNullsFirst = 'parentPost_hidden_ASC_NULLS_FIRST',
  ParentPostHiddenDesc = 'parentPost_hidden_DESC',
  ParentPostHiddenDescNullsLast = 'parentPost_hidden_DESC_NULLS_LAST',
  ParentPostIdAsc = 'parentPost_id_ASC',
  ParentPostIdAscNullsFirst = 'parentPost_id_ASC_NULLS_FIRST',
  ParentPostIdDesc = 'parentPost_id_DESC',
  ParentPostIdDescNullsLast = 'parentPost_id_DESC_NULLS_LAST',
  ParentPostImageAsc = 'parentPost_image_ASC',
  ParentPostImageAscNullsFirst = 'parentPost_image_ASC_NULLS_FIRST',
  ParentPostImageDesc = 'parentPost_image_DESC',
  ParentPostImageDescNullsLast = 'parentPost_image_DESC_NULLS_LAST',
  ParentPostInReplyToKindAsc = 'parentPost_inReplyToKind_ASC',
  ParentPostInReplyToKindAscNullsFirst = 'parentPost_inReplyToKind_ASC_NULLS_FIRST',
  ParentPostInReplyToKindDesc = 'parentPost_inReplyToKind_DESC',
  ParentPostInReplyToKindDescNullsLast = 'parentPost_inReplyToKind_DESC_NULLS_LAST',
  ParentPostIsCommentAsc = 'parentPost_isComment_ASC',
  ParentPostIsCommentAscNullsFirst = 'parentPost_isComment_ASC_NULLS_FIRST',
  ParentPostIsCommentDesc = 'parentPost_isComment_DESC',
  ParentPostIsCommentDescNullsLast = 'parentPost_isComment_DESC_NULLS_LAST',
  ParentPostIsShowMoreAsc = 'parentPost_isShowMore_ASC',
  ParentPostIsShowMoreAscNullsFirst = 'parentPost_isShowMore_ASC_NULLS_FIRST',
  ParentPostIsShowMoreDesc = 'parentPost_isShowMore_DESC',
  ParentPostIsShowMoreDescNullsLast = 'parentPost_isShowMore_DESC_NULLS_LAST',
  ParentPostKindAsc = 'parentPost_kind_ASC',
  ParentPostKindAscNullsFirst = 'parentPost_kind_ASC_NULLS_FIRST',
  ParentPostKindDesc = 'parentPost_kind_DESC',
  ParentPostKindDescNullsLast = 'parentPost_kind_DESC_NULLS_LAST',
  ParentPostLinkAsc = 'parentPost_link_ASC',
  ParentPostLinkAscNullsFirst = 'parentPost_link_ASC_NULLS_FIRST',
  ParentPostLinkDesc = 'parentPost_link_DESC',
  ParentPostLinkDescNullsLast = 'parentPost_link_DESC_NULLS_LAST',
  ParentPostMetaAsc = 'parentPost_meta_ASC',
  ParentPostMetaAscNullsFirst = 'parentPost_meta_ASC_NULLS_FIRST',
  ParentPostMetaDesc = 'parentPost_meta_DESC',
  ParentPostMetaDescNullsLast = 'parentPost_meta_DESC_NULLS_LAST',
  ParentPostProposalIndexAsc = 'parentPost_proposalIndex_ASC',
  ParentPostProposalIndexAscNullsFirst = 'parentPost_proposalIndex_ASC_NULLS_FIRST',
  ParentPostProposalIndexDesc = 'parentPost_proposalIndex_DESC',
  ParentPostProposalIndexDescNullsLast = 'parentPost_proposalIndex_DESC_NULLS_LAST',
  ParentPostPublicRepliesCountAsc = 'parentPost_publicRepliesCount_ASC',
  ParentPostPublicRepliesCountAscNullsFirst = 'parentPost_publicRepliesCount_ASC_NULLS_FIRST',
  ParentPostPublicRepliesCountDesc = 'parentPost_publicRepliesCount_DESC',
  ParentPostPublicRepliesCountDescNullsLast = 'parentPost_publicRepliesCount_DESC_NULLS_LAST',
  ParentPostReactionsCountAsc = 'parentPost_reactionsCount_ASC',
  ParentPostReactionsCountAscNullsFirst = 'parentPost_reactionsCount_ASC_NULLS_FIRST',
  ParentPostReactionsCountDesc = 'parentPost_reactionsCount_DESC',
  ParentPostReactionsCountDescNullsLast = 'parentPost_reactionsCount_DESC_NULLS_LAST',
  ParentPostRepliesCountAsc = 'parentPost_repliesCount_ASC',
  ParentPostRepliesCountAscNullsFirst = 'parentPost_repliesCount_ASC_NULLS_FIRST',
  ParentPostRepliesCountDesc = 'parentPost_repliesCount_DESC',
  ParentPostRepliesCountDescNullsLast = 'parentPost_repliesCount_DESC_NULLS_LAST',
  ParentPostSharesCountAsc = 'parentPost_sharesCount_ASC',
  ParentPostSharesCountAscNullsFirst = 'parentPost_sharesCount_ASC_NULLS_FIRST',
  ParentPostSharesCountDesc = 'parentPost_sharesCount_DESC',
  ParentPostSharesCountDescNullsLast = 'parentPost_sharesCount_DESC_NULLS_LAST',
  ParentPostSlugAsc = 'parentPost_slug_ASC',
  ParentPostSlugAscNullsFirst = 'parentPost_slug_ASC_NULLS_FIRST',
  ParentPostSlugDesc = 'parentPost_slug_DESC',
  ParentPostSlugDescNullsLast = 'parentPost_slug_DESC_NULLS_LAST',
  ParentPostSummaryAsc = 'parentPost_summary_ASC',
  ParentPostSummaryAscNullsFirst = 'parentPost_summary_ASC_NULLS_FIRST',
  ParentPostSummaryDesc = 'parentPost_summary_DESC',
  ParentPostSummaryDescNullsLast = 'parentPost_summary_DESC_NULLS_LAST',
  ParentPostTagsOriginalAsc = 'parentPost_tagsOriginal_ASC',
  ParentPostTagsOriginalAscNullsFirst = 'parentPost_tagsOriginal_ASC_NULLS_FIRST',
  ParentPostTagsOriginalDesc = 'parentPost_tagsOriginal_DESC',
  ParentPostTagsOriginalDescNullsLast = 'parentPost_tagsOriginal_DESC_NULLS_LAST',
  ParentPostTitleAsc = 'parentPost_title_ASC',
  ParentPostTitleAscNullsFirst = 'parentPost_title_ASC_NULLS_FIRST',
  ParentPostTitleDesc = 'parentPost_title_DESC',
  ParentPostTitleDescNullsLast = 'parentPost_title_DESC_NULLS_LAST',
  ParentPostTweetIdAsc = 'parentPost_tweetId_ASC',
  ParentPostTweetIdAscNullsFirst = 'parentPost_tweetId_ASC_NULLS_FIRST',
  ParentPostTweetIdDesc = 'parentPost_tweetId_DESC',
  ParentPostTweetIdDescNullsLast = 'parentPost_tweetId_DESC_NULLS_LAST',
  ParentPostUpdatedAtTimeAsc = 'parentPost_updatedAtTime_ASC',
  ParentPostUpdatedAtTimeAscNullsFirst = 'parentPost_updatedAtTime_ASC_NULLS_FIRST',
  ParentPostUpdatedAtTimeDesc = 'parentPost_updatedAtTime_DESC',
  ParentPostUpdatedAtTimeDescNullsLast = 'parentPost_updatedAtTime_DESC_NULLS_LAST',
  ParentPostUpvotesCountAsc = 'parentPost_upvotesCount_ASC',
  ParentPostUpvotesCountAscNullsFirst = 'parentPost_upvotesCount_ASC_NULLS_FIRST',
  ParentPostUpvotesCountDesc = 'parentPost_upvotesCount_DESC',
  ParentPostUpvotesCountDescNullsLast = 'parentPost_upvotesCount_DESC_NULLS_LAST',
  ProposalIndexAsc = 'proposalIndex_ASC',
  ProposalIndexAscNullsFirst = 'proposalIndex_ASC_NULLS_FIRST',
  ProposalIndexDesc = 'proposalIndex_DESC',
  ProposalIndexDescNullsLast = 'proposalIndex_DESC_NULLS_LAST',
  PublicRepliesCountAsc = 'publicRepliesCount_ASC',
  PublicRepliesCountAscNullsFirst = 'publicRepliesCount_ASC_NULLS_FIRST',
  PublicRepliesCountDesc = 'publicRepliesCount_DESC',
  PublicRepliesCountDescNullsLast = 'publicRepliesCount_DESC_NULLS_LAST',
  ReactionsCountAsc = 'reactionsCount_ASC',
  ReactionsCountAscNullsFirst = 'reactionsCount_ASC_NULLS_FIRST',
  ReactionsCountDesc = 'reactionsCount_DESC',
  ReactionsCountDescNullsLast = 'reactionsCount_DESC_NULLS_LAST',
  RepliesCountAsc = 'repliesCount_ASC',
  RepliesCountAscNullsFirst = 'repliesCount_ASC_NULLS_FIRST',
  RepliesCountDesc = 'repliesCount_DESC',
  RepliesCountDescNullsLast = 'repliesCount_DESC_NULLS_LAST',
  RootPostBodyAsc = 'rootPost_body_ASC',
  RootPostBodyAscNullsFirst = 'rootPost_body_ASC_NULLS_FIRST',
  RootPostBodyDesc = 'rootPost_body_DESC',
  RootPostBodyDescNullsLast = 'rootPost_body_DESC_NULLS_LAST',
  RootPostCanonicalAsc = 'rootPost_canonical_ASC',
  RootPostCanonicalAscNullsFirst = 'rootPost_canonical_ASC_NULLS_FIRST',
  RootPostCanonicalDesc = 'rootPost_canonical_DESC',
  RootPostCanonicalDescNullsLast = 'rootPost_canonical_DESC_NULLS_LAST',
  RootPostContentAsc = 'rootPost_content_ASC',
  RootPostContentAscNullsFirst = 'rootPost_content_ASC_NULLS_FIRST',
  RootPostContentDesc = 'rootPost_content_DESC',
  RootPostContentDescNullsLast = 'rootPost_content_DESC_NULLS_LAST',
  RootPostCreatedAtBlockAsc = 'rootPost_createdAtBlock_ASC',
  RootPostCreatedAtBlockAscNullsFirst = 'rootPost_createdAtBlock_ASC_NULLS_FIRST',
  RootPostCreatedAtBlockDesc = 'rootPost_createdAtBlock_DESC',
  RootPostCreatedAtBlockDescNullsLast = 'rootPost_createdAtBlock_DESC_NULLS_LAST',
  RootPostCreatedAtTimeAsc = 'rootPost_createdAtTime_ASC',
  RootPostCreatedAtTimeAscNullsFirst = 'rootPost_createdAtTime_ASC_NULLS_FIRST',
  RootPostCreatedAtTimeDesc = 'rootPost_createdAtTime_DESC',
  RootPostCreatedAtTimeDescNullsLast = 'rootPost_createdAtTime_DESC_NULLS_LAST',
  RootPostCreatedOnDayAsc = 'rootPost_createdOnDay_ASC',
  RootPostCreatedOnDayAscNullsFirst = 'rootPost_createdOnDay_ASC_NULLS_FIRST',
  RootPostCreatedOnDayDesc = 'rootPost_createdOnDay_DESC',
  RootPostCreatedOnDayDescNullsLast = 'rootPost_createdOnDay_DESC_NULLS_LAST',
  RootPostDownvotesCountAsc = 'rootPost_downvotesCount_ASC',
  RootPostDownvotesCountAscNullsFirst = 'rootPost_downvotesCount_ASC_NULLS_FIRST',
  RootPostDownvotesCountDesc = 'rootPost_downvotesCount_DESC',
  RootPostDownvotesCountDescNullsLast = 'rootPost_downvotesCount_DESC_NULLS_LAST',
  RootPostFollowersCountAsc = 'rootPost_followersCount_ASC',
  RootPostFollowersCountAscNullsFirst = 'rootPost_followersCount_ASC_NULLS_FIRST',
  RootPostFollowersCountDesc = 'rootPost_followersCount_DESC',
  RootPostFollowersCountDescNullsLast = 'rootPost_followersCount_DESC_NULLS_LAST',
  RootPostFormatAsc = 'rootPost_format_ASC',
  RootPostFormatAscNullsFirst = 'rootPost_format_ASC_NULLS_FIRST',
  RootPostFormatDesc = 'rootPost_format_DESC',
  RootPostFormatDescNullsLast = 'rootPost_format_DESC_NULLS_LAST',
  RootPostHiddenRepliesCountAsc = 'rootPost_hiddenRepliesCount_ASC',
  RootPostHiddenRepliesCountAscNullsFirst = 'rootPost_hiddenRepliesCount_ASC_NULLS_FIRST',
  RootPostHiddenRepliesCountDesc = 'rootPost_hiddenRepliesCount_DESC',
  RootPostHiddenRepliesCountDescNullsLast = 'rootPost_hiddenRepliesCount_DESC_NULLS_LAST',
  RootPostHiddenAsc = 'rootPost_hidden_ASC',
  RootPostHiddenAscNullsFirst = 'rootPost_hidden_ASC_NULLS_FIRST',
  RootPostHiddenDesc = 'rootPost_hidden_DESC',
  RootPostHiddenDescNullsLast = 'rootPost_hidden_DESC_NULLS_LAST',
  RootPostIdAsc = 'rootPost_id_ASC',
  RootPostIdAscNullsFirst = 'rootPost_id_ASC_NULLS_FIRST',
  RootPostIdDesc = 'rootPost_id_DESC',
  RootPostIdDescNullsLast = 'rootPost_id_DESC_NULLS_LAST',
  RootPostImageAsc = 'rootPost_image_ASC',
  RootPostImageAscNullsFirst = 'rootPost_image_ASC_NULLS_FIRST',
  RootPostImageDesc = 'rootPost_image_DESC',
  RootPostImageDescNullsLast = 'rootPost_image_DESC_NULLS_LAST',
  RootPostInReplyToKindAsc = 'rootPost_inReplyToKind_ASC',
  RootPostInReplyToKindAscNullsFirst = 'rootPost_inReplyToKind_ASC_NULLS_FIRST',
  RootPostInReplyToKindDesc = 'rootPost_inReplyToKind_DESC',
  RootPostInReplyToKindDescNullsLast = 'rootPost_inReplyToKind_DESC_NULLS_LAST',
  RootPostIsCommentAsc = 'rootPost_isComment_ASC',
  RootPostIsCommentAscNullsFirst = 'rootPost_isComment_ASC_NULLS_FIRST',
  RootPostIsCommentDesc = 'rootPost_isComment_DESC',
  RootPostIsCommentDescNullsLast = 'rootPost_isComment_DESC_NULLS_LAST',
  RootPostIsShowMoreAsc = 'rootPost_isShowMore_ASC',
  RootPostIsShowMoreAscNullsFirst = 'rootPost_isShowMore_ASC_NULLS_FIRST',
  RootPostIsShowMoreDesc = 'rootPost_isShowMore_DESC',
  RootPostIsShowMoreDescNullsLast = 'rootPost_isShowMore_DESC_NULLS_LAST',
  RootPostKindAsc = 'rootPost_kind_ASC',
  RootPostKindAscNullsFirst = 'rootPost_kind_ASC_NULLS_FIRST',
  RootPostKindDesc = 'rootPost_kind_DESC',
  RootPostKindDescNullsLast = 'rootPost_kind_DESC_NULLS_LAST',
  RootPostLinkAsc = 'rootPost_link_ASC',
  RootPostLinkAscNullsFirst = 'rootPost_link_ASC_NULLS_FIRST',
  RootPostLinkDesc = 'rootPost_link_DESC',
  RootPostLinkDescNullsLast = 'rootPost_link_DESC_NULLS_LAST',
  RootPostMetaAsc = 'rootPost_meta_ASC',
  RootPostMetaAscNullsFirst = 'rootPost_meta_ASC_NULLS_FIRST',
  RootPostMetaDesc = 'rootPost_meta_DESC',
  RootPostMetaDescNullsLast = 'rootPost_meta_DESC_NULLS_LAST',
  RootPostProposalIndexAsc = 'rootPost_proposalIndex_ASC',
  RootPostProposalIndexAscNullsFirst = 'rootPost_proposalIndex_ASC_NULLS_FIRST',
  RootPostProposalIndexDesc = 'rootPost_proposalIndex_DESC',
  RootPostProposalIndexDescNullsLast = 'rootPost_proposalIndex_DESC_NULLS_LAST',
  RootPostPublicRepliesCountAsc = 'rootPost_publicRepliesCount_ASC',
  RootPostPublicRepliesCountAscNullsFirst = 'rootPost_publicRepliesCount_ASC_NULLS_FIRST',
  RootPostPublicRepliesCountDesc = 'rootPost_publicRepliesCount_DESC',
  RootPostPublicRepliesCountDescNullsLast = 'rootPost_publicRepliesCount_DESC_NULLS_LAST',
  RootPostReactionsCountAsc = 'rootPost_reactionsCount_ASC',
  RootPostReactionsCountAscNullsFirst = 'rootPost_reactionsCount_ASC_NULLS_FIRST',
  RootPostReactionsCountDesc = 'rootPost_reactionsCount_DESC',
  RootPostReactionsCountDescNullsLast = 'rootPost_reactionsCount_DESC_NULLS_LAST',
  RootPostRepliesCountAsc = 'rootPost_repliesCount_ASC',
  RootPostRepliesCountAscNullsFirst = 'rootPost_repliesCount_ASC_NULLS_FIRST',
  RootPostRepliesCountDesc = 'rootPost_repliesCount_DESC',
  RootPostRepliesCountDescNullsLast = 'rootPost_repliesCount_DESC_NULLS_LAST',
  RootPostSharesCountAsc = 'rootPost_sharesCount_ASC',
  RootPostSharesCountAscNullsFirst = 'rootPost_sharesCount_ASC_NULLS_FIRST',
  RootPostSharesCountDesc = 'rootPost_sharesCount_DESC',
  RootPostSharesCountDescNullsLast = 'rootPost_sharesCount_DESC_NULLS_LAST',
  RootPostSlugAsc = 'rootPost_slug_ASC',
  RootPostSlugAscNullsFirst = 'rootPost_slug_ASC_NULLS_FIRST',
  RootPostSlugDesc = 'rootPost_slug_DESC',
  RootPostSlugDescNullsLast = 'rootPost_slug_DESC_NULLS_LAST',
  RootPostSummaryAsc = 'rootPost_summary_ASC',
  RootPostSummaryAscNullsFirst = 'rootPost_summary_ASC_NULLS_FIRST',
  RootPostSummaryDesc = 'rootPost_summary_DESC',
  RootPostSummaryDescNullsLast = 'rootPost_summary_DESC_NULLS_LAST',
  RootPostTagsOriginalAsc = 'rootPost_tagsOriginal_ASC',
  RootPostTagsOriginalAscNullsFirst = 'rootPost_tagsOriginal_ASC_NULLS_FIRST',
  RootPostTagsOriginalDesc = 'rootPost_tagsOriginal_DESC',
  RootPostTagsOriginalDescNullsLast = 'rootPost_tagsOriginal_DESC_NULLS_LAST',
  RootPostTitleAsc = 'rootPost_title_ASC',
  RootPostTitleAscNullsFirst = 'rootPost_title_ASC_NULLS_FIRST',
  RootPostTitleDesc = 'rootPost_title_DESC',
  RootPostTitleDescNullsLast = 'rootPost_title_DESC_NULLS_LAST',
  RootPostTweetIdAsc = 'rootPost_tweetId_ASC',
  RootPostTweetIdAscNullsFirst = 'rootPost_tweetId_ASC_NULLS_FIRST',
  RootPostTweetIdDesc = 'rootPost_tweetId_DESC',
  RootPostTweetIdDescNullsLast = 'rootPost_tweetId_DESC_NULLS_LAST',
  RootPostUpdatedAtTimeAsc = 'rootPost_updatedAtTime_ASC',
  RootPostUpdatedAtTimeAscNullsFirst = 'rootPost_updatedAtTime_ASC_NULLS_FIRST',
  RootPostUpdatedAtTimeDesc = 'rootPost_updatedAtTime_DESC',
  RootPostUpdatedAtTimeDescNullsLast = 'rootPost_updatedAtTime_DESC_NULLS_LAST',
  RootPostUpvotesCountAsc = 'rootPost_upvotesCount_ASC',
  RootPostUpvotesCountAscNullsFirst = 'rootPost_upvotesCount_ASC_NULLS_FIRST',
  RootPostUpvotesCountDesc = 'rootPost_upvotesCount_DESC',
  RootPostUpvotesCountDescNullsLast = 'rootPost_upvotesCount_DESC_NULLS_LAST',
  SharedPostBodyAsc = 'sharedPost_body_ASC',
  SharedPostBodyAscNullsFirst = 'sharedPost_body_ASC_NULLS_FIRST',
  SharedPostBodyDesc = 'sharedPost_body_DESC',
  SharedPostBodyDescNullsLast = 'sharedPost_body_DESC_NULLS_LAST',
  SharedPostCanonicalAsc = 'sharedPost_canonical_ASC',
  SharedPostCanonicalAscNullsFirst = 'sharedPost_canonical_ASC_NULLS_FIRST',
  SharedPostCanonicalDesc = 'sharedPost_canonical_DESC',
  SharedPostCanonicalDescNullsLast = 'sharedPost_canonical_DESC_NULLS_LAST',
  SharedPostContentAsc = 'sharedPost_content_ASC',
  SharedPostContentAscNullsFirst = 'sharedPost_content_ASC_NULLS_FIRST',
  SharedPostContentDesc = 'sharedPost_content_DESC',
  SharedPostContentDescNullsLast = 'sharedPost_content_DESC_NULLS_LAST',
  SharedPostCreatedAtBlockAsc = 'sharedPost_createdAtBlock_ASC',
  SharedPostCreatedAtBlockAscNullsFirst = 'sharedPost_createdAtBlock_ASC_NULLS_FIRST',
  SharedPostCreatedAtBlockDesc = 'sharedPost_createdAtBlock_DESC',
  SharedPostCreatedAtBlockDescNullsLast = 'sharedPost_createdAtBlock_DESC_NULLS_LAST',
  SharedPostCreatedAtTimeAsc = 'sharedPost_createdAtTime_ASC',
  SharedPostCreatedAtTimeAscNullsFirst = 'sharedPost_createdAtTime_ASC_NULLS_FIRST',
  SharedPostCreatedAtTimeDesc = 'sharedPost_createdAtTime_DESC',
  SharedPostCreatedAtTimeDescNullsLast = 'sharedPost_createdAtTime_DESC_NULLS_LAST',
  SharedPostCreatedOnDayAsc = 'sharedPost_createdOnDay_ASC',
  SharedPostCreatedOnDayAscNullsFirst = 'sharedPost_createdOnDay_ASC_NULLS_FIRST',
  SharedPostCreatedOnDayDesc = 'sharedPost_createdOnDay_DESC',
  SharedPostCreatedOnDayDescNullsLast = 'sharedPost_createdOnDay_DESC_NULLS_LAST',
  SharedPostDownvotesCountAsc = 'sharedPost_downvotesCount_ASC',
  SharedPostDownvotesCountAscNullsFirst = 'sharedPost_downvotesCount_ASC_NULLS_FIRST',
  SharedPostDownvotesCountDesc = 'sharedPost_downvotesCount_DESC',
  SharedPostDownvotesCountDescNullsLast = 'sharedPost_downvotesCount_DESC_NULLS_LAST',
  SharedPostFollowersCountAsc = 'sharedPost_followersCount_ASC',
  SharedPostFollowersCountAscNullsFirst = 'sharedPost_followersCount_ASC_NULLS_FIRST',
  SharedPostFollowersCountDesc = 'sharedPost_followersCount_DESC',
  SharedPostFollowersCountDescNullsLast = 'sharedPost_followersCount_DESC_NULLS_LAST',
  SharedPostFormatAsc = 'sharedPost_format_ASC',
  SharedPostFormatAscNullsFirst = 'sharedPost_format_ASC_NULLS_FIRST',
  SharedPostFormatDesc = 'sharedPost_format_DESC',
  SharedPostFormatDescNullsLast = 'sharedPost_format_DESC_NULLS_LAST',
  SharedPostHiddenRepliesCountAsc = 'sharedPost_hiddenRepliesCount_ASC',
  SharedPostHiddenRepliesCountAscNullsFirst = 'sharedPost_hiddenRepliesCount_ASC_NULLS_FIRST',
  SharedPostHiddenRepliesCountDesc = 'sharedPost_hiddenRepliesCount_DESC',
  SharedPostHiddenRepliesCountDescNullsLast = 'sharedPost_hiddenRepliesCount_DESC_NULLS_LAST',
  SharedPostHiddenAsc = 'sharedPost_hidden_ASC',
  SharedPostHiddenAscNullsFirst = 'sharedPost_hidden_ASC_NULLS_FIRST',
  SharedPostHiddenDesc = 'sharedPost_hidden_DESC',
  SharedPostHiddenDescNullsLast = 'sharedPost_hidden_DESC_NULLS_LAST',
  SharedPostIdAsc = 'sharedPost_id_ASC',
  SharedPostIdAscNullsFirst = 'sharedPost_id_ASC_NULLS_FIRST',
  SharedPostIdDesc = 'sharedPost_id_DESC',
  SharedPostIdDescNullsLast = 'sharedPost_id_DESC_NULLS_LAST',
  SharedPostImageAsc = 'sharedPost_image_ASC',
  SharedPostImageAscNullsFirst = 'sharedPost_image_ASC_NULLS_FIRST',
  SharedPostImageDesc = 'sharedPost_image_DESC',
  SharedPostImageDescNullsLast = 'sharedPost_image_DESC_NULLS_LAST',
  SharedPostInReplyToKindAsc = 'sharedPost_inReplyToKind_ASC',
  SharedPostInReplyToKindAscNullsFirst = 'sharedPost_inReplyToKind_ASC_NULLS_FIRST',
  SharedPostInReplyToKindDesc = 'sharedPost_inReplyToKind_DESC',
  SharedPostInReplyToKindDescNullsLast = 'sharedPost_inReplyToKind_DESC_NULLS_LAST',
  SharedPostIsCommentAsc = 'sharedPost_isComment_ASC',
  SharedPostIsCommentAscNullsFirst = 'sharedPost_isComment_ASC_NULLS_FIRST',
  SharedPostIsCommentDesc = 'sharedPost_isComment_DESC',
  SharedPostIsCommentDescNullsLast = 'sharedPost_isComment_DESC_NULLS_LAST',
  SharedPostIsShowMoreAsc = 'sharedPost_isShowMore_ASC',
  SharedPostIsShowMoreAscNullsFirst = 'sharedPost_isShowMore_ASC_NULLS_FIRST',
  SharedPostIsShowMoreDesc = 'sharedPost_isShowMore_DESC',
  SharedPostIsShowMoreDescNullsLast = 'sharedPost_isShowMore_DESC_NULLS_LAST',
  SharedPostKindAsc = 'sharedPost_kind_ASC',
  SharedPostKindAscNullsFirst = 'sharedPost_kind_ASC_NULLS_FIRST',
  SharedPostKindDesc = 'sharedPost_kind_DESC',
  SharedPostKindDescNullsLast = 'sharedPost_kind_DESC_NULLS_LAST',
  SharedPostLinkAsc = 'sharedPost_link_ASC',
  SharedPostLinkAscNullsFirst = 'sharedPost_link_ASC_NULLS_FIRST',
  SharedPostLinkDesc = 'sharedPost_link_DESC',
  SharedPostLinkDescNullsLast = 'sharedPost_link_DESC_NULLS_LAST',
  SharedPostMetaAsc = 'sharedPost_meta_ASC',
  SharedPostMetaAscNullsFirst = 'sharedPost_meta_ASC_NULLS_FIRST',
  SharedPostMetaDesc = 'sharedPost_meta_DESC',
  SharedPostMetaDescNullsLast = 'sharedPost_meta_DESC_NULLS_LAST',
  SharedPostProposalIndexAsc = 'sharedPost_proposalIndex_ASC',
  SharedPostProposalIndexAscNullsFirst = 'sharedPost_proposalIndex_ASC_NULLS_FIRST',
  SharedPostProposalIndexDesc = 'sharedPost_proposalIndex_DESC',
  SharedPostProposalIndexDescNullsLast = 'sharedPost_proposalIndex_DESC_NULLS_LAST',
  SharedPostPublicRepliesCountAsc = 'sharedPost_publicRepliesCount_ASC',
  SharedPostPublicRepliesCountAscNullsFirst = 'sharedPost_publicRepliesCount_ASC_NULLS_FIRST',
  SharedPostPublicRepliesCountDesc = 'sharedPost_publicRepliesCount_DESC',
  SharedPostPublicRepliesCountDescNullsLast = 'sharedPost_publicRepliesCount_DESC_NULLS_LAST',
  SharedPostReactionsCountAsc = 'sharedPost_reactionsCount_ASC',
  SharedPostReactionsCountAscNullsFirst = 'sharedPost_reactionsCount_ASC_NULLS_FIRST',
  SharedPostReactionsCountDesc = 'sharedPost_reactionsCount_DESC',
  SharedPostReactionsCountDescNullsLast = 'sharedPost_reactionsCount_DESC_NULLS_LAST',
  SharedPostRepliesCountAsc = 'sharedPost_repliesCount_ASC',
  SharedPostRepliesCountAscNullsFirst = 'sharedPost_repliesCount_ASC_NULLS_FIRST',
  SharedPostRepliesCountDesc = 'sharedPost_repliesCount_DESC',
  SharedPostRepliesCountDescNullsLast = 'sharedPost_repliesCount_DESC_NULLS_LAST',
  SharedPostSharesCountAsc = 'sharedPost_sharesCount_ASC',
  SharedPostSharesCountAscNullsFirst = 'sharedPost_sharesCount_ASC_NULLS_FIRST',
  SharedPostSharesCountDesc = 'sharedPost_sharesCount_DESC',
  SharedPostSharesCountDescNullsLast = 'sharedPost_sharesCount_DESC_NULLS_LAST',
  SharedPostSlugAsc = 'sharedPost_slug_ASC',
  SharedPostSlugAscNullsFirst = 'sharedPost_slug_ASC_NULLS_FIRST',
  SharedPostSlugDesc = 'sharedPost_slug_DESC',
  SharedPostSlugDescNullsLast = 'sharedPost_slug_DESC_NULLS_LAST',
  SharedPostSummaryAsc = 'sharedPost_summary_ASC',
  SharedPostSummaryAscNullsFirst = 'sharedPost_summary_ASC_NULLS_FIRST',
  SharedPostSummaryDesc = 'sharedPost_summary_DESC',
  SharedPostSummaryDescNullsLast = 'sharedPost_summary_DESC_NULLS_LAST',
  SharedPostTagsOriginalAsc = 'sharedPost_tagsOriginal_ASC',
  SharedPostTagsOriginalAscNullsFirst = 'sharedPost_tagsOriginal_ASC_NULLS_FIRST',
  SharedPostTagsOriginalDesc = 'sharedPost_tagsOriginal_DESC',
  SharedPostTagsOriginalDescNullsLast = 'sharedPost_tagsOriginal_DESC_NULLS_LAST',
  SharedPostTitleAsc = 'sharedPost_title_ASC',
  SharedPostTitleAscNullsFirst = 'sharedPost_title_ASC_NULLS_FIRST',
  SharedPostTitleDesc = 'sharedPost_title_DESC',
  SharedPostTitleDescNullsLast = 'sharedPost_title_DESC_NULLS_LAST',
  SharedPostTweetIdAsc = 'sharedPost_tweetId_ASC',
  SharedPostTweetIdAscNullsFirst = 'sharedPost_tweetId_ASC_NULLS_FIRST',
  SharedPostTweetIdDesc = 'sharedPost_tweetId_DESC',
  SharedPostTweetIdDescNullsLast = 'sharedPost_tweetId_DESC_NULLS_LAST',
  SharedPostUpdatedAtTimeAsc = 'sharedPost_updatedAtTime_ASC',
  SharedPostUpdatedAtTimeAscNullsFirst = 'sharedPost_updatedAtTime_ASC_NULLS_FIRST',
  SharedPostUpdatedAtTimeDesc = 'sharedPost_updatedAtTime_DESC',
  SharedPostUpdatedAtTimeDescNullsLast = 'sharedPost_updatedAtTime_DESC_NULLS_LAST',
  SharedPostUpvotesCountAsc = 'sharedPost_upvotesCount_ASC',
  SharedPostUpvotesCountAscNullsFirst = 'sharedPost_upvotesCount_ASC_NULLS_FIRST',
  SharedPostUpvotesCountDesc = 'sharedPost_upvotesCount_DESC',
  SharedPostUpvotesCountDescNullsLast = 'sharedPost_upvotesCount_DESC_NULLS_LAST',
  SharesCountAsc = 'sharesCount_ASC',
  SharesCountAscNullsFirst = 'sharesCount_ASC_NULLS_FIRST',
  SharesCountDesc = 'sharesCount_DESC',
  SharesCountDescNullsLast = 'sharesCount_DESC_NULLS_LAST',
  SlugAsc = 'slug_ASC',
  SlugAscNullsFirst = 'slug_ASC_NULLS_FIRST',
  SlugDesc = 'slug_DESC',
  SlugDescNullsLast = 'slug_DESC_NULLS_LAST',
  SpaceAboutAsc = 'space_about_ASC',
  SpaceAboutAscNullsFirst = 'space_about_ASC_NULLS_FIRST',
  SpaceAboutDesc = 'space_about_DESC',
  SpaceAboutDescNullsLast = 'space_about_DESC_NULLS_LAST',
  SpaceCanEveryoneCreatePostsAsc = 'space_canEveryoneCreatePosts_ASC',
  SpaceCanEveryoneCreatePostsAscNullsFirst = 'space_canEveryoneCreatePosts_ASC_NULLS_FIRST',
  SpaceCanEveryoneCreatePostsDesc = 'space_canEveryoneCreatePosts_DESC',
  SpaceCanEveryoneCreatePostsDescNullsLast = 'space_canEveryoneCreatePosts_DESC_NULLS_LAST',
  SpaceCanFollowerCreatePostsAsc = 'space_canFollowerCreatePosts_ASC',
  SpaceCanFollowerCreatePostsAscNullsFirst = 'space_canFollowerCreatePosts_ASC_NULLS_FIRST',
  SpaceCanFollowerCreatePostsDesc = 'space_canFollowerCreatePosts_DESC',
  SpaceCanFollowerCreatePostsDescNullsLast = 'space_canFollowerCreatePosts_DESC_NULLS_LAST',
  SpaceContentAsc = 'space_content_ASC',
  SpaceContentAscNullsFirst = 'space_content_ASC_NULLS_FIRST',
  SpaceContentDesc = 'space_content_DESC',
  SpaceContentDescNullsLast = 'space_content_DESC_NULLS_LAST',
  SpaceCreatedAtBlockAsc = 'space_createdAtBlock_ASC',
  SpaceCreatedAtBlockAscNullsFirst = 'space_createdAtBlock_ASC_NULLS_FIRST',
  SpaceCreatedAtBlockDesc = 'space_createdAtBlock_DESC',
  SpaceCreatedAtBlockDescNullsLast = 'space_createdAtBlock_DESC_NULLS_LAST',
  SpaceCreatedAtTimeAsc = 'space_createdAtTime_ASC',
  SpaceCreatedAtTimeAscNullsFirst = 'space_createdAtTime_ASC_NULLS_FIRST',
  SpaceCreatedAtTimeDesc = 'space_createdAtTime_DESC',
  SpaceCreatedAtTimeDescNullsLast = 'space_createdAtTime_DESC_NULLS_LAST',
  SpaceCreatedOnDayAsc = 'space_createdOnDay_ASC',
  SpaceCreatedOnDayAscNullsFirst = 'space_createdOnDay_ASC_NULLS_FIRST',
  SpaceCreatedOnDayDesc = 'space_createdOnDay_DESC',
  SpaceCreatedOnDayDescNullsLast = 'space_createdOnDay_DESC_NULLS_LAST',
  SpaceEmailAsc = 'space_email_ASC',
  SpaceEmailAscNullsFirst = 'space_email_ASC_NULLS_FIRST',
  SpaceEmailDesc = 'space_email_DESC',
  SpaceEmailDescNullsLast = 'space_email_DESC_NULLS_LAST',
  SpaceFollowersCountAsc = 'space_followersCount_ASC',
  SpaceFollowersCountAscNullsFirst = 'space_followersCount_ASC_NULLS_FIRST',
  SpaceFollowersCountDesc = 'space_followersCount_DESC',
  SpaceFollowersCountDescNullsLast = 'space_followersCount_DESC_NULLS_LAST',
  SpaceFormatAsc = 'space_format_ASC',
  SpaceFormatAscNullsFirst = 'space_format_ASC_NULLS_FIRST',
  SpaceFormatDesc = 'space_format_DESC',
  SpaceFormatDescNullsLast = 'space_format_DESC_NULLS_LAST',
  SpaceHandleAsc = 'space_handle_ASC',
  SpaceHandleAscNullsFirst = 'space_handle_ASC_NULLS_FIRST',
  SpaceHandleDesc = 'space_handle_DESC',
  SpaceHandleDescNullsLast = 'space_handle_DESC_NULLS_LAST',
  SpaceHiddenPostsCountAsc = 'space_hiddenPostsCount_ASC',
  SpaceHiddenPostsCountAscNullsFirst = 'space_hiddenPostsCount_ASC_NULLS_FIRST',
  SpaceHiddenPostsCountDesc = 'space_hiddenPostsCount_DESC',
  SpaceHiddenPostsCountDescNullsLast = 'space_hiddenPostsCount_DESC_NULLS_LAST',
  SpaceHiddenAsc = 'space_hidden_ASC',
  SpaceHiddenAscNullsFirst = 'space_hidden_ASC_NULLS_FIRST',
  SpaceHiddenDesc = 'space_hidden_DESC',
  SpaceHiddenDescNullsLast = 'space_hidden_DESC_NULLS_LAST',
  SpaceIdAsc = 'space_id_ASC',
  SpaceIdAscNullsFirst = 'space_id_ASC_NULLS_FIRST',
  SpaceIdDesc = 'space_id_DESC',
  SpaceIdDescNullsLast = 'space_id_DESC_NULLS_LAST',
  SpaceImageAsc = 'space_image_ASC',
  SpaceImageAscNullsFirst = 'space_image_ASC_NULLS_FIRST',
  SpaceImageDesc = 'space_image_DESC',
  SpaceImageDescNullsLast = 'space_image_DESC_NULLS_LAST',
  SpaceInterestsOriginalAsc = 'space_interestsOriginal_ASC',
  SpaceInterestsOriginalAscNullsFirst = 'space_interestsOriginal_ASC_NULLS_FIRST',
  SpaceInterestsOriginalDesc = 'space_interestsOriginal_DESC',
  SpaceInterestsOriginalDescNullsLast = 'space_interestsOriginal_DESC_NULLS_LAST',
  SpaceIsShowMoreAsc = 'space_isShowMore_ASC',
  SpaceIsShowMoreAscNullsFirst = 'space_isShowMore_ASC_NULLS_FIRST',
  SpaceIsShowMoreDesc = 'space_isShowMore_DESC',
  SpaceIsShowMoreDescNullsLast = 'space_isShowMore_DESC_NULLS_LAST',
  SpaceLinksOriginalAsc = 'space_linksOriginal_ASC',
  SpaceLinksOriginalAscNullsFirst = 'space_linksOriginal_ASC_NULLS_FIRST',
  SpaceLinksOriginalDesc = 'space_linksOriginal_DESC',
  SpaceLinksOriginalDescNullsLast = 'space_linksOriginal_DESC_NULLS_LAST',
  SpaceNameAsc = 'space_name_ASC',
  SpaceNameAscNullsFirst = 'space_name_ASC_NULLS_FIRST',
  SpaceNameDesc = 'space_name_DESC',
  SpaceNameDescNullsLast = 'space_name_DESC_NULLS_LAST',
  SpacePostsCountAsc = 'space_postsCount_ASC',
  SpacePostsCountAscNullsFirst = 'space_postsCount_ASC_NULLS_FIRST',
  SpacePostsCountDesc = 'space_postsCount_DESC',
  SpacePostsCountDescNullsLast = 'space_postsCount_DESC_NULLS_LAST',
  SpaceProfileSourceAsc = 'space_profileSource_ASC',
  SpaceProfileSourceAscNullsFirst = 'space_profileSource_ASC_NULLS_FIRST',
  SpaceProfileSourceDesc = 'space_profileSource_DESC',
  SpaceProfileSourceDescNullsLast = 'space_profileSource_DESC_NULLS_LAST',
  SpacePublicPostsCountAsc = 'space_publicPostsCount_ASC',
  SpacePublicPostsCountAscNullsFirst = 'space_publicPostsCount_ASC_NULLS_FIRST',
  SpacePublicPostsCountDesc = 'space_publicPostsCount_DESC',
  SpacePublicPostsCountDescNullsLast = 'space_publicPostsCount_DESC_NULLS_LAST',
  SpaceSummaryAsc = 'space_summary_ASC',
  SpaceSummaryAscNullsFirst = 'space_summary_ASC_NULLS_FIRST',
  SpaceSummaryDesc = 'space_summary_DESC',
  SpaceSummaryDescNullsLast = 'space_summary_DESC_NULLS_LAST',
  SpaceTagsOriginalAsc = 'space_tagsOriginal_ASC',
  SpaceTagsOriginalAscNullsFirst = 'space_tagsOriginal_ASC_NULLS_FIRST',
  SpaceTagsOriginalDesc = 'space_tagsOriginal_DESC',
  SpaceTagsOriginalDescNullsLast = 'space_tagsOriginal_DESC_NULLS_LAST',
  SpaceUpdatedAtBlockAsc = 'space_updatedAtBlock_ASC',
  SpaceUpdatedAtBlockAscNullsFirst = 'space_updatedAtBlock_ASC_NULLS_FIRST',
  SpaceUpdatedAtBlockDesc = 'space_updatedAtBlock_DESC',
  SpaceUpdatedAtBlockDescNullsLast = 'space_updatedAtBlock_DESC_NULLS_LAST',
  SpaceUpdatedAtTimeAsc = 'space_updatedAtTime_ASC',
  SpaceUpdatedAtTimeAscNullsFirst = 'space_updatedAtTime_ASC_NULLS_FIRST',
  SpaceUpdatedAtTimeDesc = 'space_updatedAtTime_DESC',
  SpaceUpdatedAtTimeDescNullsLast = 'space_updatedAtTime_DESC_NULLS_LAST',
  SpaceUsernameAsc = 'space_username_ASC',
  SpaceUsernameAscNullsFirst = 'space_username_ASC_NULLS_FIRST',
  SpaceUsernameDesc = 'space_username_DESC',
  SpaceUsernameDescNullsLast = 'space_username_DESC_NULLS_LAST',
  SummaryAsc = 'summary_ASC',
  SummaryAscNullsFirst = 'summary_ASC_NULLS_FIRST',
  SummaryDesc = 'summary_DESC',
  SummaryDescNullsLast = 'summary_DESC_NULLS_LAST',
  TagsOriginalAsc = 'tagsOriginal_ASC',
  TagsOriginalAscNullsFirst = 'tagsOriginal_ASC_NULLS_FIRST',
  TagsOriginalDesc = 'tagsOriginal_DESC',
  TagsOriginalDescNullsLast = 'tagsOriginal_DESC_NULLS_LAST',
  TitleAsc = 'title_ASC',
  TitleAscNullsFirst = 'title_ASC_NULLS_FIRST',
  TitleDesc = 'title_DESC',
  TitleDescNullsLast = 'title_DESC_NULLS_LAST',
  TweetDetailsAuthorIdAsc = 'tweetDetails_authorId_ASC',
  TweetDetailsAuthorIdAscNullsFirst = 'tweetDetails_authorId_ASC_NULLS_FIRST',
  TweetDetailsAuthorIdDesc = 'tweetDetails_authorId_DESC',
  TweetDetailsAuthorIdDescNullsLast = 'tweetDetails_authorId_DESC_NULLS_LAST',
  TweetDetailsConversationIdAsc = 'tweetDetails_conversationId_ASC',
  TweetDetailsConversationIdAscNullsFirst = 'tweetDetails_conversationId_ASC_NULLS_FIRST',
  TweetDetailsConversationIdDesc = 'tweetDetails_conversationId_DESC',
  TweetDetailsConversationIdDescNullsLast = 'tweetDetails_conversationId_DESC_NULLS_LAST',
  TweetDetailsCreatedAtAsc = 'tweetDetails_createdAt_ASC',
  TweetDetailsCreatedAtAscNullsFirst = 'tweetDetails_createdAt_ASC_NULLS_FIRST',
  TweetDetailsCreatedAtDesc = 'tweetDetails_createdAt_DESC',
  TweetDetailsCreatedAtDescNullsLast = 'tweetDetails_createdAt_DESC_NULLS_LAST',
  TweetDetailsInReplyToUserIdAsc = 'tweetDetails_inReplyToUserId_ASC',
  TweetDetailsInReplyToUserIdAscNullsFirst = 'tweetDetails_inReplyToUserId_ASC_NULLS_FIRST',
  TweetDetailsInReplyToUserIdDesc = 'tweetDetails_inReplyToUserId_DESC',
  TweetDetailsInReplyToUserIdDescNullsLast = 'tweetDetails_inReplyToUserId_DESC_NULLS_LAST',
  TweetDetailsLangAsc = 'tweetDetails_lang_ASC',
  TweetDetailsLangAscNullsFirst = 'tweetDetails_lang_ASC_NULLS_FIRST',
  TweetDetailsLangDesc = 'tweetDetails_lang_DESC',
  TweetDetailsLangDescNullsLast = 'tweetDetails_lang_DESC_NULLS_LAST',
  TweetDetailsUsernameAsc = 'tweetDetails_username_ASC',
  TweetDetailsUsernameAscNullsFirst = 'tweetDetails_username_ASC_NULLS_FIRST',
  TweetDetailsUsernameDesc = 'tweetDetails_username_DESC',
  TweetDetailsUsernameDescNullsLast = 'tweetDetails_username_DESC_NULLS_LAST',
  TweetIdAsc = 'tweetId_ASC',
  TweetIdAscNullsFirst = 'tweetId_ASC_NULLS_FIRST',
  TweetIdDesc = 'tweetId_DESC',
  TweetIdDescNullsLast = 'tweetId_DESC_NULLS_LAST',
  UpdatedAtTimeAsc = 'updatedAtTime_ASC',
  UpdatedAtTimeAscNullsFirst = 'updatedAtTime_ASC_NULLS_FIRST',
  UpdatedAtTimeDesc = 'updatedAtTime_DESC',
  UpdatedAtTimeDescNullsLast = 'updatedAtTime_DESC_NULLS_LAST',
  UpvotesCountAsc = 'upvotesCount_ASC',
  UpvotesCountAscNullsFirst = 'upvotesCount_ASC_NULLS_FIRST',
  UpvotesCountDesc = 'upvotesCount_DESC',
  UpvotesCountDescNullsLast = 'upvotesCount_DESC_NULLS_LAST'
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
  AccountFollowersCountAscNullsFirst = 'account_followersCount_ASC_NULLS_FIRST',
  AccountFollowersCountDesc = 'account_followersCount_DESC',
  AccountFollowersCountDescNullsLast = 'account_followersCount_DESC_NULLS_LAST',
  AccountFollowingAccountsCountAsc = 'account_followingAccountsCount_ASC',
  AccountFollowingAccountsCountAscNullsFirst = 'account_followingAccountsCount_ASC_NULLS_FIRST',
  AccountFollowingAccountsCountDesc = 'account_followingAccountsCount_DESC',
  AccountFollowingAccountsCountDescNullsLast = 'account_followingAccountsCount_DESC_NULLS_LAST',
  AccountFollowingPostsCountAsc = 'account_followingPostsCount_ASC',
  AccountFollowingPostsCountAscNullsFirst = 'account_followingPostsCount_ASC_NULLS_FIRST',
  AccountFollowingPostsCountDesc = 'account_followingPostsCount_DESC',
  AccountFollowingPostsCountDescNullsLast = 'account_followingPostsCount_DESC_NULLS_LAST',
  AccountFollowingSpacesCountAsc = 'account_followingSpacesCount_ASC',
  AccountFollowingSpacesCountAscNullsFirst = 'account_followingSpacesCount_ASC_NULLS_FIRST',
  AccountFollowingSpacesCountDesc = 'account_followingSpacesCount_DESC',
  AccountFollowingSpacesCountDescNullsLast = 'account_followingSpacesCount_DESC_NULLS_LAST',
  AccountIdAsc = 'account_id_ASC',
  AccountIdAscNullsFirst = 'account_id_ASC_NULLS_FIRST',
  AccountIdDesc = 'account_id_DESC',
  AccountIdDescNullsLast = 'account_id_DESC_NULLS_LAST',
  AccountOwnedPostsCountAsc = 'account_ownedPostsCount_ASC',
  AccountOwnedPostsCountAscNullsFirst = 'account_ownedPostsCount_ASC_NULLS_FIRST',
  AccountOwnedPostsCountDesc = 'account_ownedPostsCount_DESC',
  AccountOwnedPostsCountDescNullsLast = 'account_ownedPostsCount_DESC_NULLS_LAST',
  AccountUpdatedAtBlockAsc = 'account_updatedAtBlock_ASC',
  AccountUpdatedAtBlockAscNullsFirst = 'account_updatedAtBlock_ASC_NULLS_FIRST',
  AccountUpdatedAtBlockDesc = 'account_updatedAtBlock_DESC',
  AccountUpdatedAtBlockDescNullsLast = 'account_updatedAtBlock_DESC_NULLS_LAST',
  AccountUpdatedAtTimeAsc = 'account_updatedAtTime_ASC',
  AccountUpdatedAtTimeAscNullsFirst = 'account_updatedAtTime_ASC_NULLS_FIRST',
  AccountUpdatedAtTimeDesc = 'account_updatedAtTime_DESC',
  AccountUpdatedAtTimeDescNullsLast = 'account_updatedAtTime_DESC_NULLS_LAST',
  CreatedAtBlockAsc = 'createdAtBlock_ASC',
  CreatedAtBlockAscNullsFirst = 'createdAtBlock_ASC_NULLS_FIRST',
  CreatedAtBlockDesc = 'createdAtBlock_DESC',
  CreatedAtBlockDescNullsLast = 'createdAtBlock_DESC_NULLS_LAST',
  CreatedAtTimeAsc = 'createdAtTime_ASC',
  CreatedAtTimeAscNullsFirst = 'createdAtTime_ASC_NULLS_FIRST',
  CreatedAtTimeDesc = 'createdAtTime_DESC',
  CreatedAtTimeDescNullsLast = 'createdAtTime_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  KindAsc = 'kind_ASC',
  KindAscNullsFirst = 'kind_ASC_NULLS_FIRST',
  KindDesc = 'kind_DESC',
  KindDescNullsLast = 'kind_DESC_NULLS_LAST',
  PostBodyAsc = 'post_body_ASC',
  PostBodyAscNullsFirst = 'post_body_ASC_NULLS_FIRST',
  PostBodyDesc = 'post_body_DESC',
  PostBodyDescNullsLast = 'post_body_DESC_NULLS_LAST',
  PostCanonicalAsc = 'post_canonical_ASC',
  PostCanonicalAscNullsFirst = 'post_canonical_ASC_NULLS_FIRST',
  PostCanonicalDesc = 'post_canonical_DESC',
  PostCanonicalDescNullsLast = 'post_canonical_DESC_NULLS_LAST',
  PostContentAsc = 'post_content_ASC',
  PostContentAscNullsFirst = 'post_content_ASC_NULLS_FIRST',
  PostContentDesc = 'post_content_DESC',
  PostContentDescNullsLast = 'post_content_DESC_NULLS_LAST',
  PostCreatedAtBlockAsc = 'post_createdAtBlock_ASC',
  PostCreatedAtBlockAscNullsFirst = 'post_createdAtBlock_ASC_NULLS_FIRST',
  PostCreatedAtBlockDesc = 'post_createdAtBlock_DESC',
  PostCreatedAtBlockDescNullsLast = 'post_createdAtBlock_DESC_NULLS_LAST',
  PostCreatedAtTimeAsc = 'post_createdAtTime_ASC',
  PostCreatedAtTimeAscNullsFirst = 'post_createdAtTime_ASC_NULLS_FIRST',
  PostCreatedAtTimeDesc = 'post_createdAtTime_DESC',
  PostCreatedAtTimeDescNullsLast = 'post_createdAtTime_DESC_NULLS_LAST',
  PostCreatedOnDayAsc = 'post_createdOnDay_ASC',
  PostCreatedOnDayAscNullsFirst = 'post_createdOnDay_ASC_NULLS_FIRST',
  PostCreatedOnDayDesc = 'post_createdOnDay_DESC',
  PostCreatedOnDayDescNullsLast = 'post_createdOnDay_DESC_NULLS_LAST',
  PostDownvotesCountAsc = 'post_downvotesCount_ASC',
  PostDownvotesCountAscNullsFirst = 'post_downvotesCount_ASC_NULLS_FIRST',
  PostDownvotesCountDesc = 'post_downvotesCount_DESC',
  PostDownvotesCountDescNullsLast = 'post_downvotesCount_DESC_NULLS_LAST',
  PostFollowersCountAsc = 'post_followersCount_ASC',
  PostFollowersCountAscNullsFirst = 'post_followersCount_ASC_NULLS_FIRST',
  PostFollowersCountDesc = 'post_followersCount_DESC',
  PostFollowersCountDescNullsLast = 'post_followersCount_DESC_NULLS_LAST',
  PostFormatAsc = 'post_format_ASC',
  PostFormatAscNullsFirst = 'post_format_ASC_NULLS_FIRST',
  PostFormatDesc = 'post_format_DESC',
  PostFormatDescNullsLast = 'post_format_DESC_NULLS_LAST',
  PostHiddenRepliesCountAsc = 'post_hiddenRepliesCount_ASC',
  PostHiddenRepliesCountAscNullsFirst = 'post_hiddenRepliesCount_ASC_NULLS_FIRST',
  PostHiddenRepliesCountDesc = 'post_hiddenRepliesCount_DESC',
  PostHiddenRepliesCountDescNullsLast = 'post_hiddenRepliesCount_DESC_NULLS_LAST',
  PostHiddenAsc = 'post_hidden_ASC',
  PostHiddenAscNullsFirst = 'post_hidden_ASC_NULLS_FIRST',
  PostHiddenDesc = 'post_hidden_DESC',
  PostHiddenDescNullsLast = 'post_hidden_DESC_NULLS_LAST',
  PostIdAsc = 'post_id_ASC',
  PostIdAscNullsFirst = 'post_id_ASC_NULLS_FIRST',
  PostIdDesc = 'post_id_DESC',
  PostIdDescNullsLast = 'post_id_DESC_NULLS_LAST',
  PostImageAsc = 'post_image_ASC',
  PostImageAscNullsFirst = 'post_image_ASC_NULLS_FIRST',
  PostImageDesc = 'post_image_DESC',
  PostImageDescNullsLast = 'post_image_DESC_NULLS_LAST',
  PostInReplyToKindAsc = 'post_inReplyToKind_ASC',
  PostInReplyToKindAscNullsFirst = 'post_inReplyToKind_ASC_NULLS_FIRST',
  PostInReplyToKindDesc = 'post_inReplyToKind_DESC',
  PostInReplyToKindDescNullsLast = 'post_inReplyToKind_DESC_NULLS_LAST',
  PostIsCommentAsc = 'post_isComment_ASC',
  PostIsCommentAscNullsFirst = 'post_isComment_ASC_NULLS_FIRST',
  PostIsCommentDesc = 'post_isComment_DESC',
  PostIsCommentDescNullsLast = 'post_isComment_DESC_NULLS_LAST',
  PostIsShowMoreAsc = 'post_isShowMore_ASC',
  PostIsShowMoreAscNullsFirst = 'post_isShowMore_ASC_NULLS_FIRST',
  PostIsShowMoreDesc = 'post_isShowMore_DESC',
  PostIsShowMoreDescNullsLast = 'post_isShowMore_DESC_NULLS_LAST',
  PostKindAsc = 'post_kind_ASC',
  PostKindAscNullsFirst = 'post_kind_ASC_NULLS_FIRST',
  PostKindDesc = 'post_kind_DESC',
  PostKindDescNullsLast = 'post_kind_DESC_NULLS_LAST',
  PostLinkAsc = 'post_link_ASC',
  PostLinkAscNullsFirst = 'post_link_ASC_NULLS_FIRST',
  PostLinkDesc = 'post_link_DESC',
  PostLinkDescNullsLast = 'post_link_DESC_NULLS_LAST',
  PostMetaAsc = 'post_meta_ASC',
  PostMetaAscNullsFirst = 'post_meta_ASC_NULLS_FIRST',
  PostMetaDesc = 'post_meta_DESC',
  PostMetaDescNullsLast = 'post_meta_DESC_NULLS_LAST',
  PostProposalIndexAsc = 'post_proposalIndex_ASC',
  PostProposalIndexAscNullsFirst = 'post_proposalIndex_ASC_NULLS_FIRST',
  PostProposalIndexDesc = 'post_proposalIndex_DESC',
  PostProposalIndexDescNullsLast = 'post_proposalIndex_DESC_NULLS_LAST',
  PostPublicRepliesCountAsc = 'post_publicRepliesCount_ASC',
  PostPublicRepliesCountAscNullsFirst = 'post_publicRepliesCount_ASC_NULLS_FIRST',
  PostPublicRepliesCountDesc = 'post_publicRepliesCount_DESC',
  PostPublicRepliesCountDescNullsLast = 'post_publicRepliesCount_DESC_NULLS_LAST',
  PostReactionsCountAsc = 'post_reactionsCount_ASC',
  PostReactionsCountAscNullsFirst = 'post_reactionsCount_ASC_NULLS_FIRST',
  PostReactionsCountDesc = 'post_reactionsCount_DESC',
  PostReactionsCountDescNullsLast = 'post_reactionsCount_DESC_NULLS_LAST',
  PostRepliesCountAsc = 'post_repliesCount_ASC',
  PostRepliesCountAscNullsFirst = 'post_repliesCount_ASC_NULLS_FIRST',
  PostRepliesCountDesc = 'post_repliesCount_DESC',
  PostRepliesCountDescNullsLast = 'post_repliesCount_DESC_NULLS_LAST',
  PostSharesCountAsc = 'post_sharesCount_ASC',
  PostSharesCountAscNullsFirst = 'post_sharesCount_ASC_NULLS_FIRST',
  PostSharesCountDesc = 'post_sharesCount_DESC',
  PostSharesCountDescNullsLast = 'post_sharesCount_DESC_NULLS_LAST',
  PostSlugAsc = 'post_slug_ASC',
  PostSlugAscNullsFirst = 'post_slug_ASC_NULLS_FIRST',
  PostSlugDesc = 'post_slug_DESC',
  PostSlugDescNullsLast = 'post_slug_DESC_NULLS_LAST',
  PostSummaryAsc = 'post_summary_ASC',
  PostSummaryAscNullsFirst = 'post_summary_ASC_NULLS_FIRST',
  PostSummaryDesc = 'post_summary_DESC',
  PostSummaryDescNullsLast = 'post_summary_DESC_NULLS_LAST',
  PostTagsOriginalAsc = 'post_tagsOriginal_ASC',
  PostTagsOriginalAscNullsFirst = 'post_tagsOriginal_ASC_NULLS_FIRST',
  PostTagsOriginalDesc = 'post_tagsOriginal_DESC',
  PostTagsOriginalDescNullsLast = 'post_tagsOriginal_DESC_NULLS_LAST',
  PostTitleAsc = 'post_title_ASC',
  PostTitleAscNullsFirst = 'post_title_ASC_NULLS_FIRST',
  PostTitleDesc = 'post_title_DESC',
  PostTitleDescNullsLast = 'post_title_DESC_NULLS_LAST',
  PostTweetIdAsc = 'post_tweetId_ASC',
  PostTweetIdAscNullsFirst = 'post_tweetId_ASC_NULLS_FIRST',
  PostTweetIdDesc = 'post_tweetId_DESC',
  PostTweetIdDescNullsLast = 'post_tweetId_DESC_NULLS_LAST',
  PostUpdatedAtTimeAsc = 'post_updatedAtTime_ASC',
  PostUpdatedAtTimeAscNullsFirst = 'post_updatedAtTime_ASC_NULLS_FIRST',
  PostUpdatedAtTimeDesc = 'post_updatedAtTime_DESC',
  PostUpdatedAtTimeDescNullsLast = 'post_updatedAtTime_DESC_NULLS_LAST',
  PostUpvotesCountAsc = 'post_upvotesCount_ASC',
  PostUpvotesCountAscNullsFirst = 'post_upvotesCount_ASC_NULLS_FIRST',
  PostUpvotesCountDesc = 'post_upvotesCount_DESC',
  PostUpvotesCountDescNullsLast = 'post_upvotesCount_DESC_NULLS_LAST',
  StatusAsc = 'status_ASC',
  StatusAscNullsFirst = 'status_ASC_NULLS_FIRST',
  StatusDesc = 'status_DESC',
  StatusDescNullsLast = 'status_DESC_NULLS_LAST',
  UpdatedAtBlockAsc = 'updatedAtBlock_ASC',
  UpdatedAtBlockAscNullsFirst = 'updatedAtBlock_ASC_NULLS_FIRST',
  UpdatedAtBlockDesc = 'updatedAtBlock_DESC',
  UpdatedAtBlockDescNullsLast = 'updatedAtBlock_DESC_NULLS_LAST',
  UpdatedAtTimeAsc = 'updatedAtTime_ASC',
  UpdatedAtTimeAscNullsFirst = 'updatedAtTime_ASC_NULLS_FIRST',
  UpdatedAtTimeDesc = 'updatedAtTime_DESC',
  UpdatedAtTimeDescNullsLast = 'updatedAtTime_DESC_NULLS_LAST'
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
  /** A source of profile data. */
  profileSource?: Maybe<Scalars['String']['output']>;
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
  FollowerAccountFollowersCountAscNullsFirst = 'followerAccount_followersCount_ASC_NULLS_FIRST',
  FollowerAccountFollowersCountDesc = 'followerAccount_followersCount_DESC',
  FollowerAccountFollowersCountDescNullsLast = 'followerAccount_followersCount_DESC_NULLS_LAST',
  FollowerAccountFollowingAccountsCountAsc = 'followerAccount_followingAccountsCount_ASC',
  FollowerAccountFollowingAccountsCountAscNullsFirst = 'followerAccount_followingAccountsCount_ASC_NULLS_FIRST',
  FollowerAccountFollowingAccountsCountDesc = 'followerAccount_followingAccountsCount_DESC',
  FollowerAccountFollowingAccountsCountDescNullsLast = 'followerAccount_followingAccountsCount_DESC_NULLS_LAST',
  FollowerAccountFollowingPostsCountAsc = 'followerAccount_followingPostsCount_ASC',
  FollowerAccountFollowingPostsCountAscNullsFirst = 'followerAccount_followingPostsCount_ASC_NULLS_FIRST',
  FollowerAccountFollowingPostsCountDesc = 'followerAccount_followingPostsCount_DESC',
  FollowerAccountFollowingPostsCountDescNullsLast = 'followerAccount_followingPostsCount_DESC_NULLS_LAST',
  FollowerAccountFollowingSpacesCountAsc = 'followerAccount_followingSpacesCount_ASC',
  FollowerAccountFollowingSpacesCountAscNullsFirst = 'followerAccount_followingSpacesCount_ASC_NULLS_FIRST',
  FollowerAccountFollowingSpacesCountDesc = 'followerAccount_followingSpacesCount_DESC',
  FollowerAccountFollowingSpacesCountDescNullsLast = 'followerAccount_followingSpacesCount_DESC_NULLS_LAST',
  FollowerAccountIdAsc = 'followerAccount_id_ASC',
  FollowerAccountIdAscNullsFirst = 'followerAccount_id_ASC_NULLS_FIRST',
  FollowerAccountIdDesc = 'followerAccount_id_DESC',
  FollowerAccountIdDescNullsLast = 'followerAccount_id_DESC_NULLS_LAST',
  FollowerAccountOwnedPostsCountAsc = 'followerAccount_ownedPostsCount_ASC',
  FollowerAccountOwnedPostsCountAscNullsFirst = 'followerAccount_ownedPostsCount_ASC_NULLS_FIRST',
  FollowerAccountOwnedPostsCountDesc = 'followerAccount_ownedPostsCount_DESC',
  FollowerAccountOwnedPostsCountDescNullsLast = 'followerAccount_ownedPostsCount_DESC_NULLS_LAST',
  FollowerAccountUpdatedAtBlockAsc = 'followerAccount_updatedAtBlock_ASC',
  FollowerAccountUpdatedAtBlockAscNullsFirst = 'followerAccount_updatedAtBlock_ASC_NULLS_FIRST',
  FollowerAccountUpdatedAtBlockDesc = 'followerAccount_updatedAtBlock_DESC',
  FollowerAccountUpdatedAtBlockDescNullsLast = 'followerAccount_updatedAtBlock_DESC_NULLS_LAST',
  FollowerAccountUpdatedAtTimeAsc = 'followerAccount_updatedAtTime_ASC',
  FollowerAccountUpdatedAtTimeAscNullsFirst = 'followerAccount_updatedAtTime_ASC_NULLS_FIRST',
  FollowerAccountUpdatedAtTimeDesc = 'followerAccount_updatedAtTime_DESC',
  FollowerAccountUpdatedAtTimeDescNullsLast = 'followerAccount_updatedAtTime_DESC_NULLS_LAST',
  FollowingSpaceAboutAsc = 'followingSpace_about_ASC',
  FollowingSpaceAboutAscNullsFirst = 'followingSpace_about_ASC_NULLS_FIRST',
  FollowingSpaceAboutDesc = 'followingSpace_about_DESC',
  FollowingSpaceAboutDescNullsLast = 'followingSpace_about_DESC_NULLS_LAST',
  FollowingSpaceCanEveryoneCreatePostsAsc = 'followingSpace_canEveryoneCreatePosts_ASC',
  FollowingSpaceCanEveryoneCreatePostsAscNullsFirst = 'followingSpace_canEveryoneCreatePosts_ASC_NULLS_FIRST',
  FollowingSpaceCanEveryoneCreatePostsDesc = 'followingSpace_canEveryoneCreatePosts_DESC',
  FollowingSpaceCanEveryoneCreatePostsDescNullsLast = 'followingSpace_canEveryoneCreatePosts_DESC_NULLS_LAST',
  FollowingSpaceCanFollowerCreatePostsAsc = 'followingSpace_canFollowerCreatePosts_ASC',
  FollowingSpaceCanFollowerCreatePostsAscNullsFirst = 'followingSpace_canFollowerCreatePosts_ASC_NULLS_FIRST',
  FollowingSpaceCanFollowerCreatePostsDesc = 'followingSpace_canFollowerCreatePosts_DESC',
  FollowingSpaceCanFollowerCreatePostsDescNullsLast = 'followingSpace_canFollowerCreatePosts_DESC_NULLS_LAST',
  FollowingSpaceContentAsc = 'followingSpace_content_ASC',
  FollowingSpaceContentAscNullsFirst = 'followingSpace_content_ASC_NULLS_FIRST',
  FollowingSpaceContentDesc = 'followingSpace_content_DESC',
  FollowingSpaceContentDescNullsLast = 'followingSpace_content_DESC_NULLS_LAST',
  FollowingSpaceCreatedAtBlockAsc = 'followingSpace_createdAtBlock_ASC',
  FollowingSpaceCreatedAtBlockAscNullsFirst = 'followingSpace_createdAtBlock_ASC_NULLS_FIRST',
  FollowingSpaceCreatedAtBlockDesc = 'followingSpace_createdAtBlock_DESC',
  FollowingSpaceCreatedAtBlockDescNullsLast = 'followingSpace_createdAtBlock_DESC_NULLS_LAST',
  FollowingSpaceCreatedAtTimeAsc = 'followingSpace_createdAtTime_ASC',
  FollowingSpaceCreatedAtTimeAscNullsFirst = 'followingSpace_createdAtTime_ASC_NULLS_FIRST',
  FollowingSpaceCreatedAtTimeDesc = 'followingSpace_createdAtTime_DESC',
  FollowingSpaceCreatedAtTimeDescNullsLast = 'followingSpace_createdAtTime_DESC_NULLS_LAST',
  FollowingSpaceCreatedOnDayAsc = 'followingSpace_createdOnDay_ASC',
  FollowingSpaceCreatedOnDayAscNullsFirst = 'followingSpace_createdOnDay_ASC_NULLS_FIRST',
  FollowingSpaceCreatedOnDayDesc = 'followingSpace_createdOnDay_DESC',
  FollowingSpaceCreatedOnDayDescNullsLast = 'followingSpace_createdOnDay_DESC_NULLS_LAST',
  FollowingSpaceEmailAsc = 'followingSpace_email_ASC',
  FollowingSpaceEmailAscNullsFirst = 'followingSpace_email_ASC_NULLS_FIRST',
  FollowingSpaceEmailDesc = 'followingSpace_email_DESC',
  FollowingSpaceEmailDescNullsLast = 'followingSpace_email_DESC_NULLS_LAST',
  FollowingSpaceFollowersCountAsc = 'followingSpace_followersCount_ASC',
  FollowingSpaceFollowersCountAscNullsFirst = 'followingSpace_followersCount_ASC_NULLS_FIRST',
  FollowingSpaceFollowersCountDesc = 'followingSpace_followersCount_DESC',
  FollowingSpaceFollowersCountDescNullsLast = 'followingSpace_followersCount_DESC_NULLS_LAST',
  FollowingSpaceFormatAsc = 'followingSpace_format_ASC',
  FollowingSpaceFormatAscNullsFirst = 'followingSpace_format_ASC_NULLS_FIRST',
  FollowingSpaceFormatDesc = 'followingSpace_format_DESC',
  FollowingSpaceFormatDescNullsLast = 'followingSpace_format_DESC_NULLS_LAST',
  FollowingSpaceHandleAsc = 'followingSpace_handle_ASC',
  FollowingSpaceHandleAscNullsFirst = 'followingSpace_handle_ASC_NULLS_FIRST',
  FollowingSpaceHandleDesc = 'followingSpace_handle_DESC',
  FollowingSpaceHandleDescNullsLast = 'followingSpace_handle_DESC_NULLS_LAST',
  FollowingSpaceHiddenPostsCountAsc = 'followingSpace_hiddenPostsCount_ASC',
  FollowingSpaceHiddenPostsCountAscNullsFirst = 'followingSpace_hiddenPostsCount_ASC_NULLS_FIRST',
  FollowingSpaceHiddenPostsCountDesc = 'followingSpace_hiddenPostsCount_DESC',
  FollowingSpaceHiddenPostsCountDescNullsLast = 'followingSpace_hiddenPostsCount_DESC_NULLS_LAST',
  FollowingSpaceHiddenAsc = 'followingSpace_hidden_ASC',
  FollowingSpaceHiddenAscNullsFirst = 'followingSpace_hidden_ASC_NULLS_FIRST',
  FollowingSpaceHiddenDesc = 'followingSpace_hidden_DESC',
  FollowingSpaceHiddenDescNullsLast = 'followingSpace_hidden_DESC_NULLS_LAST',
  FollowingSpaceIdAsc = 'followingSpace_id_ASC',
  FollowingSpaceIdAscNullsFirst = 'followingSpace_id_ASC_NULLS_FIRST',
  FollowingSpaceIdDesc = 'followingSpace_id_DESC',
  FollowingSpaceIdDescNullsLast = 'followingSpace_id_DESC_NULLS_LAST',
  FollowingSpaceImageAsc = 'followingSpace_image_ASC',
  FollowingSpaceImageAscNullsFirst = 'followingSpace_image_ASC_NULLS_FIRST',
  FollowingSpaceImageDesc = 'followingSpace_image_DESC',
  FollowingSpaceImageDescNullsLast = 'followingSpace_image_DESC_NULLS_LAST',
  FollowingSpaceInterestsOriginalAsc = 'followingSpace_interestsOriginal_ASC',
  FollowingSpaceInterestsOriginalAscNullsFirst = 'followingSpace_interestsOriginal_ASC_NULLS_FIRST',
  FollowingSpaceInterestsOriginalDesc = 'followingSpace_interestsOriginal_DESC',
  FollowingSpaceInterestsOriginalDescNullsLast = 'followingSpace_interestsOriginal_DESC_NULLS_LAST',
  FollowingSpaceIsShowMoreAsc = 'followingSpace_isShowMore_ASC',
  FollowingSpaceIsShowMoreAscNullsFirst = 'followingSpace_isShowMore_ASC_NULLS_FIRST',
  FollowingSpaceIsShowMoreDesc = 'followingSpace_isShowMore_DESC',
  FollowingSpaceIsShowMoreDescNullsLast = 'followingSpace_isShowMore_DESC_NULLS_LAST',
  FollowingSpaceLinksOriginalAsc = 'followingSpace_linksOriginal_ASC',
  FollowingSpaceLinksOriginalAscNullsFirst = 'followingSpace_linksOriginal_ASC_NULLS_FIRST',
  FollowingSpaceLinksOriginalDesc = 'followingSpace_linksOriginal_DESC',
  FollowingSpaceLinksOriginalDescNullsLast = 'followingSpace_linksOriginal_DESC_NULLS_LAST',
  FollowingSpaceNameAsc = 'followingSpace_name_ASC',
  FollowingSpaceNameAscNullsFirst = 'followingSpace_name_ASC_NULLS_FIRST',
  FollowingSpaceNameDesc = 'followingSpace_name_DESC',
  FollowingSpaceNameDescNullsLast = 'followingSpace_name_DESC_NULLS_LAST',
  FollowingSpacePostsCountAsc = 'followingSpace_postsCount_ASC',
  FollowingSpacePostsCountAscNullsFirst = 'followingSpace_postsCount_ASC_NULLS_FIRST',
  FollowingSpacePostsCountDesc = 'followingSpace_postsCount_DESC',
  FollowingSpacePostsCountDescNullsLast = 'followingSpace_postsCount_DESC_NULLS_LAST',
  FollowingSpaceProfileSourceAsc = 'followingSpace_profileSource_ASC',
  FollowingSpaceProfileSourceAscNullsFirst = 'followingSpace_profileSource_ASC_NULLS_FIRST',
  FollowingSpaceProfileSourceDesc = 'followingSpace_profileSource_DESC',
  FollowingSpaceProfileSourceDescNullsLast = 'followingSpace_profileSource_DESC_NULLS_LAST',
  FollowingSpacePublicPostsCountAsc = 'followingSpace_publicPostsCount_ASC',
  FollowingSpacePublicPostsCountAscNullsFirst = 'followingSpace_publicPostsCount_ASC_NULLS_FIRST',
  FollowingSpacePublicPostsCountDesc = 'followingSpace_publicPostsCount_DESC',
  FollowingSpacePublicPostsCountDescNullsLast = 'followingSpace_publicPostsCount_DESC_NULLS_LAST',
  FollowingSpaceSummaryAsc = 'followingSpace_summary_ASC',
  FollowingSpaceSummaryAscNullsFirst = 'followingSpace_summary_ASC_NULLS_FIRST',
  FollowingSpaceSummaryDesc = 'followingSpace_summary_DESC',
  FollowingSpaceSummaryDescNullsLast = 'followingSpace_summary_DESC_NULLS_LAST',
  FollowingSpaceTagsOriginalAsc = 'followingSpace_tagsOriginal_ASC',
  FollowingSpaceTagsOriginalAscNullsFirst = 'followingSpace_tagsOriginal_ASC_NULLS_FIRST',
  FollowingSpaceTagsOriginalDesc = 'followingSpace_tagsOriginal_DESC',
  FollowingSpaceTagsOriginalDescNullsLast = 'followingSpace_tagsOriginal_DESC_NULLS_LAST',
  FollowingSpaceUpdatedAtBlockAsc = 'followingSpace_updatedAtBlock_ASC',
  FollowingSpaceUpdatedAtBlockAscNullsFirst = 'followingSpace_updatedAtBlock_ASC_NULLS_FIRST',
  FollowingSpaceUpdatedAtBlockDesc = 'followingSpace_updatedAtBlock_DESC',
  FollowingSpaceUpdatedAtBlockDescNullsLast = 'followingSpace_updatedAtBlock_DESC_NULLS_LAST',
  FollowingSpaceUpdatedAtTimeAsc = 'followingSpace_updatedAtTime_ASC',
  FollowingSpaceUpdatedAtTimeAscNullsFirst = 'followingSpace_updatedAtTime_ASC_NULLS_FIRST',
  FollowingSpaceUpdatedAtTimeDesc = 'followingSpace_updatedAtTime_DESC',
  FollowingSpaceUpdatedAtTimeDescNullsLast = 'followingSpace_updatedAtTime_DESC_NULLS_LAST',
  FollowingSpaceUsernameAsc = 'followingSpace_username_ASC',
  FollowingSpaceUsernameAscNullsFirst = 'followingSpace_username_ASC_NULLS_FIRST',
  FollowingSpaceUsernameDesc = 'followingSpace_username_DESC',
  FollowingSpaceUsernameDescNullsLast = 'followingSpace_username_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST'
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
  AboutAscNullsFirst = 'about_ASC_NULLS_FIRST',
  AboutDesc = 'about_DESC',
  AboutDescNullsLast = 'about_DESC_NULLS_LAST',
  CanEveryoneCreatePostsAsc = 'canEveryoneCreatePosts_ASC',
  CanEveryoneCreatePostsAscNullsFirst = 'canEveryoneCreatePosts_ASC_NULLS_FIRST',
  CanEveryoneCreatePostsDesc = 'canEveryoneCreatePosts_DESC',
  CanEveryoneCreatePostsDescNullsLast = 'canEveryoneCreatePosts_DESC_NULLS_LAST',
  CanFollowerCreatePostsAsc = 'canFollowerCreatePosts_ASC',
  CanFollowerCreatePostsAscNullsFirst = 'canFollowerCreatePosts_ASC_NULLS_FIRST',
  CanFollowerCreatePostsDesc = 'canFollowerCreatePosts_DESC',
  CanFollowerCreatePostsDescNullsLast = 'canFollowerCreatePosts_DESC_NULLS_LAST',
  ContentAsc = 'content_ASC',
  ContentAscNullsFirst = 'content_ASC_NULLS_FIRST',
  ContentDesc = 'content_DESC',
  ContentDescNullsLast = 'content_DESC_NULLS_LAST',
  CreatedAtBlockAsc = 'createdAtBlock_ASC',
  CreatedAtBlockAscNullsFirst = 'createdAtBlock_ASC_NULLS_FIRST',
  CreatedAtBlockDesc = 'createdAtBlock_DESC',
  CreatedAtBlockDescNullsLast = 'createdAtBlock_DESC_NULLS_LAST',
  CreatedAtTimeAsc = 'createdAtTime_ASC',
  CreatedAtTimeAscNullsFirst = 'createdAtTime_ASC_NULLS_FIRST',
  CreatedAtTimeDesc = 'createdAtTime_DESC',
  CreatedAtTimeDescNullsLast = 'createdAtTime_DESC_NULLS_LAST',
  CreatedByAccountFollowersCountAsc = 'createdByAccount_followersCount_ASC',
  CreatedByAccountFollowersCountAscNullsFirst = 'createdByAccount_followersCount_ASC_NULLS_FIRST',
  CreatedByAccountFollowersCountDesc = 'createdByAccount_followersCount_DESC',
  CreatedByAccountFollowersCountDescNullsLast = 'createdByAccount_followersCount_DESC_NULLS_LAST',
  CreatedByAccountFollowingAccountsCountAsc = 'createdByAccount_followingAccountsCount_ASC',
  CreatedByAccountFollowingAccountsCountAscNullsFirst = 'createdByAccount_followingAccountsCount_ASC_NULLS_FIRST',
  CreatedByAccountFollowingAccountsCountDesc = 'createdByAccount_followingAccountsCount_DESC',
  CreatedByAccountFollowingAccountsCountDescNullsLast = 'createdByAccount_followingAccountsCount_DESC_NULLS_LAST',
  CreatedByAccountFollowingPostsCountAsc = 'createdByAccount_followingPostsCount_ASC',
  CreatedByAccountFollowingPostsCountAscNullsFirst = 'createdByAccount_followingPostsCount_ASC_NULLS_FIRST',
  CreatedByAccountFollowingPostsCountDesc = 'createdByAccount_followingPostsCount_DESC',
  CreatedByAccountFollowingPostsCountDescNullsLast = 'createdByAccount_followingPostsCount_DESC_NULLS_LAST',
  CreatedByAccountFollowingSpacesCountAsc = 'createdByAccount_followingSpacesCount_ASC',
  CreatedByAccountFollowingSpacesCountAscNullsFirst = 'createdByAccount_followingSpacesCount_ASC_NULLS_FIRST',
  CreatedByAccountFollowingSpacesCountDesc = 'createdByAccount_followingSpacesCount_DESC',
  CreatedByAccountFollowingSpacesCountDescNullsLast = 'createdByAccount_followingSpacesCount_DESC_NULLS_LAST',
  CreatedByAccountIdAsc = 'createdByAccount_id_ASC',
  CreatedByAccountIdAscNullsFirst = 'createdByAccount_id_ASC_NULLS_FIRST',
  CreatedByAccountIdDesc = 'createdByAccount_id_DESC',
  CreatedByAccountIdDescNullsLast = 'createdByAccount_id_DESC_NULLS_LAST',
  CreatedByAccountOwnedPostsCountAsc = 'createdByAccount_ownedPostsCount_ASC',
  CreatedByAccountOwnedPostsCountAscNullsFirst = 'createdByAccount_ownedPostsCount_ASC_NULLS_FIRST',
  CreatedByAccountOwnedPostsCountDesc = 'createdByAccount_ownedPostsCount_DESC',
  CreatedByAccountOwnedPostsCountDescNullsLast = 'createdByAccount_ownedPostsCount_DESC_NULLS_LAST',
  CreatedByAccountUpdatedAtBlockAsc = 'createdByAccount_updatedAtBlock_ASC',
  CreatedByAccountUpdatedAtBlockAscNullsFirst = 'createdByAccount_updatedAtBlock_ASC_NULLS_FIRST',
  CreatedByAccountUpdatedAtBlockDesc = 'createdByAccount_updatedAtBlock_DESC',
  CreatedByAccountUpdatedAtBlockDescNullsLast = 'createdByAccount_updatedAtBlock_DESC_NULLS_LAST',
  CreatedByAccountUpdatedAtTimeAsc = 'createdByAccount_updatedAtTime_ASC',
  CreatedByAccountUpdatedAtTimeAscNullsFirst = 'createdByAccount_updatedAtTime_ASC_NULLS_FIRST',
  CreatedByAccountUpdatedAtTimeDesc = 'createdByAccount_updatedAtTime_DESC',
  CreatedByAccountUpdatedAtTimeDescNullsLast = 'createdByAccount_updatedAtTime_DESC_NULLS_LAST',
  CreatedOnDayAsc = 'createdOnDay_ASC',
  CreatedOnDayAscNullsFirst = 'createdOnDay_ASC_NULLS_FIRST',
  CreatedOnDayDesc = 'createdOnDay_DESC',
  CreatedOnDayDescNullsLast = 'createdOnDay_DESC_NULLS_LAST',
  EmailAsc = 'email_ASC',
  EmailAscNullsFirst = 'email_ASC_NULLS_FIRST',
  EmailDesc = 'email_DESC',
  EmailDescNullsLast = 'email_DESC_NULLS_LAST',
  EveryonePermissionsCreateCommentsAsc = 'everyonePermissions_createComments_ASC',
  EveryonePermissionsCreateCommentsAscNullsFirst = 'everyonePermissions_createComments_ASC_NULLS_FIRST',
  EveryonePermissionsCreateCommentsDesc = 'everyonePermissions_createComments_DESC',
  EveryonePermissionsCreateCommentsDescNullsLast = 'everyonePermissions_createComments_DESC_NULLS_LAST',
  EveryonePermissionsCreatePostsAsc = 'everyonePermissions_createPosts_ASC',
  EveryonePermissionsCreatePostsAscNullsFirst = 'everyonePermissions_createPosts_ASC_NULLS_FIRST',
  EveryonePermissionsCreatePostsDesc = 'everyonePermissions_createPosts_DESC',
  EveryonePermissionsCreatePostsDescNullsLast = 'everyonePermissions_createPosts_DESC_NULLS_LAST',
  EveryonePermissionsCreateSubspacesAsc = 'everyonePermissions_createSubspaces_ASC',
  EveryonePermissionsCreateSubspacesAscNullsFirst = 'everyonePermissions_createSubspaces_ASC_NULLS_FIRST',
  EveryonePermissionsCreateSubspacesDesc = 'everyonePermissions_createSubspaces_DESC',
  EveryonePermissionsCreateSubspacesDescNullsLast = 'everyonePermissions_createSubspaces_DESC_NULLS_LAST',
  EveryonePermissionsDeleteAnyPostAsc = 'everyonePermissions_deleteAnyPost_ASC',
  EveryonePermissionsDeleteAnyPostAscNullsFirst = 'everyonePermissions_deleteAnyPost_ASC_NULLS_FIRST',
  EveryonePermissionsDeleteAnyPostDesc = 'everyonePermissions_deleteAnyPost_DESC',
  EveryonePermissionsDeleteAnyPostDescNullsLast = 'everyonePermissions_deleteAnyPost_DESC_NULLS_LAST',
  EveryonePermissionsDeleteAnySubspaceAsc = 'everyonePermissions_deleteAnySubspace_ASC',
  EveryonePermissionsDeleteAnySubspaceAscNullsFirst = 'everyonePermissions_deleteAnySubspace_ASC_NULLS_FIRST',
  EveryonePermissionsDeleteAnySubspaceDesc = 'everyonePermissions_deleteAnySubspace_DESC',
  EveryonePermissionsDeleteAnySubspaceDescNullsLast = 'everyonePermissions_deleteAnySubspace_DESC_NULLS_LAST',
  EveryonePermissionsDeleteOwnCommentsAsc = 'everyonePermissions_deleteOwnComments_ASC',
  EveryonePermissionsDeleteOwnCommentsAscNullsFirst = 'everyonePermissions_deleteOwnComments_ASC_NULLS_FIRST',
  EveryonePermissionsDeleteOwnCommentsDesc = 'everyonePermissions_deleteOwnComments_DESC',
  EveryonePermissionsDeleteOwnCommentsDescNullsLast = 'everyonePermissions_deleteOwnComments_DESC_NULLS_LAST',
  EveryonePermissionsDeleteOwnPostsAsc = 'everyonePermissions_deleteOwnPosts_ASC',
  EveryonePermissionsDeleteOwnPostsAscNullsFirst = 'everyonePermissions_deleteOwnPosts_ASC_NULLS_FIRST',
  EveryonePermissionsDeleteOwnPostsDesc = 'everyonePermissions_deleteOwnPosts_DESC',
  EveryonePermissionsDeleteOwnPostsDescNullsLast = 'everyonePermissions_deleteOwnPosts_DESC_NULLS_LAST',
  EveryonePermissionsDeleteOwnSubspacesAsc = 'everyonePermissions_deleteOwnSubspaces_ASC',
  EveryonePermissionsDeleteOwnSubspacesAscNullsFirst = 'everyonePermissions_deleteOwnSubspaces_ASC_NULLS_FIRST',
  EveryonePermissionsDeleteOwnSubspacesDesc = 'everyonePermissions_deleteOwnSubspaces_DESC',
  EveryonePermissionsDeleteOwnSubspacesDescNullsLast = 'everyonePermissions_deleteOwnSubspaces_DESC_NULLS_LAST',
  EveryonePermissionsDownvoteAsc = 'everyonePermissions_downvote_ASC',
  EveryonePermissionsDownvoteAscNullsFirst = 'everyonePermissions_downvote_ASC_NULLS_FIRST',
  EveryonePermissionsDownvoteDesc = 'everyonePermissions_downvote_DESC',
  EveryonePermissionsDownvoteDescNullsLast = 'everyonePermissions_downvote_DESC_NULLS_LAST',
  EveryonePermissionsHideAnyCommentAsc = 'everyonePermissions_hideAnyComment_ASC',
  EveryonePermissionsHideAnyCommentAscNullsFirst = 'everyonePermissions_hideAnyComment_ASC_NULLS_FIRST',
  EveryonePermissionsHideAnyCommentDesc = 'everyonePermissions_hideAnyComment_DESC',
  EveryonePermissionsHideAnyCommentDescNullsLast = 'everyonePermissions_hideAnyComment_DESC_NULLS_LAST',
  EveryonePermissionsHideAnyPostAsc = 'everyonePermissions_hideAnyPost_ASC',
  EveryonePermissionsHideAnyPostAscNullsFirst = 'everyonePermissions_hideAnyPost_ASC_NULLS_FIRST',
  EveryonePermissionsHideAnyPostDesc = 'everyonePermissions_hideAnyPost_DESC',
  EveryonePermissionsHideAnyPostDescNullsLast = 'everyonePermissions_hideAnyPost_DESC_NULLS_LAST',
  EveryonePermissionsHideAnySubspaceAsc = 'everyonePermissions_hideAnySubspace_ASC',
  EveryonePermissionsHideAnySubspaceAscNullsFirst = 'everyonePermissions_hideAnySubspace_ASC_NULLS_FIRST',
  EveryonePermissionsHideAnySubspaceDesc = 'everyonePermissions_hideAnySubspace_DESC',
  EveryonePermissionsHideAnySubspaceDescNullsLast = 'everyonePermissions_hideAnySubspace_DESC_NULLS_LAST',
  EveryonePermissionsHideOwnCommentsAsc = 'everyonePermissions_hideOwnComments_ASC',
  EveryonePermissionsHideOwnCommentsAscNullsFirst = 'everyonePermissions_hideOwnComments_ASC_NULLS_FIRST',
  EveryonePermissionsHideOwnCommentsDesc = 'everyonePermissions_hideOwnComments_DESC',
  EveryonePermissionsHideOwnCommentsDescNullsLast = 'everyonePermissions_hideOwnComments_DESC_NULLS_LAST',
  EveryonePermissionsHideOwnPostsAsc = 'everyonePermissions_hideOwnPosts_ASC',
  EveryonePermissionsHideOwnPostsAscNullsFirst = 'everyonePermissions_hideOwnPosts_ASC_NULLS_FIRST',
  EveryonePermissionsHideOwnPostsDesc = 'everyonePermissions_hideOwnPosts_DESC',
  EveryonePermissionsHideOwnPostsDescNullsLast = 'everyonePermissions_hideOwnPosts_DESC_NULLS_LAST',
  EveryonePermissionsHideOwnSubspacesAsc = 'everyonePermissions_hideOwnSubspaces_ASC',
  EveryonePermissionsHideOwnSubspacesAscNullsFirst = 'everyonePermissions_hideOwnSubspaces_ASC_NULLS_FIRST',
  EveryonePermissionsHideOwnSubspacesDesc = 'everyonePermissions_hideOwnSubspaces_DESC',
  EveryonePermissionsHideOwnSubspacesDescNullsLast = 'everyonePermissions_hideOwnSubspaces_DESC_NULLS_LAST',
  EveryonePermissionsManageRolesAsc = 'everyonePermissions_manageRoles_ASC',
  EveryonePermissionsManageRolesAscNullsFirst = 'everyonePermissions_manageRoles_ASC_NULLS_FIRST',
  EveryonePermissionsManageRolesDesc = 'everyonePermissions_manageRoles_DESC',
  EveryonePermissionsManageRolesDescNullsLast = 'everyonePermissions_manageRoles_DESC_NULLS_LAST',
  EveryonePermissionsOverridePostPermissionsAsc = 'everyonePermissions_overridePostPermissions_ASC',
  EveryonePermissionsOverridePostPermissionsAscNullsFirst = 'everyonePermissions_overridePostPermissions_ASC_NULLS_FIRST',
  EveryonePermissionsOverridePostPermissionsDesc = 'everyonePermissions_overridePostPermissions_DESC',
  EveryonePermissionsOverridePostPermissionsDescNullsLast = 'everyonePermissions_overridePostPermissions_DESC_NULLS_LAST',
  EveryonePermissionsOverrideSubspacePermissionsAsc = 'everyonePermissions_overrideSubspacePermissions_ASC',
  EveryonePermissionsOverrideSubspacePermissionsAscNullsFirst = 'everyonePermissions_overrideSubspacePermissions_ASC_NULLS_FIRST',
  EveryonePermissionsOverrideSubspacePermissionsDesc = 'everyonePermissions_overrideSubspacePermissions_DESC',
  EveryonePermissionsOverrideSubspacePermissionsDescNullsLast = 'everyonePermissions_overrideSubspacePermissions_DESC_NULLS_LAST',
  EveryonePermissionsRepresentSpaceExternallyAsc = 'everyonePermissions_representSpaceExternally_ASC',
  EveryonePermissionsRepresentSpaceExternallyAscNullsFirst = 'everyonePermissions_representSpaceExternally_ASC_NULLS_FIRST',
  EveryonePermissionsRepresentSpaceExternallyDesc = 'everyonePermissions_representSpaceExternally_DESC',
  EveryonePermissionsRepresentSpaceExternallyDescNullsLast = 'everyonePermissions_representSpaceExternally_DESC_NULLS_LAST',
  EveryonePermissionsRepresentSpaceInternallyAsc = 'everyonePermissions_representSpaceInternally_ASC',
  EveryonePermissionsRepresentSpaceInternallyAscNullsFirst = 'everyonePermissions_representSpaceInternally_ASC_NULLS_FIRST',
  EveryonePermissionsRepresentSpaceInternallyDesc = 'everyonePermissions_representSpaceInternally_DESC',
  EveryonePermissionsRepresentSpaceInternallyDescNullsLast = 'everyonePermissions_representSpaceInternally_DESC_NULLS_LAST',
  EveryonePermissionsShareAsc = 'everyonePermissions_share_ASC',
  EveryonePermissionsShareAscNullsFirst = 'everyonePermissions_share_ASC_NULLS_FIRST',
  EveryonePermissionsShareDesc = 'everyonePermissions_share_DESC',
  EveryonePermissionsShareDescNullsLast = 'everyonePermissions_share_DESC_NULLS_LAST',
  EveryonePermissionsSuggestEntityStatusAsc = 'everyonePermissions_suggestEntityStatus_ASC',
  EveryonePermissionsSuggestEntityStatusAscNullsFirst = 'everyonePermissions_suggestEntityStatus_ASC_NULLS_FIRST',
  EveryonePermissionsSuggestEntityStatusDesc = 'everyonePermissions_suggestEntityStatus_DESC',
  EveryonePermissionsSuggestEntityStatusDescNullsLast = 'everyonePermissions_suggestEntityStatus_DESC_NULLS_LAST',
  EveryonePermissionsUpdateAnyPostAsc = 'everyonePermissions_updateAnyPost_ASC',
  EveryonePermissionsUpdateAnyPostAscNullsFirst = 'everyonePermissions_updateAnyPost_ASC_NULLS_FIRST',
  EveryonePermissionsUpdateAnyPostDesc = 'everyonePermissions_updateAnyPost_DESC',
  EveryonePermissionsUpdateAnyPostDescNullsLast = 'everyonePermissions_updateAnyPost_DESC_NULLS_LAST',
  EveryonePermissionsUpdateAnySubspaceAsc = 'everyonePermissions_updateAnySubspace_ASC',
  EveryonePermissionsUpdateAnySubspaceAscNullsFirst = 'everyonePermissions_updateAnySubspace_ASC_NULLS_FIRST',
  EveryonePermissionsUpdateAnySubspaceDesc = 'everyonePermissions_updateAnySubspace_DESC',
  EveryonePermissionsUpdateAnySubspaceDescNullsLast = 'everyonePermissions_updateAnySubspace_DESC_NULLS_LAST',
  EveryonePermissionsUpdateEntityStatusAsc = 'everyonePermissions_updateEntityStatus_ASC',
  EveryonePermissionsUpdateEntityStatusAscNullsFirst = 'everyonePermissions_updateEntityStatus_ASC_NULLS_FIRST',
  EveryonePermissionsUpdateEntityStatusDesc = 'everyonePermissions_updateEntityStatus_DESC',
  EveryonePermissionsUpdateEntityStatusDescNullsLast = 'everyonePermissions_updateEntityStatus_DESC_NULLS_LAST',
  EveryonePermissionsUpdateOwnCommentsAsc = 'everyonePermissions_updateOwnComments_ASC',
  EveryonePermissionsUpdateOwnCommentsAscNullsFirst = 'everyonePermissions_updateOwnComments_ASC_NULLS_FIRST',
  EveryonePermissionsUpdateOwnCommentsDesc = 'everyonePermissions_updateOwnComments_DESC',
  EveryonePermissionsUpdateOwnCommentsDescNullsLast = 'everyonePermissions_updateOwnComments_DESC_NULLS_LAST',
  EveryonePermissionsUpdateOwnPostsAsc = 'everyonePermissions_updateOwnPosts_ASC',
  EveryonePermissionsUpdateOwnPostsAscNullsFirst = 'everyonePermissions_updateOwnPosts_ASC_NULLS_FIRST',
  EveryonePermissionsUpdateOwnPostsDesc = 'everyonePermissions_updateOwnPosts_DESC',
  EveryonePermissionsUpdateOwnPostsDescNullsLast = 'everyonePermissions_updateOwnPosts_DESC_NULLS_LAST',
  EveryonePermissionsUpdateOwnSubspacesAsc = 'everyonePermissions_updateOwnSubspaces_ASC',
  EveryonePermissionsUpdateOwnSubspacesAscNullsFirst = 'everyonePermissions_updateOwnSubspaces_ASC_NULLS_FIRST',
  EveryonePermissionsUpdateOwnSubspacesDesc = 'everyonePermissions_updateOwnSubspaces_DESC',
  EveryonePermissionsUpdateOwnSubspacesDescNullsLast = 'everyonePermissions_updateOwnSubspaces_DESC_NULLS_LAST',
  EveryonePermissionsUpdateSpaceSettingsAsc = 'everyonePermissions_updateSpaceSettings_ASC',
  EveryonePermissionsUpdateSpaceSettingsAscNullsFirst = 'everyonePermissions_updateSpaceSettings_ASC_NULLS_FIRST',
  EveryonePermissionsUpdateSpaceSettingsDesc = 'everyonePermissions_updateSpaceSettings_DESC',
  EveryonePermissionsUpdateSpaceSettingsDescNullsLast = 'everyonePermissions_updateSpaceSettings_DESC_NULLS_LAST',
  EveryonePermissionsUpdateSpaceAsc = 'everyonePermissions_updateSpace_ASC',
  EveryonePermissionsUpdateSpaceAscNullsFirst = 'everyonePermissions_updateSpace_ASC_NULLS_FIRST',
  EveryonePermissionsUpdateSpaceDesc = 'everyonePermissions_updateSpace_DESC',
  EveryonePermissionsUpdateSpaceDescNullsLast = 'everyonePermissions_updateSpace_DESC_NULLS_LAST',
  EveryonePermissionsUpvoteAsc = 'everyonePermissions_upvote_ASC',
  EveryonePermissionsUpvoteAscNullsFirst = 'everyonePermissions_upvote_ASC_NULLS_FIRST',
  EveryonePermissionsUpvoteDesc = 'everyonePermissions_upvote_DESC',
  EveryonePermissionsUpvoteDescNullsLast = 'everyonePermissions_upvote_DESC_NULLS_LAST',
  FollowerPermissionsCreateCommentsAsc = 'followerPermissions_createComments_ASC',
  FollowerPermissionsCreateCommentsAscNullsFirst = 'followerPermissions_createComments_ASC_NULLS_FIRST',
  FollowerPermissionsCreateCommentsDesc = 'followerPermissions_createComments_DESC',
  FollowerPermissionsCreateCommentsDescNullsLast = 'followerPermissions_createComments_DESC_NULLS_LAST',
  FollowerPermissionsCreatePostsAsc = 'followerPermissions_createPosts_ASC',
  FollowerPermissionsCreatePostsAscNullsFirst = 'followerPermissions_createPosts_ASC_NULLS_FIRST',
  FollowerPermissionsCreatePostsDesc = 'followerPermissions_createPosts_DESC',
  FollowerPermissionsCreatePostsDescNullsLast = 'followerPermissions_createPosts_DESC_NULLS_LAST',
  FollowerPermissionsCreateSubspacesAsc = 'followerPermissions_createSubspaces_ASC',
  FollowerPermissionsCreateSubspacesAscNullsFirst = 'followerPermissions_createSubspaces_ASC_NULLS_FIRST',
  FollowerPermissionsCreateSubspacesDesc = 'followerPermissions_createSubspaces_DESC',
  FollowerPermissionsCreateSubspacesDescNullsLast = 'followerPermissions_createSubspaces_DESC_NULLS_LAST',
  FollowerPermissionsDeleteAnyPostAsc = 'followerPermissions_deleteAnyPost_ASC',
  FollowerPermissionsDeleteAnyPostAscNullsFirst = 'followerPermissions_deleteAnyPost_ASC_NULLS_FIRST',
  FollowerPermissionsDeleteAnyPostDesc = 'followerPermissions_deleteAnyPost_DESC',
  FollowerPermissionsDeleteAnyPostDescNullsLast = 'followerPermissions_deleteAnyPost_DESC_NULLS_LAST',
  FollowerPermissionsDeleteAnySubspaceAsc = 'followerPermissions_deleteAnySubspace_ASC',
  FollowerPermissionsDeleteAnySubspaceAscNullsFirst = 'followerPermissions_deleteAnySubspace_ASC_NULLS_FIRST',
  FollowerPermissionsDeleteAnySubspaceDesc = 'followerPermissions_deleteAnySubspace_DESC',
  FollowerPermissionsDeleteAnySubspaceDescNullsLast = 'followerPermissions_deleteAnySubspace_DESC_NULLS_LAST',
  FollowerPermissionsDeleteOwnCommentsAsc = 'followerPermissions_deleteOwnComments_ASC',
  FollowerPermissionsDeleteOwnCommentsAscNullsFirst = 'followerPermissions_deleteOwnComments_ASC_NULLS_FIRST',
  FollowerPermissionsDeleteOwnCommentsDesc = 'followerPermissions_deleteOwnComments_DESC',
  FollowerPermissionsDeleteOwnCommentsDescNullsLast = 'followerPermissions_deleteOwnComments_DESC_NULLS_LAST',
  FollowerPermissionsDeleteOwnPostsAsc = 'followerPermissions_deleteOwnPosts_ASC',
  FollowerPermissionsDeleteOwnPostsAscNullsFirst = 'followerPermissions_deleteOwnPosts_ASC_NULLS_FIRST',
  FollowerPermissionsDeleteOwnPostsDesc = 'followerPermissions_deleteOwnPosts_DESC',
  FollowerPermissionsDeleteOwnPostsDescNullsLast = 'followerPermissions_deleteOwnPosts_DESC_NULLS_LAST',
  FollowerPermissionsDeleteOwnSubspacesAsc = 'followerPermissions_deleteOwnSubspaces_ASC',
  FollowerPermissionsDeleteOwnSubspacesAscNullsFirst = 'followerPermissions_deleteOwnSubspaces_ASC_NULLS_FIRST',
  FollowerPermissionsDeleteOwnSubspacesDesc = 'followerPermissions_deleteOwnSubspaces_DESC',
  FollowerPermissionsDeleteOwnSubspacesDescNullsLast = 'followerPermissions_deleteOwnSubspaces_DESC_NULLS_LAST',
  FollowerPermissionsDownvoteAsc = 'followerPermissions_downvote_ASC',
  FollowerPermissionsDownvoteAscNullsFirst = 'followerPermissions_downvote_ASC_NULLS_FIRST',
  FollowerPermissionsDownvoteDesc = 'followerPermissions_downvote_DESC',
  FollowerPermissionsDownvoteDescNullsLast = 'followerPermissions_downvote_DESC_NULLS_LAST',
  FollowerPermissionsHideAnyCommentAsc = 'followerPermissions_hideAnyComment_ASC',
  FollowerPermissionsHideAnyCommentAscNullsFirst = 'followerPermissions_hideAnyComment_ASC_NULLS_FIRST',
  FollowerPermissionsHideAnyCommentDesc = 'followerPermissions_hideAnyComment_DESC',
  FollowerPermissionsHideAnyCommentDescNullsLast = 'followerPermissions_hideAnyComment_DESC_NULLS_LAST',
  FollowerPermissionsHideAnyPostAsc = 'followerPermissions_hideAnyPost_ASC',
  FollowerPermissionsHideAnyPostAscNullsFirst = 'followerPermissions_hideAnyPost_ASC_NULLS_FIRST',
  FollowerPermissionsHideAnyPostDesc = 'followerPermissions_hideAnyPost_DESC',
  FollowerPermissionsHideAnyPostDescNullsLast = 'followerPermissions_hideAnyPost_DESC_NULLS_LAST',
  FollowerPermissionsHideAnySubspaceAsc = 'followerPermissions_hideAnySubspace_ASC',
  FollowerPermissionsHideAnySubspaceAscNullsFirst = 'followerPermissions_hideAnySubspace_ASC_NULLS_FIRST',
  FollowerPermissionsHideAnySubspaceDesc = 'followerPermissions_hideAnySubspace_DESC',
  FollowerPermissionsHideAnySubspaceDescNullsLast = 'followerPermissions_hideAnySubspace_DESC_NULLS_LAST',
  FollowerPermissionsHideOwnCommentsAsc = 'followerPermissions_hideOwnComments_ASC',
  FollowerPermissionsHideOwnCommentsAscNullsFirst = 'followerPermissions_hideOwnComments_ASC_NULLS_FIRST',
  FollowerPermissionsHideOwnCommentsDesc = 'followerPermissions_hideOwnComments_DESC',
  FollowerPermissionsHideOwnCommentsDescNullsLast = 'followerPermissions_hideOwnComments_DESC_NULLS_LAST',
  FollowerPermissionsHideOwnPostsAsc = 'followerPermissions_hideOwnPosts_ASC',
  FollowerPermissionsHideOwnPostsAscNullsFirst = 'followerPermissions_hideOwnPosts_ASC_NULLS_FIRST',
  FollowerPermissionsHideOwnPostsDesc = 'followerPermissions_hideOwnPosts_DESC',
  FollowerPermissionsHideOwnPostsDescNullsLast = 'followerPermissions_hideOwnPosts_DESC_NULLS_LAST',
  FollowerPermissionsHideOwnSubspacesAsc = 'followerPermissions_hideOwnSubspaces_ASC',
  FollowerPermissionsHideOwnSubspacesAscNullsFirst = 'followerPermissions_hideOwnSubspaces_ASC_NULLS_FIRST',
  FollowerPermissionsHideOwnSubspacesDesc = 'followerPermissions_hideOwnSubspaces_DESC',
  FollowerPermissionsHideOwnSubspacesDescNullsLast = 'followerPermissions_hideOwnSubspaces_DESC_NULLS_LAST',
  FollowerPermissionsManageRolesAsc = 'followerPermissions_manageRoles_ASC',
  FollowerPermissionsManageRolesAscNullsFirst = 'followerPermissions_manageRoles_ASC_NULLS_FIRST',
  FollowerPermissionsManageRolesDesc = 'followerPermissions_manageRoles_DESC',
  FollowerPermissionsManageRolesDescNullsLast = 'followerPermissions_manageRoles_DESC_NULLS_LAST',
  FollowerPermissionsOverridePostPermissionsAsc = 'followerPermissions_overridePostPermissions_ASC',
  FollowerPermissionsOverridePostPermissionsAscNullsFirst = 'followerPermissions_overridePostPermissions_ASC_NULLS_FIRST',
  FollowerPermissionsOverridePostPermissionsDesc = 'followerPermissions_overridePostPermissions_DESC',
  FollowerPermissionsOverridePostPermissionsDescNullsLast = 'followerPermissions_overridePostPermissions_DESC_NULLS_LAST',
  FollowerPermissionsOverrideSubspacePermissionsAsc = 'followerPermissions_overrideSubspacePermissions_ASC',
  FollowerPermissionsOverrideSubspacePermissionsAscNullsFirst = 'followerPermissions_overrideSubspacePermissions_ASC_NULLS_FIRST',
  FollowerPermissionsOverrideSubspacePermissionsDesc = 'followerPermissions_overrideSubspacePermissions_DESC',
  FollowerPermissionsOverrideSubspacePermissionsDescNullsLast = 'followerPermissions_overrideSubspacePermissions_DESC_NULLS_LAST',
  FollowerPermissionsRepresentSpaceExternallyAsc = 'followerPermissions_representSpaceExternally_ASC',
  FollowerPermissionsRepresentSpaceExternallyAscNullsFirst = 'followerPermissions_representSpaceExternally_ASC_NULLS_FIRST',
  FollowerPermissionsRepresentSpaceExternallyDesc = 'followerPermissions_representSpaceExternally_DESC',
  FollowerPermissionsRepresentSpaceExternallyDescNullsLast = 'followerPermissions_representSpaceExternally_DESC_NULLS_LAST',
  FollowerPermissionsRepresentSpaceInternallyAsc = 'followerPermissions_representSpaceInternally_ASC',
  FollowerPermissionsRepresentSpaceInternallyAscNullsFirst = 'followerPermissions_representSpaceInternally_ASC_NULLS_FIRST',
  FollowerPermissionsRepresentSpaceInternallyDesc = 'followerPermissions_representSpaceInternally_DESC',
  FollowerPermissionsRepresentSpaceInternallyDescNullsLast = 'followerPermissions_representSpaceInternally_DESC_NULLS_LAST',
  FollowerPermissionsShareAsc = 'followerPermissions_share_ASC',
  FollowerPermissionsShareAscNullsFirst = 'followerPermissions_share_ASC_NULLS_FIRST',
  FollowerPermissionsShareDesc = 'followerPermissions_share_DESC',
  FollowerPermissionsShareDescNullsLast = 'followerPermissions_share_DESC_NULLS_LAST',
  FollowerPermissionsSuggestEntityStatusAsc = 'followerPermissions_suggestEntityStatus_ASC',
  FollowerPermissionsSuggestEntityStatusAscNullsFirst = 'followerPermissions_suggestEntityStatus_ASC_NULLS_FIRST',
  FollowerPermissionsSuggestEntityStatusDesc = 'followerPermissions_suggestEntityStatus_DESC',
  FollowerPermissionsSuggestEntityStatusDescNullsLast = 'followerPermissions_suggestEntityStatus_DESC_NULLS_LAST',
  FollowerPermissionsUpdateAnyPostAsc = 'followerPermissions_updateAnyPost_ASC',
  FollowerPermissionsUpdateAnyPostAscNullsFirst = 'followerPermissions_updateAnyPost_ASC_NULLS_FIRST',
  FollowerPermissionsUpdateAnyPostDesc = 'followerPermissions_updateAnyPost_DESC',
  FollowerPermissionsUpdateAnyPostDescNullsLast = 'followerPermissions_updateAnyPost_DESC_NULLS_LAST',
  FollowerPermissionsUpdateAnySubspaceAsc = 'followerPermissions_updateAnySubspace_ASC',
  FollowerPermissionsUpdateAnySubspaceAscNullsFirst = 'followerPermissions_updateAnySubspace_ASC_NULLS_FIRST',
  FollowerPermissionsUpdateAnySubspaceDesc = 'followerPermissions_updateAnySubspace_DESC',
  FollowerPermissionsUpdateAnySubspaceDescNullsLast = 'followerPermissions_updateAnySubspace_DESC_NULLS_LAST',
  FollowerPermissionsUpdateEntityStatusAsc = 'followerPermissions_updateEntityStatus_ASC',
  FollowerPermissionsUpdateEntityStatusAscNullsFirst = 'followerPermissions_updateEntityStatus_ASC_NULLS_FIRST',
  FollowerPermissionsUpdateEntityStatusDesc = 'followerPermissions_updateEntityStatus_DESC',
  FollowerPermissionsUpdateEntityStatusDescNullsLast = 'followerPermissions_updateEntityStatus_DESC_NULLS_LAST',
  FollowerPermissionsUpdateOwnCommentsAsc = 'followerPermissions_updateOwnComments_ASC',
  FollowerPermissionsUpdateOwnCommentsAscNullsFirst = 'followerPermissions_updateOwnComments_ASC_NULLS_FIRST',
  FollowerPermissionsUpdateOwnCommentsDesc = 'followerPermissions_updateOwnComments_DESC',
  FollowerPermissionsUpdateOwnCommentsDescNullsLast = 'followerPermissions_updateOwnComments_DESC_NULLS_LAST',
  FollowerPermissionsUpdateOwnPostsAsc = 'followerPermissions_updateOwnPosts_ASC',
  FollowerPermissionsUpdateOwnPostsAscNullsFirst = 'followerPermissions_updateOwnPosts_ASC_NULLS_FIRST',
  FollowerPermissionsUpdateOwnPostsDesc = 'followerPermissions_updateOwnPosts_DESC',
  FollowerPermissionsUpdateOwnPostsDescNullsLast = 'followerPermissions_updateOwnPosts_DESC_NULLS_LAST',
  FollowerPermissionsUpdateOwnSubspacesAsc = 'followerPermissions_updateOwnSubspaces_ASC',
  FollowerPermissionsUpdateOwnSubspacesAscNullsFirst = 'followerPermissions_updateOwnSubspaces_ASC_NULLS_FIRST',
  FollowerPermissionsUpdateOwnSubspacesDesc = 'followerPermissions_updateOwnSubspaces_DESC',
  FollowerPermissionsUpdateOwnSubspacesDescNullsLast = 'followerPermissions_updateOwnSubspaces_DESC_NULLS_LAST',
  FollowerPermissionsUpdateSpaceSettingsAsc = 'followerPermissions_updateSpaceSettings_ASC',
  FollowerPermissionsUpdateSpaceSettingsAscNullsFirst = 'followerPermissions_updateSpaceSettings_ASC_NULLS_FIRST',
  FollowerPermissionsUpdateSpaceSettingsDesc = 'followerPermissions_updateSpaceSettings_DESC',
  FollowerPermissionsUpdateSpaceSettingsDescNullsLast = 'followerPermissions_updateSpaceSettings_DESC_NULLS_LAST',
  FollowerPermissionsUpdateSpaceAsc = 'followerPermissions_updateSpace_ASC',
  FollowerPermissionsUpdateSpaceAscNullsFirst = 'followerPermissions_updateSpace_ASC_NULLS_FIRST',
  FollowerPermissionsUpdateSpaceDesc = 'followerPermissions_updateSpace_DESC',
  FollowerPermissionsUpdateSpaceDescNullsLast = 'followerPermissions_updateSpace_DESC_NULLS_LAST',
  FollowerPermissionsUpvoteAsc = 'followerPermissions_upvote_ASC',
  FollowerPermissionsUpvoteAscNullsFirst = 'followerPermissions_upvote_ASC_NULLS_FIRST',
  FollowerPermissionsUpvoteDesc = 'followerPermissions_upvote_DESC',
  FollowerPermissionsUpvoteDescNullsLast = 'followerPermissions_upvote_DESC_NULLS_LAST',
  FollowersCountAsc = 'followersCount_ASC',
  FollowersCountAscNullsFirst = 'followersCount_ASC_NULLS_FIRST',
  FollowersCountDesc = 'followersCount_DESC',
  FollowersCountDescNullsLast = 'followersCount_DESC_NULLS_LAST',
  FormatAsc = 'format_ASC',
  FormatAscNullsFirst = 'format_ASC_NULLS_FIRST',
  FormatDesc = 'format_DESC',
  FormatDescNullsLast = 'format_DESC_NULLS_LAST',
  HandleAsc = 'handle_ASC',
  HandleAscNullsFirst = 'handle_ASC_NULLS_FIRST',
  HandleDesc = 'handle_DESC',
  HandleDescNullsLast = 'handle_DESC_NULLS_LAST',
  HiddenPostsCountAsc = 'hiddenPostsCount_ASC',
  HiddenPostsCountAscNullsFirst = 'hiddenPostsCount_ASC_NULLS_FIRST',
  HiddenPostsCountDesc = 'hiddenPostsCount_DESC',
  HiddenPostsCountDescNullsLast = 'hiddenPostsCount_DESC_NULLS_LAST',
  HiddenAsc = 'hidden_ASC',
  HiddenAscNullsFirst = 'hidden_ASC_NULLS_FIRST',
  HiddenDesc = 'hidden_DESC',
  HiddenDescNullsLast = 'hidden_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  ImageAsc = 'image_ASC',
  ImageAscNullsFirst = 'image_ASC_NULLS_FIRST',
  ImageDesc = 'image_DESC',
  ImageDescNullsLast = 'image_DESC_NULLS_LAST',
  InterestsOriginalAsc = 'interestsOriginal_ASC',
  InterestsOriginalAscNullsFirst = 'interestsOriginal_ASC_NULLS_FIRST',
  InterestsOriginalDesc = 'interestsOriginal_DESC',
  InterestsOriginalDescNullsLast = 'interestsOriginal_DESC_NULLS_LAST',
  IsShowMoreAsc = 'isShowMore_ASC',
  IsShowMoreAscNullsFirst = 'isShowMore_ASC_NULLS_FIRST',
  IsShowMoreDesc = 'isShowMore_DESC',
  IsShowMoreDescNullsLast = 'isShowMore_DESC_NULLS_LAST',
  LinksOriginalAsc = 'linksOriginal_ASC',
  LinksOriginalAscNullsFirst = 'linksOriginal_ASC_NULLS_FIRST',
  LinksOriginalDesc = 'linksOriginal_DESC',
  LinksOriginalDescNullsLast = 'linksOriginal_DESC_NULLS_LAST',
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameDesc = 'name_DESC',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  NonePermissionsCreateCommentsAsc = 'nonePermissions_createComments_ASC',
  NonePermissionsCreateCommentsAscNullsFirst = 'nonePermissions_createComments_ASC_NULLS_FIRST',
  NonePermissionsCreateCommentsDesc = 'nonePermissions_createComments_DESC',
  NonePermissionsCreateCommentsDescNullsLast = 'nonePermissions_createComments_DESC_NULLS_LAST',
  NonePermissionsCreatePostsAsc = 'nonePermissions_createPosts_ASC',
  NonePermissionsCreatePostsAscNullsFirst = 'nonePermissions_createPosts_ASC_NULLS_FIRST',
  NonePermissionsCreatePostsDesc = 'nonePermissions_createPosts_DESC',
  NonePermissionsCreatePostsDescNullsLast = 'nonePermissions_createPosts_DESC_NULLS_LAST',
  NonePermissionsCreateSubspacesAsc = 'nonePermissions_createSubspaces_ASC',
  NonePermissionsCreateSubspacesAscNullsFirst = 'nonePermissions_createSubspaces_ASC_NULLS_FIRST',
  NonePermissionsCreateSubspacesDesc = 'nonePermissions_createSubspaces_DESC',
  NonePermissionsCreateSubspacesDescNullsLast = 'nonePermissions_createSubspaces_DESC_NULLS_LAST',
  NonePermissionsDeleteAnyPostAsc = 'nonePermissions_deleteAnyPost_ASC',
  NonePermissionsDeleteAnyPostAscNullsFirst = 'nonePermissions_deleteAnyPost_ASC_NULLS_FIRST',
  NonePermissionsDeleteAnyPostDesc = 'nonePermissions_deleteAnyPost_DESC',
  NonePermissionsDeleteAnyPostDescNullsLast = 'nonePermissions_deleteAnyPost_DESC_NULLS_LAST',
  NonePermissionsDeleteAnySubspaceAsc = 'nonePermissions_deleteAnySubspace_ASC',
  NonePermissionsDeleteAnySubspaceAscNullsFirst = 'nonePermissions_deleteAnySubspace_ASC_NULLS_FIRST',
  NonePermissionsDeleteAnySubspaceDesc = 'nonePermissions_deleteAnySubspace_DESC',
  NonePermissionsDeleteAnySubspaceDescNullsLast = 'nonePermissions_deleteAnySubspace_DESC_NULLS_LAST',
  NonePermissionsDeleteOwnCommentsAsc = 'nonePermissions_deleteOwnComments_ASC',
  NonePermissionsDeleteOwnCommentsAscNullsFirst = 'nonePermissions_deleteOwnComments_ASC_NULLS_FIRST',
  NonePermissionsDeleteOwnCommentsDesc = 'nonePermissions_deleteOwnComments_DESC',
  NonePermissionsDeleteOwnCommentsDescNullsLast = 'nonePermissions_deleteOwnComments_DESC_NULLS_LAST',
  NonePermissionsDeleteOwnPostsAsc = 'nonePermissions_deleteOwnPosts_ASC',
  NonePermissionsDeleteOwnPostsAscNullsFirst = 'nonePermissions_deleteOwnPosts_ASC_NULLS_FIRST',
  NonePermissionsDeleteOwnPostsDesc = 'nonePermissions_deleteOwnPosts_DESC',
  NonePermissionsDeleteOwnPostsDescNullsLast = 'nonePermissions_deleteOwnPosts_DESC_NULLS_LAST',
  NonePermissionsDeleteOwnSubspacesAsc = 'nonePermissions_deleteOwnSubspaces_ASC',
  NonePermissionsDeleteOwnSubspacesAscNullsFirst = 'nonePermissions_deleteOwnSubspaces_ASC_NULLS_FIRST',
  NonePermissionsDeleteOwnSubspacesDesc = 'nonePermissions_deleteOwnSubspaces_DESC',
  NonePermissionsDeleteOwnSubspacesDescNullsLast = 'nonePermissions_deleteOwnSubspaces_DESC_NULLS_LAST',
  NonePermissionsDownvoteAsc = 'nonePermissions_downvote_ASC',
  NonePermissionsDownvoteAscNullsFirst = 'nonePermissions_downvote_ASC_NULLS_FIRST',
  NonePermissionsDownvoteDesc = 'nonePermissions_downvote_DESC',
  NonePermissionsDownvoteDescNullsLast = 'nonePermissions_downvote_DESC_NULLS_LAST',
  NonePermissionsHideAnyCommentAsc = 'nonePermissions_hideAnyComment_ASC',
  NonePermissionsHideAnyCommentAscNullsFirst = 'nonePermissions_hideAnyComment_ASC_NULLS_FIRST',
  NonePermissionsHideAnyCommentDesc = 'nonePermissions_hideAnyComment_DESC',
  NonePermissionsHideAnyCommentDescNullsLast = 'nonePermissions_hideAnyComment_DESC_NULLS_LAST',
  NonePermissionsHideAnyPostAsc = 'nonePermissions_hideAnyPost_ASC',
  NonePermissionsHideAnyPostAscNullsFirst = 'nonePermissions_hideAnyPost_ASC_NULLS_FIRST',
  NonePermissionsHideAnyPostDesc = 'nonePermissions_hideAnyPost_DESC',
  NonePermissionsHideAnyPostDescNullsLast = 'nonePermissions_hideAnyPost_DESC_NULLS_LAST',
  NonePermissionsHideAnySubspaceAsc = 'nonePermissions_hideAnySubspace_ASC',
  NonePermissionsHideAnySubspaceAscNullsFirst = 'nonePermissions_hideAnySubspace_ASC_NULLS_FIRST',
  NonePermissionsHideAnySubspaceDesc = 'nonePermissions_hideAnySubspace_DESC',
  NonePermissionsHideAnySubspaceDescNullsLast = 'nonePermissions_hideAnySubspace_DESC_NULLS_LAST',
  NonePermissionsHideOwnCommentsAsc = 'nonePermissions_hideOwnComments_ASC',
  NonePermissionsHideOwnCommentsAscNullsFirst = 'nonePermissions_hideOwnComments_ASC_NULLS_FIRST',
  NonePermissionsHideOwnCommentsDesc = 'nonePermissions_hideOwnComments_DESC',
  NonePermissionsHideOwnCommentsDescNullsLast = 'nonePermissions_hideOwnComments_DESC_NULLS_LAST',
  NonePermissionsHideOwnPostsAsc = 'nonePermissions_hideOwnPosts_ASC',
  NonePermissionsHideOwnPostsAscNullsFirst = 'nonePermissions_hideOwnPosts_ASC_NULLS_FIRST',
  NonePermissionsHideOwnPostsDesc = 'nonePermissions_hideOwnPosts_DESC',
  NonePermissionsHideOwnPostsDescNullsLast = 'nonePermissions_hideOwnPosts_DESC_NULLS_LAST',
  NonePermissionsHideOwnSubspacesAsc = 'nonePermissions_hideOwnSubspaces_ASC',
  NonePermissionsHideOwnSubspacesAscNullsFirst = 'nonePermissions_hideOwnSubspaces_ASC_NULLS_FIRST',
  NonePermissionsHideOwnSubspacesDesc = 'nonePermissions_hideOwnSubspaces_DESC',
  NonePermissionsHideOwnSubspacesDescNullsLast = 'nonePermissions_hideOwnSubspaces_DESC_NULLS_LAST',
  NonePermissionsManageRolesAsc = 'nonePermissions_manageRoles_ASC',
  NonePermissionsManageRolesAscNullsFirst = 'nonePermissions_manageRoles_ASC_NULLS_FIRST',
  NonePermissionsManageRolesDesc = 'nonePermissions_manageRoles_DESC',
  NonePermissionsManageRolesDescNullsLast = 'nonePermissions_manageRoles_DESC_NULLS_LAST',
  NonePermissionsOverridePostPermissionsAsc = 'nonePermissions_overridePostPermissions_ASC',
  NonePermissionsOverridePostPermissionsAscNullsFirst = 'nonePermissions_overridePostPermissions_ASC_NULLS_FIRST',
  NonePermissionsOverridePostPermissionsDesc = 'nonePermissions_overridePostPermissions_DESC',
  NonePermissionsOverridePostPermissionsDescNullsLast = 'nonePermissions_overridePostPermissions_DESC_NULLS_LAST',
  NonePermissionsOverrideSubspacePermissionsAsc = 'nonePermissions_overrideSubspacePermissions_ASC',
  NonePermissionsOverrideSubspacePermissionsAscNullsFirst = 'nonePermissions_overrideSubspacePermissions_ASC_NULLS_FIRST',
  NonePermissionsOverrideSubspacePermissionsDesc = 'nonePermissions_overrideSubspacePermissions_DESC',
  NonePermissionsOverrideSubspacePermissionsDescNullsLast = 'nonePermissions_overrideSubspacePermissions_DESC_NULLS_LAST',
  NonePermissionsRepresentSpaceExternallyAsc = 'nonePermissions_representSpaceExternally_ASC',
  NonePermissionsRepresentSpaceExternallyAscNullsFirst = 'nonePermissions_representSpaceExternally_ASC_NULLS_FIRST',
  NonePermissionsRepresentSpaceExternallyDesc = 'nonePermissions_representSpaceExternally_DESC',
  NonePermissionsRepresentSpaceExternallyDescNullsLast = 'nonePermissions_representSpaceExternally_DESC_NULLS_LAST',
  NonePermissionsRepresentSpaceInternallyAsc = 'nonePermissions_representSpaceInternally_ASC',
  NonePermissionsRepresentSpaceInternallyAscNullsFirst = 'nonePermissions_representSpaceInternally_ASC_NULLS_FIRST',
  NonePermissionsRepresentSpaceInternallyDesc = 'nonePermissions_representSpaceInternally_DESC',
  NonePermissionsRepresentSpaceInternallyDescNullsLast = 'nonePermissions_representSpaceInternally_DESC_NULLS_LAST',
  NonePermissionsShareAsc = 'nonePermissions_share_ASC',
  NonePermissionsShareAscNullsFirst = 'nonePermissions_share_ASC_NULLS_FIRST',
  NonePermissionsShareDesc = 'nonePermissions_share_DESC',
  NonePermissionsShareDescNullsLast = 'nonePermissions_share_DESC_NULLS_LAST',
  NonePermissionsSuggestEntityStatusAsc = 'nonePermissions_suggestEntityStatus_ASC',
  NonePermissionsSuggestEntityStatusAscNullsFirst = 'nonePermissions_suggestEntityStatus_ASC_NULLS_FIRST',
  NonePermissionsSuggestEntityStatusDesc = 'nonePermissions_suggestEntityStatus_DESC',
  NonePermissionsSuggestEntityStatusDescNullsLast = 'nonePermissions_suggestEntityStatus_DESC_NULLS_LAST',
  NonePermissionsUpdateAnyPostAsc = 'nonePermissions_updateAnyPost_ASC',
  NonePermissionsUpdateAnyPostAscNullsFirst = 'nonePermissions_updateAnyPost_ASC_NULLS_FIRST',
  NonePermissionsUpdateAnyPostDesc = 'nonePermissions_updateAnyPost_DESC',
  NonePermissionsUpdateAnyPostDescNullsLast = 'nonePermissions_updateAnyPost_DESC_NULLS_LAST',
  NonePermissionsUpdateAnySubspaceAsc = 'nonePermissions_updateAnySubspace_ASC',
  NonePermissionsUpdateAnySubspaceAscNullsFirst = 'nonePermissions_updateAnySubspace_ASC_NULLS_FIRST',
  NonePermissionsUpdateAnySubspaceDesc = 'nonePermissions_updateAnySubspace_DESC',
  NonePermissionsUpdateAnySubspaceDescNullsLast = 'nonePermissions_updateAnySubspace_DESC_NULLS_LAST',
  NonePermissionsUpdateEntityStatusAsc = 'nonePermissions_updateEntityStatus_ASC',
  NonePermissionsUpdateEntityStatusAscNullsFirst = 'nonePermissions_updateEntityStatus_ASC_NULLS_FIRST',
  NonePermissionsUpdateEntityStatusDesc = 'nonePermissions_updateEntityStatus_DESC',
  NonePermissionsUpdateEntityStatusDescNullsLast = 'nonePermissions_updateEntityStatus_DESC_NULLS_LAST',
  NonePermissionsUpdateOwnCommentsAsc = 'nonePermissions_updateOwnComments_ASC',
  NonePermissionsUpdateOwnCommentsAscNullsFirst = 'nonePermissions_updateOwnComments_ASC_NULLS_FIRST',
  NonePermissionsUpdateOwnCommentsDesc = 'nonePermissions_updateOwnComments_DESC',
  NonePermissionsUpdateOwnCommentsDescNullsLast = 'nonePermissions_updateOwnComments_DESC_NULLS_LAST',
  NonePermissionsUpdateOwnPostsAsc = 'nonePermissions_updateOwnPosts_ASC',
  NonePermissionsUpdateOwnPostsAscNullsFirst = 'nonePermissions_updateOwnPosts_ASC_NULLS_FIRST',
  NonePermissionsUpdateOwnPostsDesc = 'nonePermissions_updateOwnPosts_DESC',
  NonePermissionsUpdateOwnPostsDescNullsLast = 'nonePermissions_updateOwnPosts_DESC_NULLS_LAST',
  NonePermissionsUpdateOwnSubspacesAsc = 'nonePermissions_updateOwnSubspaces_ASC',
  NonePermissionsUpdateOwnSubspacesAscNullsFirst = 'nonePermissions_updateOwnSubspaces_ASC_NULLS_FIRST',
  NonePermissionsUpdateOwnSubspacesDesc = 'nonePermissions_updateOwnSubspaces_DESC',
  NonePermissionsUpdateOwnSubspacesDescNullsLast = 'nonePermissions_updateOwnSubspaces_DESC_NULLS_LAST',
  NonePermissionsUpdateSpaceSettingsAsc = 'nonePermissions_updateSpaceSettings_ASC',
  NonePermissionsUpdateSpaceSettingsAscNullsFirst = 'nonePermissions_updateSpaceSettings_ASC_NULLS_FIRST',
  NonePermissionsUpdateSpaceSettingsDesc = 'nonePermissions_updateSpaceSettings_DESC',
  NonePermissionsUpdateSpaceSettingsDescNullsLast = 'nonePermissions_updateSpaceSettings_DESC_NULLS_LAST',
  NonePermissionsUpdateSpaceAsc = 'nonePermissions_updateSpace_ASC',
  NonePermissionsUpdateSpaceAscNullsFirst = 'nonePermissions_updateSpace_ASC_NULLS_FIRST',
  NonePermissionsUpdateSpaceDesc = 'nonePermissions_updateSpace_DESC',
  NonePermissionsUpdateSpaceDescNullsLast = 'nonePermissions_updateSpace_DESC_NULLS_LAST',
  NonePermissionsUpvoteAsc = 'nonePermissions_upvote_ASC',
  NonePermissionsUpvoteAscNullsFirst = 'nonePermissions_upvote_ASC_NULLS_FIRST',
  NonePermissionsUpvoteDesc = 'nonePermissions_upvote_DESC',
  NonePermissionsUpvoteDescNullsLast = 'nonePermissions_upvote_DESC_NULLS_LAST',
  OwnedByAccountFollowersCountAsc = 'ownedByAccount_followersCount_ASC',
  OwnedByAccountFollowersCountAscNullsFirst = 'ownedByAccount_followersCount_ASC_NULLS_FIRST',
  OwnedByAccountFollowersCountDesc = 'ownedByAccount_followersCount_DESC',
  OwnedByAccountFollowersCountDescNullsLast = 'ownedByAccount_followersCount_DESC_NULLS_LAST',
  OwnedByAccountFollowingAccountsCountAsc = 'ownedByAccount_followingAccountsCount_ASC',
  OwnedByAccountFollowingAccountsCountAscNullsFirst = 'ownedByAccount_followingAccountsCount_ASC_NULLS_FIRST',
  OwnedByAccountFollowingAccountsCountDesc = 'ownedByAccount_followingAccountsCount_DESC',
  OwnedByAccountFollowingAccountsCountDescNullsLast = 'ownedByAccount_followingAccountsCount_DESC_NULLS_LAST',
  OwnedByAccountFollowingPostsCountAsc = 'ownedByAccount_followingPostsCount_ASC',
  OwnedByAccountFollowingPostsCountAscNullsFirst = 'ownedByAccount_followingPostsCount_ASC_NULLS_FIRST',
  OwnedByAccountFollowingPostsCountDesc = 'ownedByAccount_followingPostsCount_DESC',
  OwnedByAccountFollowingPostsCountDescNullsLast = 'ownedByAccount_followingPostsCount_DESC_NULLS_LAST',
  OwnedByAccountFollowingSpacesCountAsc = 'ownedByAccount_followingSpacesCount_ASC',
  OwnedByAccountFollowingSpacesCountAscNullsFirst = 'ownedByAccount_followingSpacesCount_ASC_NULLS_FIRST',
  OwnedByAccountFollowingSpacesCountDesc = 'ownedByAccount_followingSpacesCount_DESC',
  OwnedByAccountFollowingSpacesCountDescNullsLast = 'ownedByAccount_followingSpacesCount_DESC_NULLS_LAST',
  OwnedByAccountIdAsc = 'ownedByAccount_id_ASC',
  OwnedByAccountIdAscNullsFirst = 'ownedByAccount_id_ASC_NULLS_FIRST',
  OwnedByAccountIdDesc = 'ownedByAccount_id_DESC',
  OwnedByAccountIdDescNullsLast = 'ownedByAccount_id_DESC_NULLS_LAST',
  OwnedByAccountOwnedPostsCountAsc = 'ownedByAccount_ownedPostsCount_ASC',
  OwnedByAccountOwnedPostsCountAscNullsFirst = 'ownedByAccount_ownedPostsCount_ASC_NULLS_FIRST',
  OwnedByAccountOwnedPostsCountDesc = 'ownedByAccount_ownedPostsCount_DESC',
  OwnedByAccountOwnedPostsCountDescNullsLast = 'ownedByAccount_ownedPostsCount_DESC_NULLS_LAST',
  OwnedByAccountUpdatedAtBlockAsc = 'ownedByAccount_updatedAtBlock_ASC',
  OwnedByAccountUpdatedAtBlockAscNullsFirst = 'ownedByAccount_updatedAtBlock_ASC_NULLS_FIRST',
  OwnedByAccountUpdatedAtBlockDesc = 'ownedByAccount_updatedAtBlock_DESC',
  OwnedByAccountUpdatedAtBlockDescNullsLast = 'ownedByAccount_updatedAtBlock_DESC_NULLS_LAST',
  OwnedByAccountUpdatedAtTimeAsc = 'ownedByAccount_updatedAtTime_ASC',
  OwnedByAccountUpdatedAtTimeAscNullsFirst = 'ownedByAccount_updatedAtTime_ASC_NULLS_FIRST',
  OwnedByAccountUpdatedAtTimeDesc = 'ownedByAccount_updatedAtTime_DESC',
  OwnedByAccountUpdatedAtTimeDescNullsLast = 'ownedByAccount_updatedAtTime_DESC_NULLS_LAST',
  PostsCountAsc = 'postsCount_ASC',
  PostsCountAscNullsFirst = 'postsCount_ASC_NULLS_FIRST',
  PostsCountDesc = 'postsCount_DESC',
  PostsCountDescNullsLast = 'postsCount_DESC_NULLS_LAST',
  ProfileSourceAsc = 'profileSource_ASC',
  ProfileSourceAscNullsFirst = 'profileSource_ASC_NULLS_FIRST',
  ProfileSourceDesc = 'profileSource_DESC',
  ProfileSourceDescNullsLast = 'profileSource_DESC_NULLS_LAST',
  ProfileSpaceFollowersCountAsc = 'profileSpace_followersCount_ASC',
  ProfileSpaceFollowersCountAscNullsFirst = 'profileSpace_followersCount_ASC_NULLS_FIRST',
  ProfileSpaceFollowersCountDesc = 'profileSpace_followersCount_DESC',
  ProfileSpaceFollowersCountDescNullsLast = 'profileSpace_followersCount_DESC_NULLS_LAST',
  ProfileSpaceFollowingAccountsCountAsc = 'profileSpace_followingAccountsCount_ASC',
  ProfileSpaceFollowingAccountsCountAscNullsFirst = 'profileSpace_followingAccountsCount_ASC_NULLS_FIRST',
  ProfileSpaceFollowingAccountsCountDesc = 'profileSpace_followingAccountsCount_DESC',
  ProfileSpaceFollowingAccountsCountDescNullsLast = 'profileSpace_followingAccountsCount_DESC_NULLS_LAST',
  ProfileSpaceFollowingPostsCountAsc = 'profileSpace_followingPostsCount_ASC',
  ProfileSpaceFollowingPostsCountAscNullsFirst = 'profileSpace_followingPostsCount_ASC_NULLS_FIRST',
  ProfileSpaceFollowingPostsCountDesc = 'profileSpace_followingPostsCount_DESC',
  ProfileSpaceFollowingPostsCountDescNullsLast = 'profileSpace_followingPostsCount_DESC_NULLS_LAST',
  ProfileSpaceFollowingSpacesCountAsc = 'profileSpace_followingSpacesCount_ASC',
  ProfileSpaceFollowingSpacesCountAscNullsFirst = 'profileSpace_followingSpacesCount_ASC_NULLS_FIRST',
  ProfileSpaceFollowingSpacesCountDesc = 'profileSpace_followingSpacesCount_DESC',
  ProfileSpaceFollowingSpacesCountDescNullsLast = 'profileSpace_followingSpacesCount_DESC_NULLS_LAST',
  ProfileSpaceIdAsc = 'profileSpace_id_ASC',
  ProfileSpaceIdAscNullsFirst = 'profileSpace_id_ASC_NULLS_FIRST',
  ProfileSpaceIdDesc = 'profileSpace_id_DESC',
  ProfileSpaceIdDescNullsLast = 'profileSpace_id_DESC_NULLS_LAST',
  ProfileSpaceOwnedPostsCountAsc = 'profileSpace_ownedPostsCount_ASC',
  ProfileSpaceOwnedPostsCountAscNullsFirst = 'profileSpace_ownedPostsCount_ASC_NULLS_FIRST',
  ProfileSpaceOwnedPostsCountDesc = 'profileSpace_ownedPostsCount_DESC',
  ProfileSpaceOwnedPostsCountDescNullsLast = 'profileSpace_ownedPostsCount_DESC_NULLS_LAST',
  ProfileSpaceUpdatedAtBlockAsc = 'profileSpace_updatedAtBlock_ASC',
  ProfileSpaceUpdatedAtBlockAscNullsFirst = 'profileSpace_updatedAtBlock_ASC_NULLS_FIRST',
  ProfileSpaceUpdatedAtBlockDesc = 'profileSpace_updatedAtBlock_DESC',
  ProfileSpaceUpdatedAtBlockDescNullsLast = 'profileSpace_updatedAtBlock_DESC_NULLS_LAST',
  ProfileSpaceUpdatedAtTimeAsc = 'profileSpace_updatedAtTime_ASC',
  ProfileSpaceUpdatedAtTimeAscNullsFirst = 'profileSpace_updatedAtTime_ASC_NULLS_FIRST',
  ProfileSpaceUpdatedAtTimeDesc = 'profileSpace_updatedAtTime_DESC',
  ProfileSpaceUpdatedAtTimeDescNullsLast = 'profileSpace_updatedAtTime_DESC_NULLS_LAST',
  PublicPostsCountAsc = 'publicPostsCount_ASC',
  PublicPostsCountAscNullsFirst = 'publicPostsCount_ASC_NULLS_FIRST',
  PublicPostsCountDesc = 'publicPostsCount_DESC',
  PublicPostsCountDescNullsLast = 'publicPostsCount_DESC_NULLS_LAST',
  SpaceOwnerPermissionsCreateCommentsAsc = 'spaceOwnerPermissions_createComments_ASC',
  SpaceOwnerPermissionsCreateCommentsAscNullsFirst = 'spaceOwnerPermissions_createComments_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsCreateCommentsDesc = 'spaceOwnerPermissions_createComments_DESC',
  SpaceOwnerPermissionsCreateCommentsDescNullsLast = 'spaceOwnerPermissions_createComments_DESC_NULLS_LAST',
  SpaceOwnerPermissionsCreatePostsAsc = 'spaceOwnerPermissions_createPosts_ASC',
  SpaceOwnerPermissionsCreatePostsAscNullsFirst = 'spaceOwnerPermissions_createPosts_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsCreatePostsDesc = 'spaceOwnerPermissions_createPosts_DESC',
  SpaceOwnerPermissionsCreatePostsDescNullsLast = 'spaceOwnerPermissions_createPosts_DESC_NULLS_LAST',
  SpaceOwnerPermissionsCreateSubspacesAsc = 'spaceOwnerPermissions_createSubspaces_ASC',
  SpaceOwnerPermissionsCreateSubspacesAscNullsFirst = 'spaceOwnerPermissions_createSubspaces_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsCreateSubspacesDesc = 'spaceOwnerPermissions_createSubspaces_DESC',
  SpaceOwnerPermissionsCreateSubspacesDescNullsLast = 'spaceOwnerPermissions_createSubspaces_DESC_NULLS_LAST',
  SpaceOwnerPermissionsDeleteAnyPostAsc = 'spaceOwnerPermissions_deleteAnyPost_ASC',
  SpaceOwnerPermissionsDeleteAnyPostAscNullsFirst = 'spaceOwnerPermissions_deleteAnyPost_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsDeleteAnyPostDesc = 'spaceOwnerPermissions_deleteAnyPost_DESC',
  SpaceOwnerPermissionsDeleteAnyPostDescNullsLast = 'spaceOwnerPermissions_deleteAnyPost_DESC_NULLS_LAST',
  SpaceOwnerPermissionsDeleteAnySubspaceAsc = 'spaceOwnerPermissions_deleteAnySubspace_ASC',
  SpaceOwnerPermissionsDeleteAnySubspaceAscNullsFirst = 'spaceOwnerPermissions_deleteAnySubspace_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsDeleteAnySubspaceDesc = 'spaceOwnerPermissions_deleteAnySubspace_DESC',
  SpaceOwnerPermissionsDeleteAnySubspaceDescNullsLast = 'spaceOwnerPermissions_deleteAnySubspace_DESC_NULLS_LAST',
  SpaceOwnerPermissionsDeleteOwnCommentsAsc = 'spaceOwnerPermissions_deleteOwnComments_ASC',
  SpaceOwnerPermissionsDeleteOwnCommentsAscNullsFirst = 'spaceOwnerPermissions_deleteOwnComments_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsDeleteOwnCommentsDesc = 'spaceOwnerPermissions_deleteOwnComments_DESC',
  SpaceOwnerPermissionsDeleteOwnCommentsDescNullsLast = 'spaceOwnerPermissions_deleteOwnComments_DESC_NULLS_LAST',
  SpaceOwnerPermissionsDeleteOwnPostsAsc = 'spaceOwnerPermissions_deleteOwnPosts_ASC',
  SpaceOwnerPermissionsDeleteOwnPostsAscNullsFirst = 'spaceOwnerPermissions_deleteOwnPosts_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsDeleteOwnPostsDesc = 'spaceOwnerPermissions_deleteOwnPosts_DESC',
  SpaceOwnerPermissionsDeleteOwnPostsDescNullsLast = 'spaceOwnerPermissions_deleteOwnPosts_DESC_NULLS_LAST',
  SpaceOwnerPermissionsDeleteOwnSubspacesAsc = 'spaceOwnerPermissions_deleteOwnSubspaces_ASC',
  SpaceOwnerPermissionsDeleteOwnSubspacesAscNullsFirst = 'spaceOwnerPermissions_deleteOwnSubspaces_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsDeleteOwnSubspacesDesc = 'spaceOwnerPermissions_deleteOwnSubspaces_DESC',
  SpaceOwnerPermissionsDeleteOwnSubspacesDescNullsLast = 'spaceOwnerPermissions_deleteOwnSubspaces_DESC_NULLS_LAST',
  SpaceOwnerPermissionsDownvoteAsc = 'spaceOwnerPermissions_downvote_ASC',
  SpaceOwnerPermissionsDownvoteAscNullsFirst = 'spaceOwnerPermissions_downvote_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsDownvoteDesc = 'spaceOwnerPermissions_downvote_DESC',
  SpaceOwnerPermissionsDownvoteDescNullsLast = 'spaceOwnerPermissions_downvote_DESC_NULLS_LAST',
  SpaceOwnerPermissionsHideAnyCommentAsc = 'spaceOwnerPermissions_hideAnyComment_ASC',
  SpaceOwnerPermissionsHideAnyCommentAscNullsFirst = 'spaceOwnerPermissions_hideAnyComment_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsHideAnyCommentDesc = 'spaceOwnerPermissions_hideAnyComment_DESC',
  SpaceOwnerPermissionsHideAnyCommentDescNullsLast = 'spaceOwnerPermissions_hideAnyComment_DESC_NULLS_LAST',
  SpaceOwnerPermissionsHideAnyPostAsc = 'spaceOwnerPermissions_hideAnyPost_ASC',
  SpaceOwnerPermissionsHideAnyPostAscNullsFirst = 'spaceOwnerPermissions_hideAnyPost_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsHideAnyPostDesc = 'spaceOwnerPermissions_hideAnyPost_DESC',
  SpaceOwnerPermissionsHideAnyPostDescNullsLast = 'spaceOwnerPermissions_hideAnyPost_DESC_NULLS_LAST',
  SpaceOwnerPermissionsHideAnySubspaceAsc = 'spaceOwnerPermissions_hideAnySubspace_ASC',
  SpaceOwnerPermissionsHideAnySubspaceAscNullsFirst = 'spaceOwnerPermissions_hideAnySubspace_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsHideAnySubspaceDesc = 'spaceOwnerPermissions_hideAnySubspace_DESC',
  SpaceOwnerPermissionsHideAnySubspaceDescNullsLast = 'spaceOwnerPermissions_hideAnySubspace_DESC_NULLS_LAST',
  SpaceOwnerPermissionsHideOwnCommentsAsc = 'spaceOwnerPermissions_hideOwnComments_ASC',
  SpaceOwnerPermissionsHideOwnCommentsAscNullsFirst = 'spaceOwnerPermissions_hideOwnComments_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsHideOwnCommentsDesc = 'spaceOwnerPermissions_hideOwnComments_DESC',
  SpaceOwnerPermissionsHideOwnCommentsDescNullsLast = 'spaceOwnerPermissions_hideOwnComments_DESC_NULLS_LAST',
  SpaceOwnerPermissionsHideOwnPostsAsc = 'spaceOwnerPermissions_hideOwnPosts_ASC',
  SpaceOwnerPermissionsHideOwnPostsAscNullsFirst = 'spaceOwnerPermissions_hideOwnPosts_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsHideOwnPostsDesc = 'spaceOwnerPermissions_hideOwnPosts_DESC',
  SpaceOwnerPermissionsHideOwnPostsDescNullsLast = 'spaceOwnerPermissions_hideOwnPosts_DESC_NULLS_LAST',
  SpaceOwnerPermissionsHideOwnSubspacesAsc = 'spaceOwnerPermissions_hideOwnSubspaces_ASC',
  SpaceOwnerPermissionsHideOwnSubspacesAscNullsFirst = 'spaceOwnerPermissions_hideOwnSubspaces_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsHideOwnSubspacesDesc = 'spaceOwnerPermissions_hideOwnSubspaces_DESC',
  SpaceOwnerPermissionsHideOwnSubspacesDescNullsLast = 'spaceOwnerPermissions_hideOwnSubspaces_DESC_NULLS_LAST',
  SpaceOwnerPermissionsManageRolesAsc = 'spaceOwnerPermissions_manageRoles_ASC',
  SpaceOwnerPermissionsManageRolesAscNullsFirst = 'spaceOwnerPermissions_manageRoles_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsManageRolesDesc = 'spaceOwnerPermissions_manageRoles_DESC',
  SpaceOwnerPermissionsManageRolesDescNullsLast = 'spaceOwnerPermissions_manageRoles_DESC_NULLS_LAST',
  SpaceOwnerPermissionsOverridePostPermissionsAsc = 'spaceOwnerPermissions_overridePostPermissions_ASC',
  SpaceOwnerPermissionsOverridePostPermissionsAscNullsFirst = 'spaceOwnerPermissions_overridePostPermissions_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsOverridePostPermissionsDesc = 'spaceOwnerPermissions_overridePostPermissions_DESC',
  SpaceOwnerPermissionsOverridePostPermissionsDescNullsLast = 'spaceOwnerPermissions_overridePostPermissions_DESC_NULLS_LAST',
  SpaceOwnerPermissionsOverrideSubspacePermissionsAsc = 'spaceOwnerPermissions_overrideSubspacePermissions_ASC',
  SpaceOwnerPermissionsOverrideSubspacePermissionsAscNullsFirst = 'spaceOwnerPermissions_overrideSubspacePermissions_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsOverrideSubspacePermissionsDesc = 'spaceOwnerPermissions_overrideSubspacePermissions_DESC',
  SpaceOwnerPermissionsOverrideSubspacePermissionsDescNullsLast = 'spaceOwnerPermissions_overrideSubspacePermissions_DESC_NULLS_LAST',
  SpaceOwnerPermissionsRepresentSpaceExternallyAsc = 'spaceOwnerPermissions_representSpaceExternally_ASC',
  SpaceOwnerPermissionsRepresentSpaceExternallyAscNullsFirst = 'spaceOwnerPermissions_representSpaceExternally_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsRepresentSpaceExternallyDesc = 'spaceOwnerPermissions_representSpaceExternally_DESC',
  SpaceOwnerPermissionsRepresentSpaceExternallyDescNullsLast = 'spaceOwnerPermissions_representSpaceExternally_DESC_NULLS_LAST',
  SpaceOwnerPermissionsRepresentSpaceInternallyAsc = 'spaceOwnerPermissions_representSpaceInternally_ASC',
  SpaceOwnerPermissionsRepresentSpaceInternallyAscNullsFirst = 'spaceOwnerPermissions_representSpaceInternally_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsRepresentSpaceInternallyDesc = 'spaceOwnerPermissions_representSpaceInternally_DESC',
  SpaceOwnerPermissionsRepresentSpaceInternallyDescNullsLast = 'spaceOwnerPermissions_representSpaceInternally_DESC_NULLS_LAST',
  SpaceOwnerPermissionsShareAsc = 'spaceOwnerPermissions_share_ASC',
  SpaceOwnerPermissionsShareAscNullsFirst = 'spaceOwnerPermissions_share_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsShareDesc = 'spaceOwnerPermissions_share_DESC',
  SpaceOwnerPermissionsShareDescNullsLast = 'spaceOwnerPermissions_share_DESC_NULLS_LAST',
  SpaceOwnerPermissionsSuggestEntityStatusAsc = 'spaceOwnerPermissions_suggestEntityStatus_ASC',
  SpaceOwnerPermissionsSuggestEntityStatusAscNullsFirst = 'spaceOwnerPermissions_suggestEntityStatus_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsSuggestEntityStatusDesc = 'spaceOwnerPermissions_suggestEntityStatus_DESC',
  SpaceOwnerPermissionsSuggestEntityStatusDescNullsLast = 'spaceOwnerPermissions_suggestEntityStatus_DESC_NULLS_LAST',
  SpaceOwnerPermissionsUpdateAnyPostAsc = 'spaceOwnerPermissions_updateAnyPost_ASC',
  SpaceOwnerPermissionsUpdateAnyPostAscNullsFirst = 'spaceOwnerPermissions_updateAnyPost_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsUpdateAnyPostDesc = 'spaceOwnerPermissions_updateAnyPost_DESC',
  SpaceOwnerPermissionsUpdateAnyPostDescNullsLast = 'spaceOwnerPermissions_updateAnyPost_DESC_NULLS_LAST',
  SpaceOwnerPermissionsUpdateAnySubspaceAsc = 'spaceOwnerPermissions_updateAnySubspace_ASC',
  SpaceOwnerPermissionsUpdateAnySubspaceAscNullsFirst = 'spaceOwnerPermissions_updateAnySubspace_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsUpdateAnySubspaceDesc = 'spaceOwnerPermissions_updateAnySubspace_DESC',
  SpaceOwnerPermissionsUpdateAnySubspaceDescNullsLast = 'spaceOwnerPermissions_updateAnySubspace_DESC_NULLS_LAST',
  SpaceOwnerPermissionsUpdateEntityStatusAsc = 'spaceOwnerPermissions_updateEntityStatus_ASC',
  SpaceOwnerPermissionsUpdateEntityStatusAscNullsFirst = 'spaceOwnerPermissions_updateEntityStatus_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsUpdateEntityStatusDesc = 'spaceOwnerPermissions_updateEntityStatus_DESC',
  SpaceOwnerPermissionsUpdateEntityStatusDescNullsLast = 'spaceOwnerPermissions_updateEntityStatus_DESC_NULLS_LAST',
  SpaceOwnerPermissionsUpdateOwnCommentsAsc = 'spaceOwnerPermissions_updateOwnComments_ASC',
  SpaceOwnerPermissionsUpdateOwnCommentsAscNullsFirst = 'spaceOwnerPermissions_updateOwnComments_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsUpdateOwnCommentsDesc = 'spaceOwnerPermissions_updateOwnComments_DESC',
  SpaceOwnerPermissionsUpdateOwnCommentsDescNullsLast = 'spaceOwnerPermissions_updateOwnComments_DESC_NULLS_LAST',
  SpaceOwnerPermissionsUpdateOwnPostsAsc = 'spaceOwnerPermissions_updateOwnPosts_ASC',
  SpaceOwnerPermissionsUpdateOwnPostsAscNullsFirst = 'spaceOwnerPermissions_updateOwnPosts_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsUpdateOwnPostsDesc = 'spaceOwnerPermissions_updateOwnPosts_DESC',
  SpaceOwnerPermissionsUpdateOwnPostsDescNullsLast = 'spaceOwnerPermissions_updateOwnPosts_DESC_NULLS_LAST',
  SpaceOwnerPermissionsUpdateOwnSubspacesAsc = 'spaceOwnerPermissions_updateOwnSubspaces_ASC',
  SpaceOwnerPermissionsUpdateOwnSubspacesAscNullsFirst = 'spaceOwnerPermissions_updateOwnSubspaces_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsUpdateOwnSubspacesDesc = 'spaceOwnerPermissions_updateOwnSubspaces_DESC',
  SpaceOwnerPermissionsUpdateOwnSubspacesDescNullsLast = 'spaceOwnerPermissions_updateOwnSubspaces_DESC_NULLS_LAST',
  SpaceOwnerPermissionsUpdateSpaceSettingsAsc = 'spaceOwnerPermissions_updateSpaceSettings_ASC',
  SpaceOwnerPermissionsUpdateSpaceSettingsAscNullsFirst = 'spaceOwnerPermissions_updateSpaceSettings_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsUpdateSpaceSettingsDesc = 'spaceOwnerPermissions_updateSpaceSettings_DESC',
  SpaceOwnerPermissionsUpdateSpaceSettingsDescNullsLast = 'spaceOwnerPermissions_updateSpaceSettings_DESC_NULLS_LAST',
  SpaceOwnerPermissionsUpdateSpaceAsc = 'spaceOwnerPermissions_updateSpace_ASC',
  SpaceOwnerPermissionsUpdateSpaceAscNullsFirst = 'spaceOwnerPermissions_updateSpace_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsUpdateSpaceDesc = 'spaceOwnerPermissions_updateSpace_DESC',
  SpaceOwnerPermissionsUpdateSpaceDescNullsLast = 'spaceOwnerPermissions_updateSpace_DESC_NULLS_LAST',
  SpaceOwnerPermissionsUpvoteAsc = 'spaceOwnerPermissions_upvote_ASC',
  SpaceOwnerPermissionsUpvoteAscNullsFirst = 'spaceOwnerPermissions_upvote_ASC_NULLS_FIRST',
  SpaceOwnerPermissionsUpvoteDesc = 'spaceOwnerPermissions_upvote_DESC',
  SpaceOwnerPermissionsUpvoteDescNullsLast = 'spaceOwnerPermissions_upvote_DESC_NULLS_LAST',
  SummaryAsc = 'summary_ASC',
  SummaryAscNullsFirst = 'summary_ASC_NULLS_FIRST',
  SummaryDesc = 'summary_DESC',
  SummaryDescNullsLast = 'summary_DESC_NULLS_LAST',
  TagsOriginalAsc = 'tagsOriginal_ASC',
  TagsOriginalAscNullsFirst = 'tagsOriginal_ASC_NULLS_FIRST',
  TagsOriginalDesc = 'tagsOriginal_DESC',
  TagsOriginalDescNullsLast = 'tagsOriginal_DESC_NULLS_LAST',
  UpdatedAtBlockAsc = 'updatedAtBlock_ASC',
  UpdatedAtBlockAscNullsFirst = 'updatedAtBlock_ASC_NULLS_FIRST',
  UpdatedAtBlockDesc = 'updatedAtBlock_DESC',
  UpdatedAtBlockDescNullsLast = 'updatedAtBlock_DESC_NULLS_LAST',
  UpdatedAtTimeAsc = 'updatedAtTime_ASC',
  UpdatedAtTimeAscNullsFirst = 'updatedAtTime_ASC_NULLS_FIRST',
  UpdatedAtTimeDesc = 'updatedAtTime_DESC',
  UpdatedAtTimeDescNullsLast = 'updatedAtTime_DESC_NULLS_LAST',
  UsernameAsc = 'username_ASC',
  UsernameAscNullsFirst = 'username_ASC_NULLS_FIRST',
  UsernameDesc = 'username_DESC',
  UsernameDescNullsLast = 'username_DESC_NULLS_LAST'
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
  profileSource_contains?: InputMaybe<Scalars['String']['input']>;
  profileSource_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  profileSource_endsWith?: InputMaybe<Scalars['String']['input']>;
  profileSource_eq?: InputMaybe<Scalars['String']['input']>;
  profileSource_gt?: InputMaybe<Scalars['String']['input']>;
  profileSource_gte?: InputMaybe<Scalars['String']['input']>;
  profileSource_in?: InputMaybe<Array<Scalars['String']['input']>>;
  profileSource_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  profileSource_lt?: InputMaybe<Scalars['String']['input']>;
  profileSource_lte?: InputMaybe<Scalars['String']['input']>;
  profileSource_not_contains?: InputMaybe<Scalars['String']['input']>;
  profileSource_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  profileSource_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  profileSource_not_eq?: InputMaybe<Scalars['String']['input']>;
  profileSource_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  profileSource_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  profileSource_startsWith?: InputMaybe<Scalars['String']['input']>;
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


export type GetPostsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', content?: string | null, createdAtBlock?: any | null, createdAtTime?: any | null, title?: string | null, body?: string | null, summary?: string | null, isShowMore?: boolean | null, image?: string | null, link?: string | null, downvotesCount: number, hidden: boolean, id: string, isComment: boolean, kind?: PostKind | null, repliesCount: number, sharesCount: number, upvotesCount: number, updatedAtTime?: any | null, inReplyToKind?: InReplyToKind | null, followersCount: number, canonical?: string | null, tagsOriginal?: string | null, createdByAccount: { __typename?: 'Account', id: string }, inReplyToPost?: { __typename?: 'Post', id: string } | null, ownedByAccount: { __typename?: 'Account', id: string }, space?: { __typename?: 'Space', id: string } | null, rootPost?: { __typename?: 'Post', id: string, space?: { __typename?: 'Space', id: string } | null } | null, sharedPost?: { __typename?: 'Post', id: string } | null, extensions: Array<{ __typename?: 'ContentExtension', image?: string | null, amount?: any | null, chain?: string | null, collectionId?: string | null, decimals?: number | null, extensionSchemaId: ContentExtensionSchemaId, id: string, nftId?: string | null, token?: string | null, txHash?: string | null, message?: string | null, nonce?: string | null, url?: string | null, recipient?: { __typename?: 'Account', id: string } | null, fromEvm?: { __typename?: 'EvmAccount', id: string } | null, toEvm?: { __typename?: 'EvmAccount', id: string } | null, fromSubstrate?: { __typename?: 'Account', id: string } | null, toSubstrate?: { __typename?: 'Account', id: string } | null, pinnedResources: Array<{ __typename?: 'ExtensionPinnedResource', post?: { __typename?: 'Post', id: string } | null }> }> }> };

export type GetPostsFollowersCountQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetPostsFollowersCountQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', id: string, followersCount: number }> };

export type GetPostsByContentQueryVariables = Exact<{
  search: Scalars['String']['input'];
  spaceIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
  postIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type GetPostsByContentQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', content?: string | null, createdAtBlock?: any | null, createdAtTime?: any | null, title?: string | null, body?: string | null, summary?: string | null, isShowMore?: boolean | null, image?: string | null, link?: string | null, downvotesCount: number, hidden: boolean, id: string, isComment: boolean, kind?: PostKind | null, repliesCount: number, sharesCount: number, upvotesCount: number, updatedAtTime?: any | null, inReplyToKind?: InReplyToKind | null, followersCount: number, canonical?: string | null, tagsOriginal?: string | null, createdByAccount: { __typename?: 'Account', id: string }, inReplyToPost?: { __typename?: 'Post', id: string } | null, ownedByAccount: { __typename?: 'Account', id: string }, space?: { __typename?: 'Space', id: string } | null, rootPost?: { __typename?: 'Post', id: string, space?: { __typename?: 'Space', id: string } | null } | null, sharedPost?: { __typename?: 'Post', id: string } | null, extensions: Array<{ __typename?: 'ContentExtension', image?: string | null, amount?: any | null, chain?: string | null, collectionId?: string | null, decimals?: number | null, extensionSchemaId: ContentExtensionSchemaId, id: string, nftId?: string | null, token?: string | null, txHash?: string | null, message?: string | null, nonce?: string | null, url?: string | null, recipient?: { __typename?: 'Account', id: string } | null, fromEvm?: { __typename?: 'EvmAccount', id: string } | null, toEvm?: { __typename?: 'EvmAccount', id: string } | null, fromSubstrate?: { __typename?: 'Account', id: string } | null, toSubstrate?: { __typename?: 'Account', id: string } | null, pinnedResources: Array<{ __typename?: 'ExtensionPinnedResource', post?: { __typename?: 'Post', id: string } | null }> }> }> };

export type GetOwnedPostIdsQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type GetOwnedPostIdsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', id: string }> };

export type GetProfilesQueryVariables = Exact<{
  addresses?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetProfilesQuery = { __typename?: 'Query', accounts: Array<{ __typename?: 'Account', id: string, profileSpace?: { __typename?: 'Space', id: string, name?: string | null, image?: string | null, about?: string | null, email?: string | null, linksOriginal?: string | null, tagsOriginal?: string | null, profileSource?: string | null, updatedAtTime?: any | null } | null }> };

export type GetSpacesQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetSpacesQuery = { __typename?: 'Query', spaces: Array<{ __typename?: 'Space', canEveryoneCreatePosts?: boolean | null, canFollowerCreatePosts?: boolean | null, content?: string | null, createdAtBlock?: any | null, createdAtTime?: any | null, email?: string | null, name?: string | null, summary?: string | null, isShowMore?: boolean | null, linksOriginal?: string | null, hidden: boolean, id: string, updatedAtTime?: any | null, postsCount: number, image?: string | null, tagsOriginal?: string | null, about?: string | null, createdByAccount: { __typename?: 'Account', id: string }, ownedByAccount: { __typename?: 'Account', id: string } }> };

export type SpaceFragmentFragment = { __typename?: 'Space', canEveryoneCreatePosts?: boolean | null, canFollowerCreatePosts?: boolean | null, content?: string | null, createdAtBlock?: any | null, createdAtTime?: any | null, email?: string | null, name?: string | null, summary?: string | null, isShowMore?: boolean | null, linksOriginal?: string | null, hidden: boolean, id: string, updatedAtTime?: any | null, postsCount: number, image?: string | null, tagsOriginal?: string | null, about?: string | null, createdByAccount: { __typename?: 'Account', id: string }, ownedByAccount: { __typename?: 'Account', id: string } };

export type PostFragmentFragment = { __typename?: 'Post', content?: string | null, createdAtBlock?: any | null, createdAtTime?: any | null, title?: string | null, body?: string | null, summary?: string | null, isShowMore?: boolean | null, image?: string | null, link?: string | null, downvotesCount: number, hidden: boolean, id: string, isComment: boolean, kind?: PostKind | null, repliesCount: number, sharesCount: number, upvotesCount: number, updatedAtTime?: any | null, inReplyToKind?: InReplyToKind | null, followersCount: number, canonical?: string | null, tagsOriginal?: string | null, createdByAccount: { __typename?: 'Account', id: string }, inReplyToPost?: { __typename?: 'Post', id: string } | null, ownedByAccount: { __typename?: 'Account', id: string }, space?: { __typename?: 'Space', id: string } | null, rootPost?: { __typename?: 'Post', id: string, space?: { __typename?: 'Space', id: string } | null } | null, sharedPost?: { __typename?: 'Post', id: string } | null, extensions: Array<{ __typename?: 'ContentExtension', image?: string | null, amount?: any | null, chain?: string | null, collectionId?: string | null, decimals?: number | null, extensionSchemaId: ContentExtensionSchemaId, id: string, nftId?: string | null, token?: string | null, txHash?: string | null, message?: string | null, nonce?: string | null, url?: string | null, recipient?: { __typename?: 'Account', id: string } | null, fromEvm?: { __typename?: 'EvmAccount', id: string } | null, toEvm?: { __typename?: 'EvmAccount', id: string } | null, fromSubstrate?: { __typename?: 'Account', id: string } | null, toSubstrate?: { __typename?: 'Account', id: string } | null, pinnedResources: Array<{ __typename?: 'ExtensionPinnedResource', post?: { __typename?: 'Post', id: string } | null }> }> };

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
    fromSubstrate {
      id
    }
    toSubstrate {
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
export const GetPostsFollowersCount = gql`
    query GetPostsFollowersCount($ids: [String!]) {
  posts(where: {id_in: $ids}) {
    id
    followersCount
  }
}
    `;
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
      about
      email
      linksOriginal
      tagsOriginal
      profileSource
      updatedAtTime
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