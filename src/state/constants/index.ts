export const NO_HEADER_PATH: string[] = [
  '/user/signin',
  '/user/login',
  '/user/signup',
  '/user/verify-user',
  '/user/add-new-password',
  '/user/forget-password/',
  '/user/reset-password-notice',
];

export const GIFT_CARD_COST = 119.88;

export const PUBLIC_URLS = [
  '/terms-and-conditions',
  '/privacy-policy',
  '/help',
  '/faq',
  '/gift-card',
  '/gift-card/gift-purchased',
  '/landing-page',
];

export const PUBLIC_URLS_FOR_REDIRECT = [
  '/terms-and-conditions/',
  '/privacy-policy/',
  '/help/',
  '/faq/',
  '/user/verify-user/',
  '/user/signin/',
  '/user/signup/',
  '/gift-card/',
  '/gift-card/gift-purchased/',
  '/landing-page/',
];

export const HOME_PAGE = '/';

export const USER_ONBOARDING_ROUTING = {
  VERIFY_USER: '/user/verify-user',
  SIGN_IN: '/user/signin/',
  SIGN_UP: '/user/signup',
};

export const PUBLIC_PATH: string[] = [...NO_HEADER_PATH, ...PUBLIC_URLS];

export const DB_OPERATION = {
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
};

export const DEFAULT_AVATAR = '/assets/images/avatar.png';

export const USER_LIST_TYPE = {
  FRIENDS: 'friends',
  TO_FOLLOW: 'to-follow',
  REQUESTS: 'requests',
};

export const PUBLIC_LEVEL = 'public';

export const LEARN_PAGE_BLOGS_CATEGORIES_FILTER_LIST = {
  ALL: 'all',
  RECIPES: 'recipes',
  ARTICLES: 'articles',
  HEALTH_TIPS: 'health tips',
};

export const LEARN_PAGE_BLOGS_ROUTING = {
  ARTICLES: '/user/learn/resources/articles',
  RECIPES: '/user/learn/resources/recipes',
  HEALTH_TIPS: '/user/learn/resources/health-tips',
  MORE_RECOMMENDATION: '/user/learn/resources/more-recommendation',
  VIDEOS: '/user/learn/resources/videos',
  DETAILS: '/user/learn/resources/detail',
  FAVORITE_RECIPES: '/user/learn/resources/favorite-recipes',
};

export const COMMUNITY_PAGE_ROUTING = {
  PROFILE: '/user/community/profile',
  FRIENDS: '/user/community/friends',
  CHAT: '/user/community/chat',
  FEED: '/user/community/feed/',
  FEEDS_DYNAMIC: '/user/community/feeds/',
};

export const RESOURCE_SHARE_ROUTING = {
  RESOURCES: '/user/learn/resources/detail',
  RECIPE: '/user/learn/recipe/',
  COURSE: '/user/learn/courses/',
};

export const BADGES_PAGE_ROUTING = {
  BADGES: '/user/badges',
};

export const GIFT_CETIFICATE_ROUTING = {
  GIT_CARD: '/gift-card/',
  GIFT_PURCHAED_SUCCESS_PAGE: '/gift-card/gift-purchased/',
};

export const LEARN_PAGE_ROUTING = {
  COURSE: '/user/learn/course',
  DIET: '/user/learn/diet',
};

export const PROFILE_ID_ROUTING = {
  PROFILE: '/profile',
};

export const ME_PAGE_ROUTING = {
  ME: '/user/me/mePage/',
};

export const ACCOUNT_BILLING_PAGE_ROUTING = {
  ACCOUNT: '/user/more/account/',
  BILLING: 'user/more/profile/',
};

export const HEADER_WITH_SUB_HEADER = {
  LEARN: 'learn',
  COMMUNITY: 'community',
  ME: 'me',
  MORE: 'more',
  RECORD: 'record',
};

export const MEALPLAN_START_DATE_MULTIPLIER = {
  MULTIPLIER: 86400000, // in milliseconds
};
export enum FRIEND_LISTS {
  SUGGESTED_FRIENDS = 'to-follow',
  FRIEND_REQUESTS = 'requests',
  ALL_FRIENDS = 'friend',
}

export const USER_SUBSCRIPTION_TYPE = {
  FREE_TRIAL: 'Free trial',
  FREE_USER: 'Free User',
  MONTHLY: 'Monthly',
  ANNUAL: 'Yearly',
};

export const USER_SUBSCRIPTION_DURATION = {
  FREE_TRIAL: '14 days',
  FREE_USER: '',
  MONTHLY: '$12.99 USD/mo',
  ANNUAL: '$9.99 USD/mo',
};

export enum USER_ONBOARDING_STEPS {
  GENERAL_INFO = 1,
  HEALTH_INFO = 2,
  USER_AVATAR = 3,
  REMOVE_ACTIVE_STEP = 4,
}

export const CONFIRMATION_MODAL_INFO = {
  SUBSCRIPTION_CANCELLED: 'SUBSCRIPTION_CANCELLED',
  SUBSCRIPTION_CANCELLED_TITLE: 'Your subscription has been cancelled',
  SUBSCRIPTION_CANCELLED_BUTTON: 'Okay',
  UNFRIEND: 'UNFRIEND',
  UNFRIEND_MESSAGE: 'Are you sure you want to unfriend this user ?',
  UNFRIEND_TITLE: 'Unfriend this user ?',
  CANCEL_UNFRIEND_BUTTON: 'Cancel',
  UNFRIEND_BUTTON: 'Unfriend',
  HIDE_POST: 'HIDE_POST',
  HIDE_POST_TITLE: 'Hide this post ?',
  HIDE_POST_MESSAGE: 'Are you sure you want to hide this post ?',
  HIDE_POST_BUTTON: 'Hide',
  HIDE_POST_FROM_THIS_USER: 'HIDE_POST_FROM_THIS_USER',
  HIDE_POST_FROM_THIS_USER_TITLE: 'Hide all posts from this user ?',
  HIDE_POST_FROM_THIS_USER_MESSAGE: 'Do you want to hide all posts from this user ?',
  HIDE_POST_FROM_THIS_USER_BUTTON: 'Hide',
  UNHIDE_POST_FROM_THIS_USER: 'SHOW_POST_FROM_THIS_USER',
  UNHIDE_POST_FROM_THIS_USER_TITLE: 'Show all posts from this user ?',
  UNHIDE_POST_FROM_THIS_USER_MESSAGE: 'Do you want to show all posts from this user ?',
  UNHIDE_POST_FROM_THIS_USER_BUTTON: 'Show',
  DELETE: 'DELETE',
  DEACTIVATE_ACCOUNT: 'DEACTIVATE_ACCOUNT',
  DEACTIVATE_BUTTON: 'Deactivate',
  CANCEL_SUBSCRIPTION: 'CANCEL_SUBSCRIPTION',
  CANCEL_SUBSCRIPTION_BUTTON: 'Yes',
  SET_AS_DEFAULT: 'SET_AS_DEFAULT',
  SET_AS_DEFAULT_BUTTON: 'Set as Default',
  DEFAULT_TITLE: 'Set this card as default?',
  DEFAULT_MESSAGE: 'Are you sure you want to set this card as default ?',
  CANCEL_SUBSCRIPTION_TITLE: 'Cancel your subscription?',
  CANCEL_SUBSCRIPTION_MESSAGE: 'Once your current billing cycle has ended, this will discontinue your subscription.',
  DELETE_TITLE: 'Delete this card?',
  DELETE_BUTTON: 'Delete',
  DELETE_MESSAGE: 'Are you sure you want to delete this card ?',
  DEACTIVATE_ACCOUNT_TITLE: 'Deactivate account?',
  DEACTIVATE_ACCOUNT_MESSAGE: `You're about to temporarily deactivate your account. When you login again, your account will be activated.`,
};

export const COURSE_TAB_LIST = {
  OVERVIEW: 'Overview',
  COURSE_STATS: 'Course Stats',
  NOTES: 'Notes',
  HANDOUT: 'Handout',
};

export const USER_ROUTING = {
  RECORD: '/user/record/new-data/',
};

export const USER_COMMUNITY_SEARCH = {
  SEARCH: '/user/community/search',
};
export const SCREEN_TYPE = {
  DROPDOWN: 'DROPDOWN',
  COMMUNITY: 'community',
};

export const MESSAGE_DELETED_TEXT = {
  DELETE_MSG: 'Message deleted',
};

export const USER_ID_FOR_USER_VERIFICATION = 'userid';

export const PAY_NOW_OPTIONS = {
  INVOICE_PAYMENT: 'INVOICE_PAYMENT',
  SUBSCRIBE_PAYMENT: 'SUBSCRIBE_PAYMENT',
};

export const EMPTY_BADGE_DATA = {
  INFO: 'There are currently no badges earned. You can see which badges you can earn.',
  INFOR_OTHER_USERS: 'No badges available for display.',
};

export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
  PREFER_NOT_SAY = 'prefer not to say',
}

export enum ONBOARDING_MEASUREMENT_UNITS {
  KG = 'kg',
  POUND = 'pound',
  FEET = 'feet',
  CM = 'cm',
}

export enum COMMUNITY_SHARE_MODAL_TYPE {
  sharedResource = 'sharedResource',
  sharedLecture = 'sharedLecture',
  sharedBadge = 'sharedBadge',
  sharedRecipe = 'sharedRecipe',
  sharedPost = 'sharedPost',
}

export enum BADGE_MODAL_IFNO_TYPE {
  INFO_ONLY = 'info only',
  CONGRATULATIONS = 'congratulations',
}

export enum USER_TYPE_FOR_BADGES {
  OTHER_USER = 'OTHER_USER',
  CURRENT_USER = 'CURRENT_USER',
}

export enum USER_MINIMUM_AGE_DIFFERENCE {
  MIN = 18,
  MAX = 125,
}

export const PAYMENT_CARD_BRANDS = ['visa', 'mastercard', 'amex'];

export enum MEAL_TYPE_FOR_MEALPLAN {
  BREAKFASTS = 'BREAKFASTS',
  LUNCH = 'LUNCH',
}

export const RESOURCES_LOADING_THUMBNAIL =
  'https://newstart-dev-bucket.s3.us-east-2.amazonaws.com/ResourcesLoadingThumbnail.png';

export const DEACTIVATING_USER_IMAGE = 'https://newstart-dev-bucket.s3.us-east-2.amazonaws.com/user.png';

export const optionsHealthConditions = [
  { value: 'Cancer', label: 'Cancer' },
  { value: 'High Blood Pressure', label: 'High Blood Pressure' },
  { value: 'High Cholesterol', label: 'High Cholesterol' },
  { value: 'Cardiovascular Disease', label: 'Cardiovascular Disease' },
  { value: 'Diabetes', label: 'Diabetes' },
  { value: 'Hyperthyroidism', label: 'Hyperthyroidism' },
  { value: 'Hypothyroidism', label: 'Hypothyroidism' },
  // { value: 'Others', label: 'Others' },
];
