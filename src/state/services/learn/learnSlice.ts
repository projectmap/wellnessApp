import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// all the necessary states for user learn section in frontend
interface learnStates {
  showCurrentLectureProgress: boolean;
}

const initialState: learnStates = {
  showCurrentLectureProgress: true,
};

const learnSectionSlice = createSlice({
  name: 'learn',
  initialState,
  reducers: {
    setShowCurrentLectureProgress(state, action: PayloadAction<any>) {
      state.showCurrentLectureProgress = action.payload;
    },
  },
});

export const { setShowCurrentLectureProgress } = learnSectionSlice.actions;

export default learnSectionSlice.reducer;
