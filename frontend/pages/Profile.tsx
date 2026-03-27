import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, Navigate } from '../context/AppContext';
import { User, Mail, Award, BookOpen, Edit2, Users, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TeamFormationData } from '../types';

export const Profile: React.FC = () => {
  const { user, events, updateProfile, myRegistrations } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
      bio: user?.bio || 'Computer Science student passionate about AI and web development.',
      interests: user?.interests?.join(', ') || 'Coding, Hackathons, Music',
      department: user?.department || ''
  });

  if (!user) {
    return <Navigate to="/login" />;
  }

  const myTeams = events.flatMap(event => {
      const teamModule = event.modules.find(m => m.type === 'TEAM_FORMATION' && m.isEnabled);
      if (!teamModule) return [];
      const teams = (teamModule.data as TeamFormationData).teams || [];
      const myTeam = teams.find(t => t.members.some(m => m.id === user.id));
      return myTeam ? [{ ...myTeam, eventName: event.title, eventId: event.id }] : [];
  });

  const handleSave = () => {
      updateProfile({
          bio: formData.bio,
          interests: formData.interests.split(',').map(s => s.trim()),
          department: formData.department
      });
      setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-surface-800 rounded-2xl border border-white/8 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-brand-900 via-brand-800 to-surface-700 relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-800 to-transparent" />
        </div>

        {/* Profile content */}
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6 -mt-12 relative">
            <div className="w-24 h-24 rounded-2xl border-4 border-surface-800 shadow-lg overflow-hidden flex-shrink-0 bg-surface-700">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pt-14 sm:pt-16 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{user.name}</h1>
                  <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-900/50 text-brand-400 border border-brand-700/30">
                    {user.role === 'ORGANIZER' ? 'Event Organizer' : 'Student'}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="flex-shrink-0">
                  {isEditing ? 'Cancel' : <><Edit2 size={14} className="mr-2" /> Edit Profile</>}
                </Button>
              </div>
            </div>
          </div>

          {isEditing ? (
            <div className="mt-6 space-y-4 max-w-lg animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider mb-1.5">Department</label>
                <input className="w-full border border-white/8 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-surface-900 text-white placeholder-surface-400 transition-all"
                  value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider mb-1.5">Bio</label>
                <textarea className="w-full border border-white/8 rounded-xl px-4 py-2.5 text-sm h-24 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-surface-900 text-white placeholder-surface-400 transition-all resize-none"
                  value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-surface-400 uppercase tracking-wider mb-1.5">Interests (comma separated)</label>
                <input className="w-full border border-white/8 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-surface-900 text-white placeholder-surface-400 transition-all"
                  value={formData.interests} onChange={e => setFormData({...formData, interests: e.target.value})} />
              </div>
              <Button onClick={handleSave} className="gap-2"><Save size={15} /> Save Changes</Button>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-700 rounded-full border border-white/8 text-surface-300">
                  <BookOpen size={14} /> {user.department || 'General'}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-700 rounded-full border border-white/8 text-surface-300">
                  <Mail size={14} /> {user.email}
                </div>
              </div>
              <p className="text-surface-300 text-sm leading-relaxed max-w-xl">{user.bio || formData.bio}</p>
              <div>
                <h4 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {(user.interests || formData.interests.split(',').map(s => s.trim())).map((interest, i) => (
                    <span key={i} className="px-3 py-1 bg-brand-900/40 text-brand-400 text-xs font-semibold rounded-full border border-brand-700/30">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Teams */}
        <div className="bg-surface-800 rounded-2xl border border-white/8 p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <div className="w-7 h-7 rounded-lg bg-surface-700 flex items-center justify-center"><Users className="text-brand-400" size={15} /></div>
            My Active Teams
          </h3>
          <div className="space-y-3">
            {myTeams.length > 0 ? (
              myTeams.map(team => (
                <div key={team.id} className="border border-white/8 rounded-xl p-4 hover:border-brand-700/40 hover:bg-surface-700/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white text-sm">{team.name}</h4>
                    <span className="text-xs bg-surface-700 text-surface-300 px-2 py-0.5 rounded-full font-semibold border border-white/8">{team.members.length} members</span>
                  </div>
                  <p className="text-xs text-surface-400 mb-3">
                    Event: <Link to={`/event/${team.eventId}`} className="text-brand-400 hover:underline font-medium">{team.eventName}</Link>
                  </p>
                  <div className="flex -space-x-2">
                    {team.members.map(m => (
                      <div key={m.id} className="w-7 h-7 rounded-full border-2 border-surface-800 bg-surface-700 flex items-center justify-center text-[9px] font-bold text-brand-400 overflow-hidden" title={m.name}>
                        {m.avatar ? <img src={m.avatar} className="w-full h-full object-cover" /> : m.name.substring(0,2)}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-white/8 rounded-xl">
                <Users size={28} className="mx-auto text-surface-500 mb-2" />
                <p className="text-sm text-surface-400">You haven't joined any teams yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-surface-800 rounded-2xl border border-white/8 p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <div className="w-7 h-7 rounded-lg bg-surface-700 flex items-center justify-center"><Award className="text-accent-400" size={15} /></div>
            Activity Stats
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: myRegistrations.length, label: 'Events Attended', gradient: 'from-brand-500 to-brand-400' },
              { value: myTeams.length, label: 'Teams Joined', gradient: 'from-emerald-500 to-teal-400' },
              { value: 12, label: 'Votes Cast', gradient: 'from-accent-500 to-amber-400' },
              { value: 4, label: 'Photos Shared', gradient: 'from-pink-500 to-rose-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-surface-700 rounded-xl p-4 text-center border border-white/6">
                <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {stat.value}
                </div>
                <div className="text-[11px] text-surface-400 uppercase font-semibold tracking-wide mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};