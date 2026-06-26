export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  age: number;
  bio: string;
  interests: string[];
  photos: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  gender: 'male' | 'female' | 'other';
  lookingFor: 'male' | 'female' | 'both';
  isPremium: boolean;
  boostCount: number;
  lastActive: Date;
  createdAt: Date;
  personality?: PersonalityType;
}

export interface PersonalityType {
  type: 'timido' | 'directo' | 'divertido' | 'serio' | 'aventurero';
  score: number;
  description: string;
}

export interface Match {
  id: string;
  users: string[];
  compatibility: number;
  createdAt: Date;
  lastMessage?: Message;
  unreadCount: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isAI?: boolean;
  read: boolean;
}

export interface Swipe {
  id: string;
  fromUserId: string;
  toUserId: string;
  liked: boolean;
  timestamp: Date;
}

export interface AISuggestion {
  id: string;
  userId: string;
  matchId: string;
  suggestions: string[];
  personality?: PersonalityType;
  compatibility: number;
}

export interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  duration: number; // days
}

export interface AdConfig {
  id: string;
  type: 'banner' | 'interstitial' | 'native';
  position: 'top' | 'between-profiles' | 'sidebar' | 'chat';
  provider: 'adsense' | 'adsterra';
  code: string;
  active: boolean;
}

export interface ProfileView {
  id: string;
  viewerId: string;
  viewedId: string;
  timestamp: Date;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved';
}
