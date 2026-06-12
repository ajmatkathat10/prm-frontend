export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  forcePasswordChange: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: SessionUser;
}

export interface CurrentUserResponse {
  user: SessionUser | null;
}

export interface LoginResponse {
  success: boolean;
  user?: SessionUser;
  otpRequired?: boolean;
  userId?: string;
}

export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  ADMIN: '/dashboard/admin',
  MANAGER: '/dashboard/manager',
  EMPLOYEE: '/dashboard/employee',
};
