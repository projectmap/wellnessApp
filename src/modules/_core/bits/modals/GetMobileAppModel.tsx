import Image from 'next/image';
import { FC, MouseEventHandler } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';

import { AppStoreIcon, CloseBtnModel, PlayStoreIcon } from '~/icons';
import { Card } from '../cards';

interface Model {
  onClick?: MouseEventHandler;
}
const GetMobileAppModel: FC<Model> = ({ onClick }) => {
  return (
    <Card cardProps={{ className: 'centerDiv' }} cardSxProps={{ width: '560px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={onClick}>
          <CloseBtnModel />
        </IconButton>
      </Box>
      <Box>
        <Stack>
          <Typography variant="h5" sx={{ pb: 1.5, pt: 0.5, width: '70%' }}>
            Get our app and start your NEWSTART to better health today!.
          </Typography>
          {/* <Typography variant="body2" sx={{ mb: 2, width: '80%' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          </Typography> */}
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ height: '320px' }}>
            <IconButton
              sx={{
                p: 0,
                mb: 2,
                '&:hover': { backgroundColor: 'transparent' },
              }}
            >
              <AppStoreIcon />
            </IconButton>
            <IconButton sx={{ p: 0, '&:hover': { backgroundColor: 'transparent' } }}>
              <PlayStoreIcon />
            </IconButton>
          </Box>
          <div className="next-img-container">
            <Image src="/assets/images/tmp/MobileApp.png" alt="mobile app" layout={'fill'} objectFit={'contain'} />
          </div>
        </Box>
      </Box>
    </Card>
  );
};
export { GetMobileAppModel };
