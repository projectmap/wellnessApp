import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUser } from '@newstart-online/sdk';

interface UserState {
  user: IUser | null;
}
const initialState: UserState = {
  user: null,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    storeUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
  },
});

export const { storeUser } = authSlice.actions;

export default authSlice.reducer;
