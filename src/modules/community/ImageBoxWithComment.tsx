import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';

import { Box, Stack } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Divider, IconButton, Modal, Paper, Typography } from '@mui/material';

import {
  REACTION_ACTIONS,
  useGetProfileQuery,
  FEEDS_REACTION_TYPE,
  useReactToPostsMutation,
  useCreateCommentsMutation,
  useListPaginatedCommentsQuery,
  useRemoveFeedsImagesMutation,
} from '@newstart-online/sdk';
import moment from 'moment';
import Image from 'next/image';
import Slider from 'react-slick';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { SubmitHandler } from 'react-hook-form';

import { removeDuplicates } from '~/utils/helpers';
import { PostCommentIcon, PostShareIcon, LikedIcon } from '~/icons';
import { COMMUNITY_PAGE_ROUTING, COMMUNITY_SHARE_MODAL_TYPE, DEFAULT_AVATAR } from '~/state/constants';

import { PrevComments } from './PrevComments';
import { CommentObj, PostObj } from './Types';
import { PrevReactions } from './PrevReactions';
import CommentBox from './components/CommentBox';
import GenericShareModal from './modals/GenericShareModal';
import CommentSkeleton from './components/CommentSkeleton';
import { OnSubmitProps } from './components/CommentBoxTypes';
import { ButtonWithIcon } from '../_core/bits/buttons/IconButton';
import { DefaultUserPhoto } from './components/Chat/DefaultUserPhoto';
import { getClickableLinkFromText } from '~/utils/getClickableLInkFromText';

interface IauthorDetails {
  imageUrl: string;
  name: string;
  authorImageColor: string;
  createdTimeSpan: any;
}
interface ImageBoxWithCommentProps {
  showCommentToUser?: boolean;
  closeModal: () => void;
  singleReactionId: string;
  postObjId?: string;
  getLikesByPostId: (postObjId: string) => void;
  postObj: PostObj;
  [key: string]: any;
  setCommentCount: Dispatch<SetStateAction<number>>;
  commentCount: number;
  setComments: Dispatch<SetStateAction<CommentObj[]>>;
  comments: CommentObj[];
  likeCount: number;
  setLikeCount: Dispatch<SetStateAction<number>>;
  likeIconStatus: boolean;
  setLikeIconStatus: Dispatch<SetStateAction<boolean>>;
  likeIcon: ReactNode;
  setLikeIcon: Dispatch<SetStateAction<ReactNode>>;
  postImageList: PostObj['images'];
  setPostImageList: Dispatch<SetStateAction<PostObj['images']>>;
  authorDetails?: IauthorDetails;
  imageUrlToShare?: string;
  descriptionToShare?: string;
}

const ImageBoxWithComment = ({
  getLikesByPostId,
  postObjId,
  singleReactionId,
  showCommentToUser = true,
  closeModal,
  postObj,
  setCommentCount,
  commentCount: defaultComment,
  setComments,
  comments,
  likeCount,
  likeIcon,
  likeIconStatus,
  setLikeCount,
  setLikeIconStatus,
  postImageList: imageList,
  setPostImageList: setImageList,
  authorDetails,
  imageUrlToShare,
  descriptionToShare,
}: ImageBoxWithCommentProps) => {
  const settings = {
    nav: true,
    dots: true,
    infinite: true,
    speed: 500,
    centerPadding: '10px',
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
  };

  const StyledSlider = styled(Slider)`
    max-width: 750px;
    margin: auto;
  `;
  const { descriptions, _id, author, createdAt } = postObj;
  const [showComment, setShowComment] = useState<boolean>(true);
  const [singleCommentId, setSingleCommentId] = useState<string>(_id);
  const [addReaction, { isLoading: addReactionLoading }] = useReactToPostsMutation();
  const [addComment, { isLoading: addCommentLoading }] = useCreateCommentsMutation();
  const [deleteImage] = useRemoveFeedsImagesMutation();
  const [page, setPage] = useState<number>(1);
  const [showLoadMore, setShowLoadMore] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [showReactionModal, setShowReactionModal] = useState<boolean>(false);

  const [showGenericShareModal, setShowGenericShareModal] = useState(false);

  const updateLikes = (reactionType: FEEDS_REACTION_TYPE, id: string, action: REACTION_ACTIONS) => {
    setLikeIconStatus((prev) => !prev);
    setLikeCount((prev) => (action === REACTION_ACTIONS.ADD ? prev + 1 : prev - 1));
    addReaction({
      action,
      feeds: id,
      reactionType,
    })
      .unwrap()
      .catch(() => setLikeIconStatus(false));
  };
  const { data: singleFeedData, isFetching: singleFeedDataLoading } = useListPaginatedCommentsQuery(
    { perPage: 5, feedsId: singleCommentId, page },
    { skip: !singleCommentId },
  );

  const singleFeedComment = singleFeedData?.data as CommentObj[];

  const handleCloseLikeModel = () => setShowReactionModal(false);

  let currentUrl = '';
  if (typeof window !== 'undefined' && window.location) {
    currentUrl = window.location.pathname;
  }

  let requiredPath = COMMUNITY_PAGE_ROUTING.FEEDS_DYNAMIC + postObj._id + '/';

  let formattedText = getClickableLinkFromText(descriptions);

  useEffect(() => {
    if (singleFeedData) {
      if (singleFeedComment.length === 0) {
        setShowLoadMore(false);

        return;
      }
      setShowLoadMore(page !== singleFeedData.totalPage);
    }
  }, [page, singleFeedData]);

  useEffect(() => {
    if (page !== 1) {
      singleFeedComment?.map((currentSingleFeedData) => {
        setComments((prev) => {
          let updatedComments = [...prev, currentSingleFeedData];

          return removeDuplicates(updatedComments);
        });
      });
    }

    if (page === 1) {
      singleFeedComment && setComments(singleFeedComment);
    }
  }, [singleFeedComment]);

  const getNextComments = () => {
    setPage((prev) => prev + 1);
    setShowLoadMore(false);
  };

  const setDefaultComments = () => {
    setPage(1);
  };

  const { data: profileData } = useGetProfileQuery();

  const userID = profileData?.data?._id;

  const onCommentSubmit: SubmitHandler<OnSubmitProps> = ({ data, reset }) => {
    addComment({ feeds: _id, text: data.comment })
      .unwrap()
      .then(() => {
        setCommentCount((prev) => prev + 1);
      })
      .then(() => reset());
  };

  const getCommentByPostId = (id: string) => {
    if (showComment) {
      setSingleCommentId(id);
    }
    setShowComment((prev) => !prev);
  };

  const handleDelete = (id: string) => {
    deleteImage({ feedsId: _id, deletingImageId: [id] })
      .unwrap()
      .then(() => {
        toast.success('Image Deleted');
        setImageList((prevImageList) => prevImageList.filter((image) => image._id !== id));
      })
      .catch((err) => {
        toast.error(err.data.message);
      });
  };

  return (
    <Paper
      sx={{
        background: '#000',
        width: '100%',
        height: '100%',
      }}
    >
      <>
        <Modal open={showReactionModal} onClose={handleCloseLikeModel}>
          <PrevReactions closeModal={handleCloseLikeModel} singleReactionId={singleReactionId} />
        </Modal>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flexBasis: `${showCommentToUser ? '75%' : '100%'}`, pt: 3, pb: 4, pr: 3, pl: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <IconButton onClick={() => closeModal()} sx={{ width: '44px', color: '#fff' }}>
                <CloseIcon />
              </IconButton>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: 'calc(100vh - 100px);',
                  maxWidth: '100%',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <StyledSlider {...settings}>
                    {imageList.map((item, index: number) => (
                      <Box key={item?._id}>
                        {userID === author._id && requiredPath !== currentUrl && (
                          <IconButton
                            sx={{ width: '100%', color: '#fff', justifyContent: 'flex-end' }}
                            onClick={() => handleDelete(item._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}

                        <Box sx={{ position: 'relative', height: 'calc(100vh - 100px);' }}>
                          <Image
                            className="slider-image"
                            key={index}
                            src={item.completedUrl}
                            objectFit="contain"
                            layout="fill"
                            alt={item.filename}
                          />
                        </Box>
                      </Box>
                    ))}
                  </StyledSlider>
                </Box>
              </Box>
            </Box>
          </Box>
          {showCommentToUser && (
            <Box
              sx={{
                flexBasis: { lg: '25%', sm: '60%' },
                background: '#fff',
                pt: 3,
                pb: 4,
                pr: 3,
                pl: 4,
                maxHeight: '100vh',
                minHeight: '100vh',
                overflow: 'auto',
              }}
            >
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {author?.photo?.completedUrl ? (
                      <Image className="avatar" src={author?.photo?.completedUrl} height={48} width={48} alt="user" />
                    ) : (
                      <DefaultUserPhoto
                        userName={author?.name || author?.email}
                        fontNewSize={{ fontSize: '18px' }}
                        sx={{ backgroundColor: `${author?.color}`, height: '48px', width: '48px' }}
                      />
                    )}
                    <Stack sx={{ pl: 1.5 }}>
                      <Typography variant="subtitle1">{author.name}</Typography>
                      <Typography variant="body2">{moment(createdAt).fromNow()}</Typography>
                    </Stack>
                  </Box>
                </Box>
                <>
                  <Typography variant="body1" sx={{ pb: 1 }}>
                    {showMore ? (
                      <div className="post-link" dangerouslySetInnerHTML={{ __html: formattedText }} />
                    ) : (
                      <div
                        className="post-link"
                        dangerouslySetInnerHTML={{ __html: formattedText.substring(0, 150) }}
                      />
                    )}
                    {descriptions?.length > 150 && (
                      <button
                        className="btn"
                        style={{ marginLeft: '5px', cursor: 'pointer', color: '#A1A1AF' }}
                        onClick={() => setShowMore(!showMore)}
                      >
                        Show {showMore ? 'Less' : 'More'}
                      </button>
                    )}
                  </Typography>
                </>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LikedIcon />
                      <Typography
                        onClick={() => likeCount && postObjId && getLikesByPostId(postObjId)}
                        variant="body2"
                        style={{ cursor: 'pointer' }}
                      >
                        {likeCount}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      onClick={() => getCommentByPostId(_id)}
                      style={{ cursor: 'pointer' }}
                    >{`${defaultComment} ${defaultComment === 0 ? 'comment' : 'comments'}`}</Typography>
                  </Box>
                  <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <ButtonWithIcon
                      onClick={() =>
                        updateLikes(
                          FEEDS_REACTION_TYPE.LIKE,
                          _id,
                          likeIconStatus ? REACTION_ACTIONS.DELETE : REACTION_ACTIONS.ADD,
                        )
                      }
                      disabled={addReactionLoading}
                      icon={likeIcon}
                    >
                      {likeIconStatus ? 'Liked' : 'Like'}
                    </ButtonWithIcon>
                    <ButtonWithIcon onClick={() => getCommentByPostId(_id)} icon={<PostCommentIcon />}>
                      Comment
                    </ButtonWithIcon>
                    <ButtonWithIcon onClick={() => setShowGenericShareModal(true)} icon={<PostShareIcon />}>
                      Share
                    </ButtonWithIcon>

                    <GenericShareModal
                      showModal={showGenericShareModal}
                      setShowGenericShareModal={setShowGenericShareModal}
                      imageUrl={imageUrlToShare}
                      description={descriptionToShare}
                      shareModalType={COMMUNITY_SHARE_MODAL_TYPE.sharedPost}
                      id={postObj?.sharedPost?._id ?? _id}
                      authorDetails={authorDetails}
                      isRepostedFromFeed={true}
                    />
                  </Box>
                  <br />
                  <Divider />

                  {showComment && (
                    <>
                      {comments?.map((comment) => (
                        <PrevComments
                          key={comment._id}
                          commentObj={comment}
                          setCommentCount={setCommentCount}
                          setComments={setComments}
                        />
                      ))}
                      {singleFeedDataLoading && (
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
                  )}

                  {showComment ? <CommentBox onSubmit={onCommentSubmit} loading={addCommentLoading} /> : null}
                </Box>
              </>
            </Box>
          )}
        </Box>
      </>
    </Paper>
  );
};

export { ImageBoxWithComment };
