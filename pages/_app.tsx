import Head from 'next/head';
import { ReactElement, useEffect } from 'react';
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { CacheProvider } from '@emotion/react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { NSProvider } from '@newstart-online/sdk';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, useMediaQuery } from '@mui/material';
import { ThemeProvider as StyledCompThemeProvider } from 'styled-components';

import '~/styles/index.css';
import theme from '~/styles/theme';
import { GlobalStyle } from '~/styles/globalStyles';
import createEmotionCache from '~/utils/createEmotionCache';

import { reducer } from '~/state/app/store';
import { AuthWrapper } from '~/auth/AuthWrapper';
import { apiUrl } from '~/config/variables';
import { getTokens } from '~/utils/authStore';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { HomeProfileArea } from '~/modules/homepage/homeProfile/HomeProfileArea';
import { GlobalListener } from '~/modules/_core/components/globalListener/GlobalListener';
import NewStartSmallScreen from '~/modules/_core/NewStartLayoutContainer/NewStartSmallScreen';
import { useRouter } from 'next/router';
import { ROUTE } from '~/config/routes';
// Client-side cache, shared for the whole session of the user in the browser.

const WrapperComp = (props: WrapperCompTypes): ReactElement => {
  const { Component, pageProps } = props;
  const router = useRouter();
  // const router = useRouter();
  // const lang = useSelector(({ settings }: RootState) => settings.lang);
  // const darkTheme = useSelector(
  //   ({ settings }: RootState) => settings.darkTheme
  // );
  const routes = [ROUTE.PRIVACY_POLICY, ROUTE.TERMS_AND_CONDITIONS];

  const cusTheme = theme({});

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

  const matchesSmallScreen = useMediaQuery('(max-width:766px)');
  const showSmallScreens = routes.includes(router.asPath);

  return (
    <>
      {matchesSmallScreen && showSmallScreens ? (
        <NewStartSmallScreen />
      ) : (
        <>
          <Head>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            <title>NEWSTART Lifestyle Programme</title>
          </Head>
          <ThemeProvider theme={cusTheme}>
            <StyledCompThemeProvider theme={cusTheme}>
              <CssBaseline />
              <GlobalStyle />
              <NextNProgress />
              <AuthWrapper>
                <NextNProgress
                  startPosition={0.4}
                  stopDelayMs={200}
                  height={3}
                  options={{ showSpinner: false, easing: 'ease' }}
                />
                <GlobalListener />
                <Elements stripe={stripePromise}>
                  <HomeProfileArea />
                  <Component {...pageProps} />
                </Elements>
              </AuthWrapper>
            </StyledCompThemeProvider>
          </ThemeProvider>
        </>
      )}
    </>
  );
};
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: any;
}

export default function MyApp(props: MyAppProps) {
  const { emotionCache = clientSideEmotionCache } = props;

  return (
    <NSProvider
      extraReducers={reducer}
      config={{
        baseURL: apiUrl,
        token: getTokens(),
      }}
    >
      <CacheProvider value={emotionCache}>
        <WrapperComp {...props} />
        <ToastContainer position="top-right" />
      </CacheProvider>
    </NSProvider>
  );
}
type WrapperCompTypes = {
  isRtl?: boolean;
  Component?: any;
  pageProps?: object;
};
