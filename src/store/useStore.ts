import { create } from 'zustand';
import { User, Match, Message } from '../types';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  
  potentialMatches: User[];
  setPotentialMatches: (matches: User[]) => void;
  
  currentMatchIndex: number;
  setCurrentMatchIndex: (index: number) => void;
  
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  
  currentChat: Match | null;
  setCurrentChat: (match: Match | null) => void;
  
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
  
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  showAd: boolean;
  setShowAd: (show: boolean) => void;
  
  aiSuggestions: string[];
  setAiSuggestions: (suggestions: string[]) => void;
  
  locationEnabled: boolean;
  setLocationEnabled: (enabled: boolean) => void;
  
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  
  ageRange: [number, number];
  setAgeRange: (range: [number, number]) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  
  potentialMatches: [],
  setPotentialMatches: (potentialMatches) => set({ potentialMatches }),
  
  currentMatchIndex: 0,
  setCurrentMatchIndex: (currentMatchIndex) => set({ currentMatchIndex }),
  
  matches: [],
  setMatches: (matches) => set({ matches }),
  
  currentChat: null,
  setCurrentChat: (currentChat) => set({ currentChat }),
  
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  
  isPremium: false,
  setIsPremium: (isPremium) => set({ isPremium }),
  
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  
  showAd: false,
  setShowAd: (showAd) => set({ showAd }),
  
  aiSuggestions: [],
  setAiSuggestions: (aiSuggestions) => set({ aiSuggestions }),
  
  locationEnabled: false,
  setLocationEnabled: (locationEnabled) => set({ locationEnabled }),
  
  maxDistance: 50,
  setMaxDistance: (maxDistance) => set({ maxDistance }),
  
  ageRange: [18, 50],
  setAgeRange: (ageRange) => set({ ageRange })
}));
