import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { forwardRef, useState } from 'react';

import { Card } from '../cards';
import { CloseBtnModel, PrayerIcon } from '~/icons';
import { useCreatePrayerMutation } from '@newstart-online/sdk';
import { FIREBASE_EVENTS_ENUM } from '~/config/firebase.config';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import GoogleAnalytics from '~/common-ui/GoogleAnalytics/GoogleAnalytics';

interface Model {
  setOpen: (status: boolean) => void;
}

const SendPrayerModel = forwardRef<HTMLDivElement, Model>(({ setOpen }, ref) => {
  const [sendPrayers, { isLoading: messageSendInProgress }] = useCreatePrayerMutation();
  const [prayersMessage, setPrayersMessage] = useState('');
  const handleChange = (e: any) => {
    setPrayersMessage(e?.target?.value);
  };

  const handleSendPrayers = () => {
    // this condition checks for empty strings and whitespaces before hitting the api
    if (prayersMessage.trim().length !== 0) {
      sendPrayers({ message: prayersMessage.trim() })
        .unwrap()
        .then((data) => {
          toast.success(data.message);
          setOpen(false);
        })

        .catch((data) => toast.error(data.message));
    }
  };

  return (
    <GoogleAnalytics firebaseEvent={FIREBASE_EVENTS_ENUM.PRAYER_SEND}>
      <div ref={ref}>
        <Card cardProps={{ className: 'centerDiv' }} cardSxProps={{ width: '560px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => setOpen(false)}>
              <CloseBtnModel />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <PrayerIcon />
            <Typography variant="h5" sx={{ pb: 2, pt: 2, width: '50%' }} align="center">
              We want to hear from you..
            </Typography>
            <TextField
              id="filled-multiline-static"
              label="Please share your burdens and praises with us here."
              multiline
              rows={8}
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
                width: '75%',
              }}
              onChange={handleChange}
            />
            {prayersMessage?.trim()?.length !== 0 ? (
              <LoadingButton
                onClick={handleSendPrayers}
                variant="contained"
                disableElevation
                loading={messageSendInProgress}
                sx={{
                  mt: 4,
                  p: '16px 96px',
                  textTransform: 'capitalize',
                  fontSize: '16px',
                  background: '#0C72E0',
                  width: 'fit-content',
                  borderRadius: '40px',
                }}
              >
                send
              </LoadingButton>
            ) : (
              <LoadingButton
                onClick={handleSendPrayers}
                variant="contained"
                disabled
                disableElevation
                loading={messageSendInProgress}
                sx={{
                  mt: 4,
                  p: '16px 96px',
                  textTransform: 'capitalize',
                  fontSize: '16px',
                  background: '#0C72E0',
                  width: 'fit-content',
                  borderRadius: '40px',
                }}
              >
                send
              </LoadingButton>
            )}
          </Box>
        </Card>
      </div>
    </GoogleAnalytics>
  );
});

export { SendPrayerModel };
