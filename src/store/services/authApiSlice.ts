import { apiSlice } from '../apiSlice';
import type { AuthResponse, CurrentUserResponse, SessionUser, LoginResponse } from '@/types/auth';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { username: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => response,
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    getCurrentUser: builder.query<SessionUser | null, void>({
      query: () => '/auth/current-user',
      transformResponse: (response: CurrentUserResponse) => response.user,
      providesTags: ['User'],
    }),
    changePassword: builder.mutation<SessionUser, { newPassword: string }>({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
      transformResponse: (response: AuthResponse) => response.user,
      invalidatesTags: ['User'],
    }),
    verifyOtp: builder.mutation<SessionUser, { userId: string; otp: string }>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
      transformResponse: (response: AuthResponse) => response.user,
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useChangePasswordMutation,
  useVerifyOtpMutation,
} = authApiSlice;
