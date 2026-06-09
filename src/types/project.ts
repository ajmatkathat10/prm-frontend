export interface Milestone {
  _id?: string;
  title: string;
  dueDate: string;
  storyPoints: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE';
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  managerId: {
    _id: string;
    username: string;
    email: string;
  } | string;
  totalStoryPoints: number;
  healthFlag: 'ON_TRACK' | 'ATTENTION' | 'AT_RISK';
  milestones: Milestone[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectsResponse {
  success: boolean;
  projects: Project[];
}

export interface ProjectResponse {
  success: boolean;
  project: Project;
}
