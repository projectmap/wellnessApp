import { createTheme } from '@mui/material/styles';
import { darkPalette, lightPalette } from './palette';
export type customInitialProps = {
  darkTheme?: boolean;
};

export type ThemeExtended = customInitialProps;
// export type ThemeExtended = Theme & customInitialProps;
// Create a theme instance.
export default function theme({ darkTheme = false }: ThemeExtended) {
  let palette = darkTheme ? darkPalette : lightPalette;
  let styles = {
    palette,
    typography: {
      fontFamily: "'TT Commons Pro', sans-serif",
      fontWeightLight: 400,
      fontWeightRegular: 500,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      h1: {
        fontFamily: "'TT Commons Pro', sans-serif",
        fontWeight: 700,
        fontSize: '6rem',
        lineHeight: '115.2px',
        letterSpacing: '-1.445px',
      },
      h2: {
        fontFamily: "'TT Commons Pro', sans-serif",
        fontWeight: 700,
        fontSize: '3.750.0rem',
        lineHeight: '72px',
        letterSpacing: '-0.6px',
      },
      h3: {
        fontFamily: "'TT Commons Pro', sans-serif",
        fontWeight: 700,
        fontSize: '3rem',
        lineHeight: '64.4px',
        letterSpacing: '-0.6px',
      },
      h4: {
        fontFamily: "'TT Commons Pro', sans-serif",
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: '41.6px',
        letterSpacing: '-0.6px',
      },
      h5: {
        fontFamily: "'TT Commons Pro', sans-serif",
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: '31.2px',
        letterSpacing: '-0.005em',
      },
      h6: {
        fontFamily: "'TT Commons Pro', sans-serif",
        fontWeight: 700,
        fontSize: '1.25rem',
        lineHeight: '24px',
        letterSpacing: '-0.005em',
      },
      subtitle1: {
        fontFamily: "'TT Commons Pro', sans-serif",
        fontWeight: 700,
        fontSize: '1rem',
        lineHeight: '24px',
        letterSpacing: '0.0015em',
      },
      subtitle2: {
        fontFamily: "'TT Commons Pro', sans-serif",
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: '21px',
        letterSpacing: '0.001em',
      },
      body1: {
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: '24px',
        letterSpacing: '0.005em',
      },
      body2: {
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: '21px',
        letterSpacing: '0.01em',
      },
      button: {
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: '21px',
        letterSpacing: '0.0125em',
      },
      caption: {
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: '18px',
        letterSpacing: '0.06em',
      },
      overline: {
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
        fontSize: '0.625rem',
        lineHeight: '15px',
        letterSpacing: '0.1em',
      },
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiIconButton: {
        defaultProps: {
          disableFocusRipple: true,
        },
      },
    },
    overrides: {
      MuiDivider: {
        root: {
          height: '3px',
        },
      },
      MuiButton: {
        root: { textTransform: 'uppercase' },
      },
    },
  };

  return createTheme({ ...styles } as any); // TS_FIX_ME
}
