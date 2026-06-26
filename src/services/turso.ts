import { createClient, Client } from '@libsql/client';

let tursoClient: Client | null = null;

export const getTursoClient = (): Client => {
  if (tursoClient) return tursoClient;

  const url = import.meta.env.VITE_TURSO_DATABASE_URL;
  const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('VITE_TURSO_DATABASE_URL no está configurado');
  }

  tursoClient = createClient({
    url,
    authToken: authToken || undefined,
  });

  return tursoClient;
};

export const initDatabase = async (): Promise<void> => {
  const client = getTursoClient();

  try {
    await client.executeMultiple(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        displayName TEXT NOT NULL,
        photoURL TEXT DEFAULT '',
        age INTEGER DEFAULT 18,
        bio TEXT DEFAULT '',
        interests TEXT DEFAULT '[]',
        photos TEXT DEFAULT '[]',
        latitude REAL DEFAULT 0,
        longitude REAL DEFAULT 0,
        gender TEXT DEFAULT 'other',
        lookingFor TEXT DEFAULT 'both',
        isPremium INTEGER DEFAULT 0,
        boostCount INTEGER DEFAULT 3,
        personalityType TEXT DEFAULT '',
        personalityScore INTEGER DEFAULT 0,
        personalityDesc TEXT DEFAULT '',
        lastActive TEXT DEFAULT '',
        createdAt TEXT DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        user1Id TEXT NOT NULL,
        user2Id TEXT NOT NULL,
        compatibility INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT '',
        lastMessageContent TEXT DEFAULT '',
        lastMessageTime TEXT DEFAULT '',
        unreadCount INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        matchId TEXT NOT NULL,
        senderId TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT DEFAULT '',
        isAI INTEGER DEFAULT 0,
        read INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS swipes (
        id TEXT PRIMARY KEY,
        fromUserId TEXT NOT NULL,
        toUserId TEXT NOT NULL,
        liked INTEGER NOT NULL,
        timestamp TEXT DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS daily_likes (
        userId TEXT NOT NULL,
        date TEXT NOT NULL,
        count INTEGER DEFAULT 0,
        PRIMARY KEY (userId, date)
      );
    `);

    console.log('Turso database initialized');
  } catch (error) {
    console.error('Error initializing Turso:', error);
    throw error;
  }
};

export default getTursoClient;
