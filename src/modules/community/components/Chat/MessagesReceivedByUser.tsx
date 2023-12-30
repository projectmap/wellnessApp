import React from 'react';
import moment from 'moment';
import Image from 'next/image';
import { IMessages } from './Types';
import { Box, Stack } from '@mui/system';
import Linkify from 'react-linkify';
import { Tooltip, Typography, IconButton, Link } from '@mui/material';

import UserOnlineAvartar from './UserOnlineStatusAvatar';
import DownloadIcon from '@mui/icons-material/Download';
import { DefaultUserPhoto } from '~/modules/community/components/Chat/DefaultUserPhoto';

export const MessagesReceivedByUser = ({ msg, setClickedImageSrc }: IMessages) => {
  const [showImageOptions, setShowImageOptions] = React.useState<boolean>(false);
  const [showMessageTime, setShowMessageTime] = React.useState(false);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          mt: '6px',
          mb: '24px',
          width: '60%',
        }}
      >
        <Stack direction="row" alignItems="end" spacing={1}>
          <Tooltip
            title={msg?.sentBy?.name}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: '#000000B3',
                  fontSize: '14px',
                  padding: '10px',
                  borderRadius: '40px',
                  fontWeight: '400',
                  textTransform: 'capitalize',
                },
              },
            }}
            placement="left-end"
          >
            <Box>
              {msg?.sentBy?.photo?.completedUrl ? (
                <UserOnlineAvartar src={msg?.sentBy?.photo?.completedUrl} sx={{ width: '40px', height: '40px' }} />
              ) : (
                <DefaultUserPhoto
                  userName={msg?.sentBy?.name}
                  fontNewSize={{ fontSize: '16px' }}
                  sx={{ backgroundColor: `${msg?.sentBy?.color}`, width: '40px', height: '40px' }}
                />
              )}
            </Box>
          </Tooltip>
          <Box>
            {msg?.text && (
              <Box
                onMouseOver={() => setShowMessageTime(true)}
                onMouseLeave={() => setShowMessageTime(false)}
                sx={{ position: 'relative' }}
              >
                <Linkify>
                  <Typography
                    className="chat-message-received"
                    variant="body1"
                    sx={{
                      background: 'transparent',
                      borderRadius: ' 16px 16px 16px 16px',
                      p: 1.5,
                      border: '1px solid #E7E7EB',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg?.text}
                  </Typography>
                </Linkify>
                {showMessageTime && (
                  <Box
                    sx={{
                      bgcolor: '#000000B3',
                      padding: '10px',
                      borderRadius: '40px',
                      position: 'absolute',
                      bottom: '0',
                      right: '-64px',
                    }}
                  >
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, lineHeight: '12px', color: 'white' }}>
                      {moment(msg?.createdAt).fromNow()}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {msg?.mediaFiles && (
              <>
                {msg?.mediaFiles?.map((item, idx) => {
                  return (
                    <Box
                      key={idx}
                      sx={{ width: '236px', height: '167px', position: 'relative', mb: 3, cursor: 'pointer' }}
                      onMouseOver={() => {
                        setShowImageOptions(true);
                      }}
                      onMouseLeave={() => {
                        setShowImageOptions(false);
                      }}
                    >
                      {showImageOptions && (
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
                        src={msg?.mediaFiles?.[idx].completedUrl}
                        width="100%"
                        height="80%"
                        objectFit="cover"
                        layout="responsive"
                        alt={msg?.mediaFiles?.[idx].completedUrl}
                      />
                    </Box>
                  );
                })}
              </>
            )}
          </Box>
        </Stack>
      </Box>
    </>
  );
};
