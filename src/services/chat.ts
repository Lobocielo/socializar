import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Message } from '../types';

export const sendMessage = async (
  matchId: string,
  senderId: string,
  content: string,
  isAI: boolean = false
): Promise<Message | null> => {
  try {
    const messageData = {
      matchId,
      senderId,
      content,
      timestamp: Timestamp.now(),
      isAI,
      read: false
    };
    
    const docRef = await addDoc(collection(db, 'messages'), messageData);
    
    await updateDoc(doc(db, 'matches', matchId), {
      lastMessage: { id: docRef.id, ...messageData },
      unreadCount: 0
    });
    
    return { id: docRef.id, ...messageData } as Message;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};

export const getMessages = async (matchId: string): Promise<Message[]> => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('matchId', '==', matchId),
      orderBy('timestamp', 'asc')
    );
    
    const snapshot = await getDocs(q);
    const messages: Message[] = [];
    
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as Message);
    });
    
    return messages;
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

export const subscribeToMessages = (
  matchId: string,
  callback: (messages: Message[]) => void
): (() => void) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('matchId', '==', matchId),
    orderBy('timestamp', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as Message);
    });
    callback(messages);
  });
};

export const markMessagesAsRead = async (matchId: string, userId: string): Promise<void> => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('matchId', '==', matchId),
      where('senderId', '!=', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    
    const updatePromises = snapshot.docs.map((doc) => 
      updateDoc(doc.ref, { read: true })
    );
    
    await Promise.all(updatePromises);
    
    await updateDoc(doc(db, 'matches', matchId), {
      unreadCount: 0
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'messages', messageId), {
      content: '[Mensaje eliminado]',
      deleted: true
    });
  } catch (error) {
    console.error('Error deleting message:', error);
  }
};

export const reportMessage = async (
  messageId: string,
  reporterId: string,
  reason: string
): Promise<void> => {
  try {
    await addDoc(collection(db, 'reports'), {
      messageId,
      reporterId,
      reason,
      timestamp: Timestamp.now(),
      status: 'pending'
    });
  } catch (error) {
    console.error('Error reporting message:', error);
  }
};
