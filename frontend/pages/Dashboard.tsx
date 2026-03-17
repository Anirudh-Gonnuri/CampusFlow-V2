import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, Navigate } from '../context/AppContext';
import { PlusCircle, Users, Calendar, TrendingUp, Settings, Ticket, Clock, MapPin, Bookmark, BarChart, QrCode, XCircle } from 'lucide-react';
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
        if (window.confirm(`Are you sure you want to cancel your registration for ${eventTitle}? This action cannot be undone.`)) {
            cancelRegistration(eventId);
        }
      };

      return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user.name}. Here are your upcoming events.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Stats for Student */}
                 <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
                        <Ticket size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Registered Events</p>
                        <p className="text-2xl font-bold text-gray-900">{myRegistrations.length}</p>
                    </div>
                </div>
                {/* Saved Stat */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-50 text-purple-600">
                        <Bookmark size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Saved Events</p>
                        <p className="text-2xl font-bold text-gray-900">{savedEvents.length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex gap-6 bg-gray-50">
                    <button 
                        onClick={() => setActiveTab('tickets')}
                        className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${activeTab === 'tickets' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        My Tickets
                    </button>
                    <button 
                        onClick={() => setActiveTab('saved')}
                        className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${activeTab === 'saved' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Saved Events
                    </button>
                </div>
                
                {activeTab === 'tickets' && (
                    myRegistrations.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {myRegistrations.map((event) => (
                                <div key={event.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                            <img src={event.bannerImage} className="w-full h-full object-cover" alt={event.title} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(event.date).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><Clock size={14}/> {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                <span className="flex items-center gap-1"><MapPin size={14}/> {event.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex gap-2 w-full md:w-auto items-center">
                                        <Link to={`/event/${event.id}`} className="w-full md:w-auto">
                                            <Button className="w-full">View Event</Button>
                                        </Link>
                                        <Button variant="outline" className="w-full md:w-auto">QR Code</Button>
                                        <button 
                                            onClick={() => handleCancel(event.id, event.title)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                                            title="Cancel Registration"
                                        >
                                            <XCircle size={24} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Ticket className="text-gray-400" size={32} />
                            </div>
                            <p className="text-lg font-medium text-gray-900">No upcoming events</p>
                            <p className="mb-6">Explore the campus and find something you like!</p>
                            <Link to="/">
                                <Button>Browse Events</Button>
                            </Link>
                        </div>
                    )
                )}

                {activeTab === 'saved' && (
                    savedEvents.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {savedEvents.map((event) => (
                                <div key={event.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                            <img src={event.bannerImage} className="w-full h-full object-cover" alt={event.title} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(event.date).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><MapPin size={14}/> {event.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex gap-2 w-full md:w-auto">
                                        <Link to={`/event/${event.id}`} className="w-full md:w-auto">
                                            <Button variant="outline" className="w-full">View Details</Button>
                                        </Link>
                                        <Button 
                                            variant="ghost" 
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => toggleSaveEvent(event.id)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Bookmark className="text-gray-400" size={32} />
                            </div>
                            <p className="text-lg font-medium text-gray-900">No saved events</p>
                            <p className="mb-6">Bookmark events to view them here later.</p>
                            <Link to="/">
                                <Button>Browse Events</Button>
                            </Link>
                        </div>
                    )
                )}
            </div>
        </div>
      );
  }

  // --- ORGANIZER DASHBOARD VIEW ---
  // Only show events created by the logged-in organizer
  const myEvents = events.filter(e => e.createdBy === user.id); 

  const stats = [
    { label: 'Total Events', value: myEvents.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Attendees', value: myEvents.reduce((acc, e) => acc + e.attendeeCount, 0), icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Avg. Engagement', value: '85%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your events, analyze performance, and configure themes.</p>
        </div>
        <Link to="/create-event">
          <Button className="flex items-center gap-2">
            <PlusCircle size={18} />
            Create New Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Your Events</h2>
          {myEvents.length > 0 && <Button variant="outline" size="sm">View All</Button>}
        </div>
        <div className="overflow-x-auto">
          {myEvents.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-medium">Event Name</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Attendees</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {myEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{event.title}</div>
                      <div className="text-xs text-gray-500">{event.category}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {event.attendeeCount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                         <Link to={`/event/${event.id}/checkin`}>
                            <Button variant="outline" size="sm" className="h-8 gap-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                                <QrCode size={14} /> Check-in
                            </Button>
                         </Link>
                         <Link to={`/event/${event.id}/analytics`}>
                            <Button variant="outline" size="sm" className="h-8 gap-2 border-brand-200 text-brand-700 bg-brand-50 hover:bg-brand-100 hover:text-brand-800 hover:border-brand-300">
                                <BarChart size={14} /> Analytics
                            </Button>
                         </Link>
                         <Link to={`/create-event?edit=${event.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Settings size={16} />
                          </Button>
                         </Link>
                         <Link to={`/event/${event.id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                              View Page
                          </Button>
                         </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-gray-500">
                <p className="text-lg font-medium text-gray-900 mb-2">No events found</p>
                <p className="mb-6">You haven't created any events yet.</p>
                <Link to="/create-event">
                  <Button className="flex items-center gap-2 mx-auto">
                    <PlusCircle size={18} />
                    Create First Event
                  </Button>
                </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};