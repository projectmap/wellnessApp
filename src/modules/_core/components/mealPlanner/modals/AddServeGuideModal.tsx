import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/system';
import { Modal, Typography } from '@mui/material';

import { CloseBlue, CupIcon } from '~/icons';
import foodImage from '~/icons/tempFood.png';

interface IAddServeGuideModal {
  status: boolean;
  setStatus: (status: boolean) => void;
}

const AddServeGuideModal = ({ status, setStatus }: IAddServeGuideModal) => {
  const suggestedMeal = [1, 1];
  //Category
  const [mealCategory, setMealCategory] = React.useState('all');

  const handleCategorySelection = (categoryName: string) => {
    setMealCategory(categoryName);
  };

  return (
    <Modal
      open={status}
      onClose={setStatus}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          backgroundColor: 'white',
          position: 'fixed',
          left: '50%',
          top: '50%',
          bottom: '0',
          transform: 'translate(-50%, -50%)',
          width: '463px',
          height: 'fit-content',
          p: '24px',
          borderRadius: '4px',
        }}
      >
        <div
          onClick={() => setStatus(false)}
          style={{ position: 'absolute', right: '24px', top: '24px', cursor: 'pointer' }}
        >
          <CloseBlue />
        </div>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Easy guide to serving sizes
        </Typography>
        <Box sx={{ mt: '24px', mb: '32px' }}>
          <Box sx={{ mt: '24px', mb: '32px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '16px' }}>
              <Typography variant="body1" sx={{ width: '60%' }}>
                Use this guide to check your portions whereever you go.
              </Typography>
              <CupIcon />
            </Box>
          </Box>
          <Typography variant="subtitle1" sx={{ mb: '16px' }}>
            Veggies
          </Typography>
          {suggestedMeal.map((item, idx) => {
            return (
              <Box
                key={idx}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: '12px',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Image src={foodImage} width="48px" height="48px" alt="meal" />
                  <Typography variant="body1" sx={{ ml: '24px' }}>
                    1 cup
                  </Typography>
                </Box>
                =
                <Image src={foodImage} width="48px" height="48px" alt="meal" />
              </Box>
            );
          })}
          <Typography variant="subtitle1" sx={{ mb: '16px' }}>
            Fruits
          </Typography>
          {suggestedMeal.map((item, idx) => {
            return (
              <Box
                key={idx}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: '12px',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Image src={foodImage} width="48px" height="48px" alt="meal" />
                  <Typography variant="body1" sx={{ ml: '24px' }}>
                    1/2 cup
                  </Typography>
                </Box>
                =
                <Image src={foodImage} width="48px" height="48px" alt="meal" />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Modal>
  );
};
export default AddServeGuideModal;
