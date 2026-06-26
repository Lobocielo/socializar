import { Message } from '../types';

const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substr(2);
const MESSAGES_KEY = 'socializar_messages';
const MATCHES_KEY = 'socializar_matches';

function getStore<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function setStore<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const sendMessage = async (matchId: string, senderId: string, content: string, isAI: boolean = false): Promise<Message | null> => {
  const messages = getStore<any>(MESSAGES_KEY);
  const msg = { id: generateId(), matchId, senderId, content, timestamp: new Date().toISOString(), isAI: isAI ? 1 : 0, read: 0 };
  messages.push(msg);
  setStore(MESSAGES_KEY, messages);

  const matches = getStore<any>(MATCHES_KEY);
  const idx = matches.findIndex(m => m.id === matchId);
  if (idx !== -1) {
    matches[idx].lastMessageContent = content;
    matches[idx].lastMessageTime = new Date().toISOString();
    matches[idx].unreadCount = (matches[idx].unreadCount || 0) + 1;
    setStore(MATCHES_KEY, matches);
  }

  return { id: msg.id, matchId, senderId, content, timestamp: new Date(msg.timestamp), isAI: !!msg.isAI, read: false };
};

export const getMessages = async (matchId: string): Promise<Message[]> => {
  const messages = getStore<any>(MESSAGES_KEY);
  return messages
    .filter(m => m.matchId === matchId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(m => ({ id: m.id, matchId: m.matchId, senderId: m.senderId, content: m.content, timestamp: new Date(m.timestamp), isAI: !!m.isAI, read: !!m.read }));
};

export const markMessagesAsRead = async (matchId: string, _userId: string): Promise<void> => {
  const messages = getStore<any>(MESSAGES_KEY);
  messages.forEach(m => { if (m.matchId === matchId) m.read = 1; });
  setStore(MESSAGES_KEY, messages);

  const matches = getStore<any>(MATCHES_KEY);
  const idx = matches.findIndex(m => m.id === matchId);
  if (idx !== -1) { matches[idx].unreadCount = 0; setStore(MATCHES_KEY, matches); }
};

export const subscribeToMessages = (matchId: string, callback: (messages: Message[]) => void): (() => void) => {
  const interval = setInterval(async () => {
    const messages = await getMessages(matchId);
    callback(messages);
  }, 1000);
  getMessages(matchId).then(callback);
  return () => clearInterval(interval);
};
