import { apiSlice } from '../apiSlice';
import type { SystemConfig, SettingsResponse } from '@/types/settings';

export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<SystemConfig, void>({
      query: () => '/settings',
      transformResponse: (response: SettingsResponse) => response.settings,
      providesTags: ['User'],
    }),
    updateSettings: builder.mutation<SystemConfig, Partial<SystemConfig>>({
      query: (body) => ({
        url: '/settings',
        method: 'PUT',
        body,
      }),
      transformResponse: (response: SettingsResponse) => response.settings,
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApiSlice;
