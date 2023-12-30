import { Dayjs } from 'dayjs';
import * as React from 'react';
import { Box } from '@mui/system';
import { CloseBlue } from '~/icons';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { getNewDate } from '~/utils/getNewDate';
import { Backdrop, Paper, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useStartUserMealPlanMutation } from '@newstart-online/sdk';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CustomMealModalStyles } from '~/modules/_core/styles/CustomMealModalStyles';

interface ICustomMealPlanModal {
  status: boolean;
  isCustomMealPlan: boolean;
  setStatus: (status: boolean) => void;
  setOpenSelectedCalendar?: (status: boolean) => void;
}

interface MealCycleInput {
  cycleNumber: number;
}

export default function CustomMealPlanModal({
  status,
  isCustomMealPlan,
  setStatus,
  setOpenSelectedCalendar,
}: ICustomMealPlanModal) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MealCycleInput>({ mode: 'onChange' });

  const { ref, ...rest } = register('cycleNumber', { required: true });

  const [startDate] = useStartUserMealPlanMutation();

  const handleMealPlanStartDate = (data: any) => {
    startDate({
      startDate: value?.toDate().toISOString(),
      isCustom: isCustomMealPlan,
      days: parseInt(data?.cycleNumber, 10),
    })
      .unwrap()
      .then((data: any) => {
        setOpenSelectedCalendar && setOpenSelectedCalendar(true);
        setStatus(false);
        toast.success(data.message);
      })
      .catch((error: any) => toast.error(error.message));
  };

  let d1 = new Date();
  let today = getNewDate(d1, 0);

  const [value, setValue] = React.useState<Dayjs | null>(null);

  const onKeyDown = (e: any) => {
    e.preventDefault();
  };

  return (
    <Backdrop open={status}>
      <Paper sx={CustomMealModalStyles.customMealModalContainer}>
        <Box onClick={() => setStatus(false)} sx={CustomMealModalStyles.closeButton}>
          <CloseBlue />
        </Box>

        <Typography variant="h6">Custom meal plan</Typography>
        <Typography variant="body1" sx={CustomMealModalStyles.startDateLabel}>
          Diet start date
        </Typography>
        <form onSubmit={handleSubmit(handleMealPlanStartDate)}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select start date"
              value={value}
              minDate={today}
              onChange={(newValue: any) => {
                setValue(newValue);
              }}
              renderInput={(params) => (
                <TextField onKeyDown={onKeyDown} sx={CustomMealModalStyles.textField} {...params} />
              )}
            />
          </LocalizationProvider>
          <Typography variant="body1" sx={CustomMealModalStyles.cycleNoLabel}>
            Create meal for
          </Typography>
          <Box sx={CustomMealModalStyles.cycleNoFieldWrapper}>
            <TextField
              inputRef={ref}
              {...rest}
              id="cycleNumber"
              name="cycleNumber"
              label="Enter number in days"
              variant="outlined"
              type="number"
              inputProps={{ max: 40, min: 1 }}
              sx={CustomMealModalStyles.textField}
            />
            {errors.cycleNumber && (
              <Typography sx={CustomMealModalStyles.errorMessage}>This field is required</Typography>
            )}
          </Box>
          {value !== null && !errors.cycleNumber && (
            <PrimaryButton sx={CustomMealModalStyles.primaryButtonModify} type="submit">
              Start planning
            </PrimaryButton>
          )}
        </form>
      </Paper>
    </Backdrop>
  );
}
