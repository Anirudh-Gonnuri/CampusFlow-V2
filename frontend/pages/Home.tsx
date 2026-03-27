import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from '../context/AppContext';
import { Calendar, MapPin, Users, Filter, Search, Bookmark, Sparkles, Flame, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  const { events, toggleSaveEvent, isSaved, user } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK'>('ALL');

  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesDate = true;
    const eventDate = new Date(event.date);
    const today = new Date();
    if (dateFilter === 'TODAY') {
      matchesDate = eventDate.getDate() === today.getDate() && eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
    } else if (dateFilter === 'WEEK') {
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      matchesDate = eventDate >= today && eventDate <= nextWeek;
    }
    return matchesCategory && matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden min-h-[360px] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-800 via-surface-700 to-surface-900" />
        <img src="https://picsum.photos/id/180/1200/400" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay" />
        {/* Red glow accent */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
        {/* Red left border accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-600 via-brand-400 to-transparent rounded-l-3xl" />

        <div className="relative z-10 p-8 md:p-14 text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 text-brand-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Flame size={12} className="text-brand-400" />
            {events.length}+ live events on campus right now
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Your Campus,<br />
            <span className="text-brand-400">Fully Alive.</span>
          </h1>
          <p className="text-base text-surface-300 mb-8 max-w-md leading-relaxed">
            From tech hackathons to cultural fests — discover, register, and make the most of every moment on campus.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.scrollTo({ top: 480, behavior: 'smooth' })}
              className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-900/50 hover:shadow-brand-600/40 hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              <Sparkles size={16} /> Explore Events
            </button>
            {!user && (
              <Link to="/register" className="border border-white/15 text-white hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition-all inline-flex items-center gap-2">
                Join Free <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-col gap-4 sticky top-16 bg-surface-950/90 backdrop-blur-sm z-40 py-4 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50'
                    : 'bg-surface-800 text-surface-200 hover:bg-surface-700 hover:text-white border border-white/8'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={17} />
            <input
              type="text"
              placeholder="Search events, clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-white/8 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-surface-800 text-white placeholder-surface-400 shadow-sm text-sm"
            />
          </div>
        </div>

        {/* Date Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[{ key: 'ALL', label: 'Anytime' }, { key: 'TODAY', label: 'Today' }, { key: 'WEEK', label: 'This Week' }].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setDateFilter(key as any)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                dateFilter === key
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                  : 'bg-surface-800 text-surface-300 hover:bg-surface-700 hover:text-white border border-white/6'
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto text-xs text-surface-400 self-center hidden md:block">{filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const saved = isSaved(event.id);
            return (
              <div key={event.id} className="group relative">
                <Link to={`/event/${event.id}`} className="block h-full">
                  <article className="bg-surface-800 rounded-2xl hover:bg-surface-700 border border-white/6 hover:border-brand-500/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col shadow-md hover:shadow-xl hover:shadow-brand-900/20">
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden bg-surface-700">
                      <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-300 border border-brand-500/20">
                        {event.category}
                      </div>
                      <img
                        src={event.bannerImage || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1000'}
                        alt={event.title}
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1000'; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-800/80 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-base font-bold text-white line-clamp-1 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {event.title}
                      </h3>
                      <p className="text-surface-300 text-xs mb-4 line-clamp-2 flex-1 leading-relaxed">{event.description}</p>

                      <div className="space-y-1.5 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-surface-400">
                          <Calendar size={12} className="text-brand-500 flex-shrink-0" />
                          <span className="truncate">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-surface-400">
                          <MapPin size={12} className="text-brand-500 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-surface-400">
                          <Users size={12} className="text-brand-500 flex-shrink-0" />
                          <span>{event.attendeeCount.toLocaleString()} attending</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/6 flex items-center justify-between">
                        <Link to={`/organization/${encodeURIComponent(event.organization)}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 group/org">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-[8px] font-bold text-white">
                            {event.organization.substring(0, 2)}
                          </div>
                          <span className="text-xs font-medium text-surface-400 group-hover/org:text-brand-400 transition-colors truncate max-w-[100px]">{event.organization}</span>
                        </Link>
                        <span className="text-brand-400 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Details <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>

                {/* Save */}
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSaveEvent(event.id); }}
                  className={`absolute top-3 right-3 z-20 p-1.5 rounded-full shadow-md transition-all ${
                    saved ? 'bg-brand-600 text-white scale-110' : 'bg-black/50 text-surface-300 hover:text-brand-400 hover:scale-105'
                  }`}
                >
                  <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-surface-800 mb-5 border border-white/6">
              <Filter className="text-surface-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>No events found</h3>
            <p className="text-surface-400 text-sm">Try adjusting your search or filter criteria.</p>
            <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setDateFilter('ALL'); }} className="mt-5 text-sm text-brand-400 font-semibold hover:underline">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
