import React from 'react';

import { Stack, Typography } from '@mui/material';

import { SvgIcons } from '~/icons/svgIcons';
import { SvgIconName } from '~/utils/enums';

const NoNotification = () => {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      sx={{
        height: 'calc(100% - 42px);',
      }}
    >
      <SvgIcons iconName={SvgIconName.NO_NOTIFICATION} width={56} height={58} />
      <Typography variant="h6">No Notifications</Typography>
      <Typography variant="body2">{`You don't have any notification yet.`}</Typography>
    </Stack>
  );
};

export default NoNotification;
