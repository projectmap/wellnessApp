import { persistStore } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';

import user from '~/state/services/auth/authSlice';
import post from '~/state/services/post/postSlice';
import chats from '~/state/services/chats/chatSlice';
import learn from '~/state/services/learn/learnSlice';
import screens from '~/state/services/screen/screenSlice';
import friends from '~/state/services/friends/friendsSlice';
import persist from '~/state/services/persist/persistSlice';
import userActivity from '~/state/services/activity/activitySlice';
import onboarding from '~/state/services/onboarding/onboardingSlice';
import globalLoader from '~/state/services/loader/globalLoaderSlice';
import resources from '~/state/services/resources/resourcesSectionSlice';
import notifications from '~/state/services/notification/notificationSlice';
import recordCategory from '~/state/services/reminder/reminderCategorySlice';
import recordLogBadgeInfo from '~/state/services/recordLogsBadgeNotification/recordLogsBadgeNotification';

export const reducer = {
  user,
  post,
  chats,
  learn,
  friends,
  screens,
  resources,
  onboarding,
  userActivity,
  globalLoader,
  notifications,
  recordCategory,
  persist,
  recordLogBadgeInfo,
};

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
