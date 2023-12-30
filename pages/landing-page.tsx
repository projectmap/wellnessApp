import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

import HeroSection from '~/modules/landing-page/HeroSection';
import LearnSection from '~/modules/landing-page/LearnSection';
import HowItWorks from '~/modules/landing-page/HowItWorks';
import Physicians from '~/modules/landing-page/Physicians';
import Footer from '~/modules/landing-page/Footer';

export default function DrawerAppBar() {
  return (
    <>
      <HeroSection />
      <LearnSection />
      <HowItWorks />
      <Physicians />
      <Footer />
    </>
  );
}
