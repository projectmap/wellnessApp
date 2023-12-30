import * as React from 'react';
import { Box } from '@mui/system';
import { Avatar } from '@mui/material';
import Stack from '@mui/material/Stack';
import AddPhotoIcon from '~/assets/home/AddPhotoIcon';

export default function AvatarComponent() {
  const handleFileUpload = () => {
    document.getElementById('image-file')?.click();
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <form method="post">
        <input id="image-file" type="file" hidden />
      </form>
      <AddPhotoIcon style={{ cursor: 'pointer' }} onClick={() => handleFileUpload()} />
      <Avatar alt="O" src="./assets/icons/avatar2.png" sx={{ width: '50px', height: '50px' }} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2.51639px solid #FF4073',
          height: '76.75px',
          width: '76.75px',
          borderRadius: '50%',
        }}
      >
        <Avatar alt="H" src="./assets/icons/avatar1.png" sx={{ width: '60px', height: '60px' }} />
      </Box>

      <Avatar alt="A" src="./assets/icons/avatar8.png" sx={{ width: '50px', height: '50px' }} />
      <Avatar alt="N " src="./assets/icons/avatar3.png" sx={{ width: '50px', height: '50px' }} />
    </Stack>
  );
}
