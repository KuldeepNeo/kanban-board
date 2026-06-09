import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { BoardPage } from './pages/BoardPage.tsx';
import { TicketDetailPage } from './pages/TicketDetailPage.tsx';

const AppContent: React.FC = () => {
  const { currentView, selectedTicketId } = useApp();

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-background bg-background relative overflow-hidden">
      {/* Dynamic View Switcher */}
      {currentView === 'login' && <LoginPage />}
      {currentView === 'register' && <RegisterPage />}
      {currentView === 'board' && <BoardPage />}
      
      {/* Floating Ticket Detail View */}
      {selectedTicketId !== null && <TicketDetailPage />}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
