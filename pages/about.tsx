import { Box } from '@mui/system';
import type { NextPage } from 'next';
import { Container, Typography } from '@mui/material';

import { Logo } from '~/icons';

const AboutTheApp: NextPage = () => {
  return (
    <Box sx={{ background: '#E4E8F1', height: '100vh' }}>
      <Container maxWidth="xl" sx={{ pt: 7 }}>
        <Logo />
        <Typography variant="h5" sx={{ my: 4 }}>
          The path to transform your health begins today
        </Typography>
        <Typography variant="body2" sx={{ width: '70%', pb: 3 }}>
          For over 40 years, thousands of people have lookedfor simple, effective ways to take controlof their health
          and they’ve found it in NEWSTART.
        </Typography>
        <Typography variant="body2" sx={{ width: '70%', pb: 3 }}>
          This physician monitored, scientifically researched Replace the latin placeholder text with the suggested
          text.TClifestyle change program is based on Nutrition, Exercise, Water, Sunlight, Temperance, Air, Rest,and
          Trust. Today we’re offering those proven principles to you in a brand-new format designed tomeet your needs on
          your schedule.
        </Typography>
      </Container>
    </Box>
  );
};

export default AboutTheApp;
