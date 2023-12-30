import createCache from '@emotion/cache';

const createEmotionCache = () => {
  return createCache({ key: 'scss' });
};

export default createEmotionCache;
