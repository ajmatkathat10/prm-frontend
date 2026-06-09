import { apiSlice } from '../apiSlice';
import type { Allocation, AllocationsResponse } from '@/types/allocation';

export const allocationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAllocations: builder.query<Allocation[], { employeeId?: string; projectId?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.employeeId) queryParams.append('employeeId', params.employeeId);
          if (params.projectId) queryParams.append('projectId', params.projectId);
        }
        return `/allocations?${queryParams.toString()}`;
      },
      transformResponse: (response: AllocationsResponse) => response.allocations,
      providesTags: ['Allocation'],
    }),
  }),
});

export const { useGetAllAllocationsQuery } = allocationApiSlice;
