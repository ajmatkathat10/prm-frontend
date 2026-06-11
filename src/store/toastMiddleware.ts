import type { Middleware } from '@reduxjs/toolkit';
import { addToast } from './toastSlice';

const ENDPOINT_SUCCESS_MESSAGES: Record<string, string> = {
  createUser: 'User account provisioned successfully',
  reactivateUser: 'User account reactivated successfully',
  deactivateUser: 'User account deactivated successfully',
  resetPassword: 'Password reset successfully',
  deactivateResource: 'Resource profile deactivated successfully',
  addResourceSkill: 'Skill added to resource profile',
  updateResourceSkill: 'Skill proficiency updated successfully',
  removeResourceSkill: 'Skill removed from resource profile',
  assignManager: 'Delivery manager assigned successfully',
  createProject: 'Project profile created successfully',
  updateProject: 'Project details updated successfully',
  addMilestone: 'Project milestone added successfully',
  updateMilestoneStatus: 'Milestone status updated successfully',
  updateSettings: 'System defaults updated successfully',
  login: 'Logged in successfully',
  logout: 'Logged out successfully',
  changePassword: 'Password updated successfully',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toastMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  if (action.type.startsWith('api/') && action.meta?.arg?.type === 'mutation') {
    const endpointName = action.meta?.arg?.endpointName;

    if (action.type.endsWith('/fulfilled')) {
      const successMessage = ENDPOINT_SUCCESS_MESSAGES[endpointName];
      if (successMessage) {
        store.dispatch(addToast({ message: successMessage, type: 'success' }));
      }
    } else if (action.type.endsWith('/rejected')) {
      // Avoid showing toast on aborted/cancelled queries
      if (action.meta?.aborted) return result;
      
      const errorMessage =
        action.payload?.data?.error ||
        action.payload?.error ||
        action.error?.message ||
        'Request failed';
      
      store.dispatch(addToast({ message: errorMessage, type: 'error' }));
    }
  }

  return result;
};
