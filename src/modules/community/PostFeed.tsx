import React, { ReactNode, RefObject, useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import moment from 'moment';
import { toast } from 'react-toastify';
import { debounce } from '~/utils/helpers';
import absoluteUrl from 'next-absolute-url';
import 'react-toastify/dist/ReactToastify.css';
import { SubmitHandler } from 'react-hook-form';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { Box } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, MenuItem, Stack, Typography, Menu, Divider, ListItemIcon, Modal } from '@mui/material';
import {
  REACTION_ACTIONS,
  FEEDS_REACTION_TYPE,
  useRemoveFeedsMutation,
  useReactToPostsMutation,
  useCreateCommentsMutation,
  useListPaginatedCommentsQuery,
  useRemoveFriendMutation,
  useHidePostMutation,
  useGetProfileQuery,
} from '@newstart-online/sdk';

import { Card } from '~/modules/_core/bits/cards';
import { deactivateUserName, removeDuplicates } from '~/utils/helpers';
import { GenericShareModaStyles } from './GenericModalStyles';
import { PrevComments } from '~/modules/community/PrevComments';
import ShareMenu from '~/modules/community/components/ShareMenu';
import { PrevReactions } from '~/modules/community/PrevReactions';
import CommentBox from '~/modules/community/components/CommentBox';
import { DefaultLink } from '../_core/components/links/DefaultLink';
import { DeleteModal } from '~/modules/community/modals/DeleteModal';
import { DefaultUserPhoto } from './components/Chat/DefaultUserPhoto';
import { CommentObj, PostModalProps } from '~/modules/community/Types';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';
import { SharePostModal } from '~/modules/_core/bits/modals/SharePostModel';
import { ImageBoxWithComment } from '~/modules/community/ImageBoxWithComment';
import { LoaderArea } from '~/modules/_core/components/loaderPage/LoaderArea';
import CommentSkeleton from '~/modules/community/components/CommentSkeleton';
import { EditPostModelPopup } from '~/modules/_core/bits/modals/PostEditModel';
import { OnSubmitProps } from '~/modules/community/components/CommentBoxTypes';
import {
  COMMUNITY_PAGE_ROUTING,
  COMMUNITY_SHARE_MODAL_TYPE,
  CONFIRMATION_MODAL_INFO,
  DEACTIVATING_USER_IMAGE,
  RESOURCES_LOADING_THUMBNAIL,
  RESOURCE_SHARE_ROUTING,
} from '~/state/constants';
import {
  MoreOptionsIcon,
  PostCommentIcon,
  PostHeartActiveIcon,
  PostHeartIcon,
  LikedIcon,
  BluePlayIcon,
  UnfriendIcon,
  PostShareIcon,
} from '~/icons';
import GenericShareModal from './modals/GenericShareModal';
import ConfirmationModal from '../_core/components/confirmationModals/ConfirmationModal';
import { getClickableLinkFromText, getClickableLinkFromTextWithoutLink } from '~/utils/getClickableLInkFromText';

const PostFeed = ({
  postObj,
  currentUser = null,
  setFeeds,
  isProfilePage = false,
  isFeedSinglePage,
}: PostModalProps) => {
  const {
    descriptions,
    _id,
    author,
    images,
    createdAt,
    reactionCount,
    commentsCount,
    currentUserReactions,
    sharedPost,
    sharedBadge,
    sharedResource,
    sharedRecipe,
    sharedLecture,
  } = postObj;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openModel, setOpenModel] = useState<boolean>(false);
  const [showGenericShareModal, setShowGenericShareModal] = useState(false);
  const [showComment, setShowComment] = useState<boolean>(false);
  const [showReactionModal, setShowReactionModal] = useState<boolean>(false);
  const [singleCommentId, setSingleCommentId] = useState<string>('');
  const [singleReactionId, setSingleReactionId] = useState<string>('');
  const [likeIcon, setLikeIcon] = useState<ReactNode>(<PostHeartIcon />);
  const [openShareModal, setOpenShareModal] = React.useState(false);
  const [openImageBoxModal, setOpenImageBoxModal] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(typeof reactionCount === 'number' ? reactionCount : 0);
  const [commentCount, setCommentCount] = useState<number>(commentsCount);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [showMoreSharedDescriptions, setShowMoreSharedDescriptions] = useState<boolean>(false);

  const [showDeletePostModal, setDeletePostModal] = useState<boolean>(false);
  const [postImageList, setPostImageList] = useState<PostModalProps['postObj']['images']>(images);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmModalTypeAndPayload, setConfirmModalTypeAndPayload] = useState({
    type: '',
    payload: '',
    message: '',
    title: '',
    buttonName: '',
  });

  //Modal States
  const handleShareClose = () => setOpenShareModal(false);
  const handleImageBoxModalClose = () => setOpenImageBoxModal(false);
  const handleCloseModel = () => setOpenModel(false);
  const handleCloseLikeModel = () => setShowReactionModal(false);
  const handleCloseDeletePostModel = () => setDeletePostModal(false);

  // API CALLS
  const [deletePostFeed, loading] = useRemoveFeedsMutation();
  const [removeFriend] = useRemoveFriendMutation();
  const [hidePost] = useHidePostMutation();
  const [addReaction, { isLoading: addReactionLoading }] = useReactToPostsMutation();
  const [addComment, { isLoading: addCommentLoading }] = useCreateCommentsMutation();
  const [comments, setComments] = useState<CommentObj[]>([]);
  const [page, setPage] = useState<number>(1);
  const [showLoadMore, setShowLoadMore] = useState<boolean>(false);
  const { data } = useGetProfileQuery();
  const profileData = data?.data;

  const [likeIconStatus, setLikeIconStatus] = useState<boolean>(postObj?.currentUserReactions ? true : false);
  const showLoadMoreRef = useRef<HTMLDivElement>(null);

  const { data: singleFeedData, isFetching: singleFeedDataLoading } = useListPaginatedCommentsQuery(
    { perPage: 5, feedsId: singleCommentId, page },
    { skip: !singleCommentId },
  );

  const singleFeedComment = singleFeedData?.data as CommentObj[];

  useEffect(() => {
    if (isFeedSinglePage) {
      setShowComment(isFeedSinglePage);
      setSingleCommentId(_id);
    }
  }, [isFeedSinglePage]);

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

  const openDeletePostModal = () => {
    setDeletePostModal((prev) => !prev);
  };

  const handleDeletePost = () => {
    deletePostFeed(_id)
      .unwrap()
      .then((deletedFeed) => {
        setFeeds((prevFeeds) => prevFeeds.filter((prevFeed) => prevFeed._id !== deletedFeed.data._id));
        setDeletePostModal(false);
        toast.success('Post Deleted Successfully');
        if (isFeedSinglePage) {
          router.push(`/user/me/mePage`);
        }
      })
      .catch((err) => {
        toast.error(err?.data?.message);
      });
  };

  useEffect(() => {
    if (currentUserReactions === null) {
      setLikeIconStatus(false);
    }
  }, [currentUserReactions]);

  useEffect(() => {
    setLikeIcon(likeIconStatus ? <PostHeartActiveIcon /> : <PostHeartIcon />);
  }, [likeIconStatus]);

  useEffect(() => {
    if (descriptions?.length >= 150) {
      setShowMore(true);
    }
  }, [descriptions?.length]);

  const debounceUpdateLikes = (reactionType: FEEDS_REACTION_TYPE, id: string, action: REACTION_ACTIONS) => {
    addReaction({
      action,
      feeds: id,
      reactionType,
    })
      .unwrap()
      .catch(() => setLikeIconStatus(false));
    setLikeIconStatus((prev) => !prev);
    setLikeCount((prev) => (action === REACTION_ACTIONS.ADD ? prev + 1 : prev === 0 ? 0 : prev - 1));
  };

  const updateLikes = debounce((reactionType: FEEDS_REACTION_TYPE, id: string, action: REACTION_ACTIONS) => {
    debounceUpdateLikes(reactionType, id, action);
  }, 800);

  const getCommentByPostId = (id: string) => {
    if (!showComment) {
      setSingleCommentId(id);
    }
    setShowComment((prev) => !prev);
  };

  const getLikesByPostId = (id: string) => {
    setShowReactionModal((prev) => !prev);
    setSingleReactionId(id);
  };

  const onCommentSubmit: SubmitHandler<OnSubmitProps> = ({ data, reset }) => {
    addComment({ feeds: _id, text: data.comment })
      .unwrap()
      .then(() => reset())
      .then(() => setCommentCount((prev) => prev + 1));
  };

  if (!_id) {
    return <LoaderArea isOverlay />;
  }

  const handleOpenModel = () => setOpenModel(true);

  const handleImageBoxModal = () => {
    setOpenImageBoxModal(true);
  };

  const handleRemoveFriend = () => {
    removeFriend(postObj?.friend?._id)
      .unwrap()
      .then(() => {
        toast.success('Friend removed.');
        router.push(COMMUNITY_PAGE_ROUTING.FEED);
      })
      .catch((err) => {
        toast.error(err.data.message);
      });
  };

  const handleHideFeed = () => {
    hidePost({ feedId: postObj?._id })
      .unwrap()
      .then(() => {
        toast.success('Post hidden.');
        router.push(COMMUNITY_PAGE_ROUTING.FEED);
      })
      .catch((err) => {
        toast.error(err.data.message);
      });
  };

  const { origin } = absoluteUrl();
  const currentPostDetails = sharedBadge || sharedRecipe || sharedResource || sharedPost || sharedLecture;
  let descriptionToShare = postObj?.descriptions;
  let shareModalType,
    isSharedPostAsBadge = false,
    imageUrlToShare = '',
    authorImageUrl = postObj?.author?.photo?.completedUrl,
    authorName = postObj?.author?.name,
    authorId = postObj?.author?._id,
    titleForBadge = '',
    authorImageColor = postObj?.author?.color || '',
    enableUserToUpdateImageAndPost = true;
  if (sharedBadge) {
    shareModalType = COMMUNITY_SHARE_MODAL_TYPE.sharedBadge;
    descriptionToShare = sharedBadge?.descriptions;
    imageUrlToShare = sharedBadge?.badge?.completedUrl;
    titleForBadge = sharedBadge?.title;
    enableUserToUpdateImageAndPost = false;
  } else if (sharedRecipe) {
    shareModalType = COMMUNITY_SHARE_MODAL_TYPE.sharedRecipe;
    imageUrlToShare = sharedRecipe?.vimeoDetails?.thumbNailImage || sharedRecipe?.featuredImage?.[0]?.completedUrl;
    enableUserToUpdateImageAndPost = false;
  } else if (sharedResource) {
    shareModalType = COMMUNITY_SHARE_MODAL_TYPE.sharedResource;
    imageUrlToShare = sharedResource?.vimeoDetails?.thumbNailImage || sharedResource?.featuredImage?.[0]?.completedUrl;
    enableUserToUpdateImageAndPost = false;
  } else if (sharedPost) {
    shareModalType = COMMUNITY_SHARE_MODAL_TYPE.sharedPost;
    descriptionToShare = sharedPost?.descriptions || '';
    authorImageUrl = sharedPost?.author?.photo?.completedUrl;
    authorName = sharedPost?.author?.name;
    authorImageColor = sharedPost?.author?.color;
    enableUserToUpdateImageAndPost = false;
    if (sharedPost?.sharedBadge) {
      imageUrlToShare = sharedPost?.sharedBadge?.badge?.completedUrl;
      titleForBadge = sharedPost?.sharedBadge?.title;
      isSharedPostAsBadge = true;
    } else if (sharedPost?.sharedLecture) {
      imageUrlToShare =
        sharedPost?.sharedLecture?.vimeoDetails?.thumbNailImage ||
        sharedPost?.sharedLecture?.featuredImage?.completedUrl;
    } else if (sharedPost?.sharedRecipe) {
      imageUrlToShare =
        sharedPost?.sharedLecture?.vimeoDetails?.thumbNailImage ||
        sharedPost?.sharedRecipe?.featuredImage?.[0]?.completedUrl;
    } else if (sharedPost?.sharedResource) {
      imageUrlToShare =
        sharedPost?.sharedLecture?.vimeoDetails?.thumbNailImage ||
        sharedPost?.sharedResource?.featuredImage?.[0]?.completedUrl;
    } else {
      imageUrlToShare = sharedPost?.images?.[0]?.completedUrl;
    }
  } else if (sharedLecture) {
    shareModalType = COMMUNITY_SHARE_MODAL_TYPE.sharedLecture;
    imageUrlToShare = sharedLecture?.vimeoDetails?.thumbNailImage || sharedLecture?.featuredImage?.completedUrl;
    enableUserToUpdateImageAndPost = false;
  } else {
    shareModalType = COMMUNITY_SHARE_MODAL_TYPE.sharedPost;
    descriptionToShare = postObj?.descriptions;
    imageUrlToShare = postObj?.images?.[0]?.completedUrl;
  }

  let currentUrl = '';
  if (typeof window !== 'undefined' && window.location) {
    currentUrl = window.location.pathname;
  }

  let requiredPath = COMMUNITY_PAGE_ROUTING.FEEDS_DYNAMIC + postObj._id + '/';

  let formattedText = getClickableLinkFromText(descriptions);
  let formattedTextWithNoLink = getClickableLinkFromTextWithoutLink(descriptions);
  let formattedTextForSharedPostDescription = getClickableLinkFromTextWithoutLink(
    (sharedPost && sharedPost.descriptions) || '',
  );

  return (
    <Card cardSxProps={{ border: '1px solid #F4F5FC', boxShadow: '0px 6px 18px 2px #0000000A' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} ref={showLoadMoreRef}>
        <Box sx={{ display: 'flex', mb: 2 }}>
          {author.photo?.completedUrl ? (
            <Box sx={{ position: 'relative', height: '48px', width: '48px' }}>
              <Image
                src={
                  currentUser && profileData?.photo?.completedUrl
                    ? profileData?.photo?.completedUrl
                    : author.photo?.completedUrl
                }
                alt={author?.name}
                width="100%"
                height="100%"
                objectFit="cover"
                style={{ borderRadius: '50%' }}
              />
            </Box>
          ) : (
            <DefaultUserPhoto
              userName={author?.name || author?.email}
              fontNewSize={{ fontSize: '18px' }}
              sx={{ backgroundColor: `${author?.color}`, height: '48px', width: '48px' }}
            />
          )}

          <Stack sx={{ pl: 1.5 }}>
            {isProfilePage ? (
              <Typography sx={{ textTransform: 'capitalize' }} variant="subtitle1">
                {author?.name}
              </Typography>
            ) : (
              <Link href={`/profile/${author._id}`}>
                <a>
                  <Typography sx={{ textTransform: 'capitalize' }} variant="subtitle1">
                    {author.name}
                  </Typography>
                </a>
              </Link>
            )}

            <Typography variant="body2">{moment(createdAt).fromNow()}</Typography>
          </Stack>
        </Box>
        <ConfirmationModal
          title={confirmModalTypeAndPayload?.title}
          showModal={showConfirmationModal}
          setShowModal={setShowConfirmationModal}
          message={confirmModalTypeAndPayload?.message}
          buttonName={confirmModalTypeAndPayload.buttonName}
          modalAction={
            confirmModalTypeAndPayload.type === CONFIRMATION_MODAL_INFO.UNFRIEND ? handleRemoveFriend : handleHideFeed
          }
        />

        {!currentUser && postObj?.friend?.status === 1 && (
          <Box className="cursor-pointer">
            <MoreOptionsIcon onClick={handleClick} />
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ p: '32px 24px' }}>
                {currentUrl === COMMUNITY_PAGE_ROUTING.FEED && (
                  <Box
                    onClick={() => {
                      setConfirmModalTypeAndPayload({
                        type: CONFIRMATION_MODAL_INFO.HIDE_POST,
                        payload: '',
                        message: CONFIRMATION_MODAL_INFO.HIDE_POST_MESSAGE,
                        title: CONFIRMATION_MODAL_INFO.HIDE_POST_TITLE,
                        buttonName: CONFIRMATION_MODAL_INFO.HIDE_POST_BUTTON,
                      });
                      setShowConfirmationModal(true);
                    }}
                  >
                    <Box sx={{ display: 'flex', cursor: 'pointer', mb: '24px' }}>
                      <VisibilityOffIcon
                        sx={{
                          color: ' #09121F',
                          opacity: '0.6',
                        }}
                      />
                      <Typography sx={{ ml: '12px', color: '#131336' }} variant="body2">
                        Hide from my feed
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box
                  onClick={() => {
                    setConfirmModalTypeAndPayload({
                      type: CONFIRMATION_MODAL_INFO.UNFRIEND,
                      payload: '',
                      message: CONFIRMATION_MODAL_INFO.UNFRIEND_MESSAGE,
                      title: CONFIRMATION_MODAL_INFO.UNFRIEND_TITLE,
                      buttonName: CONFIRMATION_MODAL_INFO.UNFRIEND_BUTTON,
                    });
                    setShowConfirmationModal(true);
                  }}
                >
                  <Box sx={{ display: 'flex', cursor: 'pointer' }}>
                    <UnfriendIcon />
                    <Typography sx={{ ml: '12px', color: '#FF471A' }} variant="body2">
                      Unfriend
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Menu>
          </Box>
        )}

        {currentUser && (
          <Box className="cursor-pointer">
            <MoreOptionsIcon onClick={handleClick} />
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box>
                <MenuItem onClick={handleOpenModel}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  Edit Post
                </MenuItem>
                <Divider />
              </Box>

              <MenuItem onClick={() => openDeletePostModal()}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                Delete Post
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>

      {/* This is the description typed and shared by user */}
      <Typography variant="body1" sx={{ pb: 1, whiteSpace: 'pre-wrap' }}>
        {showMore ? (
          <>
            {requiredPath === currentUrl ? (
              <div className="post-link" dangerouslySetInnerHTML={{ __html: formattedText.substring(0, 150) }} />
            ) : (
              <Link className="cursor-pointer" href={`/user/community/feeds/${_id}`}>
                <a>
                  <Box
                    className="post-link-post"
                    dangerouslySetInnerHTML={{ __html: formattedTextWithNoLink.substring(0, 150) }}
                  />
                </a>
              </Link>
            )}

            <button
              className="btn"
              style={{ marginLeft: '5px', cursor: 'pointer', color: '#A1A1AF' }}
              onClick={() => setShowMore(!showMore)}
            >
              Show more
            </button>
          </>
        ) : (
          <>
            {requiredPath === currentUrl ? (
              <div className="post-link" dangerouslySetInnerHTML={{ __html: formattedText }} />
            ) : (
              <Link className="cursor-pointer" href={`/user/community/feeds/${_id}`}>
                <a>
                  <Box className="post-link-post" dangerouslySetInnerHTML={{ __html: formattedTextWithNoLink }} />
                </a>
              </Link>
            )}

            {descriptions?.length > 150 && (
              <button
                className="btn"
                style={{ marginLeft: '5px', cursor: 'pointer', color: '#A1A1AF' }}
                onClick={() => setShowMore(!showMore)}
              >
                Show less
              </button>
            )}
          </>
        )}
      </Typography>

      {sharedPost && (
        <Box sx={{ border: '1px solid #F4F5FC', borderRadius: '12px', padding: '1rem' }}>
          <Typography variant="body1" sx={{ pb: 1, whiteSpace: 'pre-wrap' }}>
            {showMoreSharedDescriptions ? (
              <>
                <Link href={`/user/community/feeds/${sharedPost._id}`}>
                  <Box
                    className="post-link-post"
                    dangerouslySetInnerHTML={{ __html: formattedTextForSharedPostDescription.substring(0, 150) }}
                  />
                </Link>
                <button
                  className="btn"
                  style={{ marginLeft: '5px', cursor: 'pointer', color: '#A1A1AF' }}
                  onClick={() => setShowMoreSharedDescriptions(!showMoreSharedDescriptions)}
                >
                  Show more
                </button>
              </>
            ) : (
              <>
                <Link href={`/user/community/feeds/${sharedPost._id}`}>
                  <Box
                    className="post-link-post"
                    dangerouslySetInnerHTML={{ __html: formattedTextForSharedPostDescription }}
                    sx={{ mb: '8px' }}
                  />
                </Link>
                {sharedPost?.descriptions?.length > 150 && (
                  <button
                    className="btn"
                    style={{ marginLeft: '5px', cursor: 'pointer', color: '#A1A1AF' }}
                    onClick={() => setShowMoreSharedDescriptions(!showMoreSharedDescriptions)}
                  >
                    Show less
                  </button>
                )}
              </>
            )}
          </Typography>

          {sharedPost.images && sharedPost.images?.length !== 0 && (
            <Box
              sx={{
                margin: '8px 0px',
                cursor: 'pointer',
                maxWidth: '100%',
                borderRadius: '4px',
                display: 'flex',
              }}
            >
              {Array.isArray(sharedPost.images) &&
                sharedPost.images.slice(0, 3).map((image, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: 'relative',
                      height: '350px',
                      width: '700px',
                      borderRadius: '4px',
                      margin: '4px',
                    }}
                  >
                    <Link href={`/user/community/feeds/${sharedPost._id}`}>
                      <Image
                        src={image?.completedUrl}
                        alt="user-images"
                        layout="fill"
                        objectFit="contain"
                        objectPosition="center"
                        style={{ borderRadius: '4px' }}
                      />
                    </Link>
                  </Box>
                ))}
            </Box>
          )}
          {/* Nested shared badge */}
          {sharedPost?.sharedBadge && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '6px',
                mb: '24px',
                mt: '16px',
                p: '16px',
                background: 'radial-gradient(60.1% 66.93% at 86.5% 66.67%, #FDE078 0%, #FDB839 100%) ',
              }}
            >
              {sharedPost?.sharedBadge?.badge?.completedUrl && (
                <Image
                  src={sharedPost?.sharedBadge?.badge?.completedUrl}
                  alt={sharedPost?.sharedBadge?.title}
                  style={{ borderRadius: '50%' }}
                  height="220px"
                  width="220px"
                />
              )}
              {sharedPost?.sharedBadge?.title && (
                <Typography sx={{ mt: '12px', mb: '8px' }} variant="subtitle1">
                  {sharedPost?.sharedBadge?.title}
                </Typography>
              )}
            </Box>
          )}
          {/* Nested Shared resources */}
          {sharedPost?.sharedResource && (
            <DefaultLink to={`${RESOURCE_SHARE_ROUTING.RESOURCES}/${sharedPost?.sharedResource?._id}`}>
              <Box sx={{ mb: '24px', mt: '16px', borderRadius: '4px' }}>
                {(sharedPost?.sharedResource.vimeoDetails?.thumbNailImage ||
                  sharedPost?.sharedResource?.featuredImage) && (
                  <Box sx={{ position: 'relative', width: '100%', height: '500px' }}>
                    <Image
                      style={{ borderRadius: '4px' }}
                      src={
                        sharedPost?.sharedResource.vimeoDetails?.thumbNailImage ||
                        sharedPost?.sharedResource?.featuredImage[0]?.completedUrl ||
                        RESOURCES_LOADING_THUMBNAIL
                      }
                      height="100%"
                      width="100%"
                      objectFit="cover"
                      layout="fill"
                      alt={sharedPost?.sharedResource?.title}
                    />
                  </Box>
                )}

                <Typography sx={{ mt: '12px', mb: '8px', color: '#131336' }} variant="subtitle1">
                  {sharedPost?.sharedResource?.title}
                </Typography>

                {sharedPost?.sharedResource?.content && (
                  <Typography
                    sx={{ color: '#131336' }}
                    className="line-clamp"
                    dangerouslySetInnerHTML={{ __html: sharedPost?.sharedResource?.content }}
                    variant="body1"
                  />
                )}
              </Box>
            </DefaultLink>
          )}

          {/* Nested Shared lectures */}
          {sharedPost?.sharedLecture && (
            <DefaultLink to={RESOURCE_SHARE_ROUTING.COURSE}>
              <Box sx={{ mb: '24px', mt: '16px', borderRadius: '4px' }}>
                {(sharedPost?.sharedLecture.vimeoDetails?.thumbNailImage ||
                  sharedPost?.sharedLecture?.featuredImage) && (
                  <Box sx={{ position: 'relative', width: '100%', height: '500px' }}>
                    <Image
                      style={{ borderRadius: '4px' }}
                      src={
                        sharedPost?.sharedLecture?.vimeoDetails?.thumbNailImage ||
                        sharedPost?.sharedLecture?.featuredImage?.completedUrl ||
                        RESOURCES_LOADING_THUMBNAIL
                      }
                      height="100%"
                      width="100%"
                      objectFit="cover"
                      layout="fill"
                      alt={sharedPost?.sharedLecture?.title}
                    />
                    <Box sx={GenericShareModaStyles.playIconContainer}>
                      <BluePlayIcon />
                    </Box>
                  </Box>
                )}

                <Typography sx={{ mt: '12px', mb: '8px', color: '#131336' }} variant="subtitle1">
                  {sharedPost?.sharedLecture?.title}
                </Typography>

                {sharedPost?.sharedLecture?.description && (
                  <Typography
                    sx={{ color: '#131336' }}
                    className="line-clamp"
                    dangerouslySetInnerHTML={{ __html: sharedPost?.sharedLecture?.description }}
                    variant="body1"
                  />
                )}
              </Box>
            </DefaultLink>
          )}

          {/* Nested shared recipe */}
          {sharedPost?.sharedRecipe && (
            <DefaultLink to={`${RESOURCE_SHARE_ROUTING.RECIPE}/${sharedPost?.sharedRecipe?._id}`}>
              <Box sx={{ mb: '24px', mt: '16px', borderRadius: '4px' }}>
                {(sharedPost?.sharedRecipe.vimeoDetails?.thumbNailImage || sharedPost?.sharedRecipe?.featuredImage) && (
                  <Box sx={{ position: 'relative', width: '100%', height: '500px' }}>
                    <Image
                      style={{ borderRadius: '4px' }}
                      src={
                        sharedPost?.sharedRecipe.vimeoDetails?.thumbNailImage ||
                        sharedPost?.sharedRecipe?.featuredImage?.[0]?.completedUrl ||
                        RESOURCES_LOADING_THUMBNAIL
                      }
                      height="100%"
                      width="100%"
                      objectFit="cover"
                      layout="fill"
                      alt={sharedPost?.sharedRecipe?.title}
                    />
                  </Box>
                )}

                <Typography sx={{ mt: '12px', mb: '8px', color: '#131336' }} variant="subtitle1">
                  {sharedPost?.sharedRecipe?.title}
                </Typography>
              </Box>
            </DefaultLink>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', mb: 2 }}>
              {sharedPost?.author?.photo?.completedUrl ? (
                <Image
                  src={sharedPost.author.isActive ? sharedPost.author.photo?.completedUrl : DEACTIVATING_USER_IMAGE}
                  height={48}
                  width={48}
                  alt="user"
                  style={{ borderRadius: '100%' }}
                />
              ) : (
                <DefaultUserPhoto
                  fontNewSize={{ fontSize: '18px' }}
                  sx={{
                    backgroundColor: `${sharedPost?.author?.color}`,
                    width: '48px',
                    height: '48px',
                  }}
                  userName={sharedPost?.author?.isActive ? sharedPost?.author?.name : deactivateUserName}
                />
              )}

              <Stack sx={{ pl: 1.5 }}>
                <Link href={`/profile/${sharedPost?.author?._id}`}>
                  <a>
                    <Typography sx={{ textTransform: 'capitalize' }} variant="subtitle1">
                      {sharedPost?.author?.name}
                    </Typography>
                  </a>
                </Link>
                <Typography variant="body2">{moment(sharedPost.createdAt).fromNow()}</Typography>
              </Stack>
            </Box>
          </Box>
        </Box>
      )}

      {sharedBadge && sharedBadge?.badge?.completedUrl && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '6px',
            mb: '24px',
            mt: '16px',
            p: '16px',
            background: 'radial-gradient(60.1% 66.93% at 86.5% 66.67%, #FDE078 0%, #FDB839 100%) ',
          }}
        >
          {sharedBadge?.badge?.completedUrl && (
            <Image
              src={sharedBadge?.badge?.completedUrl}
              alt={sharedBadge?.title}
              style={{ borderRadius: '50%' }}
              height="220px"
              width="220px"
            />
          )}
          {sharedBadge?.title && (
            <Typography sx={{ mt: '12px', mb: '8px' }} variant="subtitle1">
              {sharedBadge?.title}
            </Typography>
          )}
        </Box>
      )}

      {sharedResource && (
        <DefaultLink to={`${RESOURCE_SHARE_ROUTING.RESOURCES}/${sharedResource?._id}`}>
          <Box
            sx={{
              mb: '24px',
              mt: '16px',
              borderRadius: '4px',
            }}
          >
            {(sharedResource?.vimeoDetails?.thumbNailImage || sharedResource?.featuredImage) && (
              <Box sx={{ position: 'relative', width: '100%', height: '500px' }}>
                <Image
                  style={{ borderRadius: '4px' }}
                  src={
                    sharedResource?.vimeoDetails?.thumbNailImage ||
                    sharedResource?.featuredImage[0]?.completedUrl ||
                    RESOURCES_LOADING_THUMBNAIL
                  }
                  height="100%"
                  width="100%"
                  objectFit="contain"
                  layout="fill"
                  alt={sharedResource?.title}
                />
              </Box>
            )}

            <Typography sx={{ mt: '12px', mb: '8px', color: '#131336' }} variant="subtitle1">
              {sharedResource?.title}
            </Typography>

            {sharedResource?.content && (
              <Typography
                sx={{ color: '#131336' }}
                className="line-clamp"
                dangerouslySetInnerHTML={{ __html: sharedResource?.content }}
                variant="body1"
              />
            )}
          </Box>
        </DefaultLink>
      )}
      {sharedRecipe && (
        <DefaultLink to={`${RESOURCE_SHARE_ROUTING.RECIPE}/${sharedRecipe?._id}`}>
          <Box sx={{ mb: '24px', mt: '16px', borderRadius: '4px' }}>
            {(sharedRecipe.vimeoDetails?.thumbNailImage || sharedRecipe?.featuredImage) && (
              <Box sx={{ position: 'relative', width: '100%', height: '500px' }}>
                <Image
                  style={{ borderRadius: '4px' }}
                  src={
                    sharedRecipe.vimeoDetails?.thumbNailImage ||
                    sharedRecipe?.featuredImage?.[0]?.completedUrl ||
                    RESOURCES_LOADING_THUMBNAIL
                  }
                  height="100%"
                  width="100%"
                  objectFit="contain"
                  layout="fill"
                  alt={sharedRecipe?.title}
                />
              </Box>
            )}

            <Typography sx={{ mt: '12px', mb: '8px', color: '#131336' }} variant="subtitle1">
              {sharedRecipe?.title}
            </Typography>
          </Box>
        </DefaultLink>
      )}

      {sharedLecture && (
        <DefaultLink to={RESOURCE_SHARE_ROUTING.COURSE}>
          <Box sx={{ borderRadius: '4px' }}>
            {(sharedLecture?.vimeoDetails?.thumbNailImage || sharedLecture?.featuredImage) && (
              <Box sx={{ position: 'relative', width: '100%', height: '500px' }}>
                <Image
                  style={{ borderRadius: '4px' }}
                  src={
                    sharedLecture?.vimeoDetails?.thumbNailImage ||
                    sharedLecture?.featuredImage?.completedUrl ||
                    RESOURCES_LOADING_THUMBNAIL
                  }
                  height="100%"
                  width="100%"
                  objectFit="contain"
                  layout="fill"
                  alt={sharedLecture?.title}
                />
                <Box sx={GenericShareModaStyles.playIconContainer}>
                  <BluePlayIcon />
                </Box>
              </Box>
            )}
            <Typography sx={{ mt: '12px', mb: '8px', color: '#131336' }} variant="subtitle1">
              {sharedLecture?.title}
            </Typography>
            {sharedLecture?.description && (
              <Typography
                sx={{ color: '#131336' }}
                className="line-clamp"
                dangerouslySetInnerHTML={{ __html: sharedLecture?.description }}
                variant="body1"
              />
            )}
          </Box>
        </DefaultLink>
      )}

      {postImageList && postImageList?.length !== 0 && (
        <Box
          sx={{
            margin: '8px 0px',
            cursor: 'pointer',
            maxWidth: '100%',
            borderRadius: '4px',
            display: 'flex',
          }}
        >
          {Array.isArray(postImageList) &&
            postImageList?.slice(0, 3)?.map((image, i) => {
              if (!image?.completedUrl) {
                return;
              }

              return (
                <Box
                  key={i}
                  sx={{
                    position: 'relative',
                    height: '350px',
                    width: '700px',
                    borderRadius: '4px',
                    margin: '4px',
                  }}
                >
                  <Image
                    src={image?.completedUrl}
                    alt="user-images"
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center"
                    onClick={handleImageBoxModal}
                    style={{ borderRadius: '4px' }}
                  />
                  {i === 2 && postImageList?.length > 3 && (
                    <Box
                      onClick={handleImageBoxModal}
                      style={{
                        position: 'absolute',
                        height: '100%',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(0deg, rgba(19, 19, 54, 0.8), rgba(19, 19, 54, 0.8)), url(.jpg)',
                        borderRadius: '4px',
                      }}
                    >
                      <Box
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          height: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <h6
                          style={{
                            fontWeight: 700,
                            fontSize: '20px',
                            lineHeight: '26px',
                            color: '#fff',
                          }}
                        >{`+ ${postImageList.length - 3}`}</h6>
                      </Box>
                    </Box>
                  )}
                </Box>
              );
            })}
        </Box>
      )}

      {(postObj?.friend?.status === 1 || currentUser) && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '16px' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LikedIcon />

              <Typography
                variant="body2"
                onClick={() => likeCount && getLikesByPostId(_id)}
                style={{ cursor: 'pointer' }}
              >
                {likeCount}
              </Typography>
            </Stack>
            <Typography variant="body2" onClick={() => getCommentByPostId(_id)} style={{ cursor: 'pointer' }}>
              {`${commentCount || singleFeedData?.totalData || 0} ${
                commentCount > 1 || singleFeedData?.totalData > 1 ? 'comments' : 'comment'
              }`}
            </Typography>
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
              isBadge={isSharedPostAsBadge}
              showModal={showGenericShareModal}
              setShowGenericShareModal={setShowGenericShareModal}
              imageUrl={imageUrlToShare}
              title={titleForBadge}
              description={descriptionToShare}
              shareModalType={shareModalType}
              id={sharedPost?._id ?? _id}
              authorDetails={{
                imageUrl: authorImageUrl,
                name: authorName,
                authorImageColor: authorImageColor,
                createdTimeSpan: moment(createdAt).fromNow(),
              }}
              isRepostedFromFeed={true}
            />
          </Box>
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
          <Modal
            open={openModel}
            onClose={handleCloseModel}
            aria-labelledby="modal-post"
            aria-describedby="post something"
          >
            <EditPostModelPopup
              closeModal={handleCloseModel}
              postId={_id}
              postobj={postObj}
              imageUrlToShare={imageUrlToShare}
              enableUserToUpdateImageAndPost={enableUserToUpdateImageAndPost}
              setFeeds={setFeeds}
              descriptionToShare={descriptionToShare}
            />
          </Modal>
        </Box>
      )}
      <Modal open={openShareModal} onClose={handleShareClose} aria-describedby="share post">
        <SharePostModal handleClose={handleShareClose} content={descriptions} postID={_id} />
      </Modal>
      <Modal open={showReactionModal} onClose={handleCloseLikeModel}>
        <PrevReactions closeModal={handleCloseLikeModel} singleReactionId={singleReactionId} />
      </Modal>

      <Modal open={showDeletePostModal} onClose={handleCloseDeletePostModel}>
        <DeleteModal closeModal={handleCloseDeletePostModel} onDelete={handleDeletePost} loading={loading?.isLoading} />
      </Modal>

      <Modal open={openImageBoxModal} onClose={handleImageBoxModalClose}>
        <ImageBoxWithComment
          showCommentToUser={postObj?.friend?.status === 1 || currentUser ? true : false}
          closeModal={handleImageBoxModalClose}
          postObj={postObj}
          currentUser={currentUser}
          setCommentCount={setCommentCount}
          commentCount={commentCount}
          setComments={setComments}
          comments={comments}
          likeCount={likeCount}
          likeIcon={likeIcon}
          likeIconStatus={likeIconStatus}
          setLikeCount={setLikeCount}
          setLikeIcon={setLikeIcon}
          setLikeIconStatus={setLikeIconStatus}
          postImageList={postImageList}
          setPostImageList={setPostImageList}
          singleReactionId={singleReactionId}
          postObjId={_id}
          getLikesByPostId={getLikesByPostId}
          authorDetails={{
            imageUrl: authorImageUrl,
            name: authorName,
            authorImageColor: authorImageColor,
            createdTimeSpan: moment(createdAt).fromNow(),
          }}
          imageUrlToShare={imageUrlToShare}
          descriptionToShare={descriptionToShare}
        />
      </Modal>
    </Card>
  );
};

export { PostFeed };
