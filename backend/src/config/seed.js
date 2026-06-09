import { getDatabaseConnection, closeDatabaseConnection } from './database.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Starting database seeding...');
  try {
    const db = await getDatabaseConnection();

    // 1. Check if users exist
    const userCount = await db.get('SELECT COUNT(*) as count FROM User;');
    if (userCount.count > 0) {
      console.log('Database already contains data. Skipping seeding.');
      await closeDatabaseConnection();
      return;
    }

    console.log('Seeding default users...');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('password123', saltRounds);

    const user1Id = await db.run(
      `INSERT INTO User (username, email, password_hash) VALUES (?, ?, ?);`,
      ['johnsmith', 'john@example.com', passwordHash]
    ).then(r => r.lastID);

    const user2Id = await db.run(
      `INSERT INTO User (username, email, password_hash) VALUES (?, ?, ?);`,
      ['janesmith', 'jane@example.com', passwordHash]
    ).then(r => r.lastID);

    console.log(`Created users: johnsmith (ID: ${user1Id}), janesmith (ID: ${user2Id})`);

    console.log('Seeding default tickets...');
    const now = new Date().toISOString();

    const ticket1Id = await db.run(
      `INSERT INTO Ticket (title, description, status, assignee, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      ['Create Login Page', 'Build login screen with validations', 'Todo', 'johnsmith', user1Id, now, now]
    ).then(r => r.lastID);

    const ticket2Id = await db.run(
      `INSERT INTO Ticket (title, description, status, assignee, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      ['Implement API Endpoints', 'Develop Express REST backend routes', 'In Progress', 'janesmith', user2Id, now, now]
    ).then(r => r.lastID);

    const ticket3Id = await db.run(
      `INSERT INTO Ticket (title, description, status, assignee, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      ['Setup Database Schema', 'Define SQLite tables, indices, and constraints', 'Complete', 'johnsmith', user1Id, now, now]
    ).then(r => r.lastID);

    console.log(`Created tickets: ID ${ticket1Id}, ID ${ticket2Id}, ID ${ticket3Id}`);

    console.log('Seeding default comments...');
    const comment1Id = await db.run(
      `INSERT INTO Comment (ticket_id, comment_text, created_by, created_at)
       VALUES (?, ?, ?, ?);`,
      [ticket2Id, 'Working on auth integration middleware today.', user2Id, now]
    ).then(r => r.lastID);

    const comment2Id = await db.run(
      `INSERT INTO Comment (ticket_id, comment_text, created_by, created_at)
       VALUES (?, ?, ?, ?);`,
      [ticket3Id, 'Schema definitions are aligned with the api contract.', user1Id, now]
    ).then(r => r.lastID);

    console.log(`Created comments: ID ${comment1Id}, ID ${comment2Id}`);
    console.log('Database seeding completed successfully.');

    // Verification queries
    console.log('\n--- VERIFICATION REPORT ---');
    const users = await db.all('SELECT id, username, email FROM User;');
    console.log('Users:', users);
    const tickets = await db.all('SELECT id, title, status, assignee FROM Ticket;');
    console.log('Tickets:', tickets);
    const comments = await db.all('SELECT id, ticket_id, comment_text FROM Comment;');
    console.log('Comments:', comments);
    console.log('---------------------------\n');

    await closeDatabaseConnection();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
