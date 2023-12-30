import { useRef, useEffect, MutableRefObject } from 'react';

export const useInterval = (callback: Function, delay: number) => {
  const savedCallback: MutableRefObject<Function | null> = useRef(null);
  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);

      return () => clearInterval(id);
    }
  }, [delay]);
};
