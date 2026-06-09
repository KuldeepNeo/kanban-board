import { TicketRepository } from '../repositories/ticket.repository.js';
import { AppError } from '../middleware/error.middleware.js';

export class TicketService {
  static async getAllTickets() {
    return await TicketRepository.findAll();
  }

  static async getTicketById(id) {
    const ticket = await TicketRepository.findById(id);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }
    return ticket;
  }

  static async createTicket(data, createdBy) {
    const { title, description, status, assignee } = data;
    // Set status defaults if not present
    const finalStatus = status || 'Todo';
    const ticketId = await TicketRepository.create(
      title,
      description,
      finalStatus,
      assignee || null,
      createdBy
    );
    return ticketId;
  }

  static async updateTicket(id, data) {
    const { title, description, status, assignee } = data;
    
    // Check if ticket exists
    const ticket = await TicketRepository.findById(id);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    const updated = await TicketRepository.update(
      id,
      title !== undefined ? title : ticket.title,
      description !== undefined ? description : ticket.description,
      status !== undefined ? status : ticket.status,
      assignee !== undefined ? assignee : ticket.assignee
    );

    return updated;
  }

  static async deleteTicket(id) {
    // Check if ticket exists
    const ticket = await TicketRepository.findById(id);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    return await TicketRepository.delete(id);
  }
}
