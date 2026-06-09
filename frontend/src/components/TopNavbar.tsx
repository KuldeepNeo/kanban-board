import React from 'react';
import { useApp } from '../context/AppContext.tsx';

interface TopNavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ searchQuery, setSearchQuery }) => {
  const { logoutUser } = useApp();

  // Try to decode username from localStorage token
  const getInitials = () => {
    const token = localStorage.getItem('token');
    if (!token) return 'U';
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      const username = decoded.username || 'User';
      return username.slice(0, 2).toUpperCase();
    } catch {
      return 'US';
    }
  };

  const getUsername = () => {
    const token = localStorage.getItem('token');
    if (!token) return 'User';
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.username || 'User';
    } catch {
      return 'User';
    }
  };

  return (
    <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-margin h-16 z-50 sticky top-0 shrink-0">
      <div className="flex items-center gap-8">
        <span className="text-headline-md font-bold text-primary">Mission Control</span>
        <nav className="hidden md:flex items-center gap-6">
          <a className="text-primary font-bold border-b-2 border-primary h-16 flex items-center px-2 text-label-md" href="#" onClick={(e) => e.preventDefault()}>Projects</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            className="bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64" 
            placeholder="Search tasks..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* User Info & Logout Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold cursor-help" 
              title={`Logged in as ${getUsername()}`}
            >
              {getInitials()}
            </div>
            <span className="hidden sm:inline font-body-md text-on-surface-variant font-semibold">{getUsername()}</span>
          </div>

          <button 
            onClick={logoutUser}
            className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors flex items-center justify-center"
            title="Log Out"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
