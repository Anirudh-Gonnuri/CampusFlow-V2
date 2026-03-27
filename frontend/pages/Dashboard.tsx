import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, Navigate } from '../context/AppContext';
import { PlusCircle, Users, Calendar, TrendingUp, Settings, Ticket, Clock, MapPin, Bookmark, BarChart, QrCode, XCircle, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Dashboard: React.FC = () => {
  const { user, events, myRegistrations, savedEvents, toggleSaveEvent, cancelRegistration } = useApp();
  const [activeTab, setActiveTab] = useState<'tickets' | 'saved'>('tickets');

  if (!user) {
    return <Navigate to="/login" />;
  }

  // --- STUDENT DASHBOARD VIEW ---
  if (user.role === 'STUDENT') {
      const handleCancel = (eventId: string, eventTitle: string) => {
        if (window.confirm(`Cancel registration for "${eventTitle}"? This cannot be undone.`)) {
            cancelRegistration(eventId);
        }
      };

      return (
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-surface-800 border border-white/8 rounded-2xl p-7 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-48 h-48 bg-brand-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-1">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full ring-2 ring-brand-500/40" />
                <div>
                  <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>My Dashboard</h1>
                  <p className="text-surface-400 text-sm">Hey {user.name.split(' ')[0]}, here's what's happening ✨</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-800 p-6 rounded-2xl border border-white/8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-sm">
                <Ticket size={22} />
              </div>
              <div>
                <p className="text-xs text-surface-400 font-semibold uppercase tracking-wide">Registered</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{myRegistrations.length}</p>
              </div>
            </div>
            <div className="bg-surface-800 p-6 rounded-2xl border border-white/8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-accent-500 to-accent-400 text-white shadow-sm">
                <Bookmark size={22} />
              </div>
              <div>
                <p className="text-xs text-surface-400 font-semibold uppercase tracking-wide">Saved</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{savedEvents.length}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-surface-800 rounded-2xl border border-white/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/6 flex gap-1 bg-surface-900/50">
              {(['tickets', 'saved'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
                    activeTab === tab
                      ? 'bg-surface-700 text-white shadow-sm'
                      : 'text-surface-400 hover:text-white hover:bg-surface-700/50'
                  }`}
                >
                  {tab === 'tickets' ? 'My Tickets' : 'Saved Events'}
                </button>
              ))}
            </div>

            {activeTab === 'tickets' && (
              myRegistrations.length > 0 ? (
                <div className="divide-y divide-white/6">
                  {myRegistrations.map((event) => (
                    <div key={event.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-surface-700/30 transition-colors gap-4">
                      <div className="flex gap-4">
                        <div className="h-16 w-16 rounded-xl bg-surface-700 overflow-hidden flex-shrink-0">
                          <img src={event.bannerImage} className="w-full h-full object-cover" alt={event.title} />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{event.title}</h3>
                          <div className="flex flex-wrap gap-3 text-xs text-surface-400 mt-1.5">
                            <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(event.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock size={12}/> {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span className="flex items-center gap-1"><MapPin size={12}/> {event.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto items-center flex-wrap">
                        <Link to={`/event/${event.id}`} className="flex-1 md:flex-none">
                          <Button size="sm" className="w-full">View Event</Button>
                        </Link>
                        <Button variant="outline" size="sm">QR Code</Button>
                        <button
                          onClick={() => handleCancel(event.id, event.title)}
                          className="p-2 text-brand-400 hover:bg-brand-900/30 hover:text-brand-300 rounded-xl transition-colors"
                          title="Cancel Registration"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-14 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-700 mb-4">
                    <Ticket className="text-surface-400" size={28} />
                  </div>
                  <p className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>No upcoming events</p>
                  <p className="text-surface-400 text-sm mb-6">Explore campus and find something you love!</p>
                  <Link to="/"><Button>Browse Events</Button></Link>
                </div>
              )
            )}

            {activeTab === 'saved' && (
              savedEvents.length > 0 ? (
                <div className="divide-y divide-white/6">
                  {savedEvents.map((event) => (
                    <div key={event.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-surface-700/30 transition-colors gap-4">
                      <div className="flex gap-4">
                        <div className="h-14 w-14 rounded-xl bg-surface-700 overflow-hidden flex-shrink-0">
                          <img src={event.bannerImage} className="w-full h-full object-cover" alt={event.title} />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{event.title}</h3>
                          <div className="flex flex-wrap gap-3 text-xs text-surface-400 mt-1">
                            <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(event.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><MapPin size={12}/> {event.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto flex-wrap">
                        <Link to={`/event/${event.id}`} className="flex-1 md:flex-none">
                          <Button variant="outline" size="sm" className="w-full">View Details</Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-brand-400 hover:text-brand-300 hover:bg-brand-900/20" onClick={() => toggleSaveEvent(event.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-14 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-700 mb-4">
                    <Bookmark className="text-surface-400" size={28} />
                  </div>
                  <p className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>No saved events</p>
                  <p className="text-surface-400 text-sm mb-6">Bookmark events to revisit them here.</p>
                  <Link to="/"><Button>Browse Events</Button></Link>
                </div>
              )
            )}
          </div>
        </div>
      );
  }

  // --- ORGANIZER DASHBOARD VIEW ---
  const myEvents = events.filter(e => e.createdBy === user.id);

  const stats = [
    { label: 'Total Events', value: myEvents.length, icon: Calendar, gradient: 'from-brand-500 to-brand-400' },
    { label: 'Total Attendees', value: myEvents.reduce((acc, e) => acc + e.attendeeCount, 0), icon: Users, gradient: 'from-emerald-500 to-teal-400' },
    { label: 'Avg. Engagement', value: '85%', icon: TrendingUp, gradient: 'from-accent-500 to-accent-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-surface-800 border border-white/8 rounded-2xl p-7 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-brand-400" />
              <span className="text-brand-400 text-sm font-medium">Organizer Portal</span>
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Your Dashboard</h1>
            <p className="text-surface-400 text-sm mt-1">Manage events, track attendance, and analyze performance.</p>
          </div>
          <Link to="/create-event">
            <Button className="gap-2 shadow-md">
              <PlusCircle size={16} /> New Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-800 p-6 rounded-2xl border border-white/8 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} text-white shadow-sm`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-xs text-surface-400 font-semibold uppercase tracking-wide">{stat.label}</p>
              <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Events Table */}
      <div className="bg-surface-800 rounded-2xl border border-white/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/6 flex justify-between items-center bg-surface-900/50">
          <h2 className="text-base font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Your Events</h2>
          {myEvents.length > 0 && <Button variant="outline" size="sm">View All</Button>}
        </div>
        <div className="overflow-x-auto">
          {myEvents.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-surface-900/50 text-surface-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Event</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Attendees</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {myEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-surface-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{event.title}</div>
                      <div className="text-xs text-brand-400 font-medium mt-0.5">{event.category}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-400">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        event.status === 'PUBLISHED'
                          ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-900/40 text-amber-400 border border-amber-500/20'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-surface-300">
                      {event.attendeeCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        <Link to={`/event/${event.id}/checkin`}>
                          <Button variant="secondary" size="sm" className="h-8 gap-1.5 bg-brand-900/30 text-brand-400 hover:bg-brand-900/50 border border-brand-700/30">
                            <QrCode size={13} /> Check-in
                          </Button>
                        </Link>
                        <Link to={`/event/${event.id}/analytics`}>
                          <Button variant="secondary" size="sm" className="h-8 gap-1.5 bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-700/30">
                            <BarChart size={13} /> Analytics
                          </Button>
                        </Link>
                        <Link to={`/create-event?edit=${event.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-surface-400 hover:text-brand-400">
                            <Settings size={15} />
                          </Button>
                        </Link>
                        <Link to={`/event/${event.id}`}>
                          <Button variant="outline" size="sm" className="text-xs h-8">View</Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-14 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-700 mb-4">
                <Calendar className="text-surface-400" size={28} />
              </div>
              <p className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>No events yet</p>
              <p className="text-surface-400 text-sm mb-6">Create your first event to get started.</p>
              <Link to="/create-event">
                <Button className="gap-2 mx-auto"><PlusCircle size={16} /> Create First Event</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};