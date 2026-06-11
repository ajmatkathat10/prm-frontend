import type { Middleware } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authErrorMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  if (action.type.endsWith('/rejected')) {
    const status = action.payload?.status;
    const endpointName = action.meta?.arg?.endpointName;
    
    if (status === 401 && endpointName !== 'getCurrentUser') {
      store.dispatch(apiSlice.util.resetApiState());
    }
  }

  return result;
};
