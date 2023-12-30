import React from 'react';
import { Box } from '@mui/system';
import { Container, Grid, useMediaQuery } from '@mui/material';

import { StickyDiv, StickyDivForTbSection } from '~/modules/community/styles/StickyDiv';

interface INewStartContainer {
  leftItem?: any;
  rightItemSticky?: any;
  praySection?: any;
  midItem?: any;
  footerSection?: any;
  hasCommunityNavBar?: boolean;
}

export default function NewStartContainer({
  hasCommunityNavBar = false,
  leftItem,
  rightItemSticky,
  praySection,
  footerSection,
  midItem,
}: INewStartContainer) {
  const matchesSmallDesktopWidth = useMediaQuery('(max-width:1430px)');
  const matchesSmallDesktopHeight = useMediaQuery('(max-height:970px)');
  const matchesSmallTB900 = useMediaQuery('(max-width:900px)');
  const matchesSmallDesktop = matchesSmallDesktopWidth || matchesSmallDesktopHeight;

  return (
    <Container maxWidth="xl">
      <Grid
        container
        spacing={matchesSmallDesktop ? 3 : 4}
        justifyContent="space-between"
        sx={{ marginTop: hasCommunityNavBar ? 0 : '-32px' }}
      >
        {!matchesSmallTB900 && (
          <Grid item xs={matchesSmallDesktop ? 4 : 3}>
            {matchesSmallDesktop ? (
              <>
                <Box className="minWidth290">
                  {leftItem}
                  <Box className="marginTop24">
                    {rightItemSticky} {praySection}
                  </Box>
                </Box>
                <StickyDivForTbSection>{footerSection}</StickyDivForTbSection>
              </>
            ) : (
              <StickyDiv>{leftItem}</StickyDiv>
            )}
          </Grid>
        )}

        <Grid item xs={matchesSmallTB900 ? 12 : matchesSmallDesktop ? 7.8 : 6}>
          {midItem}
        </Grid>
        {!matchesSmallDesktop && (
          <Grid item xs={3}>
            {praySection}
            <StickyDiv>
              {rightItemSticky}
              {footerSection}
            </StickyDiv>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
