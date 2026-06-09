import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AuthService } from '../services/auth.service.ts';

export const RegisterPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await AuthService.register(fullName, email, password);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        setCurrentView('login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f9f9ff] text-on-surface min-h-screen flex flex-col justify-center items-center selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden relative w-full">
      {/* Background Pattern Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'radial-gradient(#c2c6d6 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/[0.03] blur-[120px] rounded-full -z-10"></div>
      
      <main className="relative w-full max-w-[480px] px-md py-xl flex flex-col items-center">
        {/* Brand Identity Section */}
        <div className="flex flex-col items-center mb-xl text-center">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-lg shadow-xl shadow-primary/20">
            <span className="material-symbols-outlined text-on-primary !text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_tree</span>
          </div>
          <h1 className="font-display text-display tracking-tight text-on-surface">LinearFlow</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">High-performance task engineering</p>
        </div>

        {/* Registration Card */}
        <div className="tonal-layering w-full p-8 rounded-xl shadow-2xl bg-surface-container-lowest border border-outline-variant">
          <div className="mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Create account</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Start building your next big project.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error-container text-error rounded-lg text-body-md border border-error/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-body-md border border-green-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-lg">
            {/* Name Field */}
            <div className="flex flex-col space-y-sm">
              <label className="font-label-sm text-label-sm text-outline uppercase tracking-widest" htmlFor="full_name">Full Name</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline transition-all duration-300 group-focus-within:text-primary">person</span>
                <input 
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-12 pr-md font-body-md text-body-md text-on-surface placeholder:text-outline/40 input-focus-ring transition-all" 
                  id="full_name" 
                  placeholder="Engineering Lead" 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col space-y-sm">
              <label className="font-label-sm text-label-sm text-outline uppercase tracking-widest" htmlFor="email_address">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline transition-all duration-300 group-focus-within:text-primary">mail</span>
                <input 
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-12 pr-md font-body-md text-body-md text-on-surface placeholder:text-outline/40 input-focus-ring transition-all" 
                  id="email_address" 
                  placeholder="name@company.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-sm">
              <label className="font-label-sm text-label-sm text-outline uppercase tracking-widest" htmlFor="account_password">Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline transition-all duration-300 group-focus-within:text-primary">lock</span>
                <input 
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-12 pr-md font-body-md text-body-md text-on-surface placeholder:text-outline/40 input-focus-ring transition-all" 
                  id="account_password" 
                  placeholder="••••••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Primary Action */}
            <button 
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-lg hover:bg-primary/95 active:scale-[0.99] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-sm mt-xl disabled:opacity-50" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              <span className="material-symbols-outlined !text-[18px]">arrow_forward</span>
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <p className="mt-lg text-center font-body-md text-body-md text-on-surface-variant">
          Already have an account?{' '}
          <a 
            className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/40 transition-all" 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentView('login');
            }}
          >
            Log in
          </a>
        </p>

        {/* Aesthetic Branding Element */}
        <div className="mt-xl flex justify-center items-center gap-md opacity-40 pointer-events-none">
          <span className="font-label-sm text-label-sm">ISO-9001 CERTIFIED</span>
          <span className="w-1 h-1 bg-outline rounded-full"></span>
          <span className="font-label-sm text-label-sm">v2.4.0-STABLE</span>
        </div>
      </main>

      {/* Visual Polish */}
      <div className="fixed bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
    </div>
  );
};
