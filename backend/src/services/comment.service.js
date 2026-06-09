import { CommentRepository } from '../repositories/comment.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
import { AppError } from '../middleware/error.middleware.js';

export class CommentService {
  static async getCommentsByTicketId(ticketId) {
    // Check if ticket exists
    const ticket = await TicketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }
    return await CommentRepository.findByTicketId(ticketId);
  }

  static async createComment(ticketId, commentText, createdBy) {
    // Check if ticket exists
    const ticket = await TicketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    const commentId = await CommentRepository.create(ticketId, commentText, createdBy);
    return commentId;
  }
}
