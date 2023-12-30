import React, { FC } from 'react';
import { Theme } from '@mui/system';
import { MouseEventHandler } from 'react';
import { Button, SxProps } from '@mui/material';

interface PrimaryBtn {
  children: React.ReactNode;
  onClick?: MouseEventHandler;
  sx?: SxProps<Theme> | undefined;
  type?: string;
  disabled?: boolean;
}

const PrimaryButton: FC<PrimaryBtn> = ({ children, onClick, sx, type, disabled }) => {
  return (
    <Button
      type={type}
      variant="contained"
      disableElevation
      onClick={onClick}
      size="medium"
      sx={{
        paddingY: 2,
        paddingX: 3.5,
        textTransform: 'capitalize',
        fontSize: '16px',
        background: '#0C72E0',
        ...sx,
      }}
      href=""
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export { PrimaryButton };
