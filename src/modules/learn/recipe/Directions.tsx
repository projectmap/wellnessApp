import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Typography, Stack } from '@mui/material';
import { IInstructions } from '@newstart-online/sdk';

import { CheckCircle, CheckCircleBlue } from '~/icons';
interface IDirections {
  directions: IInstructions[];
}

export const Directions = (props: IDirections) => {
  const { directions } = props;

  const [selectedStep, setSelectedStep] = useState<any>({});

  return (
    <>
      <Typography component="h3" sx={{ fontSize: '20px', fontWeight: 700 }}>
        Directions
      </Typography>
      <Box sx={{ marginTop: '24px' }}>
        {directions.map((item, index) => {
          return (
            <div key={index}>
              <Stack direction="row">
                {selectedStep[index] ? (
                  <CheckCircleBlue
                    onClick={() => setSelectedStep((prevState: any) => ({ ...prevState, [index]: false }))}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <CheckCircle
                    onClick={() => setSelectedStep((prevState: any) => ({ ...prevState, [index]: true }))}
                    style={{ cursor: 'pointer' }}
                  />
                )}

                <Typography
                  sx={{
                    fontSize: '20px',
                    fontWeight: 700,
                    marginLeft: '16px',
                    opacity: `${selectedStep[index] ? '0.4' : '1'}`,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {item.title}
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 400,
                  marginTop: '16px',
                  mb: '32px',
                  opacity: `${selectedStep[index] ? '0.4' : '1'}`,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {item.descriptions}
              </Typography>
            </div>
          );
        })}
      </Box>
    </>
  );
};
