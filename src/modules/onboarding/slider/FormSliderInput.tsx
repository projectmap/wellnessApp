import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Slider, Typography } from '@mui/material';

export const FormInputSlider = ({ name, control, setValue, unit, min, max }: any) => {
  const [sliderValue, setSliderValue] = React.useState(0);

  useEffect(() => {
    if (sliderValue) setValue(name, sliderValue);
  }, [sliderValue]);

  const handleChange = (event: any, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  useEffect(() => {
    if (unit === 'pound') {
      setSliderValue(sliderValue * 2.2046);
    } else if (unit === 'kg') {
      setSliderValue(sliderValue / 2.2046);
    } else if (unit === 'in') {
      setSliderValue(sliderValue / 0.0833);
    } else if (unit === 'foot') {
      setSliderValue(sliderValue / 12);
    }
  }, [unit]);

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState, formState }) => (
          <Slider
            value={sliderValue}
            onChange={handleChange}
            min={min}
            max={max}
            sx={{
              '& .MuiSlider-rail': {
                color: '#E7E7EB',
                borderRadius: '24px',
                height: '8px',
              },
              '& .MuiSlider-thumb': {
                backgroundColor: '#BBDCFF',
                height: '32px',
                width: '32px',
                border: '4px solid #147AE9',
              },
              '& .MuiSlider-track': {
                color: '#147AE9',
                borderRadius: '24px',
                height: '8px',
              },
              width: '100%',
              mt: 6,
            }}
          />
        )}
      />
      <Box sx={{ mt: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" sx={{ color: '#147AE9' }}>
          {Math.ceil(sliderValue)}
        </Typography>

        <Typography variant="h5" sx={{ ml: 0.5 }}>
          {unit}
        </Typography>
      </Box>
    </>
  );
};
