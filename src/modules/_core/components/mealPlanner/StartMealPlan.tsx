import React from 'react';
import { Dayjs } from 'dayjs';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Backdrop, Paper, TextField, Typography } from '@mui/material';

import { CloseBlue } from '~/icons';
import { getNewDate } from '~/utils/getNewDate';
import { useStartUserMealPlanMutation } from '@newstart-online/sdk';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { StartMealPlanStyles } from '~/modules/_core/styles/StartMealPlanStyles';

interface DatePickerInterface {
  status: boolean;
  isCustomMealPlan: boolean;
  setStatus: (status: boolean) => void;
  setOpenSelectedCalendar: (status: boolean) => void;
}

const StartMealPlan = ({ status, setStatus, setOpenSelectedCalendar, isCustomMealPlan }: DatePickerInterface) => {
  let d1 = new Date();
  let today = getNewDate(d1, 0);
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [dateButtonStatus, setDateButtonStatus] = React.useState(false);
  const handleChange = (newvalue: any) => {
    setValue(newvalue);
    setDateButtonStatus(true);
  };

  const [startDate] = useStartUserMealPlanMutation();

  const handleMealPlanStartDate = () => {
    startDate({
      startDate: value?.toDate().toISOString(),
      isCustom: isCustomMealPlan,
      days: 4,
    })
      .unwrap()
      .then((data: any) => toast.success(data.message))
      .catch((error: any) => toast.error(error.message));
  };

  return (
    <>
      <Backdrop open={status} sx={StartMealPlanStyles.backdrop}>
        <Paper sx={StartMealPlanStyles.startMealContainer}>
          <Box sx={{ ml: '110px' }}>
            <Typography variant="h6">Select diet start date</Typography>
            <Typography variant="body2" sx={StartMealPlanStyles.heading}>
              Please choose the day that you wish to begin your diet plan for 30 days.
            </Typography>
          </Box>
          <Box onClick={() => setStatus(false)} sx={StartMealPlanStyles.closeButton}>
            <CloseBlue />
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              label="Basic example"
              value={value}
              onChange={handleChange}
              renderInput={(params: any) => <TextField {...params} />}
              showToolbar={false}
              minDate={today}
              displayStaticWrapperAs="desktop"
            />
          </LocalizationProvider>
          <Box sx={StartMealPlanStyles.buttonContainer}>
            {dateButtonStatus && (
              <PrimaryButton
                onClick={() => {
                  setOpenSelectedCalendar(true);
                  setStatus(false);
                  handleMealPlanStartDate();
                }}
                sx={StartMealPlanStyles.primaryButton}
              >
                Done
              </PrimaryButton>
            )}
          </Box>
        </Paper>
      </Backdrop>
    </>
  );
};

export default StartMealPlan;
