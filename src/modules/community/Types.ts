import { IAchievementsOutput, IBlogsResponse, ILecturesResponse, IRecipeResponse } from '@newstart-online/sdk';
import { Dispatch, SetStateAction } from 'react';

export interface Author {
  _id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  passwordExpired: Date;
  salt: string;
  isVerified: boolean;
  isActive: boolean;
  verificationCode: string;
  createdAt: Date;
  updatedAt: Date;
  photo: Photo;
  color: string;
}

export interface Image {
  path: string;
  pathWithFilename: string;
  filename: string;
  completedUrl: string;
  baseUrl: string;
  mime: string;
  _id: string;
}

export interface ReactedUser {
  _id: string;
  email: string;
  role: string;
  password: string;
  passwordExpired: Date;
  salt: string;
  isVerified: boolean;
  isActive: boolean;
  isFirstLogin: boolean;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  verificationCode: string;
}

export interface FriendsStatus {
  status: number;
}

export interface Datum2 {
  _id: string;
  feeds: string;
  reactedUser: ReactedUser;
  reactionType: number;
  createdAt: Date;
  updatedAt: Date;
  friendsStatus: FriendsStatus;
}

export interface Reactions {
  data: Datum2[];
  totalData: number;
}

export interface CurrentUserReactions {
  _id: string;
  feeds: string;
  reactedUser: string;
  reactionType: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Photo {
  baseUrl: string;
  completedUrl: string;
  filename: string;
  mime: string;
  path: string;
  pathWithFilename: string;
}

export interface SharedPostObj {
  _id: string;
  descriptions: string;
  author: Author;
  images: Image[];
  reactions: Reactions;
  comments: string[];
  createdAt: Date;
  updatedAt: Date;
  reactionCount: number;
  commentsCount: number;
  currentUserReactions: CurrentUserReactions;
  sharedBadge: IAchievementsOutput;
  sharedResource: IBlogsResponse;
  sharedRecipe: IRecipeResponse;
  sharedLecture: ILecturesResponse;
}
export interface PostObj {
  _id: string;
  descriptions: string;
  author: Author;
  images: Image[];
  reactions: Reactions;
  comments: string[];
  createdAt: Date;
  updatedAt: Date;
  reactionCount: number;
  commentsCount: number;
  currentUserReactions: CurrentUserReactions;
  sharedPost?: SharedPostObj;
  sharedResource?: IBlogsResponse;
  sharedRecipe?: IRecipeResponse;
  sharedBadge?: IAchievementsOutput;
  sharedLecture?: ILecturesResponse;
  friend: { _id: string; status: number };
}

export interface FeedsRootObject {
  statusCode: number;
  message: string;
  totalData: number;
  totalPage: number;
  currentPage: number;
  perPage: number;
  data: PostObj[];
}

export interface PostModalProps {
  postObj: PostObj;
  currentUser?: string | null;
  setFeeds: Dispatch<SetStateAction<PostObj[]>>;
  isProfilePage?: boolean;
  isFeedSinglePage?: boolean;
}

export interface Commenter {
  _id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  passwordExpired: Date;
  salt: string;
  isVerified: boolean;
  isActive: boolean;
  verificationCode: string;
  createdAt: Date;
  updatedAt: Date;
  photo: Photo;
  color: string;
}

export interface CommentObj {
  _id: string;
  text: string;
  commenter: Commenter;
  feeds: string;
  isEdited: boolean;
  images: any[];
  reactions: Reactions;
  currentUserReactions: CurrentUserReactions;
  createdAt: Date;
  updatedAt: Date;
  repliesCount: number;
  reactionCount: number;
}

export interface PrevCommentAndRepliesProps {
  commentObj: CommentObj;
  setCommentCount: Dispatch<SetStateAction<number>>;
  setComments: Dispatch<SetStateAction<CommentObj[]>>;
}

export interface CommunityPostBoxProps {
  setFeeds?: Dispatch<SetStateAction<PostObj[]>>;
}
