import React, { useState } from 'react';
import { useParams, Link, Navigate } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Users, Calendar, TrendingUp, CheckCircle, Download, PieChart, Activity, User, Search, Filter, Mail, Share2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const EventAnalytics: React.FC = () => {
  const { id } = useParams() as { id?: string };
  const { getEvent, getEventRegistrations, user } = useApp();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PARTICIPANTS' | 'MODULES'>('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');

  if (!user || user.role !== 'ORGANIZER') {
    return <Navigate to="/login" />;
  }

  const event = getEvent(id || '');
  if (!event) return <div>Event not found</div>;

  const registrations = getEventRegistrations(event.id);
  const checkedInCount = registrations.filter(r => r.status === 'CHECKED_IN').length;
  
  // Mock data for charts
  const departments = registrations.reduce((acc, curr) => {
      const dept = curr.user.department || 'Other';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  const sortedDepts = Object.entries(departments).sort((a,b) => b[1] - a[1]);

  // Tab Content: Participants List
  const filteredParticipants = registrations.filter(r => 
    r.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Link to="/dashboard" className="p-2 hover:bg-surface-700 rounded-full transition-colors text-surface-400">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{event.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-surface-400">
                        <span className={`inline-block w-2 h-2 rounded-full ${event.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {event.status} • {new Date(event.date).toLocaleDateString()}
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                    <Share2 size={16} /> Share Report
                </Button>
                <Button className="gap-2">
                    <Download size={16} /> Export Data
                </Button>
            </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/8">
            <div className="flex gap-6">
                {['OVERVIEW', 'PARTICIPANTS', 'MODULES'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3 font-medium text-sm transition-colors border-b-2 ${
                            activeTab === tab ? 'border-brand-500 text-brand-400' : 'border-transparent text-surface-400 hover:text-white'
                        }`}
                    >
                        {tab.charAt(0) + tab.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'OVERVIEW' && (
            <div className="space-y-6 animate-in fade-in duration-300">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-surface-800 p-5 rounded-xl border border-white/8">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-brand-900/50 text-brand-400 rounded-lg"><Users size={20} /></div>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded border border-emerald-700/30">+12%</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">{registrations.length}</h3>
                        <p className="text-sm text-surface-400">Total Registrations</p>
                    </div>
                    <div className="bg-surface-800 p-5 rounded-xl border border-white/8">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-emerald-900/40 text-emerald-400 rounded-lg"><CheckCircle size={20} /></div>
                            <span className="text-xs font-bold text-surface-400 bg-surface-700 px-2 py-1 rounded">
                                {registrations.length > 0 ? Math.round((checkedInCount / registrations.length) * 100) : 0}%
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">{checkedInCount}</h3>
                        <p className="text-sm text-surface-400">Checked In</p>
                    </div>
                    <div className="bg-surface-800 p-5 rounded-xl border border-white/8">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-violet-900/40 text-violet-400 rounded-lg"><Activity size={20} /></div>
                        </div>
                        <h3 className="text-2xl font-bold text-white">1,240</h3>
                        <p className="text-sm text-surface-400">Page Views</p>
                    </div>
                    <div className="bg-surface-800 p-5 rounded-xl border border-white/8">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-amber-900/40 text-amber-400 rounded-lg"><PieChart size={20} /></div>
                        </div>
                        <h3 className="text-2xl font-bold text-white">{sortedDepts.length}</h3>
                        <p className="text-sm text-surface-400">Departments Reached</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Department Distribution */}
                    <div className="bg-surface-800 p-6 rounded-xl border border-white/8">
                        <h3 className="font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Registrations by Department</h3>
                        <div className="space-y-4">
                            {sortedDepts.map(([dept, count]) => {
                                const percentage = Math.round((count / registrations.length) * 100);
                                return (
                                    <div key={dept}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-surface-200">{dept}</span>
                                            <span className="text-surface-400">{count} ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-surface-700 rounded-full h-2.5">
                                            <div className="bg-gradient-to-r from-brand-600 to-brand-400 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                            {sortedDepts.length === 0 && <p className="text-surface-400 text-sm italic">No data available yet.</p>}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-surface-800 p-6 rounded-xl border border-white/8 flex flex-col justify-center items-center">
                        <h3 className="font-bold text-white mb-2 w-full text-left" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Registration Timeline</h3>
                        <div className="h-64 w-full flex items-end justify-between gap-2 mt-4 px-4">
                            {[30, 45, 20, 60, 75, 50, 90].map((h, i) => (
                                <div key={i} className="w-full bg-surface-700 rounded-t-md relative group hover:bg-brand-700/50 transition-colors" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-700 border border-white/8 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {h} users
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-full flex justify-between text-xs text-surface-400 mt-2 px-2">
                            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <span key={d}>{d}</span>)}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'PARTICIPANTS' && (
            <div className="bg-surface-800 rounded-xl border border-white/8 overflow-hidden animate-in fade-in duration-300">
                <div className="p-4 border-b border-white/8 flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-900/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/8 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-surface-900 text-white placeholder-surface-400"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter size={16} /> Filter
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Mail size={16} /> Email All
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-900/50 text-surface-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Email</th>
                                <th className="px-6 py-3 font-medium">Department</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/6">
                            {filteredParticipants.map((record, i) => (
                                <tr key={i} className="hover:bg-surface-700/30 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-surface-700 overflow-hidden">
                                            <img src={record.user.avatar} alt="" className="w-full h-full object-cover"/>
                                        </div>
                                        <span className="font-medium text-white">{record.user.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-surface-400">{record.user.email}</td>
                                    <td className="px-6 py-4 text-sm text-surface-400">{record.user.department}</td>
                                    <td className="px-6 py-4 text-sm text-surface-400">{new Date(record.timestamp).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            record.status === 'CHECKED_IN'
                                            ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/30'
                                            : 'bg-brand-900/40 text-brand-400 border border-brand-700/30'
                                        }`}>
                                            {record.status === 'CHECKED_IN' ? 'Checked In' : 'Registered'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-surface-400 hover:text-brand-400 transition-colors">•••</button>
                                    </td>
                                </tr>
                            ))}
                            {filteredParticipants.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-surface-400">
                                        No participants found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-white/8 bg-surface-900/50 text-xs text-surface-400 flex justify-between items-center">
                    <span>Showing {filteredParticipants.length} of {registrations.length} participants</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-white/8 rounded bg-surface-700 text-surface-300 disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 border border-white/8 rounded bg-surface-700 text-surface-300 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'MODULES' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <div className="bg-surface-800 p-6 rounded-xl border border-white/8">
                    <h3 className="font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Voting Insights</h3>
                    <p className="text-sm text-surface-400 mb-4">Engagement across all active polls.</p>
                    {event.modules.find(m => m.type === 'VOTING')?.data?.length > 0 ? (
                        <div className="space-y-4">
                            {(event.modules.find(m => m.type === 'VOTING')?.data as any[]).map(poll => (
                                <div key={poll.id} className="p-4 bg-surface-700 rounded-lg border border-white/6">
                                    <p className="font-medium text-sm text-white mb-2">{poll.question}</p>
                                    <div className="flex items-center gap-2 text-xs text-surface-400">
                                        <Activity size={14} />
                                        <span>{poll.options.reduce((acc: number, o: any) => acc + o.votes, 0)} total votes</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center bg-surface-700 rounded-lg border border-dashed border-white/10">
                            <p className="text-surface-400 text-sm">No voting modules active.</p>
                        </div>
                    )}
                </div>

                <div className="bg-surface-800 p-6 rounded-xl border border-white/8">
                    <h3 className="font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Team Formation Status</h3>
                    {event.modules.find(m => m.type === 'TEAM_FORMATION')?.isEnabled ? (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-900/40 rounded-full mb-4 text-brand-400">
                                <Users size={32} />
                            </div>
                            <h4 className="text-2xl font-bold text-white">12</h4>
                            <p className="text-surface-400">Teams Formed</p>
                            <div className="mt-4 text-sm text-surface-400">Avg. 3.5 members per team</div>
                        </div>
                    ) : (
                        <div className="p-8 text-center bg-surface-700 rounded-lg border border-dashed border-white/10">
                            <p className="text-surface-400 text-sm">Team formation module disabled.</p>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};