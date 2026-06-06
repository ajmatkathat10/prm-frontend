export const DASHBOARD_STRINGS = {
  // General layout
  OVERVIEW: "Overview",
  LOG_OUT: "Log Out",
  LOGGING_OUT: "Logging out…",
  LOADING: "Loading...",

  // Admin Dashboard
  ADMIN_PANEL: "Admin Panel",
  SYSTEM_CONTROL: "System Control",
  ADMIN_WELCOME_PREFIX: "Welcome back, ",
  ADMIN_WELCOME_SUFFIX: ". Please select a management option to proceed.",

  // Admin Options
  ADMIN_OPTION_EMPLOYEES_LABEL: "Manage Employees",
  ADMIN_OPTION_EMPLOYEES_DESC: "View details, update skills, deactivate employees, and assign managers.",
  ADMIN_OPTION_PROJECTS_LABEL: "Manage Projects",
  ADMIN_OPTION_PROJECTS_DESC: "Create projects, view details, update project fields, and manage milestones.",
  ADMIN_OPTION_ALLOCATIONS_LABEL: "View All Allocations",
  ADMIN_OPTION_ALLOCATIONS_DESC: "Monitor and review all resource allocations across company projects.",
  ADMIN_OPTION_USERS_LABEL: "Manage Users",
  ADMIN_OPTION_USERS_DESC: "Provision new accounts, view users, reset passwords, and deactivate accounts.",
  ADMIN_OPTION_SETTINGS_LABEL: "System Configuration",
  ADMIN_OPTION_SETTINGS_DESC: "Configure system threshold parameters, default hours, and AI assistant settings.",

  // Manager Dashboard
  MANAGER_PANEL: "Manager Panel",
  PROJECTS_OVERVIEW: "My Projects Overview",
  MANAGER_WELCOME_PREFIX: "Welcome back, Manager ",
  MANAGER_WELCOME_SUFFIX: ". Track team resources and milestone allocations.",

  // Manager Options
  MANAGER_OPTION_RESOURCES_LABEL: "Resource Dashboard",
  MANAGER_OPTION_RESOURCES_DESC: "View bench, partially allocated, and fully allocated employees within your team scope.",
  MANAGER_OPTION_ALLOCATE_LABEL: "Allocate Resource",
  MANAGER_OPTION_ALLOCATE_DESC: "Match employee skills and allocate team members to projects with direct V4 rules.",
  MANAGER_OPTION_PROJECTS_LABEL: "My Projects",
  MANAGER_OPTION_PROJECTS_DESC: "View and track the status, milestone schedules, and story points of projects assigned to you.",
  MANAGER_OPTION_TIMESHEETS_LABEL: "Timesheets Approval",
  MANAGER_OPTION_TIMESHEETS_DESC: "Review, approve, or reject weekly timesheet logs submitted by your team members.",
  MANAGER_OPTION_AI_LABEL: "AI Assistant",
  MANAGER_OPTION_AI_DESC: "Consult the AI helper for team matching analytics and project risk assessments.",

  // Employee Dashboard
  EMPLOYEE_PORTAL: "Employee Portal",
  MY_WORKSPACE: "My Workspace",
  EMPLOYEE_WELCOME_PREFIX: "Welcome back, ",
  EMPLOYEE_WELCOME_SUFFIX: ". Manage your weekly logging and allocation schedules.",
  TIMESHEET_REMINDER: "Timesheet Reminder",
  TIMESHEET_REMINDER_PREFIX: "⚠ Timesheet for week ending",
  TIMESHEET_REMINDER_SUFFIX: "has not been submitted. Please submit it as soon as possible.",

  // Employee Options
  EMPLOYEE_OPTION_SUBMIT_TIMESHEET_LABEL: "Submit Timesheet",
  EMPLOYEE_OPTION_SUBMIT_TIMESHEET_DESC: "Submit your weekly logged hours for manager review and approval.",
  EMPLOYEE_OPTION_MY_TIMESHEETS_LABEL: "View My Timesheets",
  EMPLOYEE_OPTION_MY_TIMESHEETS_DESC: "Look up your timesheet submission history, log states, and status flags.",
  EMPLOYEE_OPTION_MY_ALLOCATIONS_LABEL: "View My Allocations",
  EMPLOYEE_OPTION_MY_ALLOCATIONS_DESC: "Review your active project assignments, role description, and utilization targets.",
} as const;
