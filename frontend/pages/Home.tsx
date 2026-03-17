import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from '../context/AppContext';
import { Calendar, MapPin, Users, Filter, Search, Bookmark, Clock } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  const { events, toggleSaveEvent, isSaved, user } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK'>('ALL');

  const filteredEvents = events.filter((event) => {
    // Category Filter
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;

    // Search Filter
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Date Filter logic
    let matchesDate = true;
    const eventDate = new Date(event.date);
    const today = new Date();

    if (dateFilter === 'TODAY') {
      matchesDate = eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear();
    } else if (dateFilter === 'WEEK') {
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      matchesDate = eventDate >= today && eventDate <= nextWeek;
    }

    return matchesCategory && matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-brand-900 rounded-2xl overflow-hidden relative min-h-[300px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900 to-transparent z-10"></div>
        <img
          src="https://picsum.photos/id/180/1200/400"
          alt="Campus Life"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-20 p-8 md:p-12 text-white max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Discover Your Next Campus Experience</h1>
          <p className="text-lg text-brand-100 mb-8">
            From tech hackathons to cultural fests, find everything happening on campus in one place.
          </p>
          <div className="flex gap-4">
            {/* Smooth scroll simulation */}
            <button className="bg-white text-brand-900 hover:bg-brand-50 px-6 py-3 rounded-md font-bold transition-colors shadow-lg">
              Explore Events
            </button>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sticky top-16 bg-gray-50 z-40 py-4 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search events, clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Date Filters */}
        <div className="flex gap-2 pb-2 md:pb-0 overflow-x-auto no-scrollbar">
          {['ALL', 'TODAY', 'WEEK'].map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${dateFilter === filter
                ? 'bg-brand-100 text-brand-700 border border-brand-200'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              {filter === 'ALL' ? 'Anytime' : filter === 'TODAY' ? 'Today' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const saved = isSaved(event.id);
            return (
              <div key={event.id} className="group relative">
                <Link to={`/event/${event.id}`} className="block h-full">
                  <article className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                        {event.category}
                      </div>
                      <img
                        src={event.bannerImage || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1000'}
                        alt={event.title}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1000';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2 pr-6">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{event.title}</h3>
                      </div>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{event.description}</p>

                      <div className="space-y-2 mt-auto">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} className="text-brand-500" />
                          <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={16} className="text-brand-500" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users size={16} className="text-brand-500" />
                          <span>{event.attendeeCount} attending</span>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <Link to={`/organization/${encodeURIComponent(event.organization)}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 group/org">
                          <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-[10px] font-bold text-brand-700">
                            {event.organization.substring(0, 2)}
                          </div>
                          <span className="text-xs font-medium text-gray-500 group-hover/org:text-brand-600 group-hover/org:underline">{event.organization}</span>
                        </Link>
                        <span className="text-brand-600 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                          View Details &rarr;
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSaveEvent(event.id);
                  }}
                  className={`absolute top-4 right-4 z-20 p-2 rounded-full shadow-sm transition-colors ${saved ? 'bg-brand-600 text-white' : 'bg-white/90 text-gray-400 hover:text-brand-600'}`}
                >
                  <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Filter className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};