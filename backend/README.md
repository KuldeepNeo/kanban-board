# Kanban Board POC - Backend API

This is the backend REST API server for the Kanban Board Proof of Concept (POC). It is built using **Node.js**, **Express**, and **SQLite**, adhering to a layered architecture (Controllers -> Services -> Repositories) and utilizing ES Modules.

## Tech Stack

- **Runtime**: Node.js (v24.16.0+)
- **Framework**: Express (v5.0.0+)
- **Database**: SQLite (v3) via `sqlite` and `sqlite3` driver
- **Language Syntax**: Modern Javascript (ES Modules)
- **Testing**: Jest & Supertest

---

## Folder Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.js            # SQLite database connection & schema setup
│   │   └── seed.js                # Database seed & verification script
│   ├── controllers/
│   │   ├── auth.controller.js     # User authentication handlers (register, login, logout)
│   │   ├── ticket.controller.js   # Ticket CRUD handlers
│   │   └── comment.controller.js  # Ticket comment handlers
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT authorization guard middleware
│   │   ├── error.middleware.js     # Centralized global error handling middleware
│   │   └── validation.middleware.js# Schema and parameter validation middleware
│   ├── repositories/
│   │   ├── user.repository.js     # User database access logic
│   │   ├── ticket.repository.js   # Ticket database access logic
│   │   └── comment.repository.js  # Comment database access logic
│   ├── routes/
│   │   ├── auth.routes.js         # Public / Auth endpoints
│   │   ├── ticket.routes.js       # Secured ticket CRUD endpoints
│   │   └── comment.routes.js      # Nested comments endpoints
│   ├── app.js                     # Express app setup and middleware pipeline configuration
│   └── server.js                  # App bootstrap and port binding with graceful shutdown
├── tests/
│   ├── setup.js                   # Jest setup and in-memory DB isolation hooks
│   ├── auth.test.js               # Integration test specs for Authentication
│   ├── ticket.test.js             # Integration test specs for Tickets
│   └── comment.test.js            # Integration test specs for Comments
├── .env                           # Environment configuration
├── .env.example                   # Environment template file
├── package.json                   # Project packages, scripts and Jest configurations
└── README.md                      # Codebase setup and usage documentation
```

---

## Environmental Configurations

Duplicate `.env.example` to `.env` in the root of the `backend/` directory:

```bash
cp .env.example .env
```

| Environment Variable | Description | Default |
| -------------------- | ----------- | ------- |
| `PORT` | HTTP server binding port | `5000` |
| `NODE_ENV` | Running environment mode (`development`, `production`, `test`) | `development` |
| `DATABASE_PATH` | Path to the SQLite database file | `database.sqlite` |
| `JWT_SECRET` | Secret key used to sign and verify JWT authentication tokens | `super_secret_jwt_key_12345` |
| `ALLOWED_ORIGIN` | Allowed Client Origin for CORS settings | `*` |

---

## Setup & Running Instructions

### 1. Install Dependencies
Navigate to the `backend/` folder and run:
```bash
npm install
```

### 2. Seed Database
Pre-populate the SQLite database with dummy users, tickets, and comments, and execute verification reports:
```bash
npm run seed
```

### 3. Run the Server
- **Production Mode**:
  ```bash
  npm start
  ```
- **Development Mode** (with nodemon auto-restart):
  ```bash
  npm run dev
  ```

---

## Testing

Integration tests run in an isolated in-memory (`:memory:`) SQLite database sandbox.

To execute the test suite:
```bash
npm run test
```

---

## API Contract Summary

### Authentication (Public)
- **POST `/register`**: Creates new user account.
  - Body: `{"username": "...", "email": "...", "password": "..."}`
  - Response (201): `{"message": "User registered successfully", "userId": 1}`
- **POST `/login`**: Authenticates user and issues JWT.
  - Body: `{"emailOrUsername": "...", "password": "..."}`
  - Response (200): `{"token": "jwt-token-string", "userId": 1}`
- **POST `/logout`** (Secured): Terminates active session.
  - Headers: `Authorization: Bearer <token>`
  - Response (200): `{"message": "Logged out successfully"}`

### Tickets (Secured - Require `Authorization: Bearer <token>`)
- **GET `/tickets`**: Retrieve all tickets.
  - Response (200): List of tickets
- **GET `/tickets/:id`**: Retrieve ticket details.
  - Response (200): Ticket object details
- **POST `/tickets`**: Create ticket.
  - Body: `{"title": "...", "description": "...", "status": "Todo", "assignee": "..."}`
  - Response (201): `{"message": "Ticket created", "ticketId": 1}`
- **PUT `/tickets/:id`**: Update ticket.
  - Body: Optional updates `{"title": "...", "description": "...", "status": "...", "assignee": "..."}`
  - Response (200): `{"message": "Ticket updated"}`
- **DELETE `/tickets/:id`**: Delete ticket and associated comments.
  - Response (200): `{"message": "Ticket deleted"}`

### Comments (Secured - Require `Authorization: Bearer <token>`)
- **GET `/tickets/:id/comments`**: Retrieve comments for a ticket.
  - Response (200): List of comment objects
- **POST `/tickets/:id/comments`**: Add comment to ticket.
  - Body: `{"comment_text": "..."}`
  - Response (201): `{"message": "Comment added", "commentId": 1}`
