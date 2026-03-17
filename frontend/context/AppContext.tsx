import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Event, UserRole, Notification, Team, TeamFormationData } from '../types';
import client from '../src/api/client';
import { authService } from '../src/api/auth';

interface AppContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    updateProfile: (userData: Partial<User>) => void;
    logout: () => void;
    events: Event[];
    fetchEvents: () => Promise<void>;
    addEvent: (event: Event) => Promise<void>;
    updateEvent: (event: Event) => Promise<void>;
    getEvent: (id: string) => Event | undefined;
    // Registration Logic
    registerForEvent: (eventId: string) => void;
    cancelRegistration: (eventId: string) => void;
    isRegistered: (eventId: string) => boolean;
    myRegistrations: Event[];
    getEventRegistrations: (eventId: string) => { user: User, status: 'REGISTERED' | 'CHECKED_IN', timestamp: string }[];
    checkInUser: (eventId: string, userId: string) => void;
    // Bookmarking Logic
    toggleSaveEvent: (eventId: string) => void;
    isSaved: (eventId: string) => boolean;
    savedEvents: Event[];
    // Voting Logic
    voteInPoll: (eventId: string, pollId: string, optionId: string) => void;
    // Team Logic
    createTeam: (eventId: string, teamName: string, description: string) => void;
    joinTeam: (eventId: string, teamId: string) => void;
    leaveTeam: (eventId: string, teamId: string) => void;
    // Gallery Logic
    addToGallery: (eventId: string, imageUrl: string) => void;
    // Notification Logic
    notifications: Notification[];
    markNotificationRead: (id: string) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
    unreadCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [events, setEvents] = useState<Event[]>([]);

    // These will need backend implementation later, keeping as local state for now to avoid breaking UI immediately
    const [registrations, setRegistrations] = useState<{ userId: string, eventId: string, status: 'REGISTERED' | 'CHECKED_IN', timestamp: string }[]>([]);
    const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Load user from token on mount
    useEffect(() => {
        const checkUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const userData = await authService.getMe();
                    setUser(userData);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem('token');
            }
        };
        checkUser();
    }, []);

    // Fetch events on mount
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await client.get('/events');
            // Map backend data to frontend Event interface
            const mappedEvents = response.data.map((e: any) => ({
                ...e,
                id: e._id,
                bannerImage: e.imageUrl,
                createdBy: e.organizer,
                organization: 'Campus',
                theme: e.theme || { primaryColor: '#0ea5e9', secondaryColor: '#6366f1', backgroundColor: '#ffffff', textColor: '#1f2937', fontFamily: 'sans', layout: 'grid' }
            }));
            setEvents(mappedEvents);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    };

    const login = async (email: string, password: string) => {
        const data = await authService.login({ email, password });
        setUser(data); // authService returns user object with token handled inside
        await fetchEvents(); // Refresh events as permissions might change
    };

    const register = async (userData: any) => {
        const data = await authService.register(userData);
        setUser(data);
    };

    const updateProfile = (userData: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...userData });
            // TODO: API call to update profile
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setSavedEventIds([]);
        setNotifications([]);
    };

    const addEvent = async (event: Event) => {
        try {
            // Map frontend Event to backend payload
            const payload = {
                ...event,
                imageUrl: event.bannerImage,
                organizer: user?.id,
            };
            const response = await client.post('/events', payload);
            // Add response to state (mapped)
            const newEvent = {
                ...response.data,
                id: response.data._id,
                bannerImage: response.data.imageUrl,
                createdBy: response.data.organizer,
                organization: 'Campus',
                theme: response.data.theme || event.theme
            };
            setEvents((prev) => [newEvent, ...prev]);
        } catch (e) {
            console.error("Failed to create event", e);
        }
    };

    const updateEvent = async (updatedEvent: Event) => {
        try {
            const payload = {
                ...updatedEvent,
                imageUrl: updatedEvent.bannerImage,
            };
            const response = await client.put(`/events/${updatedEvent.id}`, payload);
            const mapped = {
                ...response.data,
                id: response.data._id,
                bannerImage: response.data.imageUrl,
                createdBy: response.data.organizer,
                organization: 'Campus',
                theme: response.data.theme || updatedEvent.theme
            };

            setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? mapped : e)));
        } catch (e) {
            console.error("Failed to update event", e);
        }
    };

    const getEvent = (id: string) => events.find((e) => e.id === id);

    // Registration implementation
    const registerForEvent = (eventId: string) => {
        if (!user) return;
        if (!registrations.some(r => r.userId === user.id && r.eventId === eventId)) {
            setRegistrations(prev => [...prev, { userId: user.id, eventId, status: 'REGISTERED', timestamp: new Date().toISOString() }]);
            setEvents(prev => prev.map(e => e.id === eventId ? { ...e, attendeeCount: e.attendeeCount + 1 } : e));

            addNotification({
                title: 'Registration Successful',
                message: `You're all set for the event!`,
                type: 'success',
                link: `/event/${eventId}`
            });
        }
    };

    const cancelRegistration = (eventId: string) => {
        if (!user) return;

        const isRegistered = registrations.some(r => r.userId === user.id && r.eventId === eventId);

        if (isRegistered) {
            // Remove registration
            setRegistrations(prev => prev.filter(r => !(r.userId === user.id && r.eventId === eventId)));

            // Decrement attendee count
            setEvents(prev => prev.map(e => e.id === eventId ? { ...e, attendeeCount: Math.max(0, e.attendeeCount - 1) } : e));

            addNotification({
                title: 'Registration Cancelled',
                message: `Your registration has been cancelled.`,
                type: 'info'
            });
        }
    };

    const isRegistered = (eventId: string) => {
        if (!user) return false;
        return registrations.some(r => r.userId === user.id && r.eventId === eventId);
    };

    const getEventRegistrations = (eventId: string) => {
        return registrations
            .filter(r => r.eventId === eventId)
            .map(r => {
                // In a real app, we would fetch user details or have them in the registration object
                // For now, if it's the current user, use their details, otherwise generic
                const registrant = (user && user.id === r.userId) ? user : {
                    id: r.userId,
                    name: 'Student User',
                    email: 'student@campus.edu',
                    role: 'STUDENT' as UserRole,
                    department: 'General',
                    avatar: 'https://ui-avatars.com/api/?background=random'
                };

                return {
                    user: registrant,
                    status: r.status,
                    timestamp: r.timestamp
                };
            });
    };

    const checkInUser = (eventId: string, userId: string) => {
        setRegistrations(prev => prev.map(r =>
            (r.eventId === eventId && r.userId === userId)
                ? { ...r, status: 'CHECKED_IN' }
                : r
        ));
    };

    // Bookmarking implementation
    const toggleSaveEvent = (eventId: string) => {
        setSavedEventIds(prev =>
            prev.includes(eventId)
                ? prev.filter(id => id !== eventId)
                : [...prev, eventId]
        );
    };

    const isSaved = (eventId: string) => savedEventIds.includes(eventId);

    // Voting Logic
    const voteInPoll = (eventId: string, pollId: string, optionId: string) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (event.id !== eventId) return event;
            return {
                ...event,
                modules: event.modules.map(module => {
                    if (module.type !== 'VOTING') return module;
                    const newData = module.data.map((poll: any) => {
                        if (poll.id !== pollId) return poll;
                        return {
                            ...poll,
                            userVotedOptionId: optionId,
                            options: poll.options.map((opt: any) =>
                                opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
                            )
                        };
                    });
                    return { ...module, data: newData };
                })
            };
        }));
    };

    // Team Logic
    const createTeam = (eventId: string, teamName: string, description: string) => {
        if (!user) return;
        setEvents(prev => prev.map(e => {
            if (e.id !== eventId) return e;
            return {
                ...e,
                modules: e.modules.map(m => {
                    if (m.type !== 'TEAM_FORMATION') return m;
                    const currentData = m.data as TeamFormationData;
                    const newTeam: Team = {
                        id: Math.random().toString(36).substr(2, 9),
                        name: teamName,
                        description,
                        isOpen: true,
                        members: [{ id: user.id, name: user.name, role: 'LEADER', avatar: user.avatar }]
                    };
                    return { ...m, data: { ...currentData, teams: [...currentData.teams, newTeam] } };
                })
            };
        }));
        addNotification({ title: 'Team Created', message: `You created team "${teamName}"`, type: 'success' });
    };

    const joinTeam = (eventId: string, teamId: string) => {
        if (!user) return;
        setEvents(prev => prev.map(e => {
            if (e.id !== eventId) return e;
            return {
                ...e,
                modules: e.modules.map(m => {
                    if (m.type !== 'TEAM_FORMATION') return m;
                    const currentData = m.data as TeamFormationData;
                    // Remove user from other teams in this event first (if limit is 1 team per event)
                    // For simplicity, let's just add them to the new team
                    const updatedTeams = currentData.teams.map(t => {
                        if (t.id === teamId) {
                            return {
                                ...t,
                                members: [...t.members, { id: user.id, name: user.name, role: 'MEMBER' as const, avatar: user.avatar }]
                            };
                        }
                        return t;
                    });
                    return { ...m, data: { ...currentData, teams: updatedTeams } };
                })
            };
        }));
        addNotification({ title: 'Joined Team', message: `You successfully joined the team.`, type: 'success' });
    };

    const leaveTeam = (eventId: string, teamId: string) => {
        if (!user) return;
        setEvents(prev => prev.map(e => {
            if (e.id !== eventId) return e;
            return {
                ...e,
                modules: e.modules.map(m => {
                    if (m.type !== 'TEAM_FORMATION') return m;
                    const currentData = m.data as TeamFormationData;
                    const updatedTeams = currentData.teams.map(t => {
                        if (t.id === teamId) {
                            return { ...t, members: t.members.filter(mem => mem.id !== user.id) };
                        }
                        return t;
                    }).filter(t => t.members.length > 0); // Remove team if empty
                    return { ...m, data: { ...currentData, teams: updatedTeams } };
                })
            };
        }));
    };

    // Gallery Logic
    const addToGallery = (eventId: string, imageUrl: string) => {
        setEvents(prev => prev.map(e => {
            if (e.id !== eventId) return e;
            return {
                ...e,
                modules: e.modules.map(m => {
                    if (m.type !== 'GALLERY') return m;
                    return { ...m, data: [...(m.data || []), imageUrl] };
                })
            };
        }));
        addNotification({ title: 'Photo Uploaded', message: 'Your photo has been added to the gallery.', type: 'success' });
    };

    // Notifications Logic
    const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
        const newNotif: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            isRead: false,
            ...notif
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markNotificationRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const myRegistrations = events.filter(e => isRegistered(e.id));
    const savedEvents = events.filter(e => isSaved(e.id));

    return (
        <AppContext.Provider value={{
            user, login, register, updateProfile, logout,
            events, addEvent, updateEvent, getEvent, fetchEvents,
            registerForEvent, cancelRegistration, isRegistered, myRegistrations, getEventRegistrations, checkInUser,
            toggleSaveEvent, isSaved, savedEvents,
            voteInPoll,
            createTeam, joinTeam, leaveTeam,
            addToGallery,
            notifications, markNotificationRead, addNotification, unreadCount
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

// --- Custom Router Implementation (Pure State-Based) ---

const RouterContext = createContext<{
    path: string;
    navigate: (to: string) => void;
}>({
    path: '/',
    navigate: () => { }
});

export const MemoryRouter: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [path, setPath] = useState('/');

    const navigate = (to: string) => {
        setPath(to);
        window.scrollTo(0, 0);
    };

    return (
        <RouterContext.Provider value={{ path, navigate }}>
            {children}
        </RouterContext.Provider>
    );
};

export const useLocation = () => {
    const { path } = useContext(RouterContext);
    const [pathname, search] = path.split('?');
    return {
        pathname,
        search: search ? `?${search}` : ''
    };
};

export const useNavigate = () => useContext(RouterContext).navigate;

export const Link: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }> = ({ to, children, className, ...props }) => {
    const { navigate } = useContext(RouterContext);
    return (
        <a href={to} className={className} onClick={(e) => {
            e.preventDefault();
            navigate(to);
        }} {...props}>
            {children}
        </a>
    );
};

export const Navigate: React.FC<{ to: string }> = ({ to }) => {
    const { navigate } = useContext(RouterContext);
    useEffect(() => navigate(to), [to, navigate]);
    return null;
};

export const useParams = () => {
    const { pathname } = useLocation();

    // /event/:id
    const eventMatch = pathname.match(/^\/event\/([^\/]+)$/);
    if (eventMatch) return { id: eventMatch[1] };

    // /event/:id/analytics or /checkin
    const subRouteMatch = pathname.match(/^\/event\/([^\/]+)\/(analytics|checkin)$/);
    if (subRouteMatch) return { id: subRouteMatch[1] };

    // /organization/:id
    const orgMatch = pathname.match(/^\/organization\/([^\/]+)$/);
    if (orgMatch) return { id: decodeURIComponent(orgMatch[1]) };

    return {};
};

export const useSearchParams = () => {
    const { search } = useLocation();
    return [new URLSearchParams(search)];
};

export const Routes: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { pathname } = useLocation();
    let element: ReactNode = null;

    React.Children.forEach(children, child => {
        if (element || !React.isValidElement(child)) return;
        const { path, element: routeEl } = child.props as any;

        // Exact match
        if (path === pathname) {
            element = routeEl;
            return;
        }

        // Wildcard
        if (path === '*') {
            if (!element) element = routeEl;
            return;
        }

        // Simple Dynamic matchers
        const patterns = [
            { pattern: /^\/event\/([^\/]+)$/, route: '/event/:id' },
            { pattern: /^\/event\/([^\/]+)\/analytics$/, route: '/event/:id/analytics' },
            { pattern: /^\/event\/([^\/]+)\/checkin$/, route: '/event/:id/checkin' },
            { pattern: /^\/organization\/([^\/]+)$/, route: '/organization/:id' },
        ];

        for (const p of patterns) {
            if (pathname.match(p.pattern) && path === p.route) {
                element = routeEl;
                return;
            }
        }
    });

    return <>{element}</>;
};

export const Route: React.FC<{ path: string; element: ReactNode }> = () => null;