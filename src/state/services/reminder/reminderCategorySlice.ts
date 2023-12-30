import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRecordCategoryResult } from '~/type/recordCategory';

const initialState: { data: IRecordCategoryResult[] } = {
  data: [],
};

const reminderCategorySlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    storeReminderCategory(state, action: PayloadAction<IRecordCategoryResult[]>) {
      state.data = action.payload;
    },
    addReminderCategory(state, action: PayloadAction<IRecordCategoryResult>) {
      state.data = [...state.data.filter((reminder) => reminder.id !== action.payload.id), action.payload];
    },
  },
});

export const { storeReminderCategory, addReminderCategory } = reminderCategorySlice.actions;

export default reminderCategorySlice.reducer;
