import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import spinnerReducer from './spinnerSlice';
import { authErrorMiddleware } from './authErrorMiddleware';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    spinner: spinnerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, authErrorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
