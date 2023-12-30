import { NO_HEADER_PATH, PUBLIC_PATH, PUBLIC_URLS } from '../state/constants';

const pathsWithSlice = (paths: string[]) => {
  const pathWithSlash = paths.map((p) => (p.slice(-1) === '/' ? p : `${p}/`));

  return Array.from(new Set([...NO_HEADER_PATH, ...pathWithSlash, ...PUBLIC_URLS]));
};

export function showHeader(currentPath: string) {
  const allPaths = pathsWithSlice(NO_HEADER_PATH);

  return !allPaths.includes(currentPath);
}

export function isPublicPath(currentPath: string): boolean {
  const allPaths = pathsWithSlice(PUBLIC_PATH);

  return allPaths.includes(currentPath);
}
