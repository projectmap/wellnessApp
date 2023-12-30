import { FC, MouseEventHandler } from 'react';
import { Box, TextField } from '@mui/material';

import { PrayerIcon } from '~/icons';
import { Button } from '~/modules/_core/bits/buttons/Button';
import { PrayerModalWrapper } from '~/modules/_core/styles/PrayerModalWrapper';

interface Model {
  onClick?: MouseEventHandler;
}

export const PrayerModalArea: FC<Model> = () => {
  return (
    <PrayerModalWrapper>
      <Box className="wrap">
        <PrayerIcon />
        <h5 className="title">
          We want to <br /> hear from you..
        </h5>
        {/* <p className="para">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p> */}
        <form className="form">
          <Box>
            <TextField
              id="filled-multiline-static"
              placeholder="Please share your burdens and praises with us here."
              multiline
              fullWidth
              rows={8}
              className="text--field"
              variant="filled"
              sx={{
                opacity: 0.6,
                '& .MuiFilledInput-root': {
                  background: 'transparent',
                  border: '1px solid #A1A1AF',
                  borderRadius: '4px',
                },
                '& .MuiFilledInput-root:before': {
                  borderBottom: 'none',
                  content: 'none',
                },
                '& .MuiFilledInput-root:after': {
                  borderBottom: 'none',
                  content: 'none',
                },
              }}
            />
          </Box>
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button>Send</Button>
          </Box>
        </form>
      </Box>
    </PrayerModalWrapper>
  );
};
