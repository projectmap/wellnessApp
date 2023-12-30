import React, { FC } from 'react';
import { Box } from '@mui/system';
import Link, { LinkProps } from 'next/link';
import { Link as MuiLink } from '@mui/material';

interface Props {
  to: LinkProps['href'];
  linkText: string;
  icon: React.ReactNode;
}

export const LinkWithIcon: FC<Props> = ({ linkText, icon, to }) => {
  return (
    <div>
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
        <Link href={to} passHref>
          <MuiLink
            variant="button"
            underline="none"
            color="inherit"
            sx={{
              paddingLeft: 1.5,
              textTransform: 'capitalize',
              cursor: 'pointer',
            }}
          >
            {linkText}
          </MuiLink>
        </Link>
      </Box>
    </div>
  );
};
