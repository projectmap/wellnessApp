import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Link, { LinkProps as NextLinkProps } from 'next/link';
import { Container, Box, Link as MuiLink, useMediaQuery } from '@mui/material';
import {
  IScreenResponse,
  useLazyGetCurrentUserUnseenChatMessageCountQuery,
  useLazyListMessageListByGroupIdQuery,
} from '@newstart-online/sdk';

import { LogoWhite } from '~/icons';
import { iconHelper } from './iconsHelper';
import { useGetUser } from '~/utils/useGetUser';
import { showHeader } from '~/utils/pathChecker';
import { socketEnvironment } from '~/utils/socket-environment';
import { setOnlineUsers } from '~/state/services/chats/chatSlice';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';
import { SearchField } from '~/modules/_core/bits/searchField/SearchField';
import { NavigationLink } from '~/modules/_core/components/links/NavigationLink';
import { addNotification } from '~/state/services/notification/notificationSlice';

interface IHeaderProps {
  screens: IScreenResponse[];
}

export const HeaderArea: React.FC<IHeaderProps> = ({ screens }) => {
  const [searchMessage, setSearchMessage] = React.useState<string>();
  const [open, setOpen] = React.useState<boolean>(false);
  const { asPath } = useRouter();
  const router = useRouter();

  const user = useGetUser();
  const dispatch = useAppDispatch();
  const currentScreen = useAppSelector((state) => state.screens.currentScreen);
  const [getUnseenMessageCount, { data: unSeenMessageCount }] = useLazyGetCurrentUserUnseenChatMessageCountQuery();
  const [getMessageByGroupId, { data: messageByGroupId }] = useLazyListMessageListByGroupIdQuery();

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchMessage(e.currentTarget.value);
  };

  const onclick = (e: any) => {
    setOpen(true);
  };

  React.useEffect(() => {}, []);

  React.useEffect(() => {
    if (user) {
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_API_URL as string, socketEnvironment);

      socket.on('ConnectedUser' + user?._id, (data) => {
        dispatch(setOnlineUsers(data?.onLineUser));
      });
    }
  }, [dispatch, user]);

  const matchesLG = useMediaQuery('(max-width:1250px)');
  const matchesSmallTB = useMediaQuery('(max-width:820px)');
  const matchesSmallTB960 = useMediaQuery('(max-width:960px)');
  const dynamicStylesForSearchBar = {
    ...(matchesLG && { display: 'none' }),
  };
  const dynamicStylesForLogNsearchContainer = {
    ...(matchesLG && { width: '250px' }),
    ...(matchesSmallTB && { width: '150px' }),
  };
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_NOTIFICATION_URL as string, socketEnvironment);
    if (user) {
      socket.on(`notifications${user._id}`, (data) => {
        dispatch(addNotification(data));

        toast.success(`${data?.notifications?.actionBy?.name} ${data?.notifications?.message}`, {
          toastId: 'notification',
        });
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [dispatch, user]);

  React.useEffect(() => {
    getMessageByGroupId({ messageGroupId: router?.query?.group as string, page: 0, perPage: 10 } || '').then(() => {
      getUnseenMessageCount();
    });
    let socket: any;
    if (user) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_CHAT_RESPONSE_API_URL as string, socketEnvironment);

      socket.on(user?._id as string, (data: any) => {
        getMessageByGroupId({ messageGroupId: router?.query?.group as string, page: 0, perPage: 10 } || '').then(() => {
          getUnseenMessageCount();
        });
      });
    }

    return () => {
      socket?.disconnect();
    };
  }, [user]);

  const NavbarMenu = () => {
    return (
      <>
        <Box className="header__nav">
          <Box sx={{ display: 'flex' }}>
            {screens?.map((screen) => {
              const path = screen.path as NextLinkProps['href'];
              const { icon, activeIcon } = iconHelper(screen?.iconRef ?? '');
              if (matchesSmallTB960 && screen?.name === 'me') {
                return;
              }

              return (
                <NavigationLink
                  unSeenMessageCount={unSeenMessageCount}
                  screen={screen}
                  key={screen._id}
                  to={path}
                  icon={icon()}
                  activeIcon={activeIcon()}
                >
                  {screen.name}
                </NavigationLink>
              );
            })}
          </Box>
        </Box>
      </>
    );
  };

  return (
    <>
      {showHeader(asPath) && (
        <Box
          component="div"
          className="header__wrap"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10,
            background: '#fff',
            pt: 1.5,
          }}
        >
          <Box sx={{ borderBottom: ' 1px solid #E7E7EB', pb: 1 }}>
            <Container maxWidth="xl" sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', ...dynamicStylesForLogNsearchContainer }}>
                <Link href="/">
                  <a>
                    <LogoWhite />
                  </a>
                </Link>

                <SearchField
                  sx={{ ml: 5, ...dynamicStylesForSearchBar, position: 'relative' }}
                  searchText="Search for people, recipe or articles..."
                  handleChange={handleChange}
                  onClick={onclick}
                  open={open}
                  setOpen={setOpen}
                  searchMessage={searchMessage}
                />
              </Box>

              <NavbarMenu />
            </Container>
          </Box>
          {Boolean(currentScreen?.subScreens?.length) && (
            <Box sx={{ borderBottom: ' 1px solid #E7E7EB', background: '#F4F5FC' }}>
              <Container maxWidth="xl" className="header__sub-nav">
                <Box sx={{ height: '50px', display: 'flex', alignItems: 'center' }}>
                  {[...(currentScreen?.subScreens || [])]
                    ?.sort((a, b) => a?.order - b?.order)
                    ?.map((screen) => (
                      <Link href={screen.path} key={screen._id}>
                        <Box display="flex">
                          <MuiLink
                            variant="subtitle1"
                            underline="none"
                            sx={{
                              textTransform: 'capitalize',
                              color: `${asPath.includes(screen.path) ? '#131336' : '#717186'}`,
                              px: '10px',
                              cursor: 'pointer',
                              pt: 1.5,
                              pb: '13px',
                              borderBottom: `2px solid ${asPath.includes(screen.path) && '#147AE9'}`,
                            }}
                          >
                            {screen.name}
                          </MuiLink>
                          {unSeenMessageCount?.data?.unseenChat && screen.name === 'chat' && (
                            <Box sx={{ height: '24px', position: 'relative' }}>
                              {
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: '2px',
                                    right: '-8px',
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
                              }
                            </Box>
                          )}
                        </Box>
                      </Link>
                    ))}
                </Box>
              </Container>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};
