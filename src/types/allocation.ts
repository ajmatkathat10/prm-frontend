export interface Allocation {
  _id: string;
  resourceId: {
    _id: string;
    fullName: string;
  };
  projectId: {
    _id: string;
    name: string;
  };
  utilisationPercent: number;
  fromDate: string;
  toDate: string;
  status: 'ACTIVE' | 'ENDED';
  createdAt?: string;
  updatedAt?: string;
}

export interface AllocationsResponse {
  success: boolean;
  allocations: Allocation[];
}
