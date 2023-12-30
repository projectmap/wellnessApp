import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import React from 'react';
import { ConselorIcon, ExerciseNextIcon, NutritionNextIcon, HydroTherapyIcon, MedicalIcon } from '~/icons';

const howItWorksLists = [
  {
    title: 'Medical Supervision',
    icon: <MedicalIcon />,
    items: ['Health data monitor', '1 treadmill test', '2 blood tests'],
  },
  {
    title: 'Food and Nutrition',
    icon: <NutritionNextIcon />,
    items: ['Cooking instruction', 'Meal plan', 'Articles'],
  },
  {
    title: 'Exercise and Fitness',
    icon: <ExerciseNextIcon />,
    items: ['Fitness Center', 'Exercise Counselor', 'Wooded trails'],
  },
  {
    title: 'Hydrotherapy and Massage',
    icon: <HydroTherapyIcon />,
    items: ['Hydro therapy & massage sessions'],
  },
  {
    title: 'Counseling',
    icon: <ConselorIcon />,
    items: ['Private counselor'],
  },
];
const HowItWorks = () => {
  return (
    <Container maxWidth="xl" sx={{ pt: '120px' }}>
      <Box display="flex" flexWrap="wrap" gap="49px" justifyContent="center">
        {howItWorksLists.map((item, index) => {
          return (
            <Box width="30%" key={index}>
              {item.icon}
              <Typography sx={{ fontSize: '28px', lineHeight: '42px', fontWeight: '600' }}>{item.title}</Typography>
              <ul style={{ marginTop: '16px' }}>
                {item.items.map((li, index) => {
                  return (
                    <li
                      key={index}
                      style={{
                        fontSize: '25px',
                        lineHeight: '40px',
                        color: '#4A537F',
                        listStyleType: 'circle',
                        listStylePosition: 'inside',
                      }}
                    >
                      {li}
                    </li>
                  );
                })}
              </ul>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
};

export default HowItWorks;
