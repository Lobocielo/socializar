import { getTursoClient } from './turso';
import { User, Match, Swipe } from '../types';
import { calculateDistance } from './location';
import { calculateCompatibility } from './ai';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const rowToUser = (row: any): User => ({
  id: row.id,
  email: row.email,
  displayName: row.displayName,
  photoURL: row.photoURL || '',
  age: row.age || 18,
  bio: row.bio || '',
  interests: row.interests ? JSON.parse(row.interests) : [],
  photos: row.photos ? JSON.parse(row.photos) : [],
  location: { latitude: row.latitude || 0, longitude: row.longitude || 0 },
  gender: row.gender || 'other',
  lookingFor: row.lookingFor || 'both',
  isPremium: row.isPremium === 1,
  boostCount: row.boostCount || 0,
  personality: row.personalityType ? {
    type: row.personalityType,
    score: row.personalityScore || 50,
    description: row.personalityDesc || ''
  } : undefined,
  lastActive: new Date(row.lastActive || Date.now()),
  createdAt: new Date(row.createdAt || Date.now())
});

export const getPotentialMatches = async (
  currentUser: User,
  maxDistance: number = 50
): Promise<User[]> => {
  const client = getTursoClient();

  let sql = 'SELECT * FROM users WHERE id != ?';
  const args: any[] = [currentUser.id];

  if (currentUser.lookingFor !== 'both') {
    sql += ' AND gender = ?';
    args.push(currentUser.lookingFor);
  }

  sql += ' LIMIT 50';

  const result = await client.execute({ sql, args });
  const users: User[] = result.rows.map(rowToUser);

  const swipesResult = await client.execute({
    sql: 'SELECT toUserId FROM swipes WHERE fromUserId = ?',
    args: [currentUser.id]
  });
  const swipedIds = new Set(swipesResult.rows.map(r => r.toUserId as string));

  const filtered = users.filter(user => !swipedIds.has(user.id));

  const usersWithDistance = filtered.map(user => {
    let dist = 999;
    if (currentUser.location.latitude && currentUser.location.longitude &&
        user.location.latitude && user.location.longitude) {
      dist = calculateDistance(
        currentUser.location.latitude, currentUser.location.longitude,
        user.location.latitude, user.location.longitude
      );
    }
    return { ...user, distance: dist } as User & { distance: number };
  }).filter(u => u.distance <= maxDistance || u.distance === 999);

  usersWithDistance.sort((a, b) => {
    const compA = calculateCompatibility(currentUser.interests, a.interests, currentUser.personality, a.personality);
    const compB = calculateCompatibility(currentUser.interests, b.interests, currentUser.personality, b.personality);
    return compB - compA;
  });

  return usersWithDistance;
};

export const swipeUser = async (
  fromUserId: string,
  toUserId: string,
  liked: boolean
): Promise<Match | null> => {
  const client = getTursoClient();

  await client.execute({
    sql: 'INSERT INTO swipes (id, fromUserId, toUserId, liked, timestamp) VALUES (?, ?, ?, ?, ?)',
    args: [generateId(), fromUserId, toUserId, liked ? 1 : 0, new Date().toISOString()]
  });

  if (liked) {
    const reverseResult = await client.execute({
      sql: 'SELECT * FROM swipes WHERE fromUserId = ? AND toUserId = ? AND liked = 1',
      args: [toUserId, fromUserId]
    });

    if (reverseResult.rows.length > 0) {
      const matchId = generateId();
      const compatibility = Math.floor(Math.random() * 30) + 70;

      await client.execute({
        sql: 'INSERT INTO matches (id, user1Id, user2Id, compatibility, createdAt, unreadCount) VALUES (?, ?, ?, ?, ?, ?)',
        args: [matchId, fromUserId, toUserId, compatibility, new Date().toISOString(), 0]
      });

      return {
        id: matchId,
        users: [fromUserId, toUserId],
        compatibility,
        createdAt: new Date(),
        unreadCount: 0
      };
    }
  }

  return null;
};

export const getUserMatches = async (userId: string): Promise<Match[]> => {
  const client = getTursoClient();

  const result = await client.execute({
    sql: 'SELECT * FROM matches WHERE user1Id = ? OR user2Id = ? ORDER BY createdAt DESC',
    args: [userId, userId]
  });

  return result.rows.map(row => ({
    id: row.id as string,
    users: [row.user1Id as string, row.user2Id as string],
    compatibility: row.compatibility as number,
    createdAt: new Date(row.createdAt as string),
    lastMessage: row.lastMessageContent ? {
      content: row.lastMessageContent as string,
      timestamp: new Date(row.lastMessageTime as string)
    } : undefined,
    unreadCount: row.unreadCount as number
  }));
};

export const getMatchById = async (matchId: string): Promise<Match | null> => {
  const client = getTursoClient();

  const result = await client.execute({
    sql: 'SELECT * FROM matches WHERE id = ?',
    args: [matchId]
  });

  if (result.rows.length > 0) {
    const row = result.rows[0];
    return {
      id: row.id as string,
      users: [row.user1Id as string, row.user2Id as string],
      compatibility: row.compatibility as number,
      createdAt: new Date(row.createdAt as string),
      lastMessage: row.lastMessageContent ? {
        content: row.lastMessageContent as string,
        timestamp: new Date(row.lastMessageTime as string)
      } : undefined,
      unreadCount: row.unreadCount as number
    };
  }
  return null;
};
