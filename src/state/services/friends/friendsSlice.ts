import { IUser } from '@newstart-online/sdk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FriendsState {
  data: IUser[];
  suggested: IUser[];
}

const initialState: FriendsState = {
  data: [],
  suggested: [],
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    storeFriends(state, action: PayloadAction<IUser[]>) {
      state.data = action.payload;
    },
    storeSuggestedFriends(state, action: PayloadAction<IUser[]>) {
      state.suggested = action.payload;
    },
    removeSuggestedUser(state, action: PayloadAction<{ id: string }>) {
      state.suggested = state.suggested.filter((friend) => friend._id !== action.payload.id);
    },
  },
});

export const { storeFriends, storeSuggestedFriends, removeSuggestedUser } = friendsSlice.actions;

export default friendsSlice.reducer;
