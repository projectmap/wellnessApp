import Image from 'next/image';
import { Box } from '@mui/system';
import { Paper, Typography, Modal } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { LoaderArea } from '~/modules/_core/components/loaderPage/LoaderArea';
import UserMealPlan from '~/modules/_core/components/mealPlanner/UserMealPlan';
import { CommunityFooterLinks } from '~/modules/community/CommunityFooterLinks';
import StartMealPlan from '~/modules/_core/components/mealPlanner/StartMealPlan';
import { ENUM_ROLE_ACCESS_FOR, useGetUserMealPlanQuery, useGetUserSubscriptionsQuery } from '@newstart-online/sdk';
import CustomMealPlanModal from '~/modules/_core/components/mealPlanner/modals/CustomMealPlanModal';
import UpgradeSubscriptions from '~/modules/_core/bits/modals/UpgradeSubscriptions';
import { useGetUser } from '~/utils/useGetUser';
import { FREE_TRIAL_ROLE } from '~/utils/enums';

const Diet = () => {
  const [open, setOpen] = React.useState(false);
  const [updatePlanModal, setUpdatePlanModal] = React.useState(false);
  const [isCustomMealPlan, setIsCustomMealPlan] = React.useState(false);
  const [openCustomMealModal, setOpenCustomMealModal] = React.useState(false);
  const [openSelectedCalender, setOpenSelectedCalender] = React.useState(false);
  const [showUserLocationModal, setShowUserLocationModal] = React.useState(false);

  const { data: useMealPlanData, isLoading } = useGetUserMealPlanQuery();

  const user = useGetUser();

  useEffect(() => {
    if (useMealPlanData) {
      setOpenSelectedCalender(!!useMealPlanData.data);
    }
  }, [useMealPlanData]);

  if (isLoading) {
    return <LoaderArea />;
  }

  return (
    <>
      <Modal
        onClose={() => {
          setUpdatePlanModal(false);
        }}
        open={updatePlanModal}
        onBackdropClick={() => {
          setUpdatePlanModal(false);
        }}
        sx={{
          outline: 'none',
          backgroundColor: 'rgba(19, 19, 54, 0.1)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <UpgradeSubscriptions
          showUserLocationModal={showUserLocationModal}
          setShowUserLocationModal={(value) => {
            setShowUserLocationModal(value);
            setUpdatePlanModal(false);
          }}
        />
      </Modal>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'space-between',
          maxWidth: '1836px',
          marginX: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 'auto', mt: 'auto' }}>
          {!open && !openSelectedCalender && (
            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                width: '550px',
                height: '506px',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                borderRadius: '12px',
                p: '32px',
              }}
            >
              <Image src="/assets/images/tmp/dietplannerintro.png" alt="diet-planner" width={192} height={198} />
              <Typography variant="h6" sx={{ my: '12px' }}>
                NEWSTART Meal Planner
              </Typography>
              <Typography variant="body2" sx={{ mb: '16px', textAlign: 'center', width: '80%' }}>
                We get it. You’ve done some heavy lifting with all you’re learning in this NEWSTART Lifestyle. Now you
                need some fast and easy how-tos like how can I NEWSTART my meals?
              </Typography>
              <Typography variant="body2" sx={{ mb: '42px', textAlign: 'center', width: '80%' }}>
                We’ve created a simple meal plan to get you started. And, when you’re ready, you can create a custom one
                of your own.
              </Typography>
              {user?.role.accessFor !== ENUM_ROLE_ACCESS_FOR.FREE_USER ? (
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ mr: '16px' }}>
                    <PrimaryButton
                      sx={{
                        borderRadius: '32px',
                        background: 'white',
                        border: '1px solid #D0D0D7 ',
                        color: '#147AE9',
                        '&:hover': {
                          backgroundColor: '#FFFFFF',
                          boxShadow: 'none',
                        },
                      }}
                      onClick={() => {
                        setOpenCustomMealModal(true);
                        setIsCustomMealPlan(true);
                      }}
                    >
                      Custom meal plan
                    </PrimaryButton>
                  </Box>
                  <PrimaryButton
                    sx={{ borderRadius: '32px' }}
                    onClick={() => {
                      if (user?.role.accessFor === FREE_TRIAL_ROLE) {
                        setUpdatePlanModal(true);
                        setShowUserLocationModal(true);

                        return;
                      }
                      setOpen(!open);
                      setIsCustomMealPlan(false);
                    }}
                  >
                    Suggested Meal Plan
                  </PrimaryButton>
                </Box>
              ) : (
                <PrimaryButton
                  sx={{ borderRadius: '32px' }}
                  onClick={() => {
                    setUpdatePlanModal(true);
                    setShowUserLocationModal(true);
                  }}
                >
                  Upgrade to Access
                </PrimaryButton>
              )}
            </Paper>
          )}

          <StartMealPlan
            status={open}
            setStatus={setOpen}
            setOpenSelectedCalendar={setOpenSelectedCalender}
            isCustomMealPlan={isCustomMealPlan}
          />
          <CustomMealPlanModal
            status={openCustomMealModal}
            setStatus={setOpenCustomMealModal}
            setOpenSelectedCalendar={setOpenSelectedCalender}
            isCustomMealPlan={isCustomMealPlan}
          />

          {openSelectedCalender && <UserMealPlan status={openSelectedCalender} setStatus={setOpenSelectedCalender} />}
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: '#FFFF' }}>
          <CommunityFooterLinks />
        </Box>
      </Box>
    </>
  );
};

export default Diet;
