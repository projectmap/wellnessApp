import { FC, useRef, useState } from 'react';

import { Box, DialogContent, Modal, Stack, Typography } from '@mui/material';

import { PrayerIcon } from '~/icons';
import { SendPrayerModel } from '~/modules/_core/bits/modals/SendPrayersModel';

import { Card } from '../_core/bits/cards';
import { Button } from '../_core/bits/buttons/Button';

const SendPrayers: FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Card
      cardContentSxProps={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 4,
        px: 4,
        background: '#F4F5FC',
      }}
    >
      <PrayerIcon />
      <Stack>
        <Typography variant="h3" align="center" sx={{ pb: 3, pt: 2, fontSize: '1.25rem', lineHeight: '1.65rem' }}>
          We’re happy to pray for you. Please share your prayer requests here.
        </Typography>
        <Box sx={{ textAlign: 'center' }}>
          <Button
            sx={{
              textTransform: 'capitalize',
              fontSize: '14px',
              background: '#0C72E0',
              paddingY: 1.5,
              paddingX: 3.5,
              borderRadius: '40px',
              whiteSpace: 'nowrap',
            }}
            onClick={handleOpen}
          >
            Send
          </Button>
        </Box>
      </Stack>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-post"
          aria-describedby="post something"
          tabIndex={0}
        >
          <DialogContent>
            <SendPrayerModel setOpen={setOpen} ref={ref} />
          </DialogContent>
        </Modal>
      </div>
    </Card>
  );
};

export { SendPrayers };
