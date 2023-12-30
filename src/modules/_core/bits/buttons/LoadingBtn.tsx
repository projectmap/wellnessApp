import { FC } from 'react';
import { SxProps } from '@mui/material';
import { MouseEventHandler } from 'react';
import { Theme } from '@mui/system';
import { LoadingButton } from '@mui/lab';

interface ILoadingButton {
  children: string;
  onClick?: MouseEventHandler;
  sx?: SxProps<Theme> | undefined;
  loading: undefined | boolean;
  disabled?: boolean;
}

const LoadingBtn: FC<ILoadingButton> = ({ children, onClick, sx, loading, disabled }) => {
  return (
    <LoadingButton
      type="submit"
      variant="contained"
      disableElevation
      onClick={onClick}
      size="large"
      loading={loading}
      sx={{
        paddingY: 2,
        paddingX: 3.5,
        textTransform: 'capitalize',
        fontSize: '16px',
        background: '#0C72E0',
        ...sx,
      }}
      disabled={disabled}
    >
      {children}
    </LoadingButton>
  );
};

export { LoadingBtn };
