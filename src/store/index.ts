import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import spinnerReducer from './spinnerSlice';
import toastReducer from './toastSlice';
import { toastMiddleware } from './toastMiddleware';
import { authErrorMiddleware } from './authErrorMiddleware';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    spinner: spinnerReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, toastMiddleware, authErrorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
