import React, { useState } from 'react';
import { Link, useLocation } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import { Calendar, User, PlusCircle, LogOut, Compass, LayoutDashboard, Bell, Ticket, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';
import { Chatbot } from './Chatbot';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, notifications, unreadCount, markNotificationRead } = useApp();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Don't show layout on event detail pages to allow full theming
  if (location.pathname.startsWith('/event/')) {
    return <>{children}</>;
  }

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id);
    setShowNotifications(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between md:grid md:grid-cols-3 items-center">

          {/* Left: Logo */}
          <div className="flex justify-start">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">
                CF
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">CampusFlow</span>
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex justify-center items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 text-sm font-medium ${isActive('/') ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Compass size={18} />
              Discovery
            </Link>
            {user?.role === 'ORGANIZER' ? (
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 text-sm font-medium ${isActive('/dashboard') ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            ) : user?.role === 'STUDENT' ? (
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 text-sm font-medium ${isActive('/dashboard') ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Ticket size={18} />
                My Events
              </Link>
            ) : null}
          </nav>

          {/* Right: User Actions */}
          <div className="flex justify-end items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    className="relative text-gray-500 hover:text-gray-700 transition-colors p-1"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border border-white text-[10px] text-white flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)}></div>
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-40 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && <span className="text-xs text-brand-600 font-medium">{unreadCount} new</span>}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map(n => (
                              <div
                                key={n.id}
                                className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                                onClick={() => handleNotificationClick(n.id)}
                              >
                                <div className="flex gap-3">
                                  <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${!n.isRead ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                  <div>
                                    <p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                                    <p className="text-[10px] text-gray-400 mt-2">{new Date(n.timestamp).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-8 text-center text-gray-500 text-sm">
                              No notifications yet.
                            </div>
                          )}
                        </div>
                        <div className="px-4 py-2 border-t border-gray-100 text-center">
                          <button className="text-xs text-brand-600 font-medium hover:text-brand-800">Mark all as read</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {user.role === 'ORGANIZER' && (
                  <Link to="/create-event">
                    <Button size="sm" className="hidden sm:flex gap-2">
                      <PlusCircle size={16} />
                      Create Event
                    </Button>
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="text-right hidden sm:block">
                    <Link to="/profile" className="text-sm font-medium text-gray-900 hover:underline">{user.name}</Link>
                    <p className="text-xs text-gray-500">{user.department}</p>
                  </div>
                  <Link to="/profile">
                    <img src={user.avatar} alt="Profile" className="w-9 h-9 rounded-full bg-gray-200 hover:ring-2 hover:ring-brand-500 transition-all" />
                  </Link>
                  <button onClick={logout} className="text-gray-400 hover:text-red-600 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © 2024 CampusFlow. All rights reserved. Built for students, by students.
        </div>
      </footer>
      <Chatbot />
    </div>
  );
};