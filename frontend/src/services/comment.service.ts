import { apiRequest } from './api.ts';
import type { Comment } from '../types/index.ts';

interface CreateCommentResponse {
  message: string;
  commentId: number;
}

export class CommentService {
  static async getComments(ticketId: number): Promise<Comment[]> {
    return apiRequest<Comment[]>(`/tickets/${ticketId}/comments`, {
      method: 'GET'
    });
  }

  static async createComment(ticketId: number, commentText: string): Promise<CreateCommentResponse> {
    return apiRequest<CreateCommentResponse>(`/tickets/${ticketId}/comments`, {
      method: 'POST',
      bodyData: { comment_text: commentText }
    });
  }
}
