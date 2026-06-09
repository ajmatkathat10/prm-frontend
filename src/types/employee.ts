export interface Skill {
  _id: string;
  name: string;
  category: 'BACKEND' | 'FRONTEND' | 'DEVOPS' | 'QA' | 'OTHER';
}

export interface EmployeeSkill {
  skillId: Skill | string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  addedAt?: string;
}

export interface Employee {
  _id: string;
  userId: string;
  managerId?: string | null;
  fullName: string;
  email: string;
  department: string;
  designation: string;
  status: 'BENCH' | 'ALLOCATED' | 'INACTIVE';
  isActive: boolean;
  skills: EmployeeSkill[];
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeesResponse {
  success: boolean;
  employees: Employee[];
}

export interface EmployeeResponse {
  success: boolean;
  employee: Employee;
}
