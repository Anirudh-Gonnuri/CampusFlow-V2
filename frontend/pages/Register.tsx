import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';
import { Zap, GraduationCap, Megaphone, ArrowRight, CheckCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ ...formData, role });
      navigate(role === 'ORGANIZER' ? '/dashboard' : '/');
    } catch (err) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl bg-surface-800 rounded-3xl shadow-2xl overflow-hidden border border-white/8 flex flex-col md:flex-row">

        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-brand-900 via-surface-800 to-surface-900 text-white p-10 w-2/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-800/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/50 via-brand-500/20 to-transparent" />

          <div className="relative">
            <div className="flex items-center gap-2.5 mb-10">
              <div className="w-8 h-8 rounded-xl bg-brand-600/30 border border-brand-500/40 flex items-center justify-center">
                <Zap size={16} className="text-brand-400" />
              </div>
              <span className="font-bold text-lg text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>CampusFlow</span>
            </div>
            <h2 className="text-2xl font-bold mb-3 leading-snug" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Start your campus journey today
            </h2>
            <p className="text-surface-300 text-sm leading-relaxed">
              Join thousands of students already using CampusFlow to make the most of their college experience.
            </p>
          </div>

          <div className="relative space-y-3">
            {['Free to join, always', 'Discover events tailored to you', 'Connect with your community'].map((t) => (
              <div key={t} className="flex items-center gap-3 text-sm text-surface-300">
                <CheckCircle size={14} className="text-brand-500 flex-shrink-0" /> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Create Account</h1>
            <p className="text-surface-400 text-sm mb-8">Join CampusFlow — it's free</p>

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

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Full Name', type: 'text', key: 'name', placeholder: 'e.g. Jordan Lee' },
                { label: 'Email Address', type: 'email', key: 'email', placeholder: 'name@campus.edu' },
                { label: role === 'ORGANIZER' ? 'Organization / Club Name' : 'Major / Department', type: 'text', key: 'department', placeholder: role === 'ORGANIZER' ? 'e.g. Tech Society' : 'e.g. Computer Science' },
                { label: 'Password', type: 'password', key: 'password', placeholder: '••••••••' },
              ].map(({ label, type, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-surface-200 mb-1.5">{label}</label>
                  <input type={type} required placeholder={placeholder}
                    className="w-full border border-white/8 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-surface-900 text-white placeholder-surface-400 transition-all"
                    value={(formData as any)[key]}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                  />
                </div>
              ))}
              <Button type="submit" className="w-full mt-2 gap-2 h-11">
                Create Account <ArrowRight size={15} />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-surface-400">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

