import { apiSlice } from '../apiSlice';
import type { Resource, ResourcesResponse, ResourceResponse } from '@/types/resource';

export const resourceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getResources: builder.query<Resource[], { status?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.status) queryParams.append('status', params.status);
        }
        return `/resources?${queryParams.toString()}`;
      },
      transformResponse: (response: ResourcesResponse) => response.resources,
      providesTags: ['Resource'],
    }),
    deactivateResource: builder.mutation<Resource, string>({
      query: (id) => ({
        url: `/resources/${id}/deactivate`,
        method: 'POST',
      }),
      transformResponse: (response: ResourceResponse) => response.resource,
      invalidatesTags: ['Resource', 'User', 'Allocation'],
    }),
    addResourceSkill: builder.mutation<
      Resource,
      { resourceId: string; name: string; category: string; proficiency: string }
    >({
      query: ({ resourceId, ...body }) => ({
        url: `/resources/${resourceId}/skills`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ResourceResponse) => response.resource,
      invalidatesTags: ['Resource'],
    }),
    updateResourceSkill: builder.mutation<
      Resource,
      { resourceId: string; skillId: string; proficiency: string }
    >({
      query: ({ resourceId, skillId, ...body }) => ({
        url: `/resources/${resourceId}/skills/${skillId}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: ResourceResponse) => response.resource,
      invalidatesTags: ['Resource'],
    }),
    removeResourceSkill: builder.mutation<Resource, { resourceId: string; skillId: string }>({
      query: ({ resourceId, skillId }) => ({
        url: `/resources/${resourceId}/skills/${skillId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ResourceResponse) => response.resource,
      invalidatesTags: ['Resource'],
    }),
    assignManager: builder.mutation<Resource, { employeeUserId: string; managerUserId: string }>({
      query: (body) => ({
        url: '/resources/assign-manager',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ResourceResponse) => response.resource,
      invalidatesTags: ['Resource'],
    }),
    getMyResource: builder.query<Resource, void>({
      query: () => '/resources/me',
      transformResponse: (response: ResourceResponse) => response.resource,
      providesTags: ['Resource'],
    }),
    restoreTimesheetAccess: builder.mutation<Resource, string>({
      query: (id) => ({
        url: `/resources/${id}/restore-timesheet-access`,
        method: 'POST',
      }),
      transformResponse: (response: ResourceResponse) => response.resource,
      invalidatesTags: ['Resource'],
    }),
  }),
});

export const {
  useGetResourcesQuery,
  useDeactivateResourceMutation,
  useAddResourceSkillMutation,
  useUpdateResourceSkillMutation,
  useRemoveResourceSkillMutation,
  useAssignManagerMutation,
  useGetMyResourceQuery,
  useRestoreTimesheetAccessMutation,
} = resourceApiSlice;
