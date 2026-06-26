import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChange, getUserProfile } from '../services/auth';
import { User } from '../types';
import { useStore } from '../store/useStore';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const setUser = useStore((state) => state.setUser);
  const setIsPremium = useStore((state) => state.setIsPremium);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setUser(userProfile);
          setIsPremium(userProfile.isPremium);
        }
      } else {
        setUser(null);
        setIsPremium(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setIsPremium]);

  return (
    <AuthContext.Provider value={{ firebaseUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
