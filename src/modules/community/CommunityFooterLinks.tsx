import Link from 'next/link';
import { useState } from 'react';
import { Box } from '@mui/system';
import { Theme } from '@mui/system';
import { Button, Link as MuiLink, Modal, Stack, SxProps } from '@mui/material';
import { GetMobileAppModel } from '~/modules/_core/bits/modals/GetMobileAppModel';

interface ICommunityFooterLinks {
  sx?: SxProps<Theme> | undefined;
}

const CommunityFooterLinks = ({ sx }: ICommunityFooterLinks) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingTop: '32px',
        paddingBottom: '24px',
        ...sx,
      }}
    >
      <Stack direction="row" spacing={8} alignItems="center" marginRight="32px">
        <Link href="/privacy-policy" passHref>
          <MuiLink
            variant="body2"
            underline="none"
            sx={{
              textTransform: 'none',
              cursor: 'pointer',
              opacity: 0.7,
              color: '#000',
            }}
          >
            Privacy policy
          </MuiLink>
        </Link>
        <Link href="/terms-and-conditions" passHref>
          <MuiLink
            variant="body2"
            underline="none"
            sx={{
              textTransform: 'none',
              cursor: 'pointer',
              opacity: 0.7,
              color: '#000',
              mb: 2,
            }}
          >
            Terms and conditions
          </MuiLink>
        </Link>
      </Stack>
      <Stack direction="row" spacing={7} alignItems="center" justifyContent="flex-start">
        <Button
          onClick={handleOpen}
          sx={{
            textTransform: 'none',
            cursor: 'pointer',
            opacity: 0.7,
            color: '#000',
            p: 0,
          }}
        >
          Get mobile app
        </Button>

        <Link href="/about" passHref>
          <MuiLink
            variant="body2"
            underline="none"
            sx={{
              textTransform: 'none',
              cursor: 'pointer',
              opacity: 0.7,
              color: '#000',
            }}
          >
            About
          </MuiLink>
        </Link>
      </Stack>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-post" aria-describedby="post something">
        <GetMobileAppModel onClick={handleClose} />
      </Modal>
    </Box>
  );
};

export { CommunityFooterLinks };
