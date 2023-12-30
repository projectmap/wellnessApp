import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LoaderType = {
  isLoading: boolean;
  error: string | null;
};

const initialState: LoaderType = {
  isLoading: false,
  error: null,
};

const globalLoaderSlice = createSlice({
  name: 'globalLoader',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setGlobalError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setGlobalError } = globalLoaderSlice.actions;

export default globalLoaderSlice.reducer;
