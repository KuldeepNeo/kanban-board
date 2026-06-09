# Implementation Plan - Kanban Board POC Backend

Implement the backend REST API and SQLite database for the Kanban Board POC. The project will be built with Node.js, Express, and SQLite (utilizing ES Modules), following the backend developer persona guidelines, coding standards, repository pattern, and strict validation rules.

## User Review Required

> [!IMPORTANT]
> - **Authentication Mechanics**: The API contract details `/register`, `/login`, and `/logout`. We will use stateless JWT authentication via standard `Authorization: Bearer <token>` headers.
> - **Cascading Deletions**: Ticket deletion will also delete all associated comments automatically using SQLite's foreign key constraint `ON DELETE CASCADE`.
> - **Repository Pattern**: As mandated in `save-token.md`, we will structure database logic inside the `repositories/` layer rather than calling SQLite directly from controllers or service layers.

## Proposed Changes

We will create the backend structure under `/Users/neo/Desktop/Vibe Coding Training/vibe_projects/kanban_board/backend`.

---

### Configurations & Database Setup

#### [NEW] [database.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/config/database.js)
- Establishes the SQLite connection using `sqlite` and `sqlite3`.
- Dynamically initializes schema tables: `User`, `Ticket`, and `Comment` with primary keys, foreign keys (with `ON DELETE CASCADE`), constraints (e.g. `CHECK` for status stages), and indices for query optimizations.
- Executes `PRAGMA foreign_keys = ON;` upon connection to enforce database constraints.

#### [NEW] [package.json](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/package.json)
- Configures ES modules (`"type": "module"`).
- Lists dependencies: `express`, `sqlite`, `sqlite3`, `cors`, `helmet`, `dotenv`, `bcryptjs`, `jsonwebtoken`.
- Lists devDependencies: `jest`, `supertest`, `nodemon`.
- Configures Jest test scripts and environment setup.

#### [NEW] [.env.example](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/.env.example) and `.env`
- Contains environment configuration keys: `PORT`, `NODE_ENV`, `DATABASE_PATH`, `JWT_SECRET`, `ALLOWED_ORIGIN`.

---

### Database Repositories (Data Access Layer)

We will abstract database operations using the Repository Pattern:

#### [NEW] [user.repository.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/repositories/user.repository.js)
- `create(username, email, passwordHash)`: Inserts new user.
- `findByUsernameOrEmail(identifier)`: Resolves a user by username or email.
- `findById(id)`: Resolves a user by ID.

#### [NEW] [ticket.repository.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/repositories/ticket.repository.js)
- `findAll()`: Returns all tickets.
- `findById(id)`: Returns ticket details.
- `create(title, description, status, assignee, createdBy)`: Inserts new ticket.
- `update(id, title, description, status, assignee)`: Updates existing ticket details.
- `delete(id)`: Deletes ticket.

#### [NEW] [comment.repository.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/repositories/comment.repository.js)
- `findByTicketId(ticketId)`: Retrieves comments for a ticket.
- `create(ticketId, commentText, createdBy)`: Inserts comment.

---

### Service Layer (Business Logic)

#### [NEW] [auth.service.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/services/auth.service.js)
- Registration checks for duplicate users and hashes passwords using `bcryptjs`.
- Login validates credentials and signs JWT tokens using `jsonwebtoken`.

#### [NEW] [ticket.service.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/services/ticket.service.js)
- Handles ticket operations, mapping and validating workflow statuses.

#### [NEW] [comment.service.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/services/comment.service.js)
- Manages comment addition and verification of ticket existence.

---

### Controllers & Middlewares

#### [NEW] [auth.middleware.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/middleware/auth.middleware.js)
- Extract JWT from `Authorization: Bearer <token>` and verify, attaching decoded token payload to `req.user`.

#### [NEW] [error.middleware.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/middleware/error.middleware.js)
- Catches errors and formats them into the standard JSON response:
  ```json
  {
    "error": "Error message details",
    "status": 400,
    "timestamp": "2026-06-08T10:00:00.000Z"
  }
  ```

#### [NEW] [validation.middleware.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/middleware/validation.middleware.js)
- Validates user payload (username, email format, password lengths).
- Validates ticket creation and updates (title, description, and workflow statuses `Todo`, `In Progress`, `Complete`, `Closed`).
- Validates comment details and positive integer IDs.

#### [NEW] [auth.controller.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/controllers/auth.controller.js)
- Directs request parameters to auth services and formats responses for `/register`, `/login`, and `/logout`.

#### [NEW] [ticket.controller.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/controllers/ticket.controller.js)
- Coordinates ticket actions: creation, reading list/details, updates, and deletion.

#### [NEW] [comment.controller.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/controllers/comment.controller.js)
- Coordinates comments reading and adding.

---

### Routes & Server Bootstrapping

#### [NEW] [auth.routes.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/routes/auth.routes.js), [ticket.routes.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/routes/ticket.routes.js), [comment.routes.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/routes/comment.routes.js)
- Express route maps to hook up endpoints with corresponding controllers, validation, and auth guards.

#### [NEW] [app.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/app.js)
- Instantiates Express app.
- Registers standard middlewares: `helmet`, `cors`, `express.json()`.
- Binds route namespaces.
- Registers undefined route handlers and centralized `errorMiddleware`.

#### [NEW] [server.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/src/server.js)
- Configures port and launches server listener.
- Implements process interrupt handlers (SIGINT/SIGTERM) to close the SQLite database connection gracefully.

---

### Testing Suite

#### [NEW] [setup.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/tests/setup.js)
- Directs database configurations to `:memory:` before all tests.
- Re-creates tables and handles transaction/record clearing between individual tests.

#### [NEW] [auth.test.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/tests/auth.test.js), [ticket.test.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/tests/ticket.test.js), [comment.test.js](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/tests/comment.test.js)
- Tests all successful paths, invalid parameter responses (400), unauthorized accesses (401), not found errors (404), and duplicates conflict errors (409) under Supertest.

---

### Setup & Guide

#### [NEW] [README.md](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/kanban_board/backend/README.md)
- Set up details, environment configuration requirements, execution instructions, and test running commands.

## Verification Plan

### Automated Tests
We will execute Jest tests inside the `backend` folder:
```bash
npm run test
```

### Manual Verification
- Launch the Express server using `npm run dev`.
- Make API requests using curl/httpie commands to test `/register`, `/login`, `/tickets` and comments, verifying the SQLite persistence and validation middleware responses.
