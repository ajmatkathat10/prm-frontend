export interface Skill {
  _id: string;
  name: string;
  category: 'BACKEND' | 'FRONTEND' | 'DEVOPS' | 'QA' | 'OTHER';
}

export interface ResourceSkill {
  skillId: Skill | string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  addedAt?: string;
}

export interface Resource {
  _id: string;
  userId: string;
  managerId?: string | null;
  fullName: string;
  email: string;
  designation: string;
  status: 'BENCH' | 'ALLOCATED' | 'INACTIVE';
  isActive: boolean;
  timesheetAccessFrozen?: boolean;
  skills: ResourceSkill[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ResourcesResponse {
  success: boolean;
  resources: Resource[];
}

export interface ResourceResponse {
  success: boolean;
  resource: Resource;
}
