import moment from 'moment';
import Image from 'next/image';
import { Box } from '@mui/system';
import { IMessages } from './Types';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import Linkify from 'react-linkify';
import { Avatar, AvatarGroup, IconButton, Modal, Tooltip, Typography, Link } from '@mui/material';

import { DefaultUserPhoto } from './DefaultUserPhoto';
import { DeleteModal } from '../../modals/DeleteModal';
import DownloadIcon from '@mui/icons-material/Download';
import { MESSAGE_DELETED_TEXT } from '~/state/constants';

import { MessageDeleteIcon, MessageSeenIcon } from '~/icons';
import { useDeleteMessageMutation } from '@newstart-online/sdk';

export const MessagesSentByUser = ({ msg, isGroupChat, isLastMsg, setClickedImageSrc }: IMessages) => {
  const [deleteSingleMessage, isLoading] = useDeleteMessageMutation();
  const [showDeleteOption, setShowDeleteOption] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const handleDeleteMessage = (id: string) => {
    deleteSingleMessage({
      id: id,
    })
      .unwrap()
      .then((data) => {
        setDeleteModalVisible(false);
        setShowDeleteOption(false);

        toast.success(data?.message);
      })
      .catch((data) => toast.error(data?.message));
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '24px' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 0.5,
            width: '60%',
          }}
          onMouseLeave={() => {
            setShowDeleteOption(false);
          }}
        >
          {msg?.text && (
            <Box
              sx={{
                Width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                position: 'relative',
              }}
              onMouseLeave={() => {
                setShowDeleteOption(false);
              }}
            >
              <Linkify>
                <Typography
                  className="chat-message"
                  variant="body1"
                  sx={{
                    background: `${msg?.text === MESSAGE_DELETED_TEXT.DELETE_MSG ? '' : '#0C72E0'}`,
                    borderRadius: ' 16px 16px 0px 16px',
                    p: 1.5,
                    color: `${msg?.text === MESSAGE_DELETED_TEXT.DELETE_MSG ? '#717186' : '#FFF'}`,

                    fontSize: `${msg?.text === MESSAGE_DELETED_TEXT.DELETE_MSG ? '13px' : '16px'}`,
                    whiteSpace: 'pre-wrap',
                  }}
                  onMouseOver={() => {
                    msg?.text === MESSAGE_DELETED_TEXT.DELETE_MSG
                      ? setShowDeleteOption(false)
                      : setShowDeleteOption(true);
                  }}
                >
                  {msg?.text}
                </Typography>
              </Linkify>

              {showDeleteOption && (
                <Box
                  sx={{
                    bgcolor: '#000000B3',
                    padding: '10px',
                    borderRadius: '40px',
                    position: 'absolute',
                    bottom: '0',
                    left: '-64px',
                  }}
                >
                  <Typography sx={{ fontSize: '14px', fontWeight: 400, lineHeight: '12px', color: 'white' }}>
                    {moment(msg?.createdAt).fromNow()}
                  </Typography>
                </Box>
              )}

              {showDeleteOption && (
                <MessageDeleteIcon
                  onClick={() => setDeleteModalVisible(true)}
                  className="cursor-pointer"
                  style={{ marginTop: '5px' }}
                />
              )}
            </Box>
          )}
          <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: '20px', height: '20px', fontSize: '10px' } }}>
            {isGroupChat
              ? msg?.seenBy?.length !== 0 &&
                isLastMsg &&
                msg?.seenBy?.map((item) => {
                  return (
                    <>
                      {item?.photo?.completedUrl ? (
                        <Avatar
                          src={item?.photo?.completedUrl}
                          alt={item?.name}
                          sx={{ width: '20px', height: '20px' }}
                        />
                      ) : (
                        <DefaultUserPhoto
                          userName={item?.name}
                          key={item?._id}
                          sx={{ width: '20px', height: '20px', backgroundColor: item?.color }}
                          fontNewSize={{ fontSize: '10px' }}
                        />
                      )}
                    </>
                  );
                })
              : msg?.seenBy?.length !== 0 && isLastMsg && <MessageSeenIcon />}
          </AvatarGroup>
          {msg?.mediaFiles.length !== 0 ? (
            <Box sx={{ position: 'relative', mb: '16px' }}>
              {msg?.mediaFiles?.map((item, idx) => {
                return (
                  <Box
                    key={idx}
                    onMouseOver={() => {
                      setShowDeleteOption(true);
                    }}
                  >
                    {msg?.text === MESSAGE_DELETED_TEXT.DELETE_MSG ? (
                      <Typography sx={{ fontSize: '13px', color: '#717186' }}></Typography>
                    ) : (
                      <Box
                        sx={{
                          width: '236px',
                          height: '167px',
                          position: 'relative',
                          mb: 3,
                          cursor: 'pointer',
                        }}
                      >
                        {showDeleteOption && (
                          <Box sx={{ position: 'absolute', right: '-28px', top: '-12px' }}>
                            <IconButton sx={{ color: '#fff' }}>
                              <Link href={msg?.mediaFiles?.[idx].completedUrl} download>
                                <Tooltip title="Download">
                                  <DownloadIcon />
                                </Tooltip>
                              </Link>
                            </IconButton>
                          </Box>
                        )}

                        <Image
                          onClick={() =>
                            setClickedImageSrc && setClickedImageSrc(msg?.mediaFiles?.[idx].completedUrl || '')
                          }
                          style={{ borderRadius: '8px' }}
                          src={msg?.mediaFiles[idx].completedUrl}
                          width="100%"
                          height="80%"
                          objectFit="cover"
                          layout="responsive"
                          alt={msg?.mediaFiles[idx].completedUrl}
                          onMouseEnter={() => {
                            msg?.mediaFiles[idx].completedUrl === MESSAGE_DELETED_TEXT.DELETE_MSG
                              ? setShowDeleteOption(false)
                              : setShowDeleteOption(true);
                          }}
                        />
                        <Typography sx={{ color: '#9C9CA5', textAlign: 'left', fontSize: '9px' }}>
                          {moment(msg?.createdAt).fromNow()} ago
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}

              {showDeleteOption && (
                <Box sx={{ position: 'absolute', left: '-24px' }}>
                  <MessageDeleteIcon onClick={() => setDeleteModalVisible(true)} className="cursor-pointer" />
                </Box>
              )}
            </Box>
          ) : null}
        </Box>
        {deleteModalVisible && (
          <Modal open={open}>
            <DeleteModal
              buttonText="Delete"
              deteteModalTitle="Delete message?"
              deleteMessage="Are you sure you want to permanently delete this message?"
              closeModal={() => setDeleteModalVisible(false)}
              onDelete={() => handleDeleteMessage(msg?._id as string)}
              loading={isLoading?.isLoading}
            />
          </Modal>
        )}
      </Box>
    </>
  );
};
