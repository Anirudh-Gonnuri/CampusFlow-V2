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
                <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className={`inline-block w-2 h-2 rounded-full ${event.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
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
        <div className="border-b border-gray-200">
            <div className="flex gap-6">
                {['OVERVIEW', 'PARTICIPANTS', 'MODULES'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3 font-medium text-sm transition-colors border-b-2 ${
                            activeTab === tab ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'
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
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
                        </div>
                        <h3 className="text-2xl font-bold">{registrations.length}</h3>
                        <p className="text-sm text-gray-500">Total Registrations</p>
                    </div>
                     <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={20} /></div>
                            <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                {registrations.length > 0 ? Math.round((checkedInCount / registrations.length) * 100) : 0}%
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold">{checkedInCount}</h3>
                        <p className="text-sm text-gray-500">Checked In</p>
                    </div>
                     <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Activity size={20} /></div>
                        </div>
                        <h3 className="text-2xl font-bold">1,240</h3>
                        <p className="text-sm text-gray-500">Page Views</p>
                    </div>
                     <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><PieChart size={20} /></div>
                        </div>
                        <h3 className="text-2xl font-bold">{sortedDepts.length}</h3>
                        <p className="text-sm text-gray-500">Departments Reached</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Department Distribution */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6">Registrations by Department</h3>
                        <div className="space-y-4">
                            {sortedDepts.map(([dept, count]) => {
                                const percentage = Math.round((count / registrations.length) * 100);
                                return (
                                    <div key={dept}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{dept}</span>
                                            <span className="text-gray-500">{count} ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div className="bg-brand-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                             {sortedDepts.length === 0 && <p className="text-gray-500 text-sm italic">No data available yet.</p>}
                        </div>
                    </div>

                    {/* Timeline (Mock) */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center">
                        <h3 className="font-bold text-gray-900 mb-2 w-full text-left">Registration Timeline</h3>
                         <div className="h-64 w-full flex items-end justify-between gap-2 mt-4 px-4">
                            {[30, 45, 20, 60, 75, 50, 90].map((h, i) => (
                                <div key={i} className="w-full bg-blue-100 rounded-t-md relative group hover:bg-blue-200 transition-colors" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h} users
                                    </div>
                                </div>
                            ))}
                         </div>
                         <div className="w-full flex justify-between text-xs text-gray-400 mt-2 px-2">
                             <span>Mon</span>
                             <span>Tue</span>
                             <span>Wed</span>
                             <span>Thu</span>
                             <span>Fri</span>
                             <span>Sat</span>
                             <span>Sun</span>
                         </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'PARTICIPANTS' && (
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                        />
                    </div>
                    <div className="flex gap-2">
                         <Button variant="outline" size="sm" className="gap-2 bg-white">
                             <Filter size={16} /> Filter
                         </Button>
                         <Button variant="outline" size="sm" className="gap-2 bg-white">
                             <Mail size={16} /> Email All
                         </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Email</th>
                                <th className="px-6 py-3 font-medium">Department</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredParticipants.map((record, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                            <img src={record.user.avatar} alt="" className="w-full h-full object-cover"/>
                                        </div>
                                        <span className="font-medium text-gray-900">{record.user.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{record.user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{record.user.department}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(record.timestamp).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            record.status === 'CHECKED_IN' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {record.status === 'CHECKED_IN' ? 'Checked In' : 'Registered'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-brand-600 transition-colors">
                                            <span className="sr-only">Edit</span>
                                            •••
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredParticipants.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No participants found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
                    <span>Showing {filteredParticipants.length} of {registrations.length} participants</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border rounded bg-white disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 border rounded bg-white disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        )}

         {activeTab === 'MODULES' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <h3 className="font-bold text-gray-900 mb-4">Voting Insights</h3>
                     <p className="text-sm text-gray-500 mb-4">Engagement across all active polls.</p>
                     
                     {event.modules.find(m => m.type === 'VOTING')?.data?.length > 0 ? (
                        <div className="space-y-4">
                            {(event.modules.find(m => m.type === 'VOTING')?.data as any[]).map(poll => (
                                <div key={poll.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="font-medium text-sm mb-2">{poll.question}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Activity size={14} />
                                        <span>{poll.options.reduce((acc: number, o: any) => acc + o.votes, 0)} total votes</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                     ) : (
                         <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                             <p className="text-gray-500 text-sm">No voting modules active.</p>
                         </div>
                     )}
                 </div>

                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <h3 className="font-bold text-gray-900 mb-4">Team Formation Status</h3>
                      {event.modules.find(m => m.type === 'TEAM_FORMATION')?.isEnabled ? (
                        <div className="text-center py-8">
                             <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 rounded-full mb-4 text-brand-600">
                                <Users size={32} />
                             </div>
                             <h4 className="text-2xl font-bold text-gray-900">12</h4>
                             <p className="text-gray-500">Teams Formed</p>
                             <div className="mt-4 text-sm text-gray-400">Avg. 3.5 members per team</div>
                        </div>
                      ) : (
                         <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                             <p className="text-gray-500 text-sm">Team formation module disabled.</p>
                         </div>
                      )}
                 </div>
             </div>
         )}
    </div>
  );
};