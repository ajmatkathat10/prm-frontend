import { apiSlice } from '../apiSlice';
import type { Timesheet, TimesheetsResponse, TimesheetResponse, SubmitTimesheetPayload } from '@/types/timesheet';

export const timesheetApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTimesheets: builder.query<Timesheet[], { weekStart?: string; resourceId?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.weekStart) queryParams.append('weekStart', params.weekStart);
          if (params.resourceId) queryParams.append('resourceId', params.resourceId);
        }
        return `/timesheets?${queryParams.toString()}`;
      },
      transformResponse: (response: TimesheetsResponse) => response.timesheets,
      providesTags: ['Timesheet'],
    }),
    submitTimesheet: builder.mutation<Timesheet, SubmitTimesheetPayload>({
      query: (body) => ({
        url: '/timesheets',
        method: 'POST',
        body,
      }),
      transformResponse: (response: TimesheetResponse) => response.timesheet,
      invalidatesTags: ['Timesheet', 'Project', 'Resource'],
    }),
  }),
});

export const { useGetTimesheetsQuery, useSubmitTimesheetMutation } = timesheetApiSlice;
