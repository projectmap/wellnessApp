import React from 'react';
import Link from 'next/link';
import { Box } from '@mui/system';
import { CloseBlue, UpgradeLock } from '~/icons';
import { Typography, Modal } from '@mui/material';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { useAppDispatch, useAppSelector } from '~/state/app/hooks';

import { useGetUser } from '~/utils/useGetUser';
import UpgradeSubscriptions from './UpgradeSubscriptions';
import { ENUM_ROLE_ACCESS_FOR } from '@newstart-online/sdk';
import { ACCOUNT_BILLING_PAGE_ROUTING } from '~/state/constants';
import { useRouter } from 'next/router';

interface IGenericUpgradeModal {
  modalStatus: boolean;
  setModalStatus: (status: boolean) => void;
  onCrossClick?: () => void;
}
export default function GenericUpgradeModal({ modalStatus, setModalStatus, onCrossClick }: IGenericUpgradeModal) {
  const dispatch = useAppDispatch();
  const planType = useAppSelector((state) => state.onboarding.planType);
  const user = useGetUser();
  const router = useRouter();
  const [showUserLocationModal, setShowUserLocationModal] = React.useState(false);

  const handleExitButton = () => {
    if (onCrossClick) {
      onCrossClick();
    } else {
      router.back();
    }
  };

  return (
    <Modal
      onClose={() => {
        setModalStatus(true);
      }}
      open={modalStatus}
      onBackdropClick={() => {
        setModalStatus(true);
      }}
      sx={{
        outline: 'none',
        backgroundColor: 'rgba(19, 19, 54, 0.9)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <>
        <UpgradeSubscriptions
          showUserLocationModal={showUserLocationModal}
          setShowUserLocationModal={setShowUserLocationModal}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'fixed',
            left: '50%',
            top: '50%',
            bottom: '0',
            transform: 'translate(-50%, -50%)',
            background: '#FFFFFF',
            width: '375px',
            height: '300px',
            borderRadius: '8px',
            p: '47px 68px 24px 68px',
          }}
        >
          <button onClick={handleExitButton}>
            <Box sx={{ position: 'absolute', right: '16px', top: '16px', cursor: 'pointer' }}>
              <CloseBlue />
            </Box>
          </button>

          <UpgradeLock />
          <Typography variant="subtitle1" sx={{ mt: '24px', width: '248px', textAlign: 'center' }}>
            You are in {user?.role?.accessFor === ENUM_ROLE_ACCESS_FOR.FREE_USER ? 'free' : 'free trial'} plan.
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: '24px', width: '248px', textAlign: 'center' }}>
            Upgrade to NEWSTART premium to unlock this content
          </Typography>
          <PrimaryButton
            onClick={() => setShowUserLocationModal(true)}
            sx={{
              borderRadius: '32px',
              background: 'white',
              border: '1px solid #D0D0D7 ',
              p: '10px 24px',
              backgroundColor: '#147AE9',
              '&:hover': {
                boxShadow: 'none',
              },
            }}
          >
            Upgrade
          </PrimaryButton>
        </Box>
      </>
    </Modal>
  );
}
