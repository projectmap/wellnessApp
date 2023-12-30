import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Box, Stack } from '@mui/system';
import { Avatar, Grid, Typography, useMediaQuery } from '@mui/material';

import { useGetUser } from '~/utils/useGetUser';
import { ChatMembers } from './GroupChatMembers';
import { DefaultUserPhoto } from './DefaultUserPhoto';
import { AddGroupMembersIcon, GroupMembersIcon, ViewProfileIcon } from '~/icons';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { useGetUserLastActiveTime } from '~/utils/useGetUserLastActiveTime';
import { useGetPrivateChatMemberInfo } from '~/utils/useGetPrivateChatMemberInfo';
import {
  IMessageGroupResponse,
  IUser,
  MESSAGE_GROUP,
  useGetCurrentUserProfileDetailsQuery,
  useGetMessageGroupDetailsByIdQuery,
} from '@newstart-online/sdk';
import {
  setAddGroupMember,
  setIsGroupCreated,
  setNewGroupModal,
  setNewGroupName,
} from '~/state/services/chats/chatSlice';
import { ROUTE } from '~/config/routes';
import { deactivateUserName } from '~/utils/helpers';
import { DEACTIVATING_USER_IMAGE } from '~/state/constants';

export const ChatMembersComponent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showChatInfoOnRightSide = useAppSelector((state) => state.chats.showChatInfoOnRightSide);

  const { data: getCurrentGroupChatDetails } = useGetMessageGroupDetailsByIdQuery(
    (router?.query?.group as string) || '',
    {
      skip: !router?.query?.group,
    },
  );
  const { data: profileData } = useGetCurrentUserProfileDetailsQuery();

  const matchesSmallDesktop = useMediaQuery('(max-width:1200px)');

  const lastActiveAt = useGetUserLastActiveTime(getCurrentGroupChatDetails as IMessageGroupResponse, profileData);

  const isGroupChat = getCurrentGroupChatDetails?.data?.type === MESSAGE_GROUP.GROUP;

  const heightMatchesLg = useMediaQuery('(max-height:800px)');

  const handleChangeGroupName = () => {
    dispatch(setNewGroupName(true));
    dispatch(setIsGroupCreated(true));
  };

  const handleAddGroupMembersToGroupChat = () => {
    dispatch(setAddGroupMember(true));
    dispatch(setNewGroupModal(true));
  };

  const user = useGetUser();

  return (
    <>
      {showChatInfoOnRightSide && (
        <Grid
          item
          xs={matchesSmallDesktop ? 8 : 3}
          sx={{
            pl: 3,
            pt: 3.2,
            borderLeft: showChatInfoOnRightSide ? '1px solid #B8C5D080' : '',
            width: 'inherit',
            right: '0',
            marginX: 'auto',
            paddingTop: matchesSmallDesktop ? '90px' : '42.5px',
            background: '#FFF',
            position: 'fixed',
            height: '100vh',
          }}
        >
          <Box
            sx={{
              mb: 6,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {isGroupChat ? (
              getCurrentGroupChatDetails?.data?.groupImage ? (
                getCurrentGroupChatDetails?.data?.groupImage?.completedUrl ? (
                  <Avatar
                    alt={getCurrentGroupChatDetails?.data?.groupName}
                    src={getCurrentGroupChatDetails?.data?.groupImage?.completedUrl}
                    sx={{ width: '96px', height: '96px' }}
                  />
                ) : (
                  <DefaultUserPhoto
                    userName={getCurrentGroupChatDetails?.data?.groupName}
                    fontNewSize={{ fontSize: '32px' }}
                    sx={{
                      background: `${getCurrentGroupChatDetails?.data?.createdBy?.color}`,
                      width: '96px',
                      height: '96px',
                    }}
                  />
                )
              ) : (
                <DefaultUserPhoto
                  userName={getCurrentGroupChatDetails?.data?.groupName}
                  fontNewSize={{ fontSize: '32px' }}
                  sx={{
                    background: `${getCurrentGroupChatDetails?.data?.createdBy?.color}`,
                    width: '96px',
                    height: '96px',
                  }}
                />
              )
            ) : getCurrentGroupChatDetails?.data?.associatedUser?.find((item: IUser) => item._id !== user?._id)?.photo
                ?.completedUrl ? (
              <Image
                className="avatar"
                src={
                  getCurrentGroupChatDetails?.data?.associatedUser?.find((item: IUser) => item._id !== user?._id)
                    .isActive
                    ? getCurrentGroupChatDetails?.data?.associatedUser?.find((item: IUser) => item._id !== user?._id)
                        ?.photo?.completedUrl
                    : DEACTIVATING_USER_IMAGE
                }
                height={96}
                width={96}
                alt={
                  getCurrentGroupChatDetails?.data?.associatedUser?.find((item: IUser) => item._id !== user?._id)?.name
                }
              />
            ) : (
              <DefaultUserPhoto
                userName={
                  getCurrentGroupChatDetails?.data?.associatedUser?.find((item: IUser) => item._id !== user?._id)?.name
                }
                fontNewSize={{ fontSize: '32px' }}
                sx={{
                  background: `${
                    getCurrentGroupChatDetails?.data?.associatedUser?.find((item: IUser) => item._id !== user?._id)
                      ?.color
                  }`,
                  width: '96px',
                  height: '96px',
                }}
                isActive={
                  getCurrentGroupChatDetails?.data?.associatedUser?.find((item: IUser) => item._id !== user?._id)
                    ?.isActive
                }
              />
            )}
            {isGroupChat ? (
              <Stack direction="column">
                <Typography variant="h5" textTransform="capitalize" textAlign="center" sx={{ mt: 2, mb: 1 }}>
                  {getCurrentGroupChatDetails?.data?.groupName}
                </Typography>
              </Stack>
            ) : (
              <Box>
                <Typography variant="h5" textTransform="capitalize" textAlign="center" sx={{ mt: 2, mb: 1 }}>
                  {getCurrentGroupChatDetails?.data?.associatedUser?.find((item: IUser) => item._id !== user?._id)
                    ?.isActive
                    ? getCurrentGroupChatDetails?.data?.associatedUser?.find((item: IUser) => item._id !== user?._id)
                        ?.name
                    : deactivateUserName}
                </Typography>
                {getCurrentGroupChatDetails?.data?.associatedUser?.find((item: IUser) => item._id !== user?._id)
                  ?.isActive && <Typography textAlign="center">{`Last Active : ${lastActiveAt}`}</Typography>}
                {getCurrentGroupChatDetails?.data?.associatedUser?.find((item: IUser) => item._id !== user?._id)
                  ?.isActive && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingY: '8px',
                      cursor: 'pointer',
                      justifyContent: 'center',
                    }}
                    onClick={() =>
                      !isGroupChat &&
                      router?.push(
                        `${ROUTE.PROFILE}${
                          getCurrentGroupChatDetails?.data?.associatedUser?.find(
                            (item: IUser) => item._id !== user?._id,
                          )?._id
                        }`,
                      )
                    }
                  >
                    <Typography sx={{ color: '#1C89FF' }} textAlign="center">
                      View Profile
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {isGroupChat && getCurrentGroupChatDetails?.data?.createdBy?._id === user?._id ? (
              <Stack direction="row" alignItems="center" justifyContent="center" gap="20px" sx={{ mt: 1 }}>
                <Box sx={{ cursor: 'pointer' }}>
                  <AddGroupMembersIcon onClick={handleAddGroupMembersToGroupChat} />
                  <Typography variant="subtitle2">Add</Typography>
                </Box>
                <Box sx={{ cursor: 'pointer' }}>
                  <GroupMembersIcon onClick={handleChangeGroupName} />
                  <Typography variant="subtitle2">Name</Typography>
                </Box>
              </Stack>
            ) : null}
          </Box>
          {isGroupChat ? (
            <Typography variant="h6" sx={{ marginY: 2 }}>
              Chat members (
              {getCurrentGroupChatDetails?.data?.associatedUser &&
                getCurrentGroupChatDetails?.data?.associatedUser?.filter((item) => item?.isActive)?.length}
              )
            </Typography>
          ) : null}
          {
            <Box
              className="hide-scrollbar"
              sx={{ overflowY: 'scroll', scrollbarWidth: 'none', height: `${heightMatchesLg ? '220px' : '350px'}` }}
            >
              <Stack>
                {isGroupChat &&
                  getCurrentGroupChatDetails?.data?.associatedUser?.map((member: any) => {
                    if (member?.isActive) {
                      return (
                        <ChatMembers
                          groupCreaterId={getCurrentGroupChatDetails?.data?.createdBy?._id}
                          id={member?._id}
                          imageSrc={member?.isActive ? member?.photo?.completedUrl : DEACTIVATING_USER_IMAGE}
                          userStatus={false}
                          username={member?.isActive ? member.name : deactivateUserName}
                          key={member?._id}
                          groupId={member?.group?._id}
                          userColor={member?.color}
                        />
                      );
                    }
                  })}
              </Stack>
            </Box>
          }
        </Grid>
      )}
    </>
  );
};
