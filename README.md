# Kanban Board

A lightweight Kanban-based task management application that demonstrates a complete ticket lifecycle workflow using a modern web stack.

## Overview

The Kanban Board POC enables authenticated users to create, manage, track, and collaborate on tickets through an intuitive drag-and-drop Kanban interface.

The application provides a simple project management workflow with user authentication, ticket management, status tracking, and commenting capabilities backed by a SQLite database.


## Project Goal

This Proof of Concept validates Kanban workflow management, drag-and-drop interactions, and task collaboration features while providing a foundation for future enterprise-scale enhancements.

You can use this as the repository's `README.md` and expand it later with installation instructions, API documentation, screenshots, and deployment steps.


## Features

### Authentication

* User registration
* Secure login and logout
* Password hashing
* Protected application routes

### Kanban Board

* Visual workflow management
* Drag-and-drop ticket movement
* Ticket count per column
* Real-time status updates

### Ticket Management

* Create tickets
* Edit ticket details
* Delete tickets
* Assign users
* Track ticket status

### Comments

* Add comments to tickets
* View comment history
* User and timestamp tracking

## Workflow

```text
Todo
 ↓
In Progress
 ↓
Complete
 ↓
Closed
```

## Technology Stack

| Layer            | Technology            |
| ---------------- | --------------------- |
| Frontend         | React.js              |
| UI Library       | Material UI           |
| State Management | React Context / Redux |
| Backend          | Node.js + Express     |
| Database         | SQLite                |
| Authentication   | JWT                   |
| ORM              | Prisma / Sequelize    |
| Drag & Drop      | dnd-kit / React DnD   |
| Deployment       | Docker                |

## Database Schema

### Users

* id
* username
* email
* password_hash
* created_at

### Tickets

* id
* title
* description
* status
* assignee
* created_by
* created_at
* updated_at

### Comments

* id
* ticket_id
* comment_text
* created_by
* created_at

## Key Capabilities

* User authentication and authorization
* Ticket lifecycle management
* Drag-and-drop workflow transitions
* Ticket commenting and collaboration
* Persistent SQLite storage
* Responsive user interface

## Acceptance Criteria Highlights

* User registration and login
* Ticket CRUD operations
* Kanban board visualization
* Drag-and-drop ticket movement
* Comment management
* Data persistence across application restarts
* Authentication-protected operations
