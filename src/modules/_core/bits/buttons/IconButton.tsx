import React, { FC } from 'react';
import { Theme } from '@mui/system';
import { MouseEventHandler } from 'react';
import { Button, SxProps } from '@mui/material';

interface IconButton {
  children: string;
  onClick?: MouseEventHandler;
  icon: React.ReactNode;
  disabled?: boolean;
  sx?: SxProps<Theme> | undefined;
}

const ButtonWithIcon: FC<IconButton> = ({ children, onClick, icon, disabled, sx }) => {
  return (
    <Button
      disableElevation
      startIcon={icon}
      onClick={onClick}
      disabled={disabled}
      sx={{
        p: 0,
        fontSize: '14px',
        color: '#131336',
        textTransform: 'none',
        fontWeight: 600,
        justifyContent: 'start',
        '&.MuiButtonBase-root:hover': {
          bgcolor: 'transparent',
        },
        '&.MuiButtonBase-root': {
          padding: '0',
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export { ButtonWithIcon };
