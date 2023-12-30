import { SxProps } from '@mui/system';

export const dynamicBillingStylesForUserProfileFormContainer = (dynamicBillingStyles: SxProps) => {
  return { ...userProfile.userProfileFormContainer, ...dynamicBillingStyles };
};

export const dynamicBillingStylesForUserProfileInputContainer = (dynamicStyles: SxProps) => {
  return { ...userProfile.userProfileInputContainer, ...dynamicStyles };
};

export const dynamicBillingStylesForUserProfileInputFieldHolderPassword = (dynamicStyles: SxProps) => {
  return { ...userProfile.userProfileInputFieldHolderPassword, ...dynamicStyles };
};

export const dynamicBillingStylesForBillPageContainer = (dynamicStyles: SxProps) => {
  return { ...billingPage.billPageContainer, ...dynamicStyles };
};

export const dynamicBillingStylesForPlanDetails = (dynamicStyles: SxProps) => {
  return { ...billingPage.planDetails, ...dynamicStyles };
};

export const dynamicBillingStylesForPaymentInfoContainer = (dynamicStyles: SxProps) => {
  return { ...billingPage.paymentInfoContainer, ...dynamicStyles };
};

export const BillingTableStyles: { [key: string]: SxProps } = {
  paidStatusText: {
    background: 'rgba(117, 188, 55, 0.1)',
    p: '6px 12px',
    borderRadius: '20px',
    width: 'fit-content',
    fontSize: '12px',
    color: '#27AE60',
  },
  dueStatusText: {
    background: 'background.danger',
    p: '6px 12px',
    borderRadius: '20px',
    width: 'fit-content',
    fontSize: '12px',
    color: 'error.main',
  },
  downloadText: {
    background: 'background.danger',
    p: '16px',
    borderRadius: '20px',
    width: 'fit-content',
    fontSize: '14px',
  },
  paymentMethodChangeModalContainer: {
    position: 'fixed',
    transform: 'translate(-50%,-50%)',
    top: '50%',
    left: '50%',
    p: '48px 36px 42px 36px',
    borderRadius: '12px',
    height: '548px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  paymentChangeModalTitleNCrossBtn: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalCardContainer: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    mb: '32px',
    mt: '42px',
    width: '524px',
    height: '255px',
    p: '16px 0 ',
    overflowY: 'scroll',
  },
  modalCardItem: {
    border: '1px solid #E7E7EB',
    borderRadius: '8px',
    p: '20px',
    width: '45%',
    display: 'flex',
    gap: '12px',
    height: '120px',
  },
  modalCheckBoxContainer: { width: 'fit-content', height: 'fit-content' },
  cardNo: { whiteSpace: 'nowrap' },
  addCardContainer: {
    backgroundColor: '#F4F5FC',
    border: '1px solid #E7E7EB',
    borderRadius: '8px',
    p: '20px',
    width: '45%',
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  addCardIconNText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: 'fit-content',
    cursor: 'pointer',
  },
  payNowBtn: { borderRadius: '42px', width: '100%' },
};

export const billingPage: { [key: string]: SxProps } = {
  billPageContainer: { display: 'flex', mt: '40px' },
  planDetails: {
    p: '29px 10px ',
    backgroundColor: 'background.light',
    borderRadius: '12px',
    width: '274px',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  changeSubscriptionButton: { borderRadius: '40px', mt: '24px' },
  planDetailsTitleHolder: { width: '100%' },
  planDetailsTitle: { p: '10px' },
  planInfoContainer: { mt: '24px', width: '100%' },
  planInfoItem: {
    display: 'flex',
    borderBottom: '1px solid #E7E7EB',
    justifyContent: 'space-between',
    p: '10px',
  },
  planInfoStatus: {
    display: 'flex',
    borderBottom: '1px solid #E7E7EB',
    justifyContent: 'space-between',
    p: '10px',
  },
  planInfoStatusWithoutBorder: {
    display: 'flex',
    justifyContent: 'space-between',
    p: '10px',
  },
  planCancelButton: { color: 'primary.p120', mt: '20px', cursor: 'pointer' },
  paymentInfoContainer: { flexGrow: '1', ml: '24px' },
  paymentTitleContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  paymentAddCard: { borderRadius: '40px', p: '8px 20px' },
  paymentDetailsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mt: '32px',
    borderBottom: '1px solid #E7E7EB',
    p: '12px 0',
  },
  paymentDetailsItem: { display: 'flex' },
  cardAndName: { ml: '16px' },
  paymentName: { color: 'secondary.secondary60' },
  defaultCardButton: {
    backgroundColor: 'background.default',
    borderRadius: '24px',
    p: '6px 16px',
    fontWeight: '400',
  },
  setDefaultButton: { color: 'primary.p120', borderRadius: '24px', p: '6px 16px', cursor: 'pointer' },
  deteleButton: { borderRadius: '24px', p: '6px 16px', fontWeight: '400', cursor: 'pointer' },
  billingHistory: { mb: '32px' },
  billingHistoryContainer: { mt: '36px' },
};

export const userProfile: { [key: string]: SxProps } = {
  userProfileHide: {
    opacity: '0.3',
  },
  deactivateButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    color: '#147AE9',
    cursor: 'pointer',
  },
  downArrow: {
    position: 'absolute',
    top: '44px',
    right: 0,
    cursor: 'pointer',
    zIndex: 4,
  },
  healthConditionContainer: { width: '49%', height: 'fit-content', position: 'relative' },
  healthCondtionChips: {
    pl: 0.4,
    pb: 0.2,
    height: '37px',
    textTransform: 'capitalize',
    backgroundColor: '#E7E7EB',
    color: '#131336',
    mr: '4px',
  },
  healthOptionsModal: {
    border: '1px solid #0C72E0',
    borderRadius: '14px',
    p: '24px 16px',
    position: 'absolute',
    left: 0,
    top: '90px',
    width: '300px',
    backgroundColor: '#FFFF',
    zIndex: 9,
  },
  healthOptionsItem: { display: 'flex', mb: '16px', mt: '16px' },
  closeButtonHealthOption: { position: 'absolute', top: '8px', right: '8px', cursor: 'pointer' },
  errorMsg: { position: 'absolute', bottom: '7px', left: '0', color: 'error.main' },
  errorMessageOldNewPasswordSame: { position: 'absolute', bottom: '-32px', left: '0', color: 'error.main' },
  errorMsgGender: { position: 'absolute', bottom: '-56px', left: '0', color: 'error.main' },
  errorMsgHealthCondition: { position: 'absolute', bottom: '-4px', left: '0', color: 'error.main' },
  userProfileStatusHolder: {
    p: '29px 10px ',
    backgroundColor: 'background.light',
    width: '274px',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  userProfileStatusHolderWhite: {
    backgroundColor: 'common.white',
    width: '274px',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '16px',
  },
  userPhotoContainer: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
  },
  userProfilePhotoTitle: { mt: '16px', mb: '8px' },
  userProfileStreak: {
    display: 'flex',
    borderBottom: '1px solid primary.border',
    justifyContent: 'space-between',
    p: '10px',
  },
  userProfileStreakCommunity: {
    display: 'flex',
    borderBottom: '1px solid primary.border',
    justifyContent: 'space-between',
    pr: '24px',
    mb: '16px',
  },
  userProfileFormContainer: { width: '75%', display: 'flex', flexDirection: 'column' },
  userProfileFormContainerPassword: {
    width: '100%',
    marginBottom: '42px',
  },
  userProfileInputContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    ml: '27px',
  },
  userProfileInputFieldHolder: {
    position: 'relative',
    width: '49%',
    height: '120px',
  },
  userProfileInputFieldHolderPassword: {
    position: 'relative',
    width: '32%',
    height: '120px',
  },
  userProfileInputField: {
    borderRadius: '4px',
    width: '100%',
    textIndent: '12px',
    marginBottom: '32px',
    outline: 'none',
    '& .MuiInputBase-input.Mui-disabled': {
      WebkitTextFillColor: '#000000',
    },
    '& fieldset': { border: 'none' },
  },
  userProfileInputFieldHealthCondtions: {
    borderRadius: '4px',
    width: '100%',
    marginBottom: '24px',
    height: '56px',
    display: 'flex',
    overflowX: 'scroll',
  },
  chipsContainer: { padding: '8px 14px', display: 'flex', overflowX: 'scroll', width: '95%' },
};

export const InvoiceStyles: { [key: string]: SxProps } = {
  invoicePageWrapper: {
    mt: '0',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  invoiceWrapper: { display: 'flex', gap: '24px' },
  invoiceDetailsContainer: { border: '1px solid rgba(19, 19, 54, 0.1)', p: '40px', height: '700px', width: '70%' },
  invoiceReceiverNsender: { display: 'flex', justifyContent: 'space-between', mt: '24px' },
  invoiceRScontainer: { width: '200px' },
  invoiceRSTtitle: { mb: '12px' },
  invoiceItemTitle: { m: '24px 0' },
  invoiceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    mb: '12px',
  },
  invoiceSubHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    p: '24px 0',
    borderBottom: '1px solid rgba(19, 19, 54, 0.1)',
    borderTop: '1px solid rgba(19, 19, 54, 0.1)',
    mb: '24px',
  },
  billingDetailsContainer: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  billingDetailsItem: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '300px',
    mb: '12px',
  },
  invoiceActionsContainer: { height: '700px', width: '30%' },
  invoiceActionsTitleNbtn: { backgroundColor: '#F4F5FC', p: '24px' },
  paymentMethodTitle: { m: '24px 0' },
  makePayBtn: { borderRadius: '32px' },
  actionDownloadContainer: { display: 'flex', mt: '32px' },
  downloadTitle: { ml: '8px' },
  footerContainer: { display: 'flex', justifyContent: 'center' },
  paymentMethodDefaultCard: {
    border: '1px solid #B8B8C3',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: '24px',
    width: '200px',
    p: '12px',
    backgroundColor: '#FFFFFF',
  },
  paymentOptionsContainer: {
    border: '1px solid #B8B8C3',
    borderRadius: '4px',
    width: '200px',
    position: 'absolute',
    top: '54px',
    left: '0',
    backgroundColor: '#FFFFFF',
    zIndex: '99',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: '4px',
    width: '200px',
    p: '12px',
  },
  paymentMethodModalBackdrop: {
    position: 'fixed',
    left: '0',
    top: '0',
    backgroundColor: 'black',
    opacity: '0.001',
    width: '100vw',
    height: '100vh',
  },
};
