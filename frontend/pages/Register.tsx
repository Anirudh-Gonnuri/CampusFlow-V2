import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';

export const Register: React.FC = () => {
  const { register } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        department: formData.department,
      });

      if (role === 'ORGANIZER') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-brand-100 text-brand-600 mb-4 font-bold text-xl">CF</div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500">Join CampusFlow today</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Jordan Lee"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@campus.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {role === 'ORGANIZER' ? 'Organization / Department' : 'Major / Department'}
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              placeholder={role === 'ORGANIZER' ? "e.g. Chess Club" : "e.g. Computer Science"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full mt-4">
            Sign Up
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Already have an account? <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};