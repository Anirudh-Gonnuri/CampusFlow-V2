import React, { useState } from 'react';
import { useParams, Link, useNavigate } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Users, Share2, ArrowLeft, Trophy, Clock, Grid, Image as ImageIcon, BarChart2, Bell, AlertCircle, CheckCircle, X, QrCode, UserPlus, LogIn, Upload, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ScheduleItem, LeaderboardEntry, VotingPoll, Announcement, RegistrationFormField, TeamFormationData, Team } from '../types';

export const EventDetails: React.FC = () => {
  const { id } = useParams() as { id?: string };
  const { getEvent, user, registerForEvent, isRegistered, voteInPoll, createTeam, joinTeam, leaveTeam, addToGallery } = useApp();
  const navigate = useNavigate();
  const event = getEvent(id || '');
  const [activeTab, setActiveTab] = useState('overview');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  // Gallery Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  if (!event) {
    return <div className="p-8 text-center">Event not found. <Link to="/" className="text-blue-500">Go Back</Link></div>;
  }

  const { theme } = event;
  const userIsRegistered = isRegistered(event.id);

  // Dynamic Styles based on Event Theme Config
  const customStyles = {
    '--primary': theme.primaryColor,
    '--secondary': theme.secondaryColor,
    '--bg': theme.backgroundColor,
    '--text': theme.textColor,
    fontFamily: theme.fontFamily === 'serif' ? 'Playfair Display, serif' : theme.fontFamily === 'mono' ? 'Roboto Mono, monospace' : 'Inter, sans-serif',
  } as React.CSSProperties;

  const hasModule = (type: string) => event.modules.some(m => m.type === type && m.isEnabled);
  const getModuleData = (type: string) => event.modules.find(m => m.type === type)?.data || [];

  // Derived Team State
  const teamData = getModuleData('TEAM_FORMATION') as TeamFormationData;
  const teams = teamData.teams || [];
  const userTeam = user ? teams.find(t => t.members.some(m => m.id === user.id)) : undefined;

  const handleRegisterClick = () => {
      if(!user) {
          navigate('/login');
          return;
      }
      setIsRegisterModalOpen(true);
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setTimeout(() => {
          registerForEvent(event.id);
          setIsRegisterModalOpen(false);
          setShowTicket(true);
      }, 500);
  };

  const handleVote = (pollId: string, optionId: string) => {
      if (!user) {
          navigate('/login');
          return;
      }
      voteInPoll(event.id, pollId, optionId);
  };

  const handleCreateTeam = () => {
      if (!user) return navigate('/login');
      const name = prompt("Enter Team Name:");
      if (name) {
          const description = prompt("Enter a short description (optional):") || '';
          createTeam(event.id, name, description);
      }
  };

  const handleUploadPhoto = () => {
      if (!user) return navigate('/login');
      // In a real app, this would handle file selection and upload to S3/Cloudinary
      // Here we simulate by asking for a URL or using a random one
      const url = prompt("Enter Image URL (or leave empty for random):");
      const finalUrl = url || `https://picsum.photos/seed/${Math.random()}/800/600`;
      addToGallery(event.id, finalUrl);
  };

  return (
    <div style={customStyles} className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      
      {/* Dynamic Navigation for Event Microsite */}
      <nav className="sticky top-0 z-50 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--primary)]/10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[var(--text)] opacity-70 hover:opacity-100 transition-opacity">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Discovery</span>
          </Link>
          <div className="font-bold text-xl tracking-wider uppercase" style={{ color: 'var(--primary)' }}>
            {event.organization}
          </div>
          <div className="flex items-center gap-2">
            {userIsRegistered && (
                 <button 
                 className="hidden sm:flex items-center px-4 py-2 rounded-md border border-[var(--text)]/20 text-[var(--text)] hover:bg-[var(--text)]/5 transition-colors text-sm font-medium"
                 onClick={() => setShowTicket(true)}
               >
                 <QrCode size={16} className="mr-2" />
                 My Ticket
               </button>
            )}
            <Button 
                className="bg-[var(--primary)] text-white hover:brightness-110 border-none"
                onClick={() => alert("Share functionality would go here!")}
            >
                <Share2 size={18} />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={`relative ${theme.layout === 'hero' ? 'h-[60vh]' : 'h-[40vh]'} w-full overflow-hidden`}>
        <img 
          src={event.bannerImage} 
          alt={event.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-6xl mx-auto">
          <div className="animate-fade-in-up">
            <span className="inline-block px-4 py-1 rounded-full bg-[var(--primary)] text-white text-sm font-bold mb-4 uppercase tracking-widest">
              {event.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: 'var(--text)' }}>
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-[var(--text)] opacity-90 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="text-[var(--primary)]" />
                <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-[var(--primary)]" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Module Navigation Tabs */}
          <div className="flex gap-4 border-b border-[var(--text)]/10 pb-1 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-2 font-medium transition-colors border-b-2 ${activeTab === 'overview' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--text)]/60 hover:text-[var(--text)]'}`}
            >
              Overview
            </button>
            {hasModule('ANNOUNCEMENTS') && (
              <button 
                onClick={() => setActiveTab('announcements')}
                className={`pb-3 px-2 font-medium transition-colors border-b-2 ${activeTab === 'announcements' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--text)]/60 hover:text-[var(--text)]'}`}
              >
                Updates
              </button>
            )}
             {hasModule('TEAM_FORMATION') && (
              <button 
                onClick={() => setActiveTab('teams')}
                className={`pb-3 px-2 font-medium transition-colors border-b-2 ${activeTab === 'teams' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--text)]/60 hover:text-[var(--text)]'}`}
              >
                Teams
              </button>
            )}
            {hasModule('SCHEDULE') && (
              <button 
                onClick={() => setActiveTab('schedule')}
                className={`pb-3 px-2 font-medium transition-colors border-b-2 ${activeTab === 'schedule' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--text)]/60 hover:text-[var(--text)]'}`}
              >
                Schedule
              </button>
            )}
             {hasModule('LEADERBOARD') && (
              <button 
                onClick={() => setActiveTab('leaderboard')}
                className={`pb-3 px-2 font-medium transition-colors border-b-2 ${activeTab === 'leaderboard' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--text)]/60 hover:text-[var(--text)]'}`}
              >
                Leaderboard
              </button>
            )}
            {hasModule('VOTING') && (
              <button 
                onClick={() => setActiveTab('voting')}
                className={`pb-3 px-2 font-medium transition-colors border-b-2 ${activeTab === 'voting' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--text)]/60 hover:text-[var(--text)]'}`}
              >
                Live Polls
              </button>
            )}
            {hasModule('GALLERY') && (
              <button 
                onClick={() => setActiveTab('gallery')}
                className={`pb-3 px-2 font-medium transition-colors border-b-2 ${activeTab === 'gallery' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--text)]/60 hover:text-[var(--text)]'}`}
              >
                Gallery
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === 'overview' && (
              <div className="prose prose-lg max-w-none" style={{ color: 'var(--text)' }}>
                <p className="text-xl leading-relaxed opacity-90">{event.description}</p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-xl border border-[var(--text)]/10 bg-[var(--secondary)]/5">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Users size={20} /> Who can attend?</h3>
                        <p className="opacity-70">Open to all students across departments.</p>
                    </div>
                    <div className="p-6 rounded-xl border border-[var(--text)]/10 bg-[var(--secondary)]/5">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Trophy size={20} /> Prizes</h3>
                        <p className="opacity-70">Certificates and goodies for winners.</p>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="space-y-6">
                 {(getModuleData('ANNOUNCEMENTS') as Announcement[]).length > 0 ? (
                    (getModuleData('ANNOUNCEMENTS') as Announcement[]).map((item) => (
                        <div key={item.id} className={`p-6 rounded-xl border-l-4 ${item.priority === 'URGENT' ? 'border-red-500 bg-red-50' : item.priority === 'IMPORTANT' ? 'border-yellow-500 bg-yellow-50' : 'border-[var(--primary)] bg-[var(--secondary)]/5'}`}>
                            <div className="flex items-start justify-between mb-2">
                                <h3 className={`font-bold text-lg flex items-center gap-2 ${item.priority === 'URGENT' ? 'text-red-700' : 'text-[var(--text)]'}`}>
                                    {item.priority === 'URGENT' && <AlertCircle size={20} />}
                                    {item.title}
                                </h3>
                                <span className="text-sm opacity-60">{new Date(item.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className="opacity-80 leading-relaxed">{item.message}</p>
                        </div>
                    ))
                 ) : (
                    <p className="text-center opacity-50 py-10 italic">No updates yet.</p>
                 )}
              </div>
            )}

            {activeTab === 'teams' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-[var(--secondary)]/10 p-4 rounded-xl">
                        <div>
                            <h3 className="font-bold text-lg">Find Your Team</h3>
                            <p className="opacity-70 text-sm">Join an existing team or start your own.</p>
                        </div>
                        {!userTeam ? (
                            <Button className="bg-[var(--primary)] text-white border-none" onClick={handleCreateTeam}>
                                <UserPlus size={16} className="mr-2" /> Create Team
                            </Button>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="block text-xs uppercase opacity-50 font-bold">Your Team</span>
                                    <span className="font-bold text-lg">{userTeam.name}</span>
                                </div>
                                <Button size="sm" variant="danger" onClick={() => leaveTeam(event.id, userTeam.id)}>
                                    Leave
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teams.map((team) => (
                            <div key={team.id} className={`border rounded-xl p-5 transition-colors relative overflow-hidden group ${
                                userTeam?.id === team.id ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--text)]/10 hover:border-[var(--primary)]'
                            }`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-xl">{team.name}</h4>
                                        {team.description && <p className="text-xs opacity-60 mt-1">{team.description}</p>}
                                    </div>
                                    <span className="text-xs font-mono bg-[var(--secondary)]/10 px-2 py-1 rounded">
                                        {team.members.length}/{teamData.maxTeamSize}
                                    </span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    {team.members.map(member => (
                                        <div key={member.id} className="flex items-center gap-2 text-sm opacity-80">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-700 overflow-hidden">
                                                {member.avatar ? <img src={member.avatar} className="w-full h-full object-cover"/> : member.name.substring(0,2)}
                                            </div>
                                            <span>{member.name} {member.role === 'LEADER' && '👑'}</span>
                                        </div>
                                    ))}
                                    {[...Array(teamData.maxTeamSize - team.members.length)].map((_, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm opacity-30">
                                            <div className="w-6 h-6 rounded-full border border-[var(--text)] border-dashed"></div>
                                            <span>Open Spot</span>
                                        </div>
                                    ))}
                                </div>
                                {(!userTeam && team.members.length < teamData.maxTeamSize) && (
                                    <Button size="sm" variant="outline" className="w-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => joinTeam(event.id, team.id)}>
                                        Join Team
                                    </Button>
                                )}
                            </div>
                        ))}
                        {teams.length === 0 && (
                            <div className="col-span-2 text-center py-12 border-2 border-dashed border-[var(--text)]/10 rounded-xl opacity-50">
                                <Users size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No teams formed yet. Be the first!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                {(getModuleData('SCHEDULE') as ScheduleItem[]).length > 0 ? (
                    (getModuleData('SCHEDULE') as ScheduleItem[]).sort((a,b) => a.time.localeCompare(b.time)).map((item, i) => (
                      <div key={i} className="flex gap-6 group">
                        <div className="w-24 pt-2 text-right font-mono opacity-60 group-hover:text-[var(--primary)] transition-colors">{item.time}</div>
                        <div className="flex-1 pb-6 border-l-2 border-[var(--text)]/10 pl-6 group-hover:border-[var(--primary)] transition-colors relative">
                          <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-[var(--bg)] border-2 border-[var(--text)]/30 group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)] transition-colors"></div>
                          <h4 className="text-xl font-bold">{item.title}</h4>
                          <p className="opacity-60">{item.location}</p>
                        </div>
                      </div>
                    ))
                ) : (
                    <p className="text-center opacity-50 py-10 italic">Schedule to be announced.</p>
                )}
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="border border-[var(--text)]/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[var(--secondary)]/10 text-[var(--primary)]">
                    <tr>
                      <th className="p-4 font-bold">Rank</th>
                      <th className="p-4 font-bold">Team</th>
                      <th className="p-4 font-bold text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--text)]/10">
                    {(getModuleData('LEADERBOARD') as LeaderboardEntry[])
                        .sort((a,b) => b.points - a.points)
                        .map((row, index) => (
                      <tr key={row.id} className="hover:bg-[var(--secondary)]/5">
                        <td className="p-4 font-mono font-bold">#{index + 1}</td>
                        <td className="p-4">{row.team}</td>
                        <td className="p-4 text-right font-bold">{row.points}</td>
                      </tr>
                    ))}
                    {(getModuleData('LEADERBOARD') as LeaderboardEntry[]).length === 0 && (
                        <tr><td colSpan={3} className="p-8 text-center opacity-50 italic">No entries yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'voting' && (
              <div className="space-y-8">
                {(getModuleData('VOTING') as VotingPoll[]).length > 0 ? (
                  (getModuleData('VOTING') as VotingPoll[]).map((poll) => {
                    const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0);
                    
                    return (
                    <div key={poll.id} className="bg-[var(--secondary)]/5 p-6 rounded-xl border border-[var(--text)]/10">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <div className="bg-[var(--primary)] text-white p-2 rounded-full">
                            <BarChart2 size={20} />
                        </div>
                        {poll.question}
                      </h3>
                      <div className="space-y-3">
                        {poll.options.map((option) => {
                          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                          const isSelected = poll.userVotedOptionId === option.id;
                          
                          return (
                          <button 
                            key={option.id}
                            disabled={!!poll.userVotedOptionId}
                            className={`w-full text-left p-4 rounded-lg border transition-all relative overflow-hidden ${
                                isSelected 
                                ? 'border-[var(--primary)] bg-[var(--primary)]/10' 
                                : 'border-[var(--text)]/20 hover:border-[var(--primary)]'
                            }`}
                            onClick={() => handleVote(poll.id, option.id)}
                          >
                             {/* Progress Bar Background */}
                             {poll.userVotedOptionId && (
                                <div 
                                    className="absolute top-0 left-0 bottom-0 bg-[var(--primary)]/10 transition-all duration-1000 ease-out"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                             )}

                            <div className="flex justify-between items-center z-10 relative">
                                <span className="font-medium">{option.text}</span>
                                {poll.userVotedOptionId ? (
                                    <span className="font-bold">{percentage}%</span>
                                ) : (
                                    <span className="text-sm opacity-60">Vote &rarr;</span>
                                )}
                            </div>
                          </button>
                        )})}
                      </div>
                      {poll.userVotedOptionId && (
                          <p className="text-center text-sm opacity-60 mt-4">You have voted in this poll.</p>
                      )}
                    </div>
                  )})
                ) : (
                    <p className="text-center opacity-50 py-10 italic">No active polls at the moment.</p>
                )}
              </div>
            )}

             {activeTab === 'gallery' && (
               <div className="space-y-6">
                 <div className="flex justify-between items-center">
                     <p className="opacity-70 italic">{user ? "Share your moments from the event." : "Log in to share photos."}</p>
                     <Button size="sm" className="bg-[var(--primary)] text-white border-none" onClick={handleUploadPhoto}>
                         <Upload size={16} className="mr-2"/> Upload Photo
                     </Button>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(getModuleData('GALLERY') as string[]).length > 0 ? (
                        (getModuleData('GALLERY') as string[]).map((url, n) => (
                            <div key={n} className="aspect-square bg-[var(--secondary)]/10 rounded-lg overflow-hidden border border-[var(--text)]/10 hover:opacity-80 transition-opacity cursor-pointer group relative">
                            <img src={url} alt={`Gallery ${n}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ImageIcon className="text-white drop-shadow-lg" size={32} />
                            </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center opacity-50 py-10 italic border-2 border-dashed border-[var(--text)]/10 rounded-xl">
                            <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                            No photos added yet. Be the first!
                        </div>
                    )}
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Sidebar / CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="p-8 rounded-2xl bg-[var(--bg)] border border-[var(--text)]/10 shadow-2xl shadow-[var(--primary)]/5">
                <h3 className="text-2xl font-bold mb-2">{userIsRegistered ? "You're Going!" : "Ready to join?"}</h3>
                <p className="opacity-70 mb-8">{userIsRegistered ? "See you there! Don't forget your ticket." : "Secure your spot for this event. Spots are filling up fast."}</p>
                
                {hasModule('REGISTRATION') ? (
                  !userIsRegistered ? (
                    <Button 
                        className="w-full py-4 text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200 border-none"
                        style={{ backgroundColor: 'var(--primary)', color: '#fff' }}
                        onClick={handleRegisterClick}
                    >
                        Register Now
                    </Button>
                  ) : (
                    <Button 
                        className="w-full py-4 text-lg font-bold shadow-lg transition-all duration-200 border-none bg-green-600 text-white hover:bg-green-700"
                        onClick={() => setShowTicket(true)}
                    >
                        View Ticket
                    </Button>
                  )
                ) : (
                <div className="p-4 bg-[var(--secondary)]/10 rounded text-center opacity-70">
                    Registration Closed
                </div>
                )}

                <div className="mt-8 space-y-4 text-sm opacity-70">
                <div className="flex justify-between">
                    <span>Registration Status</span>
                    <span className="font-bold text-[var(--primary)]">Open</span>
                </div>
                <div className="flex justify-between">
                    <span>Spots Remaining</span>
                    <span>45 / 200</span>
                </div>
                <div className="flex justify-between">
                    <span>Deadline</span>
                    <span>Nov 14, 11:59 PM</span>
                </div>
                </div>
            </div>

            {/* Sidebar Feed Preview if Module is Active */}
            {hasModule('ANNOUNCEMENTS') && getModuleData('ANNOUNCEMENTS').length > 0 && (
                 <div className="p-6 rounded-2xl bg-[var(--secondary)]/5 border border-[var(--text)]/10">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Bell size={18} /> Recent Updates</h3>
                    <div className="space-y-4">
                        {(getModuleData('ANNOUNCEMENTS') as Announcement[]).slice(0, 3).map(item => (
                             <div key={item.id} className="pb-3 border-b border-[var(--text)]/10 last:border-0">
                                <p className="font-medium text-sm mb-1">{item.title}</p>
                                <p className="text-xs opacity-60 line-clamp-2">{item.message}</p>
                             </div>
                        ))}
                    </div>
                 </div>
            )}
          </div>
        </div>
      </main>

      {/* Registration Modal */}
      {isRegisterModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="text-xl font-bold text-gray-900">Register for Event</h3>
                      <button onClick={() => setIsRegisterModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                          <X size={20} />
                      </button>
                  </div>
                  <form onSubmit={handleRegistrationSubmit} className="p-6 space-y-4">
                      {/* Default Fields */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input className="w-full border rounded-lg p-2 text-gray-900" defaultValue={user?.name} readOnly />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input className="w-full border rounded-lg p-2 text-gray-900" defaultValue={user?.email} readOnly />
                      </div>
                      
                      {/* Dynamic Custom Fields */}
                      {(getModuleData('REGISTRATION') as RegistrationFormField[])?.map((field) => (
                          <div key={field.id}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {field.label} {field.required && <span className="text-red-500">*</span>}
                              </label>
                              {field.type === 'text' || field.type === 'email' ? (
                                  <input 
                                    type={field.type} 
                                    className="w-full border rounded-lg p-2 text-gray-900" 
                                    required={field.required}
                                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                                  />
                              ) : field.type === 'select' ? (
                                  <select className="w-full border rounded-lg p-2 text-gray-900" required={field.required}>
                                      <option value="">Select an option</option>
                                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                  </select>
                              ) : field.type === 'checkbox' ? (
                                  <label className="flex items-center gap-2 text-gray-700">
                                      <input type="checkbox" required={field.required} />
                                      <span>I agree</span>
                                  </label>
                              ) : null}
                          </div>
                      ))}

                      <Button type="submit" className="w-full mt-4">Confirm Registration</Button>
                  </form>
              </div>
          </div>
      )}

      {/* Ticket Modal */}
       {showTicket && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-300 relative">
                  <button onClick={() => setShowTicket(false)} className="absolute top-4 right-4 z-10 p-1 bg-white/50 rounded-full hover:bg-white text-gray-800">
                      <X size={20} />
                  </button>
                  <div className="bg-[var(--primary)] p-6 text-white text-center relative overflow-hidden" style={{ backgroundColor: theme.primaryColor }}>
                      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                      <h2 className="text-2xl font-bold relative z-10">{event.title}</h2>
                      <p className="opacity-80 text-sm relative z-10">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                  </div>
                  <div className="p-8 flex flex-col items-center">
                      <div className="w-48 h-48 bg-gray-900 rounded-xl mb-6 flex items-center justify-center text-white">
                          {/* Placeholder for real QR code */}
                          <QrCode size={120} />
                      </div>
                      <div className="text-center space-y-1">
                          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Attendee</p>
                          <p className="text-xl font-bold text-gray-900">{user?.name || 'Guest User'}</p>
                          <p className="text-sm text-gray-500">{user?.department || 'General'}</p>
                      </div>
                      {hasModule('QR_CHECKIN') && (
                        <div className="mt-6 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            <CheckCircle size={12} />
                            Ticket Valid
                        </div>
                      )}
                  </div>
                  <div className="border-t-2 border-dashed border-gray-200 p-4 bg-gray-50 flex justify-between items-center text-xs text-gray-400">
                      <span>Order #123456</span>
                      <span>CampusFlow</span>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};