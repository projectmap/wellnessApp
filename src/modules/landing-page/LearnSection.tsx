import React from 'react';
import { Typography, Box, Container, Button, List, ListItem, ListItemText } from '@mui/material';
import {
  DevotionTimeIcon,
  ExerciseIcon,
  NutritionIcon,
  SleepIcon,
  TimeOutsideIcon,
  TemperanceIcon,
  VitaminIcon,
  WaterIcon,
} from '~/icons/home-page';
import Image from 'next/image';
import { ArrowLineLeftIcon } from '~/icons';
import { useRouter } from 'next/router';

const newstartTypes = [
  {
    name: 'Nutrition',
    icon: <NutritionIcon />,
  },

  {
    name: 'Exercise',
    icon: <ExerciseIcon />,
  },
  {
    name: 'Water',
    icon: <WaterIcon />,
  },
  {
    name: 'Sunlight',
    icon: <VitaminIcon />,
  },
  {
    name: 'Temperance',
    icon: <TemperanceIcon />,
  },
  {
    name: 'Air',
    icon: <TimeOutsideIcon />,
  },
  {
    name: 'Rest',
    icon: <SleepIcon />,
  },
  {
    name: 'Trust',
    icon: <DevotionTimeIcon />,
  },
];

const listItems = [
  'Measure your performance.',
  'Connect with friends and share your adventure.',
  "Don't just track your adventure - Show it.",

  'Explore new routes and compete with a global community.',
  'More control over your mobility, your outlook, your life NOW',
  'Get customized meal plan',
  'Get personalized health suggestions from experts.',
];

const LearnSection = () => {
  const router = useRouter();

  return (
    <Container maxWidth="xl" sx={{ pt: '120px' }}>
      <Typography sx={{ textAlign: 'center', fontSize: '56px', lineHeight: '67px', fontWeight: '600' }}>
        The NEWSTART
      </Typography>
      <Box display="flex" justifyContent="center">
        <Typography sx={{ textAlign: 'center', fontSize: '25px', lineHeight: '40px', width: '60%' }}>
          NEWSTART is a physician monitored, scientifically researched lifestyle-change program based on eight
          fundamental principles proven to help you achieve optimum health:
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingY: '60px' }}>
        {newstartTypes.map((item, index) => {
          return (
            <Box key={index}>
              {item.icon}
              <Typography sx={{ textAlign: 'center' }}>{item.name}</Typography>
            </Box>
          );
        })}
      </Box>

      <Box display="flex" justifyContent="center">
        <Typography sx={{ textAlign: 'center', fontSize: '25px', lineHeight: '40px', width: '60%' }}>
          Discover keys to reverse diabetes, improve or even reverse heart disease, lower blood pressure, lose weight,
          improve overall quality of life, and much, much more!
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" marginTop="40px">
        <Button
          sx={{ textTransform: 'unset', fontSize: '20px' }}
          onClick={() => router.push('https://www.newstart.com')}
          endIcon={<ArrowLineLeftIcon />}
        >
          Lean more about NEWSTART
        </Button>
      </Box>

      <Box display="flex" justifyContent="space-between" marginTop="120px">
        <Image src="/assets/images/homepage/Frame-9.png" width="620px" height="552px" />
        <Box width="50%">
          <Typography sx={{ fontSize: '36px', lineHeight: '43px', fontWeight: 600 }}>
            Track and analyze every aspect of your activity.
          </Typography>
          <ul style={{ marginTop: '40px' }}>
            {listItems.map((value) => (
              <li
                key={value}
                style={{
                  fontSize: '25px',
                  lineHeight: '40px',
                  listStyleType: 'disc',
                  listStylePosition: 'inside',
                }}
              >
                {value}
              </li>
            ))}
          </ul>
        </Box>
      </Box>
    </Container>
  );
};

export default LearnSection;
