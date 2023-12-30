import { USER_TYPE } from '@newstart-online/sdk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { USER_ONBOARDING_STEPS, USER_SUBSCRIPTION_TYPE } from '~/state/constants';

// all the necessary states for user onboarding flow in frontend
interface OnboardingStates {
  userCourseLocation: boolean; //from where user takes the course
  subscriptionModal: boolean; //modal that opens subcription options
  showPayment: boolean; //state that opens paymentandbilling modal
  planType: string; //user's plan type like freetrial
  locationType: USER_TYPE;
  openMultiForm: boolean;
  activeStep: USER_ONBOARDING_STEPS;
  uploadUserAvatar: boolean;
  isUserSubscribed: boolean; // check if the user has subscribed to newstart plans
  showAddCardFormBox: boolean;
}

const initialState: OnboardingStates = {
  userCourseLocation: false,
  locationType: USER_TYPE.ONLINE,
  showPayment: false,
  subscriptionModal: false,
  openMultiForm: false,
  planType: USER_SUBSCRIPTION_TYPE.FREE_TRIAL,
  uploadUserAvatar: false,
  activeStep: USER_ONBOARDING_STEPS.GENERAL_INFO,
  isUserSubscribed: false,
  showAddCardFormBox: false,
};

const PaymentandSubscriptionSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setUserOnboardingLocation(state, action: PayloadAction<any>) {
      state.userCourseLocation = action.payload;
    },
    setUserLocationType(state, action: PayloadAction<any>) {
      state.locationType = action.payload;
    },
    setUserPayment(state, action: PayloadAction<any>) {
      state.showPayment = action.payload;
    },
    setShowAddCardFormBox(state, action: PayloadAction<any>) {
      state.showAddCardFormBox = action.payload;
    },
    setUserPlan(state, action: PayloadAction<any>) {
      state.planType = action.payload;
    },
    setUserSubscriptionModal(state, action: PayloadAction<any>) {
      state.subscriptionModal = action.payload;
    },
    setOpenMultiForm(state, action: PayloadAction<any>) {
      state.openMultiForm = action.payload;
    },
    setActiveStepInMultiForm(state, action: PayloadAction<any>) {
      state.activeStep = action.payload;
    },
    setUploadUserAvatar(state, action: PayloadAction<any>) {
      state.uploadUserAvatar = action.payload;
    },
    setisUserSubscribed(state, action: PayloadAction<any>) {
      state.isUserSubscribed = action.payload;
    },
  },
});

export const {
  setUserOnboardingLocation,
  setUserLocationType,
  setUserPayment,
  setUserPlan,
  setUserSubscriptionModal,
  setOpenMultiForm,
  setActiveStepInMultiForm,
  setUploadUserAvatar,
  setisUserSubscribed,
  setShowAddCardFormBox,
} = PaymentandSubscriptionSlice.actions;

export default PaymentandSubscriptionSlice.reducer;
