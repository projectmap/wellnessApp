import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import CourseLockIcon from '~/icons/lockIcon.svg';
export default function CourseVideoLockWithPopover() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button sx={{ p: 0, minWidth: 0 }} aria-describedby={id} onClick={handleClick}>
        <CourseLockIcon />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        elevation={1}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ boxShadow: '1px 1px 4px 0px rgba(0, 0, 0, 0.08)' }}
      >
        <Typography sx={{ p: 2, width: '226px', background: '#F4F5FC', color: '#5A5A72' }}>
          In order to view this lecture, it is necessary to watch all previous lectures in sequence.
        </Typography>
      </Popover>
    </div>
  );
}
