import { Router } from 'express';
import * as ticketController from '../controllers/ticket.controller.js';
import commentRouter from './comment.routes.js';
import { 
  validateTicketBody, 
  validateTicketUpdateBody, 
  validateIdParam 
} from '../middleware/validation.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Secure all ticket operations
router.use(authMiddleware);

// Retrieve all tickets
router.get('/', ticketController.getTickets);

// Create new ticket
router.post('/', validateTicketBody, ticketController.createTicket);

// Retrieve specific ticket
router.get('/:id', validateIdParam, ticketController.getTicket);

// Update ticket
router.put('/:id', validateIdParam, validateTicketUpdateBody, ticketController.updateTicket);

// Delete ticket
router.delete('/:id', validateIdParam, ticketController.deleteTicket);

// Mount comment routes nested under /tickets/:id/comments
router.use('/:id/comments', commentRouter);

export default router;
