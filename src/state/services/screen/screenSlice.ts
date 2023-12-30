import { IScreenResponse } from '@newstart-online/sdk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScreenState {
  data: IScreenResponse[];
  currentScreen: IScreenResponse | undefined;
}
const initialState: ScreenState = {
  data: [],
  currentScreen: undefined,
};

const screenSlice = createSlice({
  name: 'screens',
  initialState,
  reducers: {
    storeScreens(state, action: PayloadAction<IScreenResponse[]>) {
      state.data = action.payload;
    },
    setCurrentScreen(state, action: PayloadAction<IScreenResponse | undefined>) {
      state.currentScreen = action.payload;
    },
  },
});

export const { storeScreens, setCurrentScreen } = screenSlice.actions;

export default screenSlice.reducer;
