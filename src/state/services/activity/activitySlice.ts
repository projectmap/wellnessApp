import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  activity: any; // TODO: set types
}
const initialState: UserState = {
  activity: [],
};

const authSlice = createSlice({
  name: 'userActivity',
  initialState,
  reducers: {
    storeUserActivity(state, action: PayloadAction<any[]>) {
      state.activity = action.payload;
    },
    addUserActivity(state, action: PayloadAction<any>) {
      state.activity = [action.payload, ...state.activity];
    },
  },
});

export const { storeUserActivity, addUserActivity } = authSlice.actions;

export default authSlice.reducer;
