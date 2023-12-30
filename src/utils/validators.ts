// Default validation rules:
//     matchRegexp
//     isEmail
//     isEmpty
//     required
//     trim
//     isNumber
//     isFloat
//     isPositive
//     minNumber
//     maxNumber
//     minFloat
//     maxFloat
//     isString
//     minStringLength
//     maxStringLength
//     maxFileSize
//     allowedExtensions

const IS_NUMBER_REGEX = /^[0-9]+$/i;
const IS_ARABIC_NUMBER_REGEX = /[\u0660-\u0669\u06F0-\u06F9]/i;
const IS_EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export const oneNumberRegex = /^(?=.*\d)/;
export const upperCaseRegex = /^(?=.*[A-Z])/;
export const lowerCaseRegex = /^(?=.*[a-z])/;
export const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/;

export const isEmail = (v: string) => IS_EMAIL_REGEX.test(v);
export const isNumber = (v: string) => IS_NUMBER_REGEX.test(v);
export const isArabicNum = (v: string) => IS_ARABIC_NUMBER_REGEX.test(v);
