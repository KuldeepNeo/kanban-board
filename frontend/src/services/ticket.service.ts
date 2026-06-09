import { apiRequest } from './api.ts';
import type { Ticket, TicketStatus } from '../types/index.ts';

interface CreateTicketData {
  title: string;
  description: string;
  status: TicketStatus;
  assignee: string | null;
}

interface CreateTicketResponse {
  message: string;
  ticketId: number;
}

interface UpdateTicketResponse {
  message: string;
}

interface DeleteTicketResponse {
  message: string;
}

export class TicketService {
  static async getTickets(): Promise<Ticket[]> {
    return apiRequest<Ticket[]>('/tickets', {
      method: 'GET'
    });
  }

  static async getTicket(id: number): Promise<Ticket> {
    return apiRequest<Ticket>(`/tickets/${id}`, {
      method: 'GET'
    });
  }

  static async createTicket(data: CreateTicketData): Promise<CreateTicketResponse> {
    return apiRequest<CreateTicketResponse>('/tickets', {
      method: 'POST',
      bodyData: data
    });
  }

  static async updateTicket(id: number, data: Partial<CreateTicketData>): Promise<UpdateTicketResponse> {
    return apiRequest<UpdateTicketResponse>(`/tickets/${id}`, {
      method: 'PUT',
      bodyData: data
    });
  }

  static async deleteTicket(id: number): Promise<DeleteTicketResponse> {
    return apiRequest<DeleteTicketResponse>(`/tickets/${id}`, {
      method: 'DELETE'
    });
  }
}
