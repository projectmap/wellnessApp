const IS_EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const IS_NUMBER_REGEX = /^[0-9]+$/i;
const IS_NUMBER_REGEX_POSITIVE_NON_ZERO = /^[1-9]\d*$/i;
export const isValidEmail = (v: any) => {
  return IS_EMAIL_REGEX.test(v) || 'Please provide valid email.';
};

export const isPositiveNumber = (v: any) => {
  return IS_NUMBER_REGEX.test(v) || 'Input can not be negative.';
};

export const isNumberPositiveAndNotZero = (v: any) => {
  return IS_NUMBER_REGEX_POSITIVE_NON_ZERO.test(v) || 'Input can not be negative or zero.';
};
