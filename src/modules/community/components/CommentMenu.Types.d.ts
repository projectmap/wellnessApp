import { COMMUNITY_SHARE_MODAL_TYPE } from '~/state/constants';
import { FunctionWithParam } from '~/utils/helpers';

export interface CommentMenuProps {
  // eslint-disable-next-line no-unused-vars
  handleEdit: FunctionWithParam<string, string>;
  handleDelete: FunctionWithParam<string>;
  commentIdOrReplyCommentId: string;
  commentText: string;
}

export interface ShareMenuProps {
  // eslint-disable-next-line no-unused-vars
  title: string;
  description: string;
  shareUrl: string;
  postId: string;
  currentPostDetails?: any;
  shareModalType?: COMMUNITY_SHARE_MODAL_TYPE;
  isSharedPostAsBadge?: boolean;
  authorDetails?: {
    name: string;
    imageUrl: string;
    authorImageColor: string;
    createdTimeSpan: string;
  };
  imageUrlToShare: string;
}
