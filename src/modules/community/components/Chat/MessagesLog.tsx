import React from 'react';
import { Box, Stack } from '@mui/system';
import { Typography } from '@mui/material';
import Linkify from 'react-linkify';
import { IMessages } from './Types';

// component to render MESSSAGELOGS from the backend like date on the middle of the chat
export const MessagesLog = ({ msg }: IMessages) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: '6px' }}>
        <Stack direction="row" alignItems="center" sx={{ maxWidth: '50%' }} spacing={1}>
          {msg?.text && (
            <Linkify>
              <Typography variant="subtitle2" sx={{ opacity: '0.5' }}>
                {msg?.text}
              </Typography>
            </Linkify>
          )}
        </Stack>
      </Box>
    </>
  );
};
