import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState("jamie.chen@campus.edu");
  const [password, setPassword] = useState("password");

  // Update default email when role changes
  React.useEffect(() => {
    setEmail(role === 'ORGANIZER' ? "alex.rivera@campus.edu" : "jamie.chen@campus.edu");
  }, [role]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      if (role === 'ORGANIZER') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-brand-100 text-brand-600 mb-4 font-bold text-xl">CF</div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your CampusFlow account</p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'STUDENT' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            onClick={() => setRole('STUDENT')}
          >
            Student
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'ORGANIZER' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            onClick={() => setRole('ORGANIZER')}
          >
            Organizer
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
            />
          </div>
          <Button type="submit" className="w-full mt-2">
            {role === 'ORGANIZER' ? 'Sign In to Dashboard' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Don't have an account? <Link to="/register" className="text-brand-600 font-medium hover:underline">Sign up</Link></p>
          <p className="text-xs text-gray-400 mt-4">Demo Mode: No password required</p>
        </div>
      </div>
    </div>
  );
};