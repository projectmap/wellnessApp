import Link from 'next/link';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Modal, Typography } from '@mui/material';

import { DeleteIcon, OpenIcon } from '~/icons';
import { DeleteModal } from '~/modules/community/modals/DeleteModal';
import { RECIPE_CATEGORY, useAddRemoveBreakFastOrLunchUserMealPlanMutation } from '@newstart-online/sdk';

interface IMealDeleteViewModal {
  status: boolean;
  setStatus: (status: boolean) => void;
  selectedMealPlanDayId: string | undefined;
  recipeIdForDeleteMenu: string | undefined;
  mealType: string | undefined;
  recipeNameForDeleteMenu: string | undefined;
}
const MealDeleteViewModal = ({
  status,
  setStatus,
  recipeIdForDeleteMenu,
  recipeNameForDeleteMenu,
  mealType,
  selectedMealPlanDayId,
}: IMealDeleteViewModal) => {
  const [updateRecipesSelectedMealsToUser, loading] = useAddRemoveBreakFastOrLunchUserMealPlanMutation();
  const [selectedRecipe, setSelectedRecipe] = React.useState<string[]>([]);
  const [newRemovedRecipe, setNewRemovedRecipe] = React.useState<string[]>([]);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const handleMealItemAddRemove = () => {
    updateRecipesSelectedMealsToUser({
      breakFastId: [],
      launchId: [],
      _id: selectedMealPlanDayId || '',
      removingBreakFastId: mealType === RECIPE_CATEGORY.BREAKFAST ? newRemovedRecipe : [],
      removingLunchId: mealType === RECIPE_CATEGORY.LUNCH ? newRemovedRecipe : [],
    })
      .unwrap()
      .then(() => setStatus(false));
  };

  const handleCloseDeletePostModel = () => {
    setShowDeleteConfirmModal(false);
  };

  const handleDeleteMeal = () => {
    handleMealItemAddRemove();
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        width: '350px',
        height: 'fit-content',
        p: '56px 24px 24px 24px',
        borderRadius: '0 0 8px 8px',
        boxShadow: '0px 6px 18px 2px #0000000A',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: '16px',
          justifyContent: 'space-between',
          p: '4px 8px',
          cursor: 'pointer',
        }}
        onClick={() => {
          setNewRemovedRecipe([recipeIdForDeleteMenu || '']);
          setShowDeleteConfirmModal(true);
        }}
      >
        <Typography variant="body1" sx={{ width: '60%' }}>
          <Typography sx={{ fontWeight: '600' }}>Delete</Typography> {recipeNameForDeleteMenu}.
        </Typography>
        <DeleteIcon />
      </Box>

      <Link href={`/user/learn/recipe/${recipeIdForDeleteMenu}/`}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: '16px',
            justifyContent: 'space-between',
            p: '4px 8px',
            cursor: 'pointer',
          }}
        >
          <Typography variant="body1" sx={{ width: '60%' }}>
            <Typography sx={{ fontWeight: '600' }}>View</Typography> {recipeNameForDeleteMenu}.
          </Typography>
          <OpenIcon />
        </Box>
      </Link>
      <Modal open={showDeleteConfirmModal} onClose={handleCloseDeletePostModel}>
        <DeleteModal
          deleteMessage={`${recipeNameForDeleteMenu} will be deleted from your meal plan ${mealType?.toLowerCase()} list.`}
          deteteModalTitle={`Delete ${recipeNameForDeleteMenu} ?`}
          closeModal={handleCloseDeletePostModel}
          onDelete={handleDeleteMeal}
          loading={loading?.isLoading}
        />
      </Modal>
    </Box>
  );
};

export default MealDeleteViewModal;
