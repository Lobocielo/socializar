import { getTursoClient } from './turso';
import { Message } from '../types';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const sendMessage = async (
  matchId: string,
  senderId: string,
  content: string,
  isAI: boolean = false
): Promise<Message | null> => {
  const client = getTursoClient();
  const messageId = generateId();
  const timestamp = new Date().toISOString();

  await client.execute({
    sql: 'INSERT INTO messages (id, matchId, senderId, content, timestamp, isAI, read) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [messageId, matchId, senderId, content, timestamp, isAI ? 1 : 0, 0]
  });

  await client.execute({
    sql: 'UPDATE matches SET lastMessageContent = ?, lastMessageTime = ?, unreadCount = unreadCount + 1 WHERE id = ?',
    args: [content, timestamp, matchId]
  });

  return {
    id: messageId,
    matchId,
    senderId,
    content,
    timestamp: new Date(timestamp),
    isAI,
    read: false
  };
};

export const getMessages = async (matchId: string): Promise<Message[]> => {
  const client = getTursoClient();

  const result = await client.execute({
    sql: 'SELECT * FROM messages WHERE matchId = ? ORDER BY timestamp ASC',
    args: [matchId]
  });

  return result.rows.map(row => ({
    id: row.id as string,
    matchId: row.matchId as string,
    senderId: row.senderId as string,
    content: row.content as string,
    timestamp: new Date(row.timestamp as string),
    isAI: row.isAI === 1,
    read: row.read === 1
  }));
};

export const markMessagesAsRead = async (matchId: string, userId: string): Promise<void> => {
  const client = getTursoClient();

  await client.execute({
    sql: 'UPDATE messages SET read = 1 WHERE matchId = ? AND senderId != ? AND read = 0',
    args: [matchId, userId]
  });

  await client.execute({
    sql: 'UPDATE matches SET unreadCount = 0 WHERE id = ?',
    args: [matchId]
  });
};

export const subscribeToMessages = (
  matchId: string,
  callback: (messages: Message[]) => void
): (() => void) => {
  const interval = setInterval(async () => {
    try {
      const messages = await getMessages(matchId);
      callback(messages);
    } catch (error) {
      console.error('Error polling messages:', error);
    }
  }, 2000);

  getMessages(matchId).then(callback);

  return () => clearInterval(interval);
};
