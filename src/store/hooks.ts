import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// User-specific hooks
export const useCurrentUser = () => {
  return useAppSelector((state) => state.user.currentUser);
};

export const useUserLoading = () => {
  return useAppSelector((state) => state.user.isLoading);
};

export const useUserError = () => {
  return useAppSelector((state) => state.user.error);
};
