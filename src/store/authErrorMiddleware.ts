import type { Middleware } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

export const authErrorMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  const typedAction = action as { type?: string; payload?: { status?: number }; meta?: { arg?: { endpointName?: string } } };
  if (typedAction && typeof typedAction.type === 'string' && typedAction.type.endsWith('/rejected')) {
    const status = typedAction.payload?.status;
    const endpointName = typedAction.meta?.arg?.endpointName;
    
    if (status === 401 && endpointName !== 'getCurrentUser') {
      store.dispatch(apiSlice.util.resetApiState());
    }
  }

  return result;
};
