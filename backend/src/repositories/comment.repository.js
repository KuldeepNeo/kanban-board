import { getDatabaseConnection } from '../config/database.js';

export class CommentRepository {
  static async findByTicketId(ticketId) {
    const db = await getDatabaseConnection();
    return await db.all(
      `SELECT * FROM Comment WHERE ticket_id = ? ORDER BY id ASC;`,
      [ticketId]
    );
  }

  static async create(ticketId, commentText, createdBy) {
    const db = await getDatabaseConnection();
    const now = new Date().toISOString();
    const result = await db.run(
      `INSERT INTO Comment (ticket_id, comment_text, created_by, created_at)
       VALUES (?, ?, ?, ?);`,
      [ticketId, commentText, createdBy, now]
    );
    return result.lastID;
  }
}
