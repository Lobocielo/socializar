import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { useStore } from '../store/useStore';
import { getUserByEmail } from '../services/auth';

interface AuthContextType {
  firebaseUser: { uid: string; email: string } | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<{ uid: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const setUser = useStore((state) => state.setUser);
  const setIsPremium = useStore((state) => state.setIsPremium);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setFirebaseUser({ uid: user.id, email: user.email });

        getUserByEmail(user.email).then((fullUser) => {
          if (fullUser) {
            setUser(fullUser);
            setIsPremium(fullUser.isPremium);
          }
        });
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, [setUser, setIsPremium]);

  return (
    <AuthContext.Provider value={{ firebaseUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
