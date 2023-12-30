import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/system';
import { Typography, Stack, Drawer } from '@mui/material';
import { IPresentersResponse } from '@newstart-online/sdk';

interface IPresenterDetailsSideBar {
  selectedPresenter: IPresentersResponse | undefined;
  openSideDrawer: boolean;
  toggleSideDrawer: () => void;
}

const PresenterDetailsSideBar: React.FC<IPresenterDetailsSideBar> = ({
  selectedPresenter,
  openSideDrawer,
  toggleSideDrawer,
}) => {
  return (
    <div>
      <Box sx={{ width: 250 }}>
        <Drawer open={openSideDrawer} anchor="right" onClose={toggleSideDrawer}>
          {selectedPresenter && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
              }}
            >
              <Box
                sx={{
                  width: '175px',
                  height: '175px',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '50%',
                  mb: 2,
                }}
              >
                <Image
                  width="73px"
                  height="73px"
                  layout="responsive"
                  src={selectedPresenter?.portrait?.completedUrl}
                  alt={selectedPresenter?.name}
                />
              </Box>
              <Stack>
                <Typography sx={{ fontWeight: '700' }} variant="h5" align="center">
                  {selectedPresenter?.name}
                </Typography>
                <Typography sx={{ fontWeight: '400', opacity: '0.8', mb: 3 }} variant="body1" align="center">
                  {selectedPresenter?.designation}
                </Typography>
                <Typography sx={{ fontWeight: '400', fontSize: '14px', opacity: '0.8', width: '350px' }}>
                  {selectedPresenter?.bio}
                </Typography>
              </Stack>
            </Box>
          )}
        </Drawer>
      </Box>
    </div>
  );
};

export default PresenterDetailsSideBar;
