export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  isActive: boolean;
  forcePasswordChange: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  success: boolean;
  users: AdminUser[];
}

export interface UserResponse {
  success: boolean;
  user: AdminUser;
}
