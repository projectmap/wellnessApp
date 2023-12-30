import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import ListItemIcon from '@mui/material/ListItemIcon';
import Link, { LinkProps as NextLinkProps } from 'next/link';
import { Link as MuiLink, Typography, useMediaQuery } from '@mui/material';

import { useRouter } from 'next/router';
import { ROUTE } from '~/config/routes';
import { useDispatch } from 'react-redux';
import { NavLinkProps } from './NavigationLink';
import { clearAllTokens } from '~/utils/authStore';
import { clearTokens } from '@newstart-online/sdk';
import { GIFT_CETIFICATE_ROUTING, ME_PAGE_ROUTING } from '~/state/constants';
import { setLoading } from '~/state/services/loader/globalLoaderSlice';

interface IDropDownLink extends NavLinkProps {
  title: string;
  isActive: boolean;
  onMenuItemClicked: (e: React.SyntheticEvent, href?: string) => void;
}

export default function DropDownLinks(props: IDropDownLink) {
  const { icon, title, children, activeIcon, isActive, onMenuItemClicked, screen } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();
  const router = useRouter();
  const { asPath } = router;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      clearAllTokens();
      dispatch(clearTokens());
      router.push(ROUTE.SIGN_IN);
      dispatch(setLoading(false));
    } catch (e) {
      console.error('[MePage] ', e);
    }
  };

  const matchesSmallTB = useMediaQuery('(max-width:960px)');

  const dynamicStylesForNavLink = {
    ...(matchesSmallTB && { fontSize: '12px' }),
  };

  return (
    <React.Fragment>
      <Tooltip title="Account settings">
        <MuiLink
          onClick={handleClick}
          variant="subtitle1"
          underline="none"
          className="nav--link"
          sx={{
            textTransform: 'capitalize',
            color: `${isActive ? 'primary.main' : '#AFB1BC'}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              cursor: 'pointer',
              ...dynamicStylesForNavLink,
            }}
          >
            {isActive ? activeIcon : icon}

            {children}
          </Box>
        </MuiLink>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {screen?.subScreens?.map((item) => {
          return (
            <Link href={'/'} key={item._id}>
              <MuiLink
                onClick={(e) => onMenuItemClicked(e, item.path)}
                variant="subtitle1"
                underline="none"
                sx={{
                  textTransform: 'capitalize',
                  color: `${asPath.includes(item.path) ? '#131336' : '#717186'}`,
                  cursor: 'pointer',
                  borderBottom: `2px solid ${asPath.includes(item.path) && '#147AE9'}`,
                }}
              >
                <MenuItem>
                  <Avatar /> {item.name}
                </MenuItem>
              </MuiLink>
            </Link>
          );
        })}

        {matchesSmallTB && (
          <Box
            onClick={(e) => {
              onMenuItemClicked(e, ME_PAGE_ROUTING.ME);
              router.push(ME_PAGE_ROUTING.ME);
            }}
            sx={{
              textTransform: 'capitalize',
              color: '#717186',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              p: '6px 16px',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.08)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar />
              <Typography
                sx={{
                  fontSize: '16px',
                  color: `${asPath.includes(ME_PAGE_ROUTING.ME) ? '#131336' : '#717186'}`,
                }}
              >
                Me
              </Typography>
            </Box>
          </Box>
        )}
        <Link href={GIFT_CETIFICATE_ROUTING.GIT_CARD}>
          <Box sx={{ display: 'flex', alignItems: 'center', m: '12px 16px 16px 12px', cursor: 'pointer' }}>
            <Typography
              sx={{
                fontSize: '16px',
                color: '#717186',
              }}
            >
              Gift Certificate
            </Typography>
          </Box>
        </Link>

        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
