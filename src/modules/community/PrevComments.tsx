import Link from 'next/link';
import Image from 'next/image';
import React, { ReactElement, RefObject, useEffect, useMemo, useRef, useState } from 'react';

import { Avatar, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import {
  FEEDS_REACTION_TYPE,
  REACTION_ACTIONS,
  useAddRepliesMutation,
  useGetProfileQuery,
  useListPaginatedRepliesQuery,
  useReactToCommentsOrPostsMutation,
  useRemoveCommentsMutation,
  useUpdateCommentsMutation,
} from '@newstart-online/sdk';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import CommentsReply from './CommentsReply';
import CommentBox from './components/CommentBox';
import { deactivateUserName, removeDuplicates } from '~/utils/helpers';
import { OnSubmitProps } from './components/CommentBoxTypes';
import CommentMenu from './components/CommentMenu';
import { CommentObj, PrevCommentAndRepliesProps } from './Types';

import { DEACTIVATING_USER_IMAGE, DEFAULT_AVATAR } from '~/state/constants';
import CommentSkeleton from './components/CommentSkeleton';
import { DefaultUserPhoto } from './components/Chat/DefaultUserPhoto';

export function PrevComments({ commentObj, setCommentCount, setComments }: PrevCommentAndRepliesProps): ReactElement {
  const {
    _id: commentId,
    commenter,
    reactionCount,
    repliesCount: replyCount,
    text: comment,
    currentUserReactions,
  } = commentObj;
  const [showReply, setShowReply] = useState<boolean>(false);
  const [showCommentReply, setShowCommentReply] = useState<boolean>(false);
  const [singleReplyId, setSingleReplyId] = useState<string>('');
  const [editComment, setEditComment] = useState<boolean>(false);
  const [editCommentOrReplayId, setEditCommentOrReplayId] = useState<string>(commentId as string);
  const [getPrevEditComment, setPrevEditComment] = useState<string>('');
  const [commentReplyCount, setCommentReplyCount] = useState<number>(replyCount);
  const [commentLikeCount, setCommentLikeCount] = useState<number>(reactionCount);
  const [currentLikeStatus, setCurrentLikeIconStatus] = useState<boolean>(true);

  // API CALLS
  const [addReply, { isLoading: addReplyLoading }] = useAddRepliesMutation();
  const [addCommentReaction] = useReactToCommentsOrPostsMutation();
  const [deletePostComment] = useRemoveCommentsMutation();
  const [updateComment] = useUpdateCommentsMutation();
  const [commentsReplies, setCommentsReplies] = useState<CommentObj[]>([]);
  const [page, setPage] = useState<number>(1);
  const [showLoadMore, setShowLoadMore] = useState<boolean>(false);
  const showLoadMoreRef = useRef<HTMLDivElement>(null);

  const { data: singleCommentData, isFetching: singleCommentDataLoading } = useListPaginatedRepliesQuery(
    { perPage: 5, commentsId: singleReplyId, page },
    { skip: !singleReplyId },
  );
  const singleCommentReplies = singleCommentData?.data as CommentObj[];

  useEffect(() => {
    if (singleCommentData) {
      if (singleCommentReplies.length === 0) {
        setShowLoadMore(false);

        return;
      }
      setShowLoadMore(page !== singleCommentData.totalPage);
    }
  }, [page, singleCommentData]);

  useEffect(() => {
    if (page !== 1) {
      singleCommentReplies?.map((currentSingleCommentReply) => {
        setCommentsReplies((prev) => {
          let updatedCommentsReplies = [...prev, currentSingleCommentReply];

          return removeDuplicates(updatedCommentsReplies);
        });
      });
    }

    if (page === 1) {
      singleCommentReplies && setCommentsReplies(singleCommentReplies);
    }
  }, [singleCommentReplies]);

  const handleCommentScroll = (showLoadMoreRef: RefObject<HTMLDivElement>) => {
    window.scrollTo({
      top: showLoadMoreRef.current?.offsetTop,
      left: 0,
      behavior: 'smooth',
    });
  };

  const getNextComments = () => {
    setPage((prev) => prev + 1);
    setShowLoadMore(false);
  };

  const setDefaultComments = () => {
    setPage(1);
    handleCommentScroll(showLoadMoreRef);
  };

  const { data: profileData } = useGetProfileQuery();
  const userID = profileData?.data?._id;

  const isCurrentUserComment = useMemo(() => {
    if (userID && commenter) {
      return commenter._id === userID;
    }

    return false;
  }, [userID, commenter]);

  useEffect(() => {
    if (currentUserReactions === null) {
      setCurrentLikeIconStatus(false);
    }
  }, [currentUserReactions]);

  const onEditCommentSubmit: SubmitHandler<OnSubmitProps> = ({ data, reset }) => {
    updateComment({ text: data.comment, currentCommentId: editCommentOrReplayId })
      .unwrap()
      .then((updatedComment) => {
        setComments((prevComments) => {
          let updatedComments = [...prevComments];
          const updatedCommentIndex = updatedComments.findIndex((comment) => comment._id === updatedComment.data._id);
          updatedComments[updatedCommentIndex] = updatedComment.data;

          return removeDuplicates(updatedComments);
        });
        reset();
        setEditComment(false);
      });
  };

  const onReplyCommentSubmit: SubmitHandler<OnSubmitProps> = ({ data, reset }) => {
    addReply({ comments: commentId as string, text: data.comment })
      .unwrap()
      .then(() => reset())
      .then(() => setCommentReplyCount((prev) => prev + 1));
  };

  const getRepliesById = (id: string) => {
    setShowReply((prev) => !prev);
    setShowCommentReply((prev) => !prev);
    setSingleReplyId(id);
  };

  const updateRepliesLikes = (reactionType: FEEDS_REACTION_TYPE, id: string, action: REACTION_ACTIONS) => {
    setCurrentLikeIconStatus((prev) => !prev);
    setCommentLikeCount((prev) => (action === REACTION_ACTIONS.ADD ? prev + 1 : prev - 1));
    addCommentReaction({
      action,
      comments: id,
      reactionType,
    })
      .unwrap()
      .catch();
  };

  const handleEdit = (commentID: string, comment: string) => {
    setEditComment(true);
    setPrevEditComment(comment);
    setEditCommentOrReplayId(commentID);
  };

  const handleDelete = (id: string) => {
    deletePostComment(id)
      .unwrap()
      .then((deletedComment) => {
        setComments((prevComments) =>
          prevComments.filter((prevComment) => prevComment._id !== deletedComment.data._id),
        );
        toast.success('Comment Deleted');
        setCommentCount((prev) => prev - 1);
      })
      .catch((err) => {
        toast.error(err?.data?.message);
      });
  };

  return (
    <>
      {editComment ? (
        <CommentBox onSubmit={onEditCommentSubmit} edit prevComment={getPrevEditComment} />
      ) : (
        <Stack sx={{ width: '100%', marginTop: 2 }}>
          {/* //TODO: Need Refactoring Later */}
          <Box sx={{ display: 'flex', flexDirection: 'row' }} ref={showLoadMoreRef}>
            {commenter?.photo?.completedUrl ? (
              <Box sx={{ position: 'relative' }}>
                <a href={`/profile/${commenter?._id}`}>
                  <Image
                    className="avatar"
                    src={commenter?.isActive ? commenter?.photo?.completedUrl : DEACTIVATING_USER_IMAGE}
                    height={40}
                    width={40}
                    alt={commenter?.name || deactivateUserName || 'user profile'}
                  />
                </a>
              </Box>
            ) : (
              <a href={`/profile/${commenter?._id}`}>
                <DefaultUserPhoto
                  userName={commenter?.name || commenter?.email || deactivateUserName}
                  fontNewSize={{ fontSize: '24px' }}
                  sx={{
                    background: `${commenter?.color}`,
                    width: '40px',
                    height: '40px',
                  }}
                  isActive={commenter?.isActive}
                />
              </a>
            )}
            <Box sx={{ marginLeft: 1, width: '100%' }}>
              <Box
                sx={{
                  background: '#F3F3F5',
                  borderRadius: 2,
                  padding: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <Link href={`/profile/${commenter?._id}`}>
                    <Typography sx={{ textTransform: 'capitalize', cursor: 'pointer' }} variant="subtitle1">
                      {commenter?.isActive ? commenter?.name : deactivateUserName}
                    </Typography>
                  </Link>
                  <Typography sx={{ whiteSpace: 'pre-line' }}>{comment}</Typography>
                </Box>
                {isCurrentUserComment && (
                  <CommentMenu
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    commentIdOrReplyCommentId={commentId as string}
                    commentText={comment}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', padding: 1 }}>
                <Typography
                  onClick={() =>
                    updateRepliesLikes(
                      FEEDS_REACTION_TYPE.LIKE,
                      commentId as string,
                      currentLikeStatus ? REACTION_ACTIONS.DELETE : REACTION_ACTIONS.ADD,
                    )
                  }
                  sx={{ marginRight: 1, cursor: 'pointer' }}
                >
                  {(commentLikeCount as number) === 0 ? 'Like' : `${commentLikeCount} Likes`}
                </Typography>
                <Typography
                  onClick={() => getRepliesById(commentId as string)}
                  sx={{ marginRight: 1, cursor: 'pointer' }}
                >
                  {(commentReplyCount as number) === 0 ? 'Reply' : `${commentReplyCount} Replies`}
                </Typography>
              </Box>
              {showReply ? <CommentBox onSubmit={onReplyCommentSubmit} loading={addReplyLoading} /> : null}
              {showCommentReply && singleCommentData !== undefined ? (
                <>
                  {commentsReplies.map((singleCommentReply) => (
                    <CommentsReply
                      key={singleCommentReply._id}
                      commentObj={singleCommentReply}
                      setCommentCount={setCommentReplyCount}
                      setComments={setCommentsReplies}
                    />
                  ))}
                  {singleCommentDataLoading && (
                    <>
                      <CommentSkeleton />
                      <CommentSkeleton />
                    </>
                  )}
                  {showLoadMore ? (
                    <Typography
                      variant="body1"
                      onClick={() => getNextComments()}
                      sx={{ fontSize: '10px', cursor: 'pointer', textAlign: 'right' }}
                    >
                      Show More
                    </Typography>
                  ) : (
                    <>
                      {page !== 1 && (
                        <Typography
                          variant="body1"
                          onClick={() => setDefaultComments()}
                          sx={{ fontSize: '10px', cursor: 'pointer', textAlign: 'right' }}
                        >
                          Show Less
                        </Typography>
                      )}
                    </>
                  )}
                </>
              ) : null}
            </Box>
          </Box>
        </Stack>
      )}
    </>
  );
}
