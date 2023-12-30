import { INotificationResponse } from '@newstart-online/sdk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  notifications: INotificationResponse[];
}

const initialState: NotificationState = {
  notifications: [],
};

interface Payload {
  notifications: INotificationResponse[];
  singleNotification: INotificationResponse;
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    storeNotifications(state, action: PayloadAction<Payload['notifications']>) {
      state.notifications = action.payload;
    },

    addNotification(state, action: PayloadAction<Payload['singleNotification']>) {
      state.notifications = [action.payload, ...state.notifications];
    },
  },
});

export const { storeNotifications, addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
