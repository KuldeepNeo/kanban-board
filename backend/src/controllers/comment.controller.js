import { CommentService } from '../services/comment.service.js';

export async function getComments(req, res, next) {
  try {
    const ticketId = req.params.id; // comes from router as /tickets/:id/comments
    const comments = await CommentService.getCommentsByTicketId(ticketId);
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
}

export async function createComment(req, res, next) {
  try {
    const ticketId = req.params.id;
    const { comment_text } = req.body;
    const commentId = await CommentService.createComment(ticketId, comment_text, req.user.userId);
    res.status(201).json({
      message: 'Comment added',
      commentId
    });
  } catch (error) {
    next(error);
  }
}
