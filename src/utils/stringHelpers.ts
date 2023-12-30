import { ReactNode } from 'react';
import reactStringReplace from 'react-string-replace';

// Capitalize each word in a sentence
export function capitalize(text: string) {
  text = String(text)
    .toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');

  return text;
}

// Capitalize first letter
export function capitalizeWord(string: string) {
  if (!string) return;

  return string.charAt(0).toUpperCase() + string.slice(1);
}
// lowercase first letter
export function lowerCaseWord(string: string) {
  if (!string) return;

  return string.charAt(0).toLowerCase() + string.slice(1);
}

export function hasNumber(myString: string) {
  return /\d/.test(myString);
}

// snake_case to camelCase
export const snakeToCamel = (string: string) => string.replace(/([-_]\w)/g, (m) => m[1].toUpperCase());
// camelCase to snake_case
export const camelToSnake = (string: string) => string.replace(/[\w]([A-Z])/g, (m) => m[0] + '_' + m[1]).toLowerCase();
// space case to camelCase
export const spaceToCamel = (string: string) => string.replace(/( \w)/g, (m) => m[1].toUpperCase());

export function replaceLinksInString(
  text: string,
  replaceFunction: (match: string, index: number, offset: number) => ReactNode,
) {
  return reactStringReplace(text, /<%link%>([\s\S]*?)<\/%link%>/g, replaceFunction);
}

export function padNumber(num: number | string, size: number = 5) {
  // gracefully bail out
  if (!num) return;

  num = num.toString();
  while (num.length < size) num = '0' + num;

  return num;
}

export const getRandomString = (length: number = 20) => {
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }

  return result;
};
