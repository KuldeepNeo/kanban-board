# Kanban Board POC - Frontend Application

This is the frontend user interface for the Kanban Board Proof of Concept (POC). It is built with **React**, **TypeScript**, and **Vite**, and styled with **Tailwind CSS**. It replicates the Stitch designs for Register, Login, Engineering Board, and Ticket Detail screens with pixel-perfect visual fidelity.

## Features

- **Layered Architecture**: Complete separation of concerns. UI components consume services; APIs are never called directly inside UI views.
- **Stateless JWT Session Management**: Automatically handles token storage and attaches Bearer authorization headers to API requests.
- **Kanban Interaction**: Support for dragging and dropping task cards between lanes with instant SQLite state persistence.
- **Real-time Search Filter**: Instant card filtering by title, description, or assignee.
- **CRUD Operations**: Interactive forms to create new tasks, update status, change assignee names, delete tasks, and add/retrieve ticket comments.

---

## Tech Stack

- **Framework**: React (v19)
- **Tooling**: Vite (v8) + TypeScript
- **Styling**: Tailwind CSS (v3) + Material Symbols Outlined icons
- **State**: React Context (Global state manager)

---

## Folder Structure

```text
frontend/
├── src/
│   ├── assets/              # Static logo assets
│   ├── components/
│   │   ├── Card.tsx         # Kanban card component
│   │   ├── Sidebar.tsx      # Sidebar workspace navigation
│   │   └── TopNavbar.tsx    # Header search and initials profile avatar
│   ├── context/
│   │   └── AppContext.tsx   # Global AppProvider for view switching and data sync
│   ├── pages/
│   │   ├── LoginPage.tsx    # Login view
│   │   ├── RegisterPage.tsx # Account creation view
│   │   ├── BoardPage.tsx    # Engineering Board Kanban dashboard
│   │   └── TicketDetailPage.tsx # Ticket Detail overlay modal and comments system
│   ├── services/
│   │   ├── api.ts           # Fetch API client helper
│   │   ├── auth.service.ts  # Session login/register/logout services
│   │   ├── comment.service.ts # Ticket comments services
│   │   └── ticket.service.ts# Ticket CRUD services
│   ├── types/
│   │   └── index.ts         # TypeScript definitions
│   ├── App.tsx              # App routing switches
│   ├── index.css            # Base Tailwind imports and global style configurations
│   └── main.tsx             # React DOM renderer
├── index.html               # Main template importing Google fonts
├── package.json             # Scripts and dependencies config
├── tailwind.config.js       # Extended color palettes and typography scales
└── README.md                # Setup and execution guide
```

---

## Setup & Running Instructions

### 1. Install Dependencies
Run the install command inside the `frontend/` folder:
```bash
npm install
```

### 2. Configure Backend API Address
By default, the frontend is configured to call the local Express backend on `http://localhost:5000`. If your backend is running on a different port, update the `BASE_URL` variable in [api.ts](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/frontend/src/services/api.ts).

### 3. Run Development Server
Start the local Vite dev server:
```bash
npm run dev
```

### 4. Build for Production
To compile the production-ready static bundles under `dist/`:
```bash
npm run build
```
