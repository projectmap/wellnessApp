import { FC, MouseEventHandler } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';

import { CloseBtnModel, MyQRCode } from '~/icons';

interface Model {
  onClick?: MouseEventHandler;
}
const QRCodeModel: FC<Model> = ({ onClick }) => {
  return (
    <Paper
      sx={{
        pt: 3,
        pb: 6,
        pr: 4,
        pl: 4,
        borderRadius: '12px',
        width: '455px',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      elevation={0}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={onClick}>
          <CloseBtnModel />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 8, py: 8 }}>
        <Typography variant="h6" sx={{ pb: 2, pt: 2, width: '50%' }} align="center">
          My QR
        </Typography>
        <MyQRCode />
      </Box>
    </Paper>
  );
};
export { QRCodeModel };
