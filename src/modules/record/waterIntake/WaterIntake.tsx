import { FC, useState } from 'react';
import { DatePicker } from '@mui/lab';
import { useAppSelector } from '~/state/app/hooks';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Box, Slider, Stack, TextField, Typography } from '@mui/material';

import { WaterIntakeIcon } from '~/icons';

const WaterIntake: FC<{ id: string }> = ({ id }) => {
  // const recordCategory = useAppSelector((state) => state.recordCategory.data.find((item) => item.id === id));

  const [value, setValue] = useState<number>(80);
  const [dateValue, setDateValue] = useState<Date | null>(new Date());

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5">{'Demo'}</Typography>
        <WaterIntakeIcon />
      </Box>
      <Box>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            mask="mm"
            views={['month', 'day']}
            value={dateValue}
            onChange={(dateValue: any) => {
              setDateValue(dateValue);
            }}
            renderInput={(props: any) => <TextField {...props} helperText={'Hello'} />}
          />
        </LocalizationProvider>
      </Box>
      <Box>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <Typography variant="subtitle1">0</Typography>
          <Slider aria-label="litres" value={value} onChange={handleChange} size="medium" />
          <Typography variant="subtitle1">1Ltr</Typography>
        </Stack>
        <Typography
          variant="h5"
          sx={{
            mt: 7,
            mb: 6,
            textAlign: 'center',
          }}
        >
          {value} ML
        </Typography>
      </Box>
    </div>
  );
};

export { WaterIntake };
