
# Kanban Board POC – API Contract

---

## API Contract Specification

**Version:** 1.0
**API Style:** REST
**Data Format:** JSON
**Database:** SQLite


## Authentication APIs

### POST /register

#### Purpose

Create a new user account.

#### Request

```json
{
  "username": "johnsmith",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response

```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

#### Validation Rules

* Username required
* Username unique
* Email required
* Email unique
* Password minimum length required

#### Status Codes

| Code | Meaning          |
| ---- | ---------------- |
| 201  | Created          |
| 400  | Validation Error |
| 409  | Duplicate User   |

#### Error Response

```json
{
  "error": "Email already exists"
}
```

---

### POST /login

#### Purpose

Authenticate user.

#### Request

```json
{
  "emailOrUsername": "johnsmith",
  "password": "password123"
}
```

#### Response

```json
{
  "token": "jwt-token",
  "userId": 1
}
```

#### Validation Rules

* Credentials required
* Credentials must match existing user

#### Status Codes

| Code | Meaning      |
| ---- | ------------ |
| 200  | Success      |
| 401  | Unauthorized |

#### Error Response

```json
{
  "error": "Invalid credentials"
}
```

---

### POST /logout

#### Purpose

Terminate active session.

#### Request

No body required.

#### Response

```json
{
  "message": "Logged out successfully"
}
```

#### Status Codes

| Code | Meaning      |
| ---- | ------------ |
| 200  | Success      |
| 401  | Unauthorized |

---

## Ticket APIs

### GET /tickets

#### Purpose

Retrieve all tickets.

#### Response

```json
[
  {
    "id": 1,
    "title": "Create Login Page",
    "status": "Todo"
  }
]
```

#### Validation Rules

* User must be authenticated

#### Status Codes

| Code | Meaning      |
| ---- | ------------ |
| 200  | Success      |
| 401  | Unauthorized |

---

### GET /tickets/:id

#### Purpose

Retrieve ticket details.

#### Response

```json
{
  "id": 1,
  "title": "Create Login Page",
  "description": "Build login screen",
  "status": "In Progress"
}
```

#### Status Codes

| Code | Meaning      |
| ---- | ------------ |
| 200  | Success      |
| 404  | Not Found    |
| 401  | Unauthorized |

---

### POST /tickets

#### Purpose

Create ticket.

#### Request

```json
{
  "title": "Create Dashboard",
  "description": "Build Kanban UI",
  "status": "Todo",
  "assignee": "John"
}
```

#### Response

```json
{
  "message": "Ticket created",
  "ticketId": 1
}
```

#### Validation Rules

* Title required
* Description required
* Valid status required

#### Status Codes

| Code | Meaning          |
| ---- | ---------------- |
| 201  | Created          |
| 400  | Validation Error |
| 401  | Unauthorized     |

---

### PUT /tickets/:id

#### Purpose

Update ticket.

#### Request

```json
{
  "title": "Updated Title",
  "description": "Updated Description",
  "status": "Complete",
  "assignee": "John"
}
```

#### Response

```json
{
  "message": "Ticket updated"
}
```

#### Validation Rules

* Ticket must exist
* Status must be valid workflow state

#### Status Codes

| Code | Meaning          |
| ---- | ---------------- |
| 200  | Success          |
| 400  | Validation Error |
| 404  | Not Found        |

---

### DELETE /tickets/:id

#### Purpose

Delete ticket and associated comments.

#### Response

```json
{
  "message": "Ticket deleted"
}
```

#### Status Codes

| Code | Meaning   |
| ---- | --------- |
| 200  | Success   |
| 404  | Not Found |

---

## Comment APIs

### GET /tickets/:id/comments

#### Purpose

Retrieve ticket comments.

#### Response

```json
[
  {
    "id": 1,
    "comment_text": "Work started",
    "created_by": 2
  }
]
```

#### Status Codes

| Code | Meaning          |
| ---- | ---------------- |
| 200  | Success          |
| 404  | Ticket Not Found |

---

### POST /tickets/:id/comments

#### Purpose

Add comment to ticket.

#### Request

```json
{
  "comment_text": "Implementation completed"
}
```

#### Response

```json
{
  "message": "Comment added",
  "commentId": 1
}
```

#### Validation Rules

* Comment text required
* Ticket must exist

#### Status Codes

| Code | Meaning          |
| ---- | ---------------- |
| 201  | Created          |
| 400  | Validation Error |
| 404  | Ticket Not Found |

#### Error Response

```json
{
  "error": "Comment text is required"
}
```

---

## Standard Error Response

```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2026-06-08T10:00:00Z"
}
```
