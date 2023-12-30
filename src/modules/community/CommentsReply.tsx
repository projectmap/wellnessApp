import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';

import {
  REACTION_ACTIONS,
  useGetProfileQuery,
  FEEDS_REACTION_TYPE,
  useRemoveCommentsMutation,
  useUpdateCommentsMutation,
  useReactToCommentsOrPostsMutation,
} from '@newstart-online/sdk';
import { toast } from 'react-toastify';
import { Box, Stack } from '@mui/system';
import { SubmitHandler } from 'react-hook-form';
import { Avatar, Typography } from '@mui/material';

import CommentBox from './components/CommentBox';
import CommentMenu from './components/CommentMenu';
import { PrevCommentAndRepliesProps } from './Types';
import { OnSubmitProps } from './components/CommentBoxTypes';

import { DefaultUserPhoto } from './components/Chat/DefaultUserPhoto';
import { deactivateUserName, removeDuplicates } from '~/utils/helpers';
import { DEACTIVATING_USER_IMAGE } from '~/state/constants';

const CommentsReply = ({ commentObj, setCommentCount, setComments: setCommentReplies }: PrevCommentAndRepliesProps) => {
  const { commenter, reactionCount, _id: replyCommentId, text: comment, currentUserReactions } = commentObj;
  const [editCommentReply, setEditCommentReply] = useState<boolean>(false);
  const [editCommentOrReplayId, setEditCommentOrReplayId] = useState<string>(replyCommentId as string);
  const [getPrevEditCommentReply, setPrevEditCommentReply] = useState<string>('');
  const [commentLikeCount, setCommentLikeCount] = useState<number>(reactionCount);

  const [currentLikeStatus, setCurrentLikeIconStatus] = useState<boolean>(true);

  const [updateComment] = useUpdateCommentsMutation();
  const [deletePostComment] = useRemoveCommentsMutation();
  const [addCommentReaction] = useReactToCommentsOrPostsMutation();

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
      .then((updatedCommentReply) => {
        setCommentReplies((prevCommentReplies) => {
          let updatedCommentReplies = [...prevCommentReplies];
          const updatedCommentIndex = updatedCommentReplies.findIndex(
            (comment) => comment._id === updatedCommentReply.data._id,
          );
          updatedCommentReplies[updatedCommentIndex] = updatedCommentReply.data;

          return removeDuplicates(updatedCommentReplies);
        });
        reset();
        setEditCommentReply(false);
      });
  };

  const handleCommentReplyEdit = (ReplyCommentId: string, comment: string) => {
    setEditCommentReply(true);
    setPrevEditCommentReply(comment);
    setEditCommentOrReplayId(ReplyCommentId);
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

  const handleDelete = (id: string) => {
    deletePostComment(id)
      .unwrap()
      .then((deletedCommentReply) => {
        setCommentReplies((prevCommentReplies) =>
          prevCommentReplies.filter((prevCommentReply) => prevCommentReply._id !== deletedCommentReply.data._id),
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
      {editCommentReply ? (
        <CommentBox onSubmit={onEditCommentSubmit} edit prevComment={getPrevEditCommentReply} />
      ) : (
        <Stack sx={{ width: '100%', marginTop: 2 }}>
          {/* //TODO: Need Refactoring Later */}
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            {commenter?.photo?.completedUrl ? (
              <Box>
                <Image
                  className="avatar"
                  height={40}
                  width={40}
                  alt={commenter?.name || deactivateUserName}
                  src={commenter?.isActive ? commenter?.photo?.completedUrl : DEACTIVATING_USER_IMAGE}
                />
              </Box>
            ) : (
              <DefaultUserPhoto
                userName={commenter?.name || deactivateUserName}
                sx={{ backgroundColor: `${commenter?.color}`, height: '40px', width: '40px' }}
              />
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
                  <Typography sx={{ textTransform: 'capitalize' }} variant="subtitle1">
                    {commenter?.isActive ? commenter?.name : deactivateUserName}
                  </Typography>
                  <Typography>{comment}</Typography>
                </Box>
                {isCurrentUserComment && (
                  <CommentMenu
                    handleEdit={handleCommentReplyEdit}
                    handleDelete={handleDelete}
                    commentIdOrReplyCommentId={replyCommentId as string}
                    commentText={comment as string}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', padding: 1 }}>
                <Typography
                  onClick={() =>
                    updateRepliesLikes(
                      FEEDS_REACTION_TYPE.LIKE,
                      replyCommentId as string,
                      currentLikeStatus ? REACTION_ACTIONS.DELETE : REACTION_ACTIONS.ADD,
                    )
                  }
                  sx={{ marginRight: 1, cursor: 'pointer' }}
                >
                  {commentLikeCount === 0 ? 'Like' : `${commentLikeCount} Likes`}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      )}
    </>
  );
};

export default CommentsReply;
