import React, { FC } from 'react';
import { Link as MuiLink, LinkProps } from '@mui/material';
import Link, { LinkProps as NextLinkProps } from 'next/link';

export type DefaultLinkProps = {
  to: NextLinkProps['href'];
  target?: string;
  children?: React.ReactNode;
  muiLinkProps?: LinkProps;
  muiLinkSxProps?: LinkProps['sx'];
};
const DefaultLink: FC<DefaultLinkProps> = ({ children, to, muiLinkProps, muiLinkSxProps }) => {
  return (
    <Link href={to} passHref>
      <MuiLink
        variant="subtitle1"
        color="primary"
        underline="none"
        sx={{
          textTransform: 'capitalize',
          cursor: 'pointer',
          ...muiLinkSxProps,
        }}
        {...muiLinkProps}
      >
        {children}
      </MuiLink>
    </Link>
  );
};

export { DefaultLink };
