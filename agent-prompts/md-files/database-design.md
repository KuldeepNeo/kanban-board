Based on the uploaded project scope, here are the requested deliverables.

---

# database-design.md

**Folder Path** database/
**Database:** SQLite


# Kanban Board POC – Database Design

## 1. Entity List

| Entity  | Purpose                                       |
| ------- | --------------------------------------------- |
| User    | Stores registered user accounts               |
| Ticket  | Stores work items managed on the Kanban board |
| Comment | Stores discussion entries linked to tickets   |

---

## 2. Table Definitions

### User

Represents authenticated application users.

### Ticket

Represents tasks/issues managed through workflow stages.

### Comment

Represents user comments attached to tickets.

---

## 3. Column Definitions

### User Table

| Column        | Data Type | Required | Description                |
| ------------- | --------- | -------- | -------------------------- |
| id            | INTEGER   | Yes      | Unique user identifier     |
| username      | TEXT      | Yes      | Login username             |
| email         | TEXT      | Yes      | User email                 |
| password_hash | TEXT      | Yes      | Encrypted password         |
| created_at    | DATETIME  | Yes      | Account creation timestamp |

---

### Ticket Table

| Column      | Data Type | Required | Description                 |
| ----------- | --------- | -------- | --------------------------- |
| id          | INTEGER   | Yes      | Unique ticket identifier    |
| title       | TEXT      | Yes      | Ticket title                |
| description | TEXT      | Yes      | Ticket details              |
| status      | TEXT      | Yes      | Workflow stage              |
| assignee    | TEXT      | No       | Assigned user name          |
| created_by  | INTEGER   | Yes      | Creator user id             |
| created_at  | DATETIME  | Yes      | Creation timestamp          |
| updated_at  | DATETIME  | Yes      | Last modification timestamp |

---

### Comment Table

| Column       | Data Type | Required | Description               |
| ------------ | --------- | -------- | ------------------------- |
| id           | INTEGER   | Yes      | Unique comment identifier |
| ticket_id    | INTEGER   | Yes      | Related ticket            |
| comment_text | TEXT      | Yes      | Comment content           |
| created_by   | INTEGER   | Yes      | Comment author            |
| created_at   | DATETIME  | Yes      | Creation timestamp        |

---

## 4. Data Types

| Type     | Usage                             |
| -------- | --------------------------------- |
| INTEGER  | Primary keys and foreign keys     |
| TEXT     | User input and descriptive fields |
| DATETIME | Audit timestamps                  |

---

## 5. Constraints

### User

| Constraint | Description   |
| ---------- | ------------- |
| NOT NULL   | username      |
| NOT NULL   | email         |
| NOT NULL   | password_hash |
| UNIQUE     | username      |
| UNIQUE     | email         |

### Ticket

| Constraint | Description                                                |
| ---------- | ---------------------------------------------------------- |
| NOT NULL   | title                                                      |
| NOT NULL   | description                                                |
| NOT NULL   | status                                                     |
| NOT NULL   | created_by                                                 |
| CHECK      | status must be one of: Todo, In Progress, Complete, Closed |

### Comment

| Constraint | Description  |
| ---------- | ------------ |
| NOT NULL   | ticket_id    |
| NOT NULL   | comment_text |
| NOT NULL   | created_by   |

---

## 6. Primary Keys

| Table   | Primary Key |
| ------- | ----------- |
| User    | id          |
| Ticket  | id          |
| Comment | id          |

---

## 7. Foreign Keys

| Child Table | Foreign Key | Parent Table |
| ----------- | ----------- | ------------ |
| Ticket      | created_by  | User.id      |
| Comment     | ticket_id   | Ticket.id    |
| Comment     | created_by  | User.id      |

---

## 8. Index Strategy

### User Table

| Index    | Purpose                    |
| -------- | -------------------------- |
| username | Fast login lookup          |
| email    | Fast authentication lookup |

### Ticket Table

| Index      | Purpose                       |
| ---------- | ----------------------------- |
| status     | Fast Kanban column retrieval  |
| created_by | User ticket filtering         |
| updated_at | Sorting and dashboard refresh |

### Comment Table

| Index      | Purpose                |
| ---------- | ---------------------- |
| ticket_id  | Fast comment retrieval |
| created_by | User activity lookup   |

---

## 9. Future Scalability

### User Enhancements

* Role management
* Profile management
* User preferences

### Ticket Enhancements

* Priority levels
* Labels/Tags
* Due dates
* Attachments
* Estimated effort
* Sprint assignment

### Comment Enhancements

* Comment editing
* Comment deletion
* Rich text formatting
* File attachments

### System Enhancements

* Audit logs
* Notification system
* Activity tracking
* Team management
* Multi-project support
* Workflow customization

---

# Entity Relationship Diagram

```text
+------------------+
|      User        |
+------------------+
| PK id            |
| username         |
| email            |
| password_hash    |
| created_at       |
+------------------+
          |
          | created_by
          |
          v
+------------------+
|     Ticket       |
+------------------+
| PK id            |
| title            |
| description      |
| status           |
| assignee         |
| FK created_by    |
| created_at       |
| updated_at       |
+------------------+
          |
          | ticket_id
          |
          v
+------------------+
|     Comment      |
+------------------+
| PK id            |
| FK ticket_id     |
| comment_text     |
| FK created_by    |
| created_at       |
+------------------+

User (1) -------- (M) Ticket
User (1) -------- (M) Comment
Ticket (1) ------ (M) Comment
```