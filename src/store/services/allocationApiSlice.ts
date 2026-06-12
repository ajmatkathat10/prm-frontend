import { apiSlice } from '../apiSlice';
import type { Allocation, AllocationsResponse } from '@/types/allocation';

export const allocationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAllocations: builder.query<Allocation[], { resourceId?: string; projectId?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.resourceId) queryParams.append('resourceId', params.resourceId);
          if (params.projectId) queryParams.append('projectId', params.projectId);
        }
        return `/allocations?${queryParams.toString()}`;
      },
      transformResponse: (response: AllocationsResponse) => response.allocations,
      providesTags: ['Allocation'],
    }),
    createAllocation: builder.mutation<
      Allocation,
      { resourceId: string; projectId: string; utilisationPercent: number; fromDate: string; toDate: string }
    >({
      query: (body) => ({
        url: '/allocations',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { success: boolean; allocation: Allocation }) => response.allocation,
      invalidatesTags: ['Allocation', 'Resource', 'Project'],
    }),
    endAllocation: builder.mutation<Allocation, string>({
      query: (id) => ({
        url: `/allocations/${id}/end`,
        method: 'PUT',
      }),
      transformResponse: (response: { success: boolean; allocation: Allocation }) => response.allocation,
      invalidatesTags: ['Allocation', 'Resource', 'Project'],
    }),
  }),
});

export const {
  useGetAllAllocationsQuery,
  useCreateAllocationMutation,
  useEndAllocationMutation,
} = allocationApiSlice;
