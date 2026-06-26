import { createClient } from '@libsql/client';

const TURSO_URL = import.meta.env.VITE_TURSO_DATABASE_URL || 'file:local.db';
const TURSO_AUTH_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN || '';

export const turso = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN,
});

export const initDatabase = async (): Promise<void> => {
  try {
    await turso.executeMultiple(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        displayName TEXT NOT NULL,
        photoURL TEXT,
        age INTEGER,
        bio TEXT,
        interests TEXT,
        photos TEXT,
        latitude REAL,
        longitude REAL,
        gender TEXT,
        lookingFor TEXT,
        isPremium INTEGER DEFAULT 0,
        boostCount INTEGER DEFAULT 0,
        personality TEXT,
        lastActive TEXT,
        createdAt TEXT
      );

      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        user1Id TEXT NOT NULL,
        user2Id TEXT NOT NULL,
        compatibility INTEGER,
        createdAt TEXT,
        lastMessage TEXT,
        unreadCount INTEGER DEFAULT 0,
        FOREIGN KEY (user1Id) REFERENCES users(id),
        FOREIGN KEY (user2Id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        matchId TEXT NOT NULL,
        senderId TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT,
        isAI INTEGER DEFAULT 0,
        read INTEGER DEFAULT 0,
        FOREIGN KEY (matchId) REFERENCES matches(id),
        FOREIGN KEY (senderId) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS swipes (
        id TEXT PRIMARY KEY,
        fromUserId TEXT NOT NULL,
        toUserId TEXT NOT NULL,
        liked INTEGER NOT NULL,
        timestamp TEXT,
        FOREIGN KEY (fromUserId) REFERENCES users(id),
        FOREIGN KEY (toUserId) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        reporterId TEXT NOT NULL,
        reportedId TEXT NOT NULL,
        reason TEXT,
        description TEXT,
        timestamp TEXT,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY (reporterId) REFERENCES users(id),
        FOREIGN KEY (reportedId) REFERENCES users(id)
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default turso;
