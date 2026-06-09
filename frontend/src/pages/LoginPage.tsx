import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AuthService } from '../services/auth.service.ts';

export const LoginPage: React.FC = () => {
  const { setCurrentView, setIsAuthenticated, setUserId, loadTickets } = useApp();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(false);
    setError(null);
    try {
      const response = await AuthService.login(emailOrUsername, password);
      setIsAuthenticated(true);
      setUserId(response.userId);
      await loadTickets();
      setCurrentView('board');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="bg-[#f9f9ff] text-on-background min-h-screen flex flex-col justify-center items-center selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden relative w-full">
      {/* Background Pattern Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'radial-gradient(#c2c6d6 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/[0.03] blur-[120px] rounded-full -z-10"></div>
      
      <main className="relative w-full max-w-[480px] px-md py-xl flex flex-col items-center">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
            </div>
            <span className="font-headline-lg text-headline-lg text-primary tracking-tight">LinearFlow</span>
          </div>
          <p className="font-label-md text-label-md text-outline uppercase tracking-widest">High-performance task engineering</p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-surface border border-outline-variant rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-8">
            <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Welcome back</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">Enter your credentials to access your workspace.</p>
            
            {error && (
              <div className="mb-4 p-3 bg-error-container text-error rounded-lg text-body-md border border-error/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="email">Email Address or Username</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">mail</span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md" 
                    id="email" 
                    name="email" 
                    placeholder="name@company.com or username" 
                    type="text"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
                  <a className="font-label-md text-label-md text-primary hover:underline" href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">lock</span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Sign In Button */}
              <button 
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>
          </div>

          {/* Card Footer */}
          <div className="bg-surface-container-low border-t border-outline-variant p-6 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don't have an account?{' '}
              <a 
                className="text-primary font-bold hover:underline" 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView('register');
                }}
              >
                Sign up for free
              </a>
            </p>
          </div>
        </div>

        {/* Page Meta Info */}
        <div className="w-full mt-8 flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-outline">verified_user</span>
            <span className="font-label-sm text-label-sm text-outline tracking-wider">ISO-9001 CERTIFIED</span>
          </div>
          <div className="px-2 py-1 bg-surface-container-high rounded border border-outline-variant">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">v2.4.0-STABLE</span>
          </div>
        </div>
      </main>
      
      {/* Visual Polish */}
      <div className="fixed bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
    </div>
  );
};
