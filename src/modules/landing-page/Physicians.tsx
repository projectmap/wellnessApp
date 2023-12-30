import { Container, Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { ROUTE } from '~/config/routes';

const physiciansLists = [
  {
    image: '/assets/images/homepage/p-1.png',
    descriptions: 'Dr. Roger Gallant is an emergency physician and the NEWSTART Medical Director.',
    name: 'Dr. Roger Gallant',
  },
  {
    image: '/assets/images/homepage/p-2.png',
    descriptions:
      'Dr. Randall L. Bivens has been the chief operating officer at Weimar Institute for the last six years.',
    name: 'Dr. Randall Bivens',
  },
  {
    image: '/assets/images/homepage/p-3.png',
    descriptions:
      'Dr. Kuninobu is a family medicine physician with an MPH degree in health promotion and health education.',
    name: 'Dr. Andrew Kuninobu',
  },
  {
    image: '/assets/images/homepage/p-4.png',
    descriptions:
      'Dr. Neil Nedley specializes in Internal Medicine with emphasis in Gastroenterology, Mental Health, and Lifestyle Medicine.',
    name: 'Dr. Neil Nedley',
  },
];

const Physicians = () => {
  const router = useRouter();

  return (
    <>
      <Container maxWidth="xl" sx={{ pt: '120px', pb: '164px' }}>
        <Typography sx={{ fontSize: '48px', fontWeight: 600, lineHeight: '57px' }} marginBottom="60px">
          Meet our Team of Physicians
        </Typography>
        <Box display="flex" justifyContent="space-between" gap="26px">
          {physiciansLists.map((item, index) => {
            return (
              <Box width="25%" key={index}>
                <Image width="258px" height="323px" src={item.image} />
                <Typography sx={{ fontSize: '25px', fontWeight: 700, lineHeight: '40px' }}>{item.name}</Typography>
                <Typography sx={{ fontSize: '18px', fontWeight: 400, lineHeight: '28px' }}>
                  {item.descriptions}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Container>
      <Box bgcolor="#4187F7" paddingY="80px">
        <Box display="flex" justifyContent="center">
          <Typography
            sx={{
              fontSize: '36px',
              fontWeight: 600,
              lineHeight: '43px',
              textAlign: 'center',
              width: '63%',
              color: 'white',
            }}
          >
            It’s never too early or too late to work towards becoming the healthiest you.
          </Typography>
        </Box>
        <Button
          sx={{
            color: '#4187F7',
            backgroundColor: 'white',
            borderRadius: '120px',
            paddingY: '14px',
            paddingX: '24px',
            textTransform: 'unset',
            fontSize: '18px',
            marginX: 'auto',
            display: 'flex',
            marginTop: '24px',
            '&.MuiButtonBase-root:hover': {
              bgcolor: 'white',
            },
          }}
          onClick={() => router.push(ROUTE.SIGN_IN)}
        >
          Get Started
        </Button>
      </Box>
    </>
  );
};

export default Physicians;
