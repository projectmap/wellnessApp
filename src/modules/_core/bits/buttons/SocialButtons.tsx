import React, { FC } from 'react';
import { Box } from '@mui/system';
import { Button } from '@mui/material';

interface Props {
  provider: any;
  icon: React.ReactNode;
  onClick: (provider: any) => Promise<void>;
}

export const SocialButtons: FC<Props> = ({ onClick, icon, provider }) => {
  return (
    <div onClick={() => onClick(provider)}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: 1,
          paddingBottom: 1,
          paddingLeft: 6,
          paddingTop: 3,
          borderColor: 'text.disabled',
        }}
      >
        {icon}

        <Button
          sx={{
            paddingLeft: 1.5,
            textTransform: 'capitalize',
            cursor: 'pointer',
            color: 'inherit',
          }}
        >
          {`Continue with ${provider}`}
        </Button>
      </Box>
    </div>
  );
};
