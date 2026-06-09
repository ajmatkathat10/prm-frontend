import { apiSlice } from '../apiSlice';
import type { Employee, EmployeesResponse, EmployeeResponse } from '@/types/employee';

export const employeeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], { status?: string; department?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.status) queryParams.append('status', params.status);
          if (params.department) queryParams.append('department', params.department);
        }
        return `/employees?${queryParams.toString()}`;
      },
      transformResponse: (response: EmployeesResponse) => response.employees,
      providesTags: ['Employee'],
    }),
    deactivateEmployee: builder.mutation<Employee, string>({
      query: (id) => ({
        url: `/employees/${id}/deactivate`,
        method: 'POST',
      }),
      transformResponse: (response: EmployeeResponse) => response.employee,
      invalidatesTags: ['Employee', 'User', 'Allocation'],
    }),
    addEmployeeSkill: builder.mutation<
      Employee,
      { employeeId: string; name: string; category: string; proficiency: string }
    >({
      query: ({ employeeId, ...body }) => ({
        url: `/employees/${employeeId}/skills`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: EmployeeResponse) => response.employee,
      invalidatesTags: ['Employee'],
    }),
    updateEmployeeSkill: builder.mutation<
      Employee,
      { employeeId: string; skillId: string; proficiency: string }
    >({
      query: ({ employeeId, skillId, ...body }) => ({
        url: `/employees/${employeeId}/skills/${skillId}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: EmployeeResponse) => response.employee,
      invalidatesTags: ['Employee'],
    }),
    removeEmployeeSkill: builder.mutation<Employee, { employeeId: string; skillId: string }>({
      query: ({ employeeId, skillId }) => ({
        url: `/employees/${employeeId}/skills/${skillId}`,
        method: 'DELETE',
      }),
      transformResponse: (response: EmployeeResponse) => response.employee,
      invalidatesTags: ['Employee'],
    }),
    assignManager: builder.mutation<Employee, { employeeUserId: string; managerUserId: string }>({
      query: (body) => ({
        url: '/employees/assign-manager',
        method: 'POST',
        body,
      }),
      transformResponse: (response: EmployeeResponse) => response.employee,
      invalidatesTags: ['Employee'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useDeactivateEmployeeMutation,
  useAddEmployeeSkillMutation,
  useUpdateEmployeeSkillMutation,
  useRemoveEmployeeSkillMutation,
  useAssignManagerMutation,
} = employeeApiSlice;
