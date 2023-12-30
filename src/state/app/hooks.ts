import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from './store';

// Normally hooks doesnot know about the types so
// use useAppDispatch and  useAppSelector instead of default

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
