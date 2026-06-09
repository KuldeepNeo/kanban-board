import { getDatabaseConnection } from '../config/database.js';

export class TicketRepository {
  static async findAll() {
    const db = await getDatabaseConnection();
    return await db.all('SELECT * FROM Ticket ORDER BY id ASC;');
  }

  static async findById(id) {
    const db = await getDatabaseConnection();
    return await db.get('SELECT * FROM Ticket WHERE id = ?;', [id]);
  }

  static async create(title, description, status, assignee, createdBy) {
    const db = await getDatabaseConnection();
    const now = new Date().toISOString();
    const result = await db.run(
      `INSERT INTO Ticket (title, description, status, assignee, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [title, description, status, assignee, createdBy, now, now]
    );
    return result.lastID;
  }

  static async update(id, title, description, status, assignee) {
    const db = await getDatabaseConnection();
    const now = new Date().toISOString();
    const result = await db.run(
      `UPDATE Ticket
       SET title = ?, description = ?, status = ?, assignee = ?, updated_at = ?
       WHERE id = ?;`,
      [title, description, status, assignee, now, id]
    );
    return result.changes > 0;
  }

  static async delete(id) {
    const db = await getDatabaseConnection();
    const result = await db.run('DELETE FROM Ticket WHERE id = ?;', [id]);
    return result.changes > 0;
  }
}
