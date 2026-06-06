# Project & Resource Management (PRM) Tool — Frontend

This is the React frontend application for the Project & Resource Management (PRM) Tool, built using Vite, TypeScript, Tailwind CSS v4, and Redux Toolkit Query for state management.

---

## 🚀 Tech Stack

*   **Framework**: React (v19) + Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4
*   **State Management & API**: Redux Toolkit Query (RTK Query)
*   **Icons**: Lucide React

---

## 📂 Project Structure

```
prm-frontend/
├── src/
│   ├── components/         # Reusable UI components & layouts (DashboardLayout, AuthLayout, RoleGuard)
│   ├── constants/          # Application strings, theme configurations, colors
│   ├── hooks/              # Custom React hooks (useAuth session encapsulation)
│   ├── lib/                # Shared utilities (Tailwind classes merger)
│   ├── pages/              # Page views (LoginPage, WelcomePage, Dashboards, etc.)
│   ├── store/              # Centralized Redux Store & apiSlice configuration
│   │   └── services/       # Domain-specific RTK Query endpoint service files (Option B)
│   ├── types/              # Shared TypeScript definitions
│   ├── App.tsx             # Main routing configuration with strict RoleGuard wrapping
│   ├── index.css           # Global Tailwind CSS definitions
│   └── main.tsx            # Application entry point with Redux Provider
├── docs/                   # BRD documentation, architecture logs, progress, & diagrams
└── package.json            # Scripts & dependencies configuration
```

---

## 🛠️ Setup & Local Development

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed.

### 2. Install Dependencies
Run the following command in the frontend root:
```bash
npm install
```

### 3. Run Development Server
Start Vite's dev server:
```bash
npm run dev
```
By default, the frontend runs on **`http://localhost:5173`**.

---

## 📚 Development Standards & Guidelines

*   **Redux RTK Query Option B Structure**: Always define new domain queries/mutations inside a service module under `src/store/services/` (e.g. `src/store/services/employeeApiSlice.ts`) injecting them into the parent `apiSlice`.
*   **Encapsulate State in Custom Hooks**: Cleanly wrap raw RTK Query hooks and status flags inside custom domain hooks under `src/hooks/` (e.g. `useAuth.ts`) to avoid importing store dependencies directly in UI page components.
*   **Styling Consistency**: Follow the Slate-900 based clean corporate dark-mode theme. Keep the UI design professional, using flat layout components, basic Tailwind boundaries, and standard static elements without flashy visual animations or gradient glows.
*   **Detailed Context**: Always reference [CONTEXT.md](file:///Users/ajmatkathat/Desktop/vscodefolders/prm-frontend/docs/engineering/CONTEXT.md) at the start of a session for coding standards and schema rules.
