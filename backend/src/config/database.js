import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

let dbInstance = null;

export async function getDatabaseConnection() {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = process.env.DATABASE_PATH || 'database.sqlite';

  // Open the SQLite database
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await dbInstance.exec('PRAGMA foreign_keys = ON;');

  // Initialize Schema
  await initializeSchema(dbInstance);

  return dbInstance;
}

async function initializeSchema(db) {
  // Create User Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Ticket Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Ticket (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Todo', 'In Progress', 'Complete', 'Closed')),
      assignee TEXT,
      created_by INTEGER NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES User(id)
    );
  `);

  // Create Comment Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Comment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER NOT NULL,
      comment_text TEXT NOT NULL,
      created_by INTEGER NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticket_id) REFERENCES Ticket(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES User(id)
    );
  `);

  // Indices for User
  await db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS UX_User_Username ON User(username);
  `);
  await db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS UX_User_Email ON User(email);
  `);

  // Indices for Ticket
  await db.exec(`
    CREATE INDEX IF NOT EXISTS IX_Ticket_Status ON Ticket(status);
  `);
  await db.exec(`
    CREATE INDEX IF NOT EXISTS IX_Ticket_Created_By ON Ticket(created_by);
  `);
  await db.exec(`
    CREATE INDEX IF NOT EXISTS IX_Ticket_Updated_At ON Ticket(updated_at);
  `);

  // Indices for Comment
  await db.exec(`
    CREATE INDEX IF NOT EXISTS IX_Comment_Ticket_Id ON Comment(ticket_id);
  `);
  await db.exec(`
    CREATE INDEX IF NOT EXISTS IX_Comment_Created_By ON Comment(created_by);
  `);
}

export async function closeDatabaseConnection() {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
}
