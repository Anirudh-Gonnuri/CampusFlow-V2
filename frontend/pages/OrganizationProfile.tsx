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
    <div className="bg-white min-h-screen pb-12">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-gray-200 w-full overflow-hidden relative">
            <img src={orgDetails.coverImage} className="w-full h-full object-cover" alt="Cover" />
            <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
                <div className="w-32 h-32 rounded-xl border-4 border-white shadow-md overflow-hidden bg-white -mt-12 flex-shrink-0">
                    <img src={orgDetails.logo} className="w-full h-full object-cover" alt="Logo" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-gray-900">{orgDetails.name}</h1>
                        {orgDetails.isVerified && <CheckCircle size={20} className="text-blue-500 fill-blue-50" />}
                    </div>
                    <p className="text-gray-600 mt-2 max-w-2xl">{orgDetails.description}</p>
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1"><Users size={16} /> {orgDetails.members} members</div>
                        <div className="flex items-center gap-1"><Mail size={16} /> {orgDetails.email}</div>
                        <div className="flex items-center gap-1"><Globe size={16} /> {orgDetails.website}</div>
                    </div>
                </div>
                <div>
                    <Button>Follow</Button>
                </div>
            </div>

            {/* Events Section */}
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Upcoming Events</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orgEvents.length > 0 ? (
                    orgEvents.map(event => (
                        <Link to={`/event/${event.id}`} key={event.id} className="group block">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex h-40">
                                <div className="w-1/3 relative">
                                    <img src={event.bannerImage} className="w-full h-full object-cover" alt={event.title} />
                                    <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-800">
                                        {event.category}
                                    </div>
                                </div>
                                <div className="w-2/3 p-4 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-brand-600 transition-colors">{event.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{event.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                        <div className="flex items-center gap-1"><Calendar size={12} /> {new Date(event.date).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-1"><MapPin size={12} /> {event.location}</div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No active events from this organization.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};