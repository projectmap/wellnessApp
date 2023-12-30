import React from 'react';
import {
  useSwitchUserMealPlanMutation,
  useGetUserAllMealPlanQuery,
  useGetUserMealPlanQuery,
  useGetNEWSTARTMealPlanQuery,
  useStartUserMealPlanMutation,
} from '@newstart-online/sdk';
import dayjs, { Dayjs } from 'dayjs';
import { Modal, Box } from '@mui/material';
import CustomMealPlanModal from './CustomMealPlanModal';

import { CloseBlue } from '~/icons';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import MealPlanAccordian from './MealPlanAccordian';
import { Backdrop, Paper, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CustomMealModalStyles } from '~/modules/_core/styles/CustomMealModalStyles';

interface ISwitchMealPlanModal {
  openSwitchMealPlanModal: boolean;
  setOpenSwitchMealPlanModal: (data: boolean) => void;
}
const SwitchMealPlanModal: React.FC<ISwitchMealPlanModal> = ({
  openSwitchMealPlanModal,
  setOpenSwitchMealPlanModal,
}) => {
  const [switchMealPlan] = useSwitchUserMealPlanMutation();
  const { data: userAllMealPlans, isLoading } = useGetUserAllMealPlanQuery();
  const { data: userActiveMealPlans } = useGetUserMealPlanQuery();
  const { data: newStartMealPlan } = useGetNEWSTARTMealPlanQuery();
  const [startDate] = useStartUserMealPlanMutation();

  let d1 = dayjs(new Date());
  let today = d1?.toDate()?.toISOString();
  const [value, setValue] = React.useState<Dayjs | null>(d1 as any);

  const [openCustomMealModal, setOpenCustomMealModal] = React.useState(false);

  const closeSwitchMealPlanModal = () => {
    setOpenSwitchMealPlanModal(false);
    setOpenCustomMealModal(false);
  };

  React.useEffect(() => {
    const checkIfUserHasOneMealPlanAndIsNotCustom =
      userAllMealPlans?.data?.length === 1 && !userActiveMealPlans?.data?.isCustom;
    setOpenCustomMealModal(checkIfUserHasOneMealPlanAndIsNotCustom);
  }, [openSwitchMealPlanModal, userAllMealPlans, userActiveMealPlans]);
  const handleSwitchMealPlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const checkIfSuggestedMealPlanAlreadyExistsInUser = userAllMealPlans?.data?.find((item: any) => !item.isCustom);
    const checkIfIamSwitchingToNEWSTARTPlan =
      userActiveMealPlans?.data?.isCustom && !checkIfSuggestedMealPlanAlreadyExistsInUser;
    if (checkIfIamSwitchingToNEWSTARTPlan) {
      startDate({
        startDate: value?.toDate().toISOString(),
        isCustom: false,
      })
        .unwrap()
        .then((data: any) => {
          closeSwitchMealPlanModal();
          toast.success(data.message);
        })
        .catch((error: any) => toast.error(error.message));

      return;
    }
    switchMealPlan({
      startDate: value?.toDate()?.toISOString(),
      _id: userAllMealPlans?.data?.find((item: any) => !item.isActive)._id,
    })
      .unwrap()
      .then(() => {
        closeSwitchMealPlanModal();
      })
      .catch((error: any) => toast.error(error.message));
  };

  const onKeyDown = (e: any) => {
    e.preventDefault();
  };

  const findCustomPlanWithNoActive = userAllMealPlans?.data?.find((item: any) => item.isCustom && !item.isActive);

  return (
    <Modal
      open={openSwitchMealPlanModal}
      onClose={closeSwitchMealPlanModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>
        <CustomMealPlanModal
          status={openCustomMealModal}
          setStatus={closeSwitchMealPlanModal}
          isCustomMealPlan={true}
        />

        {!openCustomMealModal && (
          <Backdrop open={true}>
            <Paper sx={CustomMealModalStyles.switchModalContainer}>
              <Box onClick={() => closeSwitchMealPlanModal()} sx={CustomMealModalStyles.closeButton}>
                <CloseBlue />
              </Box>

              <Typography variant="h6">
                {userActiveMealPlans?.data?.isCustom ? 'Suggested' : 'Custom'} meal plan
              </Typography>
              <Typography>
                Please choose the day that you wish to begin your{' '}
                {userActiveMealPlans?.data?.isCustom ? 'suggested' : 'custom'} meal plan.
              </Typography>
              <Typography variant="body1" sx={CustomMealModalStyles.startDateLabel}>
                Diet start date
              </Typography>
              <form onSubmit={handleSwitchMealPlan}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select start date"
                    value={value}
                    minDate={today}
                    onChange={(newValue: any) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => <TextField onKeyDown={onKeyDown} sx={{ width: '100%' }} {...params} />}
                  />
                </LocalizationProvider>
                <MealPlanAccordian
                  mealCycleStartDate={value ? value?.toDate()?.toISOString() : d1.toDate().toISOString()}
                  mealPlan={findCustomPlanWithNoActive ? findCustomPlanWithNoActive?.mealplan : newStartMealPlan?.data}
                />

                <Box display="flex">
                  {value !== null && (
                    <PrimaryButton sx={CustomMealModalStyles.switchButton} type="submit">
                      Switch to {userActiveMealPlans?.data?.isCustom ? 'suggested' : 'custom'}
                    </PrimaryButton>
                  )}

                  <PrimaryButton
                    onClick={() => {
                      closeSwitchMealPlanModal();
                    }}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.dark',
                      mt: '24px',
                      '&:hover': {
                        backgroundColor: 'background.paper',
                        boxShadow: 'none',
                      },
                    }}
                    type="button"
                  >
                    Cancel
                  </PrimaryButton>
                </Box>
              </form>
            </Paper>
          </Backdrop>
        )}
      </>
    </Modal>
  );
};

export default SwitchMealPlanModal;
