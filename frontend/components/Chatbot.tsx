import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from '../context/AppContext';
import { MessageCircle, X, Send, Compass, LayoutDashboard, User, Ticket } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    options?: { label: string; action: () => void }[];
}

export const Chatbot: React.FC = () => {
    const { user, events } = useApp();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Hi ${user?.name || 'there'}! I can help you find events, check schedules, or navigate CampusFlow. Ask me anything!`,
            sender: 'bot',
            options: [
                { label: 'Browse Events', action: () => navigate('/') },
                ...(user ? [{ label: 'My Dashboard', action: () => navigate('/dashboard') }] : []),
            ]
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Chat State Management
    type ChatState = 'IDLE' | 'CREATING_TITLE' | 'CREATING_DATE' | 'CREATING_LOCATION' | 'CREATING_CONFIRM' | 'REGISTERING_CONFIRM';
    const [chatState, setChatState] = useState<ChatState>('IDLE');
    const [tempData, setTempData] = useState<any>({});
    const [targetEventId, setTargetEventId] = useState<string | null>(null);

    const { addEvent, registerForEvent } = useApp();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const findEventMatch = (query: string) => {
        const lowerQuery = query.toLowerCase();
        // Remove common command phrases to isolate the potential event name
        const cleanQuery = lowerQuery
            .replace('register for', '')
            .replace('join', '')
            .replace('when is', '')
            .replace('where is', '')
            .replace('tell me about', '')
            .trim();

        if (cleanQuery.length < 2) return undefined; // Too short to match safely

        return events.find(e => e.title.toLowerCase().includes(cleanQuery) || e.category.toLowerCase().includes(cleanQuery));
    };

    const resetChat = () => {
        setChatState('IDLE');
        setTempData({});
        setTargetEventId(null);
    };

    const handleConfirmCreation = async (data: any) => {
        await addEvent({
            ...data,
            description: 'Created via Chatbot',
            category: 'General',
            status: 'PUBLISHED',
            modules: []
        } as any);
        setMessages(prev => [...prev, { id: Date.now().toString(), text: "Event created successfully! 🚀", sender: 'bot' }]);
        resetChat();
    };

    const processResponse = (input: string) => {
        setTimeout(async () => {
            const lowerInput = input.toLowerCase();
            let botResponse: Message;

            // --- STATE MACHINE HANDLERS ---
            if (chatState === 'CREATING_TITLE') {
                setTempData({ ...tempData, title: input });
                setChatState('CREATING_DATE');
                botResponse = { id: Date.now().toString(), text: "Got it. When is the event happening? (e.g., '2024-12-25' or 'Tomorrow at 5pm')", sender: 'bot' };
            }
            else if (chatState === 'CREATING_DATE') {
                // Simple date validation/parsing
                const dateObj = new Date(input);
                let finalDate = input;
                if (isNaN(dateObj.getTime())) {
                    // Try to handle "tomorrow"
                    if (input.toLowerCase().includes('tomorrow')) {
                        const d = new Date();
                        d.setDate(d.getDate() + 1);
                        d.setHours(9, 0, 0, 0); // Default to 9 AM
                        finalDate = d.toISOString();
                    } else {
                        // Default or ask again? For now, let's default to a week from now if invalid
                        // But better to ask again.
                        botResponse = { id: Date.now().toString(), text: "I couldn't understand that date. Please use YYYY-MM-DD format (e.g. 2024-12-25).", sender: 'bot' };
                        setMessages(prev => [...prev, botResponse]);
                        return; // Stay in CREATING_DATE state
                    }
                } else {
                    finalDate = dateObj.toISOString();
                }

                setTempData({ ...tempData, date: finalDate });
                setChatState('CREATING_LOCATION');
                botResponse = { id: Date.now().toString(), text: "Where will it be held?", sender: 'bot' };
            }
            else if (chatState === 'CREATING_LOCATION') {
                const finalData = { ...tempData, location: input };
                setTempData(finalData);
                setChatState('CREATING_CONFIRM');
                botResponse = {
                    id: Date.now().toString(),
                    text: `Please confirm:\nEvent: ${finalData.title}\nWhen: ${finalData.date}\nWhere: ${input}\n\nShall I publish this?`,
                    sender: 'bot',
                    options: [
                        { label: 'Yes, Publish', action: () => processResponse('Yes') },
                        { label: 'Cancel', action: () => processResponse('Cancel') }
                    ]
                };
            }
            else if (chatState === 'CREATING_CONFIRM') {
                if (lowerInput.includes('yes')) {
                    await handleConfirmCreation(tempData);
                    return;
                } else {
                    botResponse = { id: Date.now().toString(), text: "Cancelled event creation.", sender: 'bot' };
                    resetChat();
                }
            }
            else if (chatState === 'REGISTERING_CONFIRM') {
                if (lowerInput.includes('yes') || lowerInput.includes('sure')) {
                    if (targetEventId) {
                        registerForEvent(targetEventId);
                        botResponse = { id: Date.now().toString(), text: "You are now registered! 🎉", sender: 'bot' };
                    } else {
                        botResponse = { id: Date.now().toString(), text: "Error: Lost track of the event.", sender: 'bot' };
                    }
                } else {
                    botResponse = { id: Date.now().toString(), text: "Okay, cancelled.", sender: 'bot' };
                }
                resetChat();
            }
            // --- IDLE STATE HANDLERS ---
            else {
                // 1. High Priority: Registration Intent
                if (lowerInput.includes('register') || lowerInput.includes('join')) {
                    if (user) {
                        const match = findEventMatch(lowerInput);
                        if (match) {
                            setTargetEventId(match.id);
                            setChatState('REGISTERING_CONFIRM');
                            botResponse = {
                                id: Date.now().toString(),
                                text: `Do you want to register for "${match.title}"?`,
                                sender: 'bot',
                                options: [
                                    { label: 'Yes', action: () => processResponse('Yes') },
                                    { label: 'No', action: () => processResponse('No') }
                                ]
                            };
                        } else {
                            botResponse = { id: Date.now().toString(), text: "Which event do you want to join? Try 'Register for [Event Name]'.", sender: 'bot' };
                        }
                    } else {
                        botResponse = { id: Date.now().toString(), text: "Please sign in to register.", sender: 'bot', options: [{ label: 'Sign In', action: () => navigate('/login') }] };
                    }
                }
                // 2. High Priority: Creation Intent
                else if ((lowerInput.includes('create') || lowerInput.includes('host')) && lowerInput.includes('event')) {
                    if (user?.role === 'ORGANIZER') {
                        setChatState('CREATING_TITLE');
                        botResponse = { id: Date.now().toString(), text: "Let's set up your event. What is the title?", sender: 'bot' };
                    } else {
                        botResponse = { id: Date.now().toString(), text: "Only organizers can create new events.", sender: 'bot' };
                    }
                }
                // 3. General Q&A
                else {
                    const matchedEvent = findEventMatch(lowerInput);
                    if (matchedEvent) {
                        if (lowerInput.includes('when') || lowerInput.includes('time') || lowerInput.includes('date')) {
                            botResponse = {
                                id: Date.now().toString(),
                                text: `${matchedEvent.title} is happening on ${new Date(matchedEvent.date).toLocaleDateString()} at ${new Date(matchedEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
                                sender: 'bot',
                                options: [{ label: 'View Details', action: () => navigate(`/event/${matchedEvent.id}`) }]
                            };
                        } else if (lowerInput.includes('where') || lowerInput.includes('location') || lowerInput.includes('place')) {
                            botResponse = {
                                id: Date.now().toString(),
                                text: `${matchedEvent.title} will be held at ${matchedEvent.location}.`,
                                sender: 'bot',
                                options: [{ label: 'View Details', action: () => navigate(`/event/${matchedEvent.id}`) }]
                            };
                        } else if (lowerInput.includes('who') || lowerInput.includes('organizer')) {
                            botResponse = {
                                id: Date.now().toString(),
                                text: `${matchedEvent.title} is organized by the ${matchedEvent.category} department.`,
                                sender: 'bot'
                            };
                        } else {
                            botResponse = {
                                id: Date.now().toString(),
                                text: `I found "${matchedEvent.title}"! It's a ${matchedEvent.category} event located at ${matchedEvent.location}.`,
                                sender: 'bot',
                                options: [{ label: 'View Details', action: () => navigate(`/event/${matchedEvent.id}`) }]
                            };
                        }
                    }
                    else if (lowerInput.includes('event') || lowerInput.includes('browse')) {
                        botResponse = { id: Date.now().toString(), text: "Here are all the upcoming events.", sender: 'bot' };
                        navigate('/');
                    }
                    else if (lowerInput.includes('dashboard') || lowerInput.includes('my events')) {
                        if (user) {
                            botResponse = { id: Date.now().toString(), text: "Opening your dashboard.", sender: 'bot' };
                            navigate('/dashboard');
                        } else {
                            botResponse = { id: Date.now().toString(), text: "You need to sign in to see your dashboard.", sender: 'bot', options: [{ label: 'Sign In', action: () => navigate('/login') }] };
                        }
                    }
                    else {
                        botResponse = {
                            id: Date.now().toString(),
                            text: "I'm not sure about that. Try 'Create event', 'Register for [Event]', or ask 'When is [Event]?'",
                            sender: 'bot',
                            options: [
                                { label: 'Browse Events', action: () => navigate('/') },
                                { label: 'Help', action: () => window.open('https://example.com/help', '_blank') }
                            ]
                        };
                    }
                }
            }

            setMessages(prev => [...prev, botResponse]);
        }, 600);
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        processResponse(inputValue);
    };

    const handleOptionClick = (action: () => void, label: string) => {
        setMessages(prev => [...prev, { id: Date.now().toString(), text: label, sender: 'user' }]);

        // For navigation actions that are simple links, we delay and run
        if (!['Yes', 'No', 'Yes, Publish', 'Cancel'].includes(label)) {
            setTimeout(() => {
                action();
                setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: `Navigating...`, sender: 'bot' }]);
            }, 500);
        } else {
            // For state machine actions, we expect the action prop to call processResponse directly logic
            // But if we want to be sure, we can call processResponse with the label
            processResponse(label);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 ${isOpen ? 'bg-red-500 rotate-90' : 'bg-brand-600'
                    } text-white`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
                }`}>
                {/* Header */}
                <div className="bg-brand-600 p-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Compass size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Campus Assistant</h3>
                            <p className="text-[10px] text-brand-100">Always here to help</p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                ? 'bg-brand-600 text-white rounded-tr-none'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                                }`}>
                                {msg.text}
                            </div>

                            {/* Options Chips */}
                            {msg.options && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {msg.options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionClick(opt.action, opt.label)}
                                            className="text-xs bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full border border-brand-100 hover:bg-brand-100 transition-colors font-medium"
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a command..."
                        className="flex-1 text-sm bg-gray-50 border-0 rounded-full px-4 focus:ring-2 focus:ring-brand-100 outline-none"
                    />
                    <button
                        onClick={handleSend}
                        className="p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors"
                        disabled={!inputValue.trim()}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};
