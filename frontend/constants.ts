import { Event, User, ThemeConfig } from './types';

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#0ea5e9',
  secondaryColor: '#64748b',
  backgroundColor: '#ffffff',
  textColor: '#0f172a',
  fontFamily: 'sans',
  layout: 'hero',
};

export const THEME_TEMPLATES: { id: string; name: string; config: ThemeConfig }[] = [
  {
    id: 'default',
    name: 'Campus Default',
    config: DEFAULT_THEME
  },
  {
    id: 'midnight',
    name: 'Midnight Developer',
    config: {
      primaryColor: '#818cf8',
      secondaryColor: '#1e293b',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      fontFamily: 'mono',
      layout: 'grid'
    }
  },
  {
    id: 'festival',
    name: 'Spring Festival',
    config: {
      primaryColor: '#db2777',
      secondaryColor: '#fcd34d',
      backgroundColor: '#fff1f2',
      textColor: '#831843',
      fontFamily: 'serif',
      layout: 'hero'
    }
  },
  {
    id: 'corporate',
    name: 'Professional Summit',
    config: {
      primaryColor: '#0f766e',
      secondaryColor: '#cbd5e1',
      backgroundColor: '#f8fafc',
      textColor: '#334155',
      fontFamily: 'sans',
      layout: 'minimal'
    }
  },
  {
    id: 'nature',
    name: 'Eco Awareness',
    config: {
      primaryColor: '#16a34a',
      secondaryColor: '#fef3c7',
      backgroundColor: '#f0fdf4',
      textColor: '#14532d',
      fontFamily: 'sans',
      layout: 'hero'
    }
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex.rivera@campus.edu',
  role: 'ORGANIZER',
  department: 'Computer Science',
  avatar: 'https://picsum.photos/id/64/200/200',
};

export const MOCK_STUDENT: User = {
  id: 'u2',
  name: 'Jamie Chen',
  email: 'jamie.chen@campus.edu',
  role: 'STUDENT',
  department: 'Mechanical Engineering',
  avatar: 'https://picsum.photos/id/65/200/200',
};

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'TechNova 2024',
    description: 'The biggest student-run hackathon on campus. Join us for 48 hours of coding, innovation, and fun. Build the future with cutting-edge tech.',
    date: '2024-11-15T09:00:00',
    location: 'Innovation Hub, Building C',
    organization: 'CS Society',
    bannerImage: 'https://picsum.photos/id/1/1200/600',
    category: 'Tech',
    status: 'PUBLISHED',
    attendeeCount: 142,
    createdBy: 'u1',
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#a855f7',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      fontFamily: 'mono',
      layout: 'hero',
    },
    modules: [
      { id: 'm1', type: 'REGISTRATION', isEnabled: true },
      { 
        id: 'm2', 
        type: 'SCHEDULE', 
        isEnabled: true,
        data: [
          { id: 's1', time: '09:00', title: 'Check-in', location: 'Lobby' },
          { id: 's2', time: '10:00', title: 'Opening Keynote', location: 'Main Hall' },
          { id: 's3', time: '12:00', title: 'Hacking Begins', location: 'Labs 1-4' }
        ]
      },
      { 
        id: 'm3', 
        type: 'LEADERBOARD', 
        isEnabled: true,
        data: [
          { id: 'l1', team: 'Null Pointers', points: 150 },
          { id: 'l2', team: 'Git Push Force', points: 120 },
          { id: 'l3', team: 'React Reactors', points: 90 }
        ]
      },
    ],
  },
  {
    id: 'e2',
    title: 'Spring Music Fest',
    description: 'A night of music, dance, and cultural performances by students and guest artists. Experience the rhythm of the campus.',
    date: '2024-12-05T18:00:00',
    location: 'Open Air Theatre',
    organization: 'Music Club',
    bannerImage: 'https://picsum.photos/id/453/1200/600',
    category: 'Cultural',
    status: 'PUBLISHED',
    attendeeCount: 89,
    createdBy: 'u1',
    theme: {
      primaryColor: '#f43f5e',
      secondaryColor: '#fcd34d',
      backgroundColor: '#fff1f2',
      textColor: '#881337',
      fontFamily: 'serif',
      layout: 'grid',
    },
    modules: [
      { id: 'm4', type: 'REGISTRATION', isEnabled: true },
      { id: 'm5', type: 'GALLERY', isEnabled: true, data: [] },
    ],
  },
  {
    id: 'e3',
    title: 'Inter-Department Football Cup',
    description: 'The annual football championship. Gather your team and fight for the glory of your department.',
    date: '2024-11-20T16:00:00',
    location: 'Main Sports Ground',
    organization: 'Sports Committee',
    bannerImage: 'https://picsum.photos/id/1058/1200/600',
    category: 'Sports',
    status: 'PUBLISHED',
    attendeeCount: 320,
    createdBy: 'u1',
    theme: {
      primaryColor: '#16a34a',
      secondaryColor: '#facc15',
      backgroundColor: '#f0fdf4',
      textColor: '#14532d',
      fontFamily: 'sans',
      layout: 'minimal',
    },
    modules: [
      { id: 'm6', type: 'REGISTRATION', isEnabled: true },
      { 
        id: 'm7', 
        type: 'LEADERBOARD', 
        isEnabled: true,
        data: [
            { id: 'l1', team: 'Mech Bulls', points: 12 },
            { id: 'l2', team: 'Civil Giants', points: 9 },
            { id: 'l3', team: 'CS Ninjas', points: 6 }
        ]
      },
    ],
  },
];

export const CATEGORIES = ['All', 'Tech', 'Cultural', 'Sports', 'Academic', 'Social'];