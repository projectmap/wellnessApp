import { FC } from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

const Button: FC<ButtonProps> = ({ children, onClick, size = 'medium', sx, ...props }) => {
  return (
    <MuiButton
      type="submit"
      variant="contained"
      disableElevation
      onClick={onClick}
      size={size}
      sx={{
        paddingY: 2,
        paddingX: 3.5,
        textTransform: 'capitalize',
        fontSize: '16px',
        background: '#0C72E0',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export { Button };
