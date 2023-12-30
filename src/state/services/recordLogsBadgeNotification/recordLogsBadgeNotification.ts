import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface badgeInfoDetails {
  title: string;
  descriptions: string;
  imageUrl: string;
}
interface BadgeInfoStates {
  showRecordLogBadgeUnlockedModal: boolean;
  badgeInfos: badgeInfoDetails;
}

const initialState: BadgeInfoStates = {
  showRecordLogBadgeUnlockedModal: false,
  badgeInfos: { title: '', descriptions: '', imageUrl: '' },
};

const RecordLogBadgeInfoSlice = createSlice({
  name: 'recordLogBadge',
  initialState,
  reducers: {
    setShowRecordLogBadgeUnlockedModal(state, action: PayloadAction<any>) {
      state.showRecordLogBadgeUnlockedModal = action.payload;
    },
    setBadgeInfoDetails(state, action) {
      state.badgeInfos = action.payload;
    },
  },
});

export const { setShowRecordLogBadgeUnlockedModal, setBadgeInfoDetails } = RecordLogBadgeInfoSlice.actions;

export default RecordLogBadgeInfoSlice.reducer;
