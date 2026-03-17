export type UserRole = 'STUDENT' | 'ORGANIZER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  bio?: string;
  interests?: string[];
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  layout: 'grid' | 'hero' | 'minimal';
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location: string;
}

export interface LeaderboardEntry {
  id: string;
  team: string;
  points: number;
}

export interface VotingOption {
  id: string;
  text: string;
  votes: number;
}

export interface VotingPoll {
  id: string;
  question: string;
  options: VotingOption[];
  userVotedOptionId?: string; // Track if current user voted
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: 'INFO' | 'IMPORTANT' | 'URGENT';
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  timestamp: string;
  link?: string;
}

export interface RegistrationFormField {
  id: string;
  type: 'text' | 'email' | 'select' | 'checkbox';
  label: string;
  required: boolean;
  options?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'LEADER' | 'MEMBER';
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  isOpen: boolean;
}

// Data structure for Team Formation Module
export interface TeamFormationData {
  maxTeamSize: number;
  teams: Team[];
}

export interface EventModule {
  id: string;
  type: 'REGISTRATION' | 'SCHEDULE' | 'LEADERBOARD' | 'VOTING' | 'GALLERY' | 'ANNOUNCEMENTS' | 'QR_CHECKIN' | 'TEAM_FORMATION';
  isEnabled: boolean;
  data?: any; // Generic container for module-specific data
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organization: string;
  bannerImage: string;
  category: 'Tech' | 'Cultural' | 'Sports' | 'Academic' | 'Social';
  status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED';
  theme: ThemeConfig;
  modules: EventModule[];
  attendeeCount: number;
  createdBy: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  logo: string;
}