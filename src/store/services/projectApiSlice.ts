import { apiSlice } from '../apiSlice';
import type { Project, ProjectsResponse, ProjectResponse } from '@/types/project';

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => '/projects',
      transformResponse: (response: ProjectsResponse) => response.projects,
      providesTags: ['Project'],
    }),
    createProject: builder.mutation<Project, Partial<Project>>({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ProjectResponse) => response.project,
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<Project, { projectId: string; data: Partial<Project> }>({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ProjectResponse) => response.project,
      invalidatesTags: ['Project'],
    }),
    addMilestone: builder.mutation<
      Project,
      { projectId: string; title: string; dueDate: string; storyPoints: number }
    >({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/milestones`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ProjectResponse) => response.project,
      invalidatesTags: ['Project'],
    }),
    updateMilestoneStatus: builder.mutation<
      Project,
      { projectId: string; milestoneId: string; status: string }
    >({
      query: ({ projectId, milestoneId, ...body }) => ({
        url: `/projects/${projectId}/milestones/${milestoneId}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: ProjectResponse) => response.project,
      invalidatesTags: ['Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useAddMilestoneMutation,
  useUpdateMilestoneStatusMutation,
} = projectApiSlice;
