import React from 'react';

import { Box, Stack } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Divider, IconButton, Link, Paper, Tooltip } from '@mui/material';

import Image from 'next/image';
import DownloadIcon from '@mui/icons-material/Download';

interface ImageBoxForChatMessageProps {
  closeModal: () => void;
  imageSrc: string;
}

const ImageBoxForChatMessage = ({
  closeModal,

  imageSrc,
}: ImageBoxForChatMessageProps) => {
  return (
    <Paper
      sx={{
        background: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        height: '100%',
      }}
    >
      <>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ pt: 3, pb: 4, pr: 3, pl: 4, width: '60%' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',

                alignSelf: 'center',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton onClick={() => closeModal()} sx={{ color: '#fff' }}>
                  <CloseIcon />
                </IconButton>
                <Link sx={{ color: '#fff', justifyContent: 'flex-end' }} href={imageSrc} download>
                  <Tooltip title="Download">
                    <DownloadIcon />
                  </Tooltip>
                </Link>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: 'calc(100vh - 100px);',
                  maxWidth: '100%',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box key={imageSrc}>
                    <Box sx={{ position: 'relative', height: 'calc(100vh - 100px);' }}>
                      <Image src={imageSrc} objectFit="contain" layout="fill" alt={'chat-message'} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    </Paper>
  );
};

export { ImageBoxForChatMessage };
