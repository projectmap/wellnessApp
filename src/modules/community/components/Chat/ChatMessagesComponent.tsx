import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/system';
import { useSelector } from 'react-redux';
import { Grid, Typography, useMediaQuery } from '@mui/material';

import { useGetUser } from '~/utils/useGetUser';
import ChatMessageInput from './ChatMessageInput';
import ChatMessageLists from './ChatMessageLists';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { AddGroupMembersIcon, GroupMembersIcon, EditGroupIcon } from '~/icons';
import {
  MESSAGE_GROUP,
  useGetMessageGroupDetailsByIdQuery,
  useListMessageListByGroupIdQuery,
  RootState,
} from '@newstart-online/sdk';
import {
  setAddGroupMember,
  setIsGroupCreated,
  setNewGroupModal,
  setNewGroupName,
  setShowChatInfoOnRightSide,
} from '~/state/services/chats/chatSlice';

export const ChatMessagesComponent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const persistUser = useSelector((state: RootState) => state.persistStateSlice.userProfile);
  const [isUsersFirstMessage, setisUsersFirstMessage] = React.useState<boolean>(false);

  const showChatInfoOnRightSide = useAppSelector((state) => state.chats.showChatInfoOnRightSide);

  const { data: getCurrentGroupChatDetails } = useGetMessageGroupDetailsByIdQuery(
    (router?.query?.group as string) || '',
    {
      skip: !router?.query?.group,
    },
  );

  const isGroupChat = getCurrentGroupChatDetails?.data?.type === MESSAGE_GROUP.GROUP;

  const handleChangeGroupName = () => {
    dispatch(setNewGroupName(true));
    dispatch(setIsGroupCreated(true));
  };

  const handleAddGroupMembersToGroupChat = () => {
    dispatch(setAddGroupMember(true));
    dispatch(setNewGroupModal(true));
  };

  const { data: chatList } = useListMessageListByGroupIdQuery(
    {
      messageGroupId: router?.query?.group,
    },
    { skip: !router?.query?.group },
  );

  const user = useGetUser();
  const matchesSmallDesktop = useMediaQuery('(max-width:1200px)');

  React.useEffect(() => {
    if (chatList?.data?.length === 0) {
      setisUsersFirstMessage(true);
    } else {
      setisUsersFirstMessage(false);
    }
  }, [chatList?.data?.length]);

  return (
    <Grid
      item
      xs={showChatInfoOnRightSide ? 5 : 8.4 && matchesSmallDesktop && 8}
      sx={{
        pt: 1.3,
        pb: 4,
        width: '66%',
        position: 'relative',
        left: '33.35%',
        height: 'calc(100% - 205px)', //205px is for header height
      }}
    >
      <Box
        sx={{
          paddingX: 2.3,
          marginBottom: '25px',
          marginTop: '82px',
        }}
      >
        {isGroupChat ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography textAlign="center" variant="subtitle1" sx={{ pb: 0.4 }}>
              {getCurrentGroupChatDetails?.data?.groupName}
            </Typography>

            {getCurrentGroupChatDetails?.data?.createdBy?._id === user?._id ? (
              <Stack direction="row" alignItems="center" justifyContent="center" gap="20px" sx={{ pt: 2 }}>
                <Box sx={{ cursor: 'pointer' }}>
                  <AddGroupMembersIcon onClick={handleAddGroupMembersToGroupChat} />
                  <Typography variant="subtitle2">Add</Typography>
                </Box>
                <Box sx={{ cursor: 'pointer' }}>
                  <GroupMembersIcon onClick={handleChangeGroupName} />
                  <Typography variant="subtitle2">Name</Typography>
                </Box>
                <Box sx={{ cursor: 'pointer' }}>
                  <EditGroupIcon
                    onClick={() => {
                      dispatch(setShowChatInfoOnRightSide(!showChatInfoOnRightSide));
                    }}
                  />
                  <Typography variant="subtitle2">Members</Typography>
                </Box>
              </Stack>
            ) : null}
          </Box>
        ) : chatList?.data?.length === 0 ? (
          <Typography textAlign="center" variant="subtitle1" sx={{ paddingY: 3 }}>
            {isUsersFirstMessage && 'Send your first message to'}
            <span style={{ textTransform: 'capitalize', paddingLeft: '3px' }}>
              {getCurrentGroupChatDetails?.data?.associatedUser?.find((item) => item._id !== persistUser._id)?.name}
            </span>
          </Typography>
        ) : null}
        <ChatMessageLists isGroupChat={isGroupChat} />
      </Box>
      <Box>
        <ChatMessageInput
          sx={{
            position: 'fixed',
            bottom: '0',
            backgroundColor: '#FFF',
            width: `${showChatInfoOnRightSide ? '41.4vw' : '67vw'}`,
          }}
        />
      </Box>
    </Grid>
  );
};
