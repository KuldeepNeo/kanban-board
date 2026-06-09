import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TopNavbar } from '../components/TopNavbar.tsx';
import { Sidebar } from '../components/Sidebar.tsx';
import { Card } from '../components/Card.tsx';
import { TicketService } from '../services/ticket.service.ts';
import type { TicketStatus } from '../types/index.ts';

export const BoardPage: React.FC = () => {
  const { tickets, setTickets, loadTickets, setSelectedTicketId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState<TicketStatus>('Todo');
  const [newAssignee, setNewAssignee] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  // Drag and drop state
  const [draggedTicketId, setDraggedTicketId] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedTicketId(id);
    e.dataTransfer.setData('text/plain', id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TicketStatus) => {
    e.preventDefault();
    const idStr = e.dataTransfer.getData('text/plain') || draggedTicketId?.toString();
    if (!idStr) return;
    
    const id = parseInt(idStr, 10);
    setDraggedTicketId(null);

    // Find ticket and optimize state
    const originalTickets = [...tickets];
    const ticketToUpdate = tickets.find(t => t.id === id);
    if (!ticketToUpdate || ticketToUpdate.status === targetStatus) return;

    // Optimistic UI Update
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: targetStatus, updated_at: new Date().toISOString() } : t));

    try {
      await TicketService.updateTicket(id, { status: targetStatus });
    } catch (err) {
      console.error('Failed to update ticket status:', err);
      // Rollback
      setTickets(originalTickets);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      setCreateError('Title and Description are required.');
      return;
    }

    setCreateLoading(true);
    setCreateError(null);
    try {
      await TicketService.createTicket({
        title: newTitle.trim(),
        description: newDescription.trim(),
        status: newStatus,
        assignee: newAssignee.trim() || null
      });

      // Clear form
      setNewTitle('');
      setNewDescription('');
      setNewStatus('Todo');
      setNewAssignee('');
      setIsCreateModalOpen(false);
      
      // Reload tickets
      await loadTickets();
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create ticket.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Filter tickets based on search query
  const filteredTickets = tickets.filter(ticket => 
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ticket.assignee && ticket.assignee.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns: { status: TicketStatus; label: string; countColor: string }[] = [
    { status: 'Todo', label: 'Todo', countColor: 'bg-surface-container-highest text-on-surface-variant' },
    { status: 'In Progress', label: 'In Progress', countColor: 'bg-primary text-on-primary font-bold' },
    { status: 'Complete', label: 'Complete', countColor: 'bg-green-100 text-green-800 font-bold' },
    { status: 'Closed', label: 'Closed', countColor: 'bg-slate-200 text-slate-800 font-bold' }
  ];

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <TopNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onCreateTaskClick={() => setIsCreateModalOpen(true)} />
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
          {/* Header Section */}
          <div className="max-w-[1440px] w-full mx-auto px-margin pt-8 pb-6 flex items-end justify-between shrink-0">
            <div>
              <h1 className="text-headline-xl text-on-background">Engineering Tasks</h1>
              <p className="text-body-md text-on-surface-variant mt-1">V2.4 Architecture Refactor</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-label-md font-medium hover:bg-surface-container-high transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">filter_list</span>
                Filter
              </button>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                <span className="material-symbols-outlined">add</span>
                Create Task
              </button>
            </div>
          </div>

          {/* Kanban Board Container */}
          <div className="flex-1 overflow-x-auto kanban-container">
            <div className="inline-flex min-w-full justify-center px-margin pb-8">
              <div className="flex gap-gutter items-start max-w-[1440px]">
                {columns.map(col => {
                  const colTickets = filteredTickets.filter(t => t.status === col.status);
                  
                  return (
                    <div 
                      key={col.status} 
                      className="flex-shrink-0 w-lane_width flex flex-col gap-4"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, col.status)}
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">{col.label}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-label-sm ${col.countColor}`}>
                            {colTickets.length}
                          </span>
                        </div>
                        <button className="text-on-surface-variant hover:text-primary">
                          <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                      </div>

                      {/* Drop Area / Column Body */}
                      <div className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-2 border border-outline-variant min-h-[550px] transition-colors">
                        {colTickets.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant/40 text-center flex-grow select-none">
                            <span className="material-symbols-outlined text-[36px] mb-2">dashboard_customize</span>
                            <span className="text-label-sm font-semibold uppercase tracking-wider">Empty Lane</span>
                          </div>
                        ) : (
                          colTickets.map(ticket => (
                            <Card 
                              key={ticket.id} 
                              ticket={ticket} 
                              onClick={() => setSelectedTicketId(ticket.id)}
                              onDragStart={handleDragStart}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Task Creation Modal Overlay */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4 animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="text-headline-md font-bold text-on-surface">Create New Task</h3>
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setCreateError(null);
                }} 
                className="text-on-surface-variant hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {createError && (
                <div className="p-3 bg-error-container text-error rounded-lg text-body-md border border-error/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <span>{createError}</span>
                </div>
              )}

              {/* Title Field */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="title">Task Title</label>
                <input 
                  className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md" 
                  id="title" 
                  placeholder="e.g. Implement WebSocket reconnection" 
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  disabled={createLoading}
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="description">Description</label>
                <textarea 
                  className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md min-h-[100px]" 
                  id="description" 
                  placeholder="Describe the engineering details..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  disabled={createLoading}
                />
              </div>

              {/* Status & Assignee Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="status">Initial Status</label>
                  <select 
                    className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md" 
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TicketStatus)}
                    disabled={createLoading}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="assignee">Assignee Name</label>
                  <input 
                    className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md" 
                    id="assignee" 
                    placeholder="e.g. johnsmith" 
                    type="text"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    disabled={createLoading}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant mt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setCreateError(null);
                  }}
                  className="px-5 py-2.5 border border-outline-variant text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors"
                  disabled={createLoading}
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="px-7 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50"
                  disabled={createLoading}
                >
                  {createLoading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
