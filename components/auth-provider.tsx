'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { authService } from '@/lib/auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const user = await authService.signIn(email, password);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return null;
    }
  };

  const signOut = async () => {
    try {
      const success = await authService.signOut();
      if (success) {
        setUser(null);
      }
      return success;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}