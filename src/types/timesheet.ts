import type { Resource } from './resource';

export interface TimesheetEntry {
  projectId: {
    _id: string;
    name: string;
  };
  hoursWorked: number;
  activityTags: string[];
}

export interface Timesheet {
  _id: string;
  resourceId: string | Resource;
  weekStart: string;
  status: 'SUBMITTED' | 'MISSED';
  totalHours: number;
  submittedAt: string | null;
  entries: TimesheetEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TimesheetsResponse {
  success: boolean;
  timesheets: Timesheet[];
}

export interface TimesheetResponse {
  success: boolean;
  timesheet: Timesheet;
}
export interface CreateTimesheetEntryPayload {
  projectId: string;
  hoursWorked: number;
  activityTags: string[];
}

export interface SubmitTimesheetPayload {
  weekStart: string;
  entries: CreateTimesheetEntryPayload[];
}
