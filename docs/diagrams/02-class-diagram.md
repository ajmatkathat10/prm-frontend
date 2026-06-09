# Class Diagram — Project & Resource Management (PRM) Tool

## Overview

The Class Diagram defines the **static structure** of the system — the domain entities (classes), their attributes, methods, and relationships. Think of this as the blueprint for both the database schema and the object model used throughout the backend services.

This diagram follows a layered domain model approach: **Entities → Services → Repositories**, aligned with SOLID principles as required by the BRD.

---

## Diagram

![Class Diagram — PRM Tool](./assets/class-diagram.png)

---

## Relationships & Cardinality

The diagram uses simple **1** and **M** labels to denote relationships between entities:

| From Class | To Class | Cardinality | Purpose |
|------------|----------|-------------|---------|
| `User` | `Employee` | 1 to 1 | A User maps to exactly one Employee profile (Admins have none). |
| `User` | `Project` | 1 to M | A User (Manager) manages multiple Projects. |
| `Employee` | `IEmployeeSkill` | 1 to M | An Employee has multiple embedded skills. |
| `Skill` | `IEmployeeSkill` | 1 to M | A Skill is referenced in multiple Employee skill records. |
| `Employee` | `Allocation` | 1 to M | An Employee can have multiple allocations. |
| `Project` | `Allocation` | 1 to M | A Project receives multiple allocations. |
| `Employee` | `Timesheet` | 1 to M | An Employee submits multiple weekly timesheets. |
| `Timesheet` | `ITimesheetEntry` | 1 to M | A Timesheet contains multiple entry rows. |
| `Project` | `ITimesheetEntry` | 1 to M | Hours are logged against a Project via Timesheet entries. |
| `Project` | `IMilestone` | 1 to M | A Project has multiple milestones. |

---

## Entity Descriptions

### Core Entities

#### `User`
The **authentication identity** of a person in the system. Every person who can log in has a User record.

| Attribute | Type | Purpose |
|-----------|------|---------|
| `username` | string (unique) | Login identifier |
| `email` | string (unique) | Contact and identity |
| `passwordHash` | string | Bcrypt/hashed password — never stored plain |
| `role` | 'ADMIN' \| 'MANAGER' \| 'EMPLOYEE' | Role determining access and menu scoping |
| `isActive` | boolean | Controls login access. False = blocked |
| `forcePasswordChange` | boolean | Set to true when Admin creates account. Must change on first login. |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last updated timestamp |

---

#### `Employee`
The **work profile** of an individual contributor or manager. Linked to a `User` via `userId`.

| Attribute | Type | Purpose |
|-----------|------|---------|
| `userId` | ObjectId | Links to the `User` record — one-to-one |
| `managerId` | ObjectId (nullable) | Links to the Manager's `User` record |
| `fullName` | string | Display name shown in dashboards |
| `email` | string | Work email address |
| `department` | string | Used for grouping in Resource Dashboard |
| `designation` | string | Job title |
| `status` | 'BENCH' \| 'ALLOCATED' \| 'INACTIVE' | Computed status based on active allocations |
| `isActive` | boolean | Set to false on deactivation |
| `skills` | IEmployeeSkill[] | Embedded array of skills |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last updated timestamp |

---

#### `IEmployeeSkill` (Embedded Document)
Nested schema representing skill proficiency details of an employee. Embedded directly inside the `Employee` schema.

| Attribute | Type | Purpose |
|-----------|------|---------|
| `skillId` | ObjectId | Links to the master `Skill` schema |
| `proficiency` | 'BEGINNER' \| 'INTERMEDIATE' \| 'ADVANCED' | Skill capability tier |
| `addedAt` | Date | When this skill was added to the employee |

---

#### `Skill`
A master list of all skill types available in the system. Admin-managed.

| Attribute | Type | Purpose |
|-----------|------|---------|
| `name` | string (unique) | e.g. "React", "NodeJS", "Kubernetes" |
| `category` | 'BACKEND' \| 'FRONTEND' \| 'DEVOPS' \| 'QA' \| 'OTHER' | Skill classification |

---

#### `Project`
Represents a client-facing delivery project managed by a Manager.

| Attribute | Type | Purpose |
|-----------|------|---------|
| `name` | string | Project display name |
| `description` | string | Optional description |
| `startDate` | Date | Project start date |
| `endDate` | Date | Project end date |
| `status` | 'PLANNED' \| 'ACTIVE' \| 'ON_HOLD' \| 'COMPLETED' | Project lifecycle status |
| `managerId` | ObjectId | The Manager responsible for this project |
| `totalStoryPoints` | number | Total story points for the project |
| `healthFlag` | 'ON_TRACK' \| 'ATTENTION' \| 'AT_RISK' | Set by scheduler using milestones + timesheets |
| `milestones` | IMilestone[] | Embedded array of checkpoints |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last updated timestamp |

---

#### `IMilestone` (Embedded Document)
Key checkpoint deliverable inside a project. Embedded directly inside the `Project` schema.

| Attribute | Type | Purpose |
|-----------|------|---------|
| `title` | string | Milestone name |
| `dueDate` | Date | Scheduled deadline |
| `storyPoints` | number | Complexity/size points |
| `status` | 'NOT_STARTED' \| 'IN_PROGRESS' \| 'DONE' | Milestone completion status |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last updated timestamp |

---

#### `Allocation`
The record of an employee being assigned to a project at a specific utilisation %.

| Attribute | Type | Purpose |
|-----------|------|---------|
| `employeeId` | ObjectId | Reference to `Employee` |
| `projectId` | ObjectId | Reference to `Project` |
| `utilisationPercent` | number | 1–100. Overlapping active allocations cannot exceed 100% |
| `fromDate` | Date | Start of the allocation |
| `toDate` | Date | End of the allocation |
| `status` | 'ACTIVE' \| 'ENDED' | Allocation status |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last updated timestamp |

---

#### `Timesheet`
One timesheet per employee per week. Tracks submission status.

| Attribute | Type | Purpose |
|-----------|------|---------|
| `employeeId` | ObjectId | Reference to `Employee` |
| `weekStart` | Date | Always a Monday. Unique weekly key per employee |
| `status` | 'SUBMITTED' \| 'MISSED' | Submission compliance status |
| `totalHours` | number | Sum of logged hours in entries |
| `submittedAt` | Date \| null | When timesheet was submitted |
| `entries` | ITimesheetEntry[] | Embedded array of logs per project |
| `createdAt` | Date | Creation timestamp |

---

#### `ITimesheetEntry` (Embedded Document)
Individual project log entry. Embedded directly inside the `Timesheet` schema.

| Attribute | Type | Purpose |
|-----------|------|---------|
| `projectId` | ObjectId | Reference to `Project` |
| `hoursWorked` | number | Hours logged for this project |
| `activityTags` | string[] | Array of tags describing the tasks performed |

---

#### `SystemConfig`
A singleton configuration table. Only one row ever exists.

| Attribute | Type | Purpose |
|-----------|------|---------|
| `id` | number | Singleton enforcement key (always 1) |
| `llmProvider` | string | "Gemini" |
| `llmApiKey` | string | AI API Key |
| `schedulerIntervalHours` | number | Background scheduler job interval |
| `maxWeeklyHours` | number | Cap on weekly timesheet hours (default: 40) |
| `updatedAt` | Date | Last updated timestamp |

---

## Service Layer Descriptions

| Service | Responsibility |
|---------|---------------|
| `AuthService` | Login, logout, password change policy enforcement |
| `EmployeeService` | CRUD operations for employees and mapping their embedded skills |
| `ProjectService` | CRUD operations for projects and their embedded milestones |
| `AllocationService` | Allocation creation, overlap utilisation validations, status updates |
| `TimesheetService` | Timesheet submission and embedded entries validations |
| `AIService` | Natural language resource matching and health risk prompts using Gemini |
| `SchedulerService` | Background triggers for health flags, resource bench status, and missed timesheets |
