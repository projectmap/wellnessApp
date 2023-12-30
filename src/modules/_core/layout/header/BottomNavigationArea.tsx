import React from 'react';
import { Box } from '@mui/system';
import { LinkProps as NextLinkProps } from 'next/link';
import { BottomNavigation, Stack } from '@mui/material';

import { iconHelper } from './iconsHelper';
import { NavigationLink } from '../../components/links/NavigationLink';
import { IScreenResponse } from '@newstart-online/sdk';

interface IHeaderProps {
  screens: IScreenResponse[];
}

export const BottomNavigationArea: React.FC<IHeaderProps> = ({ screens }) => {
  const [value, setValue] = React.useState(0);
  const NavbarMenu = () => {
    return (
      <div>
        <Stack
          direction="row"
          spacing={6}
          alignItems="center"
          justifyContent="end"
          sx={{
            height: '100%',
            width: '100%',
          }}
        >
          {screens?.map((screen) => {
            const path = screen.path as NextLinkProps['href'];
            const { icon, activeIcon } = iconHelper(screen?.iconRef ?? '');

            return (
              <NavigationLink screen={screen} key={screen._id} to={path} icon={icon()} activeIcon={activeIcon()}>
                {screen.name}
              </NavigationLink>
            );
          })}
        </Stack>
      </div>
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: {
          xs: 'block',
          sm: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: '0.5px solid #E7E7EB',
        },
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
      >
        <NavbarMenu />
      </BottomNavigation>
    </Box>
  );
};
