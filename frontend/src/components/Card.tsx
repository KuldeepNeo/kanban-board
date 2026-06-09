import React from 'react';
import type { Ticket } from '../types/index.ts';

interface CardProps {
  ticket: Ticket;
  onClick: () => void;
  onDragStart: (e: React.DragEvent, id: number) => void;
  commentsCount?: number;
}

export const Card: React.FC<CardProps> = ({ ticket, onClick, onDragStart, commentsCount = 0 }) => {
  // Extract a suitable category tag dynamically from title or default to 'Task'
  const getCategory = () => {
    const titleLower = ticket.title.toLowerCase();
    if (titleLower.includes('bug') || titleLower.includes('fix') || titleLower.includes('error')) {
      return { text: 'Bug', classes: 'bg-red-100 text-red-700' };
    }
    if (titleLower.includes('refactor') || titleLower.includes('cleanup') || titleLower.includes('clean')) {
      return { text: 'Refactor', classes: 'bg-purple-100 text-purple-700' };
    }
    if (titleLower.includes('design') || titleLower.includes('css') || titleLower.includes('theme')) {
      return { text: 'UI/UX', classes: 'bg-pink-100 text-pink-700' };
    }
    if (titleLower.includes('api') || titleLower.includes('database') || titleLower.includes('schema') || titleLower.includes('websocket')) {
      return { text: 'Backend', classes: 'bg-blue-100 text-blue-700' };
    }
    return { text: 'Feature', classes: 'bg-indigo-100 text-indigo-700' };
  };

  const category = getCategory();

  // Format creation date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  // Get assignee initials
  const getAssigneeInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, ticket.id)}
      onClick={onClick}
      className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm group hover:border-primary transition-all cursor-grab active:cursor-grabbing hover:shadow-md select-none"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${category.classes}`}>
          {category.text}
        </span>
        
        {/* Assignee Avatar/Initial Badge */}
        <div 
          className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-[10px] font-bold border border-outline-variant"
          title={ticket.assignee || 'Unassigned'}
        >
          {getAssigneeInitials(ticket.assignee)}
        </div>
      </div>
      
      <h4 className="text-body-lg font-semibold text-on-surface mb-3 leading-tight group-hover:text-primary transition-colors">
        {ticket.title}
      </h4>
      
      <div className="flex items-center gap-4 text-on-surface-variant">
        <span className="flex items-center gap-1 text-label-sm">
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          {formatDate(ticket.created_at)}
        </span>
        
        {commentsCount > 0 && (
          <span className="flex items-center gap-1 text-label-sm">
            <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
            {commentsCount}
          </span>
        )}
      </div>
    </div>
  );
};
