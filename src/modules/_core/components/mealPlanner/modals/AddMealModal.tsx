import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/system';
import { Modal, Typography } from '@mui/material';

import foodImage from '~/icons/tempFood.png';
import { BagIcon, BlueCheckedIcon, CloseBlue, UncheckedIcon } from '~/icons';
import { UrlWithStringQuery } from 'url';

interface IAddMealModal {
  status: boolean;
  setStatus: (status: boolean) => void;
}

interface IisSelected {
  [key: string]: boolean;
}

const AddMealModal = ({ status, setStatus }: IAddMealModal) => {
  const products = [{ id: '1a' }, { id: '1b' }];
  const meats = [{ id: '2a' }, { id: '2b' }];
  //Category
  const [mealCategory, setMealCategory] = React.useState('For Today');

  const handleCategorySelection = (categoryName: string) => {
    setMealCategory(categoryName);
  };

  const [isMealSelected, setIsMealSelected] = React.useState<IisSelected>({});

  const handleMealSelection = (mealId: string, status: boolean) => {
    setIsMealSelected((prevState) => ({ ...prevState, [mealId]: status }));
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
          width: '550px',
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
        <Typography variant="h6" sx={{ mb: 3, width: '60%' }}>
          Here are the items needed for your diet plans
        </Typography>
        <Box sx={{ mt: '24px', mb: '32px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '16px' }}>
            <Typography variant="body1" sx={{ width: '60%' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
            </Typography>
            <BagIcon />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
          <Box
            onClick={() => handleCategorySelection('For Today')}
            sx={{
              border: `${mealCategory === 'For Today' ? '2px solid #147AE9' : '2px solid #ffffff'}`,
              borderRadius: '16px',
              p: '6px 11px',
              cursor: 'pointer',
              width: 'fit-content',
            }}
          >
            <Typography variant="body2">For Today</Typography>
          </Box>
          <Box
            onClick={() => handleCategorySelection('For Tomorrow')}
            sx={{
              border: `${mealCategory === 'For Tomorrow' ? '2px solid #147AE9' : '2px solid #ffffff'}`,
              borderRadius: '16px',
              p: '6px 11px',
              cursor: 'pointer',
            }}
          >
            For Tomorrow
          </Box>
          <Box
            onClick={() => handleCategorySelection('For this week')}
            sx={{
              border: `${mealCategory === 'For this week' ? '2px solid #147AE9' : '2px solid #ffffff'}`,
              borderRadius: '16px',
              p: '6px 11px',
              cursor: 'pointer',
            }}
          >
            For this week
          </Box>
          <Box
            onClick={() => handleCategorySelection('For This month')}
            sx={{
              border: `${mealCategory === 'For This month' ? '2px solid #147AE9' : '2px solid #ffffff'}`,
              borderRadius: '16px',
              p: '6px 11px',
              cursor: 'pointer',
            }}
          >
            For This month
          </Box>
        </Box>
        <Box sx={{ mt: '24px', mb: '32px' }}>
          <Typography variant="subtitle1" sx={{ mb: '16px' }}>
            Products
          </Typography>
          {products.map((item, idx) => {
            const itemId = item?.id;

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
                  {isMealSelected[itemId] ? (
                    <BlueCheckedIcon
                      onClick={() => handleMealSelection(item?.id, false)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <UncheckedIcon onClick={() => handleMealSelection(item?.id, true)} style={{ cursor: 'pointer' }} />
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', ml: '24px' }}>
                    <Image src={foodImage} width="48px" height="48px" alt="meal" />
                    <Typography variant="body1" sx={{ ml: '24px' }}>
                      Strawberry muffins
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ ml: '24px' }}>
                  00 pcs
                </Typography>
              </Box>
            );
          })}
        </Box>
        <Box sx={{ mt: '24px', mb: '32px' }}>
          <Typography variant="subtitle1" sx={{ mb: '16px' }}>
            Meats
          </Typography>
          {meats.map((item, idx) => {
            const itemId = item?.id;

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
                  {isMealSelected[itemId] ? (
                    <BlueCheckedIcon
                      onClick={() => handleMealSelection(item?.id, false)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <UncheckedIcon onClick={() => handleMealSelection(item?.id, true)} style={{ cursor: 'pointer' }} />
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: '24px' }}>
                    <Image src={foodImage} width="48px" height="48px" alt="meal" />
                    <Typography variant="body1" sx={{ ml: '24px' }}>
                      Strawberry muffins
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ ml: '24px' }}>
                  00 lb
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Modal>
  );
};
export default AddMealModal;
