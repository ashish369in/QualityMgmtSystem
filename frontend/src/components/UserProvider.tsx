import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types/api';

interface UserContextType {
  user: User | null | undefined;
  isLoading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  console.log('UserProvider - Current user:', user);

  const value = {
    user,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
