import Image from 'next/image';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { Typography, Modal } from '@mui/material';
import {
  IRecipeInput,
  IRecipeResponse,
  RECIPE_CATEGORY,
  useAddRemoveBreakFastOrLunchUserMealPlanMutation,
  useGetUserMealPlanQuery,
  useListPaginatedRecipeQuery,
  useListRecipeQuery,
  useListRecipeTagsQuery,
} from '@newstart-online/sdk';

import foodImage from '~/icons/tempFood.png';
import { BlueCheckedIcon, CloseBlue, UncheckedIcon } from '~/icons';
import { SearchField } from '~/modules/_core/bits/searchField/SearchField';
import { PrimaryButton } from '~/modules/_core/bits/buttons/PrimaryButton';
import { UserMealPlanModalStyles } from '~/modules/_core/styles/UserMealPlanModalStyles';

interface IUserMealPlanModal {
  status: boolean;
  mealType: string | undefined;
  selectedMealPlanDayId: string | undefined;
  setStatus: (status: boolean) => void;
}

interface IisSelected {
  [key: string]: boolean;
}

const UserMealPlanModal = ({ status, setStatus, selectedMealPlanDayId, mealType }: IUserMealPlanModal) => {
  const { data: userMealPlan } = useGetUserMealPlanQuery();

  const [searchMessage, setSearchMessage] = React.useState<string>('');
  const [searchKey, setSearchKey] = React.useState<string>('');

  const [mealCategory, setMealCategory] = React.useState('');
  const requestRecipe: any = { page: 1, perPage: 4 };
  if (mealCategory) {
    requestRecipe['recipeTags'] = mealCategory;
  }

  if (searchKey) {
    requestRecipe['title'] = searchKey;
  }

  const { data: recipeLists } = useListPaginatedRecipeQuery(requestRecipe);
  const { data: recipeTags } = useListRecipeTagsQuery();
  const [selectedRecipe, setSelectedRecipe] = React.useState<string[]>([]);
  const [updateRecipesSelectedMealsToUser, { isLoading }] = useAddRemoveBreakFastOrLunchUserMealPlanMutation();

  React.useEffect(() => {
    if (userMealPlan.data) {
      const selectedMealPlan = userMealPlan?.data?.mealplan?.find((item: any) => item._id === selectedMealPlanDayId);

      const selectedBreakfast = selectedMealPlan?.breakfasts.map((item: any) => item._id);
      const selectedLunch = selectedMealPlan?.lunch.map((item: any) => item._id);
      setSelectedRecipe(mealType === RECIPE_CATEGORY.BREAKFAST ? selectedBreakfast : selectedLunch);
    }
  }, [userMealPlan.data, mealType]);

  const [newRemovedRecipe, setNewRemovedRecipe] = React.useState<string[]>([]);
  const handleCategorySelection = (categoryName: string) => {
    setMealCategory(categoryName);
  };

  const handleChange = (e: any) => {
    setSearchKey(e.target.value);
  };

  const handleMealItemAddRemove = () => {
    (selectedRecipe?.length || newRemovedRecipe?.length) &&
      updateRecipesSelectedMealsToUser({
        breakFastId: mealType === RECIPE_CATEGORY.BREAKFAST ? selectedRecipe : [],
        launchId: mealType === RECIPE_CATEGORY.LUNCH ? selectedRecipe : [],
        _id: selectedMealPlanDayId || '',
        removingBreakFastId: mealType === RECIPE_CATEGORY.BREAKFAST ? newRemovedRecipe : [],
        removingLunchId: mealType === RECIPE_CATEGORY.LUNCH ? newRemovedRecipe : [],
      })
        .unwrap()
        .then(() => setStatus(false));
  };

  return (
    <Modal
      open={status}
      onClose={setStatus}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={UserMealPlanModalStyles.userMealPlanModalContainer}>
        <Box onClick={() => setStatus(false)} sx={UserMealPlanModalStyles.closeButton}>
          <CloseBlue />
        </Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Add items in your {mealType}
        </Typography>
        <SearchField
          setSearchMessage={setSearchMessage}
          sx={{ ml: '0', my: 3 }}
          searchText="Search New Recipes..."
          handleChange={handleChange}
        />

        {/* Todo *
        - Recently searched components will be added after the necessary work is done at the backend.

        *Purpose of this code
        - Currently api for recently searched item is not ready.As soon as it is available current code can be integrated with api to fetch and display data.
        /}
        {/* <Box sx={{ mt: '24px', mb: '32px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '16px' }}>
            <Typography variant="subtitle1">Recently searched</Typography>
            <Typography variant="body1" sx={{ color: '#147AE9', cursor: 'pointer' }}>
              Clear all
            </Typography>
          </Box>
          {recentlySearched.map((item, idx) => {
            const itemId = item.id;

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
                    Strawberry muffins
                  </Typography>
                </Box>
                {isMealSelected[itemId] ? (
                  <BlueCheckedIcon
                    onClick={() => {
                      handleMealSelection(item?.id, false);
                      handleRemoveMealPlanToUser(itemId);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <UncheckedIcon
                    onClick={() => {
                      handleMealSelection(item?.id, true);
                      handleAddMealPlanToUser(itemId);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </Box>
            );
          })}
        </Box> */}
        <Typography variant="subtitle1" sx={UserMealPlanModalStyles.suggestionsTitle}>
          Our suggestions for {mealType}
        </Typography>
        {/* Todo: To be added after category field is added in backend api to filter meal according to its type. */}

        <Box
          className="hide-scrollbar"
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '20px',
            mt: '16px',
            height: '40px',
            overflow: 'scroll',
          }}
        >
          <Box
            onClick={() => handleCategorySelection('')}
            sx={{
              border: `${mealCategory === '' ? '2px solid #147AE9' : '2px solid #ffffff'}`,
              borderRadius: '16px',
              p: '6px 16px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              height: 'fit-content',
            }}
          >
            All
          </Box>

          {recipeTags?.data?.map((item, index) => {
            return (
              <Box
                onClick={() => handleCategorySelection(item?._id || '')}
                sx={{
                  border: `${mealCategory === item._id ? '2px solid #147AE9' : '2px solid #ffffff'}`,
                  borderRadius: '16px',
                  p: '6px 16px',
                  cursor: 'pointer',
                  width: 'fit-content',
                  height: 'fit-content',
                  whiteSpace: 'nowrap',
                }}
                key={index}
              >
                {item.name}
              </Box>
            );
          })}
        </Box>
        {searchMessage === '' ? (
          ''
        ) : (
          <Typography variant="body1" sx={UserMealPlanModalStyles.searchMessage}>
            {searchMessage}
          </Typography>
        )}
        <Box sx={UserMealPlanModalStyles.suggestedMealItemHolder}>
          {recipeLists?.data?.map((item: IRecipeResponse, idx: number) => {
            const itemId = item._id as string;
            const { title } = item;

            return (
              <Box key={idx} sx={UserMealPlanModalStyles.suggestedMealItem}>
                <Box sx={UserMealPlanModalStyles.suggestedMealItemTitleImage}>
                  <Box sx={{ position: 'relative', height: '48px', width: '48px', borderRadius: '50%' }}>
                    <Image
                      src={item?.vimeoDetails?.thumbNailImage || item?.featuredImage?.[0]?.completedUrl || foodImage}
                      width="100%"
                      height="100%"
                      alt="foodimg"
                      className="round-meal-image"
                      objectFit="cover"
                      layout="fill"
                    />
                  </Box>
                  <Typography variant="body1" sx={UserMealPlanModalStyles.suggestedMealItemTitle}>
                    {title}
                  </Typography>
                </Box>
                {selectedRecipe?.includes(itemId) ? (
                  <BlueCheckedIcon
                    onClick={() => {
                      const newSelectedRecipe = [...selectedRecipe].filter((item) => item !== itemId);
                      setSelectedRecipe(newSelectedRecipe);
                      setNewRemovedRecipe((prevState: any) => {
                        let data = !prevState.includes(itemId) ? [...prevState, itemId] : [...prevState];

                        return [...data];
                      });
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <UncheckedIcon
                    onClick={() => {
                      const newSelectedRecipe = [...selectedRecipe, itemId];
                      setSelectedRecipe(newSelectedRecipe);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </Box>
            );
          })}
          {recipeLists?.data?.length !== 0 ? (
            <Box sx={UserMealPlanModalStyles.saveButtonHolder}>
              <PrimaryButton onClick={() => handleMealItemAddRemove()} sx={UserMealPlanModalStyles.saveButton}>
                {isLoading ? 'Loading...' : 'Save'}
              </PrimaryButton>
            </Box>
          ) : (
            <Box sx={UserMealPlanModalStyles.saveButtonHolder}>
              <Typography sx={{ color: 'red' }}>No meal item available!</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};
export default UserMealPlanModal;
