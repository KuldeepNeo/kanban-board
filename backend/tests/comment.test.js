import request from 'supertest';
import app from '../src/app.js';
import { getDatabaseConnection } from '../src/config/database.js';

describe('Comment API Endpoint Tests', () => {
  let authToken;
  let userId;
  let ticketId;

  beforeEach(async () => {
    // Register and login a user to get token
    const user = { username: 'testuser', email: 'test@example.com', password: 'password123' };
    await request(app).post('/register').send(user);
    const loginRes = await request(app)
      .post('/login')
      .send({ emailOrUsername: 'testuser', password: 'password123' });
    
    authToken = loginRes.body.token;
    userId = loginRes.body.userId;

    // Create a ticket
    const db = await getDatabaseConnection();
    const insertTicket = await db.run(
      `INSERT INTO Ticket (title, description, status, assignee, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      ['Create Dashboard', 'Build Kanban UI', 'Todo', 'John', userId]
    );
    ticketId = insertTicket.lastID;
  });

  describe('GET /tickets/:id/comments', () => {
    it('should return 404 when ticket does not exist', async () => {
      const res = await request(app)
        .get('/tickets/999/comments')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Ticket not found');
    });

    it('should return empty list when no comments exist', async () => {
      const res = await request(app)
        .get(`/tickets/${ticketId}/comments`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all comment records for a ticket', async () => {
      const db = await getDatabaseConnection();
      await db.run(
        `INSERT INTO Comment (ticket_id, comment_text, created_by) VALUES (?, ?, ?)`,
        [ticketId, 'Work started', userId]
      );

      const res = await request(app)
        .get(`/tickets/${ticketId}/comments`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].comment_text).toBe('Work started');
      expect(res.body[0].created_by).toBe(userId);
    });
  });

  describe('POST /tickets/:id/comments', () => {
    it('should add comment to ticket when input is valid', async () => {
      const res = await request(app)
        .post(`/tickets/${ticketId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          comment_text: 'Implementation completed'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Comment added');
      expect(res.body).toHaveProperty('commentId');

      const db = await getDatabaseConnection();
      const comment = await db.get('SELECT * FROM Comment WHERE id = ?', [res.body.commentId]);
      expect(comment).toBeDefined();
      expect(comment.comment_text).toBe('Implementation completed');
      expect(comment.ticket_id).toBe(ticketId);
      expect(comment.created_by).toBe(userId);
    });

    it('should return 404 for adding comment to non-existent ticket', async () => {
      const res = await request(app)
        .post('/tickets/999/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          comment_text: 'Implementation completed'
        });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Ticket not found');
    });

    it('should return 400 validation error for missing comment text', async () => {
      const res = await request(app)
        .post(`/tickets/${ticketId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Comment text is required');
    });
  });
});
