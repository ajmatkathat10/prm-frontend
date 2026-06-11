import { apiSlice } from '../apiSlice';
import type { AdminUser, UsersResponse, UserResponse } from '@/types/user';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<AdminUser[], void>({
      query: () => '/users',
      transformResponse: (response: UsersResponse) => response.users,
      providesTags: ['User'],
    }),
    createUser: builder.mutation<AdminUser, Partial<AdminUser> & { password?: string; designation?: string }>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      transformResponse: (response: UserResponse) => response.user,
      invalidatesTags: ['User', 'Resource'],
    }),
    reactivateUser: builder.mutation<AdminUser, string>({
      query: (id) => ({
        url: `/users/${id}/reactivate`,
        method: 'POST',
      }),
      transformResponse: (response: UserResponse) => response.user,
      invalidatesTags: ['User', 'Resource'],
    }),
    deactivateUser: builder.mutation<AdminUser, string>({
      query: (id) => ({
        url: `/users/${id}/deactivate`,
        method: 'POST',
      }),
      transformResponse: (response: UserResponse) => response.user,
      invalidatesTags: ['User', 'Resource', 'Allocation'],
    }),
    resetPassword: builder.mutation<AdminUser, { userId: string; newPassword?: string }>({
      query: ({ userId, ...body }) => ({
        url: `/users/${userId}/reset-password`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: UserResponse) => response.user,
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useReactivateUserMutation,
  useDeactivateUserMutation,
  useResetPasswordMutation,
} = userApiSlice;
