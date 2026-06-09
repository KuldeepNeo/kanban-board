import request from 'supertest';
import app from '../src/app.js';
import { getDatabaseConnection } from '../src/config/database.js';

describe('Ticket API Endpoint Tests', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    // Register and login a user to get token
    const user = { username: 'testuser', email: 'test@example.com', password: 'password123' };
    await request(app).post('/register').send(user);
    const loginRes = await request(app)
      .post('/login')
      .send({ emailOrUsername: 'testuser', password: 'password123' });
    
    authToken = loginRes.body.token;
    userId = loginRes.body.userId;
  });

  describe('Authorization checks', () => {
    it('should return 401 when fetching tickets without token', async () => {
      const res = await request(app).get('/tickets');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /tickets', () => {
    it('should return empty list when no tickets exist', async () => {
      const res = await request(app)
        .get('/tickets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all ticket records', async () => {
      const db = await getDatabaseConnection();
      await db.run(
        `INSERT INTO Ticket (title, description, status, assignee, created_by)
         VALUES (?, ?, ?, ?, ?)`,
        ['Create Dashboard', 'Build Kanban UI', 'Todo', 'John', userId]
      );

      const res = await request(app)
        .get('/tickets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Create Dashboard');
      expect(res.body[0].status).toBe('Todo');
    });
  });

  describe('POST /tickets', () => {
    it('should create a ticket when input is valid', async () => {
      const sampleTicket = {
        title: 'Create Dashboard',
        description: 'Build Kanban UI',
        status: 'Todo',
        assignee: 'John'
      };

      const res = await request(app)
        .post('/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(sampleTicket);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Ticket created');
      expect(res.body).toHaveProperty('ticketId');

      const db = await getDatabaseConnection();
      const ticket = await db.get('SELECT * FROM Ticket WHERE id = ?', [res.body.ticketId]);
      expect(ticket).toBeDefined();
      expect(ticket.title).toBe('Create Dashboard');
      expect(ticket.description).toBe('Build Kanban UI');
      expect(ticket.status).toBe('Todo');
      expect(ticket.assignee).toBe('John');
      expect(ticket.created_by).toBe(userId);
    });

    it('should return 400 for missing title', async () => {
      const res = await request(app)
        .post('/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Build Kanban UI',
          status: 'Todo'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Title is required');
    });

    it('should return 400 for invalid status', async () => {
      const res = await request(app)
        .post('/tickets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Create Dashboard',
          description: 'Build Kanban UI',
          status: 'InvalidStatus'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /tickets/:id', () => {
    it('should return 400 for non-integer ID format', async () => {
      const res = await request(app)
        .get('/tickets/abc')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid identifier format');
    });

    it('should return 404 for non-existent ticket', async () => {
      const res = await request(app)
        .get('/tickets/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Ticket not found');
    });

    it('should return ticket details for valid ID', async () => {
      const db = await getDatabaseConnection();
      const insert = await db.run(
        `INSERT INTO Ticket (title, description, status, assignee, created_by)
         VALUES (?, ?, ?, ?, ?)`,
        ['Create Dashboard', 'Build Kanban UI', 'Todo', 'John', userId]
      );
      const ticketId = insert.lastID;

      const res = await request(app)
        .get(`/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(ticketId);
      expect(res.body.title).toBe('Create Dashboard');
      expect(res.body.description).toBe('Build Kanban UI');
    });
  });

  describe('PUT /tickets/:id', () => {
    let ticketId;

    beforeEach(async () => {
      const db = await getDatabaseConnection();
      const insert = await db.run(
        `INSERT INTO Ticket (title, description, status, assignee, created_by)
         VALUES (?, ?, ?, ?, ?)`,
        ['Create Dashboard', 'Build Kanban UI', 'Todo', 'John', userId]
      );
      ticketId = insert.lastID;
    });

    it('should update ticket details when request is valid', async () => {
      const res = await request(app)
        .put(`/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          description: 'Updated Description',
          status: 'In Progress',
          assignee: 'Jane'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Ticket updated');

      const db = await getDatabaseConnection();
      const ticket = await db.get('SELECT * FROM Ticket WHERE id = ?', [ticketId]);
      expect(ticket.title).toBe('Updated Title');
      expect(ticket.description).toBe('Updated Description');
      expect(ticket.status).toBe('In Progress');
      expect(ticket.assignee).toBe('Jane');
    });

    it('should update partial ticket details successfully', async () => {
      const res = await request(app)
        .put(`/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'Complete'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Ticket updated');

      const db = await getDatabaseConnection();
      const ticket = await db.get('SELECT * FROM Ticket WHERE id = ?', [ticketId]);
      expect(ticket.title).toBe('Create Dashboard'); // unchanged
      expect(ticket.status).toBe('Complete'); // changed
    });

    it('should return 400 for invalid status stage', async () => {
      const res = await request(app)
        .put(`/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'InvalidStatus'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent ticket', async () => {
      const res = await request(app)
        .put('/tickets/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'Complete'
        });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Ticket not found');
    });
  });

  describe('DELETE /tickets/:id', () => {
    it('should delete ticket and associated comments successfully', async () => {
      const db = await getDatabaseConnection();
      const insertTicket = await db.run(
        `INSERT INTO Ticket (title, description, status, assignee, created_by)
         VALUES (?, ?, ?, ?, ?)`,
        ['Create Dashboard', 'Build Kanban UI', 'Todo', 'John', userId]
      );
      const ticketId = insertTicket.lastID;

      // Add comments
      await db.run(
        `INSERT INTO Comment (ticket_id, comment_text, created_by) VALUES (?, ?, ?)`,
        [ticketId, 'Comment text', userId]
      );

      const res = await request(app)
        .delete(`/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Ticket deleted');

      const dbTicket = await db.get('SELECT * FROM Ticket WHERE id = ?', [ticketId]);
      expect(dbTicket).toBeUndefined();

      const dbComments = await db.all('SELECT * FROM Comment WHERE ticket_id = ?', [ticketId]);
      expect(dbComments.length).toBe(0); // verified cascade delete
    });

    it('should return 404 for deleting non-existent ticket', async () => {
      const res = await request(app)
        .delete('/tickets/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Ticket not found');
    });
  });
});
