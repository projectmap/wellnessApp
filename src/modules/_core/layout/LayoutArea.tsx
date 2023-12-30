import React from 'react';

import { useSelector } from 'react-redux';
import { useGetProfileQuery, useListScreenWithChildrenQuery, RootState, clearTokens } from '@newstart-online/sdk';

import { HeaderArea } from './header/HeaderArea';
import ServerError from '~/common-ui/ServerError';
import { getPermissionScreen } from '~/utils/helpers';
import { BottomNavigationArea } from './header/BottomNavigationArea';
import { HeaderWrapper } from '~/modules/_core/styles/HeaderWrapper';
import { LoaderArea } from '~/modules/_core/components/loaderPage/LoaderArea';
import { clearAllTokens } from '~/utils/authStore';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { ROUTE } from '~/config/routes';

export const LayoutArea = ({ children }: any) => {
  const headerRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const [headerHeight, setHeaderHeight] = React.useState(0);
  useGetProfileQuery();
  const { error } = useListScreenWithChildrenQuery();
  const screensData = useSelector((state: RootState) => state.persistStateSlice.screen);
  const profileData = useSelector((state: RootState) => state.persistStateSlice.userProfile);

  const allScreens: any = screensData || [];

  const handleLogout = async () => {
    try {
      clearAllTokens();
      dispatch(clearTokens());
      router.push(ROUTE.SIGN_IN);
    } catch (e) {
      console.error('[MePage] ', e);
    }
  };

  React.useEffect(() => {
    if (headerRef.current?.clientWidth) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
  }, [headerRef?.current?.clientHeight]);

  React.useEffect(() => {
    if (error) {
      handleLogout();
    }
  }, [error?.status]);

  const sortedScreen = [...allScreens]?.sort((a, b) => {
    if (a?.order && b?.order) {
      return a.order - b.order;
    }

    return 1;
  });

  const screens = profileData?.role?.permissions
    ? getPermissionScreen(profileData?.role?.permissions, sortedScreen)
    : [];

  if (!screensData || !profileData) {
    return <LoaderArea />;
  }

  if (error) {
    const message = error.status === 'FETCH_ERROR' ? <ServerError /> : error.error;

    return <h1>{message}</h1>;
  }

  return (
    <>
      <HeaderWrapper ref={headerRef}>
        <HeaderArea screens={screens} />
      </HeaderWrapper>
      <main
        style={{
          minHeight: `calc(100vh - ${headerHeight}px)`,
          marginTop: headerHeight,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {children}
      </main>
      <BottomNavigationArea screens={screens} />
    </>
  );
};
