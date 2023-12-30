import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button, Skeleton, Stack, Typography, useMediaQuery } from '@mui/material';

import { Card } from '../_core/bits/cards';
import { StickyDiv } from './styles/StickyDiv';
import { DefaultLink } from '../_core/components/links/DefaultLink';
import { CameraIcon, UnfriendIcon, UnlockedBadgeIcon } from '~/icons';
import { DefaultUserPhoto } from './components/Chat/DefaultUserPhoto';
import { userProfile } from '../_core/styles/BillingAndAccountingStyles';
import { CONFIRMATION_MODAL_INFO, DEFAULT_AVATAR } from '~/state/constants';
import {
  useDeactivateUserMutation,
  useGetProfileQuery,
  useGetRecordDataLogsByRecordTypeForUserQuery,
  useGetUserProfileByIdQuery,
  useListPaginatedCurrentUserFriendsQuery,
  useGetRecordDataLogsByRecordTypeQuery,
  IRecordLogsWithRecordTypeDetails,
  RECORD_TYPE,
  FRIENDS_STATUS,
  useResponseToFriendRequestMutation,
  useCancelRequestFriendMutation,
  useRequestFriendMutation,
  useGetCurrentUserCompletedCourseQuery,
  useRemoveFriendMutation,
  useHidePostFromAuthorMutation,
  useUnHidePostFromAuthorMutation,
  ENUM_ROLE_ACCESS_FOR,
} from '@newstart-online/sdk';
import { ROUTE } from '~/config/routes';
import { SendPrayers } from './SendPrayers';
import { clearAllTokens } from '~/utils/authStore';
import { clearTokens } from '@newstart-online/sdk';
import { unitForRecordType } from '../record/utils/record-logs-type';
import { setLoading } from '~/state/services/loader/globalLoaderSlice';
import { FriendsListsStyles } from '../_core/styles/FriendsListsStyles';
import ConfirmationModal from '../_core/components/confirmationModals/ConfirmationModal';
import { UserPhotoUploadModal } from '../onboarding/modals/MultiformModal/UserPhotoUploadModal';

interface IUserProfile {
  showSendPrayers?: boolean;
  userProfileShowStatus?: boolean;
  showFriends?: boolean;
  showStats?: boolean;
  showCameraIcon?: boolean;
  userId?: string;
  showUserDeactivateButton?: boolean;
  showCertificateDownloadOption?: boolean;
}
const UserProfile = ({
  showSendPrayers = false,
  userProfileShowStatus,
  showCameraIcon = true,
  showStats = true,
  showFriends = false,
  userId = '',
  showUserDeactivateButton = false,
  showCertificateDownloadOption = false,
}: IUserProfile) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, isFetching: profileDataFetching } = useGetProfileQuery();
  const { data: currentUserCompletedCourseData } = useGetCurrentUserCompletedCourseQuery();

  const [responseToFriendRequest] = useResponseToFriendRequestMutation();
  const [cancelFriendRequest] = useCancelRequestFriendMutation();
  const [requestFriend] = useRequestFriendMutation();
  const [removeFriend] = useRemoveFriendMutation();
  const [hidePostFromAuthor] = useHidePostFromAuthorMutation();
  const [unhidePostFromAuthor] = useUnHidePostFromAuthorMutation();

  const { data: profileDataById } = useGetUserProfileByIdQuery(userId, { skip: !userId });
  const profileData = userId === '' ? data?.data : profileDataById?.data?.user;
  const { data: friends } = useListPaginatedCurrentUserFriendsQuery({
    perPage: 1,
    page: 1,
  });

  const [deactivateAccount] = useDeactivateUserMutation();
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showUnfriendMenu, setShowUnfriendMenu] = useState(false);
  const [confirmModalTypeAndPayload, setConfirmModalTypeAndPayload] = useState({
    type: '',
    payload: '',
    message: '',
    title: '',
    buttonName: '',
  });
  const [isFriendRequested, setIsFriendRequested] = useState(false);
  const [isFriendRequesteSent, setIsFriendRequesteSent] = useState(true);
  const [isFriendResponded, setIsFriendResponded] = useState(false);

  const { data: recordDataWithTypesForCurrentUser } = useGetRecordDataLogsByRecordTypeQuery();
  const { data: recordDataForExternalUser } = useGetRecordDataLogsByRecordTypeForUserQuery(userId, { skip: !userId });

  const handleFileUpload = () => {
    setShowImageUploadModal(true);
  };

  const recordDataDetails = userId ? recordDataForExternalUser : recordDataWithTypesForCurrentUser;

  const getValue = (item: IRecordLogsWithRecordTypeDetails) => {
    if (item.value) {
      return item.value;
    }

    if (item.recordLogEnum === RECORD_TYPE.EXERCISE_MINUTES) {
      return item?.recordLogs
        ? item?.recordLogs.record[RECORD_TYPE.EXERCISE_MINUTES]?.exerciseTime?.toFixed(2) +
            unitForRecordType(item.recordLogEnum)
        : '-';
    }
    if (item.recordLogEnum === RECORD_TYPE.BLOOD_PRESSURE) {
      return item?.recordLogs
        ? item?.recordLogs.record[RECORD_TYPE.BLOOD_PRESSURE]?.high?.toFixed(2) +
            '/' +
            item?.recordLogs.record[RECORD_TYPE.BLOOD_PRESSURE]?.low?.toFixed(2) +
            unitForRecordType(item.recordLogEnum)
        : '-';
    }

    if (item.recordLogEnum === RECORD_TYPE.HEART_RATE) {
      return item?.recordLogs
        ? item?.recordLogs.record[RECORD_TYPE.HEART_RATE]?.heartRate?.toFixed(2) + unitForRecordType(item.recordLogEnum)
        : '-';
    }

    if (item.recordLogEnum === RECORD_TYPE.BLOOD_SUGARS) {
      return item?.recordLogs
        ? item?.recordLogs.record[RECORD_TYPE.BLOOD_SUGARS]?.fastingBloodSugar?.toFixed(2) +
            unitForRecordType(item.recordLogEnum)
        : '-';
    }

    return item?.recordLogs && item.recordLogEnum
      ? // @ts-ignore
        item?.recordLogs.record[item.recordLogEnum]?.value + unitForRecordType(item.recordLogEnum)
      : '-';
  };
  const handleDeactivateAccount = () => {
    deactivateAccount()
      .unwrap()
      .then((resMessage) => {
        handleLogout();
        toast.success('Account deactivated successfully');
      })
      .catch((error) => toast.error(error));
  };

  const handleUnfriendOrHidePost = () => {
    if (confirmModalTypeAndPayload.type === CONFIRMATION_MODAL_INFO.UNFRIEND) {
      removeFriend(profileDataById?.data?.friends?._id || '')
        .unwrap()
        .then(() => {
          toast.success('Friend removed.');
          router.push(`/profile/${profileDataById?.data?.user?._id}`);
        })
        .catch((err) => {
          toast.error(err.data.message);
        });
    } else if (confirmModalTypeAndPayload.type === CONFIRMATION_MODAL_INFO.HIDE_POST_FROM_THIS_USER) {
      hidePostFromAuthor({ authorId: profileDataById?.data?.user?._id || '' })
        .unwrap()
        .then(() => {
          toast.success('Post hidden.');
          router.push(`/profile/${profileDataById?.data?.user?._id}`);
        })
        .catch((err) => {
          toast.error(err.data.message);
        });
    } else {
      unhidePostFromAuthor({ authorId: profileDataById?.data?.user?._id || '' })
        .unwrap()
        .then(() => {
          toast.success('Post visible.');
          router.push(`/profile/${profileDataById?.data?.user?._id}`);
        })
        .catch((err) => {
          toast.error(err.data.message);
        });
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      clearAllTokens();
      dispatch(clearTokens());
      router.push(ROUTE.SIGN_IN);
      dispatch(setLoading(false));
    } catch (e) {
      console.error('[MePage] ', e);
    }
  };

  const onFriendRequestHandle = (id: string, type: string) => {
    if (type === 'add') {
      requestFriend({ requestingUserId: id, status: FRIENDS_STATUS.PENDING })
        .unwrap()
        .then((data) => {
          setIsFriendRequested(true);
          setIsFriendRequesteSent(true);
          toast.success('Friend request sent');
        })
        .catch((error) => toast.error(error?.data?.message));
    } else {
      cancelFriendRequest(id)
        .unwrap()
        .then((data) => {
          setIsFriendRequested(false);
          setIsFriendRequesteSent(false);
          toast.success('Friend request cancelled');
        })
        .catch((error) => toast.error(error?.data?.message));
    }
  };

  let urlToPush = '';
  if (typeof window !== 'undefined' && window.location) {
    urlToPush = window.location.pathname;
  }

  const onFriendRequestResponsetHandle = (id: string, requestType: FRIENDS_STATUS, pageRefreshNeeded: boolean) => {
    responseToFriendRequest({ requestId: id, status: requestType })
      .unwrap()
      .then((item) => {
        setIsFriendResponded(true);
        pageRefreshNeeded && router.push(urlToPush);
      })
      .catch((error) => toast.error(error?.data?.message));
  };

  const matchesSmallScreen = useMediaQuery('(max-width:1200px)');

  const matchesScreen900 = useMediaQuery('(max-width:900px)');

  React.useEffect(() => {
    if (profileDataById) {
      if (!profileDataById?.data?.user?.isActive && userId) {
        toast.error('User is deactivated');
        router.back();
      }
    }
  }, [profileDataById]);

  return (
    <StickyDiv>
      <Box sx={{ justifyContent: 'space-between' }}>
        <Card
          cardContentSxProps={{ py: 3, px: 3 }}
          cardSxProps={{
            border: '1px solid #E7E7EB',
            borderRadius: '8px',
            height: `${showUnfriendMenu ? '300px' : 'fit-content'}`,
            display: 'flex',
            width: `${matchesScreen900 && router.pathname !== '/' ? '350px' : '100%'}`,
            minWidth: '340px',
          }}
        >
          <UserPhotoUploadModal
            setShowImageUploadModal={setShowImageUploadModal}
            showModal={showImageUploadModal}
            width="96px"
            height="96px"
          />
          {profileDataFetching ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton variant="circular" width={96} height={96} />
                <Stack direction="column" sx={{ pl: 2, width: '70%' }}>
                  <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%' }} />
                  <Skeleton variant="text" sx={{ fontSize: '1rem', width: '40%' }} />
                </Stack>
              </Box>
              {showStats && (
                <Box
                  sx={userProfileShowStatus ? userProfile.userProfileStatusHolderWhite : userProfile?.userProfileHide}
                >
                  <Box sx={{ mt: '24px', width: '100%' }}>
                    <Box sx={userProfile.userProfileStreakCommunity}>
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '20%' }} />
                    </Box>
                    <Box sx={userProfile.userProfileStreakCommunity}>
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '20%' }} />
                    </Box>
                    <Box sx={userProfile.userProfileStreakCommunity}>
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '20%' }} />
                    </Box>
                    <Box sx={userProfile.userProfileStreakCommunity}>
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '20%' }} />
                    </Box>
                    <Box sx={userProfile.userProfileStreakCommunity}>
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '20%' }} />
                    </Box>
                    <Box sx={userProfile.userProfileStreakCommunity}>
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '20%' }} />
                    </Box>
                    <Box sx={userProfile.userProfileStreakCommunity}>
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '20%' }} />
                    </Box>
                    <Box sx={userProfile.userProfileStreakCommunity}>
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
                      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '20%' }} />
                    </Box>
                  </Box>
                </Box>
              )}
            </>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: '16px' }}>
                <Box sx={{ position: 'relative' }}>
                  {profileData?.photo?.completedUrl ? (
                    <Image
                      className="avatar"
                      src={profileData?.photo?.completedUrl || DEFAULT_AVATAR}
                      height={96}
                      width={96}
                      alt={profileData?.name || 'user profile'}
                    />
                  ) : (
                    <DefaultUserPhoto
                      userName={profileData?.name || profileData?.email}
                      fontNewSize={{ fontSize: '24px' }}
                      sx={{ background: `${profileData?.color}`, width: '96px', height: '96px' }}
                      isActive={profileData?.isActive}
                    />
                  )}
                  {showCameraIcon && (
                    <Box
                      onClick={() => handleFileUpload()}
                      className="cursor-pointer"
                      sx={{ position: 'absolute', bottom: 0, right: 0 }}
                    >
                      <CameraIcon />
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', pl: '16px' }}>
                  <Stack direction="column">
                    <Typography sx={{ textTransform: 'capitalize' }} variant="h5">
                      {profileData?.name || profileData?.email}
                    </Typography>

                    {showFriends ? (
                      <Typography variant="body1" sx={{ color: '#147AE9' }}>
                        {friends?.totalData === 0
                          ? 'No friend'
                          : friends?.totalData === 1
                          ? '1 friend'
                          : `${friends?.totalData} friends`}
                      </Typography>
                    ) : (
                      showCameraIcon && (
                        <DefaultLink to={`/user/me/mePage`} muiLinkProps={{ sx: { fontSize: '14px' } }}>
                          View my profile
                        </DefaultLink>
                      )
                    )}
                  </Stack>
                  {profileDataById?.data?.friends?.status === FRIENDS_STATUS.REJECTED &&
                    profileDataById?.data?.friends?.approver?._id === data?.data?._id &&
                    userId !== '' &&
                    !matchesSmallScreen && (
                      <Box sx={{ mt: '16px' }}>
                        <Typography variant="subtitle2" sx={FriendsListsStyles.rejectedFriendInfoText}>
                          Previously you have rejected the friend request.
                        </Typography>
                        <Button
                          variant="outlined"
                          sx={FriendsListsStyles.addCancelButton}
                          onClick={() => {
                            !isFriendResponded &&
                              onFriendRequestResponsetHandle(
                                profileDataById?.data?.friends?._id || '',
                                FRIENDS_STATUS.APPROVED,
                                true,
                              );
                          }}
                        >
                          {isFriendResponded ? 'Responded' : 'Confirm'}
                        </Button>
                      </Box>
                    )}

                  {!profileDataById?.data?.friends && userId !== '' && !matchesSmallScreen && (
                    <Box sx={{ mt: '16px' }}>
                      <Button
                        variant="outlined"
                        sx={FriendsListsStyles.addCancelButton}
                        onClick={() =>
                          onFriendRequestHandle(
                            profileDataById?.data?.user?._id || '',
                            isFriendRequested ? 'cancel' : 'add',
                          )
                        }
                      >
                        {isFriendRequested ? 'Cancel Request' : 'Add Friend'}
                      </Button>
                    </Box>
                  )}
                  {!matchesSmallScreen &&
                    profileDataById?.data?.friends &&
                    profileDataById?.data?.friends?.status === 0 &&
                    profileDataById?.data?.friends?.requester?._id === userId && (
                      <Box sx={FriendsListsStyles.respondButtonContainer}>
                        <Button
                          variant="contained"
                          sx={FriendsListsStyles.respondButton}
                          onClick={() =>
                            !isFriendResponded &&
                            onFriendRequestResponsetHandle(
                              profileDataById?.data?.friends?._id || '',
                              FRIENDS_STATUS.APPROVED,
                              false,
                            )
                          }
                        >
                          {isFriendResponded ? 'Responded' : 'Confirm'}
                        </Button>
                        {!isFriendResponded && (
                          <Button
                            variant="outlined"
                            sx={FriendsListsStyles.deleteButton}
                            onClick={() =>
                              onFriendRequestResponsetHandle(
                                profileDataById?.data?.friends?._id || '',
                                FRIENDS_STATUS.REJECTED,
                                false,
                              )
                            }
                          >
                            Delete
                          </Button>
                        )}
                      </Box>
                    )}

                  {!matchesSmallScreen &&
                    profileDataById?.data?.friends &&
                    profileDataById?.data?.friends?.status === 0 &&
                    profileDataById?.data?.friends?.approver?._id === userId && (
                      <Box sx={{ mt: '16px' }}>
                        <Typography variant="subtitle2" sx={FriendsListsStyles.waitingText}>
                          {isFriendRequesteSent ? 'Wating for approval' : ''}
                        </Typography>
                        {profileDataById?.data?.friends?.status === FRIENDS_STATUS.PENDING && userId !== '' && (
                          <Box sx={{ mt: '16px' }}>
                            <Button
                              variant="outlined"
                              sx={FriendsListsStyles.addCancelButton}
                              onClick={() =>
                                onFriendRequestHandle(
                                  profileDataById?.data?.user?._id || '',
                                  isFriendRequesteSent ? 'cancel' : 'add',
                                )
                              }
                            >
                              {isFriendRequesteSent ? 'Cancel Request' : 'Add Friend'}
                            </Button>
                          </Box>
                        )}
                      </Box>
                    )}

                  {profileDataById?.data?.friends && profileDataById?.data?.friends?.status === 1 && (
                    <Box
                      onClick={() => {
                        if (profileDataById?.data?.user?.role?.accessFor !== ENUM_ROLE_ACCESS_FOR.ADMIN)
                          setShowUnfriendMenu(true);
                      }}
                      sx={{
                        mt: '16px',
                        backgroundColor: '#E7E7EB',
                        p: '9px 16px',
                        width: 'fit-content',
                        position: 'relative',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      <Typography variant="body2" sx={FriendsListsStyles.friendStatusText}>
                        Friend
                      </Typography>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '-2px',
                          right: '-2px',
                          backgroundColor: '#75BC37',
                          height: '8px',
                          width: '8px',
                          borderRadius: '50%',
                        }}
                      />

                      {showUnfriendMenu && (
                        <Box
                          sx={{
                            p: '32px 20px',
                            backgroundColor: '#FFFF',
                            position: 'absolute',
                            top: '46px',
                            left: '-58px',
                            boxShadow: '0px 6px 18px 2px rgba(0, 0, 0, 0.04)',
                            border: '1px solid #F3F3F5',
                            borderRadius: '8px',
                            width: '204px',
                            zIndex: '999',
                          }}
                        >
                          {profileDataById?.data?.checkIfFeedsHiddenFromUser ? (
                            <Box
                              onClick={() => {
                                setConfirmModalTypeAndPayload({
                                  type: CONFIRMATION_MODAL_INFO.UNHIDE_POST_FROM_THIS_USER,
                                  payload: '',
                                  message: CONFIRMATION_MODAL_INFO.UNHIDE_POST_FROM_THIS_USER_MESSAGE,
                                  title: CONFIRMATION_MODAL_INFO.UNHIDE_POST_FROM_THIS_USER_TITLE,
                                  buttonName: CONFIRMATION_MODAL_INFO.UNHIDE_POST_FROM_THIS_USER_BUTTON,
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
                                  Show in my feed
                                </Typography>
                              </Box>
                            </Box>
                          ) : (
                            <Box
                              onClick={() => {
                                setConfirmModalTypeAndPayload({
                                  type: CONFIRMATION_MODAL_INFO.HIDE_POST_FROM_THIS_USER,
                                  payload: '',
                                  message: CONFIRMATION_MODAL_INFO.HIDE_POST_FROM_THIS_USER_MESSAGE,
                                  title: CONFIRMATION_MODAL_INFO.HIDE_POST_FROM_THIS_USER_TITLE,
                                  buttonName: CONFIRMATION_MODAL_INFO.HIDE_POST_FROM_THIS_USER_BUTTON,
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
                      )}
                    </Box>
                  )}
                </Box>
              </Box>

              {!profileDataById?.data?.friends && userId !== '' && matchesSmallScreen && (
                <Box sx={{ mt: '16px' }}>
                  <Button
                    variant="outlined"
                    sx={FriendsListsStyles.addCancelButton}
                    onClick={() =>
                      onFriendRequestHandle(
                        profileDataById?.data?.user?._id || '',
                        isFriendRequested ? 'cancel' : 'add',
                      )
                    }
                  >
                    {isFriendRequested ? 'Cancel Request' : 'Add Friend'}
                  </Button>
                </Box>
              )}

              {matchesSmallScreen &&
                profileDataById?.data?.friends &&
                profileDataById?.data?.friends?.status === 0 &&
                profileDataById?.data?.friends?.requester?._id === userId && (
                  <Box sx={FriendsListsStyles.respondButtonContainer}>
                    <Button
                      variant="contained"
                      sx={FriendsListsStyles.respondButton}
                      onClick={() => {
                        if (isFriendResponded) {
                          return;
                        } else {
                          onFriendRequestResponsetHandle(
                            profileDataById?.data?.friends?._id || '',
                            FRIENDS_STATUS.APPROVED,
                            false,
                          );
                        }
                      }}
                    >
                      {isFriendResponded ? 'Responded' : 'Confirm'}
                    </Button>
                    {!isFriendResponded && (
                      <Button
                        variant="outlined"
                        sx={FriendsListsStyles.deleteButton}
                        onClick={() =>
                          onFriendRequestResponsetHandle(
                            profileDataById?.data?.friends?._id || '',
                            FRIENDS_STATUS.REJECTED,
                            false,
                          )
                        }
                      >
                        Delete
                      </Button>
                    )}
                  </Box>
                )}

              {matchesSmallScreen &&
                profileDataById?.data?.friends &&
                profileDataById?.data?.friends?.status === 0 &&
                profileDataById?.data?.friends?.approver?._id === userId && (
                  <Box sx={{ mt: '16px' }}>
                    <Typography variant="subtitle2" sx={FriendsListsStyles.waitingText}>
                      {isFriendRequesteSent ? 'Wating for approval' : ''}
                    </Typography>
                    {profileDataById?.data?.friends?.status === FRIENDS_STATUS.PENDING && userId !== '' && (
                      <Box sx={{ mt: '16px' }}>
                        <Button
                          variant="outlined"
                          sx={FriendsListsStyles.addCancelButton}
                          onClick={() =>
                            onFriendRequestHandle(
                              profileDataById?.data?.user?._id || '',
                              isFriendRequesteSent ? 'cancel' : 'add',
                            )
                          }
                        >
                          {isFriendRequesteSent ? 'Cancel Request' : 'Add Friend'}
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}

              {showStats && userId === '' && (
                <Box
                  sx={userProfileShowStatus ? userProfile.userProfileStatusHolderWhite : userProfile?.userProfileHide}
                >
                  <Box sx={{ mt: '24px', width: '100%' }}>
                    {recordDataDetails?.data?.map((item, index) => {
                      return (
                        <Box key={index} sx={userProfile.userProfileStreakCommunity}>
                          <Typography variant="subtitle2">{item.title}</Typography>
                          <Typography variant="subtitle2" sx={{ color: '#0C72E0' }}>
                            {
                              //@ts-ignore
                              getValue(item)
                            }
                          </Typography>
                        </Box>
                      );
                    })}
                    {showUserDeactivateButton && (
                      <Box sx={userProfile.deactivateButtonContainer}>
                        <Typography
                          onClick={() => {
                            setConfirmModalTypeAndPayload({
                              type: CONFIRMATION_MODAL_INFO.DEACTIVATE_ACCOUNT,
                              payload: '',
                              message: CONFIRMATION_MODAL_INFO.DEACTIVATE_ACCOUNT_MESSAGE,
                              title: CONFIRMATION_MODAL_INFO.DEACTIVATE_ACCOUNT_TITLE,
                              buttonName: CONFIRMATION_MODAL_INFO.DEACTIVATE_BUTTON,
                            });
                            setShowConfirmationModal(true);
                          }}
                          variant="subtitle2"
                        >
                          Deactivate Account
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          <ConfirmationModal
            showModal={showConfirmationModal}
            setShowModal={setShowConfirmationModal}
            message={confirmModalTypeAndPayload?.message}
            modalAction={
              confirmModalTypeAndPayload?.type === CONFIRMATION_MODAL_INFO.DEACTIVATE_ACCOUNT
                ? handleDeactivateAccount
                : handleUnfriendOrHidePost
            }
            title={confirmModalTypeAndPayload?.title}
            buttonName={confirmModalTypeAndPayload?.buttonName}
          />
        </Card>
        {matchesScreen900 && router.pathname !== '/' && showSendPrayers && (
          <Box sx={{ ml: '16px' }}>
            <SendPrayers />
          </Box>
        )}

        {showCertificateDownloadOption && currentUserCompletedCourseData?.data?.[0]?.isCourseCompleted && (
          <Box
            sx={{
              p: '24px 16px',
              mt: '28px',
              border: '1px solid #E7E7EB',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Course Completed</Typography>
            <Box sx={{ mt: '24px', mb: '8px' }}></Box>
            <UnlockedBadgeIcon />
            <Typography variant="subtitle2"> You have unlocked the badge!</Typography>

            <Typography sx={{ mt: '36px', color: '#147AE9', fontWeight: 500, cursor: 'pointer' }} variant="button">
              {currentUserCompletedCourseData?.data?.[0]?.certificate?.completedUrl && (
                <a
                  style={{ color: '#147AE9', textTransform: 'none' }}
                  href={currentUserCompletedCourseData?.data?.[0]?.certificate?.completedUrl}
                >
                  Download the Certificate
                </a>
              )}
            </Typography>
          </Box>
        )}
        {showUnfriendMenu && (
          <Box
            onClick={() => setShowUnfriendMenu(false)}
            sx={{
              position: 'fixed',
              backgroundColor: 'transparent',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
            }}
          />
        )}
      </Box>
    </StickyDiv>
  );
};

export { UserProfile };
