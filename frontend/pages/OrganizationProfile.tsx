import React from 'react';
import { useParams, Link } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Mail, Globe, Users, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const OrganizationProfile: React.FC = () => {
  const { id } = useParams() as { id?: string }; // ID is the org name in this demo
  const { events } = useApp();

  const orgName = id || 'Organization';
  const orgEvents = events.filter(e => e.organization === orgName);
  
  // Mock org details based on name
  const orgDetails = {
      name: orgName,
      description: `Welcome to the official page of ${orgName}. We are dedicated to organizing the best events on campus, fostering community, and innovation.`,
      email: `contact@${orgName.toLowerCase().replace(/\s+/g, '')}.campus.edu`,
      website: `www.campus.edu/${orgName.toLowerCase().replace(/\s+/g, '-')}`,
      members: 124,
      isVerified: true,
      coverImage: `https://picsum.photos/seed/${orgName}/1200/400`,
      logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(orgName)}&background=random&size=128`
  };

  return (
    <div className="min-h-screen pb-12">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-surface-700 w-full overflow-hidden relative">
            <img src={orgDetails.coverImage} className="w-full h-full object-cover opacity-60" alt="Cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative">
            {/* Header */}
            <div className="bg-surface-800 rounded-2xl border border-white/8 p-6 flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
                <div className="w-28 h-28 rounded-2xl border-4 border-surface-800 shadow-xl overflow-hidden bg-surface-700 -mt-12 flex-shrink-0">
                    <img src={orgDetails.logo} className="w-full h-full object-cover" alt="Logo" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{orgDetails.name}</h1>
                        {orgDetails.isVerified && <CheckCircle size={20} className="text-brand-400" />}
                    </div>
                    <p className="text-surface-300 mt-2 max-w-2xl text-sm leading-relaxed">{orgDetails.description}</p>
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-surface-400">
                        <div className="flex items-center gap-1.5"><Users size={15} /> {orgDetails.members} members</div>
                        <div className="flex items-center gap-1.5"><Mail size={15} /> {orgDetails.email}</div>
                        <div className="flex items-center gap-1.5"><Globe size={15} /> {orgDetails.website}</div>
                    </div>
                </div>
                <div>
                    <Button>Follow</Button>
                </div>
            </div>

            {/* Events Section */}
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/8 pb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Upcoming Events</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orgEvents.length > 0 ? (
                    orgEvents.map(event => (
                        <Link to={`/event/${event.id}`} key={event.id} className="group block">
                            <div className="bg-surface-800 rounded-xl border border-white/8 overflow-hidden hover:border-brand-700/40 transition-all flex h-40">
                                <div className="w-1/3 relative overflow-hidden">
                                    <img src={event.bannerImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={event.title} />
                                    <div className="absolute top-2 left-2 bg-surface-900/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-bold text-white border border-white/8">
                                        {event.category}
                                    </div>
                                </div>
                                <div className="w-2/3 p-4 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-white line-clamp-1 group-hover:text-brand-400 transition-colors">{event.title}</h3>
                                        <p className="text-sm text-surface-400 line-clamp-2 mt-1">{event.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-surface-400 mt-2">
                                        <div className="flex items-center gap-1"><Calendar size={12} /> {new Date(event.date).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-1"><MapPin size={12} /> {event.location}</div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center bg-surface-800 rounded-xl border border-dashed border-white/10">
                        <p className="text-surface-400">No active events from this organization.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};