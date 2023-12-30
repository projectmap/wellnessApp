import { IS_SERVER } from './authStore';
import { IPermission, IScreenResponse } from '@newstart-online/sdk';

// Check deep object equality
export const isObjectEqual = (obj1: any, obj2: any) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

const SELF = '_self';
export const launchURI = (url: string) => {
  if (IS_SERVER) {
    return;
  }
  const windowProxy = window.open(url, SELF);
  if (windowProxy) {
    return Promise.resolve(windowProxy);
  } else {
    return Promise.reject();
  }
};

export const getPermissionScreen = (filteringScreen: IPermission[], allScreen: any[]) => {
  return allScreen
    .filter((item) => filteringScreen?.some((permission) => permission.screenId.name === item.name))
    .map((screen) => {
      const permissions = filteringScreen?.find((item) => item.screenId.name === screen.name);
      const hasPermission: boolean =
        permissions?.operations['canRead'] ||
        permissions?.operations['canUpdate'] ||
        permissions?.operations['canCreate'] ||
        permissions?.operations['canDelete'] ||
        false;

      const data = {
        ...screen,
        hasPermission,
        subScreens: getPermissionScreen(filteringScreen, screen?.subScreens),
        permissions,
      } as IScreenResponse;

      return data;
    });
};

// eslint-disable-next-line no-unused-vars
export type FunctionWithParam<T> = (p: T) => void;
export type FunctionWithNoParam = () => void;
export type Nullable<T> = T | null;

export const removeDuplicates = (Array: any[]) => {
  const newArray = Array.filter(
    (data, i, prevArr) => prevArr.findIndex((prevArrData) => prevArrData._id === data._id) === i,
  );
  const newSortedArray = newArray.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return newSortedArray;
};

export const deactivateUserName = 'NEWSTART user';

type AnyFunction = (...args: any[]) => any;

export function debounce<F extends AnyFunction>(func: F, delay: number): (...args: Parameters<F>) => void {
  let timerId: ReturnType<typeof setTimeout> | null;

  return function (this: any, ...args: Parameters<F>): void {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
