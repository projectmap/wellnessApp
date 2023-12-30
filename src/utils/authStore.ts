import { IToken, refreshTokenRef, tokenRef } from '@newstart-online/sdk';
import { unVerifiedUser } from '~/config/variables';

export const IS_SERVER = typeof window === 'undefined';

export const setUnVerifiedUser = (username: string): void => {
  !IS_SERVER && localStorage.setItem(unVerifiedUser, username);
};

export const getUnVerifiedUser = (): string => {
  if (IS_SERVER) return '';

  return localStorage.getItem(unVerifiedUser) || '';
};

export const removeUnVerifiedUser = () => {
  !IS_SERVER && localStorage.removeItem(unVerifiedUser);
};

export const setTokens = (tokens: IToken) => {
  if (!IS_SERVER) {
    window.localStorage.setItem(tokenRef, tokens.accessToken);
    window.localStorage.setItem(refreshTokenRef, tokens.refreshToken);
  }
};

export const getTokens = () => {
  const tokens: IToken = {
    accessToken: (!IS_SERVER && window.localStorage.getItem(tokenRef)) || '',
    refreshToken: (!IS_SERVER && window.localStorage.getItem(refreshTokenRef)) || '',
  };

  return tokens;
};

export const clearAllTokens = () => {
  if (!IS_SERVER) {
    window.localStorage.removeItem(refreshTokenRef);
    window.localStorage.removeItem(tokenRef);
    window.localStorage.removeItem('persist:authSlice');
  }
};
