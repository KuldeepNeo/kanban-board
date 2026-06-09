import React, { createContext, useState, useEffect, useContext } from 'react';
import type { Ticket } from '../types/index.ts';
import { AuthService } from '../services/auth.service.ts';
import { TicketService } from '../services/ticket.service.ts';

type ViewType = 'login' | 'register' | 'board';

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  userId: number | null;
  setUserId: (id: number | null) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedTicketId: number | null;
  setSelectedTicketId: (id: number | null) => void;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  loadTickets: () => Promise<void>;
  logoutUser: () => Promise<void>;
  error: string | null;
  setError: (err: string | null) => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(AuthService.isAuthenticated());
  const [userId, setUserId] = useState<number | null>(AuthService.getUserId());
  const [currentView, setCurrentView] = useState<ViewType>(
    AuthService.isAuthenticated() ? 'board' : 'login'
  );
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadTickets = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await TicketService.getTickets();
      setTickets(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
      setIsAuthenticated(false);
      setUserId(null);
      setTickets([]);
      setSelectedTicketId(null);
      setCurrentView('login');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTickets();
    }
  }, [isAuthenticated]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userId,
        setUserId,
        currentView,
        setCurrentView,
        selectedTicketId,
        setSelectedTicketId,
        tickets,
        setTickets,
        loadTickets,
        logoutUser,
        error,
        setError,
        loading,
        setLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
