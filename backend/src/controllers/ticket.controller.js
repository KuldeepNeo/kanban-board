import { TicketService } from '../services/ticket.service.js';

export async function getTickets(req, res, next) {
  try {
    const tickets = await TicketService.getAllTickets();
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
}

export async function getTicket(req, res, next) {
  try {
    const { id } = req.params;
    const ticket = await TicketService.getTicketById(id);
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function createTicket(req, res, next) {
  try {
    const ticketId = await TicketService.createTicket(req.body, req.user.userId);
    res.status(201).json({
      message: 'Ticket created',
      ticketId
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTicket(req, res, next) {
  try {
    const { id } = req.params;
    await TicketService.updateTicket(id, req.body);
    res.status(200).json({
      message: 'Ticket updated'
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTicket(req, res, next) {
  try {
    const { id } = req.params;
    await TicketService.deleteTicket(id);
    res.status(200).json({
      message: 'Ticket deleted'
    });
  } catch (error) {
    next(error);
  }
}
