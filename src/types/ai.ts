export interface SkillMatchCandidate {
  resourceId: string;
  name: string;
  reason: string;
  suggestedAllocation?: number;
  isUnderManager?: boolean;
  designation?: string;
  skills?: string[];
  freeHours?: number;
  currentAllocations?: string[];
  recentActivityTags?: string[];
}

export interface SkillMatchRequest {
  requirement: string;
  projectId?: string;
}

export interface SkillMatchResponse {
  success: boolean;
  summary: string;
  results: SkillMatchCandidate[];
  message?: string;
  modelUsed?: string;
}

export interface RiskSummaryRequest {
  projectId: string;
}

export interface RiskSummaryResponse {
  success: boolean;
  summary: string;
  modelUsed?: string;
}

export interface TeamMatchRequest {
  requirement: string;
  projectId?: string;
}

export interface TeamRoleMatchResult {
  roleName: string;
  status: 'FILLED' | 'UNFILLED';
  assignedResource?: {
    resourceId: string;
    name: string;
    reason: string;
    designation?: string;
    skills?: string[];
    freeHours?: number;
    currentAllocations?: string[];
  };
  unfilledReason?: string;
}

export interface TeamMatchResponse {
  success: boolean;
  summary: string;
  assignments: TeamRoleMatchResult[];
  modelUsed?: string;
}
