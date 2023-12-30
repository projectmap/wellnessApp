import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

interface PersistedState {
  notificationCount: number;
}

const persistedState: PersistedState = {
  notificationCount: 0,
};

interface Payload {
  notificationCount: number;
}

const persistedSlice = createSlice({
  name: 'persisted',
  initialState: persistedState,
  reducers: {
    updateNotificationCount(state, action: PayloadAction<Payload['notificationCount']>) {
      state.notificationCount = action.payload;
    },
  },
});

// persist Config
const persistedReducer = persistReducer(
  {
    key: 'persisted',
    storage,
  },
  persistedSlice.reducer,
);

export const { updateNotificationCount } = persistedSlice.actions;

export default persistedReducer;
