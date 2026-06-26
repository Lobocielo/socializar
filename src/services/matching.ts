import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { User, Match, Swipe } from '../types';
import { calculateDistance } from './location';
import { calculateCompatibility } from './ai';

export const getPotentialMatches = async (
  currentUser: User,
  maxDistance: number = 50
): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    
    let q;
    if (currentUser.lookingFor === 'both') {
      q = query(
        usersRef,
        where('id', '!=', currentUser.id),
        limit(50)
      );
    } else {
      q = query(
        usersRef,
        where('id', '!=', currentUser.id),
        where('gender', '==', currentUser.lookingFor),
        limit(50)
      );
    }
    
    const snapshot = await getDocs(q);
    const users: User[] = [];
    
    snapshot.forEach((doc) => {
      const user = doc.data() as User;
      
      if (currentUser.location.latitude && currentUser.location.longitude && 
          user.location.latitude && user.location.longitude) {
        const distance = calculateDistance(
          currentUser.location.latitude,
          currentUser.location.longitude,
          user.location.latitude,
          user.location.longitude
        );
        
        if (distance <= maxDistance) {
          users.push({ ...user, distance } as User & { distance: number });
        }
      } else {
        users.push(user);
      }
    });
    
    const swipesRef = collection(db, 'swipes');
    const swipedQuery = query(
      swipesRef,
      where('fromUserId', '==', currentUser.id)
    );
    const swipedSnapshot = await getDocs(swipedQuery);
    const swipedIds = new Set<string>();
    swipedSnapshot.forEach((doc) => {
      const swipe = doc.data() as Swipe;
      swipedIds.add(swipe.toUserId);
    });
    
    const filteredUsers = users.filter(user => !swipedIds.has(user.id));
    
    const usersWithCompatibility = filteredUsers.map(user => ({
      ...user,
      compatibility: calculateCompatibility(
        currentUser.interests,
        user.interests,
        currentUser.personality,
        user.personality
      )
    }));
    
    usersWithCompatibility.sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0));
    
    return usersWithCompatibility;
  } catch (error) {
    console.error('Error getting potential matches:', error);
    return [];
  }
};

export const swipeUser = async (
  fromUserId: string,
  toUserId: string,
  liked: boolean
): Promise<Match | null> => {
  try {
    const swipeData: Omit<Swipe, 'id'> = {
      fromUserId,
      toUserId,
      liked,
      timestamp: new Date()
    };
    
    await addDoc(collection(db, 'swipes'), swipeData);
    
    if (liked) {
      const reverseSwipeQuery = query(
        collection(db, 'swipes'),
        where('fromUserId', '==', toUserId),
        where('toUserId', '==', fromUserId),
        where('liked', '==', true)
      );
      
      const reverseSwipeSnapshot = await getDocs(reverseSwipeQuery);
      
      if (!reverseSwipeSnapshot.empty) {
        const matchData = {
          users: [fromUserId, toUserId],
          compatibility: Math.floor(Math.random() * 30) + 70,
          createdAt: new Date(),
          unreadCount: 0
        };
        
        const matchRef = await addDoc(collection(db, 'matches'), matchData);
        
        return { id: matchRef.id, ...matchData } as Match;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error swiping user:', error);
    return null;
  }
};

export const getUserMatches = async (userId: string): Promise<Match[]> => {
  try {
    const matchesRef = collection(db, 'matches');
    const q = query(
      matchesRef,
      where('users', 'array-contains', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const matches: Match[] = [];
    
    snapshot.forEach((doc) => {
      matches.push({ id: doc.id, ...doc.data() } as Match);
    });
    
    return matches;
  } catch (error) {
    console.error('Error getting matches:', error);
    return [];
  }
};

export const getMatchById = async (matchId: string): Promise<Match | null> => {
  try {
    const matchDoc = await getDoc(doc(db, 'matches', matchId));
    if (matchDoc.exists()) {
      return { id: matchDoc.id, ...matchDoc.data() } as Match;
    }
    return null;
  } catch (error) {
    console.error('Error getting match:', error);
    return null;
  }
};
