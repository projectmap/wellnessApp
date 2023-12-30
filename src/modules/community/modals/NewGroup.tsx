import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Avatar, Chip, Typography } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

import { useAppSelector, useAppDispatch } from '~/state/app/hooks';
import { LoadingBtn } from '~/modules/_core/bits/buttons/LoadingBtn';
import { GenericModal } from '~/modules/_core/bits/modals/DragableModal';
import { SearchBarWithIcon } from '~/modules/_core/bits/textfields/SearchBarWithIcon';
import { DefaultUserPhoto } from '~/modules/community/components/Chat/DefaultUserPhoto';
import {
  setGroupChat,
  setIsGroupCreated,
  setNewGroupModal,
  setNewGroupName,
  setNewChatModal,
} from '~/state/services/chats/chatSlice';
import {
  IFriendsResponse,
  IUser,
  useAddRemoveUsersInMessageGroupMutation,
  useGetMessageGroupDetailsByIdQuery,
  useListPaginatedCurrentUserFriendsQuery,
} from '@newstart-online/sdk';

export const NewGroup = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [searchFriends, setSearchFriends] = useState<string>('');
  const [isFriendSelected, setIsFriendSelected] = useState<boolean>(false);

  const newGroup = useAppSelector((state) => state.chats.newGroupModal);
  const addGroupMember = useAppSelector((state) => state.chats.addGroupMember);
  const usersToAddToGroupChat = useAppSelector((state) => state.chats.groupChatInfo);
  const [element, setElement] = useState<any>();
  const [refVisible, setRefVisible] = useState(false);
  const [page, setPage] = React.useState<number>(1);
  const [paginatedFriendList, setPaginatedFriendList] = useState<IFriendsResponse[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: friends } = useListPaginatedCurrentUserFriendsQuery({
    perPage: 10,
    page: page,
    search: searchFriends?.trim() === '' ? '' : searchFriends.trim(),
  });
  const { data: groupChatUsers } = useGetMessageGroupDetailsByIdQuery((router?.query?.group as string) || '', {
    skip: !router?.query?.group,
  });

  const handleClose = () => {
    dispatch(setNewGroupModal(false));
  };

  //function to run search query
  const runFriendsSearch = (e: any) => {
    setSearchFriends(e.target.value);
  };

  const allUsersInGroupChat = groupChatUsers?.data?.associatedUser?.map((user) => user?._id);
  const allFriends = friends?.data?.map((friend: IFriendsResponse) => friend) as string[];

  const friendsToAdd = allFriends?.filter((friend: any) => !allUsersInGroupChat?.includes(friend?.friend?._id));

  const [addMemberstoGroupChat, isLoading] = useAddRemoveUsersInMessageGroupMutation();

  // @returns list of friends to be added to the groupchat
  const handleFriendList = (friend: IUser) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    const { associatedUser } = usersToAddToGroupChat;

    setIsFriendSelected(checked);

    if (!usersToAddToGroupChat?.associatedUser?.some((item) => item?._id === friend?._id)) {
      dispatch(
        setGroupChat({
          associatedUser: [...(associatedUser || []), friend],
        }),
      );
    } else {
      handleRemoveFriendList(friend);
    }
  };

  //to remove friends from the selection
  const handleRemoveFriendList = (friend: IUser) => {
    const newAssociatedUser = usersToAddToGroupChat?.associatedUser?.filter((item) => item?._id !== friend?._id);
    dispatch(
      setGroupChat({
        associatedUser: [...(newAssociatedUser || [])],
      }),
    );
    if (newAssociatedUser?.length === 0) {
      setIsFriendSelected(false);
    }
  };

  //to add friends from the selection into the groupchat
  const handleAddFriendsToGroupChat = () => {
    const users = usersToAddToGroupChat?.associatedUser?.map((item) => item?._id);
    addMemberstoGroupChat({
      newUser: users as string[],
      groupId: router?.query?.group as string,
    })
      .unwrap()
      .then((data) => {
        toast.success(data?.message);
        dispatch(setNewGroupModal(false));
        dispatch(
          setGroupChat({
            associatedUser: undefined || [],
          }),
        );
      })
      .catch((data) => toast.error(data?.message));
  };

  // all the useEffects below are for paginated listed data or infinite scroll
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
      isOpen={newGroup}
      onCloseModal={handleClose}
      showCloseButton={false}
      closeModalCross={true}
      title={addGroupMember ? 'Add Group Members' : `New Group`}
      sx={{ width: '557px' }}
    >
      <SearchBarWithIcon onChange={runFriendsSearch} value={searchFriends} />
      {(usersToAddToGroupChat?.associatedUser?.length as number) !== 0 ? (
        <Box>
          <Typography variant="subtitle1" sx={{ my: 2 }}>
            {usersToAddToGroupChat?.associatedUser !== undefined ? ' Selected Friends' : ''}
          </Typography>

          <Box
            sx={{ mb: 2.5, display: 'flex', flexWrap: 'wrap', gap: 2, maxHeight: '100px', overflowY: 'scroll' }}
            className="hide-scrollbar"
          >
            {usersToAddToGroupChat?.associatedUser?.map((selectedFriends: IUser) => {
              return (
                <Chip
                  label={selectedFriends?.name}
                  variant="outlined"
                  size="medium"
                  sx={{
                    pl: 0.4,
                    pb: 0.2,
                  }}
                  key={selectedFriends?._id}
                  onDelete={() => handleRemoveFriendList(selectedFriends)}
                />
              );
            })}
          </Box>
        </Box>
      ) : null}
      <Box>
        <Typography variant="subtitle1" sx={{ my: 2 }}>
          Recent
        </Typography>
        <Box
          className="hide-scrollbar"
          sx={{ maxHeight: '300px', overflowY: 'scroll' }}
          id="bottom"
          ref={(el) => {
            bottomRef?.current === el;
            setRefVisible(!!el);
          }}
        >
          {searchFriends?.trim() !== '' && friends?.data?.length === 0 ? (
            <Typography variant="subtitle2" sx={{ color: 'red' }}>
              Sorry! no result found.
            </Typography>
          ) : null}
          {(addGroupMember ? friendsToAdd : paginatedFriendList)?.map((item: any, idx: number) => {
            return (
              <Box sx={{ mb: 2.5 }} key={idx}>
                <label
                  key={item?.friend?._id}
                  style={{ display: 'flex', alignItems: 'center' }}
                  className="checkbox-container"
                >
                  <input
                    type="checkbox"
                    checked={
                      usersToAddToGroupChat?.associatedUser &&
                      usersToAddToGroupChat?.associatedUser?.some((selected) => selected?._id === item?.friend?._id)
                    }
                    onChange={handleFriendList(item?.friend)}
                  />
                  <span className="checkmark"></span>
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ ml: '8px' }}>
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
                    </Box>
                    <Typography variant="body1" sx={{ ml: 1, textTransform: 'capitalize' }}>
                      {item?.friend?.name ? item?.friend?.name : 'No Name'}
                    </Typography>
                  </Box>
                </label>
              </Box>
            );
          })}
        </Box>
      </Box>
      {!addGroupMember ? (
        <Box sx={{ display: 'flex' }}>
          <button
            onClick={() => {
              dispatch(setNewGroupModal(false));
              dispatch(setNewChatModal(true));
            }}
            type="button"
            style={{
              backgroundColor: 'transparent',
              color: '#147AE9',
              fontSize: '16px',
              marginRight: '24px',
              marginTop: '16px',
              cursor: 'pointer',
            }}
          >
            Back
          </button>
          <LoadingBtn
            sx={{
              borderRadius: '100px',
              background: '#147AE9',
              mt: '16px',
              padding: '10px 24px',
              color: '#FFFFFF',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
            onClick={() => {
              dispatch(setNewGroupName(true));
              dispatch(setNewGroupModal(false));
            }}
            loading={isLoading?.isLoading}
            disabled={
              usersToAddToGroupChat?.associatedUser === undefined || usersToAddToGroupChat?.associatedUser?.length < 1
            }
          >
            Continue
          </LoadingBtn>
        </Box>
      ) : (
        <LoadingBtn
          loading={isLoading?.isLoading}
          sx={{ borderRadius: '100px', background: '#147AE9', paddingY: '10px' }}
          onClick={() => {
            handleAddFriendsToGroupChat();
            dispatch(setIsGroupCreated(false));
          }}
          disabled={!isFriendSelected}
        >
          Add Members
        </LoadingBtn>
      )}
    </GenericModal>
  );
};
