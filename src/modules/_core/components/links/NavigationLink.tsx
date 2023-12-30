import React, { FC } from 'react';

import { useRouter } from 'next/router';
import Link, { LinkProps as NextLinkProps } from 'next/link';

import { Box, Link as MuiLink, useMediaQuery } from '@mui/material';

import { IScreenResponse, IChatMessageUnSeenMessageResponse } from '@newstart-online/sdk';

import { useGetUser } from '~/utils/useGetUser';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { setCurrentScreen } from '~/state/services/screen/screenSlice';
import { HEADER_WITH_SUB_HEADER, SCREEN_TYPE } from '~/state/constants';
import DropDownLinks from '~/modules/_core/components/links/DropDownLink';
import NotificationPopOver from '~/modules/_core/components/notification/components/NotificationPopOver';

export interface Screen extends IScreenResponse {
  type?: string;
}

export type NavLinkProps = {
  to: NextLinkProps['href'];
  target?: string;
  children?: React.ReactNode;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  screen?: Screen;
  unSeenMessageCount?: IChatMessageUnSeenMessageResponse | undefined;
};

const NavigationLink: FC<NavLinkProps> = (props) => {
  const { children, to, icon, activeIcon, screen, unSeenMessageCount } = props;
  const dispatch = useAppDispatch();
  const currentScreen = useAppSelector((state) => state.screens.currentScreen);
  const user = useGetUser();
  const router = useRouter();
  const currentPath = router.pathname;
  const isCommunity = currentPath.includes(HEADER_WITH_SUB_HEADER.COMMUNITY);
  const isLearnPage = currentPath.includes(HEADER_WITH_SUB_HEADER.LEARN);
  const isMePage = currentPath.includes(HEADER_WITH_SUB_HEADER.ME);
  const isMorePage = currentPath.includes(HEADER_WITH_SUB_HEADER.MORE);
  const isRecordPage = currentPath.includes(HEADER_WITH_SUB_HEADER.RECORD);

  let isActive = isCommunity ? String(to).includes(HEADER_WITH_SUB_HEADER.COMMUNITY) : currentPath === to;
  isActive = isLearnPage ? String(to).includes(HEADER_WITH_SUB_HEADER.LEARN) : isActive;
  isActive = isMePage ? String(to).includes(HEADER_WITH_SUB_HEADER.ME) : isActive;
  isActive = isMorePage ? String(to).includes(HEADER_WITH_SUB_HEADER.MORE) : isActive;
  isActive = isRecordPage ? String(to).includes(HEADER_WITH_SUB_HEADER.RECORD) : isActive;

  const matchesSmallTB = useMediaQuery('(max-width:960px)');
  const dynamicStylesForNavbar = {
    ...(matchesSmallTB && { fontSize: '12px' }),
  };

  // set active screen to global store if not exist
  if (isActive && screen && !currentScreen) {
    dispatch(setCurrentScreen(screen));
  }

  const handleClick = (e: React.SyntheticEvent, href?: string) => {
    e.preventDefault();
    dispatch(setCurrentScreen(screen));
    router.push(href ?? to);
  };

  if (screen?.name === HEADER_WITH_SUB_HEADER.MORE) {
    return (
      <DropDownLinks
        title="More"
        {...props}
        isActive={matchesSmallTB && isMePage ? true : isActive}
        onMenuItemClicked={handleClick}
      />
    );
  }

  if (screen?.type === SCREEN_TYPE.DROPDOWN) {
    return <NotificationPopOver title={screen.name} {...props} isActive={isActive} />;
  }

  return (
    <Link href={to} passHref>
      <MuiLink
        onClick={handleClick}
        variant="subtitle1"
        underline="none"
        className="nav--link"
        sx={{
          textTransform: 'capitalize',
          color: `${isActive ? 'primary.main' : '#AFB1BC'}`,
          ...dynamicStylesForNavbar,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            cursor: 'pointer',
          }}
        >
          <Box sx={{ height: '24px', position: 'relative' }}>
            {isActive ? activeIcon : icon}
            {unSeenMessageCount?.data?.unseenChat && screen?.name === SCREEN_TYPE.COMMUNITY && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-4px',
                  background: '#F18164',
                  width: '20px',
                  height: '20px',
                  borderRadius: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.525rem',
                  color: '#ffffff',
                }}
              >
                {unSeenMessageCount?.data?.unseenChat}
              </Box>
            )}
          </Box>
          {children}
        </Box>
      </MuiLink>
    </Link>
  );
};

export { NavigationLink };
