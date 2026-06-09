# Implementation Plan - Kanban Board POC Frontend

Implement the frontend React + TypeScript application for the Kanban Board POC. The application will consume the backend REST API, implement the four Stitch screens (Register, Login, Engineering Board, Ticket Detail) with pixel-perfect visual fidelity, and adhere to clean architecture, separating UI components from the service layer.

## Open Questions

> [!IMPORTANT]
> **CSS Styling Strategy (Tailwind CSS vs. CSS Modules & Vanilla CSS)**:
> The Stitch screens are defined using Tailwind CSS utility classes. However:
> 1. `web_application_development` instructions state: *"Avoid using TailwindCSS unless the USER explicitly requests it; in this case, first confirm which TailwindCSS version to use."*
> 2. `project-boundaries.md` lists *"CSS Modules"* as the frontend styling choice.
> 
> **How should we proceed?**
> - **Option A (Recommended)**: Install and configure **Tailwind CSS v3 / v4** in the Vite project. This will allow us to copy the Stitch HTML structure and Tailwind classes exactly, achieving 100% pixel-perfect fidelity with ease.
> - **Option B**: Write custom **CSS Modules (Vanilla CSS)** that manually reproduce all utility classes (e.g. custom layout, typography, spacings, colors, shadow styling) to keep the project clean and aligned with `project-boundaries.md`.
> 
> *Please let us know your preference (Option A with your preferred Tailwind version, or Option B).*

---

## Proposed Changes

We will build the frontend structure under `frontend/src`.

### 1. Folder Structure

```text
frontend/src/
├── assets/                  # Icons and images
├── components/
│   ├── Card.tsx             # Ticket Card on the board
│   ├── Sidebar.tsx          # Left navigation menu
│   └── TopNavbar.tsx        # Top navigation header
├── context/
│   └── AppContext.tsx       # Global state for authentication, current view, active ticket, and loading states
├── css/                     # CSS Modules or global stylesheet
│   ├── index.css            # Base styles and color tokens
│   └── App.module.css       # App shell styling
├── pages/
│   ├── BoardPage.tsx        # Engineering Board screen
│   ├── LoginPage.tsx        # Login screen
│   ├── RegisterPage.tsx     # Register screen
│   └── TicketDetailPage.tsx # Ticket Detail screen / modal overlay
├── services/
│   ├── api.ts               # Axios or Fetch wrapper with base URL, headers, and token management
│   ├── auth.service.ts      # Auth services calling /register, /login, /logout
│   ├── comment.service.ts   # Comment services calling /tickets/:id/comments
│   └── ticket.service.ts    # Ticket services calling /tickets CRUD
├── types/
│   └── index.ts             # TypeScript interfaces for User, Ticket, and Comment
├── App.tsx                  # View switcher and state coordinator
└── main.tsx                 # React entry point
```

---

### 2. Services & API Layer

#### [NEW] [api.ts](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/frontend/src/services/api.ts)
- Base HTTP client utility (using native `fetch` or `axios`) that sets `Content-Type: application/json`.
- Dynamically attaches the JWT token from `localStorage` under `Authorization: Bearer <token>` for all requests.
- Handles standard error status checks.

#### [NEW] [auth.service.ts](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/frontend/src/services/auth.service.ts)
- Communicates with `/register`, `/login`, and `/logout`.
- Stores and clears the token and user metadata in `localStorage`.

#### [NEW] [ticket.service.ts](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/frontend/src/services/ticket.service.ts)
- Interacts with GET `/tickets`, POST `/tickets`, GET `/tickets/:id`, PUT `/tickets/:id`, and DELETE `/tickets/:id`.

#### [NEW] [comment.service.ts](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/frontend/src/services/comment.service.ts)
- Interacts with GET `/tickets/:id/comments` and POST `/tickets/:id/comments`.

---

### 3. Application State Context

#### [NEW] [AppContext.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/frontend/src/context/AppContext.tsx)
- Manages authentication state (`token`, `currentUser`).
- Coordinates state switching for the current page (`register` | `login` | `board`).
- Manages `selectedTicketId` (triggers detail view overlay/modal).
- Manages list of `tickets` on the board.

---

### 4. Screen Implementations

All screens will recreate layouts, typography, spacing, material icons, and interactions exactly as defined in Stitch.

#### [NEW] [RegisterPage.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/frontend/src/pages/RegisterPage.tsx)
- Recreates the register screen with the LinearFlow card, Full Name, Email, and Password inputs. Calls `AuthService.register`.

#### [NEW] [LoginPage.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/frontend/src/pages/LoginPage.tsx)
- Recreates the login screen. Calls `AuthService.login` and transitions to the Kanban board upon successful authentication.

#### [NEW] [BoardPage.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/frontend/src/pages/BoardPage.tsx)
- Recreates the Kanban dashboard featuring search navbar, sidebar, and columns (Todo, In Progress, Complete, Closed).
- Handles dragging cards between columns (updates status in SQLite) and clicking a card to view details.

#### [NEW] [TicketDetailPage.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/frontend/src/pages/TicketDetailPage.tsx)
- Displays ticket information (description, assignee, status dropdown, priority).
- Loads and posts comments for the active ticket.
- Contains the Archive/Delete action.

---

## Verification Plan

### Manual Verification
1. Launch the backend server (`npm run dev` in `backend/`).
2. Run the Vite frontend server locally (`npm run dev` in `frontend/`).
3. Verify register, login, boarding page load, card movement (with persistence), comment additions, and logout.
4. Record validation steps and capture browser snapshots.
