import { Box } from '@mui/system';
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, CircularProgress, Typography } from '@mui/material';

import { useRouter } from 'next/router';
import { CreateGroupChatIcon } from '~/icons';
import { useAppSelector } from '~/state/app/hooks';
import { COMMUNITY_PAGE_ROUTING } from '~/state/constants';
import { DefaultUserPhoto } from '../components/Chat/DefaultUserPhoto';
import { GenericModal } from '~/modules/_core/bits/modals/DragableModal';
import { ButtonWithIcon } from '~/modules/_core/bits/buttons/IconButton';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { SearchBarWithIcon } from '~/modules/_core/bits/textfields/SearchBarWithIcon';
import { setAddGroupMember, setNewChatModal, setNewGroupModal } from '~/state/services/chats/chatSlice';
import { IFriendsResponse, useAppDispatch, useListPaginatedCurrentUserFriendsQuery } from '@newstart-online/sdk';

export const NewChat = () => {
  const [searchFriends, setSearchFriends] = useState<string>('');
  const [element, setElement] = useState<any>();
  const [refVisible, setRefVisible] = useState(false);
  const [page, setPage] = React.useState<number>(1);
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const newChat = useAppSelector((state) => state.chats.newChatModal);
  const { data: friends, isLoading } = useListPaginatedCurrentUserFriendsQuery({
    perPage: 10,
    page: page,
    search: searchFriends,
  });
  const [paginatedFriendList, setPaginatedFriendList] = useState<IFriendsResponse[]>([]);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setNewChatModal(false));
  };

  const runFriendsSearch = (e: any) => {
    setSearchFriends(e.target.value);
  };

  useEffect(() => {
    if (refVisible) {
      setElement(document?.getElementById('bottom'));
    }
  }, [refVisible]);

  useEffect(() => {
    function handleScroll() {
      if (element && element.scrollHeight - element.scrollTop === element.clientHeight) {
        setPage((prev) => prev + 1);
      }
    }

    if (element) {
      element.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [element, page]);

  useEffect(() => {
    if (friends?.data) {
      setPaginatedFriendList((prevData) => {
        return [...friends.data];
      });
    }
  }, [friends]);

  return (
    <GenericModal
      isOpen={newChat}
      onCloseModal={handleClose}
      showCloseButton={false}
      closeModalCross={true}
      title="New Chat"
    >
      <SearchBarWithIcon onChange={runFriendsSearch} value={searchFriends} />
      <ButtonWithIcon
        icon={<CreateGroupChatIcon />}
        onClick={() => {
          dispatch(setNewGroupModal(true));
          dispatch(setAddGroupMember(false));
          dispatch(setNewChatModal(false));
        }}
        sx={{ fontWeight: 700, marginY: 2, fontSize: '16px' }}
      >
        Create New Group
      </ButtonWithIcon>
      <Typography variant="subtitle1">Recent</Typography>
      <Box
        className="hide-scrollbar"
        sx={{ overflowY: 'scroll', height: '300px' }}
        ref={(el) => {
          bottomRef?.current === el;
          setRefVisible(!!el);
        }}
        id="bottom"
      >
        {paginatedFriendList?.map((item: IFriendsResponse, idx: number) => {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.3 }} key={idx}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {item?.friend?.photo?.completedUrl ? (
                  <Avatar
                    src={item?.friend?.photo?.completedUrl}
                    alt={item?.friend?.name}
                    sx={{ width: '36px', height: '36px' }}
                  />
                ) : (
                  <DefaultUserPhoto
                    userName={item?.friend?.name === undefined ? 'no name' : item?.friend?.name}
                    sx={{ width: '36px', height: '36px', backgroundColor: `${item?.friend?.color}` }}
                  />
                )}

                <Typography variant="body1" sx={{ ml: 1, textTransform: 'capitalize' }}>
                  {item?.friend?.name ? item?.friend?.name : 'No Name'}
                </Typography>
              </Box>
              <PrimaryButton
                onClick={() => router.push(`${COMMUNITY_PAGE_ROUTING.CHAT}/?group=${item?.group?._id}`)}
                sx={{
                  border: '1px solid #0C72E0',
                  background: 'none',
                  color: '#0C72E0',
                  fontSize: '14px',
                  fontWeight: 500,
                  paddingX: '24px',
                  paddingY: '10px',
                  '&:hover': {
                    color: '#FFF',
                  },
                }}
              >
                Message
              </PrimaryButton>
            </Box>
          );
        })}
        {isLoading ? <CircularProgress sx={{ color: '#F5F5F5' }} /> : null}
      </Box>
    </GenericModal>
  );
};
