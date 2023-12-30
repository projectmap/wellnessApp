import React, { ReactElement, useState } from 'react';

import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import {
  FRIENDS_STATUS,
  useCancelRequestFriendMutation,
  useGetProfileQuery,
  useListPaginatedReactionsQuery,
  useRequestFriendMutation,
} from '@newstart-online/sdk';
import { Avatar, Button, Divider, IconButton, Paper, Stack, Typography } from '@mui/material';

import { CloseBtnModel } from '~/icons';
import { useRouter } from 'next/router';
import { ROUTE } from '~/config/routes';
import { deactivateUserName } from '~/utils/helpers';
import { PrimaryButton } from '../_core/bits/buttons/PrimaryButton';
import { DefaultUserPhoto } from './components/Chat/DefaultUserPhoto';
import { DEACTIVATING_USER_IMAGE, DEFAULT_AVATAR } from '~/state/constants';

interface Props {
  closeModal: () => void;
  singleReactionId: string;
}

export function PrevReactions({ closeModal, singleReactionId }: Props): ReactElement {
  const [perPage, setPerPage] = useState(4);
  const [isSeeAll, setIsSeeAll] = useState(false);
  const [requestedFriend, setRequestedFriend] = useState<Array<string>>([]);
  const [requestCancelledFriend, setRequestCancelledFriend] = useState<Array<string>>([]);

  const { data: profileData } = useGetProfileQuery();
  const [requestFriend] = useRequestFriendMutation();
  const [cancelFriendRequest] = useCancelRequestFriendMutation();
  const { data: reactionData } = useListPaginatedReactionsQuery({ perPage: perPage, feedsId: singleReactionId });
  const router = useRouter();

  const handleSeeAllOrLessLikes = () => {
    if (isSeeAll) {
      setPerPage(4);
      setIsSeeAll(false);
    } else {
      setPerPage(reactionData?.totalData);
      setIsSeeAll(true);
    }
  };
  const onFriendRequestHandle = (id: string, addOrCancel: string) => {
    if (addOrCancel === 'add') {
      requestFriend({ requestingUserId: id, status: FRIENDS_STATUS.PENDING })
        .unwrap()
        .then((item) => {
          const _requestedFriend = [...requestedFriend];
          _requestedFriend.push(id);
          setRequestedFriend(_requestedFriend);

          const _requestCancelledFriend = [...requestCancelledFriend].filter((item) => item !== id);
          setRequestCancelledFriend(_requestCancelledFriend);
          toast.success('Friend request sent');
        });
    } else {
      cancelFriendRequest(id)
        .unwrap()
        .then(() => {
          const __requestCancelledFriend = [...requestCancelledFriend];
          __requestCancelledFriend.push(id);
          setRequestCancelledFriend(__requestCancelledFriend);

          const _requestedFriend = [...requestedFriend].filter((item) => item !== id);
          setRequestedFriend(_requestedFriend);
          toast.success('Friend request cancelled');
        })
        .catch((err) => toast.error(err?.data?.message));
    }
  };

  return (
    <Paper
      sx={{
        pt: 3,
        pb: 4,
        pr: 3,
        pl: 4,
        borderRadius: '12px',
        width: '560px',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Likes</Typography>
          <IconButton onClick={() => closeModal()}>
            <CloseBtnModel />
          </IconButton>
        </Box>
        <Box className="hide-scrollbar" sx={{ maxHeight: '370px', overflow: 'scroll', mt: '16px' }}>
          {reactionData &&
            reactionData?.data.map((reaction: any) => {
              return (
                <>
                  <Stack sx={{ width: '100%', marginTop: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        {reaction.reactedUser?.photo?.completedUrl ? (
                          <Avatar
                            alt={reaction?.reactedUser?.name}
                            src={
                              reaction?.reactedUser?.isActive
                                ? reaction.reactedUser?.photo?.completedUrl || DEFAULT_AVATAR
                                : DEACTIVATING_USER_IMAGE
                            }
                          />
                        ) : (
                          <DefaultUserPhoto
                            userName={reaction?.reactedUser?.name}
                            isActive={reaction?.reactedUser?.isActive}
                            sx={{
                              backgroundColor: reaction?.reactedUser?.color ? reaction?.reactedUser?.color : '#4CC4D9',
                            }}
                          />
                        )}

                        <Box
                          sx={{ borderRadius: 2, padding: 1, marginLeft: 1, cursor: 'pointer' }}
                          onClick={() =>
                            reaction?.reactedUser?.isActive && router.push(ROUTE.PROFILE + reaction?.reactedUser?._id)
                          }
                        >
                          <Typography sx={{ textTransform: 'capitalize' }}>
                            {reaction?.reactedUser?.isActive ? reaction?.reactedUser?.name : deactivateUserName}
                          </Typography>
                        </Box>
                      </Box>
                      {reaction?.reactedUser?.isActive &&
                      reaction?.reactedUser?.group?._id &&
                      reaction?.reactedUser?.friend?.status === FRIENDS_STATUS.APPROVED ? (
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ textTransform: 'capitalize', p: '3px 12px' }}
                          onClick={() =>
                            router.push('/user/community/chat/?group=' + reaction?.reactedUser?.group?._id)
                          }
                        >
                          Message
                        </Button>
                      ) : (
                        <>
                          {reaction?.reactedUser?.isActive &&
                          profileData?.data?._id !== reaction?.reactedUser?._id &&
                          reaction?.reactedUser?.friend?.status === FRIENDS_STATUS.PENDING &&
                          reaction?.reactedUser?.friend?.approver === reaction?.reactedUser?._id ? (
                            <PrimaryButton
                              onClick={() =>
                                onFriendRequestHandle(
                                  reaction?.reactedUser?._id,
                                  requestCancelledFriend.some((item) => item === reaction?.reactedUser?._id)
                                    ? 'add'
                                    : 'cancel',
                                )
                              }
                              sx={{ p: '4px 9px', fontSize: '13px' }}
                            >
                              {requestCancelledFriend.some((item) => item === reaction?.reactedUser?._id)
                                ? 'Add Friend'
                                : 'Cancel Request'}
                            </PrimaryButton>
                          ) : null}

                          {reaction?.reactedUser?.isActive &&
                          profileData?.data?._id !== reaction?.reactedUser?._id &&
                          !reaction?.reactedUser?.friend ? (
                            <PrimaryButton
                              onClick={() =>
                                onFriendRequestHandle(
                                  reaction?.reactedUser?._id,
                                  requestedFriend.some((item) => item === reaction?.reactedUser?._id)
                                    ? 'cancel'
                                    : 'add',
                                )
                              }
                              sx={{ p: '4px 9px', fontSize: '13px' }}
                            >
                              {requestedFriend.some((item) => item === reaction?.reactedUser?._id)
                                ? 'Cancel Request'
                                : 'Add Friend'}
                            </PrimaryButton>
                          ) : null}

                          {reaction?.reactedUser?.friend?.status === FRIENDS_STATUS.PENDING &&
                          reaction?.reactedUser?.friend?.approver === profileData?.data?._id ? (
                            <PrimaryButton
                              onClick={() =>
                                reaction?.reactedUser?.isActive &&
                                router.push(ROUTE.PROFILE + reaction?.reactedUser?._id)
                              }
                              sx={{ p: '4px 9px', fontSize: '13px' }}
                            >
                              View Profile
                            </PrimaryButton>
                          ) : null}
                        </>
                      )}
                    </Box>
                    <Divider sx={{ marginTop: 1 }} />
                  </Stack>
                </>
              );
            })}
        </Box>
        <Box sx={{ display: 'flex', justifyContents: 'center' }}>
          {perPage >= reactionData?.totalData && !isSeeAll ? null : (
            <Typography
              onClick={handleSeeAllOrLessLikes}
              sx={{ color: '#147AE9', m: '24px auto 0 auto', cursor: 'pointer' }}
            >
              {isSeeAll ? 'See Less' : 'See All'}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
