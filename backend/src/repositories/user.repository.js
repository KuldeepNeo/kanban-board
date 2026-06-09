import { getDatabaseConnection } from '../config/database.js';

export class UserRepository {
  static async create(username, email, passwordHash) {
    const db = await getDatabaseConnection();
    const result = await db.run(
      `INSERT INTO User (username, email, password_hash)
       VALUES (?, ?, ?);`,
      [username, email, passwordHash]
    );
    return result.lastID;
  }

  static async findByUsernameOrEmail(identifier) {
    const db = await getDatabaseConnection();
    return await db.get(
      `SELECT * FROM User WHERE username = ? OR email = ?;`,
      [identifier, identifier]
    );
  }

  static async findById(id) {
    const db = await getDatabaseConnection();
    return await db.get(
      `SELECT * FROM User WHERE id = ?;`,
      [id]
    );
  }
}
