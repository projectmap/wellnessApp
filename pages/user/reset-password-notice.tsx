import { NextPage } from 'next';
import { Paper, Box, Typography } from '@mui/material';

import { ContainerWrapperArea } from '~/modules/_core/layout/containerWrapper/ContainerWrapperArea';

const ResetPasswordNotice: NextPage = () => {
  return (
    <ContainerWrapperArea>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 20,
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: 400,
            height: 400,
          },
        }}
      >
        <Paper elevation={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', padding: 10, color: 'blueviolet' }}>
            <Typography> A reset link is sent to your Email. </Typography>
            <Typography>Please, Check your inbox. </Typography>
          </Box>
        </Paper>
      </Box>
    </ContainerWrapperArea>
  );
};

export default ResetPasswordNotice;
