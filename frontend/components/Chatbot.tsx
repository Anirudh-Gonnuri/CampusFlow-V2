import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from '../context/AppContext';
import { MessageCircle, X, Send, Bot, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface EventCard {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  bannerImage: string;
  attendeeCount: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  options?: { label: string; value: string }[];
  events?: EventCard[];
  isTyping?: boolean;
}

const QUICK_CHIPS = ['Browse Events', 'Events this week', 'Tech events', 'My dashboard', 'Help'];

export const Chatbot: React.FC = () => {
  const { user, events, addEvent, registerForEvent } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  type ChatState = 'IDLE' | 'REGISTERING_CONFIRM' | 'CREATING_TITLE' | 'CREATING_DATE' | 'CREATING_LOCATION' | 'CREATING_CONFIRM';
  const [chatState, setChatState] = useState<ChatState>('IDLE');
  const [tempData, setTempData] = useState<any>({});
  const [targetEventId, setTargetEventId] = useState<string | null>(null);

  const greeting = user
    ? `Hey ${user.name.split(' ')[0]}! 👋 I'm your CampusFlow assistant. Ask me about events, schedules, or type a quick action below.`
    : `Hey there! 👋 I'm CampusFlow's AI assistant. I can help you discover events, check schedules, and more. What can I help you with?`;

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: greeting, sender: 'bot' }
  ]);

  useEffect(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [messages, isOpen]);

  const pushBot = (msg: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), ...msg }]);
  };

  const findEvents = (query: string): EventCard[] => {
    const lq = query.toLowerCase();
    const clean = lq
      .replace(/register for|join|when is|where is|tell me about|find|show me|list|search/g, '')
      .trim();
    if (clean.length < 2) return [];
    return events.filter(e =>
      e.title.toLowerCase().includes(clean) ||
      e.category.toLowerCase().includes(clean) ||
      e.description.toLowerCase().includes(clean) ||
      e.location.toLowerCase().includes(clean)
    ).slice(0, 4).map(e => ({
      id: e.id, title: e.title, category: e.category,
      date: e.date, location: e.location,
      bannerImage: e.bannerImage, attendeeCount: e.attendeeCount
    }));
  };

  const getEventsThisWeek = (): EventCard[] => {
    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return events
      .filter(e => { const d = new Date(e.date); return d >= now && d <= weekEnd; })
      .slice(0, 4)
      .map(e => ({ id: e.id, title: e.title, category: e.category, date: e.date, location: e.location, bannerImage: e.bannerImage, attendeeCount: e.attendeeCount }));
  };

  const getEventsToday = (): EventCard[] => {
    const today = new Date().toDateString();
    return events
      .filter(e => new Date(e.date).toDateString() === today)
      .map(e => ({ id: e.id, title: e.title, category: e.category, date: e.date, location: e.location, bannerImage: e.bannerImage, attendeeCount: e.attendeeCount }));
  };

  const processInput = async (input: string) => {
    const lq = input.toLowerCase().trim();
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 700 + Math.random() * 400));
    setIsTyping(false);

    // State machine
    if (chatState === 'CREATING_TITLE') {
      setTempData({ title: input });
      setChatState('CREATING_DATE');
      pushBot({ text: `Great title! 📅 When is "${input}" happening? (e.g. 2025-12-25 or tomorrow)`, sender: 'bot' });
      return;
    }
    if (chatState === 'CREATING_DATE') {
      let dateStr = input;
      if (lq.includes('tomorrow')) {
        const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(10, 0, 0, 0);
        dateStr = d.toISOString();
      } else if (lq.includes('next week')) {
        const d = new Date(); d.setDate(d.getDate() + 7); d.setHours(10, 0, 0, 0);
        dateStr = d.toISOString();
      } else {
        const parsed = new Date(input);
        if (isNaN(parsed.getTime())) {
          pushBot({ text: "I couldn't parse that date. Please use YYYY-MM-DD format (e.g. 2025-06-15).", sender: 'bot' });
          return;
        }
        dateStr = parsed.toISOString();
      }
      setTempData((p: any) => ({ ...p, date: dateStr }));
      setChatState('CREATING_LOCATION');
      pushBot({ text: "📍 Where will it be held?", sender: 'bot' });
      return;
    }
    if (chatState === 'CREATING_LOCATION') {
      const final = { ...tempData, location: input };
      setTempData(final);
      setChatState('CREATING_CONFIRM');
      pushBot({
        text: `Here's your event summary:\n\n📌 **${final.title}**\n📅 ${new Date(final.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n📍 ${input}\n\nPublish this event?`,
        sender: 'bot',
        options: [{ label: '✅ Yes, Publish', value: 'yes' }, { label: '❌ Cancel', value: 'cancel' }]
      });
      return;
    }
    if (chatState === 'CREATING_CONFIRM') {
      if (lq.includes('yes') || lq === '✅ yes, publish') {
        await addEvent({ ...tempData, description: 'Created via AI assistant', category: 'General', status: 'PUBLISHED', modules: [] } as any);
        pushBot({ text: '🚀 Event published! You can manage it from your dashboard.', sender: 'bot', options: [{ label: 'Go to Dashboard', value: '__nav:/dashboard' }] });
      } else {
        pushBot({ text: 'Event creation cancelled. Anything else I can help with?', sender: 'bot' });
      }
      setChatState('IDLE'); setTempData({}); return;
    }
    if (chatState === 'REGISTERING_CONFIRM') {
      if (lq.includes('yes') || lq.includes('sure') || lq.includes('ok')) {
        if (targetEventId) {
          registerForEvent(targetEventId);
          pushBot({ text: "🎉 You're registered! Check your dashboard for the ticket.", sender: 'bot', options: [{ label: 'View Dashboard', value: '__nav:/dashboard' }] });
        }
      } else {
        pushBot({ text: "No worries! Let me know if you need anything else.", sender: 'bot' });
      }
      setChatState('IDLE'); setTargetEventId(null); return;
    }

    // Help
    if (lq === 'help' || lq.includes('what can you do') || lq.includes('commands')) {
      pushBot({ text: "Here's what I can help with:\n\n🔍 **Find events** — \"show tech events\", \"events this week\"\n📋 **Event details** — \"when is [event name]?\", \"where is [event]?\"\n📝 **Register** — \"register for [event name]\"\n➕ **Create** — \"create event\" (organizers only)\n🗺️ **Navigate** — \"go to dashboard\", \"browse events\"\n📆 **Today/Week** — \"what's today?\", \"this week\"", sender: 'bot' });
      return;
    }

    // Today's events
    if (lq.includes("today") || lq.includes("happening now")) {
      const todayEvents = getEventsToday();
      if (todayEvents.length > 0) {
        pushBot({ text: `There ${todayEvents.length === 1 ? 'is' : 'are'} **${todayEvents.length} event${todayEvents.length > 1 ? 's' : ''}** happening today:`, sender: 'bot', events: todayEvents });
      } else {
        pushBot({ text: "No events scheduled for today. Check out what's coming up this week!", sender: 'bot', options: [{ label: 'Events this week', value: 'events this week' }] });
      }
      return;
    }

    // This week
    if (lq.includes('this week') || lq.includes('week') || lq.includes('upcoming')) {
      const weekEvents = getEventsThisWeek();
      if (weekEvents.length > 0) {
        pushBot({ text: `Here are events happening **this week**:`, sender: 'bot', events: weekEvents });
      } else {
        pushBot({ text: "Nothing scheduled this week. Check out all events to plan ahead!", sender: 'bot', options: [{ label: 'All Events', value: '__nav:/' }] });
      }
      return;
    }

    // Register intent
    if ((lq.includes('register') || lq.includes('sign up') || lq.includes('join')) && !lq.includes('create')) {
      if (!user) {
        pushBot({ text: "You need to sign in to register for events.", sender: 'bot', options: [{ label: 'Sign In', value: '__nav:/login' }] });
        return;
      }
      const matches = findEvents(lq);
      if (matches.length === 1) {
        setTargetEventId(matches[0].id);
        setChatState('REGISTERING_CONFIRM');
        pushBot({ text: `Register for **${matches[0].title}** on ${new Date(matches[0].date).toLocaleDateString()}?`, sender: 'bot', options: [{ label: '✅ Yes', value: 'yes' }, { label: '❌ No', value: 'no' }] });
      } else if (matches.length > 1) {
        pushBot({ text: "I found a few matching events. Which one did you mean?", sender: 'bot', events: matches });
      } else {
        pushBot({ text: "Which event would you like to register for? Try: \"register for [event name]\"", sender: 'bot', options: [{ label: 'Browse Events', value: '__nav:/' }] });
      }
      return;
    }

    // Create event
    if ((lq.includes('create') || lq.includes('host') || lq.includes('organize') || lq.includes('add')) && lq.includes('event')) {
      if (user?.role === 'ORGANIZER') {
        setChatState('CREATING_TITLE');
        pushBot({ text: "Let's create a new event! ✨ What's the title?", sender: 'bot' });
      } else if (user) {
        pushBot({ text: "Only organizers can create events. Want to upgrade your account?", sender: 'bot' });
      } else {
        pushBot({ text: "You need to sign in as an organizer to create events.", sender: 'bot', options: [{ label: 'Sign In', value: '__nav:/login' }] });
      }
      return;
    }

    // Navigation shortcuts
    if (lq.includes('dashboard') || lq.includes('my events') || lq.includes('my tickets')) {
      if (user) {
        navigate('/dashboard');
        pushBot({ text: "Opening your dashboard! 🗂️", sender: 'bot' });
      } else {
        pushBot({ text: "Sign in to access your dashboard.", sender: 'bot', options: [{ label: 'Sign In', value: '__nav:/login' }] });
      }
      return;
    }
    if (lq.includes('profile')) {
      navigate('/profile');
      pushBot({ text: "Taking you to your profile! 👤", sender: 'bot' }); return;
    }

    // Category/keyword event search
    const categoryKeywords: Record<string, string[]> = {
      'tech': ['technology', 'tech', 'coding', 'programming', 'hackathon', 'software', 'ai', 'computer'],
      'music': ['music', 'concert', 'band', 'performance', 'DJ', 'festival'],
      'sports': ['sports', 'game', 'tournament', 'fitness', 'basketball', 'football', 'run'],
      'workshop': ['workshop', 'seminar', 'training', 'learn', 'course'],
      'social': ['party', 'social', 'mixer', 'networking', 'meetup'],
      'arts': ['art', 'design', 'creative', 'exhibition', 'gallery'],
    };
    for (const [cat, kws] of Object.entries(categoryKeywords)) {
      if (kws.some(kw => lq.includes(kw))) {
        const catEvents = events.filter(e => e.category.toLowerCase().includes(cat) || kws.some(kw => e.title.toLowerCase().includes(kw))).slice(0, 4).map(e => ({ id: e.id, title: e.title, category: e.category, date: e.date, location: e.location, bannerImage: e.bannerImage, attendeeCount: e.attendeeCount }));
        if (catEvents.length > 0) {
          pushBot({ text: `Found **${catEvents.length}** ${cat} event${catEvents.length > 1 ? 's' : ''} for you:`, sender: 'bot', events: catEvents });
        } else {
          pushBot({ text: `No ${cat} events found right now. Check back soon!`, sender: 'bot', options: [{ label: 'Browse All Events', value: '__nav:/' }] });
        }
        return;
      }
    }

    // Specific event lookup
    const found = findEvents(lq);
    if (found.length > 0) {
      if (lq.includes('when') || lq.includes('time') || lq.includes('date') || lq.includes('schedule')) {
        pushBot({ text: `📅 **${found[0].title}** is on ${new Date(found[0].date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${new Date(found[0].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`, sender: 'bot', options: [{ label: 'View Details', value: `__nav:/event/${found[0].id}` }] });
      } else if (lq.includes('where') || lq.includes('location') || lq.includes('place') || lq.includes('venue')) {
        pushBot({ text: `📍 **${found[0].title}** will be held at **${found[0].location}**.`, sender: 'bot', options: [{ label: 'View Details', value: `__nav:/event/${found[0].id}` }] });
      } else {
        pushBot({ text: found.length === 1 ? `Here's what I found:` : `I found ${found.length} matching events:`, sender: 'bot', events: found });
      }
      return;
    }

    // Browse
    if (lq.includes('browse') || lq.includes('all events') || lq === 'events') {
      navigate('/');
      pushBot({ text: "Opening the events page! 🗺️", sender: 'bot' }); return;
    }

    // Greetings
    if (/^(hi|hey|hello|howdy|sup|yo)\b/.test(lq)) {
      pushBot({ text: `Hey${user ? ' ' + user.name.split(' ')[0] : ''}! 😊 What can I help you with today?`, sender: 'bot', options: QUICK_CHIPS.slice(0, 3).map(c => ({ label: c, value: c })) });
      return;
    }

    // Fallback
    const suggestions = findEvents(lq);
    pushBot({
      text: "Hmm, I'm not sure about that. Try asking about specific events, or use one of the quick actions below!",
      sender: 'bot',
      options: [{ label: '🔍 Browse Events', value: '__nav:/' }, { label: '📅 This Week', value: 'events this week' }, { label: '❓ Help', value: 'help' }],
      ...(suggestions.length > 0 ? { events: suggestions.slice(0, 2) } : {})
    });
  };

  const handleSend = (text?: string) => {
    const msg = (text ?? inputValue).trim();
    if (!msg) return;
    setInputValue('');
    setMessages(prev => [...prev, { id: Date.now().toString(), text: msg, sender: 'user' }]);

    // Handle navigation shortcuts from chips
    if (msg.startsWith('__nav:')) {
      navigate(msg.replace('__nav:', ''));
      return;
    }
    processInput(msg);
  };

  const handleChip = (opt: { label: string; value: string }) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text: opt.label, sender: 'user' }]);
    if (opt.value.startsWith('__nav:')) { navigate(opt.value.replace('__nav:', '')); return; }
    processInput(opt.value || opt.label);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        aria-label="Toggle chat assistant"
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ${isOpen ? 'bg-surface-700 border border-white/10' : 'bg-gradient-to-br from-brand-600 to-brand-700 glow-red'} text-white`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 z-50 w-80 md:w-96 rounded-2xl shadow-2xl border border-white/8 overflow-hidden transition-all duration-300 origin-bottom-right bg-surface-800 ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-6 pointer-events-none'}`}>

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-800 to-surface-800 border-b border-white/8 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600/30 border border-brand-500/40 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-brand-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>CampusFlow AI</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-[10px] text-surface-400">Online</p>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-surface-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
            <X size={16} />
          </button>
        </div>

        {/* Quick Chips */}
        {messages.length <= 1 && (
          <div className="px-3 pt-3 pb-0 flex flex-wrap gap-2">
            {QUICK_CHIPS.map(chip => (
              <button key={chip} onClick={() => handleChip({ label: chip, value: chip })}
                className="text-xs px-3 py-1.5 rounded-full bg-surface-700 text-surface-200 border border-white/8 hover:bg-surface-600 hover:border-brand-600/40 transition-all font-medium">
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="h-72 overflow-y-auto p-3 flex flex-col gap-3 no-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-br-sm'
                  : 'bg-surface-700 text-surface-100 border border-white/6 rounded-bl-sm'
              }`}>
                {msg.text.split('**').map((part, i) =>
                  i % 2 === 1 ? <strong key={i} className="font-bold text-white">{part}</strong> : part
                )}
              </div>

              {/* Inline Event Cards */}
              {msg.events && msg.events.length > 0 && (
                <div className="mt-2 w-full max-w-[88%] space-y-2">
                  {msg.events.map(ev => (
                    <button key={ev.id} onClick={() => navigate(`/event/${ev.id}`)}
                      className="w-full text-left bg-surface-900 rounded-xl border border-white/8 overflow-hidden hover:border-brand-600/40 transition-all flex gap-0">
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                        <img src={ev.bannerImage} className="w-full h-full object-cover" alt={ev.title} />
                      </div>
                      <div className="flex-1 p-2 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{ev.title}</p>
                        <p className="text-[10px] text-brand-400 font-medium">{ev.category}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-surface-400 flex items-center gap-0.5"><Calendar size={9} />{new Date(ev.date).toLocaleDateString()}</span>
                          <span className="text-[10px] text-surface-400 flex items-center gap-0.5"><MapPin size={9} />{ev.location.split(',')[0]}</span>
                        </div>
                      </div>
                      <div className="flex items-center pr-2">
                        <ArrowRight size={12} className="text-surface-500" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Option Chips */}
              {msg.options && msg.options.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.options.map((opt, i) => (
                    <button key={i} onClick={() => handleChip(opt)}
                      className="text-xs bg-surface-700 text-surface-200 border border-white/8 px-3 py-1.5 rounded-full hover:bg-surface-600 hover:border-brand-600/40 transition-all font-medium">
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start">
              <div className="bg-surface-700 border border-white/6 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                <span className="typing-dot" />
                <span className="typing-dot" style={{ animationDelay: '0.15s' }} />
                <span className="typing-dot" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-surface-900 border-t border-white/6 flex gap-2 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 text-sm bg-surface-800 border border-white/8 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-brand-600/50 focus:border-brand-600/50 outline-none text-white placeholder-surface-400 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
};


