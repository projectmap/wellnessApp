import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Box, Stack } from '@mui/system';
import { useGetUser } from '~/utils/useGetUser';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { Avatar, Modal, Paper, Popover, Typography } from '@mui/material';

import { DeleteModal } from '../../modals/DeleteModal';
import { MessageIcon, MoreOptionsBlackIcon, RemoveUserFromGroupIcon, ViewProfileIcon } from '~/icons';
import {
  MESSAGE_GROUP,
  useAddRemoveUsersInMessageGroupMutation,
  useGetMessageGroupDetailsByIdQuery,
  useLeaveMessageGroupByGroupIdMutation,
} from '@newstart-online/sdk';
import { DefaultUserPhoto } from './DefaultUserPhoto';
import Image from 'next/image';
import { COMMUNITY_PAGE_ROUTING } from '~/state/constants';

interface IChatMembers {
  groupCreaterId?: string;
  imageSrc: string;
  username: string;
  userStatus: string | undefined | boolean;
  id: string;
  onClick?: MouseEventHandler;
  groupId: string;
  userColor?: string;
}

export const ChatMembers = ({
  groupCreaterId,
  imageSrc,
  username,
  userStatus,
  onClick,
  id,
  groupId,
  userColor,
}: IChatMembers) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [openRemoveMemberModal, setOpenRemoveMemberModal] = React.useState<boolean>(false);
  const router = useRouter();

  const user = useGetUser();
  const [leaveGroup, loading] = useLeaveMessageGroupByGroupIdMutation();
  const [chatLeaveMessage, setChatLeaveMessage] = useState('');
  const [deleteModalButtonText, setDeleteModalButtonText] = useState('');
  const [deleteModalTitle, setDeleteModalTitle] = useState('');

  useEffect(() => {
    if (id && username && user) {
      if (id === groupCreaterId) {
        setChatLeaveMessage(
          'You are the admin of this group chat. If you remove yourself, this group chat will be deleted. Are you sure you want to remove yourself and delete this group ?',
        );
        setDeleteModalButtonText('Leave');
        setDeleteModalTitle('Leave Group');
      } else if (username === user?.name) {
        setChatLeaveMessage('Are you sure you want to leave this group ?');
        setDeleteModalButtonText('Leave');
        setDeleteModalTitle('Leave Group');
      } else {
        setChatLeaveMessage(`Are you sure you want to remove ${username} ?`);
        setDeleteModalButtonText('Remove');
        setDeleteModalTitle('Remove Member');
      }
    }
  }, [id, username, user]);

  const ChatMembersRoutingOptions = ({ onRequestClose }: any) => {
    return (
      <Paper
        sx={{
          width: '200px',
          height: '100%',
          paddingX: '12px',
          paddingY: '16px',
          borderRadius: 1,
          border: '1px solid #F3F3F5',
          boxShadow: '0px 6px 18px 2px rgba(0, 0, 0, 0.04)',
        }}
        elevation={0}
        onClick={onRequestClose}
      >
        {groupChatCreatorByName && groupId ? (
          <Box
            sx={{ display: 'flex', alignItems: 'center', paddingY: '8px', cursor: 'pointer' }}
            onClick={() => {
              router?.push(`/user/community/chat/?group=${groupId}`);
              setAnchorEl(null);
            }}
          >
            <MessageIcon />
            <Typography sx={{ pl: '10px' }}>Message</Typography>
          </Box>
        ) : null}
        <Box
          sx={{ display: 'flex', alignItems: 'center', paddingY: '8px', cursor: 'pointer' }}
          onClick={() => router?.push(`${user?._id === id ? '/user/me/mePage/' : `/profile/${id}`}`)}
        >
          <ViewProfileIcon />
          <Typography sx={{ pl: '10px' }}>View Profile</Typography>
        </Box>
        {isUserGroupChatCreator && id !== user?._id && (
          <Box
            sx={{ display: 'flex', alignItems: 'center', paddingY: '8px', cursor: 'pointer' }}
            onClick={() => setOpenRemoveMemberModal(true)}
          >
            <Image src="/assets/icons/RemoveMemberFromGroup.png" alt="remove-member" width={24} height={24} />
            <Typography sx={{ pl: '10px' }}>Remove Member</Typography>
          </Box>
        )}

        {id === user?._id ? (
          <Box
            sx={{ display: 'flex', alignItems: 'center', paddingY: '8px', cursor: 'pointer' }}
            onClick={() => setOpenRemoveMemberModal(true)}
          >
            <Image src="/assets/icons/RemoveMemberFromGroup.png" alt="remove-member" width={24} height={24} />
            <Typography sx={{ pl: '10px' }}>Leave Group</Typography>
          </Box>
        ) : null}
      </Paper>
    );
  };

  const { data: getCurrentGroupChatDetails } = useGetMessageGroupDetailsByIdQuery(
    (router?.query?.group as string) || '',
    {
      skip: !router?.query?.group,
    },
  );

  const isUserGroupChatCreator =
    getCurrentGroupChatDetails?.data?.type === MESSAGE_GROUP.GROUP &&
    getCurrentGroupChatDetails?.data?.createdBy?._id === user?._id;

  const groupChatCreatorByName =
    getCurrentGroupChatDetails?.data?.type === MESSAGE_GROUP.GROUP &&
    username !== getCurrentGroupChatDetails?.data?.createdBy?.name;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverid = open ? 'userid' : undefined;

  const [removeMembersfromGroupChat] = useAddRemoveUsersInMessageGroupMutation();

  const handleRemoveUserFromGroupChat = () => {
    setOpenRemoveMemberModal(true);
    if (user?._id === id && isUserGroupChatCreator) {
      leaveGroup(router?.query?.group as string)
        .unwrap()
        .then((data) => {
          toast.success(data?.message);
          router.push(COMMUNITY_PAGE_ROUTING.CHAT);
        })
        .catch((data) => toast.error(data?.message));
    } else {
      removeMembersfromGroupChat({
        removingUser: [id],
        groupId: router?.query?.group as string,
        isRemoved: deleteModalButtonText === 'Remove' ? true : false,
      })
        .unwrap()
        .then((data) => toast.success(data?.message))
        .catch((data) => toast.error(data?.message));
    }
  };

  return (
    <Box
      component="div"
      sx={{
        py: 1.2,
        paddingRight: 2,
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mr: '9px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {imageSrc ? (
            <Avatar alt={username} src={imageSrc} sx={{ width: '48px', height: '48px' }} />
          ) : (
            <DefaultUserPhoto
              userName={username && username}
              fontNewSize={{ fontSize: '16px' }}
              sx={{
                background: `${userColor}`,
                width: '48px',
                height: '48px',
              }}
            />
          )}
          <Stack sx={{ pl: 1.3 }}>
            <Typography variant="body1" sx={{ fontWeight: '600', color: '#131336' }} textTransform="capitalize">
              {username || 'No Name'}
            </Typography>
            {groupChatCreatorByName && (
              <Typography variant="subtitle2" textTransform="capitalize" sx={{ opacity: '0.8', color: '#131336' }}>
                {`Added by ${getCurrentGroupChatDetails?.data?.createdBy?.name}`}
              </Typography>
            )}
          </Stack>
        </Box>
        <MoreOptionsBlackIcon onClick={handleClick} aria-describedby={popoverid} />
      </Box>

      <Popover
        id={popoverid}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        elevation={0}
      >
        <ChatMembersRoutingOptions onRequestClose={handleClose} />
      </Popover>
      {openRemoveMemberModal && (
        <Modal open={openRemoveMemberModal}>
          <DeleteModal
            buttonText={deleteModalButtonText}
            loading={loading?.isLoading}
            closeModal={() => setOpenRemoveMemberModal(false)}
            onDelete={() => handleRemoveUserFromGroupChat()}
            deteteModalTitle={deleteModalTitle}
            deleteMessage={chatLeaveMessage}
          />
        </Modal>
      )}
    </Box>
  );
};
