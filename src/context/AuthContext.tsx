import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { useStore } from '../store/useStore';
import { getUserProfile } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const setUser = useStore((state) => state.setUser);
  const setIsPremium = useStore((state) => state.setIsPremium);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        getUserProfile(parsed.id).then((fullUser) => {
          if (fullUser) {
            setUserState(fullUser);
            setUser(fullUser);
            setIsPremium(fullUser.isPremium);
          } else {
            localStorage.removeItem('currentUser');
          }
          setLoading(false);
        }).catch(() => {
          setUserState(parsed);
          setUser(parsed);
          setLoading(false);
        });
      } catch {
        localStorage.removeItem('currentUser');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [setUser, setIsPremium]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
