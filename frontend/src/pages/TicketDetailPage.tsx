import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TicketService } from '../services/ticket.service.ts';
import { CommentService } from '../services/comment.service.ts';
import type { Ticket, Comment, TicketStatus } from '../types/index.ts';

export const TicketDetailPage: React.FC = () => {
  const { selectedTicketId, setSelectedTicketId, loadTickets } = useApp();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  
  // Form/input states
  const [commentText, setCommentText] = useState('');
  const [editingAssignee, setEditingAssignee] = useState(false);
  const [assigneeVal, setAssigneeVal] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTicketDetails = async () => {
    if (!selectedTicketId) return;
    setLoading(true);
    setError(null);
    try {
      const ticketData = await TicketService.getTicket(selectedTicketId);
      setTicket(ticketData);
      setAssigneeVal(ticketData.assignee || '');
      
      const commentsData = await CommentService.getComments(selectedTicketId);
      setComments(commentsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load ticket details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [selectedTicketId]);

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket) return;
    try {
      // Optimistic update
      setTicket(prev => prev ? { ...prev, status: newStatus } : null);
      await TicketService.updateTicket(ticket.id, { status: newStatus });
      await loadTickets();
    } catch (err: any) {
      setError('Failed to update status.');
    }
  };

  const handleAssigneeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;
    try {
      const finalAssignee = assigneeVal.trim() || null;
      setTicket(prev => prev ? { ...prev, assignee: finalAssignee } : null);
      await TicketService.updateTicket(ticket.id, { assignee: finalAssignee });
      setEditingAssignee(false);
      await loadTickets();
    } catch (err: any) {
      setError('Failed to update assignee.');
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !commentText.trim()) return;
    try {
      await CommentService.createComment(ticket.id, commentText.trim());
      setCommentText('');
      
      // Reload comments
      const commentsData = await CommentService.getComments(ticket.id);
      setComments(commentsData);
    } catch (err: any) {
      setError('Failed to post comment.');
    }
  };

  const handleDeleteTicket = async () => {
    if (!ticket || !window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await TicketService.deleteTicket(ticket.id);
      setSelectedTicketId(null);
      await loadTickets();
    } catch (err: any) {
      setError('Failed to delete ticket.');
    }
  };

  if (!selectedTicketId) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-[100] animate-fade-in">
      <div className="bg-background w-full max-w-5xl h-full flex flex-col shadow-2xl animate-slide-left overflow-y-auto custom-scrollbar">
        {/* Modal Header */}
        <div className="bg-surface border-b border-outline-variant h-16 px-margin flex items-center justify-between sticky top-0 z-50">
          <nav className="flex items-center gap-2 text-on-surface-variant">
            <span className="font-label-md text-label-md">Projects</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="font-label-md text-label-md">Core Platform</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="font-label-md text-label-md text-on-surface">KAN-{ticket?.id || selectedTicketId}</span>
          </nav>
          
          <button 
            onClick={() => setSelectedTicketId(null)}
            className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] animate-spin mb-4 text-primary">sync</span>
            <span className="text-body-lg">Loading task details...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-error">
            <span className="material-symbols-outlined text-[48px] mb-4">error</span>
            <span className="text-body-lg">{error}</span>
            <button 
              onClick={() => setSelectedTicketId(null)}
              className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md font-bold"
            >
              Back to Board
            </button>
          </div>
        ) : !ticket ? null : (
          <div className="w-full max-w-5xl px-margin py-margin space-y-10 flex-grow">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Detail Section (Left/Main) */}
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <h1 className="font-headline-xl text-headline-xl text-on-background mb-4 leading-snug">{ticket.title}</h1>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded bg-secondary-container text-on-secondary-container font-label-md text-label-sm uppercase tracking-wider">
                      {ticket.status}
                    </span>
                    <span className="px-3 py-1 rounded bg-surface-container-highest text-on-surface-variant font-label-md text-label-sm font-mono">
                      v2.4.0
                    </span>
                  </div>
                </div>

                {/* Description */}
                <section className="space-y-4">
                  <h2 className="font-headline-md text-headline-md text-on-background flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">description</span>
                    Description
                  </h2>
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 text-body-lg text-on-surface-variant leading-relaxed shadow-sm">
                    <p className="whitespace-pre-wrap">{ticket.description}</p>
                    
                    {/* Hardcoded attachments strictly from Stitch UI reference */}
                    <div className="mt-8 border-t border-outline-variant pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant hover:border-primary transition-colors cursor-pointer group">
                        <div className="flex items-center gap-2 text-label-sm font-label-md text-on-surface-variant mb-1 group-hover:text-primary">
                          <span className="material-symbols-outlined text-sm">attach_file</span>
                          Architecture_Draft.pdf
                        </div>
                        <p className="text-[10px] text-outline">2.4 MB • Updated 2h ago</p>
                      </div>
                      <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant hover:border-primary transition-colors cursor-pointer group">
                        <div className="flex items-center gap-2 text-label-sm font-label-md text-on-surface-variant mb-1 group-hover:text-primary">
                          <span className="material-symbols-outlined text-sm">image</span>
                          UI_Mockup_L0.png
                        </div>
                        <p className="text-[10px] text-outline">1.1 MB • Updated 5h ago</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Comments Section */}
                <section className="space-y-8">
                  <h2 className="font-headline-md text-headline-md text-on-background flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">chat_bubble</span>
                    Discussion
                  </h2>

                  {/* Comment Input */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center shrink-0">
                      U
                    </div>
                    <form onSubmit={handlePostComment} className="flex-1 space-y-4">
                      <textarea 
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[120px] font-body-md" 
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <div className="flex justify-end gap-3">
                        <button 
                          type="button" 
                          onClick={() => setCommentText('')}
                          className="px-5 py-2 border border-outline-variant text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors"
                        >
                          Discard
                        </button>
                        <button 
                          type="submit"
                          className="px-7 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity active:scale-[0.98]"
                        >
                          Post Comment
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Comment List */}
                  <div className="space-y-6">
                    {comments.length === 0 ? (
                      <p className="text-body-md text-on-surface-variant/60 italic pl-14">No discussions yet. Start the conversation!</p>
                    ) : (
                      comments.map(comment => (
                        <div key={comment.id} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container font-bold flex items-center justify-center shrink-0 border border-outline-variant">
                            {comment.created_by === ticket.created_by ? 'OP' : 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-label-md text-on-background">User #{comment.created_by}</span>
                              <span className="text-label-sm text-outline">• {new Date(comment.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-body-md text-on-surface-variant bg-surface-container-low p-4 rounded-xl whitespace-pre-wrap shadow-sm">
                              {comment.comment_text}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              {/* Sidebar (Right) */}
              <aside className="space-y-6">
                <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 space-y-8">
                  {/* Status Dropdown */}
                  <div>
                    <label className="block font-label-md text-label-md text-outline uppercase mb-3 tracking-widest">Status</label>
                    <select 
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg border border-primary/20 font-label-md text-label-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Complete">Complete</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block font-label-md text-label-md text-outline uppercase mb-3 tracking-widest">Priority</label>
                    <div className="flex items-center gap-2 text-error font-bold text-label-md px-1 select-none">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>priority_high</span>
                      Critical
                    </div>
                  </div>

                  {/* Assignee */}
                  <div>
                    <label className="block font-label-md text-label-md text-outline uppercase mb-3 tracking-widest">Assignee</label>
                    {editingAssignee ? (
                      <form onSubmit={handleAssigneeSubmit} className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Assignee name..."
                          className="flex-1 px-3 py-1.5 bg-white border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                          value={assigneeVal}
                          onChange={(e) => setAssigneeVal(e.target.value)}
                          autoFocus
                        />
                        <button type="submit" className="p-2 bg-primary text-on-primary rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined">check</span>
                        </button>
                      </form>
                    ) : (
                      <div 
                        onClick={() => setEditingAssignee(true)}
                        className="flex items-center gap-3 p-3 hover:bg-surface-container-high rounded-xl cursor-pointer transition-colors border border-transparent hover:border-outline-variant group"
                      >
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold border border-outline-variant">
                          {assigneeVal ? assigneeVal.slice(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-label-md text-on-background group-hover:text-primary transition-colors">{ticket.assignee || 'Unassigned'}</p>
                          <p className="text-[11px] text-outline">Click to change</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Labels */}
                  <div>
                    <label className="block font-label-md text-label-md text-outline uppercase mb-3 tracking-widest">Labels</label>
                    <div className="flex flex-wrap gap-2 px-1">
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">UI/UX</span>
                      <span className="px-2.5 py-1 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold border border-tertiary/20">Frontend</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="pt-6 border-t border-outline-variant space-y-4">
                    <div className="flex justify-between text-label-sm font-label-md">
                      <span className="text-outline">Created</span>
                      <span className="text-on-surface">{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-label-sm font-label-md">
                      <span className="text-outline">Updated</span>
                      <span className="text-on-surface">{new Date(ticket.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Card */}
                <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
                  <div className="flex flex-col gap-2">
                    <button className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all font-label-md text-label-md w-full">
                      <span className="material-symbols-outlined">share</span>
                      Share Issue
                    </button>
                    <button className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all font-label-md text-label-md w-full">
                      <span className="material-symbols-outlined">link</span>
                      Copy Link
                    </button>
                    <button 
                      onClick={handleDeleteTicket}
                      className="flex items-center gap-3 px-3 py-2 text-error hover:bg-error-container/20 rounded-lg transition-all font-label-md text-label-md w-full"
                    >
                      <span className="material-symbols-outlined">delete</span>
                      Archive Ticket
                    </button>
                  </div>
                </div>
              </aside>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
