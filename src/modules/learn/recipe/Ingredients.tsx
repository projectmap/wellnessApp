import React from 'react';
import { Box } from '@mui/system';
import { IIngredients } from '@newstart-online/sdk';
import { Typography, Checkbox, Stack } from '@mui/material';

interface ICIngredients {
  ingredients: IIngredients[];
}
export const Ingredients = (props: ICIngredients) => {
  const { ingredients } = props;

  return (
    <>
      <Typography component="h3" sx={{ fontSize: '20px', fontWeight: 700 }}>
        Ingredients
      </Typography>
      <Box sx={{ marginTop: '24px' }}>
        {ingredients.map((ingredient, index) => {
          return (
            <Stack direction="row" alignItems="center" key={index}>
              <Checkbox />
              <Typography component="h6">{ingredient.title}</Typography>
            </Stack>
          );
        })}
      </Box>
    </>
  );
};
