# Kanban Board POC – Detailed Project Scope Document

## Project Information

| Item         | Details                                                                          |
| ------------ | -------------------------------------------------------------------------------- |
| Project Name | Kanban Board POC                                                                 |
| Project Type | Web Application                                                                  |
| Database     | SQLite                                                                           |
| Users        | Registered Users                                                                 |
| Objective    | Demonstrate a complete ticket management workflow using a Kanban board interface |

---

# 1. Project Overview

The Kanban Board POC is a web-based task management application that enables authenticated users to create, organize, track, and manage tickets through different workflow stages using a visual Kanban board.

The system provides a simple yet complete project management workflow where users can:

* Register and authenticate
* Manage tickets
* Track ticket progress
* Move tickets across workflow stages
* Collaborate through comments
* Persist all data using SQLite


---

# 2. Business Objective

The primary objective is to provide a lightweight task-tracking solution that:

* Centralizes ticket management
* Improves visibility of work progress
* Demonstrates workflow management concepts
* Provides a foundation for future enterprise enhancements
* Validates drag-and-drop Kanban functionality

---

# 3. User Roles

## Registered User

Authenticated users can perform all available operations.

### Permissions

* Register account
* Login
* Logout
* View Kanban board
* Create tickets
* Edit tickets
* Delete tickets
* Move tickets between workflow stages
* Add comments to tickets
* View ticket details

---

# 4. Functional Scope

---

## Module 1: User Authentication

### Description

Provides secure access to the application through user registration and login.

### Features

#### User Registration

Users can create a new account by providing:

* Username
* Email Address
* Password

#### User Login

Users can authenticate using:

* Email/Username
* Password

#### User Logout

Users can securely terminate their active session.

### Validation Rules

* Username must be unique
* Email must be unique
* Required fields cannot be empty
* Password must meet minimum length requirement
* Invalid credentials should be rejected

---

## Module 2: Kanban Dashboard

### Description

Displays all tickets organized into workflow columns.

### Workflow Columns

| Column      | Description                         |
| ----------- | ----------------------------------- |
| Todo        | Newly created tickets               |
| In Progress | Work currently being performed      |
| Complete    | Work completed and awaiting closure |
| Closed      | Finished tickets                    |

### Dashboard Capabilities

Users can:

* View all tickets
* View ticket count per column
* Open ticket details
* Drag and drop tickets between columns

---

## Module 3: Ticket Management

### Description

Allows users to create and manage work items.

---

### Create Ticket

Users can create tickets containing:

| Field       | Type     | Required |
| ----------- | -------- | -------- |
| Title       | Text     | Yes      |
| Description | Text     | Yes      |
| Status      | Dropdown | Yes      |
| Assignee    | Text     | No       |

### Default Behavior

Upon creation:

* Ticket is saved to SQLite
* Ticket appears in selected column
* Unique Ticket ID is generated

---

### Edit Ticket

Users can update:

* Title
* Description
* Status
* Assignee

### Expected Outcome

* Changes saved immediately
* Updated data visible on board
* SQLite record updated

---

### Delete Ticket

Users can permanently remove tickets.

### Expected Outcome

* Ticket removed from UI
* Ticket removed from database
* Related comments removed

---

### Move Ticket

Users can move tickets between workflow stages using:

* Drag and Drop
* Status selection (optional)

### Allowed Workflow States

```text
Todo
↓
In Progress
↓
Complete
↓
Closed
```

### Expected Outcome

* Ticket status updates
* Board refreshes automatically
* SQLite updated instantly

---

## Module 4: Comment Management

### Description

Allows collaboration and ticket discussion.

### Add Comment

Users can:

* Add comments to tickets
* View ticket comment history

### Comment Fields

| Field        | Required       |
| ------------ | -------------- |
| Comment Text | Yes            |
| Created Date | Auto Generated |
| User         | Auto Generated |

### Expected Outcome

* Comment stored in SQLite
* Comment displayed immediately
* Comment linked to ticket

---

# 5. Data Model Scope

---

## Users Table

| Field         |
| ------------- |
| id            |
| username      |
| email         |
| password_hash |
| created_at    |

---

## Tickets Table

| Field       |
| ----------- |
| id          |
| title       |
| description |
| status      |
| assignee    |
| created_by  |
| created_at  |
| updated_at  |

---

## Comments Table

| Field        |
| ------------ |
| id           |
| ticket_id    |
| comment_text |
| created_by   |
| created_at   |

---

# 6. Workflow

```text
Register
    ↓
Login
    ↓
View Kanban Board
    ↓
Create Ticket
    ↓
Move Ticket
    ↓
Edit Ticket
    ↓
Add Comments
    ↓
Complete Work
    ↓
Close Ticket
```

---

# 7. Non-Functional Requirements

## Performance

* Login response < 2 seconds
* Ticket creation < 2 seconds
* Status movement reflected immediately
* Dashboard load < 3 seconds

## Security

* Password hashing
* Session management
* Authentication required for all ticket operations
* Input validation

## Reliability

* SQLite transactions must prevent data loss
* Data persists after application restart

## Usability

* Responsive UI
* Simple navigation
* Drag-and-drop interaction
* Clear validation messages

---

# 8. Acceptance Criteria

The project will be considered successful when:

| ID    | Acceptance Criteria                            |
| ----- | ---------------------------------------------- |
| AC-01 | User can register successfully                 |
| AC-02 | User can login successfully                    |
| AC-03 | User can logout successfully                   |
| AC-04 | User can create a ticket                       |
| AC-05 | Ticket appears in correct Kanban column        |
| AC-06 | User can edit ticket details                   |
| AC-07 | User can delete tickets                        |
| AC-08 | User can drag and drop tickets between columns |
| AC-09 | Ticket status updates correctly                |
| AC-10 | User can add comments                          |
| AC-11 | Comments display correctly                     |
| AC-12 | All ticket data persists in SQLite             |
| AC-13 | All comment data persists in SQLite            |
| AC-14 | Authentication protects all ticket operations  |
| AC-15 | Application functions correctly after restart  |

---

# 10. Recommended Technology Stack

| Layer            | Technology            |
| ---------------- | --------------------- |
| Frontend         | React.js              |
| UI Library       | Material UI           |
| State Management | React Context / Redux |
| Backend          | Node.js + Express     |
| Database         | SQLite                |
| Authentication   | JWT                   |
| ORM              | Prisma / Sequelize    |
| Drag & Drop      | React DnD or dnd-kit  |
| Deployment       | Docker                |

This scope is sufficiently detailed for development estimation, sprint planning, architecture design, KPI generation, and AI-based validation testing.
