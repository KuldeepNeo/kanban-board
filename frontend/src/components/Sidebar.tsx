import React from 'react';

interface SidebarProps {
  onCreateTaskClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCreateTaskClick }) => {
  return (
    <aside className="hidden md:flex flex-col h-full w-64 bg-surface-container-low border-r border-outline-variant p-card_padding gap-4 shrink-0">
      <div className="mb-4">
        <h2 className="text-headline-md font-bold text-on-surface">Workspace</h2>
        <p className="text-label-md text-on-surface-variant">Project Management</p>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        <a className="flex items-center gap-3 px-4 py-3 text-primary font-bold bg-secondary-container rounded-lg transition-transform duration-100 active:scale-95" href="#" onClick={(e) => e.preventDefault()}>
          <span className="material-symbols-outlined">folder</span>
          <span className="text-label-md">Projects</span>
        </a>
      </nav>
      <button 
        onClick={onCreateTaskClick}
        className="mt-auto w-full bg-primary text-on-primary py-3 rounded-lg text-label-md font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98]"
      >
        <span className="material-symbols-outlined">add</span>
        Create Task
      </button>
    </aside>
  );
};
