# Initial Setup & Architecture Scaffolding

This document records the exact steps taken to scaffold the foundational architecture and design system of the React + Vite PRM frontend application.

## 1. Package Installation & Configuration
We installed the core UI dependencies needed for the premium design outlined in the BRD (V4):
- **`framer-motion`**: Used for fluid micro-animations (e.g. elements sliding in on the Welcome screen).
- **`lucide-react`**: Used for modern, clean iconography.
- **`clsx`**: Used to conditionally build class name strings in our reusable UI components.
- **`axios`**: Used for all REST API calls from the frontend to the Node.js backend.
- **`react-router-dom`**: Used for client-side routing between pages (Login, Dashboards, etc.).

## 2. Project Structure (React + Vite)
The frontend lives at `prm-frontend/` and is a Vite + React + TypeScript application.

```
prm-frontend/
├── src/
│   ├── App.tsx             ← Top-level router
│   ├── main.tsx            ← React entry point
│   ├── index.css           ← Global dark theme styles
│   ├── pages/              ← One file per screen (LoginPage, AdminDashboard, etc.)
│   ├── components/         ← Reusable UI components
│   ├── lib/                ← API client (axios config), utility functions
│   └── constants/          ← Strings, colors, role constants
├── docs/
│   ├── PRM_BRD_V3.md
│   ├── PRM_BRD_V4.md       ← Current active BRD
│   └── diagrams/           ← All UML and ER diagrams + PNG assets
└── public/
```

## 3. Global Styling & Dark Theme
We edited `src/index.css` to enforce a strict dark mode base theme consistent with the BRD design aesthetic.
- **Background**: `#0F172A` (Slate 900) for deep dark panels
- **Foreground**: `#F8FAFC` (Slate 50) for readable text
- **Accent**: Indigo/violet gradient for interactive elements
- **Effects**: Glassmorphism (`backdrop-blur`) for card panels

## 4. Role-Based Routing
React Router is configured in `src/App.tsx` with protected routes per role:
- `/login` → LoginPage
- `/change-password` → ChangePasswordPage (shown on first login)
- `/admin/dashboard` → AdminDashboard (Admin only)
- `/manager/dashboard` → ManagerDashboard (Manager only)
- `/employee/dashboard` → EmployeeDashboard (Employee only)

The route guard checks the JWT token role from `localStorage` before rendering any dashboard page.

## 5. Constants & Strings

All display strings, color tokens, and role enums are organized under `src/constants/`:
- **`strings/common.ts`**: Global text like "Submit", "Back", "Loading", and App Name.
- **`strings/auth.ts`**: Labels for the Login and Change Password flows.
- **`strings/roles.ts`**: Role display names (Admin, Manager, Employee).
- **`colors.ts`**: Color palette tokens matching the dark theme design system.

## 6. BRD Version Note (V4)

The active BRD is **V4** (`docs/PRM_BRD_V4.md`). Key additions vs V3:
- **Story Points** on Projects and Milestones
- **Assign Manager** screen (Admin links employees to their manager)
- **Manager team-scoped visibility** (Resource Dashboard, Allocate Resource, Timesheets show only the manager's own team)
- **Immediate status update** when ending an allocation (no scheduler delay)

All diagrams in `docs/diagrams/` reflect V4 requirements.
