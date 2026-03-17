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

  // Calculate active teams across all events
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row gap-8 items-start">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border-4 border-white shadow-lg">
             <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 w-full">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                    <p className="text-gray-500 font-medium">{user.role === 'ORGANIZER' ? 'Event Organizer' : 'Student'}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : <><Edit2 size={16} className="mr-2" /> Edit Profile</>}
                </Button>
            </div>

            {isEditing ? (
                <div className="mt-6 space-y-4 max-w-lg animate-in fade-in duration-200">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
                        <input 
                            className="w-full border rounded p-2 text-sm"
                            value={formData.department}
                            onChange={e => setFormData({...formData, department: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bio</label>
                        <textarea 
                            className="w-full border rounded p-2 text-sm h-24"
                            value={formData.bio}
                            onChange={e => setFormData({...formData, bio: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Interests (comma separated)</label>
                        <input 
                            className="w-full border rounded p-2 text-sm"
                            value={formData.interests}
                            onChange={e => setFormData({...formData, interests: e.target.value})}
                        />
                    </div>
                    <Button onClick={handleSave} className="gap-2">
                        <Save size={16} /> Save Changes
                    </Button>
                </div>
            ) : (
                <div className="mt-6 space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                            <BookOpen size={16} />
                            {user.department || 'General'}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                            <Mail size={16} />
                            {user.email}
                        </div>
                    </div>
                    
                    <div className="prose prose-sm text-gray-600 max-w-none">
                        <p>{user.bio || formData.bio}</p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                            {(user.interests || formData.interests.split(',').map(s => s.trim())).map((interest, i) => (
                                <span key={i} className="px-2 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded">
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Active Teams */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="text-brand-500" size={20} />
                  My Active Teams
              </h3>
              <div className="space-y-4">
                  {myTeams.length > 0 ? (
                      myTeams.map(team => (
                          <div key={team.id} className="border rounded-lg p-4 hover:border-brand-300 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-gray-900">{team.name}</h4>
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">{team.members.length} Members</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-3">Event: <Link to={`/event/${team.eventId}`} className="text-brand-600 hover:underline">{team.eventName}</Link></p>
                              <div className="flex -space-x-2">
                                  {team.members.map(m => (
                                      <div key={m.id} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[8px] overflow-hidden" title={m.name}>
                                          {m.avatar ? <img src={m.avatar} className="w-full h-full object-cover" /> : m.name.substring(0,2)}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="text-center py-8 opacity-50 border-2 border-dashed rounded-lg">
                          <p>You haven't joined any teams yet.</p>
                      </div>
                  )}
              </div>
          </div>

          {/* Stats */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="text-yellow-500" size={20} />
                  Activity Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-900">{myRegistrations.length}</div>
                      <div className="text-xs text-gray-500 uppercase">Events Attended</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-900">{myTeams.length}</div>
                      <div className="text-xs text-gray-500 uppercase">Teams Joined</div>
                  </div>
                   <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-900">12</div>
                      <div className="text-xs text-gray-500 uppercase">Votes Cast</div>
                  </div>
                   <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-900">4</div>
                      <div className="text-xs text-gray-500 uppercase">Photos Shared</div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};