import React from 'react';
import { Box } from '@mui/system';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';

import { NewChat } from './modals/NewChat';
import { NewGroup } from './modals/NewGroup';
import { GroupName } from './modals/GroupName';
import Header from '~/modules/community/components/Chat/Header';
import { ChatMembersComponent } from '~/modules/community/components/Chat/ChatMembersComponents';
import { ChatMessagesComponent } from '~/modules/community/components/Chat/ChatMessagesComponent';
import { ChatGroupChatOrFriendList } from '~/modules/community/components/Chat/ChatFriendsListComponent';
import {
  MESSAGE_GROUP,
  useGetMessageGroupDetailsByIdQuery,
  useGetMessageGroupListsQuery,
  useListPaginatedCurrentUserFriendsQuery,
} from '@newstart-online/sdk';

const Chat = () => {
  const router = useRouter();

  //api calls
  const { data: friends } = useListPaginatedCurrentUserFriendsQuery({});

  const { data: messageGroups, isLoading: isMessageGroupsLoading } = useGetMessageGroupListsQuery({});

  const { data: getCurrentGroupChatDetails, isFetching } = useGetMessageGroupDetailsByIdQuery(
    (router?.query?.group as string) || '',
    {
      skip: !router?.query?.group,
    },
  );

  // redirect page from /chat to /chat?group=_id
  React.useMemo(() => {
    if (!router.query.group && messageGroups?.data?.length !== 0 && !isMessageGroupsLoading) {
      router.push(`/user/community/chat/?group=${messageGroups?.data?.[0]?._id} `);
    }
  }, [messageGroups?.data, router, isMessageGroupsLoading]);

  return (
    <>
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          maxWidth: '2160px',
          marginX: 'auto',
          position: 'absolute',
          left: 0,
          right: 0,
          display: `${friends?.data?.length === 0 && 'none'}`, //hide the chatpage content if user has no friends
        }}
      >
        <Header getCurrentGroupChatDetails={getCurrentGroupChatDetails} isFetching={isFetching} />
        <Grid container sx={{ position: 'relative' }}>
          {/* component on the left side of chat page */}
          <ChatGroupChatOrFriendList />
          {/* component on the middle of chat page */}
          <ChatMessagesComponent />
          {/* component on the right side of chat page */}
          <ChatMembersComponent />
        </Grid>
      </Box>
      {/* new chat modal for creating private or groupchat */}
      <NewChat />
      {/* new group modal for creating  groupchat */}
      <NewGroup />
      {/* groupname modal for changing or creating  groupname */}
      <GroupName
        groupId={getCurrentGroupChatDetails?.data?.type === MESSAGE_GROUP.GROUP ? (router?.query?.group as string) : ''}
        groupName={getCurrentGroupChatDetails?.data?.groupName}
        members={getCurrentGroupChatDetails?.data?.associatedUser}
      />
    </>
  );
};

export { Chat };
