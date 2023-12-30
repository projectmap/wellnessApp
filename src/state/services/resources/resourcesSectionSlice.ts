import { IUserFavouriteRecipe } from '@newstart-online/sdk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IStoreUsersFavRecipe {
  addedFavRecipe: IUserFavouriteRecipe[];
}

const initialState: IStoreUsersFavRecipe = {
  addedFavRecipe: [{}],
};

const resources = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    storeUsersFavoriteRecipe(state, action: PayloadAction<any>) {
      state.addedFavRecipe = action.payload;
    },
  },
});

export const { storeUsersFavoriteRecipe } = resources.actions;

export default resources.reducer;
