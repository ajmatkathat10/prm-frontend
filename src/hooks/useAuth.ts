import { useGetCurrentUserQuery, useLoginMutation, useLogoutMutation, useChangePasswordMutation } from '@/store/services/authApiSlice';

export function useAuth() {
  const { data: user, isLoading, isError, refetch } = useGetCurrentUserQuery();
  const [loginMutation, loginResult] = useLoginMutation();
  const [logoutMutation, logoutResult] = useLogoutMutation();
  const [changePasswordMutation, changePasswordResult] = useChangePasswordMutation();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'MANAGER';
  const isEmployee = user?.role === 'EMPLOYEE';
  const forcePasswordChange = user?.forcePasswordChange ?? false;

  return {
    user,
    isLoading,
    isError,
    isAuthenticated,
    isAdmin,
    isManager,
    isEmployee,
    forcePasswordChange,
    refetch,
    login: loginMutation,
    loginStatus: loginResult,
    logout: logoutMutation,
    logoutStatus: logoutResult,
    changePassword: changePasswordMutation,
    changePasswordStatus: changePasswordResult,
  };
}
