import { User, Match } from '../types';
import { calculateCompatibility } from './ai';

const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substr(2);

const MATCHES_KEY = 'socializar_matches';
const SWIPES_KEY = 'socializar_swipes';
const MESSAGES_KEY = 'socializar_messages';

function getStore<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function setStore<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function getAllUsers(): any[] {
  try { return JSON.parse(localStorage.getItem('socializar_users') || '[]'); } catch { return []; }
}

const rowToUser = (row: any): User => ({
  id: row.id, email: row.email, displayName: row.displayName, photoURL: row.photoURL || '',
  age: row.age || 18, bio: row.bio || '',
  interests: typeof row.interests === 'string' ? JSON.parse(row.interests) : (row.interests || []),
  photos: typeof row.photos === 'string' ? JSON.parse(row.photos) : (row.photos || []),
  location: { latitude: row.latitude || 0, longitude: row.longitude || 0 },
  gender: row.gender || 'other', lookingFor: row.lookingFor || 'both',
  isPremium: !!row.isPremium, boostCount: row.boostCount || 3,
  personality: row.personalityType ? { type: row.personalityType, score: row.personalityScore || 50, description: row.personalityDesc || '' } : undefined,
  lastActive: new Date(row.lastActive || Date.now()), createdAt: new Date(row.createdAt || Date.now())
});

export const getPotentialMatches = async (currentUser: User, _maxDist: number = 9999): Promise<User[]> => {
  const allUsers = getAllUsers();
  const swipedIds = new Set(getStore<any>(SWIPES_KEY).filter(s => s.fromUserId === currentUser.id).map(s => s.toUserId));

  let candidates = allUsers
    .filter(u => u.id !== currentUser.id && !swipedIds.has(u.id))
    .map(u => rowToUser(u));

  if (currentUser.lookingFor !== 'both') {
    candidates = candidates.filter(u => u.gender === currentUser.lookingFor);
  }

  candidates.sort((a, b) => {
    const compA = calculateCompatibility(currentUser.interests, a.interests, currentUser.personality, a.personality);
    const compB = calculateCompatibility(currentUser.interests, b.interests, currentUser.personality, b.personality);
    return compB - compA;
  });

  console.log('[Match] Found', candidates.length, 'potential matches');
  return candidates;
};

export const swipeUser = async (fromUserId: string, toUserId: string, liked: boolean): Promise<Match | null> => {
  const swipes = getStore<any>(SWIPES_KEY);
  swipes.push({ id: generateId(), fromUserId, toUserId, liked: liked ? 1 : 0, timestamp: new Date().toISOString() });
  setStore(SWIPES_KEY, swipes);

  if (liked) {
    const reverse = swipes.find(s => s.fromUserId === toUserId && s.toUserId === fromUserId && s.liked === 1);
    if (reverse) {
      const matchId = generateId();
      const compatibility = Math.floor(Math.random() * 30) + 70;
      const matches = getStore<any>(MATCHES_KEY);
      matches.push({ id: matchId, user1Id: fromUserId, user2Id: toUserId, compatibility, createdAt: new Date().toISOString(), lastMessageContent: '', lastMessageTime: '', unreadCount: 0 });
      setStore(MATCHES_KEY, matches);
      console.log('[Match] New match!');
      return { id: matchId, users: [fromUserId, toUserId], compatibility, createdAt: new Date(), unreadCount: 0 };
    }
  }
  return null;
};

export const getUserMatches = async (userId: string): Promise<Match[]> => {
  const matches = getStore<any>(MATCHES_KEY);
  return matches
    .filter(m => m.user1Id === userId || m.user2Id === userId)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(m => ({
      id: m.id, users: [m.user1Id, m.user2Id], compatibility: m.compatibility,
      createdAt: new Date(m.createdAt),
      lastMessage: m.lastMessageContent ? { content: m.lastMessageContent, timestamp: new Date(m.lastMessageTime) } : undefined,
      unreadCount: m.unreadCount || 0
    }));
};

export const getMatchById = async (matchId: string): Promise<Match | null> => {
  const matches = getStore<any>(MATCHES_KEY);
  const m = matches.find(x => x.id === matchId);
  if (!m) return null;
  return {
    id: m.id, users: [m.user1Id, m.user2Id], compatibility: m.compatibility,
    createdAt: new Date(m.createdAt),
    lastMessage: m.lastMessageContent ? { content: m.lastMessageContent, timestamp: new Date(m.lastMessageTime) } : undefined,
    unreadCount: m.unreadCount || 0
  };
};
