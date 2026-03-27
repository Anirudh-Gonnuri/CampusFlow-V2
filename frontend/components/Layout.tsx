import React, { useState } from 'react';
import { Link, useLocation } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import { PlusCircle, LogOut, Compass, LayoutDashboard, Bell, Ticket, Menu, X, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { Chatbot } from './Chatbot';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, notifications, unreadCount, markNotificationRead } = useApp();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  if (location.pathname.startsWith('/event/')) {
    return <>{children}</>;
  }

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id);
    setShowNotifications(false);
  };

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-sm glow-red">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Campus<span className="text-brand-400">Flow</span>
            </span>
          </Link>

          {/* Center Nav — desktop */}
          <nav className="hidden md:flex justify-center items-center gap-1 flex-1 mx-8">
            <Link
              to="/"
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all ${
                isActive('/') ? 'bg-brand-600/20 text-brand-400 border border-brand-500/20' : 'text-surface-200 hover:bg-surface-700 hover:text-white'
              }`}
            >
              <Compass size={16} /> Discover
            </Link>
            {user?.role === 'ORGANIZER' ? (
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all ${
                  isActive('/dashboard') ? 'bg-brand-600/20 text-brand-400 border border-brand-500/20' : 'text-surface-200 hover:bg-surface-700 hover:text-white'
                }`}
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
            ) : user?.role === 'STUDENT' ? (
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all ${
                  isActive('/dashboard') ? 'bg-brand-600/20 text-brand-400 border border-brand-500/20' : 'text-surface-200 hover:bg-surface-700 hover:text-white'
                }`}
              >
                <Ticket size={16} /> My Events
              </Link>
            ) : null}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    className="relative text-surface-300 hover:text-white transition-colors p-2 rounded-xl hover:bg-surface-700"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-brand-500 rounded-full border border-surface-900 text-[9px] text-white flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                      <div className="absolute right-0 mt-2 w-80 bg-surface-800 rounded-2xl shadow-2xl border border-white/8 py-2 z-40 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-2.5 border-b border-white/6 flex justify-between items-center">
                          <h3 className="font-semibold text-white text-sm">Notifications</h3>
                          {unreadCount > 0 && <span className="text-xs text-brand-400 font-semibold bg-brand-600/20 px-2 py-0.5 rounded-full border border-brand-500/20">{unreadCount} new</span>}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length > 0 ? notifications.map(n => (
                            <div
                              key={n.id}
                              className={`px-4 py-3 hover:bg-surface-700 border-b border-white/4 last:border-0 cursor-pointer transition-colors ${!n.isRead ? 'bg-brand-900/20' : ''}`}
                              onClick={() => handleNotificationClick(n.id)}
                            >
                              <div className="flex gap-3">
                                <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${!n.isRead ? 'bg-brand-500' : 'bg-transparent'}`} />
                                <div>
                                  <p className={`text-sm ${!n.isRead ? 'font-semibold text-white' : 'text-surface-200'}`}>{n.title}</p>
                                  <p className="text-xs text-surface-300 mt-0.5 line-clamp-2">{n.message}</p>
                                  <p className="text-[10px] text-surface-400 mt-1.5">{new Date(n.timestamp).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </div>
                          )) : (
                            <div className="px-4 py-10 text-center text-surface-400 text-sm">
                              <Bell size={28} className="mx-auto mb-2 opacity-30" />
                              No notifications yet.
                            </div>
                          )}
                        </div>
                        <div className="px-4 py-2 border-t border-white/6 text-center">
                          <button className="text-xs text-brand-400 font-semibold hover:text-brand-300">Mark all as read</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {user.role === 'ORGANIZER' && (
                  <Link to="/create-event" className="hidden sm:block">
                    <Button size="sm" className="gap-1.5">
                      <PlusCircle size={14} /> New Event
                    </Button>
                  </Link>
                )}

                <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/8">
                  <Link to="/profile">
                    <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full ring-2 ring-surface-600 hover:ring-brand-500 transition-all cursor-pointer" />
                  </Link>
                  <button onClick={logout} className="text-surface-400 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-surface-700">
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button size="sm">Sign In</Button>
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-xl text-surface-300 hover:bg-surface-700 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface-900/98 backdrop-blur-sm border-t border-white/6 px-4 py-4 space-y-1 animate-in slide-up duration-200">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive('/') ? 'bg-brand-600/20 text-brand-400' : 'text-surface-200 hover:bg-surface-700 hover:text-white'}`}>
              <Compass size={18} /> Discover Events
            </Link>
            {user && (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive('/dashboard') ? 'bg-brand-600/20 text-brand-400' : 'text-surface-200 hover:bg-surface-700 hover:text-white'}`}>
                {user.role === 'ORGANIZER' ? <LayoutDashboard size={18} /> : <Ticket size={18} />}
                {user.role === 'ORGANIZER' ? 'Dashboard' : 'My Events'}
              </Link>
            )}
            {user?.role === 'ORGANIZER' && (
              <Link to="/create-event" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brand-400 hover:bg-surface-700 transition-colors">
                <PlusCircle size={18} /> Create Event
              </Link>
            )}
            <div className="pt-3 border-t border-white/6 mt-2">
              {user ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full ring-2 ring-surface-600" />
                    <div>
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-white hover:text-brand-400">{user.name}</Link>
                      <p className="text-xs text-surface-400">{user.department}</p>
                    </div>
                  </div>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-sm text-red-400 hover:text-red-300 font-medium flex items-center gap-1">
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-surface-900 border-t border-white/6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center glow-red">
                  <Zap size={14} className="text-white" />
                </div>
                <span className="font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Campus<span className="text-brand-400">Flow</span>
                </span>
              </div>
              <p className="text-sm text-surface-300 leading-relaxed">Your campus, fully connected. Discover events, build teams, and never miss out on what's happening around you.</p>
            </div>

            <div className="flex flex-wrap gap-12">
              <div>
                <h4 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-3">Platform</h4>
                <ul className="space-y-2 text-sm text-surface-300">
                  <li><Link to="/" className="hover:text-brand-400 transition-colors">Browse Events</Link></li>
                  <li><Link to="/dashboard" className="hover:text-brand-400 transition-colors">Dashboard</Link></li>
                  <li><Link to="/create-event" className="hover:text-brand-400 transition-colors">Host an Event</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-3">Account</h4>
                <ul className="space-y-2 text-sm text-surface-300">
                  <li><Link to="/login" className="hover:text-brand-400 transition-colors">Sign In</Link></li>
                  <li><Link to="/register" className="hover:text-brand-400 transition-colors">Create Account</Link></li>
                  <li><Link to="/profile" className="hover:text-brand-400 transition-colors">Profile</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-white/6 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-surface-400">
            <span>© {new Date().getFullYear()} CampusFlow. All rights reserved.</span>
            <span>Built with ❤️ for students, by students.</span>
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );div>
  );
};