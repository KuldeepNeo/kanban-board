export interface User {
  id: number;
  username: string;
  email: string;
}

export type TicketStatus = 'Todo' | 'In Progress' | 'Complete' | 'Closed';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  assignee: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  ticket_id: number;
  comment_text: string;
  created_by: number;
  created_at: string;
}
