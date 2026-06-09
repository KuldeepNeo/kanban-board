import { getDatabaseConnection, closeDatabaseConnection } from '../src/config/database.js';

beforeAll(async () => {
  // Direct database path to local memory for test runs
  process.env.DATABASE_PATH = ':memory:';
  process.env.NODE_ENV = 'test';
  
  // Establish connection and run migrations
  await getDatabaseConnection();
});

beforeEach(async () => {
  const db = await getDatabaseConnection();
  // Clear records to provide test isolation (disabling foreign keys temporarily is a clean way to clear everything)
  await db.exec('PRAGMA foreign_keys = OFF;');
  await db.exec('DELETE FROM Comment;');
  await db.exec('DELETE FROM Ticket;');
  await db.exec('DELETE FROM User;');
  await db.exec("DELETE FROM sqlite_sequence WHERE name='Comment';");
  await db.exec("DELETE FROM sqlite_sequence WHERE name='Ticket';");
  await db.exec("DELETE FROM sqlite_sequence WHERE name='User';");
  await db.exec('PRAGMA foreign_keys = ON;');
});
// Connection will persist across serial test runs and close on process exit
