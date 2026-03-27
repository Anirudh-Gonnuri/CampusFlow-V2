import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';
import { Zap, GraduationCap, Megaphone, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState("jamie.chen@campus.edu");
  const [password, setPassword] = useState("password");

  React.useEffect(() => {
    setEmail(role === 'ORGANIZER' ? "alex.rivera@campus.edu" : "jamie.chen@campus.edu");
  }, [role]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(role === 'ORGANIZER' ? '/dashboard' : '/');
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl bg-surface-800 rounded-3xl shadow-2xl overflow-hidden border border-white/8 flex flex-col md:flex-row">

        {/* Left brand panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-brand-900 via-brand-800 to-surface-900 text-white p-10 w-2/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/60 via-brand-500/20 to-transparent" />

          <div className="relative">
            <div className="flex items-center gap-2.5 mb-10">
              <div className="w-8 h-8 rounded-xl bg-brand-600/30 border border-brand-500/40 flex items-center justify-center">
                <Zap size={16} className="text-brand-400" />
              </div>
              <span className="font-bold text-lg text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>CampusFlow</span>
            </div>
            <h2 className="text-2xl font-bold mb-3 leading-snug" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Welcome back to your campus hub
            </h2>
            <p className="text-surface-300 text-sm leading-relaxed">
              Sign in to discover events, connect with peers, and stay on top of everything happening around you.
            </p>
          </div>

          <div className="relative space-y-3">
            {['Register for events in seconds', 'Get real-time notifications', 'Build and join teams'].map((t) => (
              <div key={t} className="flex items-center gap-3 text-sm text-surface-300">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Sign In</h1>
            <p className="text-surface-400 text-sm mb-8">Access your CampusFlow account</p>

            {/* Role Toggle */}
            <div className="flex p-1 bg-surface-900 rounded-xl mb-7 gap-1 border border-white/6">
              {([['STUDENT', GraduationCap, 'Student'], ['ORGANIZER', Megaphone, 'Organizer']] as const).map(([r, Icon, label]) => (
                <button key={r} type="button" onClick={() => setRole(r as UserRole)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    role === r ? 'bg-brand-600 text-white shadow' : 'text-surface-300 hover:text-white'
                  }`}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-200 mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-white/8 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-surface-900 text-white placeholder-surface-400 transition-all" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-surface-200">Password</label>
                  <span className="text-xs text-brand-400 hover:underline cursor-pointer">Forgot?</span>
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-white/8 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-surface-900 text-white transition-all" />
              </div>
              <Button type="submit" className="w-full mt-2 gap-2 h-11">
                {role === 'ORGANIZER' ? 'Sign In to Dashboard' : 'Sign In'} <ArrowRight size={15} />
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-surface-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-brand-400 font-semibold hover:underline">Create one</Link>
              </p>
              <div className="inline-flex items-center gap-2 text-xs text-surface-500 bg-surface-900 px-3 py-1.5 rounded-full border border-white/6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Demo mode — any password works
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
