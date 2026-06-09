export interface Allocation {
  _id: string;
  employeeId: {
    _id: string;
    fullName: string;
    department: string;
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
